import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

    useEffect(() => {
        const fetchQuizzes = async () => {
            setLoading(true);
            try {
                const res = await axios.get('http://localhost:5000/quiz/');
                setQuizzes(res.data.quizzes);
                setFiltered(res.data.quizzes);
            } catch (err) {
                console.error('Failed to fetch quizzes', err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, []);

    const handleCreateGame = async () => {
        if (!hostName || !selectedQuiz) return alert('Enter name and select a quiz');
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/create', {
                quizId: selectedQuiz,
                host: hostName,
                category,
                difficulty
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
        const quiz = quizzes.find(q => q._id === id);
        setPreview(quiz);
    };

    const handleConfirm = () => {
        setConfirmVisible(true);
        setTimeout(() => setConfirmVisible(false), 2500);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-10 px-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-2xl font-semibold text-center mb-6">Create a Game Session</h1>
                
                <div className="mb-4">
                    <input
                        type="text"
                        value={hostName}
                        onChange={(e) => setHostName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full border border-gray-300 rounded-lg p-3"
                    />
                </div>

                <div className="mb-4 flex gap-2">
                    <input
                        type="text"
                        placeholder="Search quizzes"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg p-3"
                    />
                    <button
                        onClick={handleFilter}
                        className="bg-blue-600 text-white px-4 rounded-lg"
                    >
                        Search
                    </button>
                </div>

                <div className="mb-4 flex gap-2">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg p-3"
                    >
                        <option value="">All Categories</option>
                        <option value="science">Science</option>
                        <option value="sports">Sports</option>
                        <option value="tech">Technology</option>
                        <option value="history">History</option>
                    </select>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg p-3"
                    >
                        <option value="">All Levels</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>

                <div className="mb-6">
                    <select
                        value={selectedQuiz}
                        onChange={(e) => {
                            setSelectedQuiz(e.target.value);
                            handlePreview(e.target.value);
                        }}
                        className="w-full border border-gray-300 rounded-lg p-3"
                    >
                        <option value="">-- Select a Quiz --</option>
                        {filtered.map((q) => (
                            <option key={q._id} value={q._id}>
                                {q.title} ({q.questionCount} Qs)
                            </option>
                        ))}
                    </select>
                </div>

                {preview && (
                    <div className="bg-gray-100 rounded-lg p-4 mb-4 text-sm">
                        <p className="font-medium">{preview.title}</p>
                        <p className="text-gray-600 mt-1">Category: {preview.category || 'General'}</p>
                        <p className="text-gray-600">Difficulty: {preview.difficulty || 'Mixed'}</p>
                        <p className="text-gray-600 mt-2">Total Questions: {preview.questionCount}</p>
                    </div>
                )}

                <button
                    onClick={() => {
                        handleConfirm();
                        handleCreateGame();
                    }}
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-medium transition ${
                        loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                >
                    {loading ? 'Creating...' : 'Create Game'}
                </button>

                {confirmVisible && (
                    <div className="mt-4 bg-green-50 text-green-700 border border-green-300 rounded-lg p-3 text-center">
                        Game setup in progress...
                    </div>
                )}
            </div>

            <div className="mt-8 w-full max-w-2xl grid grid-cols-2 gap-4">
                {filtered.slice(0, 4).map((q) => (
                    <div key={q._id} className="bg-white p-4 shadow-md rounded-lg flex flex-col items-start hover:shadow-lg transition">
                        <p className="font-semibold text-gray-800">{q.title}</p>
                        <p className="text-gray-500 text-sm mt-1">{q.category || 'General'}</p>
                        <p className="text-gray-400 text-xs mt-1">{q.difficulty || 'Mixed'} | {q.questionCount} Questions</p>
                        <button
                            onClick={() => {
                                setSelectedQuiz(q._id);
                                handlePreview(q._id);
                            }}
                            className="mt-3 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
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
