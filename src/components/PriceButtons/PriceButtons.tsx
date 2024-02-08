import { FC, useState } from 'react'

import Button from '../Base/Button'
import Input from '../Base/Input'


interface PriceBtnProps {
  currentPrice?: number | null,
  setPrice: (val: number | null) => void,
}

const PriceButtons: FC<PriceBtnProps> = ({currentPrice, setPrice}) => {
  const minPrice = 3
  const maxPrice = 10

  const [displayBtn, setDisplayBtn] = useState<boolean>(true)
  const [selectedPrice, setSelectedPrice] = useState<string>(String(currentPrice) ?? String(minPrice))

  const onWithdrawClick = () => {
    if (window.confirm("If you withdraw the bear from sell it'll clear the price and sell period. Are you really want?"))
    setPrice(null)
  }

  if (displayBtn) {
    return (
      <div className="bear-container-price">
        {currentPrice ? `Price: ${currentPrice} Credits` : ''}
        <Button onClick={() => setDisplayBtn(false)}
          text={currentPrice ? 'Change price' : 'Set price'} />
        {currentPrice && (
          <Button onClick={onWithdrawClick} text='Withdraw from sell' />
        )}
      </div>
    )
  }

  const onSetPrice = () => {
    setPrice(Number(selectedPrice))
    setDisplayBtn(true)
  }

  return (
    <div className="bear-container-price">
      <Input
        className='bear-container-price-input'
        type='number'
        value={selectedPrice}
        setValue={setSelectedPrice}
        min={minPrice}
        max={maxPrice} />
      <Button onClick={onSetPrice} text='Set price'/>
      <Button onClick={() => setDisplayBtn(true)} text='Cancel'/>
    </div>
  )
}

export default PriceButtons