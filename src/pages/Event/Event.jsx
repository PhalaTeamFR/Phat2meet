import { useForm } from 'react-hook-form';
import { useState, useEffect, useContext } from 'react';

import { useAtom } from 'jotai'

import { useEventContext } from '../../context/EventContext';

import {
  Center,
  TextField,
  Button,
  Legend,
  AvailabilityViewer,
  AvailabilityEditor,
  Error,
} from '/src/components'

import {
  parseTime,
  createTime,
  padZero,
  incrementTimeByMinutes,
  toDateLocaleString,
  incrementDateByDays,
} from "./TimeUtils";

import {
  LoginForm,
  LoginSection,
  Info,
  Tabs,
  Tab,
} from './EventStyles';

import {
  StyledMain,
  TitleSmall,
  TitleLarge,
  StyledMatrix,
} from '../Home/Home.styles'

import {
  currentProfileAtom,
} from '../../components/Identity/Atoms'

import { ContractCall } from "../../context/ContractCall";
import { convertParticipantsData } from "./ConvertParticipants";

// DATA



//0404202 0900
//04042023 1515
// heure en UTC
//JSON.stringify(peopleData)

const peopleData =
  []

const TimeLocale = "fr-FR"

// DATA END

const eventData = {
  "times": [],
  "dates": []
};

console.log('eventData', eventData)



