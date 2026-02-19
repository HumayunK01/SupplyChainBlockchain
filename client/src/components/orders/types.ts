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

export interface RoleCounts {
    rms: number
    man: number
    dis: number
    ret: number
}
