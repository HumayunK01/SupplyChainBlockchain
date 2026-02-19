'use client'

import { motion } from 'framer-motion'
import { Search, ArrowRight, Hash } from 'lucide-react'

interface TrackSearchProps {
    id: string
    setId: (val: string) => void
    onSubmit: (e: React.FormEvent) => void
}

export const TrackSearch = ({ id, setId, onSubmit }: TrackSearchProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-10 relative overflow-hidden"
        >
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)`,
                    backgroundSize: '32px 32px',
                }}
            />

            <div className="relative z-10">
                <div className="flex items-center gap-5 mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xl shadow-slate-900/10">
                        <Hash size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Chain Inquiry</h2>
                        <p className="text-slate-400 text-sm font-medium mt-0.5 uppercase tracking-wide">Ledger History Retrieval</p>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Target Asset Identifier</label>
                        <div className="relative">
                            <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-16 pr-8 py-5 text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all placeholder:text-slate-300 text-lg shadow-sm"
                                type="text"
                                placeholder="e.g. 001"
                                onChange={(e) => setId(e.target.value)}
                                value={id}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-col justify-end">
                        <button
                            type="submit"
                            className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl shadow-slate-900/10 active:scale-[0.98] hover:bg-slate-800 transition-all flex items-center justify-center gap-3 group h-[68px]"
                        >
                            <span className="text-lg">Query Ledger History</span>
                            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    )
}
