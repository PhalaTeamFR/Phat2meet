import {
  TextField,
  Button,
  Center,
  CalendarField,
  TimeRangeField,
} from '/src/components'

import {
  StyledMain,
  TitleSmall,
  TitleLarge,
} from './Home.styles'


const Home = () => {

  return (
    <>
      <StyledMain>
        <TitleSmall>Create a</TitleSmall>
        <TitleLarge>Phat2meet</TitleLarge>
      </StyledMain>
      <StyledMain>
        <TextField
          label="Event a name"
          subLabel=""
          type="text"
          name="name"
          id="name"
        />
      </StyledMain>
      <StyledMain>
        <CalendarField
          label="What dates might work?"
          subLabel="Click and drag to select"
          id="dates"
          required
        />

        <TimeRangeField
          label="What times might work?"
          subLabel="Click and drag to select a time range"
          id="times"
          required
        />
      </StyledMain>
      <Center>
        <Button>{"Create"}</Button>
      </Center>
    </>
  )
}

export default Home
