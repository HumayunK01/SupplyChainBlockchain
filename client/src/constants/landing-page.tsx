import { User, Package, Search, Truck, Globe, ShieldCheck, Zap, Activity, Sprout, Factory, Store, UserCheck } from 'lucide-react'
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiEthereum, SiSolidity, SiVercel, SiGithub } from 'react-icons/si'

export const STATS_DATA = [
    { label: 'Traceability', value: '100%', icon: Globe },
    { label: 'Manual Errors', value: 'Zero', icon: ShieldCheck },
    { label: 'Verification', value: 'Instant', icon: Zap },
    { label: 'Live Tracking', value: '24/7', icon: Activity },
];

export const FEATURES_DATA = [
    {
        path: '/roles',
        title: 'Register Roles',
        description: 'Assign roles to participants in the supply chain with cryptographic security.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        color: 'bg-slate-50 text-slate-900',
    },
    {
        path: '/addmed',
        title: 'Order Materials',
        description: 'Create and manage new material orders in the immutable ledger.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        ),
        color: 'bg-slate-50 text-slate-900',
    },
    {
        path: '/track',
        title: 'Track Materials',
        description: 'Real-time monitoring of products throughout the global supply chain.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
        ),
        color: 'bg-slate-50 text-slate-900',
    },
    {
        path: '/supply',
        title: 'Supply Solutions',
        description: 'Optimize Transitions and manage inventory with data-driven insights.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01" />
            </svg>
        ),
        color: 'bg-slate-50 text-slate-900',
    },
];

export const FLOW_DATA = [
    { step: '1', label: 'Raw Material', icon: Sprout },
    { step: '2', label: 'Production', icon: Factory },
    { step: '3', label: 'Distribution', icon: Truck },
    { step: '4', label: 'Retail', icon: Store },
    { step: '5', label: 'Consumer', icon: UserCheck },
];

export const TECH_LOGOS = [
    { node: <SiReact />, title: "React", href: "https://react.dev" },
    { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
    { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
    { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
    { node: <SiEthereum />, title: "Ethereum", href: "https://ethereum.org" },
    { node: <SiSolidity />, title: "Solidity", href: "https://soliditylang.org" },
    { node: <SiVercel />, title: "Vercel", href: "https://vercel.com" },
    { node: <SiGithub />, title: "GitHub", href: "https://github.com" },
];
