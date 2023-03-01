import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import * as Pages from '/src/pages'
import { Settings, ProviderInfo, Loading } from '/src/components'
import FoundationProvider from '../src/components/Foundation/Provider'

import { rpcEndpointAtom } from './components/Atoms/FoundationBase'

const endpoint = 'wss://phat-beta-node.phala.network/khala/ws';

const App = () => {

  const initialValues = [
    [rpcEndpointAtom, endpoint]
  ]

  return (
    <>
      <Suspense fallback={<Loading />}>
        <FoundationProvider initialValues={initialValues}>
          <Settings />
          <ProviderInfo />
          <Routes>
            <Route path="/" element={<Pages.Home />} />
            <Route path="/event" element={<Pages.Event />} />
          </Routes>
        </FoundationProvider>
      </Suspense>
    </>
  )
}

export default App
