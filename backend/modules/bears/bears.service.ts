import IBearEntity from "../../../interfaces/IBearEntity"

const isTradeOpen = (bear: IBearEntity): boolean => {
  const now = new Date()
  const tradeStart = bear.tradeStart ? new Date(bear.tradeStart) : null
  const tradeEnd = bear.tradeEnd ? new Date(bear.tradeEnd) : null
  const isTradeEnd = tradeEnd && tradeEnd.getTime() < now.getTime()
  if (!bear.price
      || !tradeStart
      || isTradeEnd
      || tradeStart && tradeStart.getTime() > now.getTime()) {
        return false
      }
  return true
}

export default {
  isTradeOpen,
}