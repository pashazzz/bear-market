import React, { Suspense, useEffect, useLayoutEffect, useState } from 'react'
import { ErrorBoundary as Boundary } from 'react-error-boundary'
import { Navigate, Outlet, Route, Router, Routes as Switch } from 'react-router-dom'

import history from './history'
import LoadingFallback from './components/LoadingFallback'
import Header from './components/Header'
import { hasRole } from './services/auth'


const MainView = React.lazy(() => import('./views/MainView'))
const ProfileView = React.lazy(() => import('./views/ProfileView'))
const BearView = React.lazy(() => import('./views/BearView'))


const AppRoutes = () => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location
  });

  useLayoutEffect(() => history.listen(setState), []);

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
            <Route path="/profile" element={<ProtectedRoute accept='customer'/>}>
              <Route path="/profile" element={<ProfileView />} />
            </Route>
            <Route path="/bear/:id" element={<BearView />} />
            {/* <ProtectedRoute path="/profile" element={<ProfileView />} accept="customer" /> */}
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

const ProtectedRoute = (props: {accept: string}) => {
  const [hasAccess, setAccess] = useState(true)

  useEffect(() => {
    hasRole(props.accept)
      .then((result) => {
        setAccess(result)
      })
      .catch((e) => {
        console.log(e)
        setAccess(false)
      })
  }, [props.accept])

  return hasAccess ? <Outlet /> : <Navigate to="/" />
}

export default AppRoutes