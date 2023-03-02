import { useState, useEffect } from 'react'
import createPalette from 'hue-map'

import {
  Wrapper,
  Label,
  Bar,
  Grade,
} from './Legend.styles'

const Legend = ({
  min,
  max,
  total,
  onSegmentFocus,
}) => {
  const highlight = []
  const colormap = []
  const setHighlight = []

  const [palette, setPalette] = useState([])

  useEffect(() => setPalette(createPalette({
    map: colormap === 'crabfit' ? [[0, [247, 158, 0, 0]], [1, [247, 158, 0, 255]]] : colormap,
    steps: max + 1 - min,
  })), [min, max, colormap])

  return (
    <Wrapper>
      <Label>{min}/{total} {'event:available'}</Label>
      <Bar
        onMouseOut={() => onSegmentFocus(null)}
        onClick={() => setHighlight(!highlight)}
        title={'event:group.legend_tooltip'}
      >
        {[...Array(max + 1 - min).keys()].map(i => i + min).map(i =>
          <Grade
            key={i}
            $color={palette[i]}
            $highlight={highlight && i === max && max > 0}
            onMouseOver={() => onSegmentFocus(i)}
          />
        )}
      </Bar>

      <Label>{max}/{total} {'event:available'}</Label>
    </Wrapper>
  )
}

export default Legend
