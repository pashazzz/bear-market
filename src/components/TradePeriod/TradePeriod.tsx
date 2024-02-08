import { FC, useEffect, useState } from 'react'

import Button from '../Base/Button'
import Input from '../Base/Input'

interface TradePeriodProps {
  tradeStart: Date | undefined,
  setTradeStart: (val: Date | undefined) => void,
  tradeEnd: Date | undefined,
  setTradeEnd: (val: Date | undefined) => void,
}

const TradePeriod: FC<TradePeriodProps> = ({tradeStart, setTradeStart, tradeEnd, setTradeEnd}) => {
  const [showStartPicker, setShowStartPicker] = useState<boolean>(false)
  const [showEndPicker, setShowEndPicker] = useState<boolean>(false)

  const [startDate, setStartDate] = useState<string>(tradeStart?.toISOString()?.split('T')[0] || new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState<string>(tradeEnd?.toISOString()?.split('T')[0] || new Date().toISOString().split('T')[0])

  useEffect(() => {
    console.log(tradeStart?.toISOString()?.split('T')[0])
    tradeStart !== undefined && setStartDate(tradeStart.toISOString()?.split('T')[0])
    tradeEnd !== undefined && setEndDate(tradeEnd.toISOString()?.split('T')[0])
  }, [tradeStart, tradeEnd])

  const now = new Date()
  const nowStr = `${now.getFullYear}-${now.getMonth}-${now.getDay}`

  const onSetStartDate = (val: string) => {
    let date = new Date(val)
    if (tradeStart && tradeStart > date) {
      date = tradeStart
    }
    if (tradeEnd && tradeEnd < date) {
      date = tradeEnd
    }

    setTradeStart(date)
    setShowStartPicker(false)
    setShowEndPicker(false)
  }

  const onSetEndDate = (val: string) => {
    let date = new Date(val)
    if (tradeStart && tradeStart > date) {
      date = tradeStart
    }

    setTradeEnd(date)
    setShowStartPicker(false)
    setShowEndPicker(false)
  }

  return (
    <>
      {tradeStart ? (
        <div>
          <p>Trade start: {tradeStart.toLocaleDateString(navigator.language)}</p>
          {showStartPicker ? (
            <div className='bear-container-period'>
              <Input
                type='date'
                value={startDate}
                setValue={setStartDate}
                className='bear-container-period-input'
                min={tradeStart?.toISOString()?.split('T')[0] || nowStr}
              />
              <Button text='Set date' onClick={() => onSetStartDate(startDate)} />
              <Button text='Cancel' onClick={() => {
                setShowStartPicker(false)}} />
            </div>
          ) : (
            <Button text="Change start date" onClick={() => {
              setShowStartPicker(true)
              setShowEndPicker(false)
            }}/>
          )}
          {tradeEnd && (
            <div>
              <p>Trade end: {tradeEnd.toLocaleDateString(navigator.language)}</p>
              {showEndPicker ? (
                <div className='bear-container-period'>
                  <Input
                    type='date'
                    value={endDate}
                    setValue={setEndDate}
                    className='bear-container-period-input'
                    min={tradeStart?.toISOString()?.split('T')[0] || nowStr}
                  />
                  <Button text='Set date' onClick={() => onSetEndDate(endDate)} />
                  <Button text='Cancel' onClick={() => setShowEndPicker(false)} />
                </div>
              ) : (
                  <Button text="Change end date" onClick={() => {
                    setShowStartPicker(false)
                    setShowEndPicker(true)
                  }}/>
              )}
            </div>
          )}
        </div>
        ) : (
          <div>
            <p>The trade is not started</p>
            <Button text="Set trade period" onClick={() => {}}/>
          </div>
        )}
    </>
  )
}

export default TradePeriod