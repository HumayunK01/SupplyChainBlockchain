import { getContract } from './web3'

export const checkIsOwner = async (): Promise<boolean> => {
  try {
    const { contract, account } = await getContract()
    const owner = await contract.methods.Owner().call()
    return owner.toLowerCase() === account.toLowerCase()
  } catch (err) {
    console.error('Error checking owner:', err)
    return false
  }
}

export const getContractOwner = async (): Promise<string | null> => {
  try {
    const { contract } = await getContract()
    const owner = await contract.methods.Owner().call()
    return owner
  } catch (err) {
    console.error('Error getting owner:', err)
    return null
  }
}

export type UserRole = 'OWNER' | 'RMS' | 'MAN' | 'DIS' | 'RET' | 'PUBLIC'

export const getUserIdentity = async (account: string): Promise<UserRole> => {
  try {
    const { contract } = await getContract()
    const accLower = account.toLowerCase()

    // 1. Check Owner
    const owner = await contract.methods.Owner().call()
    if (owner.toLowerCase() === accLower) return 'OWNER'

    // Fetch counts
    const [rmsCtr, manCtr, disCtr, retCtr] = await Promise.all([
      contract.methods.rmsCtr().call(),
      contract.methods.manCtr().call(),
      contract.methods.disCtr().call(),
      contract.methods.retCtr().call()
    ])

    // 2. Check RMS
    if (parseInt(rmsCtr) > 0) {
      const rmsData = await Promise.all(
        Array.from({ length: parseInt(rmsCtr) }, (_, i) => contract.methods.RMS(i + 1).call())
      )
      if (rmsData.some((rms: any) => rms.addr.toLowerCase() === accLower)) return 'RMS'
    }

    // 3. Check MAN
    if (parseInt(manCtr) > 0) {
      const manData = await Promise.all(
        Array.from({ length: parseInt(manCtr) }, (_, i) => contract.methods.MAN(i + 1).call())
      )
      if (manData.some((man: any) => man.addr.toLowerCase() === accLower)) return 'MAN'
    }

    // 4. Check DIS
    if (parseInt(disCtr) > 0) {
      const disData = await Promise.all(
        Array.from({ length: parseInt(disCtr) }, (_, i) => contract.methods.DIS(i + 1).call())
      )
      if (disData.some((dis: any) => dis.addr.toLowerCase() === accLower)) return 'DIS'
    }

    // 5. Check RET
    if (parseInt(retCtr) > 0) {
      const retData = await Promise.all(
        Array.from({ length: parseInt(retCtr) }, (_, i) => contract.methods.RET(i + 1).call())
      )
      if (retData.some((ret: any) => ret.addr.toLowerCase() === accLower)) return 'RET'
    }

    return 'PUBLIC'
  } catch (err: any) {
    console.error('Error getting user identity. Details:', err.message, err.stack)
    return 'PUBLIC'
  }
}

