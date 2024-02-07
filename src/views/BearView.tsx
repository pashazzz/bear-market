import React, { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import IBearEntity from '../../interfaces/IBearEntity'
import { getRequest, getRequestWithAuth, postRequestWithAuth } from '../helpers/backendRequsts'
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

  const [price, setPrice] = useState<number | undefined>(undefined)

  useEffect(() => {
    getRequest(`/bears/${params.id}`)
      .then(data => {
        setBear(data)
        if (data.price) {
          setPrice(data.price)
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
    if (price && bear?.price !== price) {
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
  const tradeStart: Date | undefined = bear?.tradeStart ? new Date(bear?.tradeStart) : undefined
  const tradeEnd: Date | undefined = bear?.tradeEnd ? new Date(bear?.tradeEnd) : undefined
  let tradeStartStr: string | undefined
  let tradeEndStr: string | undefined
  if (tradeStart) {
    tradeStartStr = tradeStart?.toLocaleDateString(navigator.language)
  }
  if (tradeStart && tradeEnd) {
    tradeEndStr = tradeEnd?.toLocaleDateString(navigator.language)
  }

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
            <SetPriceBtn setPrice={setPrice} currentPrice={price}/>
            <div>Trade start: {tradeStartStr ? tradeStartStr : ''}</div>
            <div>Trade end: {tradeEndStr ? tradeEndStr : ''}</div>
          </div>
        </div>
      }
    </div>
  )
}

interface PriceBtnProps {
  currentPrice?: number,
  setPrice: (val: number) => void
}

const SetPriceBtn: FC<PriceBtnProps> = ({currentPrice, setPrice}) => {
  const minPrice = 3
  const maxPrice = 10

  const [displayBtn, setDisplayBtn] = useState<boolean>(true)
  const [selectedPrice, setSelectedPrice] = useState<number>(currentPrice ?? minPrice)

  if (displayBtn) {
    return (
      <div className="bear-container-price">
        {currentPrice ? `Price: ${currentPrice} Credits` : ''}
        <button onClick={() => setDisplayBtn(false)}>
          {currentPrice ? 'Change price' : 'Set price'}
        </button>
      </div>
    )
  }

  const onPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let num = Number(e.target.value)
    if (num < minPrice) {
      num = minPrice
      e.target.value = String(minPrice)
    }
    if (num > maxPrice) {
      num = maxPrice
      e.target.value = String(maxPrice)
    }
    setSelectedPrice(num)
  }

  const onSetPrice = () => {
    setPrice(selectedPrice)
    setDisplayBtn(true)
  }

  return (
    <div className="bear-container-price">
      Price:
      <input type='number' min={minPrice} max={maxPrice} value={selectedPrice} onChange={onPriceChange}/>
      Credits
      <button onClick={onSetPrice}>Set price</button>
      <button onClick={() => setDisplayBtn(true)}>Cancel</button>
    </div>
  )
}

export default BearView