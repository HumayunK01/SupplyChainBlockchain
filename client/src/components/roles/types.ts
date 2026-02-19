import { LucideIcon } from 'lucide-react'

export interface Role {
    addr: string
    id: string
    name: string
    place: string
}

export interface RoleConfigItem {
    label: string
    plural: string
    icon: LucideIcon
    color: string
    lightColor: string
    textColor: string
}

export type RoleType = 'rms' | 'man' | 'dis' | 'ret'

export interface RolesState {
    rms: Role[]
    man: Role[]
    dis: Role[]
    ret: Role[]
}
