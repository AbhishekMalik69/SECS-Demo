export function ExamSchedule() {
  const today = new Date()
  const currentTime = today.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const currentDate = today.toLocaleDateString("en-GB") // Format: DD/MM/YYYY

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Exam Schedule</h2>
        <div className="text-sm font-medium px-4 py-2 rounded-full border-2 border-black/20">{`${currentTime} | ${currentDate}`}</div>
      </div>
      <p className="text-gray-600">The exam date scheduled.</p>
      <div>
        <div className="px-6 py-4 rounded-full border-2 border-black/20">MID EXAM - 14/02/2025 | 20/02/2025</div>
      </div>
    </div>
  )
}
