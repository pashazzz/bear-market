export default interface IBearEntity {
  id: number,
  title: string,
  description?: string,
  imgUrl: string,
  imgExt: string,
  owner: number,
  price?: number,
  createdAt: string,
}
