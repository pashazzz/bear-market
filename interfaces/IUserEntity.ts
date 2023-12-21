export interface IUserPublicFields {
  username: string,
  firstName?: string,
  lastName?: string,
}

export interface IUserEntity extends IUserPublicFields {
  id: number,
  passwordHash: string,
  createdAt: string,
}

export enum HiddenFields {
  id,
  passwordHash,
  createdAt,
}