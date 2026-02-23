'use client'

import { motion } from 'framer-motion'
import { Package, FileText, Plus, ShieldCheck } from 'lucide-react'

interface OrderFormProps {
    medName: string
    medDes: string
    setMedName: (val: string) => void
    setMedDes: (val: string) => void
    isOwner: boolean
    requirementsMet: boolean
    isSubmitting: boolean
    onSubmit: (e: React.FormEvent) => void
}

export const OrderForm = ({
    medName,
    medDes,
    setMedName,
    setMedDes,
    isOwner,
    requirementsMet,
    isSubmitting,
    onSubmit
}: OrderFormProps) => {
    const isDisabled = !isOwner || !requirementsMet || isSubmitting

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 relative overflow-hidden"
        >
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                }}
            />

            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                        <Package size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Create New Medicine</h2>
                        <p className="text-slate-500 text-sm">Add a new medical product to the tracking system</p>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Medicine Name</label>
                        <div className="relative">
                            <Package size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-slate-900 font-semibold focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all placeholder:text-slate-300"
                                type="text"
                                placeholder="e.g. Aspirin 500mg"
                                onChange={(e) => setMedName(e.target.value)}
                                value={medName}
                                required
                                disabled={isDisabled}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Description</label>
                        <div className="relative">
                            <FileText size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-slate-900 font-semibold focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all placeholder:text-slate-300"
                                type="text"
                                placeholder="e.g. Batch of 100 boxes"
                                onChange={(e) => setMedDes(e.target.value)}
                                value={medDes}
                                required
                                disabled={isDisabled}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isDisabled}
                        className={`w-full py-4 mt-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group md:col-span-2 ${!isDisabled
                            ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10 active:scale-95 hover:bg-slate-800'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                            }`}
                    >
                        {isSubmitting ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        ) : isOwner && requirementsMet ? (
                            <>
                                <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                                <span>Add Medicine to System</span>
                            </>
                        ) : (
                            <>
                                <ShieldCheck size={20} />
                                <span>System Locked</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </motion.div>
    )
}
