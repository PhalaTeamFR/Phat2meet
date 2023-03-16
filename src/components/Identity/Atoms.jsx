import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { atom } from 'jotai'

export const extensionEnabledAtom = atom(false)

extensionEnabledAtom.onMount = (set) => {
  (async () => {
    try {
      const injected = await web3Enable('contracts-ui')
      console.log('injected', injected)
      if (injected.length > 0) {
        set(true)
      }
    } catch (error) {
      console.error(error)
    }
  })()
}

export const accountsAtom = atom(async (get) => {
  const enabled = get(extensionEnabledAtom)
  if (enabled) {
    try {
      const allAccounts = await web3Accounts();

      return allAccounts
    } catch (err) {
      console.log('[accountsAtom] load keyring failed with: ', err)
    }
  }
  return []
})

export const currentAccountAtom = atom({ address: "", meta: { name: "" }, connected: false });

export const currentProfileAtom = atom(get => {
  const currentAccount = get(currentAccountAtom)

  if (!currentAccount) {
    return {
      address: "", meta: { name: "" },
      displayName: 'Guest',
      connected: false,
    }
  }
  return {
    ...currentAccount,
    connected: true,
  }
})