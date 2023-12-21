import { ButtonSizes } from "."

interface Props {
  text: string
  onClick: () => void
  size?: ButtonSizes
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