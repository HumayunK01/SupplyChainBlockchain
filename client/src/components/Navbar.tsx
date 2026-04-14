'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, Menu, X, ArrowRight, User, Package, Search, Truck, LogOut } from 'lucide-react'
import { loadWeb3 } from '@/lib/web3'
import { getUserIdentity, UserRole } from '@/lib/contractUtils'

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [account, setAccount] = useState<string | null>(null)
    const [role, setRole] = useState<UserRole>('PUBLIC')
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)

        let isMounted = true

        const checkConnection = async (retries = 3) => {
            if (!isMounted) return
            try {
                if (window.ethereum) {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' })
                    if (accounts.length > 0) {
                        setAccount(accounts[0])
                        const userRole = await getUserIdentity(accounts[0])
                        if (isMounted) setRole(userRole)
                    }
                } else if (retries > 0) {
                    setTimeout(() => checkConnection(retries - 1), 500)
                }
            } catch (err) {
                console.error("Auto-connect silently failed:", err)
            }
        }
        checkConnection()

        const handleAccountsChanged = async (accounts: string[]) => {
            if (accounts.length > 0) {
                setAccount(accounts[0])
                const userRole = await getUserIdentity(accounts[0])
                setRole(userRole)
            } else {
                setAccount(null)
                setRole('PUBLIC')
            }
        }

        const handleChainChanged = () => {
            window.location.reload()
        }

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged)
            window.ethereum.on('chainChanged', handleChainChanged)
        }

        return () => {
            isMounted = false
            window.removeEventListener('scroll', handleScroll)
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
                window.ethereum.removeListener('chainChanged', handleChainChanged)
            }
        }
    }, [])

    useEffect(() => {
        setIsMenuOpen(false)
    }, [pathname])

    const handleConnect = async () => {
        try {
            await loadWeb3()
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
                if (accounts.length > 0) {
                    setAccount(accounts[0])
                    const userRole = await getUserIdentity(accounts[0])
                    setRole(userRole)
                }
            }
        } catch (error) {
            console.error('Failed to connect wallet:', error)
        }
    }

    const handleDisconnect = () => {
        setAccount(null)
        setRole('PUBLIC')
        // Note: MetaMask doesn't have a formal "disconnect" button via API, 
        // we just clear our app state.
    }

    // Role-based navigation links
    const allLinks = [
        { name: 'Partners', path: '/roles', icon: User, reqRole: ['OWNER'] },
        { name: 'Add Medicines', path: '/addmed', icon: Package, reqRole: ['OWNER'] },
        { name: 'Bulk Register', path: '/batch', icon: Package, reqRole: ['OWNER', 'MAN'] },
        { name: 'Track', path: '/track', icon: Search, reqRole: ['PUBLIC', 'OWNER', 'RMS', 'MAN', 'DIS', 'RET'] },
        { name: 'Update Progress', path: '/supply', icon: Truck, reqRole: ['OWNER', 'RMS', 'MAN', 'DIS', 'RET'] },
    ]

    const navLinks = allLinks.filter(link => link.reqRole.includes(role) || link.reqRole.includes('PUBLIC'))

    const formatAddress = (addr: string) => {
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
    }

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled || isMenuOpen
                ? 'py-3'
                : 'py-6'
                }`}
        >
            <div className={`container mx-auto px-6`}>
                <div className={`transition-all duration-500 rounded-2xl flex items-center justify-between px-6 py-3 relative z-50 ${isScrolled || isMenuOpen
                    ? 'glass shadow-lg border-white/40'
                    : 'bg-transparent'
                    }`}>
                    <Link href="/" className="flex items-center space-x-2 group outline-none">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-9 h-9 flex items-center justify-center"
                        >
                            <img src="/logo.svg" alt="SC-Chain Logo" className="w-full h-full object-contain" />
                        </motion.div>
                        <span className="text-xl font-bold tracking-tight font-manrope text-gradient">
                            SecureChain
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.path
                            const Icon = link.icon
                            return (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    className={`relative px-2.5 xl:px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 xl:gap-2 group whitespace-nowrap ${isActive
                                        ? 'text-slate-900'
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                                        }`}
                                >
                                    <Icon size={17} className={`shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                    <span>{link.name}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-active"
                                            className="absolute inset-0 bg-slate-200/50 rounded-xl -z-10"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </Link>
                            )
                        })}

                        <div className="h-6 w-[1px] bg-slate-200 mx-2 xl:mx-4" />

                        {account ? (
                            <div className="flex items-center gap-2">
                                <div className="px-3 py-2 bg-slate-100/80 backdrop-blur-sm rounded-xl border border-slate-200 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs font-mono font-medium text-slate-600">
                                        {formatAddress(account)}
                                    </span>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleDisconnect}
                                    className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </motion.button>
                            </div>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.02, translateY: -1 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleConnect}
                                className="btn-primary group flex items-center gap-2 !py-2 !px-4"
                            >
                                <Wallet size={18} className="group-hover:rotate-12 transition-transform" />
                                <span className="text-sm font-bold">Connect</span>
                            </motion.button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="lg:hidden p-2 text-slate-600 hover:text-slate-900 bg-slate-100/50 rounded-xl"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </motion.button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="lg:hidden fixed inset-0 z-40 bg-white/90 backdrop-blur-xl overflow-y-auto"
                    >
                        <div className="flex flex-col min-h-full pt-24 px-5 pb-8">
                            <div className="flex-1 space-y-1.5">
                                {navLinks.map((link, i) => {
                                    const isActive = pathname === link.path
                                    const Icon = link.icon
                                    return (
                                        <motion.div
                                            key={link.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.08 }}
                                        >
                                            <Link
                                                href={link.path}
                                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${isActive
                                                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                                                    : 'text-slate-600 hover:bg-slate-100'
                                                    }`}
                                            >
                                                <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} />
                                                <span className="text-base font-bold font-manrope">{link.name}</span>
                                                {isActive && (
                                                    <motion.div layoutId="active-dot-mobile" className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                                                )}
                                            </Link>
                                        </motion.div>
                                    )
                                })}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="mt-6 space-y-4"
                            >
                                {account ? (
                                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Connected</div>
                                                    <div className="text-sm font-mono font-semibold text-slate-900">{formatAddress(account)}</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleDisconnect}
                                                className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-100 transition-colors"
                                            >
                                                <LogOut size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleConnect}
                                        className="w-full btn-primary py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2.5 shadow-xl shadow-slate-900/20"
                                    >
                                        <Wallet size={20} />
                                        <span>Connect MetaMask</span>
                                    </button>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

export default Navbar
