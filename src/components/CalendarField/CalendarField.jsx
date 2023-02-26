import { useState, useEffect, useRef, forwardRef } from 'react'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import localeData from 'dayjs/plugin/localeData'
import updateLocale from 'dayjs/plugin/updateLocale'

import { Button, ToggleField } from '/src/components'

import {
  Wrapper,
  StyledLabel,
  StyledSubLabel,
  CalendarHeader,
  CalendarDays,
  CalendarBody,
  Date,
  Day,
} from './CalendarField.styles'

dayjs.extend(isToday)
dayjs.extend(localeData)
dayjs.extend(updateLocale)

const calculateMonth = (month, year, weekStart) => {
  const date = dayjs().month(month).year(year)
  const daysInMonth = date.daysInMonth()
  const daysBefore = date.date(1).day() - weekStart
  const daysAfter = 6 - date.date(daysInMonth).day() + weekStart

  const dates = []
  let curDate = date.date(1).subtract(daysBefore, 'day')
  let y = 0
  let x = 0
  for (let i = 0; i < daysBefore + daysInMonth + daysAfter; i++) {
    if (x === 0) dates[y] = []
    dates[y][x] = curDate.clone()
    curDate = curDate.add(1, 'day')
    x++
    if (x > 6) {
      x = 0
      y++
    }
  }

  return dates
}

const CalendarField = forwardRef(({
  label,
  subLabel,
  id,
  setValue,
  ...props
}, ref) => {
  const weekStart = 0
  const locale = 'en'

  const [type] = useState(1)

  const [dates, setDates] = useState(calculateMonth(dayjs().month(), dayjs().year(), weekStart))
  const [month, setMonth] = useState(dayjs().month())
  const [year, setYear] = useState(dayjs().year())

  const [selectedDates, setSelectedDates] = useState([])
  const [selectingDates, _setSelectingDates] = useState([])
  const staticSelectingDates = useRef([])
  const setSelectingDates = newDates => {
    staticSelectingDates.current = newDates
    _setSelectingDates(newDates)
  }

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

  useEffect(() => setValue(props.name, type ? JSON.stringify(selectedDays) : JSON.stringify(selectedDates)), [type, selectedDays, selectedDates, setValue, props.name])

  useEffect(() => {
    if (dayjs.Ls?.[locale] && weekStart !== dayjs.Ls[locale].weekStart) {
      dayjs.updateLocale(locale, { weekStart })
    }
    setDates(calculateMonth(month, year, weekStart))
  }, [weekStart, month, year, locale])

  return (
    <Wrapper locale={locale}>
      {label && <StyledLabel htmlFor={id}>{label}</StyledLabel>}
      {subLabel && <StyledSubLabel htmlFor={id}>{subLabel}</StyledSubLabel>}
      <input
        id={id}
        type="hidden"
        ref={ref}
        value={type ? JSON.stringify(selectedDays) : JSON.stringify(selectedDates)}
        {...props}
      />

      <CalendarBody>
        {(weekStart ? [...dayjs.weekdaysShort().filter((_, i) => i !== 0), dayjs.weekdaysShort()[0]] : dayjs.weekdaysShort()).map((name, i) =>
          <Date
            key={name}
            $isToday={(weekStart ? [...dayjs.weekdaysShort().filter((_, i) => i !== 0), dayjs.weekdaysShort()[0]] : dayjs.weekdaysShort())[dayjs().day() - weekStart === -1 ? 6 : dayjs().day() - weekStart] === name}
            title={(weekStart ? [...dayjs.weekdaysShort().filter((_, i) => i !== 0), dayjs.weekdaysShort()[0]] : dayjs.weekdaysShort())[dayjs().day() - weekStart === -1 ? 6 : dayjs().day() - weekStart] === name ? 'today' : ''}
            $selected={selectedDays.includes(((i + weekStart) % 7 + 7) % 7)}
            $selecting={selectingDays.includes(((i + weekStart) % 7 + 7) % 7)}
            $mode={mode}
            type="button"
            onKeyPress={e => {
              if (e.key === ' ' || e.key === 'Enter') {
                if (selectedDays.includes(((i + weekStart) % 7 + 7) % 7)) {
                  setSelectedDays(selectedDays.filter(d => d !== ((i + weekStart) % 7 + 7) % 7))
                } else {
                  setSelectedDays([...selectedDays, ((i + weekStart) % 7 + 7) % 7])
                }
              }
            }}
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
