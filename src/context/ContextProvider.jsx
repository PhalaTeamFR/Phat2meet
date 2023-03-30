import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { Keyring } from '@polkadot/api';
import { web3Enable } from '@polkadot/extension-dapp'
import { PinkContractPromise, OnChainRegistry } from '@phala/sdk';
import metadata from '../contrat/metadata.json';
import { rpcApiInstanceAtom } from '../components/Atoms/FoundationBase';

import toast, { Toaster } from "react-hot-toast";

import {
  contractIdAtom, currentAccountAtom
} from '../components/Identity/Atoms'

export const useContract = () => {
  const [contract, setContract] = useState();
  const [phatMessage, setPhatMessage] = useState();
  const [queryPair, setQueryPair] = useState();
  const [account, setStateAccount] = useState(undefined);

  const profile = useAtomValue(currentAccountAtom)
  const api = useAtomValue(rpcApiInstanceAtom)

  let lsAccount = undefined;

  useEffect(() => {
    if (api) {
      loadContract()
      loadContext()
    }
  }, [api])

  useEffect(() => {
    if (contract) {
      doQuery();
    }
  }, [contract]);

  const loadContext = () => {
    setQueryPair(new Keyring({ type: 'sr25519' }).addFromUri("//Alice"))
    lsAccount = profile
    if (typeof lsAccount !== "undefined") {
      setStateAccount(lsAccount)
    }
  }

  const loadContract = async () => {

    try {

      const contractId = contractIdAtom
      console.log('contractId', contractId)

      const phatRegistry = await OnChainRegistry.create(api)

      const abi = JSON.parse(JSON.stringify(metadata))
      const contractKey = await phatRegistry.getContractKey(contractId)

      console.log("contractKey", contractKey)
      // --> 0x1a83b5232d06181c5056d150623e24865b32dc91a6e1baa742087a005ff8fb1b

      const contract = new PinkContractPromise(api, phatRegistry, abi, contractId, contractKey)

      console.log("contract:", contract.abi.messages.map((e) => { return e.method }))
      // contract: Array [ "get", "setValue" ]

      setContract(contract)
      console.log("Contract loaded successfully");
    } catch (err) {
      console.error("Error in contract loading", err);
      throw err;
    }

  };

  const getInjector = async () => {
    const injector = await web3Enable('phat2meet')
    console.log("injector web3Enable", injector)
    return injector
  }

  const getSigner = async (profile) => {
    const injector = await getInjector(profile)
    console.log("getInjector", injector)
    const signer = injector[0].signer;
    console.log("injector.signer", injector[0].signer)
    return signer;
  };

  // query vith beta sdk
  const doQuery = async () => {
    // for a query (readonly) we use the "queryPair" account, init with "//Alice"
    const message = await contract.query.get(queryPair);
    setPhatMessage(message.output.toHuman());
    console.log('message:', message.output.toHuman())
  }

  // function to send a tx, in this example we call setValue
  const doTx = async (message) => {
    console.log('doTxmessage', message)
    if (!contract) return;

    const signer = await getSigner(profile);
    console.log("getSigner", signer)
    // costs estimation
    const { gasRequired, storageDeposit } = await contract.query['setValue']({ account: profile, signer }, message)
    console.log('gasRequired & storageDeposit: ', gasRequired, storageDeposit)
    // transaction / extrinct
    const options = {
      gasLimit: gasRequired.refTime,
      storageDepositLimit: storageDeposit.isCharge ? storageDeposit.asCharge : null,
    }
    const tx = await contract.tx
      .setValue(options, message)
      .signAndSend(profile.address, { signer }, ({ events = [], status, txHash }) => {
        console.log('status', status)
        if (status.isInBlock) {
          toast.success("In Block", {
            duration: 6000,
          })
        }
        if (status.isCompleted) {
          toast.success("Completed")
        }
        if (status.isFinalized) {

          toast.success(`Transaction included at blockHash ${status.asFinalized}`, {
            duration: 6000,
          })

          toast.success(`Transaction hash ${txHash.toHex()}`, {
            duration: 6000,
          })

          // Loop through Vec<EventRecord> to display all events
          events.forEach(({ phase, event: { data, method, section } }) => {
            console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
          });
        }
      })
  };

  return {
    contract,
    phatMessage,
    doTx,
  };
};