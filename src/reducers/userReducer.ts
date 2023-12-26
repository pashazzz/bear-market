import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IUserPublicFields } from '../../interfaces/IUserEntity'

interface ILoginResponse {
  user: IUserPublicFields,
  jwtoken: {
    expires: number,
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
  data: JSON.parse(localStorage.getItem('user') ?? '{}'),
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
      // return {...state, data: action.payload.user, token: action.payload.jwtoken.token}
    },
    logoutAction: (state) => {
      return {...state, data: null, token: null}
    }
  },
})

export const { loginAction, logoutAction } = userSlice.actions
export default userSlice.reducer
