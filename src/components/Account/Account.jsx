import { useState, useEffect } from 'react';

import { atom, useAtom, useSetAtom, useAtomValue } from 'jotai'

import { AccountSelectModal } from '../Identity/AccountSelectModal'
import ConnectWalletButton from '../Identity/ConnectWalletButton'


import { rpcEndpointErrorAtom, rpcApiStatusAtom, createApiInstance, rpcEndpointAtom, rpcApiInstanceAtom } from '../Atoms/FoundationBase'

import {
  currentProfileAtom, balanceAtom
} from '../Identity/Atoms'

function Account() {
  const accountSelectModalVisibleAtom = atom(false)

  const [endpointUrl, setEndpointUrl] = useAtom(rpcEndpointAtom)
  const [api, setApi] = useState(null);

  const setStatus = useSetAtom(rpcApiStatusAtom)
  const setError = useSetAtom(rpcEndpointErrorAtom)
  const status = useAtomValue(rpcApiStatusAtom);

  console.groupCollapsed("--------status account-------")
  console.log(status)
  console.groupEnd()

  const setApiInstance = useSetAtom(rpcApiInstanceAtom)

  useEffect(() => {
    setError('')
    if (!endpointUrl) {
      console.log('setStatus -> disconnected')
      setStatus('disconnected')
      setApiInstance(null)
    } else {
      console.log('setStatus -> connecting ')
      setStatus('connecting')

      const fn = async () => {
        const [ws, api] = createApiInstance(endpointUrl)

        api.on('connected', async () => {
          await api.isReady
          setStatus('connected')
          setApi(api);
          console.log(new Date(), 'setStatus -> connected')
        })

        api.on('disconnected', () => {
          console.log(new Date(), 'setStatus -> disconnected')
          setStatus((prev) => prev === 'error' ? prev : 'disconnected')
          setEndpointUrl('')
        })

        api.on('ready', () => console.log(new Date(), 'API ready'))

        const onError = (err) => {
          console.error(new Date(), 'api error', err)
          setStatus('error')
          setError(`RPC Error`)
          setApiInstance(null)
          setEndpointUrl('')
          api.off('error', onError)
          try {
            api.disconnect()
            ws.disconnect()
          } catch (err1) {
            console.log('hey yo', err1)
          }
        }
        api.on('error', onError)

        setTimeout(() => {
          setStatus(prev => {
            console.log(new Date(), 'timeout, let\'s check', prev)
            if (prev !== 'connected') {
              setApiInstance(null)
              setEndpointUrl('')
              console.log(new Date(), 'setStatus -> error')
              setError('RPC Endpoint is unreachable')
              return 'error'
            }
            return prev
          })
        }, 10000)

        await api.isReady
        setApiInstance(api)
      }

      try {
        fn()
      } catch (err) {
        console.log('error', err)
      }
    }
  }, [endpointUrl, setEndpointUrl, setStatus, setApiInstance, setError])


  const profile = useAtomValue(currentProfileAtom)

  console.log("profile currentProfileAtom");
  console.log(profile);


  const balance = useAtomValue(balanceAtom)

  let placeholder = 'Please Select Account First'
  if (profile.connected) {
    placeholder = `${profile.meta.name} (${balance} PHAT)`
  } else if (profile.length === 0) {
    placeholder = 'Please Add Account First'
  }

  return (
    <>
      <AccountSelectModal visibleAtom={accountSelectModalVisibleAtom} />
      <ConnectWalletButton visibleAtom={accountSelectModalVisibleAtom} children={placeholder} />
    </>
  );
}

export default Account;
