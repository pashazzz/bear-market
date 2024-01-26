import { useState, useEffect } from 'react'

import IBearEntity from '../../interfaces/IBearEntity'
import BearCard from '../components/BearCard'
import { getRequest } from '../helpers/backendRequsts'
import './MainView.css'

function MainView() {
  const [bears, setBears] = useState<IBearEntity[]>([])
  
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