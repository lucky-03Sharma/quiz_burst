import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import quizRouter from './routes/quiz.js'

const app = express()
const port = Number(process.env.PORT) || 5000
const MONGOOSE_URL = process.env.ATLAS_URL

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use('/api/quiz', quizRouter)

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('chatMessage', (msg) => {
    io.emit('chatMessage', msg)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

if (!MONGOOSE_URL) {
  console.error('Missing ATLAS_URL in .env (MongoDB connection string).')
  process.exit(1)
}

mongoose
  .connect(MONGOOSE_URL)
  .then(() => {
    console.log('Connected to database')
    server.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`)
      console.log('API base: http://localhost:' + port + '/api/quiz')
    })
  })
  .catch((err) => {
    console.error('Database connection error:', err)
    process.exit(1)
  })
