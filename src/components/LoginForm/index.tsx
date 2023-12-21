import axios from 'axios'
import { useState } from "react"
import { useDispatch } from "react-redux"

import Button from "../Button"
import Input from "../Input"

const LoginForm = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const loginSender = () => {
    axios.post(`${import.meta.env.VITE_SERVER_BASE}/users/login`, {login, password})
      .then((response) => {
        console.log(response.data)
      })
    dispatch({type: "SHOW_LOGIN_FORM", payload: false})

    setLogin('')
    setPassword('')
  }

  return (
    <form onSubmit={loginSender}>
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

      <div style={{textAlign: 'center', margin: 18}}>
        <Button text="Login" onClick={loginSender} />
      </div>

    </form>
  )
}

export default LoginForm