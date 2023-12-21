import { createHash } from 'crypto'

import { IUserEntity } from "../../../interfaces/IUserEntity";

const dumpUsers: IUserEntity[] = [
  {
    // password: "123nimda123!"
    id: 0,
    username: 'admin',
    salt: 'hwe945kl;12.q2d',
    passwordHash: 'a7ad67772a24800eef009d69478931836915394375ebe7e1ab9f437f4f10059158b2bbff893979fe7dcdf9edad4470d67bc4c50f95777c9d74f9cad2dd011f64',
    createdAt: '2023-11-30T08:00:00Z',
    email: 'pmalyshkin@gmail.com',
  }, {
    // password: "guest123"
    id: 1,
    username: 'guest',
    salt: 'njib783]1mj09,/',
    passwordHash: 'b4bab4b4a1ebb98c087e03f8b9d5a8745c559cb5a2e0f7b8fadfe2f58631f09b3449259126695beace607ddbee1314bddc6bf8bb1974ae3622f355910e0a1b13',
    createdAt: '2023-11-30T09:00:00Z',
    email: 'guest@bearmarket.com',
  }, {
    // password: "aurelius"
    id: 2,
    username: 'marcus',
    firstName: 'Marcus',
    lastName: 'Aurelius',
    salt: 'n qa2`1;kf7))d2',
    passwordHash: 'f80376fc87147286db3e840904496dee541243c7bb78d057305b38569757e09dd41dde5a70d594cd2f42d14a573c5f18cb0e7069de6082f7b5128a429d504d07',
    createdAt: '2023-12-1T08:00:00Z',
    email: 'marc@bearmarket.com',
  }
  
]

function findUserByUsername(username: string): IUserEntity | undefined {
  return dumpUsers.find(user => user.username === username)
}

function checkUserPassword(user: IUserEntity, password: string): boolean {
  const strForHash: string = user.username + password + user.salt + process?.env?.SALT_FOR_HASH

  const hashFunc = createHash('SHA3-512')
  hashFunc.update(strForHash)
  const hash = hashFunc.digest('hex')

  return hash === user.passwordHash
}


export default {
  findUserByUsername,
  checkUserPassword,
}