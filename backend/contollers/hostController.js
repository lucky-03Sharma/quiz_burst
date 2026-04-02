import Game from '../models/game.js'

export const endGame = async (req, res) => {
  try {
    const { code } = req.params
    await Game.findOneAndUpdate({ gameCode: code }, { status: 'ended' })
    res.status(200).json({ message: 'Game ended' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getLeaderboard = async (req, res) => {
  try {
    const { code } = req.params
    const game = await Game.findOne({ gameCode: code })
    if (!game) return res.status(404).json({ message: 'Game not found' })
    const scores = (game.players || [])
      .map((p) => ({ name: p.name, points: p.score ?? 0, _id: p._id }))
      .sort((a, b) => b.points - a.points)
    res.status(200).json({ scores })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
