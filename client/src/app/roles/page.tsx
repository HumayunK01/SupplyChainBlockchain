'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { loadWeb3, getContract } from '@/lib/web3'
import { checkIsOwner, getContractOwner } from '@/lib/contractUtils'

// Components
import { RoleHeader } from '@/components/roles/RoleHeader'
import { RoleRegistrationForm } from '@/components/roles/RoleRegistrationForm'
import { RoleGroupList } from '@/components/roles/RoleGroupList'

// Types
import { Role, RoleType, RolesState } from '@/components/roles/types'

export default function AssignRoles() {
  const [currentAccount, setCurrentAccount] = useState('')
  const [loading, setLoading] = useState(true)
  const [supplyChain, setSupplyChain] = useState<any>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [contractOwner, setContractOwner] = useState<string>('')
  const [roles, setRoles] = useState<RolesState>({
    rms: [],
    man: [],
    dis: [],
    ret: [],
  })

  const [newRole, setNewRole] = useState({
    address: '',
    name: '',
    place: '',
    type: 'rms' as RoleType,
  })

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

      const [rmsCount, manCount, disCount, retCount] = await Promise.all([
        contract.methods.rmsCtr().call(),
        contract.methods.manCtr().call(),
        contract.methods.disCtr().call(),
        contract.methods.retCtr().call()
      ])

      const [rms, man, dis, ret] = await Promise.all([
        Promise.all(Array.from({ length: parseInt(rmsCount) }, (_, i) => contract.methods.RMS(i + 1).call())),
        Promise.all(Array.from({ length: parseInt(manCount) }, (_, i) => contract.methods.MAN(i + 1).call())),
        Promise.all(Array.from({ length: parseInt(disCount) }, (_, i) => contract.methods.DIS(i + 1).call())),
        Promise.all(Array.from({ length: parseInt(retCount) }, (_, i) => contract.methods.RET(i + 1).call()))
      ])

      setRoles({ rms, man, dis, ret })

      const [ownerStatus, owner] = await Promise.all([
        checkIsOwner(),
        getContractOwner()
      ])

      setIsOwner(ownerStatus)
      if (owner) setContractOwner(owner)

      setLoading(false)
    } catch (err: any) {
      console.error('Error loading blockchain data:', err)
      setLoading(false)
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setNewRole((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const { address, name, place, type } = newRole

    try {
      let method
      switch (type) {
        case 'rms': method = supplyChain.methods.addRMS(address, name, place); break
        case 'man': method = supplyChain.methods.addManufacturer(address, name, place); break
        case 'dis': method = supplyChain.methods.addDistributor(address, name, place); break
        case 'ret': method = supplyChain.methods.addRetailer(address, name, place); break
        default: throw new Error('Invalid role type')
      }

      await method.send({ from: currentAccount })
      await loadBlockchainData()
      setNewRole({ address: '', name: '', place: '', type: 'rms' })
      alert('Participant registered successfully!')
    } catch (err: any) {
      console.error('Transaction error:', err)
      alert(err?.message || 'Transaction failed')
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
        <RoleHeader currentAccount={currentAccount} />

        <div className="flex flex-col gap-12">
          <RoleRegistrationForm
            isOwner={isOwner}
            contractOwner={contractOwner}
            newRole={newRole}
            onInputChange={handleInputChange}
            onRoleTypeSelect={(type) => setNewRole(prev => ({ ...prev, type }))}
            onSubmit={handleRoleSubmit}
          />

          <RoleGroupList roles={roles} />
        </div>
      </div>
    </div>
  )
}
