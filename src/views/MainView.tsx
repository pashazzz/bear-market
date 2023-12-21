import { useState, useEffect } from 'react'
import axios from 'axios'

import IBearEntity from '../../interfaces/IBearEntity'
import BearCard from '../components/BearCard'
import './MainView.css'

function MainView() {
  const [bears, setBears] = useState<IBearEntity[]>([])
  
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_SERVER_BASE}/bears`)
      .then((res) => {
        setBears(res.data)
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