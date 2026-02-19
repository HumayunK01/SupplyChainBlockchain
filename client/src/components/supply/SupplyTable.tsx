'use client'

import { motion } from 'framer-motion'
import { Hash, Table, Tag } from 'lucide-react'
import { Medicine } from './types'

interface SupplyTableProps {
    med: { [key: number]: Medicine }
    medStage: string[]
}

export const SupplyTable = ({ med, medStage }: SupplyTableProps) => {
    const getStageStyles = (stage: string) => {
        if (stage.includes('Ordered')) return 'text-slate-400 bg-slate-50'
        if (stage.includes('Raw Material')) return 'text-blue-500 bg-blue-50'
        if (stage.includes('Manufacturing')) return 'text-amber-500 bg-amber-50'
        if (stage.includes('Distribution')) return 'text-indigo-500 bg-indigo-50'
        if (stage.includes('Retail')) return 'text-purple-500 bg-purple-50'
        if (stage.includes('Sold')) return 'text-emerald-500 bg-emerald-50'
        return 'text-slate-400 bg-slate-50'
    }

    const itemsCount = Object.keys(med).length

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden mb-12"
        >
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center">
                        <Table size={22} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Active Ledger Units</h3>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">{itemsCount} Registered Entities</p>
                    </div>
                </div>
            </div>

            {itemsCount === 0 ? (
                <div className="p-16 text-center">
                    <p className="text-slate-400 font-medium">No active units detected on the protocol.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="pl-12 pr-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-24 whitespace-nowrap">Asset ID</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Designation</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Specifications</th>
                                <th className="pl-8 pr-12 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right whitespace-nowrap">Protocol State</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {Object.keys(med).map((key) => {
                                const index = parseInt(key)
                                const item = med[index]
                                const stage = medStage[index]
                                const stageStyles = getStageStyles(stage)

                                return (
                                    <tr key={key} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="pl-12 pr-4 py-8 whitespace-nowrap">
                                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-slate-900/10">
                                                {item.id}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 whitespace-nowrap">
                                            <div className="font-bold text-slate-900 text-base leading-tight">{item.name}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Class {item.id} Unit</div>
                                        </td>
                                        <td className="px-8 py-8 whitespace-nowrap">
                                            <p className="text-sm font-medium text-slate-500 max-w-[200px] truncate">{item.description}</p>
                                        </td>
                                        <td className="pl-8 pr-12 py-8 text-right whitespace-nowrap">
                                            <span className={`inline-flex px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-transparent transition-all shadow-sm ${stageStyles}`}>
                                                {stage}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </motion.div>
    )
}
