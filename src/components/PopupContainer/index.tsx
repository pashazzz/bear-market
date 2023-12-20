import * as React from 'react'

// import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

// import { TRootState } from '../../store'
// import { IPopupsState } from '../../reducers/popupsReducer'

import './PopupContainer.css'

interface Props {
  children: React.ReactNode
  type: string
}

const popupTypes: Record<string, string> = {
  login: "SHOW_LOGIN_FORM"
}

const PopupContainer: React.FunctionComponent<Props> = ({children, type}) => {
  // const popupsState = useSelector<TRootState, IPopupsState>((state) => state.popups)
  const dispatch = useDispatch()

  const closePopup = (e: React.MouseEvent) => {
    const target = e.target as HTMLTextAreaElement // EventTarget haven't classList property
    if(target.classList.contains("popup-wrapper")) {
      dispatch({type: popupTypes[type], payload: false})
    }
  }

  return (
    <div className="popup-wrapper" onClick={closePopup}>
      <div className="popup-container">
        {children}
      </div>
    </div>
  )
}

export default PopupContainer
