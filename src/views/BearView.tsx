import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import IBearEntity from '../../interfaces/IBearEntity'
import { getRequest, getRequestWithAuth, postRequestWithAuth } from '../helpers/backendRequsts'
import { useAppSelector } from "../helpers/reduxHooks"
import './BearView.css'
import Back from '../components/Base/Back'
import PriceButtons from '../components/PriceButtons'
import TradePeriod from '../components/TradePeriod'

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

  const [price, setPrice] = useState<number | undefined | null>(undefined)
  const [tradeStart, setTradeStart] = useState<Date | undefined>(undefined)
  const [tradeEnd, setTradeEnd] = useState<Date | undefined>(undefined)

  useEffect(() => {
    getRequest(`/bears/${params.id}`)
      .then(bear => {
        setBear(bear)
        if (bear.price) {
          setPrice(bear.price)
        }
        if (bear.tradeStart) {
          setTradeStart(new Date(bear.tradeStart))
        }
        if (bear.tradeEnd) {
          setTradeEnd(new Date(bear.tradeEnd))
        }
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

  useEffect(() => {
    if (price !== undefined && bear?.price !== price) {
      postRequestWithAuth(`/bears/changePrice`, {id: bear?.id, price})
        .then(res => console.log(res))
    }
  }, [bear?.id, bear?.price, price])

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
        <img className="bear-container-thumb-image" src={bearThumbUrl} />
      )}
      {bear?.owner === user.data?.id && 
        <div className="bear-container-owner-part">
          <div className="bear-container-img">
            <h3>Bear original image, that accessed only for owner</h3>
            <h5>(you can copy the image and use it how you want)</h5>
            <img className="bear-container-orig-image" src={origImg} />
          </div>

          <div className="bear-container-options">
            <PriceButtons setPrice={setPrice} currentPrice={price}/>
            <TradePeriod
              tradeStart={tradeStart}
              setTradeStart={setTradeStart}
              tradeEnd={tradeEnd}
              setTradeEnd={setTradeEnd}
            />
          </div>
        </div>
      }
    </div>
  )
}

export default BearView