const Event = () => {
  //const days_ranges = [{ start: 1680559200, end: 1680904800 }, { start: 1681077600, end: 1681423200 }];
  //const hour_ranges = [{ start: "0900", end: "1245" }, { start: "1500", end: "1645" }];
  const { hourRanges, slotsRanges, participants } = useEventContext();

  console.log('hourRanges useEventContext', hourRanges)
  console.log('slotsRanges useEventContext', slotsRanges)


  useEffect(() => {
    if (participants.length > 0) {
      const convertedData = convertParticipantsData(participants);
      setPeople(convertedData);
    }
  }, [participants]);

  //
  slotsRanges.forEach((item) => {
    const startDate = new Date(item.start * 1000);
    const endDate = new Date(item.end * 1000);

    let currentDate = startDate;

    while (currentDate.getTime() < endDate.getTime()) {
      const dateToAdd = toDateLocaleString(currentDate, TimeLocale);

      if (!eventData.dates.includes(dateToAdd)) {
        eventData.dates.push(dateToAdd);
      }

      currentDate = incrementDateByDays(currentDate, 1);
    }
  });
  //
  // Converting hour_ranges time slots to 15 minutes in "HHMM" format for each time slot in hour_ranges.
  eventData.times = hourRanges.reduce((acc, range) => {
    const { start, end } = range;
    const { hours: startHours, minutes: startMinutes } = parseTime(start);
    const { hours: endHours, minutes: endMinutes } = parseTime(end);

    let startTime = createTime(startHours, startMinutes);
    const endTime = createTime(endHours, endMinutes);

    while (startTime <= endTime) {
      const hours = padZero(startTime.getHours());
      const minutes = padZero(startTime.getMinutes());

      acc.push(`${hours}${minutes}`);

      startTime = incrementTimeByMinutes(startTime, 15);
    }

    return acc;
  }, []);
  //

  const peopleData = convertParticipantsData(participants);

  const { register, handleSubmit } = useForm();
  const [user, setUser] = useState();
  const [tab, setTab] = useState(user ? 'you' : 'group');

  const [event, setEvent] = useState(eventData);
  const [people, setPeople] = useState(peopleData);

  const [showNames, setShowNames] = useState(true);
  const [currentAccount] = useAtom(currentProfileAtom);

  console.log('event', event)

  const toggleShowNames = () => {
    setShowNames(prevState => !prevState);
  };

  console.log('setPeople', people)
  console.log('setUser', user)

  const onChangeAvailability = availability => {
    setUser(user => ({
      ...user,
      availability
    }));

    const index = people.findIndex(p => p.name === user.name);
    const updatedUser = {
      ...user,
      availability
    };

    const updatedPeople = [...people];
    updatedPeople.splice(index, 1, updatedUser);

    setPeople(updatedPeople);
  };

  const [error, setError] = useState(null)
  const onSubmit = async data => {
    setError(null)

    console.log('data onSubmit Event', data)

    try {
      const name = data.name

      console.log('name', name)

      // Check if selectedWallet.address is empty
      if (!currentAccount.address) {
        return setError('Please log in with your wallet first')
      }

      // Check if name is empty
      if (!name.length) {
        return setError('There aren\u2019t any name')
      }

      if (name.length !== 0) {
        setUser(prevUser => {
          const updatedUser = {
            name: name,
            address: currentAccount.address,
            availability: []
          };

          // Save user data to localStorage
          saveUserDataToLocalStorage(updatedUser);

          setPeople(prevPeople => prevPeople.concat(updatedUser));
          return updatedUser;
        });
      }

    } catch (e) {
      setError('Something went wrong. Please try again later.')
      console.error("errrooorr", e)
    } finally {

    }
  }

  // Monitor changes to currentAccount.connected and dump user if connected is false:
  useEffect(() => {
    function handleAccountChange() {
      if (!currentAccount.connected) {
        setUser(null);
      }
    }

    handleAccountChange();
  }, [currentAccount]);
  ////


  // Save user data to localStorage using wallet address as identifier
  const saveUserDataToLocalStorage = (userData) => {
    localStorage.setItem(userData.address, JSON.stringify(userData));
  };

  const getUserDataFromLocalStorage = (address) => {
    const userData = localStorage.getItem(address);
    return userData ? JSON.parse(userData) : null;
  };

  useEffect(() => {
    if (currentProfileAtom.address) {
      const existingUserData = getUserDataFromLocalStorage(currentProfileAtom.address);
      if (existingUserData) {
        setUser(existingUserData);
      } else {
        // Reset user data if wallet address changes and no existing data is found
        setUser(null);
      }
    }
  }, [currentProfileAtom.address]);
  ////


  const handleUpdate = () => {
    if (user) {
      saveUserDataToLocalStorage(user);
    }
  };

  return (
    <>
      <StyledMain>
        <TitleSmall>Event</TitleSmall>
        <TitleLarge>Phat2meet</TitleLarge>
      </StyledMain>
      <StyledMain>
        <ContractCall user={user} />
      </StyledMain>
      <LoginSection id="login">
        <StyledMain>
          {!user && (
            <>
              <h2>Sign in to add your availability</h2>
              <Error open={!!error} onClose={() => setError(null)}>{error}</Error>
              <LoginForm onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  label="Your name"
                  type="text"
                  name="name"
                  id="name"
                  inline
                  {...register('name')}
                />

                <Button type="submit"
                >Save</Button>
              </LoginForm>
              <Info>These details are only for this event. Use a password to prevent others from changing your availability.</Info>
            </>
          )}
        </StyledMain>
      </LoginSection>
      <StyledMain>
        {user?.name && user?.availability && (
          <Button onClick={toggleShowNames}>{showNames ? 'Hide other people\'s availabilities' : 'See the availability of other people'}</Button>
        )}
      </StyledMain>

      <StyledMain>
        <Tabs>
          <Tab
            href="#you"
            onClick={e => {
              e.preventDefault();
              if (user) {
                setTab('you');
              }
            }}
            selected={tab === 'you'}
            disabled={!user}
            title={user ? '' : 'Login to set your availability'}
          >Your availability</Tab>
          <Tab
            href="#group"
            onClick={e => {
              e.preventDefault();
              setTab('group');
            }}
            selected={tab === 'group'}
          >Group availability</Tab>
        </Tabs>
      </StyledMain>

      <StyledMatrix>
        {tab === 'group' ? (
          <section id="group">
            <StyledMain>
              <Legend min={0} max={people.length} />
              <Center>Hover or tap the calendar below to see who is available</Center>
            </StyledMain>
            <AvailabilityViewer
              dates={event?.dates ?? []}
              times={event?.times ?? []}
              people={showNames ? people : [user]}
            />
          </section>
        ) : (
          <section id="you">
            <StyledMain>
              <Center>Click and drag the calendar below to set your availabilities</Center>
            </StyledMain>
            <AvailabilityEditor
              dates={event?.dates ?? []}
              times={event?.times ?? []}
              value={user?.availability}
              onChange={onChangeAvailability}
            />
            <StyledMain>
              <Button onClick={handleUpdate}>Update availabilities</Button>
            </StyledMain>
          </section>
        )}
      </StyledMatrix>
    </>
  );
};

export default Event;
