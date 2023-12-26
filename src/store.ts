import { configureStore } from '@reduxjs/toolkit'
import { popupsReducer } from './reducers/popupsReducer'
import userReducer from './reducers/userReducer'

const reducer = {
  popups: popupsReducer,
  user: userReducer,
}

export const store = configureStore({reducer})

export type TRootState = ReturnType<typeof store.getState>
export type TAppDispatch = typeof store.dispatch