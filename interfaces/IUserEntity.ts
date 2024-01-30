export interface IUserPublicFields {
  id: number,
  username: string,
  firstName?: string,
  lastName?: string,
  email: string,
  roles: string[],
}

export interface IUserEntity extends IUserPublicFields {
  salt: string,
  passwordHash: string,
  createdAt: string,
}

export enum HiddenFields {
  salt,
  passwordHash,
  createdAt,
}