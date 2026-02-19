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
        { name: 'Roles', path: '/roles', icon: User, reqRole: ['OWNER'] },
        { name: 'Order Assets', path: '/addmed', icon: Package, reqRole: ['OWNER'] },
        { name: 'Track', path: '/track', icon: Search, reqRole: ['PUBLIC', 'OWNER', 'RMS', 'MAN', 'DIS', 'RET'] },
        { name: 'Supply', path: '/supply', icon: Truck, reqRole: ['OWNER', 'RMS', 'MAN', 'DIS', 'RET'] },
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
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.path
                            const Icon = link.icon
                            return (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    className={`relative px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 group ${isActive
                                        ? 'text-slate-900'
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                                        }`}
                                >
                                    <Icon size={17} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                    {link.name}
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

                        <div className="h-6 w-[1px] bg-slate-200 mx-4" />

                        {account ? (
                            <div className="flex items-center gap-3">
                                <div className="px-4 py-2 bg-slate-100/80 backdrop-blur-sm rounded-xl border border-slate-200 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs font-mono font-medium text-slate-600">
                                        {formatAddress(account)}
                                    </span>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleDisconnect}
                                    className="p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </motion.button>
                            </div>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.02, translateY: -1 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleConnect}
                                className="btn-primary group flex items-center gap-2.5 !py-2 !px-5"
                            >
                                <Wallet size={18} className="group-hover:rotate-12 transition-transform" />
                                <span className="text-sm font-bold">Connect Wallet</span>
                            </motion.button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="md:hidden p-2 text-slate-600 hover:text-slate-900 bg-slate-100/50 rounded-xl"
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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden fixed inset-0 z-40 bg-white/80 backdrop-blur-xl"
                    >
                        <div className="flex flex-col h-full pt-28 px-6 pb-10">
                            <div className="flex-1 space-y-2">
                                {navLinks.map((link, i) => {
                                    const isActive = pathname === link.path
                                    const Icon = link.icon
                                    return (
                                        <motion.div
                                            key={link.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <Link
                                                href={link.path}
                                                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${isActive
                                                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10'
                                                    : 'text-slate-600 hover:bg-slate-100'
                                                    }`}
                                            >
                                                <Icon size={22} className={isActive ? 'text-white' : 'text-slate-400'} />
                                                <span className="text-lg font-bold font-manrope">{link.name}</span>
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
                                transition={{ delay: 0.4 }}
                                className="mt-auto space-y-4"
                            >
                                {account ? (
                                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Connected Wallet</div>
                                                    <div className="text-sm font-mono font-semibold text-slate-900">{formatAddress(account)}</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleDisconnect}
                                                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-100 transition-colors"
                                            >
                                                <LogOut size={18} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => router.push('/dashboard')}
                                            className="w-full btn-primary py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
                                        >
                                            <User size={18} />
                                            Go to Dashboard
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleConnect}
                                        className="w-full btn-primary py-5 rounded-2xl text-base font-bold flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20"
                                    >
                                        <Wallet size={22} />
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
