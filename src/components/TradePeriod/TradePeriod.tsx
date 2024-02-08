import { FC, useEffect, useState } from 'react'

import Button, { ButtonVariants } from '../Base/Button'
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
    tradeStart !== undefined && setStartDate(tradeStart.toISOString()?.split('T')[0])
    tradeEnd !== undefined && setEndDate(tradeEnd.toISOString()?.split('T')[0])
  }, [tradeStart, tradeEnd])

  const today = new Date(new Date().toISOString().split('T')[0])
  const nowStr = today.toISOString()?.split('T')[0]
  const tradeStartStr = tradeStart?.toISOString()?.split('T')[0]
  const minStart = (tradeStartStr && tradeStartStr > nowStr) ? nowStr : tradeStartStr

  const onSetStartDate = (val: string) => {
    let date = new Date(val)
    if (tradeStart && tradeStart > date) {
      date = date < today ? tradeStart : date
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
      {tradeStart && (
        <div className='bear-container-period-start'>
          <p>Trade start: <b>{tradeStart.toLocaleDateString(navigator.language)}</b></p>
          {showStartPicker ? (
            <div className='bear-container-period'>
              <Input
                type='date'
                value={startDate}
                setValue={setStartDate}
                className='bear-container-period-input'
                min={minStart}
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
          <Button
            text="Remove start date (with end date too)"
            variant={ButtonVariants.danger}
            onClick={() => {
              setTradeStart(undefined)
              setTradeEnd(undefined)
              setShowStartPicker(false)
              setShowEndPicker(false)
            }} />
        </div>
      )}

      {tradeEnd ? (
        <div>
          <p>Trade end: <b>{tradeEnd.toLocaleDateString(navigator.language)}</b></p>
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
          <Button
            text="Remove end date"
            variant={ButtonVariants.danger}
            onClick={() => {
              setTradeEnd(undefined)
              setShowStartPicker(false)
              setShowEndPicker(false)
            }} />
            <p>(without end date you can finish trading anytime)</p>
        </div>
      ) : (
        <>
        {tradeStart && (
          <>
            <Button text="Set end date" onClick={() => {
              setTradeEnd(tradeStart)
              setShowStartPicker(false)
              setShowEndPicker(true)
            }}/>
            <p>(without end date you can finish trading anytime)</p>
          </>
        )}
        </>
      )}

      {!tradeStart && !tradeEnd && (
        <div>
          <p>The trade is not started</p>
          <Button text="Start trade or set the trade period" onClick={() => {
            setTradeStart(new Date())
            setShowStartPicker(true)
            setShowEndPicker(true)
          }}/>
        </div>
        )}
    </>
  )
}

export default TradePeriod