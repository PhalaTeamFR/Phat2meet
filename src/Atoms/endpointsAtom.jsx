import { atom } from 'jotai';
import { atomWithStorage, RESET } from 'jotai/utils';

export const PARACHAIN_ENDPOINT = 'wss://phat-beta-node.phala.network/khala/ws';

export const preferedEndpointAtom = atomWithStorage('last-selected-rpc', PARACHAIN_ENDPOINT);

export const endpointAtom = atom(
  get => get(preferedEndpointAtom),
  (get, set, next) => {
    if (next === RESET) {
      set(preferedEndpointAtom, `${PARACHAIN_ENDPOINT}`);
    } else {
      set(preferedEndpointAtom, next);
    }
  }
);
