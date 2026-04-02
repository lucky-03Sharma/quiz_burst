import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config/api';

const Home = () => {
  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const handleJoinGame = async () => {
    if (!gameCode || !playerName) return alert('Please fill all fields');
    try {
      const res = await axios.get(`${API_BASE}/game/${gameCode}`);
      if (res.data.exists) navigate(`/game-live/${gameCode}?player=${encodeURIComponent(playerName)}`);
      else alert('Invalid Game Code');
    } catch (err) {
      alert('Unable to join game');
    }
  };

  const handleCreateGame = () => navigate('/quiz/new');

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-10 fade-in">
      <div className="w-full max-w-6xl px-3 py-8 glass-card">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-8 tracking-tight drop-shadow-lg">
          Quiz Burst
        </h1>
        <p className="text-slate-200 text-center text-lg md:text-xl mb-10">Create live quizzes, invite players instantly, and run real-time trivia sessions with flair.</p>
        <div className="grid md:grid-cols-2 gap-10 w-full">
          <div className="glass-card p-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">Join a Game</h2>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-slate-200">Your Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none bg-white/5 text-slate-100"
                placeholder="Enter your name"
              />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-slate-200">Game Code</label>
            <div className="relative group">
              <span
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-100 border border-cyan-400/35 font-mono text-sm font-bold transition-colors group-hover:bg-cyan-500/30 group-hover:text-white group-hover:border-cyan-300/60 group-focus-within:bg-cyan-500/30 group-focus-within:text-white group-focus-within:border-cyan-200/70 shadow-[0_0_0_1px_rgba(34,211,238,0.12)]"
                title="Game code"
                aria-hidden
              >
                #
              </span>
              <input
                type="text"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                className="w-full pl-14 pr-4 py-3 border border-white/20 rounded-lg text-center uppercase tracking-widest text-white placeholder:text-slate-400 placeholder:font-normal focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400/50 focus:outline-none bg-slate-900/50 hover:border-cyan-400/40 transition-colors"
                placeholder="ABCDE"
                autoComplete="off"
              />
            </div>
          </div>
          <button
            onClick={handleJoinGame}
            className="w-full py-3 text-lg font-medium btn-gradient rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            Join Game
          </button>
        </div>

        <div className="glass-card p-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">Host a Game</h2>
          <p className="text-slate-200 text-center mb-8 leading-relaxed">Create a quiz first, then open the host screen to get your game code.</p>
          <button
            onClick={handleCreateGame}
            className="w-full py-3 text-lg font-medium btn-gradient rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            Create quiz &amp; host
          </button>
          <button
            type="button"
            onClick={() => navigate('/host-game')}
            className="w-full mt-3 py-3 text-lg font-medium rounded-lg border border-white/25 text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 transition-colors"
          >
            I already have a quiz — host now
          </button>
        </div>
      </div>
    </div>
      <div className="mt-12 text-slate-300 text-sm tracking-wide">
        © {new Date().getFullYear()} QuizBurst | Made for real-time fun
      </div>
    </div>
  );
};

export default Home;
