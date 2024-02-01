import { getRequestWithAuth } from "../helpers/backendRequsts"

// check is user have role and type
export const hasRole = async (role: string) => {
  const user = JSON.parse(localStorage.getItem('user') ?? '{}')

  return (await Object.keys(user).length === 0)
    ? false
    : getRequestWithAuth(`/users/username/${user.username}`)
        .then((res) => {
          const currentRoles = res.roles.split(',')
          return (currentRoles.filter((r: string) => r === role).length > 0)
        })
}