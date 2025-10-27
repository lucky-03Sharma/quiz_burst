import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import quizRouter from './routes/quiz.js'
import registerSocketHandlers from './handlers/socketHandler.js'

const app = express()
const port = process.env.PORT || 5000
const MONGOOSE_URL = process.env.ATLAS_URL

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use('/api/quiz', quizRouter)

mongoose.connect(MONGOOSE_URL)
  .then(() => console.log('Connected to database'))
  .catch((err) => console.error('Database connection error:', err))

const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
})

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)
  registerSocketHandlers(io, socket)
})

server.listen(port, () => console.log(`Server running on port ${port}`))
