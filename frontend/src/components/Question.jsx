import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { questions } from '../data/questions'

const Question = ({ questionObj, handleAnswer }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  const resolvedQuestion = useMemo(() => {
    if (questionObj) return questionObj
    if (!id) return null
    return questions.find((q) => String(q.id) === String(id)) ?? null
  }, [questionObj, id])

  useEffect(() => {
    setSelected(null)
  }, [resolvedQuestion?.id])

  const submitAnswer = (opt) => {
    if (selected) return

    setSelected(opt)

    // Quiz.jsx controls the flow; Route-based usage doesn't have callbacks.
    if (typeof handleAnswer === 'function') {
      handleAnswer(opt)
      return
    }

    const isCorrect = opt === resolvedQuestion?.answer
    const nextScore = isCorrect ? 1 : 0
    navigate(`/game-live/result?score=${nextScore}&total=${questions.length}`)
  }

  if (!resolvedQuestion) {
    return (
      <div className="w-full max-w-3xl glass-card p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">Question not found</h2>
        <p className="text-slate-200/80 mt-2">Try starting a quiz again.</p>
        <button onClick={() => navigate('/quiz/practice')} className="btn-gradient mt-6 py-3 px-4 rounded-lg">
          Go to practice quiz
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl glass-card p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex items-center rounded-full border border-cyan-200/30 bg-white/5 px-3 py-1 text-xs font-semibold text-cyan-100">
          Quiz Burst
        </span>
        <span className="text-xs text-cyan-100/70">Q{resolvedQuestion.id}</span>
      </div>

      <h2 className="mt-4 text-2xl md:text-3xl font-extrabold text-white leading-snug">
        {resolvedQuestion.question}
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-3">
        {resolvedQuestion.options.map((opt, idx) => {
          const isPicked = selected === opt
          const canPick = !selected

          return (
            <button
              key={idx}
              type="button"
              onClick={() => submitAnswer(opt)}
              disabled={!canPick}
              className={[
                'text-left p-4 rounded-xl border transition-all duration-200',
                isPicked
                  ? 'bg-cyan-500/25 border-cyan-300 shadow-lg'
                  : 'bg-white/5 border-cyan-200/30 hover:bg-cyan-500/15',
                !canPick ? 'cursor-not-allowed opacity-95' : 'cursor-pointer',
              ].join(' ')}
            >
              <span className="text-white font-semibold">{opt}</span>
            </button>
          )
        })}
      </div>

      {selected && (
        <p className="mt-4 text-center text-cyan-100/90 text-sm">
          Answer submitted! Moving on…
        </p>
      )}
    </div>
  )
}

export default Question
