'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { RoleType } from './types'
import { ROLE_CONFIG } from './constants'

interface RoleDropdownProps {
    selectedRole: RoleType
    onSelect: (role: RoleType) => void
}

export const RoleDropdown = ({ selectedRole, onSelect }: RoleDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const currentConfig = ROLE_CONFIG[selectedRole]
    const Icon = currentConfig.icon

    return (
        <div className="space-y-2 relative">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Role Group</label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 font-semibold focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all flex items-center justify-between group"
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-lg ${currentConfig.color} flex items-center justify-center text-white scale-90`}>
                            <Icon size={14} />
                        </div>
                        <span>{currentConfig.label}</span>
                    </div>
                    <ChevronDown
                        size={18}
                        className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-[60]"
                                onClick={() => setIsOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                                className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-100 shadow-2xl shadow-slate-200/50 z-[70] overflow-hidden p-1.5"
                            >
                                {(Object.keys(ROLE_CONFIG) as RoleType[]).map((type) => {
                                    const config = ROLE_CONFIG[type];
                                    const RoleIcon = config.icon;
                                    const isSelected = selectedRole === type;

                                    return (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => {
                                                onSelect(type);
                                                setIsOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all group/item ${isSelected
                                                    ? 'bg-slate-50 text-slate-900'
                                                    : 'hover:bg-slate-50/80 text-slate-600 hover:text-slate-900'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg ${config.color} flex items-center justify-center text-white shadow-sm transition-transform group-hover/item:scale-110`}>
                                                    <RoleIcon size={16} />
                                                </div>
                                                <span className="font-semibold text-sm">{config.label}</span>
                                            </div>
                                            {isSelected && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mr-1" />
                                            )}
                                        </button>
                                    );
                                })}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
