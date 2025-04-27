"use client"

import { X, Search } from "lucide-react"
import { useState } from "react"

interface Student {
  regNo: string
  name: string
  program: string
  semester: string
  section: string
  percentage: string
  status: string
}

interface StudentListPopupProps {
  isOpen: boolean
  onClose: () => void
  students: Student[]
}

export function StudentListPopup({ isOpen, onClose, students }: StudentListPopupProps) {
  const [searchTerm, setSearchTerm] = useState("")

  if (!isOpen) return null

  const filteredStudents = students.filter((student) => {
    // First apply the search filter
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.regNo.toLowerCase().includes(searchTerm.toLowerCase())

    // Then ensure we only show eligible students
    const attendance = Number.parseFloat(student.percentage)
    const isEligible = attendance >= 75 || student.status === "Eligible"

    return matchesSearch && isEligible
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-5xl max-h-[90vh] overflow-hidden relative flex flex-col">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-black">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-2">Eligible Students List</h2>
        <p className="text-sm text-gray-600 mb-4">Showing students with ≥75% attendance or approved by HOD</p>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search by name or registration number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-10 py-2 rounded-full border-2 border-black/20 focus:outline-none focus:border-black"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        <div className="overflow-y-auto flex-1">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b-2 border-black/20">
                <th className="px-4 py-3 text-left">Regd #</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-center">Program</th>
                <th className="px-4 py-3 text-center">Semester</th>
                <th className="px-4 py-3 text-center">Section</th>
                <th className="px-4 py-3 text-center">Attendance %</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.regNo} className="border-b border-black/10 last:border-b-0">
                    <td className="px-4 py-3">{student.regNo}</td>
                    <td className="px-4 py-3">{student.name}</td>
                    <td className="px-4 py-3 text-center">{student.program}</td>
                    <td className="px-4 py-3 text-center">{student.semester}</td>
                    <td className="px-4 py-3 text-center">{student.section}</td>
                    <td className="px-4 py-3 text-center">{student.percentage}</td>
                    <td
                      className={`px-4 py-3 text-center ${
                        student.status === "Eligible" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {student.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No students found matching your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-black text-white rounded-full hover:bg-black/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
