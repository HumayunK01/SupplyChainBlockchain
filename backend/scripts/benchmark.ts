import { ethers, network } from 'hardhat'
import { MerkleTree } from 'merkletreejs'
import keccak256 from 'keccak256'
import hardhatConfig from '../hardhat.config'

const DEFAULT_BATCH_SIZES = [100, 500, 1000, 5000, 10000]
const DEFAULT_RUNS = 3

function parseEnvList(raw: string | undefined): number[] | null {
  if (!raw) return null
  const parts = raw.split(',').map((s) => s.trim()).filter((s) => s.length > 0)
  const nums = parts.map(Number)
  if (nums.some((n) => !Number.isFinite(n) || n <= 0)) return null
  return nums
}

function parseEnvInt(raw: string | undefined): number | null {
  if (!raw) return null
  const n = Number(raw)
  if (!Number.isInteger(n) || n <= 0) return null
  return n
}

function msSince(start: bigint): number {
  return Number(process.hrtime.bigint() - start) / 1e6
}

function round3(n: number): number {
  return Math.round(n * 1000) / 1000
}

function mean(values: number[]): number {
  if (values.length === 0) return NaN
  return values.reduce((a, b) => a + b, 0) / values.length
}

interface RunResult {
  batchSize: number
  run: number
  merkleGenerationMs: number
  registrationConfirmationMs: number
  registrationGasUsed: string
  effectiveGasPrice: string | null
  verificationMs: number
  invalidVerificationMs: number
  validVerificationPassed: boolean
  invalidVerificationRejected: boolean
  transactionHash: string
  batchId: string
  error?: string
}

