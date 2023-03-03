import { Suspense } from 'react'
import { Outlet, Link } from "@tanstack/react-location"


import HomePage from '/src/pages/Home/Home'
import EventPage from '/src/pages/Event/Event'

import { Settings, ProviderInfo, Loading } from '/src/components'
import FoundationProvider from '../src/components/Foundation/Provider'

import { rpcEndpointAtom } from './components/Atoms/FoundationBase'

const endpoint = 'wss://phat-beta-node.phala.network/khala/ws';

const initialValues = [
  [rpcEndpointAtom, endpoint]
]

const App = () => {

  return (
    <>

      <FoundationProvider
        initialValues={initialValues}
        routes={[
          { path: "/home", element: <HomePage /> },
          { path: "/", element: <EventPage /> },
        ]}
      >
        <div>
          <Link to="/home">Home</Link>
          <br />
          <Link to="/">EVENT</Link>
        </div>
        <Suspense fallback={<div />}>
          <Settings />
          <ProviderInfo />
        </Suspense>
        <Outlet />
      </FoundationProvider>

    </>
  )
}

export default App
