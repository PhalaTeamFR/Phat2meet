import React, { useEffect, useState, createContext } from "react";
import { useAtomValue } from 'jotai';
import { Keyring } from '@polkadot/api'
import { web3Enable } from '@polkadot/extension-dapp'
import { cryptoWaitReady } from '@polkadot/util-crypto';

import {
  currentAccountAtom
} from '../components/Identity/Atoms'

export const AppContext = createContext();

export const ContextProvider = ({ children }) => {

  const [account, setAccount] = useState(undefined);
  const [queryPair, setQueryPair] = useState();

  const profile = useAtomValue(currentAccountAtom)

  useEffect(() => {
    const load = async () => {
      await cryptoWaitReady().catch(console.error);
      loadContext()
    }
    load().catch(console.error);

  }, [])

  const loadContext = () => {
    setQueryPair(new Keyring({ type: 'sr25519' }).addFromUri("//Alice"))
    const localStorageAccount = profile;
    if (localStorageAccount) {
      setAccount(localStorageAccount);
    }
  }

  const getInjector = async () => {
    const injector = await web3Enable('phat2meet');
    return injector;
  };

  const getSigner = async (profile) => {
    const injector = await getInjector(profile);
    const signer = injector[0].signer;
    return signer;
  };

  return (
    <AppContext.Provider
      value={{
        account,
        setAccount,
        queryPair,
        setQueryPair,
        getSigner,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};