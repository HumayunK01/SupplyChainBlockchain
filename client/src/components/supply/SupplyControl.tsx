'use client'

import { motion } from 'framer-motion'
import { MapPin, Building2, Truck, ShoppingBag, CheckCircle2, ArrowRight } from 'lucide-react'
import { UserRole } from '@/lib/contractUtils'

interface SupplyControlProps {
    role: UserRole
    rmsId: string
    manId: string
    disId: string
    retId: string
    soldId: string
    onRMSChange: (val: string) => void
    onManChange: (val: string) => void
    onDisChange: (val: string) => void
    onRetChange: (val: string) => void
    onSoldChange: (val: string) => void
    onRMSSubmit: (e: React.FormEvent) => void
    onManSubmit: (e: React.FormEvent) => void
    onDisSubmit: (e: React.FormEvent) => void
    onRetSubmit: (e: React.FormEvent) => void
    onSoldSubmit: (e: React.FormEvent) => void
}

export const SupplyControl = ({
    role,
    rmsId, manId, disId, retId, soldId,
    onRMSChange, onManChange, onDisChange, onRetChange, onSoldChange,
    onRMSSubmit, onManSubmit, onDisSubmit, onRetSubmit, onSoldSubmit
}: SupplyControlProps) => {

    const allSteps = [
        { id: 1, reqRole: 'RMS', title: 'Raw Materials', desc: 'Source ingredients', icon: MapPin, val: rmsId, setVal: onRMSChange, sub: onRMSSubmit },
        { id: 2, reqRole: 'MAN', title: 'Manufacturing', desc: 'Create the product', icon: Building2, val: manId, setVal: onManChange, sub: onManSubmit },
        { id: 3, reqRole: 'DIS', title: 'Distribution', desc: 'Ship to pharmacies', icon: Truck, val: disId, setVal: onDisChange, sub: onDisSubmit },
        { id: 4, reqRole: 'RET', title: 'Retail', desc: 'Receive at pharmacy', icon: ShoppingBag, val: retId, setVal: onRetChange, sub: onRetSubmit },
        { id: 5, reqRole: 'RET', title: 'Sold to Customer', desc: 'Hand to patient', icon: CheckCircle2, val: soldId, setVal: onSoldChange, sub: onSoldSubmit }
    ]

    const steps = allSteps.filter(step => role === 'OWNER' || role === step.reqRole)

    if (role === 'PUBLIC') {
        return (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center">
                <p className="text-slate-500 font-medium">You must be logged in as an authorized company to update the supply chain.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, idx) => {
                const Icon = step.icon
                return (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 flex flex-col justify-between hover:border-slate-900/40 hover:shadow-2xl hover:shadow-slate-900/5 transition-all duration-500 overflow-hidden relative"
                    >
                        <div
                            className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-full -mr-20 -mt-20 opacity-40 group-hover:bg-slate-900 transition-colors duration-700"
                        />

                        <div className="relative z-10 w-full">
                            <div className="flex items-center gap-5 mb-10">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center group-hover:bg-white transition-all duration-500 relative shadow-sm">
                                    <Icon size={24} />
                                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-xl flex items-center justify-center text-[11px] font-black text-slate-900 border border-slate-100 shadow-sm group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-500">
                                        {step.id}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 tracking-tight text-lg leading-tight">{step.title}</h4>
                                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mt-1 group-hover:text-slate-500 transition-colors">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={step.sub} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Medicine ID</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="e.g. 001"
                                            value={step.val}
                                            onChange={(e) => step.setVal(e.target.value)}
                                            className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-5 py-4 text-base font-bold text-slate-900 focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all placeholder:text-slate-300"
                                            required
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 active:scale-[0.97] transition-all hover:bg-slate-800"
                                >
                                    <span>Update Block</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        </div>

                        <div className="text-[80px] font-black text-slate-50 absolute -bottom-10 -right-4 pointer-events-none group-hover:text-slate-100 transition-colors duration-700 -z-0 select-none">
                            0{step.id}
                        </div>
                    </motion.div>
                )
            })}
        </div>
    )
}
