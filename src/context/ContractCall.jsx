import React, { useContext, useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
// Phala sdk beta!!
// install with `yarn add @phala/sdk@beta`
// tested and working with @phala/sdk@0.4.0-nightly-20230318
import { PinkContractPromise, OnChainRegistry } from '@phala/sdk'

import { AppContext } from "./ContextProvider"
import { useEventContext } from './EventContext';


import metadata from '../contrat/metadata.json';

import { rpcApiInstanceAtom } from '../components/Atoms/FoundationBase';


export function ContractCall() {

  const [contract, setContract] = useState();
  const [phatLastMeetingCreated, setLastMeetingCreated] = useState();

  const { setHourRanges, setSlotsRanges, setParticipants } = useEventContext();

  const { queryPair } = useContext(AppContext);


  const api = useAtomValue(rpcApiInstanceAtom)

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


  return (
    <>
      <button disabled={!contract} onClick={doQuery}>
        do Query
      </button>
    </>
  );
};

