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

export interface Role {
    addr: string
    id: string
    name: string
    place: string
}

export interface TrackingState {
    isTracking: boolean
    activeId: string
}
