import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const GameLobby = () => {
    const { code } = useParams();
    const navigate = useNavigate();
    const [players, setPlayers] = useState([]);
    const [host, setHost] = useState('');
    const [gameTitle, setGameTitle] = useState('');
    const [ready, setReady] = useState(false);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchLobby = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/lobby/${code}`);
                setPlayers(res.data.players);
                setHost(res.data.host);
                setGameTitle(res.data.title);
            } catch {}
        };
        fetchLobby();
        const interval = setInterval(fetchLobby, 2500);
        return () => clearInterval(interval);
    }, [code]);

    const startGame = async () => {
        await axios.post(`http://localhost:5000/start/${code}`);
        setReady(true);
        let c = 3;
        const timer = setInterval(() => {
            c--;
            setCount(c);
            if (c === 0) {
                clearInterval(timer);
                navigate(`/play/${code}`);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center p-8">
            <h1 className="text-3xl font-bold mb-4">{gameTitle || 'Game Lobby'}</h1>
            <p className="text-gray-600 mb-8">Game Code: {code}</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-xl mb-8">
                {players.map((p) => (
                    <div key={p._id} className="bg-white shadow-md rounded-xl p-3 text-center text-gray-700">
                        {p.name}
                    </div>
                ))}
            </div>

            <div className="text-sm text-gray-500 mb-4">
                Host: <span className="font-medium">{host}</span>
            </div>

            {!ready ? (
                <button
                    onClick={startGame}
                    className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700"
                >
                    Start Game
                </button>
            ) : (
                <div className="text-lg font-semibold text-green-700">
                    Game starting in {count || 3}...
                </div>
            )}
        </div>
    );
};

export default GameLobby;
