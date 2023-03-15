import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';

import { useAtom } from 'jotai'

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
} from '../Home/Home.styles'

import {
  currentProfileAtom,
} from '../../components/Identity/Atoms'

// DATA

const eventData2 = {
  "id": "test-111159",
  "times": ['0900', '0915', '0930', '0945', '1000', '1015', '1030', '1045', '1100', '1115', '1130', '1145', '1200', '1215', '1230', '1245', '1300', '1315', '1330', '1345', '1400', '1415', '1430', '1445', '1500', '1515', '1530', '1545', '1600', '1615', '1630', '1645'],
  "dates": ['03032021', '04032021', '05032021', '07032021', '08032021'],
}

const eventData = {
  "times": [],
  "dates": []
};

const userData = {
  name: 'Ric',
  availability: []
}

const peopleData =
  [{
    name: 'Tioneb',
    availability: [
      '0900-04032023',
      '0915-04032023',
      '0930-04032023',
      '0945-04032023',
      '1000-04032023',
      '1500-04032023',
      '1515-04032023',
      '1230-07032023',
      '1245-07032023',
      '1300-07032023',
      '1315-07032023',
      '1400-08032023',
      '1430-08032023',
    ],
  }]

const dateData = [{ start: 1677798000, end: 1678230000 }];

const timeData = [{ start: "0900", end: "1645" }];

const TimeLocale = "fr-FR"

// DATA END

dateData.forEach((item) => {
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

// Converting timeData time slots to 15 minutes in "HHMM" format for each time slot in timeData.
for (let i = 0; i < timeData.length; i++) {
  const { start, end } = timeData[i];
  const { hours: startHours, minutes: startMinutes } = parseTime(start);
  const { hours: endHours, minutes: endMinutes } = parseTime(end);

  let startTime = createTime(startHours, startMinutes);
  const endTime = createTime(endHours, endMinutes);

  while (startTime <= endTime) {
    const hours = padZero(startTime.getHours());
    const minutes = padZero(startTime.getMinutes());

    eventData.times.push(`${hours}${minutes}`);

    startTime = incrementTimeByMinutes(startTime, 15);
  }
}
//

console.log('eventData', eventData);

const Event = () => {

  const { register, handleSubmit } = useForm();
  const [user, setUser] = useState();
  const [tab, setTab] = useState(user ? 'you' : 'group');

  const [event, setEvent] = useState(eventData);
  const [people, setPeople] = useState(peopleData);

  const [showNames, setShowNames] = useState(true);
  const [currentAccount] = useAtom(currentProfileAtom);

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
                >Login</Button>
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
    </>
  );
};

export default Event;
