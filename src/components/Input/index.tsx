import * as React from 'react'

import './Input.css'

interface Props {
  type?: string
  title?: string
  placeholder?: string
  className?: string
  isFocused?: boolean
  value: string | number
  setValue: React.Dispatch<React.SetStateAction<string>>
}

const Input: React.FunctionComponent<Props> = (props: Props) => {
  const autoFocusCallback = React.useCallback((inputElement: HTMLInputElement) => {
    if (inputElement && props.isFocused) {
      inputElement.focus()
    }
  }, [props.isFocused])

  return (
    <div className={'input-wrapper ' + (props.className ?? '')}>
      { props.title && <div className='input-title'>{props.title}</div> }
      <input
        type={props.type ?? 'text'}
        placeholder={props.placeholder}
        value={props.value}
        ref={autoFocusCallback}
        onChange={(e) => props.setValue(e.target.value) }
      />
    </div>
  )
}

export default Input
