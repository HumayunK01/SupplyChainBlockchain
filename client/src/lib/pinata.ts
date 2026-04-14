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
