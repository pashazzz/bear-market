import { getRequestWithAuth } from "../helpers/backendRequsts"

// check is user have role and type
// types 'athlete' and 'organizer' have not roles
// type 'staff' has roles and can imitate athletes and organizers
// by having role 'athlete' and 'organizer'
export const hasRole = async (role: string) => {
  const user = JSON.parse(localStorage.getItem('user') ?? '{}')

  return (await Object.keys(user).length === 0)
    ? false
    : getRequestWithAuth(`/users/username/${user.username}`)
        .then((res) => {
          return (res.roles.filter((r: string) => r === role).length > 0)
        })
}