"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Plus, Trash2, CheckCircle, Clock } from "lucide-react"
import { Notification } from "@/components/notification"
import { useAuth } from "@/contexts/auth-context"
import { NavigationConfirm } from "@/components/navigation-confirm"
import { facultyData } from "@/data/faculty-data"

// Room data
const roomData = ["PB701", "PB702", "PB703", "PB704", "PB705", "PB706", "PB707"]

// Interface for invigilation assignment
interface InvigilationAssignment {
  id: string
  facultyId: string
  facultyName: string
  date: string
  shift: "First Shift" | "Second Shift"
  room: string
}

export default function InvigilationPage() {
  const { user } = useAuth()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Program, Semester, Section selection
  const [selectedProgram, setSelectedProgram] = useState("BCA")
  const [selectedSemester, setSelectedSemester] = useState("VI")
  const [selectedSection, setSelectedSection] = useState("A")
  const [showProgramDropdown, setShowProgramDropdown] = useState(false)
  const [showSemesterDropdown, setShowSemesterDropdown] = useState(false)
  const [showSectionDropdown, setShowSectionDropdown] = useState(false)

  // Slot times
  const [firstSlotTime, setFirstSlotTime] = useState("09:00")
  const [secondSlotTime, setSecondSlotTime] = useState("14:00")

  // Assignments
  const [assignments, setAssignments] = useState<InvigilationAssignment[]>([
    {
      id: "1",
      facultyId: "100109",
      facultyName: "Abhishek Malik",
      date: "22/04/2025",
      shift: "First Shift",
      room: "PB703",
    },
    {
      id: "2",
      facultyId: "100102",
      facultyName: "Punit Kumar",
      date: "22/04/2025",
      shift: "Second Shift",
      room: "PB703",
    },
    {
      id: "3",
      facultyId: "100107",
      facultyName: "Sultan Fahad",
      date: "23/04/2025",
      shift: "First Shift",
      room: "PB702",
    },
  ])

  // New assignment form
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAssignment, setNewAssignment] = useState<{
    facultyId: string
    date: string
    shift: "First Shift" | "Second Shift"
    room: string
  }>({
    facultyId: "",
    date: "",
    shift: "First Shift",
    room: "",
  })

  // Dropdowns for new assignment
  const [showFacultyDropdown, setShowFacultyDropdown] = useState(false)
  const [showShiftDropdown, setShowShiftDropdown] = useState(false)
  const [showRoomDropdown, setShowRoomDropdown] = useState(false)

  // Notification and navigation
  const [notification, setNotification] = useState<{
    message: string
    type: "success" | "warning"
  } | null>(null)
  const [showNavigationConfirm, setShowNavigationConfirm] = useState(false)

  // Programs, semesters, sections options
  const programs = ["BCA", "MCA", "B.Sc.", "M.Sc."]
  const semesters = ["I", "II", "III", "IV", "V", "VI"]
  const sections = ["A", "B"]

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowFacultyDropdown(false)
        setShowShiftDropdown(false)
        setShowRoomDropdown(false)
        setShowProgramDropdown(false)
        setShowSemesterDropdown(false)
        setShowSectionDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Add new assignment
  const handleAddAssignment = () => {
    if (!newAssignment.facultyId || !newAssignment.date || !newAssignment.room) {
      setNotification({
        message: "Please fill all the fields",
        type: "warning",
      })
      return
    }

    const faculty = facultyData.find((f) => f.id === newAssignment.facultyId)
    if (!faculty) return

    const newId = (Number.parseInt(assignments[assignments.length - 1]?.id || "0") + 1).toString()

    setAssignments([
      ...assignments,
      {
        id: newId,
        facultyId: newAssignment.facultyId,
        facultyName: faculty.name,
        date: newAssignment.date,
        shift: newAssignment.shift,
        room: newAssignment.room,
      },
    ])

    setNewAssignment({
      facultyId: "",
      date: "",
      shift: "First Shift",
      room: "",
    })

    setShowAddForm(false)

    setNotification({
      message: "Assignment added successfully",
      type: "success",
    })
  }

  // Delete assignment
  const handleDeleteAssignment = (id: string) => {
    setAssignments(assignments.filter((a) => a.id !== id))

    setNotification({
      message: "Assignment deleted successfully",
      type: "success",
    })
  }

  // Submit assignments
  const handleSubmit = () => {
    setNotification({
      message: "Invigilation assignments submitted successfully",
      type: "success",
    })

    setShowNavigationConfirm(true)
  }

  // Format date for input field
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return ""

    const parts = dateString.split("/")
    if (parts.length !== 3) return dateString

    return `${parts[2]}-${parts[1]}-${parts[0]}`
  }

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return ""

    const date = new Date(dateString)
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
  }

  return (
    <div className="max-w-7xl mx-auto" ref={dropdownRef}>
      {notification && (
        <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
      )}

      <div className="border-2 rounded-3xl p-8">
        <h1 className="text-3xl font-bold mb-4 border-b-2 pb-4">Invigilation</h1>

        <p className="mb-8">
          Invigilators are assigned in respective of their free schedule and organize balanced workflow.
        </p>

        {/* Program, Semester, Section Selection */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Program Dropdown */}
          <div className="flex-1">
            <div className="relative">
              <button
                onClick={() => {
                  setShowProgramDropdown(!showProgramDropdown)
                  setShowSemesterDropdown(false)
                  setShowSectionDropdown(false)
                }}
                className="w-full flex items-center justify-between px-6 py-3 bg-black text-white rounded-full"
              >
                <span>Program</span>
                <ChevronDown className="w-5 h-5" />
              </button>
              <div className="mt-2 w-full p-2 bg-white border-2 border-black/20 rounded-full">
                <div className="px-4 py-2 text-center">{selectedProgram}</div>
              </div>
              {showProgramDropdown && (
                <div className="absolute w-full mt-2 p-2 bg-white border-2 border-black/20 rounded-2xl z-50 shadow-lg">
                  {programs.map((program) => (
                    <div
                      key={program}
                      onClick={() => {
                        setSelectedProgram(program)
                        setShowProgramDropdown(false)
                      }}
                      className="px-4 py-2 text-center hover:bg-gray-100 cursor-pointer"
                    >
                      {program}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Semester Dropdown */}
          <div className="flex-1">
            <div className="relative">
              <button
                onClick={() => {
                  setShowSemesterDropdown(!showSemesterDropdown)
                  setShowProgramDropdown(false)
                  setShowSectionDropdown(false)
                }}
                className="w-full flex items-center justify-between px-6 py-3 bg-black text-white rounded-full"
              >
                <span>Semester</span>
                <ChevronDown className="w-5 h-5" />
              </button>
              <div className="mt-2 w-full p-2 bg-white border-2 border-black/20 rounded-full">
                <div className="px-4 py-2 text-center">{selectedSemester}</div>
              </div>
              {showSemesterDropdown && (
                <div className="absolute w-full mt-2 p-2 bg-white border-2 border-black/20 rounded-2xl z-50 shadow-lg">
                  {semesters.map((semester) => (
                    <div
                      key={semester}
                      onClick={() => {
                        setSelectedSemester(semester)
                        setShowSemesterDropdown(false)
                      }}
                      className="px-4 py-2 text-center hover:bg-gray-100 cursor-pointer"
                    >
                      {semester}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section Dropdown */}
          <div className="flex-1">
            <div className="relative">
              <button
                onClick={() => {
                  setShowSectionDropdown(!showSectionDropdown)
                  setShowProgramDropdown(false)
                  setShowSemesterDropdown(false)
                }}
                className="w-full flex items-center justify-between px-6 py-3 bg-black text-white rounded-full"
              >
                <span>Section</span>
                <ChevronDown className="w-5 h-5" />
              </button>
              <div className="mt-2 w-full p-2 bg-white border-2 border-black/20 rounded-full">
                <div className="px-4 py-2 text-center">{selectedSection}</div>
              </div>
              {showSectionDropdown && (
                <div className="absolute w-full mt-2 p-2 bg-white border-2 border-black/20 rounded-2xl z-50 shadow-lg">
                  {sections.map((section) => (
                    <div
                      key={section}
                      onClick={() => {
                        setSelectedSection(section)
                        setShowSectionDropdown(false)
                      }}
                      className="px-4 py-2 text-center hover:bg-gray-100 cursor-pointer"
                    >
                      {section}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timings Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b-2 pb-2">Timings</h2>

          <div className="flex flex-col md:flex-row gap-6 mb-4">
            {/* First Slot - Time Input */}
            <div className="flex-1">
              <div className="relative">
                <div className="w-full flex items-center justify-between px-6 py-3 bg-black text-white rounded-full mb-2">
                  <span>First Slot</span>
                  <Clock className="w-5 h-5" />
                </div>
                <div className="mt-2 w-full p-2 bg-white border-2 border-black/20 rounded-full">
                  <div className="flex items-center justify-center">
                    <input
                      type="time"
                      value={firstSlotTime}
                      onChange={(e) => setFirstSlotTime(e.target.value)}
                      className="px-4 py-2 text-center bg-transparent focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Second Slot - Time Input */}
            <div className="flex-1">
              <div className="relative">
                <div className="w-full flex items-center justify-between px-6 py-3 bg-black text-white rounded-full mb-2">
                  <span>Second Slot</span>
                  <Clock className="w-5 h-5" />
                </div>
                <div className="mt-2 w-full p-2 bg-white border-2 border-black/20 rounded-full">
                  <div className="flex items-center justify-center">
                    <input
                      type="time"
                      value={secondSlotTime}
                      onChange={(e) => setSecondSlotTime(e.target.value)}
                      className="px-4 py-2 text-center bg-transparent focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workload Ranking */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b-2 pb-2">Invigilation Workload</h2>

          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {facultyData.map((faculty) => {
                // Calculate workload based on number of assignments
                const assignmentCount = assignments.filter((a) => a.facultyId === faculty.id).length
                const workloadPercentage = Math.min(100, assignmentCount * 33.33)

                return (
                  <div key={faculty.id} className="border-2 border-black/20 rounded-xl p-4 w-64">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{faculty.name}</span>
                      <span className="text-sm">{assignmentCount} duties</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          workloadPercentage > 66
                            ? "bg-red-500"
                            : workloadPercentage > 33
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${workloadPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Add New Assignment Button */}
        <div className="flex justify-start mb-4">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-black/90 transition-colors"
            disabled={showAddForm}
          >
            <Plus className="w-5 h-5" />
            Add Faculty
          </button>
        </div>

        {/* Add New Assignment Form */}
        {showAddForm && (
          <div className="border-2 border-black/20 rounded-2xl p-4 mb-8 bg-gray-50">
            <h3 className="font-medium mb-4 pb-2 border-b border-black/10">Add New Faculty Assignment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Faculty Selection */}
              <div>
                <label className="block text-sm font-medium mb-1">Faculty</label>
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowFacultyDropdown(!showFacultyDropdown)
                      setShowShiftDropdown(false)
                      setShowRoomDropdown(false)
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 bg-white border-2 border-black/20 rounded-md text-sm"
                  >
                    <span className="truncate">{newAssignment.facultyId || "Select Faculty"}</span>
                    <ChevronDown className="w-4 h-4 flex-shrink-0" />
                  </button>
                  {showFacultyDropdown && (
                    <div className="absolute left-0 w-full mt-1 p-2 bg-white border-2 border-black/20 rounded-md z-50 max-h-60 overflow-y-auto shadow-lg">
                      {facultyData.map((faculty) => (
                        <div
                          key={faculty.id}
                          onClick={() => {
                            setNewAssignment({ ...newAssignment, facultyId: faculty.id })
                            setShowFacultyDropdown(false)
                          }}
                          className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        >
                          {faculty.id} - {faculty.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Faculty Name (Display only) */}
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <div className="px-3 py-2 bg-gray-100 border-2 border-black/20 rounded-md text-sm">
                  {newAssignment.facultyId
                    ? facultyData.find((f) => f.id === newAssignment.facultyId)?.name || "Faculty Name"
                    : "Faculty Name"}
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={formatDateForInput(newAssignment.date)}
                  onChange={(e) => setNewAssignment({ ...newAssignment, date: formatDateForDisplay(e.target.value) })}
                  className="w-full px-3 py-2 border-2 border-black/20 rounded-md text-sm"
                />
              </div>

              {/* Shift Selection */}
              <div>
                <label className="block text-sm font-medium mb-1">Shift</label>
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowShiftDropdown(!showShiftDropdown)
                      setShowFacultyDropdown(false)
                      setShowRoomDropdown(false)
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 bg-white border-2 border-black/20 rounded-md text-sm"
                  >
                    <span>{newAssignment.shift}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {showShiftDropdown && (
                    <div className="absolute left-0 w-full mt-1 p-2 bg-white border-2 border-black/20 rounded-md z-50 shadow-lg">
                      <div
                        onClick={() => {
                          setNewAssignment({ ...newAssignment, shift: "First Shift" })
                          setShowShiftDropdown(false)
                        }}
                        className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      >
                        First Shift
                      </div>
                      <div
                        onClick={() => {
                          setNewAssignment({ ...newAssignment, shift: "Second Shift" })
                          setShowShiftDropdown(false)
                        }}
                        className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      >
                        Second Shift
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Room Selection */}
              <div>
                <label className="block text-sm font-medium mb-1">Room</label>
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowRoomDropdown(!showRoomDropdown)
                      setShowFacultyDropdown(false)
                      setShowShiftDropdown(false)
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 bg-white border-2 border-black/20 rounded-md text-sm"
                  >
                    <span>{newAssignment.room || "Select Room"}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {showRoomDropdown && (
                    <div className="absolute left-0 w-full mt-1 p-2 bg-white border-2 border-black/20 rounded-md z-50 max-h-60 overflow-y-auto shadow-lg">
                      {roomData.map((room) => (
                        <div
                          key={room}
                          onClick={() => {
                            setNewAssignment({ ...newAssignment, room })
                            setShowRoomDropdown(false)
                          }}
                          className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        >
                          {room}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleAddAssignment}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-black/90 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black border-2 border-black rounded-full hover:bg-gray-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Assignments Table */}
        <div className="border-2 border-black/20 rounded-2xl overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-black/20">
                <th className="px-6 py-4 text-left">ID No.</th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Shift</th>
                <th className="px-6 py-4 text-left">Room no.</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.id} className="border-b border-black/10 last:border-b-0">
                  <td className="px-6 py-4">{assignment.facultyId}</td>
                  <td className="px-6 py-4">{assignment.facultyName}</td>
                  <td className="px-6 py-4">{assignment.date}</td>
                  <td className="px-6 py-4">{assignment.shift}</td>
                  <td className="px-6 py-4">{assignment.room}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDeleteAssignment(assignment.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => {
              setNotification({
                message: "Invigilation assignments uploaded successfully",
                type: "success",
              })
            }}
            className="px-8 py-3 bg-black text-white rounded-full hover:bg-black/90 transition-colors"
          >
            Upload
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-white text-black border-2 border-black rounded-full hover:bg-gray-50 transition-colors"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Navigation Confirmation Dialog */}
      <NavigationConfirm
        isOpen={showNavigationConfirm}
        onClose={() => setShowNavigationConfirm(false)}
        destination="/dashboard"
        message="You are about to proceed to the Dashboard. Your invigilation assignments have been submitted successfully."
      />
    </div>
  )
}
