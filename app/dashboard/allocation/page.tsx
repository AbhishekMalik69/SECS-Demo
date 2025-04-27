"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Users, Download, Edit, Check, X } from "lucide-react"
import { Notification } from "@/components/notification"
import { useAuth } from "@/contexts/auth-context"
import { NavigationConfirm } from "@/components/navigation-confirm"
import { StudentListPopup } from "@/components/student-list-popup"
import { getEligibleStudents } from "@/data/student-data"

// Define the options for the dropdowns
const roomOptions = ["PB701", "PB702", "PB703", "PB704", "PB705", "PB706", "PB707"]

// Create a type for the seat allocation
interface SeatAllocation {
  id: number
  rollNumbers: string[]
}

// Define the seating configurations
interface SeatingConfig {
  id: number
  rollNumbers: string[]
  isEditing?: boolean
}

export default function AllocationPage() {
  const { user } = useAuth()
  // Room selection state
  const [selectedRoom, setSelectedRoom] = useState("")
  const [showRoomDropdown, setShowRoomDropdown] = useState(false)

  // Seating option state
  const [selectedSeatingOption, setSelectedSeatingOption] = useState("")
  const [showSeatingOptionDropdown, setShowSeatingOptionDropdown] = useState(false)

  // Program sets states (for single, double, or triple seating)
  const [programSets, setProgramSets] = useState<Array<{ program: string; semester: string; section: string }>>([])

  // Dropdown visibility states for program sets
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({})

  // Content visibility state
  const [showAllocationGrid, setShowAllocationGrid] = useState(false)

  const [notification, setNotification] = useState<{
    message: string
    type: "success" | "warning"
  } | null>(null)

  // Create a 4x6 grid of seats with default values
  const [seats, setSeats] = useState<SeatingConfig[]>([])

  // State for tracking which seat is being edited
  const [editingSeatId, setEditingSeatId] = useState<number | null>(null)
  const [editingRollNumber, setEditingRollNumber] = useState<string>("")
  const [editingStudentIndex, setEditingStudentIndex] = useState<number>(0)

  // Navigation confirmation state
  const [showNavigationConfirm, setShowNavigationConfirm] = useState(false)

  // Student list popup state
  const [showStudentList, setShowStudentList] = useState(false)
  const [eligibleStudents, setEligibleStudents] = useState<any[]>([])

  // Options for dropdowns
  const seatingOptions = ["Single", "Double", "Triple"]
  const programs = ["BCA", "MCA", "B.Sc.", "M.Sc."]

  // Semesters depend on the program
  const getSemesters = (program: string) => {
    if (program === "MCA" || program === "M.Sc.") {
      return ["I", "II", "III", "IV"]
    }
    return ["I", "II", "III", "IV", "V", "VI"]
  }

  const sections = ["A", "B"]

  // Load eligible students from localStorage
  useEffect(() => {
    const storedEligibleStudents = localStorage.getItem("eligibleStudents")
    if (storedEligibleStudents) {
      try {
        setEligibleStudents(JSON.parse(storedEligibleStudents))
      } catch (error) {
        console.error("Error parsing eligible students:", error)
      }
    }

    // Set default program sets based on stored data
    const storedProgram = localStorage.getItem("selectedProgram") || "MCA"
    const storedSemester = localStorage.getItem("selectedSemester") || "VI"
    const storedSection = localStorage.getItem("selectedSection") || "B"

    const defaultSets = [{ program: storedProgram, semester: storedSemester, section: storedSection }]

    setProgramSets(defaultSets)
  }, [])

  // Generate seats based on room and seating option
  useEffect(() => {
    if (selectedRoom && selectedSeatingOption) {
      const numStudentsPerSeat = selectedSeatingOption === "Single" ? 1 : selectedSeatingOption === "Double" ? 2 : 3

      // Only update program sets if we need more than we currently have
      if (programSets.length < numStudentsPerSeat) {
        const newProgramSets = [...programSets]
        while (newProgramSets.length < numStudentsPerSeat) {
          if (newProgramSets.length === 1) {
            newProgramSets.push({ program: "MCA", semester: "IV", section: "A" })
          } else if (newProgramSets.length === 2) {
            newProgramSets.push({ program: "BCA", semester: "III", section: "B" })
          }
        }
        setProgramSets(newProgramSets)
      } else if (programSets.length > numStudentsPerSeat) {
        // If we have more program sets than needed, trim the array
        setProgramSets(programSets.slice(0, numStudentsPerSeat))
      } else {
        // If the number of program sets is correct, generate seats
        generateSeats(numStudentsPerSeat)
      }
    }
  }, [selectedRoom, selectedSeatingOption, programSets])

  // Generate roll numbers based on program, semester, section
  const generateRollNumbers = (program: string, semester: string, section: string, count: number) => {
    // Get eligible students for this program, semester, section
    const students = getEligibleStudents(program, semester, section)

    // If we have eligible students, use their roll numbers
    if (students.length > 0) {
      return students.slice(0, count).map((student) => student.regNo)
    }

    // Otherwise, generate roll numbers based on section
    const rollNumbers = []
    const programPrefix = program === "MCA" ? "MCA" : program === "BCA" ? "BCA" : program === "B.Sc." ? "BSC" : "MSC"

    const yearPrefix = program === "MCA" || program === "M.Sc." ? "22" : "20"

    // Determine starting roll number based on section
    const startRollNo = section === "A" ? 1 : 70

    for (let i = 0; i < count; i++) {
      const rollNo = startRollNo + i
      const regNo = `VU${yearPrefix}${programPrefix}${String(rollNo).padStart(3, "0")}`
      rollNumbers.push(regNo)
    }

    return rollNumbers
  }

  // Generate seats
  const generateSeats = (numStudentsPerSeat: number) => {
    // Generate roll numbers for each program set
    const rollNumberSets = programSets.map(
      (set) => generateRollNumbers(set.program, set.semester, set.section, 24), // 24 = 4 columns * 6 rows
    )

    // Generate seat configurations (4 columns x 6 rows = 24 seats)
    const newSeats: SeatingConfig[] = Array.from({ length: 24 }, (_, i) => {
      const seatRollNumbers = []

      for (let j = 0; j < numStudentsPerSeat; j++) {
        const setIndex = j % rollNumberSets.length
        if (rollNumberSets[setIndex] && rollNumberSets[setIndex][i]) {
          seatRollNumbers.push(rollNumberSets[setIndex][i])
        }
      }

      return { id: i + 1, rollNumbers: seatRollNumbers }
    })

    setSeats(newSeats)
    setShowAllocationGrid(true)
  }

  // Update seats when programSets changes
  useEffect(() => {
    if (selectedRoom && selectedSeatingOption && programSets.length > 0) {
      const numStudentsPerSeat = selectedSeatingOption === "Single" ? 1 : selectedSeatingOption === "Double" ? 2 : 3
      if (programSets.length === numStudentsPerSeat) {
        generateSeats(numStudentsPerSeat)
      }
    }
  }, [programSets, selectedRoom, selectedSeatingOption])

  // Start editing a roll number
  const startEditing = (seatId: number, studentIndex: number, rollNumber: string) => {
    setEditingSeatId(seatId)
    setEditingStudentIndex(studentIndex)
    setEditingRollNumber(rollNumber)
  }

  // Save edited roll number
  const saveRollNumber = () => {
    if (editingSeatId !== null) {
      setSeats(
        seats.map((seat) => {
          if (seat.id === editingSeatId) {
            const newRollNumbers = [...seat.rollNumbers]
            newRollNumbers[editingStudentIndex] = editingRollNumber
            return { ...seat, rollNumbers: newRollNumbers }
          }
          return seat
        }),
      )
      setEditingSeatId(null)
    }
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingSeatId(null)
  }

  const handleSubmit = () => {
    setNotification({
      message: "Seat allocation submitted successfully",
      type: "success",
    })

    // Show navigation confirmation
    setShowNavigationConfirm(true)
  }

  const handleModify = () => {
    setNotification({
      message: "Ready to modify seat allocation",
      type: "success",
    })
  }

  // Toggle dropdown visibility
  const toggleDropdown = (key: string) => {
    setOpenDropdowns({
      ...openDropdowns,
      [key]: !openDropdowns[key],
    })
  }

  // Update program set value
  const updateProgramSet = (index: number, field: "program" | "semester" | "section", value: string) => {
    const newProgramSets = [...programSets]
    newProgramSets[index] = {
      ...newProgramSets[index],
      [field]: value,
    }
    setProgramSets(newProgramSets)

    // Close the dropdown
    setOpenDropdowns({
      ...openDropdowns,
      [`${index}-${field}`]: false,
    })
  }

  // Get students for current selection
  const getStudentsForCurrentSelection = () => {
    if (programSets.length === 0) return []

    // Get eligible students for each program set
    return programSets.flatMap((set) => getEligibleStudents(set.program, set.semester, set.section))
  }

  // Count the number of allocated seats (non-empty)
  const countAllocatedSeats = () => {
    let count = 0
    seats.forEach((seat) => {
      count += seat.rollNumbers.filter((roll) => roll && roll !== "Empty").length
    })
    return count
  }

  // Handle download of seating layout
  const handleDownloadSeatingLayout = () => {
    setNotification({
      message: "Seating layout PDF downloaded successfully",
      type: "success",
    })
    // In a real implementation, this would generate and download a PDF
  }

  return (
    <div className="max-w-7xl mx-auto">
      {notification && (
        <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
      )}
      <div className="border-2 rounded-3xl p-8">
        <h1 className="text-3xl font-bold mb-4 border-b-2 pb-4">Seat Allocation</h1>

        <div className="mb-8">
          <p className="text-lg">
            The final eligible students seats are allocated for they respective exams. Customize the seating allocation
            by the <span className="font-semibold">{user?.role}</span>.
          </p>
        </div>

        {/* Student List Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowStudentList(true)}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-black/90 transition-colors"
          >
            <Users className="w-5 h-5" />
            View Eligible Students
          </button>
        </div>

        {/* Room Dropdown - Always visible */}
        <div className="mb-8">
          <div className="relative w-full max-w-md mx-auto">
            <button
              onClick={() => setShowRoomDropdown(!showRoomDropdown)}
              className="w-full flex items-center justify-between px-6 py-3 bg-black text-white rounded-full"
            >
              <span>Room</span>
              <ChevronDown className="w-5 h-5" />
            </button>
            <div className="mt-2 w-full p-2 bg-white border-2 border-black/20 rounded-full">
              <div className="px-4 py-2 text-center">{selectedRoom || "-"}</div>
            </div>
            {showRoomDropdown && (
              <div className="absolute w-full mt-2 p-2 bg-white border-2 border-black/20 rounded-2xl z-50">
                {roomOptions.map((room) => (
                  <div
                    key={room}
                    onClick={() => {
                      setSelectedRoom(room)
                      setShowRoomDropdown(false)
                      setSelectedSeatingOption("")
                      setShowAllocationGrid(false)
                    }}
                    className="px-4 py-2 text-center hover:bg-gray-100 cursor-pointer"
                  >
                    {room}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Seating Option Dropdown - Visible after room selection */}
        {selectedRoom && (
          <div className="mb-8">
            <div className="relative w-full max-w-md mx-auto">
              <button
                onClick={() => setShowSeatingOptionDropdown(!showSeatingOptionDropdown)}
                className="w-full flex items-center justify-between px-6 py-3 bg-black text-white rounded-full"
              >
                <span>Seating Option</span>
                <ChevronDown className="w-5 h-5" />
              </button>
              <div className="mt-2 w-full p-2 bg-white border-2 border-black/20 rounded-full">
                <div className="px-4 py-2 text-center">{selectedSeatingOption || "-"}</div>
              </div>
              {showSeatingOptionDropdown && (
                <div className="absolute w-full mt-2 p-2 bg-white border-2 border-black/20 rounded-2xl z-50">
                  {seatingOptions.map((option) => (
                    <div
                      key={option}
                      onClick={() => {
                        setSelectedSeatingOption(option)
                        setShowSeatingOptionDropdown(false)
                      }}
                      className="px-4 py-2 text-center hover:bg-gray-100 cursor-pointer"
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Program Sets Configuration - Visible after seating option selection */}
        {selectedSeatingOption && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Configure Program Sets</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {programSets.map((set, index) => (
                <div key={index} className="border-2 border-black/20 rounded-2xl p-4">
                  <h4 className="font-medium mb-2">Set {index + 1}</h4>

                  {/* Program Dropdown */}
                  <div className="mb-4">
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(`${index}-program`)}
                        className="w-full flex items-center justify-between px-4 py-2 bg-black text-white rounded-full text-sm"
                      >
                        <span>Program</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <div className="mt-1 w-full p-1 bg-white border-2 border-black/20 rounded-full">
                        <div className="px-3 py-1 text-center text-sm">{set.program}</div>
                      </div>
                      {openDropdowns[`${index}-program`] && (
                        <div className="absolute w-full mt-1 p-1 bg-white border-2 border-black/20 rounded-2xl z-50">
                          {programs.map((program) => (
                            <div
                              key={program}
                              onClick={() => updateProgramSet(index, "program", program)}
                              className="px-3 py-1 text-center text-sm hover:bg-gray-100 cursor-pointer"
                            >
                              {program}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Semester Dropdown */}
                  <div className="mb-4">
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(`${index}-semester`)}
                        className="w-full flex items-center justify-between px-4 py-2 bg-black text-white rounded-full text-sm"
                      >
                        <span>Semester</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <div className="mt-1 w-full p-1 bg-white border-2 border-black/20 rounded-full">
                        <div className="px-3 py-1 text-center text-sm">{set.semester}</div>
                      </div>
                      {openDropdowns[`${index}-semester`] && (
                        <div className="absolute w-full mt-1 p-1 bg-white border-2 border-black/20 rounded-2xl z-50">
                          {getSemesters(set.program).map((semester) => (
                            <div
                              key={semester}
                              onClick={() => updateProgramSet(index, "semester", semester)}
                              className="px-3 py-1 text-center text-sm hover:bg-gray-100 cursor-pointer"
                            >
                              {semester}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section Dropdown */}
                  <div className="mb-2">
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(`${index}-section`)}
                        className="w-full flex items-center justify-between px-4 py-2 bg-black text-white rounded-full text-sm"
                      >
                        <span>Section</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <div className="mt-1 w-full p-1 bg-white border-2 border-black/20 rounded-full">
                        <div className="px-3 py-1 text-center text-sm">{set.section}</div>
                      </div>
                      {openDropdowns[`${index}-section`] && (
                        <div className="absolute w-full mt-1 p-1 bg-white border-2 border-black/20 rounded-2xl z-50">
                          {sections.map((section) => (
                            <div
                              key={section}
                              onClick={() => updateProgramSet(index, "section", section)}
                              className="px-3 py-1 text-center text-sm hover:bg-gray-100 cursor-pointer"
                            >
                              {section}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!selectedRoom && (
          <div className="border-2 border-black/20 rounded-2xl p-8 mb-8 text-center">
            <p className="text-gray-600">Please select a Room to continue</p>
          </div>
        )}

        {selectedRoom && !selectedSeatingOption && (
          <div className="border-2 border-black/20 rounded-2xl p-8 mb-8 text-center">
            <p className="text-gray-600">Please select a Seating Option to continue</p>
          </div>
        )}

        {showAllocationGrid && (
          <>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handleDownloadSeatingLayout}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-black/90 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Seating Layout
              </button>

              <div className="border-2 rounded-full px-6 py-3">
                <span className="font-medium">Room no: {selectedRoom}</span>
              </div>
            </div>

            <div className="flex justify-end mb-8">
              <div className="border-2 rounded-full px-6 py-3 flex gap-4">
                <span className="font-medium">No. of Student seat: {countAllocatedSeats()}</span>
                <span className="font-medium">Overall Students: {getStudentsForCurrentSelection().length}</span>
              </div>
            </div>

            {/* Program ranges display */}
            <div className="border-2 rounded-2xl p-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                {programSets.map((set, index) => {
                  // Generate start and end roll numbers
                  const startRollNo = set.section === "A" ? 1 : 70
                  const endRollNo = set.section === "A" ? 69 : 139

                  // Generate program prefix
                  const programPrefix =
                    set.program === "MCA"
                      ? "MCA"
                      : set.program === "BCA"
                        ? "BCA"
                        : set.program === "B.Sc."
                          ? "BSC"
                          : "MSC"

                  // Generate year prefix
                  const yearPrefix = set.program === "MCA" || set.program === "M.Sc." ? "22" : "20"

                  return (
                    <div key={index}>
                      <div className="font-medium">
                        SEM - {set.semester} {set.program} - {set.section}
                      </div>
                      <div>
                        VU{yearPrefix}
                        {programPrefix}
                        {String(startRollNo).padStart(3, "0")}- VU{yearPrefix}
                        {programPrefix}
                        {String(endRollNo).padStart(3, "0")}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Seating grid - 4 columns x 6 rows */}
            <div className="border-2 rounded-2xl p-4 mb-8">
            <div className="grid grid-flow-col auto-rows-max grid-rows-4 gap-4">
              {seats.map((seat) => (
                <div key={seat.id} className="border-2 border-black/20 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">Seat {seat.id}</span>
                  </div>
                  {seat.rollNumbers.map((rollNumber, index) => (
                    <div key={index} className="mb-2 last:mb-0">
                      {editingSeatId === seat.id && editingStudentIndex === index ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editingRollNumber}
                            onChange={(e) => setEditingRollNumber(e.target.value)}
                            className="flex-1 p-1 border border-black/20 rounded text-xs"
                          />
                          <button
                            onClick={saveRollNumber}
                            className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-xs">{rollNumber || "Empty"}</span>
                          <button
                            onClick={() => startEditing(seat.id, index, rollNumber || "")}
                            className="p-1 text-gray-500 hover:text-black"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={handleModify}
                className="px-8 py-3 bg-black text-white rounded-full hover:bg-black/90 transition-colors"
              >
                Modify
              </button>
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-white text-black border-2 border-black rounded-full hover:bg-gray-50 transition-colors"
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>

      {/* Navigation Confirmation Dialog */}
      <NavigationConfirm
        isOpen={showNavigationConfirm}
        onClose={() => setShowNavigationConfirm(false)}
        destination="/dashboard/invigilation"
        message="You are about to proceed to the Invigilation Assignment page. Your seat allocation has been submitted successfully."
      />

      {/* Student List Popup */}
      <StudentListPopup
        isOpen={showStudentList}
        onClose={() => setShowStudentList(false)}
        students={getStudentsForCurrentSelection().length > 0 ? getStudentsForCurrentSelection() : eligibleStudents}
      />
    </div>
  )
}
