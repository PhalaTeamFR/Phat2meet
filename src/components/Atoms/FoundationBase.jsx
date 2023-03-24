import { ApiPromise, WsProvider } from '@polkadot/api';
import { typeDefinitions } from '@polkadot/types'
import { types } from "@phala/sdk";
import { atom } from 'jotai'

export const rpcEndpointAtom = atom('')

export const rpcApiStatusAtom = atom('disconnected')
export const rpcEndpointErrorAtom = atom('')

export const rpcApiInstanceAtom = atom(ApiPromise | null)

export const createApiInstance = (endpointUrl) => {
  console.log('create RPC connection to ', endpointUrl)
  const wsProvider = new WsProvider(endpointUrl);
  const api = new ApiPromise({
    provider: wsProvider,
    types: { ...types, ...typeDefinitions }
  });

  return [wsProvider, api]
}