async function main() {
  const command = process.argv.slice(2).join(' ')
  const envSizes = process.env.BENCH_SIZES
  const envRuns = process.env.BENCH_RUNS

  const sizes = parseEnvList(envSizes) ?? DEFAULT_BATCH_SIZES
  const runsPerBatch = parseEnvInt(envRuns) ?? DEFAULT_RUNS

  const solidityCfg = hardhatConfig.solidity
  const isMultiSolidity = solidityCfg !== undefined && Array.isArray((solidityCfg as any).compilers)
  const solidityVersion = isMultiSolidity
    ? (solidityCfg as any).compilers[0].version
    : solidityCfg !== undefined
      ? (solidityCfg as any).version
      : 'unknown'
  const optimizerRuns = isMultiSolidity
    ? (solidityCfg as any).compilers[0].settings?.optimizer?.runs ?? null
    : (solidityCfg as any)?.settings?.optimizer?.runs ?? null

  const [deployer, manufacturer] = await ethers.getSigners()
  const provider = ethers.provider
  const chainId = (await provider.getNetwork()).chainId.toString()

  console.log('=== SecureChain Merkle Batch Benchmark ===')
  console.log(`Command: ${envSizes ? `BENCH_SIZES="${envSizes}" ` : ''}${envRuns ? `BENCH_RUNS="${envRuns}" ` : ''}npx hardhat run ${command}`)
  console.log(`Network: ${network.name} (chainId ${chainId})`)
  console.log(`Runs per batch size: ${runsPerBatch}`)
  console.log(`Batch sizes: ${sizes.join(', ')}`)
  console.log(`Solidity: ${solidityVersion} | Optimizer runs: ${optimizerRuns ?? 'N/A'}`)

  console.log('\nDeploying fresh instances of existing contracts (CertificateSBT.sol, SupplyChain.sol)...')
  const CertificateSBT = await ethers.getContractFactory('CertificateSBT')
  const sbt = await CertificateSBT.deploy()
  await sbt.waitForDeployment()
  const sbtAddress = await sbt.getAddress()

  const SupplyChain = await ethers.getContractFactory('SupplyChain')
  const supplyChain = await SupplyChain.deploy(sbtAddress)
  await supplyChain.waitForDeployment()
  const supplyChainAddress = await supplyChain.getAddress()

  console.log(`CertificateSBT:   ${sbtAddress}`)
  console.log(`SupplyChain:      ${supplyChainAddress}`)
  console.log(`Owner (deployer): ${deployer.address}`)
  console.log(`Manufacturer:     ${manufacturer.address}`)

  console.log('\nRegistering benchmark manufacturer (SBT certificate + role)...')
  const mintTx = await sbt.issueCertificate(manufacturer.address, 'ipfs://benchmark-certificate')
  await mintTx.wait()
  const roleTx = await supplyChain.addManufacturer(manufacturer.address, 'Benchmark Manufacturer', 'Local Hardhat')
  await roleTx.wait()
  const supplyChainAsManufacturer = supplyChain.connect(manufacturer)
  console.log('Manufacturer registered.')

  const assumptions = [
    'Fresh instances of the existing CertificateSBT.sol and SupplyChain.sol are deployed by this script; client/src/deployments.json is left untouched.',
    `Leaves and tree are built exactly like the frontend (client/src/app/batch/page.tsx): identifier string "${'${batchName}'}_Item_${'${i}'}", keccak256 hashing, sortPairs: true.`,
    `Identifier format used: BENCH_<batchSize>_Item_<index>, deterministic across runs.`,
    'IPFS CID passed to registerMedicineBatch is an empty string (no Pinata in benchmark); gas cost is unaffected because the string is only stored.',
    'merkleGenerationMs is off-chain CPU time (identifier generation + tree build + root). registrationConfirmationMs is blockchain time from tx submission to receipt. verificationMs is on-chain view-call execution plus RPC round trip.',
    'Gas price is whatever the local node assigns; effectiveGasPrice is read from the transaction receipt.',
    'Contract deployment and manufacturer setup are excluded from all measurements.',
  ]

  const results: { batchSize: number; runs: RunResult[] }[] = []
  const errors: { batchSize: number; run: number; message: string }[] = []

  for (const size of sizes) {
    console.log(`\n--- Batch size: ${size} ---`)
    const batchName = `BENCH_${size}`
    const sizeRuns: RunResult[] = []

    for (let run = 1; run <= runsPerBatch; run++) {
      console.log(`  Run ${run}/${runsPerBatch} ...`)
      const result: RunResult = {
        batchSize: size,
        run,
        merkleGenerationMs: 0,
        registrationConfirmationMs: 0,
        registrationGasUsed: '0',
        effectiveGasPrice: null,
        verificationMs: 0,
        invalidVerificationMs: 0,
        validVerificationPassed: false,
        invalidVerificationRejected: false,
        transactionHash: '',
        batchId: '',
      }

      try {
        const tGenStart = process.hrtime.bigint()
        const identifiers: string[] = []
        const leaves: Buffer[] = []
        for (let i = 0; i < size; i++) {
          const id = `${batchName}_Item_${i}`
          identifiers.push(id)
          leaves.push(keccak256(id))
        }
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
        const root = tree.getHexRoot()
        result.merkleGenerationMs = round3(msSince(tGenStart))

        const tTxStart = process.hrtime.bigint()
        const regTx = await supplyChainAsManufacturer.registerMedicineBatch(root, '')
        const receipt = await regTx.wait()
        if (!receipt) throw new Error('No receipt returned for batch registration')
        result.registrationConfirmationMs = round3(msSince(tTxStart))
        result.registrationGasUsed = receipt.gasUsed.toString()
        const gasPrice = receipt.gasPrice ?? (receipt as any).gasPrice
        result.effectiveGasPrice = gasPrice !== undefined && gasPrice !== null ? gasPrice.toString() : null
        result.transactionHash = receipt.hash

        const batchId = await supplyChain.batchCtr()
        result.batchId = batchId.toString()

        const targetIndex = 0
        const targetLeaf = keccak256(identifiers[targetIndex])
        const targetHexLeaf = '0x' + targetLeaf.toString('hex')
        const validProof = tree.getHexProof(targetLeaf)

        const tVerifyStart = process.hrtime.bigint()
        const validResult = await supplyChain.verifyMedicineInBatch(batchId, targetHexLeaf, validProof)
        result.verificationMs = round3(msSince(tVerifyStart))
        result.validVerificationPassed = validResult === true

        const modifiedId = identifiers[targetIndex] + 'M'
        const modifiedLeaf = keccak256(modifiedId)
        const modifiedHexLeaf = '0x' + modifiedLeaf.toString('hex')
        const otherIndex = targetIndex + 1
        const wrongProof = tree.getHexProof(keccak256(identifiers[otherIndex]))

        const tInvalidStart = process.hrtime.bigint()
        const invalidResult = await supplyChain.verifyMedicineInBatch(batchId, modifiedHexLeaf, wrongProof)
        result.invalidVerificationMs = round3(msSince(tInvalidStart))
        result.invalidVerificationRejected = invalidResult === false

        console.log(
          `    merkle ${result.merkleGenerationMs} ms | confirm ${result.registrationConfirmationMs} ms | gas ${result.registrationGasUsed} | ` +
          `verify ${result.verificationMs} ms (valid=${result.validVerificationPassed}, invalid rejected=${result.invalidVerificationRejected}) | tx ${result.transactionHash.slice(0, 18)}...`
        )
      } catch (err: any) {
        result.error = err?.message ?? String(err)
        errors.push({ batchSize: size, run, message: result.error ?? String(err) })
        console.log(`    ERROR: ${result.error}`)
      }

      sizeRuns.push(result)
    }

    results.push({ batchSize: size, runs: sizeRuns })
  }

  console.log('\n\n=== RESULTS TABLE ===')
  const header = ['Batch Size', 'Run', 'Merkle Gen (ms)', 'Confirm (ms)', 'Gas Used', 'Gas Price (gwei)', 'Verify (ms)', 'Valid OK', 'Invalid Rejected']
  const rows: string[][] = []
  for (const group of results) {
    for (const r of group.runs) {
      const gasPriceGwei = r.effectiveGasPrice !== null ? (Number(r.effectiveGasPrice) / 1e9).toFixed(3) : 'N/A'
      rows.push([
        String(group.batchSize),
        String(r.run),
        String(r.merkleGenerationMs),
        String(r.registrationConfirmationMs),
        r.registrationGasUsed,
        gasPriceGwei,
        String(r.verificationMs),
        r.validVerificationPassed ? 'true' : 'false',
        r.invalidVerificationRejected ? 'true' : 'false',
      ])
    }
  }
  const widths = header.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i].length)))
  const fmtRow = (cells: string[]) => cells.map((c, i) => c.padEnd(widths[i])).join(' | ')
  console.log(fmtRow(header))
  console.log(widths.map((w) => '-'.repeat(w)).join('-+-'))
  for (const r of rows) console.log(fmtRow(r))

  console.log('\n\n=== SUMMARY (mean / min / max) ===')
  const summaryHeader = ['Batch Size', 'Merkle Gen (ms)', 'Confirm (ms)', 'Gas Used', 'Verify (ms)']
  const summaryRows: string[][] = []
  for (const group of results) {
    const valid = group.runs.filter((r) => !r.error)
    const merkle = valid.map((r) => r.merkleGenerationMs)
    const confirm = valid.map((r) => r.registrationConfirmationMs)
    const gas = valid.map((r) => Number(r.registrationGasUsed))
    const verify = valid.map((r) => r.verificationMs)
    const stat = (arr: number[]) => arr.length > 0
      ? `${round3(mean(arr))} / ${round3(Math.min(...arr))} / ${round3(Math.max(...arr))}`
      : 'skipped'
    summaryRows.push([String(group.batchSize), stat(merkle), stat(confirm), stat(gas), stat(verify)])
  }
  const summaryWidths = summaryHeader.map((h, i) => Math.max(h.length, ...summaryRows.map((r) => r[i].length)))
  const fmtSummary = (cells: string[]) => cells.map((c, i) => c.padEnd(summaryWidths[i])).join(' | ')
  console.log(fmtSummary(summaryHeader))
  console.log(summaryWidths.map((w) => '-'.repeat(w)).join('-+-'))
  for (const r of summaryRows) console.log(fmtSummary(r))

  const jsonResults = results.map((group) => {
    const valid = group.runs.filter((r) => !r.error)
    const stat = (key: 'merkleGenerationMs' | 'registrationConfirmationMs' | 'verificationMs') => {
      const values = valid.map((r) => r[key])
      return values.length > 0
        ? { mean: round3(mean(values)), min: round3(Math.min(...values)), max: round3(Math.max(...values)) }
        : { mean: null, min: null, max: null }
    }
    const gasValues = valid.map((r) => Number(r.registrationGasUsed))
    return {
      batchSize: group.batchSize,
      runs: group.runs.map((r) => ({
        merkleGenerationMs: r.merkleGenerationMs,
        registrationConfirmationMs: r.registrationConfirmationMs,
        registrationGasUsed: r.registrationGasUsed,
        effectiveGasPrice: r.effectiveGasPrice,
        verificationMs: r.verificationMs,
        invalidVerificationMs: r.invalidVerificationMs,
        validVerificationPassed: r.validVerificationPassed,
        invalidVerificationRejected: r.invalidVerificationRejected,
        transactionHash: r.transactionHash,
        ...(r.error ? { error: r.error } : {}),
      })),
      summary: {
        merkleGenerationMs: stat('merkleGenerationMs'),
        registrationConfirmationMs: stat('registrationConfirmationMs'),
        registrationGasUsed: gasValues.length > 0
          ? { mean: round3(mean(gasValues)), min: round3(Math.min(...gasValues)), max: round3(Math.max(...gasValues)) }
          : { mean: null, min: null, max: null },
        verificationMs: stat('verificationMs'),
      },
    }
  })

  const output = {
    environment: {
      network: network.name,
      chainId,
      solidityVersion,
      optimizerRuns,
      supplyChainAddress,
      certificateSBTAddress: sbtAddress,
      manufacturerAddress: manufacturer.address,
      runsPerBatch,
    },
    results: jsonResults,
    errors,
  }

  console.log('\n\n=== MACHINE-READABLE JSON ===')
  console.log('=== BENCHMARK_RESULTS_JSON_START ===')
  console.log(JSON.stringify(output, null, 2))
  console.log('=== BENCHMARK_RESULTS_JSON_END ===')

  console.log('\n=== NOTES ===')
  console.log('Assumptions:')
  for (const a of assumptions) console.log(`  - ${a}`)
  console.log(`Errors/skipped measurements: ${errors.length === 0 ? 'none' : ''}`)
  for (const e of errors) console.log(`  - batchSize ${e.batchSize} run ${e.run}: ${e.message}`)
  console.log('No throughput computed; measurements are single-tx observations.')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
