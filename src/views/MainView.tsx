import { useState, useEffect } from 'react'
import { Manager, Socket } from 'socket.io-client'

import IBearEntity from '../../interfaces/IBearEntity'
import BearCard from '../components/BearCard'
import { getRequest } from '../helpers/backendRequsts'
import './MainView.css'

function MainView() {
  const [bears, setBears] = useState<IBearEntity[]>([])
  const [socket, setSocket] = useState<Socket>()

  useEffect(() => {
    // separate in function for correct update
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

      bears.forEach((curBear, i) => {
        s.on(`${curBear.id}changedBid`, (bid) => {
          updateBears(i, bid)
        })
      })
      setSocket(s)
    }
  }, [socket, bears])

  useEffect(() => {
    getRequest('/bears')
      .then((data) => {
        setBears(data)
      })
      .catch((e) => console.log(e))
  }, [])

  return (
    <div className="main-container">
      <div className="main-image">
        <div className='main-image-trail' />
        <h1>Bear Market</h1>
        <h2>Buy, sell, create your own bear</h2>
      </div>
      <main>
        <div className='main-bears-collection'>
          {bears.map(bear => (<BearCard bearInfo={bear} key={bear.id}/>))}
        </div>
      </main>
    </div>
  )
}

export default MainView