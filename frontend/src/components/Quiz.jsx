import React, { useState } from 'react';
import Question from './Question';
import Result from './result';
import { questions } from '../data/questions';

const Quiz = () => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (selected) => {
    if (selected === questions[current].answer) setScore(score + 1);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrent(0);
    setScore(0);
    setFinished(false);
  };

  return (
    <div>
      {finished ? (
        <Result score={score} total={questions.length} restartQuiz={restartQuiz} />
      ) : (
        <Question questionObj={questions[current]} handleAnswer={handleAnswer} />
      )}
    </div>
  );
};

export default Quiz;