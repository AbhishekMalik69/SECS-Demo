"use client"

import { X } from "lucide-react"

interface CompletionPopupProps {
  isOpen: boolean
  onClose: () => void
  message: string
}

export function CompletionPopup({ isOpen, onClose, message }: CompletionPopupProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-black">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-4">Task Completed</h2>

        <p className="mb-6">{message}</p>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-black text-white rounded-full hover:bg-black/90 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}
