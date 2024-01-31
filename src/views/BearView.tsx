import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import IBearEntity from '../../interfaces/IBearEntity'
import { getRequest, getRequestWithAuth } from '../helpers/backendRequsts'
import { useAppSelector } from "../helpers/reduxHooks"
import './BearView.css'
import Back from '../components/Base/Back'

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
  const [origImg, setOrigImg] = useState<string>('')
  const [error, setError] = useState<IError | null>(null)

  useEffect(() => {
    getRequest(`/bears/${params.id}`)
      .then(data => {
        setBear(data)
      })
      .catch(e => {
        console.log(e)
        setError(statusDescriptions[e.response.status])
      })
  }, [params.id])

  // original image can be accessed only for owner
  useEffect(() => {
    if (user.data?.id !== undefined && user.data?.id === bear?.owner) {
      getRequestWithAuth(`/images/orig/${bear?.imgUrl}`, 'arraybuffer')
        .then(img => {
          // convert buffer to base64 image
          const base64 = btoa(
            new Uint8Array(img).reduce(
              (data, byte) => data + String.fromCharCode(byte), '',
            ),
          )
          setOrigImg('data:;base64,' + base64)
        })
        .catch(e => console.log(e))
    }
  }, [user.data?.id, bear])

  if (error !== null) {
    return (
      <div className="view bear-container">
        <Back />
        <h1>{error.caption}</h1>
        <h2>{error.description}</h2>
      </div>
    )
  }
  const bearThumbUrl = `${apiUrl}/images/thumbs/${bear?.imgUrl}`

  return (
    <div className="view bear-container">
      <Back />
      <h1>{bear?.title}</h1>
      <h3>Bear thumbnail accessed to all</h3>
      {bear?.imgUrl && (
        <img className="bear-container-image" src={bearThumbUrl} />
      )}
      {bear?.owner === user.data?.id && 
        <div>
          <h3>Bear original image, that accessed only for owner</h3>
          <img className="bear-container-orig-image" src={origImg} />
        </div>
      }
    </div>
  )
}

export default BearView