import { ButtonSizes, ButtonVariants } from "."

interface Props {
  text: string
  onClick: () => void
  size?: ButtonSizes
  variant?: ButtonVariants
}

const Button = (props: Props) => {
  const classes = `${props.size ?? 'button-normal'} ${props.variant}`
  return (
    <div className='button-wrapper'>
      <button className={classes} onClick={props.onClick}>
        {props.text}
      </button>
    </div>
  )
}

export default Button