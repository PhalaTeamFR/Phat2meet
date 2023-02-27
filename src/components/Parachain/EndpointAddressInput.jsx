import { useState } from 'react'

import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
} from '@chakra-ui/react'
import { useAtom, useAtomValue } from 'jotai'
import { RESET } from 'jotai/utils'
import { setCookie } from 'cookies-next'

import {
  Button,
} from '/src/components'

import { rpcEndpointErrorAtom, rpcApiStatusAtom } from '../Atoms/Foundation'

import { endpointAtom, PARACHAIN_ENDPOINT } from '../../Atoms/endpointsAtom'

export default function EndpointAddressInput({ label }) {
  const [endpoint, setEndpoint] = useAtom(endpointAtom)
  const [input, setInput] = useState(endpoint);
  const [validateError, setValidateError] = useState('');
  const [error, setError] = useAtom(rpcEndpointErrorAtom);
  const status = useAtomValue(rpcApiStatusAtom);

  return (
    <FormControl isInvalid={error !== '' || validateError !== ''}>
      <FormLabel>{label || 'Khala Parachain Endpoint Address'}</FormLabel>
      <InputGroup>
        <Input
          height="43px"
          type='url'
          value={input}
          onChange={ev => {
            setInput(ev.target.value);
            setValidateError('');
            setError('');
          }}
        />
        <Button
          isLoading={status === 'connecting'}
          onClick={() => {
            if (input.indexOf('wss://') !== 0) {
              setValidateError('Invalid RPC Endpoint URL');
              setEndpoint('');
            } else {
              setEndpoint(input)
            }
          }}
        >
          {status === 'connected' && input === endpoint ? 'connected' : 'connect'}
        </Button>
        <Button
          h="1.75rem"
          size="sm"
          onClick={() => {
            const input = PARACHAIN_ENDPOINT
            setEndpoint(RESET)
            setCookie('preferred_endpoint', input, { maxAge: 60 * 60 * 24 * 30 })
          }}
        >
          Reset
        </Button>
      </InputGroup>
      <FormErrorMessage>
        {validateError || error}
      </FormErrorMessage>
    </FormControl>
  )
}
