export interface Medicine {
    id: string
    name: string
    description: string
    RMSid: string
    MANid: string
    DISid: string
    RETid: string
    stage: string
}

export interface SupplyStep {
    id: number
    title: string
    description: string
    icon: any
    placeholder: string
    value: string
}
