import { IUserEntity, IUserPublicFields, HiddenFields } from "../../interfaces/IUserEntity";

const dumpUsers: IUserEntity[] = [
  {
    // password: "123nimda123!"
    id: 0,
    username: 'admin',
    passwordHash: '031cc5f9cb4ad331cc05ec8126d508a2e51707d4c8a9e0caa95f124dd1f9a453a36c0264de0d87659b3c049db6f366597da870bc70f861503e2f34715c243239',
    createdAt: '2023-11-30T08:00:00Z',
  }, {
    // password: "guest123"
    id: 1,
    username: 'guest',
    passwordHash: 'b9e058cfa995fe149f444535ac5055172e7801cccc1a2573555833c702ceea5a099cc3038cc1e1eb4151b895c4b7576b197cc7df9ad156687573a3b39e4b5d00',
    createdAt: '2023-11-30T09:00:00Z',
  }, {
    // password: "aurelius"
    id: 2,
    username: 'marcus',
    firstName: 'Marcus',
    lastName: 'Aurelius',
    passwordHash: 'cc23f2f352bcc3c3ebb68a7221eaa309072c4b57e5e805681ab1e6630dbe0e6606790356232dc3e0439c80d356bf7f0b2ea647b470c20403e03054b583bb94c4',
    createdAt: '2023-12-1T08:00:00Z',
  }
  
]

interface UsernameAndHash {
  username: string
  hash: string
}

function sanitizeUserEntity(user: IUserEntity): IUserPublicFields {
  for (const field in HiddenFields) {
    if (isNaN(Number(field))) {
      delete user[field]
    }
  }
  
  return user as IUserPublicFields
}

function findUserByUsernameAndHash({username, hash}: UsernameAndHash): IUserPublicFields | null {
  const foundUsers = dumpUsers.filter(user => user.username === username && user.passwordHash === hash)
  if (foundUsers.length === 0) {
    return null
  }

  return sanitizeUserEntity(foundUsers[0])
}

export default {
  dumpUsers,
  findUserByUsernameAndHash,
}