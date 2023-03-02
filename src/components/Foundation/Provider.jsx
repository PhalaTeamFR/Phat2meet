import { ChakraProvider, extendTheme } from '@chakra-ui/react'

import { Provider as JotaiProvider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import {
  ReactLocation,
  Router,
} from "@tanstack/react-location"

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

const location = new ReactLocation()

export const FoundationProvider = ({
  children,
  // For Jotai Provider
  initialValues,
  scope,
  // For React-Location
  routes,
}) => {
  return (
    <JotaiProvider scope={scope}>
      <HydrateAtoms initialValues={initialValues}>
        <ChakraProvider theme={theme}>
          <Router
            routes={routes}
            location={location}
          >
            {children}
          </Router>
        </ChakraProvider>
      </HydrateAtoms>
    </JotaiProvider>
  )
}

export default FoundationProvider