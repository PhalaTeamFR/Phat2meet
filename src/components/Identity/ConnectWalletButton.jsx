import React from 'react'
import { useSetAtom } from 'jotai'

import { Pressable } from './Button.styles'

export default function ConnectWalletButton({ children, visibleAtom, type = 'button', ...props }) {
  const setVisible = useSetAtom(visibleAtom)
  return (
    <Pressable type={type} {...props} onClick={() => setVisible(true)}>
      {children || "Connect Wallet"}
    </Pressable>
  )
}