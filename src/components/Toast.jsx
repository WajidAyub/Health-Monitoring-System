import { CheckCircle, X, AlertCircle, Info } from 'lucide-react'
import { useEffect } from 'react'

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: CheckCircle,
    error: X,
    warning: AlertCircle,
    info: Info
  }

  const colors = {
    success: 'var(--success)',
    error: 'var(--danger)',
    warning: 'var(--warning)',
    info: 'var(--accent)'
  }

  const Icon = icons[type] || CheckCircle

  return (
    <div style={{ background: colors[type] }} className={`fixed top-20 right-4 z-50 animate-slide-in text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 min-w-[300px]`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="flex-1 font-medium">{message}</p>
      <button
        onClick={onClose}
        className="hover:bg-black/20 rounded p-1 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Toast

