import React, { useState } from 'react'
import Question from './Question'
import Result from './result'
import { questions } from '../data/questions'

const Quiz = () => {
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const handleAnswer = (selected) => {
    if (selected === questions[current].answer) setScore(score + 1)
    if (current + 1 < questions.length) {
      setCurrent(current + 1)
    } else {
      setFinished(true)
    }
  }

  const restartQuiz = () => {
    setCurrent(0)
    setScore(0)
    setFinished(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full flex flex-col items-center">
        {!finished && (
          <div className="w-full max-w-3xl mb-4 flex items-center justify-between gap-3">
            <span className="text-xs sm:text-sm font-semibold text-cyan-100/80">
              Question {current + 1} of {questions.length}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-cyan-100/80">
              Score: <span className="text-white">{score}</span>
            </span>
          </div>
        )}

        {finished ? (
          <Result score={score} total={questions.length} restartQuiz={restartQuiz} />
        ) : (
          <Question questionObj={questions[current]} handleAnswer={handleAnswer} />
        )}
      </div>
    </div>
  )
}

export default Quiz