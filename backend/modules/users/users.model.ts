import { createHash } from 'crypto'

import { IUserEntity } from "../../../interfaces/IUserEntity";

const dumpUsers: IUserEntity[] = [
  {
    // password: "123nimda123!"
    id: 0,
    username: 'admin',
    salt: 'hwe945kl;12.q2d',
    passwordHash: '9c7a7495bda6a72018269ea4b976b3cf7b09e97ec24a1b03ce92e4518df5fc7207bbe6ce5dc46711a38e48593f477773176aaff8fd27f2938185ffb09e261501',
    email: 'pmalyshkin@gmail.com',
    roles: ['admin', 'customer'],
    createdAt: '2023-11-30T08:00:00Z',
  }, {
    // password: "guest123"
    id: 1,
    username: 'guest',
    salt: 'njib783]1mj09,/',
    passwordHash: 'bb56bb57ea1e6736b671cbea4d7a63495c1a800e60e0c1fda8e5e05d6dfe8b592c9d4194479cc10da07ef7a64d28dd424f4ba206e403d2e5de0223abfc0c46d4',
    email: 'guest@bearmarket.com',
    roles: ['customer'],
    createdAt: '2023-11-30T09:00:00Z',
  }, {
    // password: "aurelius"
    id: 2,
    username: 'marcus',
    firstName: 'Marcus',
    lastName: 'Aurelius',
    salt: 'n qa2`1;kf7))d2',
    passwordHash: 'fb400a2761868e17466d333dbafa6dbc0c01711ae15e5b8e82d8a4dd4d333bdec78c671c1e4f4e5e5d6914f6c03456b9f4bd297ad2a8a578a1081e14fd4e6aef',
    email: 'marc@bearmarket.com',
    roles: ['customer'],
    createdAt: '2023-12-1T08:00:00Z',
  }
]

function findUserById(id: number): IUserEntity | undefined {
  return dumpUsers.find(user => user.id === id)
}

function findUserByUsername(username: string): IUserEntity | undefined {
  return dumpUsers.find(user => user.username === username)
}

function checkUserPassword(user: IUserEntity, password: string): boolean {
  const strForHash: string = user.createdAt + password + user.salt + process?.env?.SALT_FOR_HASH

  const hashFunc = createHash('SHA3-512')
  hashFunc.update(strForHash)
  const hash = hashFunc.digest('hex')

  return hash === user.passwordHash
}


export default {
  findUserById,
  findUserByUsername,
  checkUserPassword,
}