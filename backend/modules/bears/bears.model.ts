import IBearEntity from "../../../interfaces/IBearEntity"

const dumpBears: IBearEntity[] = [
  {
    id: 0,
    title: 'Bear',
    imgUrl: '9a488ca53c6846888f06bfe0872e2b13-thumb.jpg',
    owner: 0,
    createdAt: '2023-11-30T08:00:00Z',
  },
  {
    id: 1,
    title: 'Karhu',
    description: 'Description',
    imgUrl: '1d3e2d9234e244b3a1009dcb3966132a-thumb.jpg',
    owner: 1,
    price: 8,
    createdAt: '2023-12-01T08:12:00Z',
  },
  {
    id: 2,
    title: 'Vedmid`',
    imgUrl: '047b1663d55448dbac8ad8c0943a4501-thumb.jpg',
    owner: 1,
    createdAt: '2023-12-01T09:00:00Z',
  },
  {
    id: 3,
    title: 'Vedmezha',
    imgUrl: 'isometric-art-8151613_1920-thumb.png',
    owner: 2,
    price: 5,
    createdAt: '2023-12-01T09:00:00Z',
  },
  {
    id: 4,
    title: 'Father & Son',
    description: 'ursa-major-ursa-minor-constellations-thumb.jpg ursa-major-ursa-minor-constellations-thumb.jpg',
    imgUrl: 'ursa-major-ursa-minor-constellations-thumb.jpg',
    owner: 2,
    price: 4,
    createdAt: '2023-12-02T09:12:00Z',
  },
]

const fetchBears = (ofUserId?: number): IBearEntity[] => {
  if (ofUserId === undefined) {
    return dumpBears
  }
  return dumpBears.filter(bear => bear.owner === ofUserId)
}

const fetchBear = (id: number): IBearEntity | undefined => {
  return dumpBears.find(b => b.id === id)
}

export default {
  fetchBears,
  fetchBear,
}