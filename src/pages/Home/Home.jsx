import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Keyring } from '@polkadot/api'
import { PinkContractPromise, OnChainRegistry } from '@phala/sdk'
import { useAtomValue } from 'jotai'
import metadata from '../../contrat/metadata.json';

import {
  rpcApiInstanceAtom
} from '../../components/Atoms/FoundationBase'

import {
  contractIdAtom, currentAccountAtom
} from '../../components/Identity/Atoms'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import {
  TextField,
  Button,
  Center,
  CalendarField,
  TimeRangeField,
  Error,
} from '/src/components'

import {
  StyledMain,
  TitleSmall,
  TitleLarge,
  CreateForm
} from './Home.styles'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)


const Home = () => {
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const onSubmit = async data => {
    setIsLoading(true)
    setError(null)

    console.log('data onSubmit home', data)

    try {
      const { start, end } = JSON.parse(data.times)
      const dates = JSON.parse(data.dates)

      if (dates.length === 0) {
        return setError('There aren\u2019t any dates selected')
      }

      const isSpecificDates = typeof dates[0] === 'string' && dates[0].length === 8
      if (start === end) {
        return setError('The start and end times can\u2019t be the same')
      }

      const times = dates.reduce((times, date) => {
        const day = []
        for (let i = start; i < (start > end ? 24 : end); i++) {
          if (isSpecificDates) {
            day.push(
              dayjs.tz(date, 'DDMMYYYY', data.timezone)
                .hour(i).minute(0).utc().format('HHmm-DDMMYYYY')
            )
          } else {
            day.push(
              dayjs().tz(data.timezone)
                .day(date).hour(i).minute(0).utc().format('HHmm-d')
            )
          }
        }
        if (start > end) {
          for (let i = 0; i < end; i++) {
            if (isSpecificDates) {
              day.push(
                dayjs.tz(date, 'DDMMYYYY', data.timezone)
                  .hour(i).minute(0).utc().format('HHmm-DDMMYYYY')
              )
            } else {
              day.push(
                dayjs().tz(data.timezone)
                  .day(date).hour(i).minute(0).utc().format('HHmm-d')
              )
            }
          }
        }
        return [...times, ...day]
      }, [])

      if (times.length === 0) {
        return setError('home:form.errors.no_time')
      }

    } catch (e) {
      setError('Something went wrong. Please try again later.')
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  // contract
  const [contract, setContract] = useState();
  const [phatMessage, setPhatMessage] = useState();
  const [queryPair, setQueryPair] = useState();
  const [account, setStateAccount] = useState(undefined);

  const profile = useAtomValue(currentAccountAtom)
  const api = useAtomValue(rpcApiInstanceAtom)

  let lsAccount = undefined;

  console.log("profile loadContext");
  console.log(profile);

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
      console.log("Error in contract loading", err);
      throw err;
    }

  };

  // query vith beta sdk
  const doQuery = async () => {
    // for a query (readonly) we use the "queryPair" account, init with "//Alice"
    const message = await contract.query.get(queryPair);
    setPhatMessage(message.output.toHuman());
    console.log('message:', message.output.toHuman())
  }

  return (
    <>
      <StyledMain>
        <TitleSmall>Create a</TitleSmall>
        <TitleLarge>Phat2meet</TitleLarge>
      </StyledMain>
      <StyledMain>
        message :
        <span>{phatMessage}</span>
      </StyledMain>

      <StyledMain>
        <Error open={!!error} onClose={() => setError(null)}>{error}</Error>
        <CreateForm onSubmit={handleSubmit(onSubmit)} id="create">
          <TextField
            label="Event a name"
            subLabel=""
            type="text"
            id="name"
            {...register('name')}
          />
          <CalendarField
            label="What dates might work?"
            subLabel="Click and drag to select"
            id="dates"
            required
            setValue={setValue}
            {...register('dates')}
          />
          <TimeRangeField
            label="What times might work?"
            subLabel="Click and drag to select a time range"
            id="times"
            required
            setValue={setValue}
            {...register('times')}
          />
          <Center>
            <Button type="submit" isLoading={isLoading} >{"Create"}</Button>
          </Center>
        </CreateForm>
      </StyledMain>
    </>
  )
}

export default Home
