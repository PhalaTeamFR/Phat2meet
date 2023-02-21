import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { atom } from 'jotai'

await web3Enable('polkadot-client-app');
export const injectedAccountWithMeta = await web3Accounts();

console.log("injectedAccountWithMeta");
console.log(injectedAccountWithMeta);

export const availableAccountsAtom = atom(injectedAccountWithMeta)
console.log("availableAccountsAtom");
console.log(availableAccountsAtom);

export const currentAccountAtom = atom({ address: "", meta: { name: "" } });

console.log("currentAccountAtom ");
console.log(currentAccountAtom);


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