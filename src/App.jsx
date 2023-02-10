import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import * as Pages from '/src/pages'
import { Settings, ProviderInfo, Loading } from '/src/components'

const App = () => {


  return (
    <>
      <Suspense fallback={<Loading />}>
        <Settings />
        <ProviderInfo />
        <Routes>
          <Route path="/" element={<Pages.Home />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
