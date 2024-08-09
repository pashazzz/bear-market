import { FC, useEffect, useState } from 'react'

import { getRequestWithAuth, postRequestWithAuth } from '../../helpers/backendRequsts'
import { useAppSelector } from '../../helpers/reduxHooks'

import Button, { ButtonVariants } from '../Base/Button'
import PriceButtons from '../PriceButtons'
import TradePeriod from '../TradePeriod'
import IBearEntity from '../../../interfaces/IBearEntity'

interface BearViewOwnerPartProps {
  bear: IBearEntity,
}

const BearViewOwnerPart: FC<BearViewOwnerPartProps> = ({ bear }) => {
  const user = useAppSelector((state) => state.user)
  const [origImg, setOrigImg] = useState<string>('')
  const [price, setPrice] = useState<number | undefined | null>(bear.price)
  const [tradeStart, setTradeStart] = useState<Date | undefined>(bear.tradeStart
    ? new Date(bear.tradeStart)
    : undefined)
  const [tradeEnd, setTradeEnd] = useState<Date | undefined>(bear.tradeEnd
    ? new Date(bear.tradeEnd)
    : undefined)

  // original image can be accessed only for owner
  useEffect(() => {
    if (user.data?.id !== undefined && user.data?.id === bear.ownerId) {
      getRequestWithAuth(`/images/orig/${bear.imgUrl}`, 'arraybuffer')
        .then(img => {
          // convert buffer to base64 image
          const base64 = btoa(
            new Uint8Array(img).reduce(
              (data, byte) => data + String.fromCharCode(byte), '',
            ),
          )
          setOrigImg('data:;base64,' + base64)
        })
        .catch(e => console.log(e))
    }
  }, [user.data?.id, bear])

  useEffect(() => {
    if (price !== undefined && bear?.price !== price) {
      if (price === null) {
        setTradeStart(undefined)
        setTradeEnd(undefined)
      }
      postRequestWithAuth(`/bears/changePrice`, {id: bear?.id, price})
        .then(res => {
          console.log(res)
          
        })
    }
  }, [bear?.id, bear?.price, price])

  useEffect(() => {
    postRequestWithAuth(`/bears/changePeriod`, {
      id: bear.id,
      tradeStart: tradeStart || null,
      tradeEnd: tradeEnd || null,
    })
        .then(res => {
          console.log(res)
        })
  }, [bear, tradeStart, tradeEnd])

  const closeCallbackAction = () => {
    if (!window.confirm(`
Do you really want to close the trade?

!!!
If it has at least one bid, the bear will be moved to a new owner
!!!`)) {
      return
    }

    postRequestWithAuth(`/bears/closeTrade`, {
      id: bear.id,
    })
      .then(res => {
        console.log(res)
        window.location.reload()
      })
      .catch(err => console.log(err))
  }

  const cancelCallbackAction = () => {
    if (!window.confirm(`
Do you really want to cancel the trade?
It'll delete all bids for this bear.`)) {
      return
    }

    postRequestWithAuth(`/bears/cancelTrade`, {
      id: bear.id,
    })
      .then(res => {
        console.log(res)
        window.location.reload()
      })
      .catch(err => console.log(err))
  }

  return (
    <div className="bear-container-owner-part">
      <div className="bear-container-img">
        <h3>Bear original image, that accessed only for owner</h3>
        <h5>(you can copy the image and use it how you want)</h5>
        <img className="bear-container-orig-image" src={origImg} />
      </div>

      <div className="bear-container-options">
        <PriceButtons setPrice={setPrice} currentPrice={price}/>
        { bear.maxBid &&
          <h2>Last bid: {bear.maxBid}</h2>
        }
        <TradePeriod
          tradeStart={tradeStart}
          setTradeStart={setTradeStart}
          tradeEnd={tradeEnd}
          setTradeEnd={setTradeEnd}
        />
        {tradeStart && ( <>
          <Button
            text='Close trade'
            variant={ButtonVariants.danger}
            onClick={closeCallbackAction}
          />
          <Button
            text='Cancel trade'
            variant={ButtonVariants.warning}
            onClick={cancelCallbackAction}
          />
        </> )}
      </div>
    </div>
  )
}

export default BearViewOwnerPart