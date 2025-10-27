import Game from "../models/game.js";
import Quiz from "../models/quiz.js";

export const createGame = async (req, res) => {
    try {
        const { quizId, host } = req.body;
        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });

        const gameCode = Math.random().toString(36).substring(2, 7).toUpperCase();
        const newGame = new Game({ quizId, host, gameCode, status: "waiting", players: [] });
        await newGame.save();

        res.status(201).json({ message: "Game created", game: newGame });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getGameByCode = async (req, res) => {
    try {
        const game = await Game.findOne({ gameCode: req.params.code });
        if (!game) return res.status(404).json({ message: "Game not found" });
        res.status(200).json({ exists: true, game });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateGameStatus = async (req, res) => {
    try {
        const { code } = req.params;
        const { status } = req.body;
        const updated = await Game.findOneAndUpdate({ gameCode: code }, { status }, { new: true });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
