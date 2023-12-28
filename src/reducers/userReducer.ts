import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IUserPublicFields } from '../../interfaces/IUserEntity'

interface ILoginResponse {
  user: IUserPublicFields,
  jwtoken: {
    expires: string | number,
    token: string,
  },
}

export interface IUserState {
  data?: IUserPublicFields | null
  token?: string | null
  status: "idle" | "loading" | "failed"
  error: string | null
}

const initialState: IUserState = {
  data: localStorage.getItem('user') &&
          localStorage.getItem('user') !== 'undefined' ?
            JSON.parse(localStorage.getItem('user') || 'null') :
            null,
  token: '',
  status: 'idle',
  error: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginAction: (state, action: PayloadAction<ILoginResponse>) => {
      state.data = action.payload.user
      state.token = action.payload.jwtoken.token

      localStorage.setItem('user', JSON.stringify(action.payload.user))
      localStorage.setItem('token', action.payload.jwtoken.token)
      localStorage.setItem('expires', String(action.payload.jwtoken.expires))
      // return {...state, data: action.payload.user, token: action.payload.jwtoken.token}
    },
    logoutAction: (state) => {
      state.data = null
      state.token = null

      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('expires')
    }
  },
})

export const { loginAction, logoutAction } = userSlice.actions
export default userSlice.reducer
