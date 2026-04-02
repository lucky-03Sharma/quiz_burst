import mongoose from 'mongoose'

const playerSchema = new mongoose.Schema({
  name: String,
  score: { type: Number, default: 0 },
  joinedAt: { type: Date, default: Date.now },
})

const gameSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  host: String,
  gameCode: { type: String, required: true, unique: true, index: true },
  status: { type: String, default: 'waiting' },
  players: [playerSchema],
})

export default mongoose.model('Game', gameSchema)
