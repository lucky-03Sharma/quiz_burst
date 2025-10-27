import React from 'react';

const Result = ({ score, total, restartQuiz }) => {
  return (
    <div>
      <h2>Quiz Finished!</h2>
      <p>
        You scored {score} out of {total}
      </p>
      <button onClick={restartQuiz}>Restart Quiz</button>
    </div>
  );
};

export default Result;
