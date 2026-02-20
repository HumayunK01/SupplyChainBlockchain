'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Preloader = () => {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Determine when the app is completely "loaded". Since there's no single event,
        // an artificial initial splash delay gives the "Zero-wrap" enterprise feel.
        const timer = setTimeout(() => {
            setLoading(false)
        }, 1800)

        // Prevent scrolling while preloader is active
        if (loading) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }

        return () => {
            clearTimeout(timer)
            document.body.style.overflow = ''
        }
    }, [loading])

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    key="global-preloader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                    className="fixed inset-0 z-[99999] bg-slate-50 flex items-center justify-center overflow-hidden"
                >
                    {/* Subtle Grid Background */}
                    <div
                        className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{
                            backgroundImage: `linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)`,
                            backgroundSize: '40px 40px',
                        }}
                    />

                    <div className="relative z-10 flex flex-col items-center">
                        {/* Logo Container */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-24 h-24 mb-6 flex items-center justify-center p-4 bg-white rounded-3xl shadow-xl shadow-slate-200/50"
                        >
                            <motion.img
                                src="/logo.svg"
                                alt="SecureChain"
                                className="w-full h-full object-contain"
                            />
                            <div className="absolute inset-0 rounded-3xl border-2 border-slate-900/5 pointer-events-none" />
                        </motion.div>

                        {/* Text Configuration */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                            className="text-center"
                        >
                            <h1 className="text-3xl font-extrabold text-slate-900 font-manrope tracking-tight mb-4">
                                SecureChain
                            </h1>
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Preloader
