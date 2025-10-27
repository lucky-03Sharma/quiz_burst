import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const handleJoinGame = async () => {
    if (!gameCode || !playerName) return alert('Please fill all fields');
    try {
      const res = await axios.get(`http://localhost:5000/game/${gameCode}`);
      if (res.data.exists) navigate(`/game-live/${gameCode}?player=${encodeURIComponent(playerName)}`);
      else alert('Invalid Game Code');
    } catch (err) {
      alert('Unable to join game');
    }
  };

  const handleCreateGame = () => navigate('/host-game');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 flex flex-col justify-center items-center px-6 py-10">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-10 tracking-tight">Quiz Burst</h1>
      <div className="grid md:grid-cols-2 gap-10 w-full max-w-5xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Join a Game</h2>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">Your Name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-600">Game Code</label>
            <input
              type="text"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-2 border rounded-lg text-center uppercase tracking-widest focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter code"
            />
          </div>
          <button
            onClick={handleJoinGame}
            className="w-full py-3 text-lg font-medium bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            Join Game
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Create a Game</h2>
          <p className="text-gray-500 text-center mb-8 leading-relaxed">Host your own quiz and invite others instantly.</p>
          <button
            onClick={handleCreateGame}
            className="w-full py-3 text-lg font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
          >
            Create Game
          </button>
        </div>
      </div>
      <div className="mt-12 text-gray-500 text-sm tracking-wide">
        © {new Date().getFullYear()} QuizBurst | Made for real-time fun
      </div>
    </div>
  );
};

export default Home;
