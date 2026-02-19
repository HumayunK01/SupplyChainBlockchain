'use client'

import { motion } from 'framer-motion'
import { Package, MapPin, Building2, Truck, ShoppingBag, CheckCircle2, Activity } from 'lucide-react'

export const SupplyFlowViz = () => {
    const steps = [
        { label: 'Order', icon: Package },
        { label: 'RMS', icon: MapPin },
        { label: 'Factory', icon: Building2 },
        { label: 'Logistics', icon: Truck },
        { label: 'Retail', icon: ShoppingBag },
        { label: 'Sold', icon: CheckCircle2 },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 mb-12 relative overflow-hidden"
        >
            <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)`,
                    backgroundSize: '32px 32px',
                }}
            />

            <div className="relative z-10">
                <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <Activity size={20} className="text-slate-400" />
                    Chain Hierarchy Visualization
                </h3>

                <div className="flex flex-wrap items-center justify-between gap-4 p-8 bg-slate-50/50 rounded-[1.5rem] border border-slate-100">
                    {steps.map((step, idx) => {
                        const Icon = step.icon
                        return (
                            <div key={idx} className="flex flex-col items-center gap-3 group">
                                <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 group-hover:shadow-xl group-hover:shadow-slate-900/10 transition-all duration-300 relative">
                                    <Icon size={24} />
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-900 border border-slate-100 shadow-sm group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-colors duration-500">
                                        {idx + 1}
                                    </div>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest leading-none group-hover:text-slate-900 transition-colors">
                                    {step.label}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </motion.div>
    )
}
