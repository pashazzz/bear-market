import IBidEntity from "../../../interfaces/IBidEntity"

export interface IBidEntityNotOwner {
  bearId: number,
  userId: number,
  value: number,
}

const sanitizeBidEntity = (bid: IBidEntity): IBidEntityNotOwner => {
  return {
    bearId: bid.bearId,
    userId: bid.userId,
    value: bid.value,
  }
}

export default {
  sanitizeBidEntity,
}