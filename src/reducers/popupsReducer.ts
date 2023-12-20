import { Reducer } from "@reduxjs/toolkit"

export interface IPopupsState {
  isShowLoginForm: boolean
  isShowRegistrationForm: boolean
}

const initialState: IPopupsState = {
  isShowLoginForm: false,
  isShowRegistrationForm: false,
}

export const popupsReducer: Reducer = (state: IPopupsState = initialState, action) => {
  switch(action.type) {
    case 'SHOW_LOGIN_FORM': {
      return {...state, isShowLoginForm: action.payload}
    }
    case 'SHOW_REGISTRATION_FORM': {
      return {...state, isShowRegistrationForm: action.payload}
    }
    default: {
      return state
    }
  }
}