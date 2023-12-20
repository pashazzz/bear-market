import './Button.css'

interface Props {
  text: string
  onClick: () => void
  size?: ButtonSizes
}

export enum ButtonSizes {
  SMALL = 'button-small',
  NORMAL = 'button-normal',
  LARGE = 'button-large',
}

const Button = (props: Props) => {
  return (
    <div className='button-wrapper'>
      <button className={props.size ?? 'button-normal'} onClick={props.onClick}>
        {props.text}
      </button>
    </div>
  )
}

export default Button