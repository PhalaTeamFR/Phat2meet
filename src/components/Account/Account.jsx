import { useState, useEffect } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

import { atom, useAtom } from 'jotai'
import { AccountSelectModal } from '../Identity/AccountSelectModal'
import ConnectWalletButton from '../Identity/ConnectWalletButton'

import { rpcEndpointAtom } from '../Atoms/Foundation'

import {
  Button,
} from '/src/components'

import {
  currentAccountAtom,
} from '../Identity/Atoms'

function Account() {

  const [api, setApi] = useState(null);

  const [endpoint] = useAtom(rpcEndpointAtom);
  const accountSelectModalVisibleAtom = atom(false)



  const setup = async () => {
    try {
      const wsProvider = new WsProvider(endpoint);
      const _api = await ApiPromise.create({ provider: wsProvider });
      if (_api) {
        console.log('Connection Success');
        setApi(_api);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setup();
  }, [])
  return (
    <>
      <AccountSelectModal visibleAtom={accountSelectModalVisibleAtom} />
      {api && (
        <ConnectWalletButton visibleAtom={accountSelectModalVisibleAtom} />
      )}
    </>
  );
}

export default Account;
