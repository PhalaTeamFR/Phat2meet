import React from 'react'
import { useSetAtom, useAtom, useAtomValue } from 'jotai'

import { Pressable } from './Button.styles'

import {
  currentAccountAtom,
  currentProfileAtom
} from '../Identity/Atoms'

export default function ConnectWalletButton({ visibleAtom, type = 'button', ...props }) {
  const setVisible = useSetAtom(visibleAtom)
  const [currentAccount, setCurrentAccount] = useAtom(currentAccountAtom)
  const currentAccountData = currentAccount.meta === undefined ? "Connect Wallet" : currentAccount.meta.name;

  console.log("currentAccountAtom")
  console.log(currentAccountAtom)


  const profile = useAtomValue(currentProfileAtom)

  console.log(profile)

  return (
    <>
      <Pressable type={type} {...props} onClick={() => setVisible(true)}>
        {currentAccountData}
      </Pressable>
      <Pressable disabled={!currentAccount} onClick={() => setCurrentAccount(null)}>
        {"Disconnect"}
      </Pressable>
    </>
  )
}