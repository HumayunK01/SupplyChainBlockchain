'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ShieldCheck, Wallet, MapPin, Users } from 'lucide-react'
import { RoleType } from './types'
import { ROLE_CONFIG } from './constants'
import { RoleDropdown } from './RoleDropdown'

interface RoleRegistrationFormProps {
    isOwner: boolean
    contractOwner: string
    newRole: {
        address: string
        name: string
        place: string
        type: string
    }
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onRoleTypeSelect: (type: RoleType) => void
    onSubmit: (e: React.FormEvent) => void
}

export const RoleRegistrationForm = ({
    isOwner,
    contractOwner,
    newRole,
    onInputChange,
    onRoleTypeSelect,
    onSubmit
}: RoleRegistrationFormProps) => {
    const currentConfig = ROLE_CONFIG[newRole.type as RoleType]

    return (
        <div className="space-y-8">
            <AnimatePresence>
                {!isOwner && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-50/50 border border-red-100 rounded-[2rem] p-8 overflow-hidden relative"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-red-500 shadow-sm border border-red-100 shrink-0">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-red-900 leading-tight">Owner Access Required</h3>
                                    <p className="text-red-700/70 text-sm font-medium mt-0.5">
                                        Only the contract owner can register new supply chain nodes.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm px-5 py-4 rounded-2xl border border-red-100 min-w-0 md:max-w-md w-full">
                                <div className="text-[10px] uppercase font-black text-red-400 tracking-[0.2em] mb-2">Authorized Protocol Owner</div>
                                <div className="text-xs font-mono font-bold text-red-900 whitespace-nowrap overflow-x-auto pb-1 custom-scrollbar">
                                    {contractOwner || '0x0000000000000000000000000000000000000000'}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                        <div className={`w-14 h-14 rounded-2xl ${currentConfig.color} flex items-center justify-center text-white shadow-xl shadow-slate-900/10`}>
                            {(() => {
                                const Icon = currentConfig.icon;
                                return <Icon size={28} />;
                            })()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Register New Participant</h2>
                            <p className="text-slate-400 text-sm font-medium mt-0.5 uppercase tracking-wide">Protocol Entry Management</p>
                        </div>
                    </div>

                    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        <RoleDropdown
                            selectedRole={newRole.type as RoleType}
                            onSelect={onRoleTypeSelect}
                        />

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Identified Wallet Address</label>
                            <div className="relative">
                                <Wallet size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-5 py-4 text-slate-900 font-mono text-sm focus:bg-white focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all placeholder:text-slate-300"
                                    type="text"
                                    name="address"
                                    placeholder="0x..."
                                    onChange={onInputChange}
                                    value={newRole.address}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Organization Designation</label>
                            <div className="relative">
                                <Users size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-5 py-4 text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all placeholder:text-slate-300"
                                    type="text"
                                    name="name"
                                    placeholder="e.g. Acme Corp"
                                    onChange={onInputChange}
                                    value={newRole.name}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Operational Logistics Base</label>
                            <div className="relative">
                                <MapPin size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-5 py-4 text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all placeholder:text-slate-300"
                                    type="text"
                                    name="place"
                                    placeholder="e.g. Berlin, DE"
                                    onChange={onInputChange}
                                    value={newRole.place}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!isOwner}
                            className={`w-full py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 group md:col-span-2 shadow-2xl ${isOwner
                                ? 'bg-slate-900 text-white shadow-slate-900/10 active:scale-[0.98] hover:bg-slate-800'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                                }`}
                        >
                            {isOwner ? (
                                <>
                                    <Plus size={22} className="group-hover:rotate-90 transition-transform" />
                                    <span className="text-lg">Authorize and Transmit Payload</span>
                                </>
                            ) : (
                                <>
                                    <ShieldCheck size={22} />
                                    <span className="text-lg font-black uppercase tracking-widest">Access Denied</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}
