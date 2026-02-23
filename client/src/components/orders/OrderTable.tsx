'use client'

import { motion } from 'framer-motion'
import { Search, AlertCircle, CheckCircle2, Clock, Warehouse, Building2, Truck, ShoppingBag } from 'lucide-react'
import { Medicine } from './types'

interface OrderTableProps {
    med: { [key: number]: Medicine }
    medStage: string[]
}

export const OrderTable = ({ med, medStage }: OrderTableProps) => {
    const getStageDisplay = (stage: string) => {
        if (stage.includes('Sold')) return { icon: CheckCircle2, label: 'Completed', color: 'text-emerald-500', bg: 'bg-emerald-50' }
        if (stage.includes('Ordered')) return { icon: Clock, label: 'Order Initiated', color: 'text-slate-400', bg: 'bg-slate-50' }
        if (stage.includes('Raw Material')) return { icon: Warehouse, label: 'Material Sourced', color: 'text-blue-500', bg: 'bg-blue-50' }
        if (stage.includes('Manufacturing')) return { icon: Building2, label: 'In Production', color: 'text-amber-500', bg: 'bg-amber-50' }
        if (stage.includes('Distribution')) return { icon: Truck, label: 'In Transit', color: 'text-indigo-500', bg: 'bg-indigo-50' }
        if (stage.includes('Retail')) return { icon: ShoppingBag, label: 'At Retail', color: 'text-purple-500', bg: 'bg-purple-50' }
        return { icon: AlertCircle, label: stage, color: 'text-slate-400', bg: 'bg-slate-50' }
    }

    const itemsCount = Object.keys(med).length

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden"
        >
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-white">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center">
                        <Search size={22} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Ordered Medical Supplies</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">{itemsCount} Items Created</p>
                    </div>
                </div>
            </div>

            {itemsCount === 0 ? (
                <div className="p-16 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <AlertCircle size={32} className="text-slate-200" />
                    </div>
                    <h4 className="text-slate-900 font-bold">No Medicines Found</h4>
                    <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">Start the supply chain by creating your first medicine using the form above.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="pl-12 pr-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-24 whitespace-nowrap">ID</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Medicine Name</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Description</th>
                                <th className="pl-8 pr-12 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right whitespace-nowrap">Current Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {Object.keys(med).map((key) => {
                                const idx = parseInt(key)
                                const item = med[idx]
                                const stage = medStage[idx]
                                const status = getStageDisplay(stage)
                                const StatusIcon = status.icon

                                return (
                                    <tr key={key} className="group hover:bg-slate-50 transition-colors">
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
                                            <div className="text-slate-500 font-medium text-sm max-w-[200px] truncate">
                                                {item.description}
                                            </div>
                                        </td>
                                        <td className="pl-8 pr-12 py-8 text-right whitespace-nowrap">
                                            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-100 shadow-sm transition-all ${status.bg}`}>
                                                <StatusIcon size={14} className={status.color} />
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${status.color}`}>{status.label}</span>
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
