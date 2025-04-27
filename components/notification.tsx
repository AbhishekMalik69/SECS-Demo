"use client"

import { CheckCircle, AlertCircle, X } from "lucide-react"
import { useEffect } from "react"

interface NotificationProps {
  message: string
  type: "success" | "warning"
  onClose: () => void
}

export function Notification({ message, type, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border ${
          type === "success"
            ? "bg-green-50 text-green-800 border-green-200"
            : "bg-yellow-50 text-yellow-800 border-yellow-200"
        }`}
      >
        {type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-black/5">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
