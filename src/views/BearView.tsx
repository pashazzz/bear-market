import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import IBearEntity from '../../interfaces/IBearEntity'
import { getRequest } from '../helpers/backendRequsts'
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

const BearView = () => {
  const params = useParams()

  const [bear, setBear] = useState<IBearEntity | null>(null)
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

  if (error !== null) {
    return (
      <div className="view bear-container">
        <Back />
        <h1>{error.caption}</h1>
        <h2>{error.description}</h2>
      </div>
    )
  }

  return (
    <div className="view bear-container">
      <Back />
      <h1>{bear?.title}</h1>
    </div>
  )
}

export default BearView