import './ProfileView.css'
import { useEffect, useState } from "react"
import { getRequestWithAuth } from "../helpers/backendRequsts"
import { useAppSelector } from "../helpers/reduxHooks"
import IBearEntity from "../../interfaces/IBearEntity"
import BearCard from "../components/BearCard"

const ProfileView = () => {
  const user = useAppSelector((state) => state.user)
  const [bears, setBears] = useState<IBearEntity[]>([])

  useEffect(() => {
    getRequestWithAuth(`/users/${user.data?.username}/bears`)
      .then(data => setBears(data))
      .catch(e => {
        console.log(e)
      })
  }, [])
  
  return (
  <div className="view profile-container">
    <h1>Hi, {user.data?.username}</h1>
    <br />
    <h2>Your bears:</h2>
    <hr />
    <div className="profile-bears-collection">
      {bears.map(bear => (<BearCard bearInfo={bear} key={bear.id}/>))}
    </div>

  </div>)
}

export default ProfileView