import React from 'react'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  VStack
} from '@chakra-ui/react'
import { atom, useAtom } from 'jotai'

import EndpointAddressInput from '../Parachain/EndpointAddressInput'

export const connectionDetailModalVisibleAtom = atom(false)

export default function ConnectionDetailModal() {
  const [visible, setVisible] = useAtom(connectionDetailModalVisibleAtom)
  return (
    <Modal isOpen={visible} onClose={() => setVisible(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Connection Info</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <EndpointAddressInput label="RPC Endpoint" />
          </VStack>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
}
