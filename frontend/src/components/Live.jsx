import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";
let socket;

const Live = ({ isHost = false }) => {
  const { gamecode: gameCode } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate()
  const playerName = searchParams.get('player');

  const [players, setPlayers] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [stage, setStage] = useState("lobby");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [hasNavigatedToLeaderboard, setHasNavigatedToLeaderboard] = useState(false);

  const pageBg = isHost
    ? 'radial-gradient(circle at 20% 20%, rgba(34,197,94,0.18), transparent 55%), linear-gradient(135deg, #131a2b, #0b1120)'
    : 'radial-gradient(circle at 80% 30%, rgba(14,165,233,0.15), transparent 50%), linear-gradient(150deg, #0f172a, #1d2f5b)';

  useEffect(() => {
    socket = io(SOCKET_URL);
    socket.emit('join', { gameCode, playerName, isHost });

    socket.on('playerJoined', (player) => {
      setPlayers(prev => [...prev, player]);
    });

    socket.on('playerLeft', (playerId) => {
      setPlayers(prev => prev.filter(p => p.id !== playerId));
    });

    socket.on('gameStarted', (data) => {
      setStage('question');
      setCurrentQuestion(data.question);
    });

    socket.on('nextQuestion', (data) => {
      setCurrentQuestion(data.question);
      setSelectedAnswer(null);
    });

    socket.on('gameEnded', () => {
      setStage('leaderboard');
      if (!hasNavigatedToLeaderboard) {
        setHasNavigatedToLeaderboard(true);
        navigate(`/leaderboard?code=${encodeURIComponent(gameCode)}`)
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [gameCode, playerName, isHost, hasNavigatedToLeaderboard, navigate]);

  const startGame = () => {
    socket.emit('start', { gameCode });
    setStage('question');
  };

  const nextQuestion = () => {
    socket.emit('next', { gameCode });
  };

  const endGame = () => {
    socket.emit('end', { gameCode });
    setStage('leaderboard');
    if (!hasNavigatedToLeaderboard) {
      setHasNavigatedToLeaderboard(true);
      navigate(`/leaderboard?code=${encodeURIComponent(gameCode)}`)
    }
  };

  const handleAnswerSelect = (answer) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    socket.emit('answer', { gameCode, answer, playerName });
  };

  if (isHost) {
    return (
      <div className="min-h-screen p-6" style={{ background: pageBg }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="glass-card p-4">
            <h2 className="text-lg font-bold text-white mb-2">Players ({players.length})</h2>
            <ul className="space-y-2 max-h-80 overflow-y-auto">
              {players.map((p, idx) => (
                <li key={idx} className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/15">{p.name}</li>
              ))}
            </ul>
          </div>

          <div className="xl:col-span-2 glass-card p-6 flex flex-col items-center justify-center">
            {stage === 'lobby' && (
              <>
                <h1 className="text-3xl font-bold text-white">{quizTitle || 'Live Game Lobby'}</h1>
                <p className="mt-4 text-cyan-100">Waiting for players to join...</p>
                <div className="mt-6 text-center">
                  <span className="px-4 py-2 rounded-lg backdrop-blur-sm bg-white/10 text-white border border-cyan-200/40">Game Code: {gameCode}</span>
                </div>
              </>
            )}

            {stage === 'question' && currentQuestion && (
              <div className="w-full">
                <h2 className="text-2xl font-bold mb-4 text-white">{currentQuestion.question}</h2>
                <ul className="space-y-3">
                  {currentQuestion.options.map((opt, idx) => (
                    <li key={idx} className="p-3 border border-cyan-300/40 rounded-lg bg-white/10 text-cyan-50 hover:bg-cyan-500/20 transition">{opt}</li>
                  ))}
                </ul>
              </div>
            )}

            {stage === 'leaderboard' && (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Game Over!</h2>
                <p className="mt-3 text-cyan-100">Opening the leaderboard…</p>
                <button
                  onClick={() => navigate(`/leaderboard?code=${encodeURIComponent(gameCode)}`)}
                  className="btn-gradient mt-5 py-2 px-4 rounded-lg"
                >
                  Open Leaderboard
                </button>
              </div>
            )}
          </div>

          <div className="glass-card p-4 flex flex-col gap-3">
            {stage === 'lobby' && <button onClick={startGame} className="btn-gradient py-2 px-4 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 font-medium">Start Game</button>}
            {stage === 'question' && <button onClick={nextQuestion} className="btn-gradient py-2 px-4 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 font-medium">Next Question</button>}
            <button onClick={endGame} className="btn-soft py-2 px-4 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 font-medium">End Game</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ background: pageBg }}>
      <div className="max-w-4xl mx-auto glass-card p-6">
        {stage === 'lobby' && (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-white">Waiting for game to start...</h1>
            <p className="text-cyan-100">Game Code: <span className="font-semibold text-white">{gameCode}</span></p>
            <p className="text-cyan-100">Player: <span className="font-semibold text-white">{playerName}</span></p>
          </div>
        )}

        {stage === 'question' && currentQuestion && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-white">{currentQuestion.question}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(opt)}
                  disabled={selectedAnswer}
                  className={`p-4 border rounded-lg text-left text-white transition-all duration-200 ${
                    selectedAnswer === opt
                      ? 'bg-cyan-500 border-cyan-400 shadow-lg'
                      : selectedAnswer
                      ? 'bg-slate-700 text-slate-300 border-slate-500 cursor-not-allowed'
                      : 'bg-white/10 border-cyan-200/40 hover:bg-cyan-500/20 cursor-pointer'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {selectedAnswer && <p className="text-center mt-4 text-cyan-100">Answer submitted! Waiting for next question...</p>}
          </div>
        )}

        {stage === 'leaderboard' && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Game Over!</h2>
            <p className="mt-4 text-cyan-100">Your score: <span className="text-white">{score}</span></p>
            <button
              onClick={() => navigate(`/leaderboard?code=${encodeURIComponent(gameCode)}`)}
              className="btn-gradient mt-5 py-2 px-4 rounded-lg"
            >
              View Leaderboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Live;
