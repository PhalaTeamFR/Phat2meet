import { atom } from 'jotai'

export const currentAccountAtom = atom([]);

export const currentProfileAtom = atom(get => {
  const currentAccount = get(currentAccountAtom)
  if (!currentAccount) {
    return {
      displayName: 'Guest',
      connected: false,
    }
  }
  return {
    ...currentAccount,
    connected: true,
  }
})