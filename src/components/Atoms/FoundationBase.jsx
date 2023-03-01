import { ApiPromise, WsProvider } from '@polkadot/api';
import { atom } from 'jotai'

export const rpcEndpointAtom = atom('wss://phat-beta-node.phala.network/khala/ws')

export const rpcApiStatusAtom = atom('disconnected')
export const rpcEndpointErrorAtom = atom('')

export const rpcApiInstanceAtom = atom(ApiPromise | null)

export const createApiInstance = (endpointUrl) => {
  console.log('create RPC connection to ', endpointUrl)
  const wsProvider = new WsProvider(endpointUrl);
  const api = new ApiPromise({
    provider: wsProvider
  });

  return [wsProvider, api]
}