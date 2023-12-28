import { Request } from 'express'
import { IUserEntity } from '../../../interfaces/IUserEntity'

export interface IRequestWithUser extends Request {
  user?: IUserEntity
}