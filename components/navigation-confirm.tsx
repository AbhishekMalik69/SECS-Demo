"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

interface NavigationConfirmProps {
  isOpen: boolean
  onClose: () => void
  destination: string
  message: string
}

export function NavigationConfirm({ isOpen, onClose, destination, message }: NavigationConfirmProps) {
  const [timeLeft, setTimeLeft] = useState(5)
  const router = useRouter()
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const navigatingRef = useRef(false)

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(5)
      navigatingRef.current = false
      return
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current)
          }

          if (!navigatingRef.current) {
            navigatingRef.current = true
            // Use setTimeout to avoid state updates during render
            setTimeout(() => {
              router.push(destination)
              // Call onClose after a small delay to avoid state updates during rendering
              setTimeout(() => onClose(), 100)
            }, 0)
          }

          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isOpen, destination, router, onClose])

  if (!isOpen) return null

  const handleConfirm = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    navigatingRef.current = true

    // Use setTimeout to avoid state updates during render
    setTimeout(() => {
      router.push(destination)
      // Call onClose after a small delay to avoid state updates during rendering
      setTimeout(() => onClose(), 100)
    }, 0)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md relative">
        <button
          onClick={() => {
            if (timerRef.current) {
              clearInterval(timerRef.current)
            }
            onClose()
          }}
          className="absolute right-4 top-4 text-gray-500 hover:text-black"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-4">Navigation Confirmation</h2>

        <p className="mb-6">{message}</p>

        <div className="mb-6 w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-black h-2.5 rounded-full transition-all duration-1000"
            style={{ width: `${(timeLeft / 5) * 100}%` }}
          ></div>
        </div>

        <p className="text-center mb-6">
          Proceeding in <span className="font-bold">{timeLeft}</span> seconds...
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              if (timerRef.current) {
                clearInterval(timerRef.current)
              }
              onClose()
            }}
            className="px-6 py-2 bg-white text-black border-2 border-black rounded-full hover:bg-gray-50 transition-colors"
          >
            No, Stay Here
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-black text-white rounded-full hover:bg-black/90 transition-colors"
          >
            Yes, Proceed
          </button>
        </div>
      </div>
    </div>
  )
}
