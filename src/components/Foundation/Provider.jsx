import { Provider as JotaiProvider } from 'jotai'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

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

export const FoundationProvider = ({
  children,
  // For Jotai Provider
  initialValues,
  scope
}) => {
  return (
    <JotaiProvider initialValues={initialValues} scope={scope}>
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </JotaiProvider>
  )
}

export default FoundationProvider