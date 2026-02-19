'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadWeb3, getContract } from '@/lib/web3'
import { checkIsOwner, getContractOwner } from '@/lib/contractUtils'

// Components
import { OrderHeader } from '@/components/orders/OrderHeader'
import { OrderStats } from '@/components/orders/OrderStats'
import { OrderForm } from '@/components/orders/OrderForm'
import { OrderTable } from '@/components/orders/OrderTable'

// Types
import { Medicine, RoleCounts } from '@/components/orders/types'

export default function AddMed() {
  const router = useRouter()
  const [currentAccount, setCurrentAccount] = useState('')
  const [loading, setLoading] = useState(true)
  const [supplyChain, setSupplyChain] = useState<any>(null)
  const [med, setMed] = useState<{ [key: number]: Medicine }>({})
  const [medName, setMedName] = useState('')
  const [medDes, setMedDes] = useState('')
  const [medStage, setMedStage] = useState<string[]>([])
  const [isOwner, setIsOwner] = useState(false)
  const [contractOwner, setContractOwner] = useState<string>('')
  const [roleCounts, setRoleCounts] = useState<RoleCounts>({
    rms: 0,
    man: 0,
    dis: 0,
    ret: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      const medData: { [key: number]: Medicine } = {}
      const medStageData: string[] = []

      // Parallelize fetching medicine data
      if (parseInt(medCtr) > 0) {
        const fetches = []
        for (let i = 0; i < medCtr; i++) {
          fetches.push(
            Promise.all([
              contract.methods.MedicineStock(i + 1).call(),
              contract.methods.showStage(i + 1).call()
            ])
          )
        }

        const results = await Promise.all(fetches)
        results.forEach(([data, stage], i) => {
          medData[i] = data
          medStageData[i] = stage
        })
      }

      setMed(medData)
      setMedStage(medStageData)

      // Fetch role counts and owner info in parallel
      const [rmsCount, manCount, disCount, retCount, ownerStatus, owner] = await Promise.all([
        contract.methods.rmsCtr().call(),
        contract.methods.manCtr().call(),
        contract.methods.disCtr().call(),
        contract.methods.retCtr().call(),
        checkIsOwner(),
        getContractOwner()
      ])

      setRoleCounts({
        rms: parseInt(rmsCount),
        man: parseInt(manCount),
        dis: parseInt(disCount),
        ret: parseInt(retCount),
      })

      setIsOwner(ownerStatus)
      if (owner) setContractOwner(owner)

      setLoading(false)
    } catch (err: any) {
      console.error('Error loading blockchain data:', err)
      setLoading(false)
    }
  }

  const handlerSubmitMED = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await supplyChain.methods.addMedicine(medName, medDes).send({ from: currentAccount })
      setMedName('')
      setMedDes('')
      await loadBlockchainData()
      alert('Material order created successfully!')
    } catch (err: any) {
      console.error('Transaction error:', err)
      alert(err?.message || 'Transaction failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900" />
      </div>
    )
  }

  const requirementsMet = roleCounts.rms > 0 && roleCounts.man > 0 && roleCounts.dis > 0 && roleCounts.ret > 0

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-manrope relative overflow-hidden">
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage: `linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container mx-auto px-6 pt-24 max-w-6xl relative z-10">
        <OrderHeader currentAccount={currentAccount} />

        <div className="flex flex-col gap-12">
          <OrderStats
            isOwner={isOwner}
            contractOwner={contractOwner}
            roleCounts={roleCounts}
            requirementsMet={requirementsMet}
          />

          <OrderForm
            medName={medName}
            medDes={medDes}
            setMedName={setMedName}
            setMedDes={setMedDes}
            isOwner={isOwner}
            requirementsMet={requirementsMet}
            isSubmitting={isSubmitting}
            onSubmit={handlerSubmitMED}
          />

          <OrderTable
            med={med}
            medStage={medStage}
          />
        </div>
      </div>
    </div>
  )
}
