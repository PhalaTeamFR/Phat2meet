import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { Keyring } from '@polkadot/api';
import { web3Enable } from '@polkadot/extension-dapp'
import { PinkContractPromise, OnChainRegistry } from '@phala/sdk';
import metadata from '../contrat/metadata.json';
import { rpcApiInstanceAtom } from '../components/Atoms/FoundationBase';

import toast from "react-hot-toast";

import {
  contractIdAtom, currentAccountAtom
} from '../components/Identity/Atoms'

export const useContract = () => {
  const [contract, setContract] = useState();
  const [phatMessage, setPhatMessage] = useState();
  const [queryPair, setQueryPair] = useState();
  const [account, setAccount] = useState(undefined);

  const profile = useAtomValue(currentAccountAtom)
  const api = useAtomValue(rpcApiInstanceAtom)

  const [txStatus, setTxStatus] = useState("");
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  useEffect(() => {
    if (api) {
      loadContract();
      loadContext();
    }
  }, [api]);

  useEffect(() => {
    if (contract) {
      doQuery();
    }
  }, [contract]);

  useEffect(() => {
    if (!isLoadingStatus) {
      doQuery();
    }
  }, [isLoadingStatus]);

  const loadContext = () => {
    setQueryPair(new Keyring({ type: 'sr25519' }).addFromUri("//Alice"));
    const localStorageAccount = profile;
    if (localStorageAccount) {
      setAccount(localStorageAccount);
    }
  };

  const loadContract = async () => {
    try {
      const contractId = contractIdAtom;
      const phatRegistry = await OnChainRegistry.create(api);
      const abi = JSON.parse(JSON.stringify(metadata));
      const contractKey = await phatRegistry.getContractKey(contractId);
      const loadedContract = new PinkContractPromise(api, phatRegistry, abi, contractId, contractKey);
      setContract(loadedContract);

      console.log("contract:", contract.abi.messages.map((e) => { return e.method }))
      // contract: Array [ "get", "setValue" ]
    } catch (err) {
      console.error("Error in contract loading", err);
      throw err;
    }
  };

  const getInjector = async () => {
    const injector = await web3Enable('phat2meet');
    return injector;
  };

  const getSigner = async (profile) => {
    const injector = await getInjector(profile);
    const signer = injector[0].signer;
    return signer;
  };

  // query vith beta sdk
  const doQuery = async () => {
    // for a query (readonly) we use the "queryPair" account, init with "//Alice"
    const message = await contract.query.getLastMeetingCreated(queryPair);
    setPhatMessage(JSON.parse(message.output.value.value).name);
    console.log('message getLastMeetingCreated:', JSON.parse(message.output.value.value).hour_ranges)
  };

  // function to send a tx, in this example we call setValue
  const doTx = async (message) => {
    if (!contract) return;
    setIsLoadingStatus(true);
    const signer = await getSigner(profile);
    const { gasRequired, storageDeposit } = await contract.query['setValue']({ account: profile, signer }, message);

    // transaction / extrinct
    const options = {
      gasLimit: gasRequired.refTime,
      storageDepositLimit: storageDeposit.isCharge ? storageDeposit.asCharge : null,
    };
    const tx = await contract.tx
      .setValue(options, message)
      .signAndSend(profile.address, { signer }, (result) => {
        if (result.status.isInBlock) {
          setTxStatus(`In Block: Transaction included at blockHash ${result.status.asInBlock}`);
          toast.success("In Block", { duration: 6000 });
        } else if (result.status.isInvalid) {
          tx();
          reject('Invalid transaction');
          toast.error("Invalid transaction");
        }


        if (result.status.isCompleted) {
          setTxStatus("Completed");
          toast.success("Completed");
        }
        if (result.status.isFinalized) {
          setTxStatus(true);
          setIsLoadingStatus(false);
          toast.success(`Transaction included at blockHash ${result.status.asFinalized}`, {
            duration: 6000,
          });

          toast.success(`Transaction hash ${result.txHash.toHex()}`, {
            duration: 6000,
          });

          // Loop through Vec<EventRecord> to display all events
          result.events.forEach(({ phase, event: { data, method, section } }) => {
            console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
          });
        }
      });
  };

  return {
    contract,
    phatMessage,
    doTx,
    txStatus,
    isLoadingStatus,
    doQuery,
  };
};