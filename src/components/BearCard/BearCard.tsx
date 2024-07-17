import IBearEntity from '../../../interfaces/IBearEntity'

interface IBearCard {
  bearInfo: IBearEntity
}

const apiUrl = import.meta.env.VITE_SERVER_BASE

const BearCard = ({bearInfo}: IBearCard) => {
  const bearThumbUrl = `${apiUrl}/images/thumbs/${bearInfo.imgUrl}`
  const createdAt = new Date(bearInfo.createdAt)
  const bearUrl = `/bear/${bearInfo.id}`

  return (
    <div className="bear-card-container">
      <a href={bearUrl}>
        <div className='bear-card-img' style={{backgroundImage: `url(${bearThumbUrl})`}} />
      </a>
      <div className='bear-card-details'>
        <div style={{minHeight: '72px'}}>
          <a href={bearUrl}>
            <div className='bear-card-title'>{bearInfo.title}</div>
          </a>
          { bearInfo.description && (<div className='bear-card-description'>{bearInfo.description}</div>) }
        </div>
        <div className='bear-card-bottom'>
          <div className='bear-card-createdAt'>{createdAt.toLocaleDateString(navigator.language)}</div>
          { bearInfo.price && (
            <div className='bear-card-price'>
              {bearInfo.maxBid ? (
                <div className="tooltip-wrapper">
                  <div className='tooltip'>Last bid</div>
                  {'\u0296' + bearInfo.maxBid + ' Cr'}
                </div>) : bearInfo.price + ' Cr'}
            </div>
          ) }
          <div style={{clear: 'both'}} />
        </div>
      </div>
    </div>
  )
}

export default BearCard