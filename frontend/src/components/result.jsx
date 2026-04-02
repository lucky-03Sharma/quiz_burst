import React, { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { questions } from '../data/questions'

const Result = ({ score, total, restartQuiz }) => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const resolved = useMemo(() => {
    const resolvedScore =
      typeof score === 'number' ? score : Number(searchParams.get('score') ?? 0)
    const resolvedTotal =
      typeof total === 'number' ? total : Number(searchParams.get('total') ?? questions.length)
    const percent = resolvedTotal ? Math.round((resolvedScore / resolvedTotal) * 100) : 0
    return { resolvedScore, resolvedTotal, percent }
  }, [score, total, searchParams])

  const handleRestart = () => {
    if (typeof restartQuiz === 'function') return restartQuiz()
    navigate('/quiz/practice')
  }

  return (
    <div className="w-full max-w-2xl glass-card p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex items-center rounded-full border border-cyan-200/30 bg-white/5 px-3 py-1 text-xs font-semibold text-cyan-100">
          Quiz Burst
        </span>
        <span className="text-xs text-cyan-100/70">Result</span>
      </div>

      <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-white">Quiz Finished!</h2>
      <p className="mt-3 text-slate-200/90 text-lg">
        You scored <span className="text-white font-bold">{resolved.resolvedScore}</span> out of{' '}
        <span className="text-white font-bold">{resolved.resolvedTotal}</span>
      </p>

      <div className="mt-5 rounded-2xl border border-white/15 bg-white/5 p-4">
        <div className="text-sm text-slate-200/80">Performance</div>
        <div className="mt-1 text-2xl font-extrabold text-cyan-100">{resolved.percent}%</div>
      </div>

      <div className="mt-7 flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleRestart}
          className="btn-gradient py-3 px-5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
        >
          Restart Quiz
        </button>
        <button
          onClick={() => navigate('/')}
          className="btn-soft py-3 px-5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}

export default Result
