import { IUserEntity, IUserPublicFields, HiddenFields } from "../../../interfaces/IUserEntity";

function sanitizeUserEntity(user: IUserEntity): IUserPublicFields {
  for (const field in HiddenFields) {
    if (isNaN(Number(field))) {
      delete user[field]
    }
  }
  
  return user as IUserPublicFields
}

export default {
  sanitizeUserEntity,
}