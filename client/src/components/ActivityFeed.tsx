'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, ShieldCheck, ShieldX, Package, Truck, Users, Database, RefreshCw } from 'lucide-react'
import { getContract } from '@/lib/web3'

interface EventLog {
    id: string
    type: 'CertificateIssued' | 'CertificateRevoked' | 'RoleRegistered' | 'MedicineAdded' | 'StageUpdated' | 'BatchRegistered'
    data: Record<string, string>
    timestamp: number
    blockNumber: number
    txHash: string
}

const EVENT_CONFIG: Record<EventLog['type'], { icon: typeof Activity; color: string; bg: string; label: string }> = {
    CertificateIssued: { icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', label: 'Certificate Issued' },
    CertificateRevoked: { icon: ShieldX, color: 'text-red-500', bg: 'bg-red-50 border-red-100', label: 'Certificate Revoked' },
    RoleRegistered: { icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100', label: 'Role Registered' },
    MedicineAdded: { icon: Package, color: 'text-violet-600', bg: 'bg-violet-50 border-violet-100', label: 'Medicine Added' },
    StageUpdated: { icon: Truck, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100', label: 'Stage Updated' },
    BatchRegistered: { icon: Database, color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-100', label: 'Batch Registered' },
}

const STAGE_NAMES: Record<string, string> = {
    '0': 'Init', '1': 'Raw Material Supply', '2': 'Manufacture', '3': 'Distribution', '4': 'Retail', '5': 'Sold'
}

const formatAddr = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

const formatTime = (ts: number) => {
    const d = new Date(ts * 1000)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function getEventDescription(event: EventLog): string {
    const { type, data } = event
    switch (type) {
        case 'CertificateIssued':
            return `Soulbound certificate issued to ${formatAddr(data.holder)}`
        case 'CertificateRevoked':
            return `Certificate revoked from ${formatAddr(data.holder)}`
        case 'RoleRegistered':
            return `${data.name} registered as ${data.roleType} in ${data.place}`
        case 'MedicineAdded':
            return `"${data.name}" added to medicine stock`
        case 'StageUpdated':
            return `Medicine #${data.medicineId} moved to ${STAGE_NAMES[data.stage] || data.stage}`
        case 'BatchRegistered':
            return `Batch #${data.batchId} registered with Merkle root`
        default:
            return 'Unknown event'
    }
}

export default function ActivityFeed() {
    const [events, setEvents] = useState<EventLog[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const fetchEvents = useCallback(async () => {
        try {
            const { contract, sbtContract } = await getContract()

            const allEvents: EventLog[] = []

            // Fetch SupplyChain events
            const scEventNames = ['RoleRegistered', 'MedicineAdded', 'StageUpdated', 'BatchRegistered'] as const
            for (const eventName of scEventNames) {
                try {
                    const logs = await contract.getPastEvents(eventName, { fromBlock: 0, toBlock: 'latest' })
                    for (const log of logs) {
                        const rv = log.returnValues
                        const data: Record<string, string> = {}
                        // Convert BigInt values to strings
                        for (const key of Object.keys(rv)) {
                            if (isNaN(Number(key))) {
                                data[key] = String(rv[key])
                            }
                        }
                        allEvents.push({
                            id: `${log.transactionHash}-${log.logIndex}`,
                            type: eventName,
                            data,
                            timestamp: Number(data.timestamp) || 0,
                            blockNumber: Number(log.blockNumber),
                            txHash: log.transactionHash,
                        })
                    }
                } catch (e) {
                    console.warn(`Failed to fetch ${eventName}:`, e)
                }
            }

            // Fetch SBT events
            const sbtEventNames = ['CertificateIssued', 'CertificateRevoked'] as const
            for (const eventName of sbtEventNames) {
                try {
                    const logs = await sbtContract.getPastEvents(eventName, { fromBlock: 0, toBlock: 'latest' })
                    for (const log of logs) {
                        const rv = log.returnValues
                        const data: Record<string, string> = {}
                        for (const key of Object.keys(rv)) {
                            if (isNaN(Number(key))) {
                                data[key] = String(rv[key])
                            }
                        }
                        allEvents.push({
                            id: `${log.transactionHash}-${log.logIndex}`,
                            type: eventName,
                            data,
                            timestamp: Number(data.timestamp) || 0,
                            blockNumber: Number(log.blockNumber),
                            txHash: log.transactionHash,
                        })
                    }
                } catch (e) {
                    console.warn(`Failed to fetch ${eventName}:`, e)
                }
            }

            // Sort by block number descending (newest first)
            allEvents.sort((a, b) => b.blockNumber - a.blockNumber)
            setEvents(allEvents)
        } catch (err) {
            console.error('Failed to fetch events:', err)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [])

    useEffect(() => {
        fetchEvents()
    }, [fetchEvents])

    const handleRefresh = () => {
        setRefreshing(true)
        fetchEvents()
    }

    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <Activity size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">On-Chain Activity</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{events.length} Events Recorded</p>
                    </div>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
                >
                    <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Event List */}
            <div className="max-h-[600px] overflow-y-auto">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-slate-900 animate-spin mx-auto mb-3" />
                        <p className="text-sm font-semibold text-slate-400">Loading events...</p>
                    </div>
                ) : events.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-3">
                            <Activity size={24} className="text-slate-200" />
                        </div>
                        <p className="font-bold text-slate-900">No Activity Yet</p>
                        <p className="text-sm text-slate-400 mt-1">Events will appear here as transactions are made</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {events.map((event, i) => {
                            const config = EVENT_CONFIG[event.type]
                            const Icon = config.icon
                            return (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="px-8 py-5 border-b border-slate-50 hover:bg-slate-50/50 transition-colors group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-9 h-9 rounded-xl ${config.bg} border flex items-center justify-center shrink-0 mt-0.5`}>
                                            <Icon size={16} className={config.color} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}>
                                                    {config.label}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-300">
                                                    Block #{event.blockNumber}
                                                </span>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-700 leading-snug">
                                                {getEventDescription(event)}
                                            </p>
                                            <div className="flex items-center gap-3 mt-2">
                                                {event.timestamp > 0 && (
                                                    <span className="text-[10px] font-bold text-slate-400">
                                                        {formatTime(event.timestamp)}
                                                    </span>
                                                )}
                                                <span className="text-[10px] font-mono text-slate-300 group-hover:text-slate-500 transition-colors truncate">
                                                    tx: {event.txHash.slice(0, 16)}...
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                )}
            </div>
        </div>
    )
}
