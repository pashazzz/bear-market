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
  wallet: number,
  createdAt: string,
}

export enum PrivateFields {
  wallet,
}

export enum HiddenFields {
  salt,
  passwordHash,
  createdAt,
}