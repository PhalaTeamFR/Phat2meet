import { useState } from 'react'

import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  FormErrorMessage,
} from '@chakra-ui/react'
import { useAtom, useAtomValue } from 'jotai'
import { setCookie } from 'cookies-next'

import {
  Button,
} from '/src/components'

import { rpcEndpointErrorAtom, rpcApiStatusAtom, rpcEndpointAtom } from '../Atoms/FoundationBase'

export default function EndpointAddressInput({ label }) {

  const [endpoint, setEndpoint] = useAtom(rpcEndpointAtom)
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
          isDisabled={status === 'connected' && input === endpoint}
          onClick={() => {
            if (input.indexOf('wss://') !== 0) {
              setValidateError('Invalid RPC Endpoint URL');

            } else {
              setEndpoint(input)
            }
          }}
        >
          {status === 'connected' && input === endpoint ? 'connected' : 'connect'}
        </Button>
      </InputGroup>
      <FormErrorMessage>
        {validateError || error}
      </FormErrorMessage>
    </FormControl>
  )
}
