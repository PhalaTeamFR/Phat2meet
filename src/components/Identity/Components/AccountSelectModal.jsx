import { useState, useEffect } from 'react';
import { useAtom } from 'jotai'

import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

import { rpcEndpointAtom } from '../../Atoms/Foundation'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

export const AccountSelectModal = ({ visibleAtom }) => {
  const [visible, setVisible] = useAtom(visibleAtom)

  const [accounts, setAccounts] = useState([]);
  const [userLogin, setUserLogin] = useState(false);
  const [userWallet, setUserWallet] = useState([]);


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

  useEffect(() => {
    extensionSetup();
  }, [])

  return (

    <Modal isOpen={visible} onClose={() => setVisible(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Select Account
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="Account">

            {accounts.length !== 0 ? (
              <>
                <p>Select the account to login</p>

                <div>
                  {accounts.map((account, idx) => (
                    <div key={idx}>

                      <p>{account.address.substring(0, 6)}...{account.address.substring(account.address.length - 6)}</p>
                    </div>
                  ))}
                </div>
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
        </ModalBody>
      </ModalContent>
    </Modal>

  )
}
