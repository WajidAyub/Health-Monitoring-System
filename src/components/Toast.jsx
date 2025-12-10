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
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }

  const Icon = icons[type] || CheckCircle

  return (
    <div className={`fixed top-20 right-4 z-50 animate-slide-in ${colors[type]} text-white px-6 py-4 rounded-lg shadow-xl dark:shadow-2xl flex items-center gap-3 min-w-[300px]`}>
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

