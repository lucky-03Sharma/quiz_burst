import { useEffect, useRef, useState } from 'react'

export default function SelectDropdown({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  disabled = false,
  className = '',
  id,
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const selected = options.find((o) => o.value === value)
  const label = selected?.label ?? placeholder

  return (
    <div className={`relative ${className}`} ref={rootRef}>
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={[
          'w-full flex items-center justify-between gap-2 border border-white/20 rounded-xl px-3 py-3 text-left text-sm sm:text-base',
          'bg-slate-900/80 text-slate-100 shadow-inner',
          'focus:outline-none focus:ring-2 focus:ring-cyan-400',
          'hover:border-cyan-400/40 transition-colors',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        ].join(' ')}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? 'text-white' : 'text-slate-400'}>{label}</span>
        <svg
          className={`h-4 w-4 shrink-0 text-cyan-200 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full z-[100] mt-1 max-h-60 overflow-auto rounded-xl border border-white/20 bg-slate-900/98 py-1 shadow-2xl backdrop-blur-md"
        >
          {options.map((opt) => {
            const active = opt.value === value
            return (
              <li key={opt.value === '' ? '__all__' : String(opt.value)}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={[
                    'w-full px-3 py-2.5 text-left text-sm transition-colors',
                    active
                      ? 'bg-cyan-500/25 text-white font-semibold'
                      : 'text-slate-100 hover:bg-cyan-500/15',
                  ].join(' ')}
                  onClick={() => {
                    onChange(opt.value)
                    setOpen(false)
                  }}
                >
                  {opt.label}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
