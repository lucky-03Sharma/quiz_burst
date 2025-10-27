import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Leaderboard = () => {
    const { code } = useParams();
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/scores/${code}`);
                setScores(res.data.scores || []);
            } catch {
            } finally {
                setLoading(false);
            }
        };
        fetchScores();
    }, [code]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-yellow-50 to-white p-8">
            <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
            {loading ? (
                <p className="text-gray-500">Loading scores...</p>
            ) : (
                <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg overflow-hidden">
                    {scores.map((s, i) => (
                        <div
                            key={s._id}
                            className={`flex justify-between items-center px-5 py-3 ${
                                i === 0
                                    ? 'bg-yellow-100 font-bold'
                                    : i === 1
                                    ? 'bg-gray-100'
                                    : i === 2
                                    ? 'bg-amber-50'
                                    : ''
                            }`}
                        >
                            <span>{i + 1}. {s.name}</span>
                            <span>{s.points} pts</span>
                        </div>
                    ))}
                    {scores.length === 0 && (
                        <div className="text-center text-gray-500 py-6">No data available</div>
                    )}
                </div>
            )}

            <button
                onClick={() => navigate('/')}
                className="mt-6 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
            >
                Back to Home
            </button>
        </div>
    );
};

export default Leaderboard;
