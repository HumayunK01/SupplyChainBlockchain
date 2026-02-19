'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Circle, ArrowLeft, ShieldCheck, MapPin, Building2, Truck, ShoppingBag, User } from 'lucide-react'
import { Medicine, Role } from './types'
import { QRCodeCanvas } from 'qrcode.react'

interface TrackJourneyProps {
    medicineId: number
    med: Medicine
    medStage: string
    rms?: Role
    man?: Role
    dis?: Role
    ret?: Role
    onBack: () => void
}

export const TrackJourney = ({ medicineId, med, medStage, rms, man, dis, ret, onBack }: TrackJourneyProps) => {
    const steps = [
        { label: 'Order Initiated', role: null, completed: true, icon: CheckCircle2 },
        { label: 'Resource Provisioned', role: rms, completed: !!rms, icon: ShieldCheck },
        { label: 'Authorized Manufacture', role: man, completed: !!man, icon: Building2 },
        { label: 'Logistics Handover', role: dis, completed: !!dis, icon: Truck },
        { label: 'Retail Integration', role: ret, completed: !!ret, icon: ShoppingBag },
        { label: 'Consumer Transfer', role: null, completed: medStage.includes('Sold'), icon: User },
    ]

    const batteryData = {
        id: med.id,
        name: med.name,
        description: med.description,
        currentStage: medStage,
    }

    return (
        <div className="flex flex-col gap-12">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <button
                    onClick={onBack}
                    className="w-11 h-11 bg-white rounded-2xl border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-900 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 flex items-center justify-center group flex-shrink-0"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <div className="text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Asset Profile: {med.name}</h2>
                    <p className="text-slate-500 font-medium text-sm md:text-base">Tracking identifier: #{med.id}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Journey Timeline */}
                <div className="lg:col-span-2 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-10 relative overflow-hidden"
                    >
                        <div
                            className="absolute inset-0 opacity-[0.02] pointer-events-none"
                            style={{
                                backgroundImage: `linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)`,
                                backgroundSize: '40px 40px',
                            }}
                        />

                        <div className="relative z-10">
                            <div className="flex items-center gap-5 mb-12">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 shadow-sm">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Chain Sequence</h3>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-0.5">Sequential State Validation</p>
                                </div>
                            </div>

                            <div className="space-y-12 relative">
                                <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-slate-100 -z-0" />

                                {steps.map((step, idx) => {
                                    const Icon = step.icon
                                    return (
                                        <div key={idx} className="relative z-10 flex gap-8">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-md flex-shrink-0 transition-all duration-500 ${step.completed ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-300'}`}>
                                                <Icon size={20} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                                                    <h4 className={`font-black text-lg tracking-tight ${step.completed ? 'text-slate-900' : 'text-slate-300'}`}>{step.label}</h4>
                                                    {step.completed && (
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 text-[10px] font-black uppercase tracking-widest shrink-0">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                            Verified
                                                        </div>
                                                    )}
                                                </div>

                                                {step.role ? (
                                                    <div className="bg-slate-50/50 backdrop-blur-sm rounded-[1.5rem] p-6 border border-slate-100 space-y-4">
                                                        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] shrink-0">Network Authority</span>
                                                            <span className="text-slate-900 font-bold text-sm truncate whitespace-nowrap">{step.role.name}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] shrink-0">Operational Node</span>
                                                            <span className="text-slate-900 font-bold text-sm truncate whitespace-nowrap">{step.role.place}</span>
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Protocol Access Key</span>
                                                            <div className="bg-white border border-slate-100 px-3 py-2 rounded-xl text-slate-400 font-mono text-[10px] whitespace-nowrap overflow-x-auto pb-1 custom-scrollbar">
                                                                {step.role.addr}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : step.completed ? (
                                                    <div className="bg-slate-50/50 rounded-2xl px-5 py-4 border border-emerald-100/30">
                                                        <p className="text-slate-500 text-sm font-medium italic">Automated protocol confirmation successful. State transition finalized on-chain.</p>
                                                    </div>
                                                ) : (
                                                    <p className="text-slate-300 text-sm font-medium italic">Awaiting upstream processing or peer endorsement...</p>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Sidebar Intel */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-900 rounded-[2rem] p-10 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-5 mb-10">
                                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/10">
                                    <ShieldCheck size={28} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tight leading-none mb-1">Ledger Passport</h3>
                                    <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Asset QR Integrity</span>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-[2rem] mb-8 flex justify-center shadow-inner overflow-hidden border border-white/20">
                                <QRCodeCanvas
                                    value={JSON.stringify(batteryData)}
                                    size={200}
                                    level="H"
                                    includeMargin={false}
                                    className="max-w-full h-auto"
                                />
                            </div>

                            <p className="text-white/60 text-xs text-center font-bold uppercase tracking-wider leading-relaxed">
                                Cryptographically Unique Access Token
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-[2rem] border border-slate-100 p-10 shadow-sm relative overflow-hidden"
                    >
                        <div
                            className="absolute inset-0 opacity-[0.02] pointer-events-none"
                            style={{
                                backgroundImage: `linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)`,
                                backgroundSize: '16px 16px',
                            }}
                        />
                        <div className="relative z-10">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10">System Metadata</h4>
                            <div className="space-y-10">
                                <div className="grid grid-cols-1 gap-3">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Functional Spec</span>
                                    <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                                        <p className="text-slate-600 text-sm font-bold leading-relaxed">{med.description}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Network Persistence</span>
                                    <div className="flex items-center gap-3 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                        <span className="text-slate-900 font-black text-sm uppercase tracking-wider">{medStage}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
