import { useState, useRef, forwardRef } from 'react'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import localeData from 'dayjs/plugin/localeData'
import updateLocale from 'dayjs/plugin/updateLocale'


import {
  Wrapper,
  StyledLabel,
  StyledSubLabel,
  CalendarBody,
  Date,
} from './CalendarField.styles'

dayjs.extend(isToday)
dayjs.extend(localeData)
dayjs.extend(updateLocale)

const CalendarField = forwardRef(({
  label,
  subLabel,
  id,
  setValue,
  ...props
}, ref) => {
  const weekStart = 1
  const locale = 1

  const [selectedDays, setSelectedDays] = useState([])
  const [selectingDays, _setSelectingDays] = useState([])
  const staticSelectingDays = useRef([])
  const setSelectingDays = newDays => {
    staticSelectingDays.current = newDays
    _setSelectingDays(newDays)
  }

  const startPos = useRef({})
  const staticMode = useRef(null)
  const [mode, _setMode] = useState(staticMode.current)
  const setMode = newMode => {
    staticMode.current = newMode
    _setMode(newMode)
  }


  return (
    <Wrapper locale={locale}>
      {label && <StyledLabel htmlFor={id}>{label}</StyledLabel>}
      {subLabel && <StyledSubLabel htmlFor={id}>{subLabel}</StyledSubLabel>}
      <input
        id={id}
        type="hidden"
        ref={ref}
        value=""
        {...props}
      />
      <CalendarBody>
        {(weekStart ? [...dayjs.weekdaysShort().filter((_, i) => i !== 0), dayjs.weekdaysShort()[0]] : dayjs.weekdaysShort()).map((name, i) =>
          <Date
            key={name}
            $isToday={(weekStart ? [...dayjs.weekdaysShort().filter((_, i) => i !== 0), dayjs.weekdaysShort()[0]] : dayjs.weekdaysShort())[dayjs().day() - weekStart === -1 ? 6 : dayjs().day() - weekStart] === name}
            title={(weekStart ? [...dayjs.weekdaysShort().filter((_, i) => i !== 0), dayjs.weekdaysShort()[0]] : dayjs.weekdaysShort())[dayjs().day() - weekStart === -1 ? 6 : dayjs().day() - weekStart] === name ? 'form.dates.tooltips.today' : ''}
            $selected={selectedDays.includes(((i + weekStart) % 7 + 7) % 7)}
            $selecting={selectingDays.includes(((i + weekStart) % 7 + 7) % 7)}
            $mode={mode}
            type="button"
            onPointerDown={e => {
              startPos.current = i
              setMode(selectedDays.includes(((i + weekStart) % 7 + 7) % 7) ? 'remove' : 'add')
              setSelectingDays([((i + weekStart) % 7 + 7) % 7])
              e.currentTarget.releasePointerCapture(e.pointerId)

              document.addEventListener('pointerup', () => {
                if (staticMode.current === 'add') {
                  setSelectedDays([...selectedDays, ...staticSelectingDays.current])
                } else if (staticMode.current === 'remove') {
                  const toRemove = staticSelectingDays.current
                  setSelectedDays(selectedDays.filter(d => !toRemove.includes(d)))
                }
                setMode(null)
              }, { once: true })
            }}
            onPointerEnter={() => {
              if (staticMode.current) {
                const found = []
                for (let ci = Math.min(startPos.current, i); ci < Math.max(startPos.current, i) + 1; ci++) {
                  found.push(((ci + weekStart) % 7 + 7) % 7)
                }
                setSelectingDays(found)
              }
            }}
          >{name}</Date>
        )}
      </CalendarBody>
    </Wrapper>
  )
})

export default CalendarField
