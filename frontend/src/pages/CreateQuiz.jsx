import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE } from '../config/api'
import SelectDropdown from '../components/SelectDropdown'

const emptyQuestion = () => ({
  question: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
})

const CATEGORY_OPTIONS = [
  { value: '', label: 'General (no category)' },
  { value: 'science', label: 'Science' },
  { value: 'sports', label: 'Sports' },
  { value: 'tech', label: 'Technology' },
  { value: 'history', label: 'History' },
]

const DIFFICULTY_OPTIONS = [
  { value: '', label: 'Any difficulty' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
]

export default function CreateQuiz() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [questions, setQuestions] = useState([emptyQuestion()])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const updateQuestion = (idx, patch) => {
    setQuestions((prev) => prev.map((q, i) => (i === idx ? { ...q, ...patch } : q)))
  }

  const updateOption = (qIdx, optIdx, val) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q
        const options = [...q.options]
        options[optIdx] = val
        return { ...q, options }
      }),
    )
  }

  const addQuestion = () => setQuestions((prev) => [...prev, emptyQuestion()])
  const removeQuestion = (idx) => {
    if (questions.length <= 1) return
    setQuestions((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!title.trim()) return setError('Give your quiz a title.')
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      const opts = q.options.map((o) => o.trim()).filter(Boolean)
      if (!q.question.trim()) return setError(`Question ${i + 1}: enter the question text.`)
      if (opts.length < 2) return setError(`Question ${i + 1}: add at least two answer choices.`)
      if (q.correctAnswer < 0 || q.correctAnswer >= opts.length) {
        return setError(`Question ${i + 1}: mark the correct answer with the dot.`)
      }
    }

    setSaving(true)
    try {
      const body = {
        title: title.trim(),
        category: category || undefined,
        difficulty: difficulty || undefined,
        questions: questions.map((q) => {
          const opts = q.options.map((o) => o.trim()).filter(Boolean)
          return {
            question: q.question.trim(),
            options: opts,
            correctAnswer: q.correctAnswer,
          }
        }),
      }
      const res = await axios.post(`${API_BASE}/create`, body)
      const newId = res.data?.quiz?._id
      navigate('/host-game', { state: { createdQuizId: newId }, replace: true })
    } catch {
      setError('Could not save quiz. Is the backend running on port 5000?')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-10 flex flex-col items-center">
      <div className="w-full max-w-2xl glass-card border border-white/20 rounded-3xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Create a quiz</h1>
            <p className="text-slate-200/85 mt-1 text-sm md:text-base">
              Build your quiz here first, then host a game and pick it from the list.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/host-game')}
            className="btn-soft px-4 py-2 rounded-xl text-sm shrink-0"
          >
            Back to host
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Quiz title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-white/20 bg-white/5 text-slate-100 rounded-xl p-3 focus:ring-2 focus:ring-cyan-400 focus:outline-none placeholder:text-slate-500"
              placeholder="e.g. Friday Trivia"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Category</label>
              <SelectDropdown value={category} onChange={setCategory} options={CATEGORY_OPTIONS} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Difficulty</label>
              <SelectDropdown value={difficulty} onChange={setDifficulty} options={DIFFICULTY_OPTIONS} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-white">Questions</h2>
              <button type="button" onClick={addQuestion} className="text-cyan-200 text-sm hover:text-white">
                + Add question
              </button>
            </div>

            {questions.map((q, qi) => (
              <div
                key={qi}
                className="rounded-2xl border border-white/15 bg-white/5 p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-cyan-200/90">Question {qi + 1}</span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qi)}
                      className="text-xs text-rose-300 hover:text-rose-200"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  value={q.question}
                  onChange={(e) => updateQuestion(qi, { question: e.target.value })}
                  className="w-full border border-white/20 bg-slate-900/50 text-slate-100 rounded-xl p-3 focus:ring-2 focus:ring-cyan-400 focus:outline-none placeholder:text-slate-500"
                  placeholder="Type your question"
                />
                <div className="grid gap-2">
                  {q.options.map((opt, oi) => (
                    <label
                      key={oi}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/40 px-3 py-2 hover:border-cyan-400/30 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`correct-${qi}`}
                        checked={q.correctAnswer === oi}
                        onChange={() => updateQuestion(qi, { correctAnswer: oi })}
                        className="text-cyan-500 focus:ring-cyan-400"
                      />
                      <input
                        value={opt}
                        onChange={(e) => updateOption(qi, oi, e.target.value)}
                        className="flex-1 bg-transparent text-slate-100 focus:outline-none placeholder:text-slate-500 py-1"
                        placeholder={`Answer ${oi + 1}`}
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="rounded-xl border border-rose-400/40 bg-rose-950/40 text-rose-100 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-gradient flex-1 py-3 rounded-xl font-semibold disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save quiz & continue to host'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
