import { FC, useEffect, useState } from "react"
import IBearEntity from "../../../interfaces/IBearEntity"
import Input from "../Base/Input"
import Button from "../Base/Button"
import { getRequest } from "../../helpers/backendRequsts"

interface BearViewBidPartProps {
  bear: IBearEntity
}

const BearViewBidPart: FC<BearViewBidPartProps> = ({ bear }) => {
  const [lastBid, setLastBid] = useState<number>(0)
  const [bid, setBid] = useState<string>("")

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
      .then(bid => setLastBid(bid.lastBid))
      .catch(e => console.log(e))
  }, [])

  const onSetBid = () => {

  }

  return(
    <div className="bear-bids-container">
      <div className="bear-bids-price">Original price: {bear.price} Credits</div>
      <div className="bear-bids-last-bid">Last bid: {lastBid === 0 ? 'none' : `${lastBid} Credits`} </div>
      <div className="bear-bids-buttons">
        <Input
          className="bear-bids-input"
          type="number"
          title="Your bid"
          value={bid}
          setValue={setBid}
        />
        <Button
          className="bear-bids-set-button"
          text="Set bid"
          onClick={onSetBid}
        />
      </div>
    </div>
  )
}

export default BearViewBidPart