import express from "express";
import { createQuiz, getQuizByCode, getAllQuizzes } from "../controllers/quizController.js";
import { createGame, getGameByCode, updateGameStatus } from "../controllers/gameController.js";
import { addPlayer, updateScore } from "../controllers/playerController.js";
// import { endGame, getLeaderboard } from "../controllers/hostController.js";

const router = express.Router();

// Quiz routes
router.post("/create", createQuiz);
router.get("/join/:code", getQuizByCode);
router.get("/", getAllQuizzes);

// Game routes
router.post("/create-game", createGame);
router.get("/game/:code", getGameByCode);
router.put("/game/:code/status", updateGameStatus);

// Player routes
router.post("/game/:code/join", addPlayer);
router.post("/game/:code/score", updateScore);

// Host routes
router.post("/game/:code/end", endGame);
router.get("/game/:code/leaderboard", getLeaderboard);

export default router;
