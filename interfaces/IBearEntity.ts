export default interface IBearEntity {
  id: number,
  title: string,
  description?: string,
  imgUrl: string,
  imgExt: string,
  ownerId: number,
  price?: number,
  tradeStart?: string,
  tradeEnd?: string,
  createdAt: string,
  maxBid?: number,
}
