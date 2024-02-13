import { FC, useEffect, useState } from "react"
import { useAppSelector } from '../../helpers/reduxHooks'

import IBearEntity from "../../../interfaces/IBearEntity"
import IBidEntity from "../../../interfaces/IBidEntity"
import Input from "../Base/Input"
import Button, { ButtonVariants } from "../Base/Button"
import { deleteRequestWithAuth, getRequest, postRequestWithAuth } from "../../helpers/backendRequsts"

interface BearViewBidPartProps {
  bear: IBearEntity
}

const BearViewBidPart: FC<BearViewBidPartProps> = ({ bear }) => {
  const user = useAppSelector((state) => state.user)

  const [lastBid, setLastBid] = useState<IBidEntity|undefined>(undefined)
  const [bid, setBid] = useState<string>("")
  const [bidInputError, setBidInputError] = useState<string|undefined>("")
  const [bidMessage, setBidMessage] = useState<string>("")

  const now = new Date()
  const tradeStart = bear.tradeStart ? new Date(bear.tradeStart) : null
  const tradeEnd = bear.tradeEnd ? new Date(bear.tradeEnd) : null
  const isTradeEnd = tradeEnd && tradeEnd.getTime() < now.getTime()

  if (!tradeStart || isTradeEnd || tradeStart && tradeStart.getTime() > now.getTime()) {
    return <></>
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    getRequest(`/bids/${bear.id}/lastBid`)
      .then(bid => setLastBid(bid))
      .catch(e => console.log(e))
  }, [bear.id])

  const onSetBid = () => {
    // different locales can use dots or commas
    const bidNum = Number(bid.split('.')[0].split(',')[0])
    setBid(String(bidNum))
    if (bidNum <= (bear.price ?? 0) || lastBid && bidNum <= lastBid.value) {
      return setBidInputError('Your bid should be more than last bid or price')
    }
    setBidInputError('')

    postRequestWithAuth(`/bids/${bear.id}`, {value: bidNum})
      .then(bid => {
        setLastBid(bid)
        setBidMessage('Your bid has been accepted')
      })
      .catch(e => {
        console.log(e)
        if (e.response?.data?.error) {
          setBidMessage(e.response?.data?.error)
        }
      })
  }

  const onWithdrawClick = () => {
    if (!lastBid || !window.confirm("Do you really want to withdraw your last bid?")) {
      return
    }
    deleteRequestWithAuth(`/bids/${lastBid.id}`)
      .then(bid => {
        setLastBid(bid)
        setBidMessage('Your bid has been withdrawn')
      })
      .catch(e => {
        console.log(e)
        if (e.response?.data?.error) {
          setBidMessage(e.response?.data?.error)
        }
      })
  }

  return(
    <div className="bear-bids-container">
      <div className="bear-bids-price">Original price: {bear.price} Credits</div>
      <div className="bear-bids-last-bid">Last bid: {lastBid ? `${lastBid.value} Credits`: 'none'} </div>
      <div className="bear-bids-buttons">
        <Input
          className="bear-bids-input"
          type="number"
          title="Your bid"
          value={bid}
          setValue={setBid}
          errorMessage={bidInputError}
        />
        <Button
          className="bear-bids-set-button"
          text="Set bid"
          onClick={onSetBid}
        />
        {lastBid?.userId === user.data?.id && <Button
            text='Withdraw my bid'
            variant={ButtonVariants.danger}
            onClick={onWithdrawClick}
          />
        }
      </div>
      <div className="bear-bids-message">{bidMessage}</div>
    </div>
  )
}

export default BearViewBidPart