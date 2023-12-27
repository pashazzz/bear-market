import { useState, SyntheticEvent } from "react"

import { postRequest } from '../../../helpers/backendRequsts'
import { useAppDispatch } from "../../../helpers/reduxHooks"
import { loginAction } from "../../../reducers/userReducer"

import Button from "../../Base/Button"
import Input from "../../Base/Input"

const LoginForm = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [errorDesc, setErrorDesc] = useState('')

  const dispatch = useAppDispatch()

  const formHandler = (e: SyntheticEvent) => {
    e.preventDefault()
  }
  const loginSender = () => {
    postRequest('/users/login', {login, password})
      .then(res => {
        dispatch(loginAction(res))
        dispatch({type: "SHOW_LOGIN_FORM", payload: false})
    
        setLogin('')
        setPassword('')
      })
      .catch(err => {
        setError(err.response.data?.error?.issue)
        setErrorDesc(err.response.data?.error?.description)
      })
  }

  return (
    <form onSubmit={formHandler}>
      <Input
        type="text"
        title="Username"
        placeholder="Username"
        value={login}
        setValue={setLogin}
        isFocused={true}
      />
      <Input
        type="password"
        title="Password"
        placeholder="Password"
        value={password}
        setValue={setPassword}
      />
      <div className='login-form-error'>{error}</div>
      <div className='login-form-error-description'>{errorDesc}</div>

      <div style={{textAlign: 'center', margin: 18}}>
        <Button text="Login" onClick={loginSender} />
      </div>

    </form>
  )
}

export default LoginForm