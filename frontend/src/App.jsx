import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import CreateQuizPage from './pages/CreateQuiz.jsx';
import PracticeQuiz from './components/Quiz.jsx';
import HostGame from './components/HostGame.jsx';
import Live from './components/Live.jsx'
import Leaderboard from './components/LeaderBoard.jsx';
import Question from './components/Question.jsx';
import Result from './components/result.jsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quiz/new" element={<CreateQuizPage />} />
                <Route path="/quiz/practice" element={<PracticeQuiz />} />
                <Route path="/host-game" element={<HostGame />} />
                <Route path="/host-game-live/:gamecode" element={<Live isHost={true} />} />
                <Route path="/game-live/:gamecode" element={<Live isHost={false} />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/game/question/:id" element={<Question />} />
                <Route path="/game/:gameCode/quiz" element={<PracticeQuiz />} />
                <Route path="/game-live/result" element={<Result/>} />
            </Routes>
        </Router>
    );
}

export default App;
