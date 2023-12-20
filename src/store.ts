import { configureStore } from '@reduxjs/toolkit'
import { popupsReducer } from './reducers/popupsReducer'

import { IPopupsState } from './reducers/popupsReducer'
import { Reducer } from '@reduxjs/toolkit'

export interface IReducers {
  popups: Reducer<IPopupsState>,
}

const reducer: IReducers = {
  popups: popupsReducer
}

export const store = configureStore({reducer})

export type TRootState = ReturnType<typeof store.getState>