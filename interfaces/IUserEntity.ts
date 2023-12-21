export interface IUserPublicFields {
  username: string,
  firstName?: string,
  lastName?: string,
  email: string,
}

export interface IUserEntity extends IUserPublicFields {
  id: number,
  salt: string,
  passwordHash: string,
  createdAt: string,
}

export enum HiddenFields {
  id,
  salt,
  passwordHash,
  createdAt,
}