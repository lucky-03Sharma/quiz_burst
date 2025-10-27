import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";
let socket;

const Live = ({ isHost = false }) => {
  const { gamecode: gameCode } = useParams();
  const [searchParams] = useSearchParams();
  const playerName = searchParams.get('player');
  
  const [players, setPlayers] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [stage, setStage] = useState("lobby"); // "lobby" | "question" | "leaderboard"
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    socket = io(SOCKET_URL);

    // Join the game room
    socket.emit("join", { gameCode, playerName, isHost });

    // Listen for game events
    socket.on("playerJoined", (player) => {
      setPlayers(prev => [...prev, player]);
    });

    socket.on("playerLeft", (playerId) => {
      setPlayers(prev => prev.filter(p => p.id !== playerId));
    });

    socket.on("gameStarted", (data) => {
      setStage("question");
      setCurrentQuestion(data.question);
    });

    socket.on("nextQuestion", (data) => {
      setCurrentQuestion(data.question);
      setSelectedAnswer(null);
    });

    socket.on("gameEnded", (data) => {
      setStage("leaderboard");
    });

    return () => {
      socket.disconnect();
    };
  }, [gameCode, playerName, isHost]);

  const startGame = () => {
    socket.emit("start", { gameCode });
    setStage("question");
  };

  const nextQuestion = () => {
    socket.emit("next", { gameCode });
  };

  const endGame = () => {
    socket.emit("end", { gameCode });
    setStage("leaderboard");
  };

  const handleAnswerSelect = (answer) => {
    if (selectedAnswer) return; // Prevent multiple answers
    setSelectedAnswer(answer);
    socket.emit("answer", { gameCode, answer, playerName });
  };

  if (isHost) {
    // Host View
    return (
      <div className="p-6 grid grid-cols-4 gap-6">
        {/* Left: Player List */}
        <div className="col-span-1 bg-gray-100 rounded-xl p-4 shadow">
          <h2 className="text-lg font-bold mb-2">
            Players ({players.length})
          </h2>
          <ul className="space-y-1 max-h-80 overflow-y-auto">
            {players.map((p, idx) => (
              <li
                key={idx}
                className="bg-white p-2 rounded shadow-sm border"
              >
                {p.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Center: Game Panel */}
        <div className="col-span-2 bg-white rounded-xl p-6 shadow flex flex-col items-center justify-center">
          {stage === "lobby" && (
            <>
              <h1 className="text-2xl font-bold">{quizTitle}</h1>
              <p className="mt-4 text-gray-600">
                Waiting for players to join...
              </p>
              <h2 className="mt-6 text-xl font-mono bg-gray-200 px-4 py-2 rounded">
                Game Code: {gameCode}
              </h2>
            </>
          )}

          {stage === "question" && currentQuestion && (
            <>
              <h2 className="text-xl font-bold mb-4">
                {currentQuestion.question}
              </h2>
              <ul className="space-y-2">
                {currentQuestion.options.map((opt, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 border rounded bg-gray-50"
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            </>
          )}

          {stage === "leaderboard" && (
            <h2 className="text-xl font-bold">Leaderboard coming here...</h2>
          )}
        </div>

        {/* Right: Controls */}
        <div className="col-span-1 bg-gray-100 rounded-xl p-4 shadow flex flex-col gap-3">
          {stage === "lobby" && (
            <button
              onClick={startGame}
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              Start Game
            </button>
          )}
          {stage === "question" && (
            <button
              onClick={nextQuestion}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Next Question
            </button>
          )}
          <button
            onClick={endGame}
            className="bg-red-500 text-white py-2 px-4 rounded"
          >
            End Game
          </button>
        </div>
      </div>
    );
  } else {
    // Player View
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl p-6 shadow">
          {stage === "lobby" && (
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Waiting for game to start...</h1>
              <p className="text-gray-600">Game Code: {gameCode}</p>
              <p className="text-gray-600">Player: {playerName}</p>
            </div>
          )}

          {stage === "question" && currentQuestion && (
            <div>
              <h2 className="text-xl font-bold mb-6 text-center">
                {currentQuestion.question}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(opt)}
                    disabled={selectedAnswer}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      selectedAnswer === opt
                        ? 'bg-blue-500 text-white border-blue-500'
                        : selectedAnswer
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-white hover:bg-gray-50 border-gray-300 cursor-pointer'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {selectedAnswer && (
                <p className="text-center mt-4 text-gray-600">
                  Answer submitted! Waiting for next question...
                </p>
              )}
            </div>
          )}

          {stage === "leaderboard" && (
            <div className="text-center">
              <h2 className="text-xl font-bold">Game Over!</h2>
              <p className="mt-4">Your score: {score}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default HostGameLive;
