import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express, { Request, Response } from 'express'
import IBearEntity from '../../../interfaces/IBearEntity'
import bearsModel from '../bears/bears.model'
import usersMiddleware from '../users/users.middleware'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

router.get('/thumbs/:name',
  async (req: Request<{name: string}>, res: Response) => {
    const bear: IBearEntity | undefined = await bearsModel.fetchBearByUrl(req.params.name)
    if (bear === undefined) {
      return res.status(404).json({})
    }

    const filePath = path.join(__dirname, `/../../assets/thumbs/${bear.imgUrl}-thumb.${bear.imgExt}`)
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath)
    }
    
    return res.status(404).json({})
  })

  router.get('/orig/:name',
    usersMiddleware.isAuthenticated, 
    async (req: Request<{name: string}>, res: Response) => {
      const bear: IBearEntity | undefined = await bearsModel.fetchBearByUrl(req.params.name)
      if (req.user?.username === undefined) {
        return res.status(401).json({})
      }
      if (req.user?.id !== bear?.ownerId) {
        return res.status(403).json({})
      }
      if (bear === undefined) {
        return res.status(404).json({})
      }

      const filePath = path.join(__dirname, `/../../assets/orig/${bear.imgUrl}.${bear.imgExt}`)
      if (fs.existsSync(filePath)) {
        return res.sendFile(filePath)
      }
      
      return res.status(404).json({})
  })

export default router