import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const JoinGame = () => {
    const [playerName, setPlayerName] = useState('');
    const [gameCode, setGameCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [joining, setJoining] = useState(false);
    const navigate = useNavigate();

    const handleJoin = async () => {
        if (!playerName || !gameCode) return setError('Enter all fields');
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/join', {
                name: playerName,
                code: gameCode
            });
            setJoining(true);
            setTimeout(() => {
                navigate(`/game-room/${res.data.roomId}`);
            }, 1200);
        } catch (err) {
            setError('Invalid game code or player name');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                <h2 className="text-xl font-semibold text-center mb-6">Join Game Room</h2>
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full border rounded-lg p-3 mb-3"
                />
                <input
                    type="text"
                    placeholder="Enter game code"
                    value={gameCode}
                    onChange={(e) => setGameCode(e.target.value)}
                    className="w-full border rounded-lg p-3 mb-4"
                />
                {error && <p className="text-red-500 text-center mb-2">{error}</p>}
                <button
                    onClick={handleJoin}
                    disabled={loading}
                    className={`w-full py-3 rounded-lg text-white font-medium ${
                        loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {joining ? 'Joining...' : 'Join Game'}
                </button>
                <div className="mt-6 text-center text-sm text-gray-500">
                    Waiting for host to start the session
                </div>
            </div>
        </div>
    );
};

export default JoinGame;
