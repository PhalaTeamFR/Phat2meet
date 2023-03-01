import { useState, useEffect } from 'react';
import { atom, useAtom } from 'jotai'

import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box
} from '@chakra-ui/react'

import {
  Button,
} from '/src/components'

import {
  currentAccountAtom,
} from './Atoms'

import trimAddress from './TrimAddress'

export const AccountSelectModal = ({ visibleAtom }) => {

  const [visible, setVisible] = useAtom(visibleAtom)

  const [accounts, setAccounts] = useState([]);
  const [userLogin, setUserLogin] = useState(false);
  const [userWallet, setUserWallet] = useState([]);

  const [selectedWallet, setSelectedWallet] = useAtom(currentAccountAtom);

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
            {accounts.length !== 0 && (
              <>
                <p>Select the account to login</p>
                <Box display="flex" flexDirection="column" gap={4} paddingLeft={1} maxH={80} overflowY="scroll">
                  {accounts.map((account, idx) => (
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                      alignItems="center"
                      p={2}
                      border="1px solid"
                      borderColor="gray.800"
                      rounded="sm"
                      _hover={{ opacity: 1, color: '#C5FF47' }}
                      key={idx}
                    >
                      <b>{account.meta.name.toLowerCase()}</b>
                      <p size='sm'>{trimAddress(account.address)}</p>
                      {(selectedWallet && selectedWallet.address === account.address) ? (
                        <Button
                          onClick={() => {
                            setSelectedWallet()
                            setVisible(false)
                          }}
                        >
                          Unselect
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            setSelectedWallet(account)
                            setVisible(false)
                          }}
                        >
                          Select
                        </Button>
                      )}
                    </Box>
                  ))}
                </Box>
              </>
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
