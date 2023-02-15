import { useState, useEffect } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

import { atom, useAtom } from 'jotai'
import { AccountSelectModal } from '../identity/components/AccountSelectModal'
import ConnectWalletButton from '../identity/components/ConnectWalletButton'

import { rpcEndpointAtom } from '../Atoms/Foundation'

import {
  Button,
} from '/src/components'


function Account() {

  const [api, setApi] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [userLogin, setUserLogin] = useState(false);
  const [userWallet, setUserWallet] = useState([]);

  const [endpoint] = useAtom(rpcEndpointAtom);
  const accountSelectModalVisibleAtom = atom(false)

  console.log("accounts")
  console.log(accounts)

  const extensionSetup = async () => {
    const extension = await web3Enable('polkadot-client-app');
    if (extension.length === 0) {
      console.log('No extension Found');
      return;
    }
    let acc = await web3Accounts();
    // initialize contract
    setAccounts(acc);
  }

  const login = (e) => {
    console.log("e.target.value")
    console.log(e.target.value)
    setUserWallet(e.target.value);
    setUserLogin(true);
  }

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
      <Button disabled={!api ? true : false} onClick={extensionSetup}>{"Connect Wallet 1"}</Button>
      {api ? (
        <ConnectWalletButton visibleAtom={accountSelectModalVisibleAtom} />
      ) : ("")}


      <div className="Account">
        {accounts.length !== 0 ? (
          <>
            <p>Select the account to login</p>
            <select onChange={login}>
              <option value="">Select Account</option>
              {accounts.map((account, idx) => (
                <option key={idx} value={account.meta.name}>{account.meta.name}</option>
              ))}
            </select>
          </>
        ) : (
          ""
        )}
        {userLogin && (
          <>
            <p>Polkadot Wallet Address:<strong>{userWallet}</strong></p>
          </>
        )}

      </div>
    </>
  );
}

export default Account;
