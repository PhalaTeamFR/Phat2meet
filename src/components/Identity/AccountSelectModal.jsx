import { Suspense, useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai'

import { web3Accounts } from '@polkadot/extension-dapp';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
} from '@chakra-ui/react'

import {
  Button,
} from '/src/components'

import {
  currentAccountAtom, extensionEnabledAtom
} from './Atoms'

import trimAddress from './TrimAddress'

function AccountSelectFieldBase() {


  const [selectedWallet, setSelectedWallet] = useAtom(currentAccountAtom);

  const enabled = useAtomValue(extensionEnabledAtom)
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (enabled) {
        try {
          const allAccounts = await web3Accounts();
          setAccounts(allAccounts);
        } catch (err) {
          console.log('[AccountSelectFieldBase] load keyring failed with: ', err);
        }
      }
    };
    fetchAccounts();
  }, [enabled]);

  useEffect(() => {
    if (enabled) {
      (async () => {
        const updatedAccounts = await web3Accounts();
        setAccounts(updatedAccounts);
      })();
    }
  }, [enabled]);

  console.log("extensionEnabledAtom", enabled)
  console.log("accountsAtom", accounts)


  if (!enabled) {
    return null
  }
  return (
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
                      setSelectedWallet(null)
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

    </div>
  )
}

function ExtensionRequiredHelpText() {
  const enabled = useAtomValue(extensionEnabledAtom)

  if (enabled) {
    return null
  }

  return (
    <Alert status='error' color="#000">
      <AlertIcon />
      <AlertTitle >You need install Polkadot{"{.js}"} extension first.</AlertTitle>
      <AlertDescription>
        <a href="https://wiki.phala.network/en-us/general/applications/01-polkadot-extension/" target="_blank">
          read more
        </a>
      </AlertDescription>
    </Alert>
  )
}

export const AccountSelectModal = ({ visibleAtom }) => {

  const [visible, setVisible] = useAtom(visibleAtom)

  return (
    <Modal isOpen={visible} onClose={() => setVisible(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Select Account
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Suspense fallback={<Button><Spinner /></Button>}>
            <ExtensionRequiredHelpText />
            <AccountSelectFieldBase />
          </Suspense>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
