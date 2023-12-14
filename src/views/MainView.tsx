import { bearCollection } from '../models/storage'
import { BearCard } from '../components/BearCard'
import './MainView.css'

function MainView() {

  return (
    <div className="main-container">
      <div className="main-image">
        <div className='main-image-trail' />
        <h1>Bear Market</h1>
        <h2>Buy, sell, create your own bear</h2>
      </div>
      <main>
        <div className='main-bears-collection'>
          {bearCollection.map(bear => (<BearCard bearInfo={bear} key={bear.id}/>))}
        </div>
      </main>
    </div>
  )
}

export default MainView