import { ethers } from 'hardhat'
import * as fs from 'fs'
import * as path from 'path'

async function main() {
  console.log('Deploying SupplyChain contract...')

  const [deployer] = await ethers.getSigners()
  console.log('Deploying with account:', deployer.address)

  const balance = await ethers.provider.getBalance(deployer.address)
  console.log('Account balance:', ethers.formatEther(balance), 'ETH')

  if (balance === 0n) {
    throw new Error('Account has no funds. Please fund the account or use a different account.')
  }

  console.log('Deploying CertificateSBT contract...')
  const CertificateSBT = await ethers.getContractFactory('CertificateSBT')
  const sbt = await CertificateSBT.deploy()
  await sbt.waitForDeployment()
  const sbtAddress = await sbt.getAddress()

  console.log('Deploying SupplyChain contract...')
  const SupplyChain = await ethers.getContractFactory('SupplyChain')
  const supplyChain = await SupplyChain.deploy(sbtAddress)
  await supplyChain.waitForDeployment()
  const supplyChainAddress = await supplyChain.getAddress()

  const network = await ethers.provider.getNetwork()
  const chainId = network.chainId.toString()

  console.log('SupplyChain deployed to:', supplyChainAddress)
  console.log('CertificateSBT deployed to:', sbtAddress)
  console.log('Network chain ID:', chainId)

  // Update deployments.json
  const deploymentsPath = path.join(__dirname, '../../client/src/deployments.json')
  const deployments = JSON.parse(fs.readFileSync(deploymentsPath, 'utf8'))

  if (!deployments.networks[chainId]) {
    deployments.networks[chainId] = {}
  }

  deployments.networks[chainId].SupplyChain = {
    address: supplyChainAddress,
  }

  deployments.networks[chainId].CertificateSBT = {
    address: sbtAddress,
  }

  fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2))
  console.log('Deployment info saved to client/src/deployments.json')


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

