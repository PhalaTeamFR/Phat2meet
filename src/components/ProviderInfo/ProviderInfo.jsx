import { Settings as SettingsIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { ApiPromise, WsProvider } from '@polkadot/api'

import {
  StyledMain,
} from './ProviderInfo.styles'

const ProviderInfo = () => {
  const [result, setResult] = useState("");

  useEffect(() => {
    async function main() {
      // Initialise the provider to connect to the local node
      const provider = new WsProvider('wss://poc5.phala.network/ws');

      // Create the API and wait until ready
      const api = await ApiPromise.create({ provider });

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
      </StyledMain>
    </>
  )
}

export default ProviderInfo
