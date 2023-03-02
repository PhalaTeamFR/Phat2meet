import { ChakraProvider, extendTheme } from '@chakra-ui/react'

import { Provider as JotaiProvider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'

const theme = extendTheme({
  components: {
    Modal: {
      baseStyle: () => ({
        dialog: {
          bg: "#121212"
        }
      })
    }
  },
  styles: {
    global: () => ({
      body: {
        bg: "",
        color: "",
        div: "",
        fontFamily: ""
      }
    })

  },
});

const HydrateAtoms = ({ initialValues, children }) => {
  // initialising on state with prop on render here
  useHydrateAtoms(initialValues)
  return children
}

export const FoundationProvider = ({
  children,
  // For Jotai Provider
  initialValues,
  scope
}) => {
  return (
    <JotaiProvider scope={scope}>
      <HydrateAtoms initialValues={initialValues}>
        <ChakraProvider theme={theme}>
          {children}
        </ChakraProvider>
      </HydrateAtoms>
    </JotaiProvider>
  )
}

export default FoundationProvider