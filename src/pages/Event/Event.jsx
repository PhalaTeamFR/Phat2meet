import {
  AvailabilityViewer,
} from '/src/components'


import {
  StyledMain,
  TitleSmall,
  TitleLarge,
} from '../Home/Home.styles'

const eventData = {
  "id": "test-111159",
  "times": [
    "0800-0",
    "0900-0",
    "1000-0",
    "1100-0",
    "1200-0",
    "1300-0",
    "1400-0",
    "1500-0"
  ],
  "name": "test",
  "visited": 1677768613,
  "timezone": "Europe/Paris",
  "created": 1677768612
}


const Event = () => {

  return (
    <>
      <StyledMain>
        <TitleSmall>Event</TitleSmall>
        <TitleLarge>Phat2meet</TitleLarge>
      </StyledMain>
      <StyledMain>
        <section id="group">
          <AvailabilityViewer
            dates={['03032021', '04032021', '05032021', '07032021', '08032021']}
            times={[
              '0900',
              '0915',
              '0930',
              '0945',
              '1000',
              '1015',
              '1030',
              '1045',
              '1100',
              '1115',
              '1130',
              '1145',
              '1200',
              '1215',
              '1230',
              '1245',
              '1300',
              '1315',
              '1330',
              '1345',
              '1400',
              '1415',
              '1430',
              '1445',
              '1500',
              '1515',
              '1530',
              '1545',
              '1600',
              '1615',
              '1630',
              '1645',
            ]}
            people={[{
              name: 'Phala',
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
            }]}
          />
        </section>
      </StyledMain>

    </>
  )
}

export default Event
