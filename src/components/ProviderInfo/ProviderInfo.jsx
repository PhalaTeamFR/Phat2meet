import { useState, useEffect } from 'react'

import { ApiPromise, WsProvider } from '@polkadot/api'

import { useAtom } from 'jotai'

import { rpcEndpointAtom } from '../Atoms/FoundationBase'

import {
  StyledMain,
} from './ProviderInfo.styles'

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
        Provider Info :<br />
        {result}
        <br />
        {endpoint}
        <br />
      </StyledMain>
    </>
  )
}

export default ProviderInfo
