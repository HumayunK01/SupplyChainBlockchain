'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadWeb3, getContract } from '@/lib/web3'
import { motion } from 'framer-motion'

// Components
import { SupplyHeader } from '@/components/supply/SupplyHeader'
import { SupplyFlowViz } from '@/components/supply/SupplyFlowViz'
import { SupplyTable } from '@/components/supply/SupplyTable'
import { SupplyControl } from '@/components/supply/SupplyControl'

// Types
import { Medicine } from '@/components/supply/types'

export default function Supply() {
  const router = useRouter()
  const [currentAccount, setCurrentAccount] = useState('')
  const [loading, setLoading] = useState(true)
  const [supplyChain, setSupplyChain] = useState<any>(null)
  const [med, setMed] = useState<{ [key: number]: Medicine }>({})
  const [medStage, setMedStage] = useState<string[]>([])

  // Input states
  const [rmsId, setRmsId] = useState('')
  const [manId, setManId] = useState('')
  const [disId, setDisId] = useState('')
  const [retId, setRetId] = useState('')
  const [soldId, setSoldId] = useState('')

  useEffect(() => {
    const init = async () => {
      await loadWeb3()
      await loadBlockchainData()
    }
    init()
  }, [])

  const loadBlockchainData = async () => {
    try {
      setLoading(true)
      const { contract, account } = await getContract()
      setSupplyChain(contract)
      setCurrentAccount(account)

      const medCtr = await contract.methods.medicineCtr().call()

      if (parseInt(medCtr) > 0) {
        const medFetches = []
        for (let i = 0; i < medCtr; i++) {
          medFetches.push(
            Promise.all([
              contract.methods.MedicineStock(i + 1).call(),
              contract.methods.showStage(i + 1).call()
            ])
          )
        }

        const results = await Promise.all(medFetches)
        const medData: { [key: number]: Medicine } = {}
        const medStageData: string[] = []

        results.forEach(([data, stage], i) => {
          medData[i] = data
          medStageData[i] = stage
        })

        setMed(medData)
        setMedStage(medStageData)
      }

      setLoading(false)
    } catch (err: any) {
      console.error('Error loading blockchain data:', err)
      setLoading(false)
    }
  }

  const handleAction = async (action: string, id: string, successMsg: string, setInput: (v: string) => void) => {
    try {
      if (!id) return

      let method
      switch (action) {
        case 'RMS': method = supplyChain.methods.RMSsupply(id); break;
        case 'MAN': method = supplyChain.methods.Manufacturing(id); break;
        case 'DIS': method = supplyChain.methods.Distribute(id); break;
        case 'RET': method = supplyChain.methods.Retail(id); break;
        case 'SOLD': method = supplyChain.methods.sold(id); break;
        default: return
      }

      await method.send({ from: currentAccount })
      alert(successMsg)
      setInput('')
      loadBlockchainData()
    } catch (err: any) {
      alert(err.message || 'Transaction failed')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-manrope relative overflow-hidden text-slate-900">
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage: `linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container mx-auto px-6 pt-24 max-w-6xl relative z-10">
        <SupplyHeader currentAccount={currentAccount} />

        <SupplyFlowViz />

        <div className="mb-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900/5 text-slate-900 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </motion.div>
            </div>
            Operational Terminals
          </h3>
          <SupplyControl
            rmsId={rmsId} manId={manId} disId={disId} retId={retId} soldId={soldId}
            onRMSChange={setRmsId} onManChange={setManId} onDisChange={setDisId} onRetChange={setRetId} onSoldChange={setSoldId}
            onRMSSubmit={(e) => { e.preventDefault(); handleAction('RMS', rmsId, 'RMS Supply Verified', setRmsId) }}
            onManSubmit={(e) => { e.preventDefault(); handleAction('MAN', manId, 'Manufacturing Verified', setManId) }}
            onDisSubmit={(e) => { e.preventDefault(); handleAction('DIS', disId, 'Distribution Verified', setDisId) }}
            onRetSubmit={(e) => { e.preventDefault(); handleAction('RET', retId, 'Retail Integration Verified', setRetId) }}
            onSoldSubmit={(e) => { e.preventDefault(); handleAction('SOLD', soldId, 'Asset Transfer Finalized', setSoldId) }}
          />
        </div>

        <SupplyTable med={med} medStage={medStage} />
      </div>
    </div>
  )
}
