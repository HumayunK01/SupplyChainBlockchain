'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadWeb3, getContract } from '@/lib/web3'

// Components
import { TrackHeader } from '@/components/track/TrackHeader'
import { TrackSearch } from '@/components/track/TrackSearch'
import { TrackAssetTable } from '@/components/track/TrackAssetTable'
import { TrackJourney } from '@/components/track/TrackJourney'
import SkeletonLoader from '@/components/SkeletonLoader'

// Types
import { Medicine, Role } from '@/components/track/types'

export default function Track() {
  const router = useRouter()
  const [currentAccount, setCurrentAccount] = useState('')
  const [loading, setLoading] = useState(true)
  const [supplyChain, setSupplyChain] = useState<any>(null)
  const [med, setMed] = useState<{ [key: number]: Medicine }>({})
  const [medStage, setMedStage] = useState<{ [key: number]: string }>({})
  const [id, setId] = useState('')
  const [rms, setRMS] = useState<{ [key: number]: Role }>({})
  const [man, setMAN] = useState<{ [key: number]: Role }>({})
  const [dis, setDIS] = useState<{ [key: number]: Role }>({})
  const [ret, setRET] = useState<{ [key: number]: Role }>({})

  const [activeTrackingId, setActiveTrackingId] = useState<number | null>(null)

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

      const [medCtr, rmsCtr, manCtr, disCtr, retCtr] = await Promise.all([
        contract.methods.medicineCtr().call(),
        contract.methods.rmsCtr().call(),
        contract.methods.manCtr().call(),
        contract.methods.disCtr().call(),
        contract.methods.retCtr().call()
      ])

      // Parallelize fetching all role data
      const [rmsDataRaw, manDataRaw, disDataRaw, retDataRaw] = await Promise.all([
        Promise.all(Array.from({ length: parseInt(rmsCtr) }, (_, i) => contract.methods.RMS(i + 1).call())),
        Promise.all(Array.from({ length: parseInt(manCtr) }, (_, i) => contract.methods.MAN(i + 1).call())),
        Promise.all(Array.from({ length: parseInt(disCtr) }, (_, i) => contract.methods.DIS(i + 1).call())),
        Promise.all(Array.from({ length: parseInt(retCtr) }, (_, i) => contract.methods.RET(i + 1).call()))
      ])

      const rmsMap: { [key: number]: Role } = {}
      const manMap: { [key: number]: Role } = {}
      const disMap: { [key: number]: Role } = {}
      const retMap: { [key: number]: Role } = {}

      rmsDataRaw.forEach((data, i) => rmsMap[i + 1] = data)
      manDataRaw.forEach((data, i) => manMap[i + 1] = data)
      disDataRaw.forEach((data, i) => disMap[i + 1] = data)
      retDataRaw.forEach((data, i) => retMap[i + 1] = data)

      setRMS(rmsMap)
      setMAN(manMap)
      setDIS(disMap)
      setRET(retMap)

      // Fetch limited medicine data for the table
      const medData: { [key: number]: Medicine } = {}
      const medStageMap: { [key: number]: string } = {}

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
        results.forEach(([data, stage], i) => {
          medData[i + 1] = data
          medStageMap[i + 1] = stage
        })
      }

      setMed(medData)
      setMedStage(medStageMap)
      setLoading(false)
    } catch (err: any) {
      console.error('Error loading blockchain data:', err)
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const targetId = parseInt(id)
    if (isNaN(targetId) || !med[targetId]) {
      alert('Invalid Medicine ID')
      return
    }
    setActiveTrackingId(targetId)
  }

  const handleSelectAsset = (assetId: number) => {
    setActiveTrackingId(assetId)
    setId(assetId.toString())
  }

  if (loading) {
    return <SkeletonLoader />
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
        <TrackHeader currentAccount={currentAccount} />

        {activeTrackingId ? (
          <TrackJourney
            medicineId={activeTrackingId}
            med={med[activeTrackingId]}
            medStage={medStage[activeTrackingId]}
            rms={rms[parseInt(med[activeTrackingId].RMSid)]}
            man={man[parseInt(med[activeTrackingId].MANid)]}
            dis={dis[parseInt(med[activeTrackingId].DISid)]}
            ret={ret[parseInt(med[activeTrackingId].RETid)]}
            onBack={() => setActiveTrackingId(null)}
          />
        ) : (
          <div className="flex flex-col gap-12">
            <TrackSearch
              id={id}
              setId={setId}
              onSubmit={handleSearch}
            />

            <TrackAssetTable
              med={med}
              medStage={medStage}
              onSelect={handleSelectAsset}
            />
          </div>
        )}
      </div>
    </div>
  )
}
