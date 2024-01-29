import { useState } from 'react'
import history from '../../history'
import logo from '/logo.png'
import Input from '../Base/Input'
import Button, { ButtonSizes } from '../Base/Button'
import { useAppDispatch, useAppSelector } from "../../helpers/reduxHooks"
import { logoutAction } from '../../reducers/userReducer'

const Header = () => {
  const dispatch = useAppDispatch()
  const [searchVal, setSearchVal] = useState('')

  const user = useAppSelector((state) => state.user)

  const onClickLogin = () => {
    dispatch({type: "SHOW_LOGIN_FORM", payload: true})
  }
  const onClickRegister = () => {
    dispatch({type: "SHOW_REGISTRATION_FORM", payload: true})
  }
  const onClickLogout = () => {
    dispatch(logoutAction())
    history.push('/')
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
        { user.data?.username ? (
          <div className='header-user-container'>
            <div className='header-username'><a href='/profile'>{user.data?.username} &#9660;</a></div>
            <Button text='Logout' onClick={onClickLogout} size={ButtonSizes.SMALL}/>
          </div>
        ) : (
        <div className='header-login-container'>
          <span className='header-login' onClick={onClickLogin}>Log in</span>
          {' / '}
          <span className='header-register' onClick={onClickRegister}>Register</span>
        </div>
        )}
      </div>
    </div>
  )
}

export default Header