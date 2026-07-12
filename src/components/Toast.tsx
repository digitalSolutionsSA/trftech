import { useEffect, useState } from 'react'
import type { ToastData } from '../types'

let _setToasts: React.Dispatch<React.SetStateAction<ToastData[]>> | null = null

export function showToast(icon: string, title: string, message: string) {
  if (!_setToasts) return
  const id = Math.random().toString(36).slice(2)
  _setToasts((prev) => [...prev, { id, icon, title, message }])
  setTimeout(() => {
    _setToasts?.((prev) => prev.filter((t) => t.id !== id))
  }, 3500)
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  useEffect(() => {
    _setToasts = setToasts
    return () => { _setToasts = null }
  }, [])

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          <div className="toast-icon">{t.icon}</div>
          <div>
            <div className="toast-title">{t.title}</div>
            <div className="toast-msg">{t.message}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
