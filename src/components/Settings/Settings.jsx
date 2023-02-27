import { atom, useAtomValue, useSetAtom } from 'jotai'

import {
  Account
} from '/src/components'

import AccessPointCombo from '../Identity/AccessPointCombo'
import EndpointInfoModal, { connectionDetailModalVisibleAtom } from '../Identity/EndpointInfo'

import {
  SettingsGroup,
} from './Settings.styles'

export const useShowAccountSelectModal = () => {
  const setWalletSelectModalVisible = useSetAtom(walletSelectModalVisibleAtom)
  const setAccountSelectModalVisible = useSetAtom(accountSelectModalVisibleAtom)
  const currentProvider = useAtomValue(lastSelectedWeb3ProviderAtom)
  return useCallback(() => {
    if (currentProvider) {
      setAccountSelectModalVisible(true)
    } else {
      setWalletSelectModalVisible(true)
    }
  }, [setWalletSelectModalVisible, setAccountSelectModalVisible, currentProvider])
}

const Settings = () => {

  const setEndpointInfoVisible = useSetAtom(connectionDetailModalVisibleAtom)

  return (
    <>
      <SettingsGroup>
        <AccessPointCombo onConnectionStatusClick={() => setEndpointInfoVisible(true)} />
        <Account />
      </SettingsGroup>
      <EndpointInfoModal />
    </>
  )
}

export default Settings
