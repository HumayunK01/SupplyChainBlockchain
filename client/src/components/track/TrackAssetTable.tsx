'use client'

import { motion } from 'framer-motion'
import { Package, ArrowRight, Table, Search } from 'lucide-react'
import { Medicine } from './types'

interface TrackAssetTableProps {
    med: { [key: number]: Medicine }
    medStage: { [key: number]: string }
    onSelect: (id: number) => void
}

export const TrackAssetTable = ({ med, medStage, onSelect }: TrackAssetTableProps) => {
    const getStageColor = (stage: string) => {
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
            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden"
        >
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center">
                        <Table size={22} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Available Medicines</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">{itemsCount} Medicines Currently Tracking</p>
                    </div>
                </div>
            </div>

            {itemsCount === 0 ? (
                <div className="p-16 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <Search size={32} className="text-slate-200" />
                    </div>
                    <h4 className="text-slate-900 font-bold">No Medicines to Track</h4>
                    <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">Once medicines are registered on-chain, you can select any item here to view its full supply chain journey.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="pl-12 pr-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-24 whitespace-nowrap">ID</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Medicine Name</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Current Status</th>
                                <th className="pl-8 pr-12 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right whitespace-nowrap">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {Object.keys(med).map((key) => {
                                const medicineId = parseInt(key)
                                const item = med[medicineId]
                                const stage = medStage[medicineId]
                                const stageStyles = getStageColor(stage)

                                return (
                                    <tr
                                        key={key}
                                        className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                                        onClick={() => onSelect(medicineId)}
                                    >
                                        <td className="pl-12 pr-4 py-8 whitespace-nowrap">
                                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-slate-900/10 active:scale-95 transition-transform">
                                                {item.id}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 whitespace-nowrap">
                                            <div className="font-bold text-slate-900 text-base leading-tight">{item.name}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Supply Chain Item</div>
                                        </td>
                                        <td className="px-8 py-8 whitespace-nowrap">
                                            <div className={`inline-flex px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-widest ${stageStyles}`}>
                                                {stage}
                                            </div>
                                        </td>
                                        <td className="pl-8 pr-12 py-8 text-right whitespace-nowrap">
                                            <div className="inline-flex items-center gap-2">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">View History</span>
                                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-slate-900 group-hover:text-slate-900 group-hover:shadow-xl group-hover:shadow-slate-900/5 transition-all">
                                                    <ArrowRight size={18} />
                                                </div>
                                            </div>
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
