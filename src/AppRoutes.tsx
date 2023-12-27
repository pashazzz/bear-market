import React, { Suspense, useLayoutEffect, useState } from 'react'
import { ErrorBoundary as Boundary } from 'react-error-boundary'
import { Route, Router, Routes as Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import LoadingFallback from './components/LoadingFallback'
import Header from './components/Header'

const history = createBrowserHistory()

const MainView = React.lazy(() => import('./views/MainView'))
const ProfileView = React.lazy(() => import('./views/ProfileView'))


const AppRoutes = () => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Router
        location={state.location}
        navigationType={state.action}
        navigator={history}
        >
        <ErrorBoundary key="main">
          <Header />

          <Switch>
            {/* Common routes */}

            {/* Default */}
            <Route path="/" element={<MainView />} />
            <Route path="/profile" element={<ProfileView />} />
          </Switch>
        </ErrorBoundary>
      </Router>
    </Suspense>)
}

function ErrorBoundary(props: { children: React.ReactNode | Iterable<React.ReactNode> | null | undefined }) {
  return (
    <Boundary
      FallbackComponent={() => (
        <Fallback />
      )}
    >
      {props.children}
    </Boundary>
  )
}

function Fallback(props: { className?: string }) {
  return (
    <div role="alert" className={`error-boundary production ${props?.className}`}>
      <div className="fallback-container">
        <h1>Something went wrong</h1>
        <p>Please try again</p>
      </div>
    </div>
  )
}

export default AppRoutes