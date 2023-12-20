import { useState } from "react"
import Button from "../Button"
import Input from "../Input"
import { useDispatch } from "react-redux"

const LoginForm = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const loginSender = () => {
    dispatch({type: "SHOW_LOGIN_FORM", payload: false})

    console.log(login, password)
    setLogin('')
    setPassword('')
  }

  return (
    <div>
      <Input
        type="text"
        title="Username"
        placeholder="Username"
        value={login}
        setValue={setLogin}
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

    </div>
  )
}

export default LoginForm