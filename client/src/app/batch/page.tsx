'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { loadWeb3, getContract } from '@/lib/web3'
import { MerkleTree } from 'merkletreejs'
import keccak256 from 'keccak256'
import { Database, ShieldCheck, Zap, Activity } from 'lucide-react'

export default function BatchMinting() {
    const [currentAccount, setCurrentAccount] = useState('')
    const [supplyChain, setSupplyChain] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // Merkle State
    const [merkleTree, setMerkleTree] = useState<MerkleTree | null>(null)
    const [merkleRoot, setMerkleRoot] = useState<string>('')
    const [isMinting, setIsMinting] = useState(false)
    const [batchName, setBatchName] = useState('')
    const [batchQty, setBatchQty] = useState<number | ''>('')
    const [verifyName, setVerifyName] = useState('')
    const [verifyId, setVerifyId] = useState<string>('')
    const [verificationResult, setVerificationResult] = useState<string>('')

    useEffect(() => {
        const init = async () => {
            await loadWeb3()
            await loadBlockchainData()
        }
        init()

        // Restore Merkle state from localStorage so verification can persist after reload
        try {
            const savedBatchName = localStorage.getItem('vbulk_batchName')
            const savedBatchQty = localStorage.getItem('vbulk_batchQty')
            if (savedBatchName && savedBatchQty) {
                const qty = Number(savedBatchQty)
                if (qty > 0) {
                    setBatchName(savedBatchName)
                    setBatchQty(qty)

                    const leaves = []
                    for (let i = 0; i < qty; i++) {
                        const data = `${savedBatchName}_Item_${i}`
                        leaves.push(keccak256(data))
                    }

                    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
                    const root = tree.getHexRoot()

                    setMerkleTree(tree)
                    setMerkleRoot(root)
                }
            }
        } catch (e) {
            console.error("Failed to restore batch from local storage", e)
        }
    }, [])

    const loadBlockchainData = async () => {
        try {
            const { contract, account } = await getContract()
            setSupplyChain(contract)
            setCurrentAccount(account)
            setLoading(false)
        } catch (err) {
            console.error(err)
            setLoading(false)
        }
    }

    // 1. Generate Off-Chain Tree
    const handleGenerateTree = () => {
        const qty = Number(batchQty)
        if (!qty || qty <= 0) return;

        const leaves = []
        console.log(`Generating ${qty} hashes for ${batchName}...`)

        for (let i = 0; i < qty; i++) {
            // Using the dynamic name and index to create unique data strings
            const data = `${batchName}_Item_${i}`
            leaves.push(keccak256(data))
        }

        // Construct the Merkle Tree
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
        const root = tree.getHexRoot()

        setMerkleTree(tree)
        setMerkleRoot(root)

        try {
            localStorage.setItem('vbulk_batchName', batchName)
            localStorage.setItem('vbulk_batchQty', qty.toString())
        } catch (e) {
            console.error("Failed to save batch to local storage", e)
        }
    }

    // 2. Upload Root to Blockchain
    const handleRegisterBatch = async () => {
        if (!supplyChain || !merkleRoot) return
        setIsMinting(true)
        try {
            await supplyChain.methods.registerMedicineBatch(merkleRoot).send({ from: currentAccount })
            alert(`Success! Recorded batch of ${batchQty} '${batchName}' to the network using the secure watermark mechanism.`)
        } catch (err: any) {
            alert(err.message || "Failed to register batch")
        }
        setIsMinting(false)
    }

    // 3. Verify specific item mathematically
    const handleVerify = async () => {
        if (!supplyChain || !merkleTree) return
        try {
            // Pick dynamic item to verify based on user input
            const itemToVerify = Math.floor(Number(verifyId))
            // Must strictly match the string format used during generation
            const data = `${verifyName}_Item_${itemToVerify}`
            const leaf = keccak256(data)
            const hexLeaf = '0x' + leaf.toString('hex')
            const proof = merkleTree.getHexProof(leaf)

            // Fetch latest batch ID for dynamic verification 
            const currentBatchId = await supplyChain.methods.batchCtr().call()

            // Call mapping verify directly
            const isValid = await supplyChain.methods.verifyMedicineInBatch(currentBatchId, hexLeaf, proof).call()

            setVerificationResult(isValid ? "✅ TRUE - Zero Knowledge Crypto-Proof Validated!" : "❌ FALSE - Integrity Check Failed")
        } catch (err: any) {
            console.error(err)
            setVerificationResult("Error verifying")
        }
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="min-h-screen bg-slate-50/50 pt-32 pb-20 font-manrope">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4 flex items-center gap-3">
                        <Database className="text-blue-500" size={36} />
                        Bulk Medicine Registration
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl">
                        Instantly secure thousands of medical items at once. Instead of paying fees to track every single pill, this tool bundles them into one secure digital &quot;watermark&quot;. This makes mass-production tracking incredibly cheap and perfectly secure.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Step 1 & 2 */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Zap className="text-amber-500" /> Step 1: Create Digital Watermark</h2>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2 block">Medicine Name</label>
                                <input
                                    type="text"
                                    value={batchName}
                                    onChange={(e) => setBatchName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold text-sm focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2 block">Batch Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10000"
                                    value={batchQty}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        if (val > 10000) setBatchQty(10000);
                                        else if (e.target.value === '') setBatchQty('');
                                        else setBatchQty(val);
                                    }}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-mono text-sm focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                                    placeholder="Max: 10,000"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleGenerateTree}
                            disabled={!batchName || !batchQty}
                            className={`w-full rounded-xl py-4 font-bold transition-colors mb-6 ${(!batchName || !batchQty) ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                        >
                            Generate {batchQty ? batchQty.toLocaleString() : '0'} ID Codes
                        </button>

                        {merkleRoot && (
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                                <p className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2">Unique Batch Watermark</p>
                                <p className="font-mono text-sm break-all text-slate-700 font-semibold">{merkleRoot}</p>
                                <div className="text-xs text-amber-600 mt-2 bg-amber-50 px-3 py-2 rounded-lg font-medium inline-block relative border border-amber-100">
                                    Compressed {batchQty ? batchQty.toLocaleString() : '0'} items into 1 secured code
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleRegisterBatch}
                            disabled={!merkleRoot || isMinting}
                            className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                ${(!merkleRoot || isMinting) ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/20'}`}
                        >
                            <Database size={18} />
                            {isMinting ? "Saving to System..." : "Save Watermark to Network"}
                        </button>
                    </motion.div>

                    {/* Step 3 */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><ShieldCheck className="text-emerald-500" /> Step 2: Instant Authenticator</h2>
                        <p className="text-slate-500 mb-6 text-sm">
                            Any pharmacy or customer can scan their individual medicine. Our system instantly checks if it perfectly matches the original watermark created by the manufacturer.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2 block">Medicine Name</label>
                                <input
                                    type="text"
                                    value={verifyName}
                                    onChange={(e) => setVerifyName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold text-sm focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                                    placeholder="e.g. Aspirin 500mg"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2 block">Medicine ID</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={verifyId}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        const maxId = batchQty ? Number(batchQty) - 1 : 9999;
                                        if (val > maxId) setVerifyId(maxId.toString());
                                        else setVerifyId(e.target.value);
                                    }}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-mono text-sm focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                                    placeholder={`Max: ${batchQty ? Number(batchQty) - 1 : '9999'}`}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleVerify}
                            disabled={!merkleRoot || !verifyId || !verifyName}
                            className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mb-6
                ${(!merkleRoot || !verifyId || !verifyName) ? 'bg-slate-100 text-slate-400' : 'border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'}`}
                        >
                            <Activity size={18} />
                            Verify This Product
                        </button>

                        {verificationResult && (
                            <div className={`p-4 rounded-xl font-mono text-sm font-bold border ${verificationResult.includes('TRUE') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                {verificationResult.includes('TRUE') ? '✅ Authentic: Product perfectly matches the manufacturer record.' : '❌ Warning: Product could not be verified in the network.'}
                            </div>
                        )}
                    </motion.div>

                </div>
            </div>
        </div>
    )
}
