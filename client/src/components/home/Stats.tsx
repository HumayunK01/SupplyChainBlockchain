'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Users, Database, Pill } from 'lucide-react';
import { getContract } from '@/lib/web3';

interface ChainStats {
    medicines: number
    partners: number
    batches: number
    sold: number
}

const STAT_CONFIG = [
    { key: 'medicines', label: 'Medicines Tracked', icon: Pill, suffix: '' },
    { key: 'partners', label: 'Registered Partners', icon: Users, suffix: '' },
    { key: 'batches', label: 'Merkle Batches', icon: Database, suffix: '' },
    { key: 'sold', label: 'Medicines Sold', icon: Package, suffix: '' },
] as const

function useCountUp(target: number, duration = 1200) {
    const [count, setCount] = useState(0)
    useEffect(() => {
        if (target === 0) return
        let start = 0
        const step = Math.ceil(target / (duration / 16))
        const timer = setInterval(() => {
            start += step
            if (start >= target) {
                setCount(target)
                clearInterval(timer)
            } else {
                setCount(start)
            }
        }, 16)
        return () => clearInterval(timer)
    }, [target, duration])
    return count
}

function StatCard({ stat, value, index }: { stat: typeof STAT_CONFIG[number]; index: number; value: number }) {
    const count = useCountUp(value)
    const Icon = stat.icon

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col items-center justify-center text-center"
        >
            <div className="w-14 h-14 bg-white text-slate-900 rounded-2xl flex items-center justify-center mb-5 shrink-0 shadow-sm border border-slate-100">
                <Icon size={20} strokeWidth={1.5} />
            </div>
            <div>
                <div className="text-2xl md:text-3xl font-bold text-slate-900 font-manrope tracking-tight mb-1">
                    {value === 0 ? '—' : count.toLocaleString()}
                </div>
                <div className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">
                    {stat.label}
                </div>
            </div>
        </motion.div>
    )
}

const Stats = () => {
    const [stats, setStats] = useState<ChainStats>({ medicines: 0, partners: 0, batches: 0, sold: 0 })

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { contract } = await getContract()
                const [medCtr, rmsCtr, manCtr, disCtr, retCtr, batchCtr, medRaw] = await Promise.all([
                    contract.methods.medicineCtr().call(),
                    contract.methods.rmsCtr().call(),
                    contract.methods.manCtr().call(),
                    contract.methods.disCtr().call(),
                    contract.methods.retCtr().call(),
                    contract.methods.batchCtr().call(),
                    // Fetch all medicines to count sold ones
                    Promise.resolve(parseInt((await contract.methods.medicineCtr().call()).toString()))
                ])

                const totalMeds = parseInt(medCtr.toString())
                const totalPartners =
                    parseInt(rmsCtr.toString()) +
                    parseInt(manCtr.toString()) +
                    parseInt(disCtr.toString()) +
                    parseInt(retCtr.toString())

                // Count sold medicines (stage 5)
                let soldCount = 0
                if (totalMeds > 0) {
                    const medFetches = Array.from({ length: totalMeds }, (_, i) =>
                        contract.methods.MedicineStock(i + 1).call()
                    )
                    const medicines = await Promise.all(medFetches)
                    soldCount = medicines.filter((m: any) => parseInt(m.stage) === 5).length
                }

                setStats({
                    medicines: totalMeds,
                    partners: totalPartners,
                    batches: parseInt(batchCtr.toString()),
                    sold: soldCount,
                })
            } catch (err) {
                // Not connected or contract not deployed — keep zeros
            }
        }
        fetchStats()
    }, [])

    return (
        <section className="py-8 md:py-12 px-6 font-manrope">
            <div className="container mx-auto bg-white text-slate-900 rounded-[2rem] py-12 md:py-16 px-6 md:px-12 overflow-hidden border border-slate-100 shadow-sm relative">
                {/* Decorative accents */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-50 rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />

                {/* Grid Background */}
                <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, #94a3b8 1px, transparent 1px),
                            linear-gradient(to bottom, #94a3b8 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                    }}
                />

                <div className="relative z-10">
                    <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10">
                        Live Network Statistics
                    </p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
                        {STAT_CONFIG.map((stat, index) => (
                            <StatCard
                                key={stat.key}
                                stat={stat}
                                value={stats[stat.key]}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Stats;
