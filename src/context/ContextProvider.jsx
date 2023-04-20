import React, { useEffect, useState, createContext } from "react";
import { Keyring } from '@polkadot/api'
import { web3Enable } from '@polkadot/extension-dapp'
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { setToStorage, getFromStorage } from "./storage";

export const AppContext = createContext();

export const ContextProvider = ({ children }) => {
  const [account, setStateAccount] = useState(undefined);
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
    setQueryPair(new Keyring({ ss58Format: 2 }).addFromUri("//Alice"))
    lsAccount = getFromStorage("wallet-account", true)
    if (typeof lsAccount !== "undefined") {
      setStateAccount(lsAccount)
    }
  }

  const setAccount = (e) => {
    setToStorage("wallet-account", e, true)
    setStateAccount(e)
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