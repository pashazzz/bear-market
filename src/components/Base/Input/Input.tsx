import * as React from 'react'

interface Props {
  type?: string
  title?: string
  placeholder?: string
  className?: string
  isFocused?: boolean
  value: string | number
  setValue: React.Dispatch<React.SetStateAction<string>>
  min?: number | string
  max?: number | string
}

const Input: React.FunctionComponent<Props> = (props: Props) => {
  // TODO: add the error section

  const autoFocusCallback = React.useCallback((inputElement: HTMLInputElement) => {
    if (inputElement && props.isFocused) {
      inputElement.focus()
    }
  }, [props.isFocused])

  const onChangeVal = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value
    if (props.type === 'number' && typeof props.min === 'number' && typeof props.max === 'number') {
      let num = Number(val)
      if (props.min && num < props.min) {
        num = props.min
      }
      if (props.max && num > props.max) {
        num = props.max
      }
      val = String(num)
    }
    props.setValue(val)
  }

  return (
    <div className={'input-wrapper ' + (props.className ?? '')}>
      { props.title && <div className='input-title'>{props.title}</div> }
      <input
        type={props.type ?? 'text'}
        placeholder={props.placeholder}
        value={props.value}
        ref={autoFocusCallback}
        onChange={onChangeVal}
        min={props.min}
        max={props.max}
      />
    </div>
  )
}

export default Input