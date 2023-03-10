import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

import {
  Center,
  TextField,
  SelectField,
  Button,
  Legend,
  AvailabilityViewer,
  AvailabilityEditor,
  Error,
} from '/src/components'

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

import timezones from '../../res/timezones.json';

const eventData = {
  "id": "test-111159",
  "times": ['0900', '0915', '0930', '0945', '1000', '1015', '1030', '1045', '1100', '1115', '1130', '1145', '1200', '1215', '1230', '1245', '1300', '1315', '1330', '1345', '1400', '1415', '1430', '1445', '1500', '1515', '1530', '1545', '1600', '1615', '1630', '1645'],
  "dates": ['03032021', '04032021', '05032021', '07032021', '08032021'],
}

const userData = {
  name: 'Ric',
  availability: []
}

const peopleData =
  [{
    name: 'Tioneb',
    availability: [
      '0900-04032021',
      '0915-04032021',
      '0930-04032021',
      '0945-04032021',
      '1000-04032021',
      '1500-04032021',
      '1515-04032021',
      '1230-07032021',
      '1245-07032021',
      '1300-07032021',
      '1315-07032021',
      '1400-08032021',
      '1430-08032021',
    ],
  }]



const Event = () => {

  const { register, handleSubmit } = useForm();
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [user, setUser] = useState();
  const [tab, setTab] = useState(user ? 'you' : 'group');

  const [event, setEvent] = useState(eventData);
  const [people, setPeople] = useState(peopleData);

  const [showNames, setShowNames] = useState(true);

  const toggleShowNames = () => {
    setShowNames(prevState => !prevState);
  };


  console.log('setPeople', people)

  console.log('setUser', user)


  const [error, setError] = useState(null)
  const onSubmit = async data => {
    setError(null)

    console.log('data onSubmit Event', data)

    try {
      const name = data.name

      console.log('name', name)

      if (name.length === 0) {
        return setError('There aren\u2019t any name')
      }

      if (name.length !== 0) {
        setUser(prevUser => {
          const updatedUser = {
            name: name,
            availability: []
          };
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

          <SelectField
            label="Your time zone"
            name="timezone"
            id="timezone"
            inline
            value={timezone}
            onChange={value => setTimezone(value)}
            options={timezones}
          />
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

        </section>
      )}
    </>
  );
};

export default Event;
