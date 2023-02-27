import { useState, useEffect } from 'react'
import {
  Button,
  Input,
  InputGroup,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputRightElement,
} from "@chakra-ui/react";
import { ApiPromise, WsProvider } from '@polkadot/api'

import { useAtom, useAtomValue } from 'jotai'

import { rpcEndpointAtom, rpcEndpointErrorAtom, rpcApiStatusAtom } from '../Atoms/Foundation'

import {
  StyledMain,
} from './ProviderInfo.styles'

const RpcEndpointField = () => {
  const [endpoint, setEndpoint] = useAtom(rpcEndpointAtom);
  const [input, setInput] = useState(endpoint);
  const [validateError, setValidateError] = useState('');
  const [error, setError] = useAtom(rpcEndpointErrorAtom);
  const status = useAtomValue(rpcApiStatusAtom);

  return (
    <FormControl isInvalid={error !== '' || validateError !== ''}>
      <FormLabel style={{ backgroundColor: "#000", color: "#f3f3f3", padding: "4px", width: "full", textTransform: "uppercase" }}>RPC Endpoint</FormLabel>
      <div style={{ padding: "0 4px" }}>
        <InputGroup>
          <Input
            style={{ paddingRight: "5.5rem", textTransform: "lowercase", fontFamily: "monospace", backgroundColor: "gray-200", outline: "none" }}
            type='text'
            value={input}
            onChange={ev => {
              setInput(ev.target.value);
              setValidateError('');
              setError('');
            }}
          />
          <InputRightElement width="5.6rem" marginRight="1">
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
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>
          {validateError || error}
        </FormErrorMessage>
      </div>
    </FormControl>
  );
}


const ProviderInfo = () => {
  const [result, setResult] = useState("");
  const [endpoint] = useAtom(rpcEndpointAtom)

  useEffect(() => {
    async function main() {
      // Initialise the provider to connect to the local node
      const PROVIDER_URL = endpoint;
      const wsProvider = new WsProvider(PROVIDER_URL);

      // Create the API and wait until ready
      const api = await ApiPromise.create({ provider: wsProvider });


      // Retrieve the chain & node information information via rpc calls
      const [chain, nodeName, nodeVersion] = await Promise.all([
        api.rpc.system.chain(),
        api.rpc.system.name(),
        api.rpc.system.version()
      ]);

      setResult(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);
    }

    main();
  }, []);

  return (
    <>
      <StyledMain>
        {result}
        <br />
        {endpoint}
        <br />
        <RpcEndpointField />
      </StyledMain>
    </>
  )
}

export default ProviderInfo
