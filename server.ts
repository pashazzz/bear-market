import { app } from './app.js'

const port: number = Number(process?.env?.SERVER_PORT) || 5001

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
