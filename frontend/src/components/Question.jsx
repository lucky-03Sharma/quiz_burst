import React from 'react';

const Question = ({ questionObj, handleAnswer }) => {
  return (
    <div>
      <h2>{questionObj.question}</h2>
      <ul>
        {questionObj.options.map((opt, idx) => (
          <li key={idx}>
            <button onClick={() => handleAnswer(opt)}>{opt}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Question;
