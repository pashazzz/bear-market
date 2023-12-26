import { useEffect, useState } from 'react'
import logo from '/logo.png'
import Input from '../Base/Input'
import Button, { ButtonSizes } from '../Base/Button'
import { useAppDispatch, useAppSelector } from "../../helpers/reduxHooks"

const Header = () => {
  const dispatch = useAppDispatch()
  const [searchVal, setSearchVal] = useState('')

  const user = useAppSelector((state) => state.user)
  useEffect(() => {
    console.log(user)
  }, [user])

  const onClickLogin = () => {
    dispatch({type: "SHOW_LOGIN_FORM", payload: true})
  }
  const onClickRegister = () => {
    dispatch({type: "SHOW_REGISTRATION_FORM", payload: true})
  }

  return (
    <div className='header-container'>
      <div className='header'>
        <a href='/' className='header-logo'>
          <img src={logo} alt="Logo"/>
        </a>
        <div className='header-search'>
          <Input
            type="text"
            placeholder='Search'
            value={searchVal}
            setValue={setSearchVal}
          />
          <Button text='Search' onClick={() => {}} size={ButtonSizes.SMALL}/>
        </div>
        <div className='header-login-container'>
          <span className='header-login' onClick={onClickLogin}>Log in</span>
          {' / '}
          <span className='header-register' onClick={onClickRegister}>Register</span>
        </div>
      </div>
    </div>
  )
}

export default Header