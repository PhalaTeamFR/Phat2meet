import React, { useContext, useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
// Phala sdk beta!!
// install with `yarn add @phala/sdk@beta`
// tested and working with @phala/sdk@0.4.0-nightly-20230318
import { PinkContractPromise, OnChainRegistry } from '@phala/sdk'
import toast, { Toaster } from 'react-hot-toast';

import {
  Button,
  Error,
} from '../components/'

import { AppContext } from "./ContextProvider"
import { useEventContext } from './EventContext';

import metadata from '../contrat/metadata.json';

import { rpcApiInstanceAtom } from '../components/Atoms/FoundationBase';

import {
  currentAccountAtom
} from '../components/Identity/Atoms'

export function ContractCall({ user }) {

  const profile = useAtomValue(currentAccountAtom)

  const [contract, setContract] = useState();
  const [phatLastMeetingCreated, setLastMeetingCreated] = useState();

  const { setHourRanges, setSlotsRanges, setParticipants } = useEventContext();

  const { account, setAccount, queryPair, getSigner } = useContext(AppContext);

  useEffect(() => {
    if (profile) {
      setAccount(profile)
    }
  }, [profile])

  const api = useAtomValue(rpcApiInstanceAtom)

  const [txStatus, setTxStatus] = useState("");
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  const createUserMessage = (user) => {
    if (!user) return null;

    const availibility = user.availability;

    const message = {
      meeting_id: 1, // You will need to determine the appropriate value for meeting_id
      user_id: user.address,
      user_name: user.name,
      availibility: availibility,
    };

    return JSON.stringify(message);
  };

  const userMessage = createUserMessage(user);

  useEffect(() => {
    if (api) {
      loadContract()
    }
  }, [api])

  useEffect(() => {
    if (contract) {
      doQuery();
    }
  }, [contract]);

  const loadContract = async () => {

    try {

      //const pruntimeURL="https://phat-fr.01.do/node-1/"

      // contract ID on phat-cb (contract address on polkadot.js.org/apps)
      const contractId = "0xfcfe1813af28dda3933cba418ea45acd6bd7188d5b1a0108e83ec1d14fa8f290"
      // codeHash on phat-cb
      //   const codeHash = "0x021907a3b977388df0cf9d098438c42d0369cc0791ddf6b4043d69de11d57dd8"

      const phatRegistry = await OnChainRegistry.create(api)

      const abi = JSON.parse(JSON.stringify(metadata))
      const contractKey = await phatRegistry.getContractKey(contractId)

      const contract = new PinkContractPromise(api, phatRegistry, abi, contractId, contractKey)

      console.log("contract:", contract.abi.messages.map((e) => { return e.method }))
      // contract: Array ['initParam', 'getPlatformInfo', 'getObjectStr', 'putObjectStr', 'createMeeting', 'getLastMeetingId', 'getLastMeetingCreated', 'getMeeting', 'addSlots']

      setContract(contract)
      console.log("Contract loaded successfully");
    } catch (err) {
      console.log("Error in contract loading", err);
      throw err;
    }
  };

  // query vith beta sdk
  const doQuery = async () => {
    // for a query (readonly) we use the "queryPair" account, init with "//Alice"
    const message = await contract.query.getLastMeetingCreated(queryPair);
    console.log('message message:', JSON.parse(message.output.value.value))

    const parsedData = JSON.parse(message.output.value.value);
    setLastMeetingCreated(parsedData);

    const hourRangesData = parsedData.hour_ranges;
    const slotsRangesData = parsedData.slots_ranges;
    const participantsData = parsedData.participants;

    setHourRanges(hourRangesData);
    setSlotsRanges(slotsRangesData);
    setParticipants(participantsData);

    console.log('message getLastMeetingCreated:', JSON.parse(message.output.value.value).hour_ranges)
  };


  // function to send a tx, in this example we call addSlots
  const doTx = async (message) => {
    console.log(message)
    if (!contract) return;
    setIsLoadingStatus(true);
    const signer = await getSigner(account);
    // costs estimation
    const { gasRequired, storageDeposit } = await contract.query['addSlots']({ account: account, signer }, message)
    console.log('gasRequired & storageDeposit: ', gasRequired, storageDeposit)
    // transaction / extrinct
    const options = {
      gasLimit: gasRequired.refTime,
      storageDepositLimit: storageDeposit.isCharge ? storageDeposit.asCharge : null,
    }

    const tx = await contract.tx
      .addSlots(options, message)
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

  return (
    <>
      <div><Toaster /></div>
      {(!account?.address) && (
        <Error>Please log in with your wallet first</Error>
      )}
      <Button disabled={!contract} onClick={doQuery}>
        do Query
      </Button>
      <Button
        disabled={!(contract && profile?.address && userMessage && account)}
        isLoading={isLoadingStatus}
        onClick={() => doTx(userMessage)}
      >
        {"Send TX"}
      </Button><br></br>
      <br></br>
      txStatus :
      <div>{txStatus}</div>
    </>
  );
};

