import 'dotenv/config'

//express - connect to server using express
import express from 'express';
const app = express();
const port = process.env.PORT;
app.listen(port, () => console.log(`app is listening to port ${port}`));

import mongoose from 'mongoose';
const MONGOOSE_URL = process.env.ATLAS_URL;
async function main() {
    mongoose.connect(MONGOOSE_URL)
}
main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

import cors from 'cors';

// Allow all origins
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json()); 

import quizRouter from './routes/quiz.js'

app.use('/api/quiz', quizRouter)

import http from "http"
import { Server } from "socket.io"
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log("User connected:", socket.id)

    socket.on("chatMessage", (msg) => {
        console.log("message Received:", msg)

        io.emit("chatMessage", msg)
    })

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    })
})
