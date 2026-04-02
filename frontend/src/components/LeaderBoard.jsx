import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config/api';

const Leaderboard = () => {
    const { code: codeParam } = useParams();
    const [searchParams] = useSearchParams();
    const code = codeParam ?? searchParams.get('code') ?? searchParams.get('gamecode');
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchScores = async () => {
            if (!code) return setLoading(false);
            try {
                const res = await axios.get(`${API_BASE}/game/${code}/leaderboard`);
                setScores(res.data.scores || []);
            } catch {
            } finally {
                setLoading(false);
            }
        };
        fetchScores();
    }, [code]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
            <h1 className="text-3xl font-bold mb-6 text-white">Leaderboard</h1>
            {loading ? (
                <p className="text-slate-200/70">Loading scores...</p>
            ) : (
                <div className="w-full max-w-lg glass-card rounded-2xl border border-white/15 shadow-lg overflow-hidden">
                    {scores.map((s, i) => (
                        <div
                            key={s._id ?? `${s.name}-${i}`}
                            className={`flex justify-between items-center px-5 py-3 border-t border-white/10 ${
                                i === 0
                                    ? 'bg-yellow-500/15 font-bold text-yellow-100'
                                    : i === 1
                                    ? 'bg-slate-200/10 text-slate-100'
                                    : i === 2
                                    ? 'bg-amber-500/15 text-amber-100'
                                    : ''
                            }`}
                        >
                            <span className="text-white/90">{i + 1}. {s.name}</span>
                            <span className="text-white font-bold">{s.points} pts</span>
                        </div>
                    ))}
                    {scores.length === 0 && (
                        <div className="text-center text-slate-200/70 py-6">No data available</div>
                    )}
                </div>
            )}

            <button
                onClick={() => navigate('/')}
                className="mt-6 btn-soft text-white px-5 py-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
                Back to Home
            </button>
        </div>
    );
};

export default Leaderboard;
