import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config/api';
import SelectDropdown from './SelectDropdown';

const CATEGORY_FILTER_OPTIONS = [
    { value: '', label: 'All Categories' },
    { value: 'science', label: 'Science' },
    { value: 'sports', label: 'Sports' },
    { value: 'tech', label: 'Technology' },
    { value: 'history', label: 'History' },
];

const DIFFICULTY_FILTER_OPTIONS = [
    { value: '', label: 'All Levels' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
];

const HostGameCreate = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState('');
    const [hostName, setHostName] = useState('');
    const [category, setCategory] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [loading, setLoading] = useState(false);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [preview, setPreview] = useState(null);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchQuizzes = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_BASE}/`);
                setQuizzes(res.data.quizzes || []);
                setFiltered(res.data.quizzes || []);
            } catch (err) {
                console.error('Failed to fetch quizzes', err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, []);

    useEffect(() => {
        const createdId = location.state?.createdQuizId;
        if (!createdId || quizzes.length === 0) return;
        const found = quizzes.find((q) => String(q._id) === String(createdId));
        if (found) {
            setSelectedQuiz(String(found._id));
            setPreview(found);
        }
    }, [location.state, quizzes]);

    const handleCreateGame = async () => {
        if (!hostName || !selectedQuiz) return alert('Enter name and select a quiz');
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/create-game`, {
                quizId: selectedQuiz,
                host: hostName,
            });
            navigate(`/host-game-live/${res.data.game.gameCode}`);
        } catch (err) {
            alert('Failed to create game');
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = () => {
        let filteredData = quizzes;
        if (category) filteredData = filteredData.filter(q => q.category === category);
        if (difficulty) filteredData = filteredData.filter(q => q.difficulty === difficulty);
        if (search) filteredData = filteredData.filter(q => q.title.toLowerCase().includes(search.toLowerCase()));
        setFiltered(filteredData);
    };

    const handlePreview = (id) => {
        const quiz = quizzes.find((q) => String(q._id) === String(id));
        setPreview(quiz || null);
    };

    const handleConfirm = () => {
        setConfirmVisible(true);
        setTimeout(() => setConfirmVisible(false), 2500);
    };

    const quizSelectOptions = [
        { value: '', label: loading ? 'Loading quizzes…' : '-- Select a Quiz --' },
        ...filtered.map((q) => ({
            value: String(q._id),
            label: `${q.title} (${q.questionCount ?? q.questions?.length ?? 0} Qs)`,
        })),
    ];

    return (
        <div className="min-h-screen flex flex-col justify-center items-center py-14 px-6">
            <div className="w-full max-w-lg glass-card shadow-lg rounded-3xl border border-white/20 p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-6">Create a Game Session</h1>

                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-200/80 text-center sm:text-left">
                        New here? <span className="text-white font-medium">Create a quiz</span> first, then select it below.
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate('/quiz/new')}
                        className="btn-gradient px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap"
                    >
                        + Create quiz
                    </button>
                </div>

                {!loading && quizzes.length === 0 && (
                    <div className="mb-5 rounded-xl border border-amber-400/35 bg-amber-950/25 p-4 text-amber-100 text-sm">
                        <p className="font-semibold text-amber-50 mb-1">No quizzes in the database yet</p>
                        <p className="text-amber-100/85 mb-3">You need at least one quiz before you can host.</p>
                        <button
                            type="button"
                            onClick={() => navigate('/quiz/new')}
                            className="btn-gradient px-4 py-2 rounded-lg text-sm"
                        >
                            Create your first quiz
                        </button>
                    </div>
                )}
                
                <div className="mb-4">
                    <input
                        type="text"
                        value={hostName}
                        onChange={(e) => setHostName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full border border-white/20 bg-white/5 text-slate-100 rounded-xl p-3 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                    />
                </div>

                <div className="mb-4 flex gap-2">
                    <input
                        type="text"
                        placeholder="Search quizzes"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 border border-white/20 bg-white/5 text-slate-100 rounded-xl p-3 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                    />
                    <button
                        onClick={handleFilter}
                        className="btn-gradient px-4 py-2 rounded-xl text-white hover:brightness-105 transition"
                    >
                        Search
                    </button>
                </div>

                <div className="mb-4 flex gap-2">
                    <SelectDropdown
                        className="flex-1"
                        value={category}
                        onChange={setCategory}
                        options={CATEGORY_FILTER_OPTIONS}
                    />
                    <SelectDropdown
                        className="flex-1"
                        value={difficulty}
                        onChange={setDifficulty}
                        options={DIFFICULTY_FILTER_OPTIONS}
                    />
                </div>

                <div className="mb-2">
                    <label className="block text-sm font-medium text-slate-200 mb-2">Choose quiz to host</label>
                    <SelectDropdown
                        value={selectedQuiz}
                        onChange={(id) => {
                            setSelectedQuiz(id);
                            if (id) handlePreview(id);
                            else setPreview(null);
                        }}
                        options={quizSelectOptions}
                        disabled={!quizzes.length && !loading}
                    />
                </div>
                {!loading && quizzes.length > 0 && filtered.length === 0 && (
                    <p className="text-amber-200/90 text-sm mb-4">No quizzes match your filters. Try &quot;All Categories&quot; / &quot;All Levels&quot;.</p>
                )}

                {preview && (
                    <div className="bg-white/5 border border-white/15 rounded-lg p-4 mb-4 text-sm">
                        <p className="font-semibold text-white">{preview.title}</p>
                        <p className="text-slate-200/80 mt-1">Category: {preview.category || 'General'}</p>
                        <p className="text-slate-200/80">Difficulty: {preview.difficulty || 'Mixed'}</p>
                        <p className="text-slate-200/80 mt-2">Total Questions: {preview.questionCount}</p>
                    </div>
                )}

                <button
                    onClick={() => {
                        handleConfirm();
                        handleCreateGame();
                    }}
                    disabled={loading}
                    className={`w-full py-3 rounded-xl font-medium transition ${
                        loading
                            ? 'bg-slate-300 cursor-not-allowed text-slate-600'
                            : 'btn-gradient hover:brightness-105 text-white'
                    } focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300`}
                >
                    {loading ? 'Creating...' : 'Create Game'}
                </button>

                {confirmVisible && (
                    <div className="mt-4 bg-emerald-900/20 text-emerald-200 border border-emerald-200/30 rounded-lg p-3 text-center">
                        Game setup in progress...
                    </div>
                )}
            </div>

            <div className="mt-8 w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.slice(0, 4).map((q) => (
                    <div key={q._id} className="glass-card rounded-xl p-4 border border-white/15 shadow-sm transition hover:shadow-md">
                        <p className="font-semibold text-white text-lg">{q.title}</p>
                        <p className="text-slate-200/80 text-sm mt-1">{q.category || 'General'}</p>
                        <p className="text-slate-200/60 text-xs mt-1">{q.difficulty || 'Mixed'} | {q.questionCount} Questions</p>
                        <button
                            onClick={() => {
                                setSelectedQuiz(String(q._id));
                                handlePreview(q._id);
                            }}
                            className="mt-3 px-3 py-2 rounded-lg btn-gradient text-white hover:brightness-105"
                        >
                            Select
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HostGameCreate;
