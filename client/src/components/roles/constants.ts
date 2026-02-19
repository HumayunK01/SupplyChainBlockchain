import { Database, Factory, Truck, ShoppingBag } from 'lucide-react'
import { RoleType, RoleConfigItem } from './types'

export const ROLE_CONFIG: Record<RoleType, RoleConfigItem> = {
    rms: {
        label: 'Raw Material Supplier',
        plural: 'Raw Material Suppliers',
        icon: Database,
        color: 'bg-slate-900',
        lightColor: 'bg-slate-100',
        textColor: 'text-slate-900',
    },
    man: {
        label: 'Manufacturer',
        plural: 'Manufacturers',
        icon: Factory,
        color: 'bg-slate-900',
        lightColor: 'bg-slate-100',
        textColor: 'text-slate-900',
    },
    dis: {
        label: 'Distributor',
        plural: 'Distributors',
        icon: Truck,
        color: 'bg-slate-900',
        lightColor: 'bg-slate-100',
        textColor: 'text-slate-900',
    },
    ret: {
        label: 'Retailer',
        plural: 'Retailers',
        icon: ShoppingBag,
        color: 'bg-slate-900',
        lightColor: 'bg-slate-100',
        textColor: 'text-slate-900',
    },
}
