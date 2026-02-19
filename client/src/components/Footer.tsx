'use client';
import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SiX, SiLinkedin, SiGithub, SiDiscord } from 'react-icons/si'

const Footer = () => {
    return (
        <footer className="py-8 border-t border-slate-100 relative overflow-hidden bg-white/50 backdrop-blur-sm">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center">
                    {/* Brand Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-8"
                    >
                        <Link href="/" className="flex items-center justify-center space-x-3 group">
                            <div className="w-10 h-10 flex items-center justify-center">
                                <img src="/logo.svg" alt="SC-Chain Logo" className="w-full h-full object-contain group-hover:rotate-12 transition-transform duration-300" />
                            </div>
                            <span className="text-2xl font-bold text-slate-900 font-manrope tracking-tight">SecureChain</span>
                        </Link>
                        <p className="mt-4 text-slate-500 max-w-lg mx-auto text-sm leading-relaxed">
                            Architecting trust and transparency in global supply chains through state-of-the-art blockchain technology.
                        </p>
                    </motion.div>

                    {/* Navigation Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-wrap justify-center gap-x-10 gap-y-4 mb-10"
                    >
                        <Link href="/roles" className="text-slate-600 hover:text-slate-900 text-base font-semibold transition-colors">Roles</Link>
                        <Link href="/addmed" className="text-slate-600 hover:text-slate-900 text-base font-semibold transition-colors">Orders</Link>
                        <Link href="/track" className="text-slate-600 hover:text-slate-900 text-base font-semibold transition-colors">Track</Link>
                        <Link href="/supply" className="text-slate-600 hover:text-slate-900 text-base font-semibold transition-colors">Supply</Link>
                        <Link href="#" className="text-slate-600 hover:text-slate-900 text-base font-semibold transition-colors">Privacy</Link>
                    </motion.div>

                    {/* Social Icons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center space-x-6 mb-10"
                    >
                        {[
                            { Icon: SiX, href: "#", label: "X" },
                            { Icon: SiLinkedin, href: "#", label: "LinkedIn" },
                            { Icon: SiGithub, href: "#", label: "GitHub" },
                            { Icon: SiDiscord, href: "#", label: "Discord" },
                        ].map((social, i) => (
                            <a
                                key={i}
                                href={social.href}
                                className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-all duration-300"
                                aria-label={social.label}
                            >
                                <social.Icon size={18} />
                            </a>
                        ))}
                    </motion.div>

                    {/* Bottom Section */}
                    <div className="w-full pt-8 border-t border-slate-100 flex flex-col items-center">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.25em] mb-4">
                            © 2026 SecureChain • Immutability Guaranteed
                        </p>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-300">
                            <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span>Mainnet Live</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
