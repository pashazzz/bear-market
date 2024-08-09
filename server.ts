import { Server } from 'socket.io'
import { createServer } from 'node:http'
import app from './app.js'

const port: number = Number(process.env.SERVER_PORT) || 5001

const server = createServer(app)

export const wsServer = new Server(server, {
  cors: {}
})

wsServer.on('connection', () => {
  console.log('-> wsServer connection')
})

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
