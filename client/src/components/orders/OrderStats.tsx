'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, AlertCircle } from 'lucide-react'
import { RoleCounts } from './types'

interface OrderStatsProps {
    isOwner: boolean
    contractOwner: string
    roleCounts: RoleCounts
    requirementsMet: boolean
}

export const OrderStats = ({ isOwner, contractOwner, roleCounts, requirementsMet }: OrderStatsProps) => {
    return (
        <div className="space-y-6">
            <AnimatePresence>
                {!isOwner && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-50 border border-red-100 rounded-3xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-red-500 shadow-sm border border-red-100">
                                <ShieldCheck size={20} />
                            </div>
                            <h3 className="font-bold text-red-900">Privileged Action Required</h3>
                        </div>
                        <p className="text-red-700/80 text-sm leading-relaxed mb-4">
                            Only the contract supervisor is authorized to initiate new material orders on this protocol.
                        </p>
                        <div className="p-3 bg-white/50 rounded-xl border border-red-100">
                            <div className="text-[10px] uppercase font-bold text-red-400 tracking-widest mb-1">Target Authority</div>
                            <div className="text-xs font-mono text-red-900 break-all">{contractOwner}</div>
                        </div>
                    </motion.div>
                )}

                {isOwner && !requirementsMet && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-amber-50 border border-amber-100 rounded-3xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-amber-500 shadow-sm border border-amber-100">
                                <AlertCircle size={20} />
                            </div>
                            <h3 className="font-bold text-amber-900">Network Under-provisioned</h3>
                        </div>
                        <p className="text-amber-700/80 text-sm mb-6">
                            A minimum of one participant must be registered for each role type to maintain chain integrity.
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Supplier', count: roleCounts.rms },
                                { label: 'Factory', count: roleCounts.man },
                                { label: 'Logistics', count: roleCounts.dis },
                                { label: 'Retail', count: roleCounts.ret }
                            ].map((role) => (
                                <div key={role.label} className={`p-3.5 rounded-2xl border shadow-sm flex items-center justify-between ${role.count > 0 ? 'bg-white border-emerald-100' : 'bg-white border-red-100'}`}>
                                    <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider font-manrope">{role.label}</span>
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold ${role.count > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                                        {role.count}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
