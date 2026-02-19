'use client'

import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'

interface RoleHeaderProps {
    currentAccount: string
}

export const RoleHeader = ({ currentAccount }: RoleHeaderProps) => {
    const formatAddress = (addr: string) =>
        addr ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}` : '0x00...0000'

    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Access Control</h1>
                <p className="text-slate-500 mt-2 text-lg">Manage node permissions and network participation protocols.</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col items-end"
            >
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 flex items-center gap-4 group hover:border-slate-900 transition-colors duration-300">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/10">
                        <ShieldCheck size={20} />
                    </div>
                    <div className="text-right pr-1">
                        <div className="flex items-center justify-end gap-1.5 mb-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <div className="text-[9px] uppercase font-bold text-slate-400 tracking-widest leading-none">Secure Connection</div>
                        </div>
                        <div className="text-sm font-mono font-bold text-slate-900">{formatAddress(currentAccount)}</div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
