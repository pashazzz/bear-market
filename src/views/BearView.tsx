import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'

import IBearEntity from '../../interfaces/IBearEntity'
import { getRequest } from '../helpers/backendRequsts'
import { useAppSelector } from "../helpers/reduxHooks"
import './BearView.css'
import Back from '../components/Base/Back'
import BearViewOwnerPart from '../components/BearViewOwnerPart'
import BearViewBidPart from '../components/BearViewBidPart'

interface IError {
  caption: string,
  description: string,
}

const statusDescriptions: Record<number, IError> = {
  404: {
    caption: "Bear with this id not found",
    description: "",
  },
}

const apiUrl = import.meta.env.VITE_SERVER_BASE

const BearView = () => {
  const params = useParams()
  const user = useAppSelector((state) => state.user)

  const [bear, setBear] = useState<IBearEntity | null>(null) 
  const [error, setError] = useState<IError | null>(null)
  const [socket, setSocket] = useState<Socket>()

  useEffect(() => {
    if (bear && bear.ownerId === user.data?.id && !socket) {
      const s: Socket = io(`http://${import.meta.env.VITE_SERVER_HOST}:${import.meta.env.VITE_SERVER_PORT}/`)
      s.on(`${bear.id}addedBid`, (bid) => {
        setBear({...bear, maxBid: bid})
      })
      setSocket(s)
    }
  }, [bear, socket, user.data?.id])

  useEffect(() => {
    getRequest(`/bears/${params.id}`)
      .then(bear => {
        setBear(bear)
      })
      .catch(e => {
        console.log(e)
        setError(statusDescriptions[e.response.status])
      })
  }, [params.id])

  if (error !== null) {
    return (
      <div className="view bear-container">
        <Back />
        <h1>{error.caption}</h1>
        <h2>{error.description}</h2>
      </div>
    )
  }

  if (!bear) {
    return (
      <div className="view bear-container">
        <Back />
      </div>
    )
  }

  const bearThumbUrl = `${apiUrl}/images/thumbs/${bear.imgUrl}`

  return (
    <div className="view bear-container">
      <Back />
      <h1>{bear.title}</h1>
      <h3>Bear thumbnail accessed to all</h3>
      {bear?.imgUrl && (
        <img className="bear-container-thumb-image" src={bearThumbUrl} />
      )}
      {bear.ownerId === user.data?.id
        ? <BearViewOwnerPart bear={bear} />
        : <>
          {user.data &&
            bear.price &&
            bear.tradeStart &&
            <BearViewBidPart bear={bear}/>}
          </>
      }
    </div>
  )
}

export default BearView