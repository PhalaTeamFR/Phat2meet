import React, { useEffect, useState } from "react";
import { Keyring } from '@polkadot/api'
import { cryptoWaitReady } from '@polkadot/util-crypto';

import { atom } from 'jotai'

import {
  currentProfileAtom
} from '../components/Identity/Atoms'

export const AppContext = React.createContext();

const profile = useAtomValue(currentProfileAtom)

export const ContextProvider = ({ children }) => {

  const [account, setStateAccount] = useState(undefined);
  const [dappName, setDappName] = useState("Phat2meet");
  const [queryPair, setQueryPair] = useState();

  let lsAccount = undefined;

  useEffect(() => {
    const load = async () => {
      await cryptoWaitReady().catch(console.error);
      loadContext()
    }
    load().catch(console.error);

  }, [])

  const loadContext = () => {
    setQueryPair(new Keyring({ type: 'sr25519' }).addFromUri("//Alice"))
    lsAccount = profile
    if (typeof lsAccount !== "undefined") {
      setStateAccount(lsAccount)
    }
  }

  const getInjector = async () => {
    const account = await profile
    const injector = await account;
    await injector.enable(dappName)
    return injector
  }

  const getSigner = async (account) => {
    const injector = await getInjector(account)
    const signer = injector.signer;
    return signer;
  };

  return (
    <AppContext.Provider
      value={{
        account,
        setAccount,
        queryPair,
        setQueryPair,
        getSigner
      }}
    >
      {children}
    </AppContext.Provider>
  );
};