import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Provider } from 'jotai'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

import * as Pages from '/src/pages'
import { Settings, ProviderInfo, Loading } from '/src/components'

import { rpcEndpointAtom } from './components/Atoms/Foundation'

const endpoint = 'wss://phat-beta-node.phala.network/khala/ws';

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

const App = () => {

  const initialValues = [
    [rpcEndpointAtom, endpoint]
  ]

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Provider initialValues={initialValues}>
          <ChakraProvider theme={theme}>
            <Settings />
            <ProviderInfo />
            <Routes>
              <Route path="/" element={<Pages.Home />} />
              <Route path="/event" element={<Pages.Event />} />
            </Routes>
          </ChakraProvider>
        </Provider>
      </Suspense>
    </>
  )
}

export default App
