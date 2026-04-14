const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT

interface CertificateMetadata {
    name: string
    role: string
    place: string
    walletAddress: string
    registeredAt: string
}

/**
 * Uploads certificate metadata JSON to IPFS via Pinata.
 * Returns the full ipfs:// URI.
 */
export async function uploadCertificateToIPFS(metadata: CertificateMetadata): Promise<string> {
    if (!PINATA_JWT) {
        console.warn('Pinata JWT not configured, using fallback URI')
        return `ipfs://certificate-${metadata.role}-${Date.now()}`
    }

    const body = {
        pinataContent: {
            name: `${metadata.name} - ${metadata.role} Certificate`,
            description: `Verified supply chain participant on SecureChain`,
            role: metadata.role,
            entity: metadata.name,
            place: metadata.place,
            wallet: metadata.walletAddress,
            issuedAt: metadata.registeredAt,
            issuer: 'SecureChain Network',
        },
        pinataMetadata: {
            name: `SBT-${metadata.role}-${metadata.name}-${Date.now()}`,
        },
    }

    const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: JSON.stringify(body),
    })

    if (!res.ok) {
        const err = await res.text()
        console.error('Pinata upload failed:', err)
        // Fallback to fake URI so the flow doesn't break
        return `ipfs://certificate-${metadata.role}-${Date.now()}`
    }

    const data = await res.json()
    return `ipfs://${data.IpfsHash}`
}

interface BatchMetadata {
    batchName: string
    quantity: number
    medicines: string[]
    merkleRoot: string
    manufacturer: string
    registeredAt: string
}

/**
 * Uploads batch metadata (full medicine list) to IPFS via Pinata.
 * Returns the IPFS CID (without ipfs:// prefix) for on-chain storage.
 */
export async function uploadBatchToIPFS(metadata: BatchMetadata): Promise<string> {
    if (!PINATA_JWT) {
        console.warn('Pinata JWT not configured')
        return ''
    }

    const body = {
        pinataContent: {
            name: `${metadata.batchName} — Batch of ${metadata.quantity}`,
            description: 'SecureChain Merkle batch medicine manifest',
            batchName: metadata.batchName,
            quantity: metadata.quantity,
            merkleRoot: metadata.merkleRoot,
            manufacturer: metadata.manufacturer,
            registeredAt: metadata.registeredAt,
            medicines: metadata.medicines,
        },
        pinataMetadata: {
            name: `Batch-${metadata.batchName}-${metadata.quantity}-${Date.now()}`,
        },
    }

    const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: JSON.stringify(body),
    })

    if (!res.ok) {
        const err = await res.text()
        console.error('Pinata batch upload failed:', err)
        return ''
    }

    const data = await res.json()
    return data.IpfsHash
}

/**
 * Unpins a file from Pinata so it's no longer served via IPFS gateways.
 * The CID becomes inaccessible once garbage-collected by the network.
 */
export async function unpinFromIPFS(cid: string): Promise<void> {
    if (!PINATA_JWT) return

    try {
        const res = await fetch(`https://api.pinata.cloud/pinning/unpin/${cid}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${PINATA_JWT}`,
            },
        })

        if (res.ok) {
            console.log(`Unpinned ${cid} from Pinata`)
        } else {
            console.warn(`Failed to unpin ${cid}:`, await res.text())
        }
    } catch (err) {
        console.warn('Unpin request failed:', err)
    }
}
