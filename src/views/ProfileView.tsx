import { Manager, Socket } from 'socket.io-client'

import './ProfileView.css'
import { useEffect, useState } from "react"
import { getRequestWithAuth } from "../helpers/backendRequsts"
import { useAppSelector } from "../helpers/reduxHooks"
import IBearEntity from "../../interfaces/IBearEntity"
import BearCard from "../components/BearCard"

const ProfileView = () => {
  const user = useAppSelector((state) => state.user)
  const [bears, setBears] = useState<IBearEntity[]>([])
  const [socket, setSocket] = useState<Socket>()

  useEffect(() => {
    const updateBears = (i: number, bid: number) => {
      const updBears = [...bears]
      updBears[i].maxBid = bid
      setBears(updBears)
    }

    if (bears.length > 0 && !socket) {
      const manager = new Manager(`http://${import.meta.env.VITE_SERVER_HOST}:${import.meta.env.VITE_SERVER_PORT}`, {
        reconnectionDelay: 5000,
        reconnectionAttempts: 20,
      })
      const s: Socket = manager.socket('/')
      bears.forEach((bear, i) => {
        s.on(`${bear.id}changedBid`, bid => {
          updateBears(i, bid)
        })
      })

      setSocket(s)
    }
  }, [bears, socket])

  useEffect(() => {
    getRequestWithAuth(`/users/${user.data?.username}/bears`)
      .then(data => setBears(data))
      .catch(e => {
        console.log(e)
      })
  }, [user.data])
  
  return (
  <div className="view profile-container">
    <h1>Hi, {user.data?.username}</h1>
    <br />
    <h3>Wallet: {user.data?.wallet} Credits</h3>
    <h2>Your bears:</h2>
    <hr />
    <div className="profile-bears-collection">
      {bears.map(bear => (<BearCard bearInfo={bear} key={bear.id}/>))}
    </div>

  </div>)
}

export default ProfileView