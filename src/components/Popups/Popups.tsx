import { useSelector } from 'react-redux'

import { TRootState } from '../../store'
import { IPopupsState } from '../../reducers/popupsReducer'

import PopupContainer from './PopupContainer'
import LoginForm from './LoginForm'

const Popups = () => {
  const popupsState = useSelector<TRootState, IPopupsState>((state) => state.popups)

  return (
    popupsState.isShowLoginForm && (
      <PopupContainer type="login"><LoginForm /></PopupContainer>
    )
  )
}

export default Popups