import { web3Enable, web3Accounts } from '@polkadot/extension-dapp'

import { PinkContractPromise, OnChainRegistry } from '@phala/sdk'

import { atom } from 'jotai'

import metadata from '../../contrat/metadata.json';

import {
  rpcApiInstanceAtom,
} from '../Atoms/FoundationBase'

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

export const balanceAtom = atom(async (get) => {
  const api = get(rpcApiInstanceAtom)
  const selected = get(currentAccountAtom)
  if (!api || !selected) {
    return 0
  }
  //console.log('api.query.system', api.query.system)
  const account = await api.query.system.account(selected.address)
  //console.log('account.data', account.data)
  const value = parseInt((BigInt(account.data.free.toString()) / BigInt(100000000)).toString(), 10) / 10000
  return value
})

// contract ID on phat-cb (contract address on polkadot.js.org/apps)
export const contractIdAtom = "0xcab37b387b2e15c6758dcade3f340d16aca3e0c0f18c94e485c103442a8bbcfa"

export const contractAtom = atom(async (get) => {
  const api = get(rpcApiInstanceAtom)

  const phatRegistry = await OnChainRegistry.create(api)
  const abi = JSON.parse(JSON.stringify(metadata))
  const contractKey = await phatRegistry.getContractKey(contractIdAtom)

  const contract = new PinkContractPromise(api, phatRegistry, abi, contractIdAtom, contractKey)


  return contract
})
