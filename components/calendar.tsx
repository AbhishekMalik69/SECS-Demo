"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Calendar() {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  const today = new Date()
  const currentDate = today.getDate()
  const midExamStart = 14
  const midExamEnd = 20

  const [displayDate, setDisplayDate] = useState(new Date())

  const currentMonth = displayDate.toLocaleString("default", { month: "long" })
  const currentYear = displayDate.getFullYear()
  const daysInMonth = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0).getDate()

  const [hoveredDate, setHoveredDate] = useState(null)

  const changeMonth = (step) => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + step, 1))
  }

  return (
    <div className="w-80 p-6 rounded-2xl bg-black text-white">
      <div className="flex items-center justify-between mb-6">
        <ChevronLeft className="w-5 h-5 cursor-pointer" onClick={() => changeMonth(-1)} />
        <div className="font-medium">{`${currentMonth} ${currentYear}`}</div>
        <ChevronRight className="w-5 h-5 cursor-pointer" onClick={() => changeMonth(1)} />
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs mb-4">
        {days.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((date) => (
          <div
            key={date}
            className={`w-8 h-8 flex items-center justify-center rounded-full relative cursor-pointer ${
              date === currentDate &&
              displayDate.getMonth() === today.getMonth() &&
              displayDate.getFullYear() === today.getFullYear()
                ? "bg-white text-black"
                : date >= midExamStart &&
                    date <= midExamEnd &&
                    displayDate.getMonth() === 1 &&
                    displayDate.getFullYear() === 2025
                  ? "bg-yellow-500 text-black"
                  : ""
            }`}
            onMouseEnter={() => setHoveredDate(date)}
            onMouseLeave={() => setHoveredDate(null)}
          >
            {date}
            {hoveredDate === date &&
              ((date === currentDate &&
                displayDate.getMonth() === today.getMonth() &&
                displayDate.getFullYear() === today.getFullYear()) ||
                (date >= midExamStart &&
                  date <= midExamEnd &&
                  displayDate.getMonth() === 1 &&
                  displayDate.getFullYear() === 2025)) && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md">
                  {date === currentDate ? "Today" : "Mid Exam"}
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  )
}
