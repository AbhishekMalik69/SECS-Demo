"use client"

import { ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import { Notification } from "@/components/notification"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { NavigationConfirm } from "@/components/navigation-confirm"
import { CompletionPopup } from "@/components/completion-popup"
import { getStudentsByFilter } from "@/data/student-data"

export default function EligibilityPage() {
  const { user, isAdmin } = useAuth()
  const [selectedProgram, setSelectedProgram] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const [showProgramDropdown, setShowProgramDropdown] = useState(false)
  const [showSemesterDropdown, setShowSemesterDropdown] = useState(false)
  const [showSectionDropdown, setShowSectionDropdown] = useState(false)
  const [showTable, setShowTable] = useState(false)
  const [isUploaded, setIsUploaded] = useState(false)
  const [notification, setNotification] = useState<{
    message: string
    type: "success" | "warning"
  } | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showNavigationConfirm, setShowNavigationConfirm] = useState(false)
  const [showCompletionPopup, setShowCompletionPopup] = useState(false)
  const [navigationDestination, setNavigationDestination] = useState("")
  const [studentData, setStudentData] = useState<any[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Define available programs, semesters, and sections
  const programs = ["BCA", "MCA", "B.Sc.", "M.Sc."]

  // Semesters depend on the program
  const getSemesters = (program: string) => {
    if (program === "MCA" || program === "M.Sc.") {
      return ["I", "II", "III", "IV"]
    }
    return ["I", "II", "III", "IV", "V", "VI"]
  }

  const sections = ["A", "B"]

  const router = useRouter()

  // Set student data based on selection
  useEffect(() => {
    if (selectedProgram && selectedSemester && selectedSection && showTable) {
      const filteredStudents = getStudentsByFilter(selectedProgram, selectedSemester, selectedSection)
      setStudentData(filteredStudents)
    }
  }, [selectedProgram, selectedSemester, selectedSection, showTable])

  const handleUpload = () => {
    if (!selectedProgram || !selectedSemester || !selectedSection) {
      setNotification({
        message: "Select the required fields!",
        type: "warning",
      })
      return
    }

    setIsAnalyzing(true)

    // Simulate analysis time
    setTimeout(() => {
      setIsAnalyzing(false)
      setShowTable(true)
      setIsUploaded(true)
      setNotification({
        message: "Upload successful.",
        type: "success",
      })
    }, 1500)
  }

  const handleSubmit = () => {
    if (!isUploaded) {
      setNotification({
        message: "File not uploaded!",
        type: "warning",
      })
      return
    }

    setNotification({
      message: "List Submitted.",
      type: "success",
    })
    setIsSubmitted(true)

    // Store the selected data in localStorage for other pages to use
    localStorage.setItem("selectedProgram", selectedProgram)
    localStorage.setItem("selectedSemester", selectedSemester)
    localStorage.setItem("selectedSection", selectedSection)
    localStorage.setItem("studentData", JSON.stringify(studentData))

    // Show different popups based on user role
    if (user?.role === "AMC" && !isAdmin()) {
      setShowCompletionPopup(true)
    } else {
      // Navigate based on user role
      const destination = isAdmin() ? "/dashboard/review" : user?.role === "AMC" ? "/dashboard" : "/dashboard/review"
      setNavigationDestination(destination)
      setShowNavigationConfirm(true)
    }
  }

  return (
    <div className="max-w-7xl">
      {notification && (
        <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
      )}
      <h1 className="text-3xl font-bold mb-6">Eligibility</h1>

      <p className="mb-8">
        Upload the students attendance document by the{" "}
        <span className="font-semibold">{user?.role === "AMC" ? "AMC" : "HOD"}</span>. To verify the eligibility
        criteria for attending the examination. Uploaded to <span className="font-semibold">HOD</span> for Review.
      </p>

      <div className="flex gap-6 mb-8">
        {/* Program Dropdown */}
        <div className="flex-1">
          <div className="relative">
            <button
              onClick={() => {
                setShowProgramDropdown(!showProgramDropdown)
                setShowSemesterDropdown(false)
                setShowSectionDropdown(false)
              }}
              className="w-full flex items-center justify-between px-6 py-3 bg-[#000000] text-[#ffffff] rounded-full"
            >
              <span>Program</span>
              <ChevronDown className="w-5 h-5" />
            </button>
            <div className="mt-2 w-full p-2 bg-[#ffffff] border-2 border-[#000000]/20 rounded-2xl">
              <div className="px-4 py-2 text-center text-[#1e1e1e]">{selectedProgram || "-"}</div>
            </div>
            {showProgramDropdown && (
              <div className="absolute w-full mt-2 p-2 bg-[#ffffff] border-2 border-[#000000]/20 rounded-2xl z-50">
                {programs.map((program) => (
                  <div
                    key={program}
                    onClick={() => {
                      setSelectedProgram(program)
                      setSelectedSemester("")
                      setShowProgramDropdown(false)
                      setShowTable(false)
                      setIsUploaded(false)
                    }}
                    className="px-4 py-2 text-center hover:bg-[#d9d9d9] cursor-pointer"
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
                if (!selectedProgram) {
                  setNotification({
                    message: "Please select a program first",
                    type: "warning",
                  })
                  return
                }
                setShowSemesterDropdown(!showSemesterDropdown)
                setShowProgramDropdown(false)
                setShowSectionDropdown(false)
              }}
              className="w-full flex items-center justify-between px-6 py-3 bg-[#000000] text-[#ffffff] rounded-full"
            >
              <span>Semester</span>
              <ChevronDown className="w-5 h-5" />
            </button>
            <div className="mt-2 w-full p-2 bg-[#ffffff] border-2 border-[#000000]/20 rounded-2xl">
              <div className="px-4 py-2 text-center text-[#1e1e1e]">{selectedSemester || "-"}</div>
            </div>
            {showSemesterDropdown && selectedProgram && (
              <div className="absolute w-full mt-2 p-2 bg-[#ffffff] border-2 border-[#000000]/20 rounded-2xl z-50">
                {getSemesters(selectedProgram).map((semester) => (
                  <div
                    key={semester}
                    onClick={() => {
                      setSelectedSemester(semester)
                      setShowSemesterDropdown(false)
                      setShowTable(false)
                      setIsUploaded(false)
                    }}
                    className="px-4 py-2 text-center hover:bg-[#d9d9d9] cursor-pointer"
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
                if (!selectedSemester) {
                  setNotification({
                    message: "Please select a semester first",
                    type: "warning",
                  })
                  return
                }
                setShowSectionDropdown(!showSectionDropdown)
                setShowProgramDropdown(false)
                setShowSemesterDropdown(false)
              }}
              className="w-full flex items-center justify-between px-6 py-3 bg-[#000000] text-[#ffffff] rounded-full"
            >
              <span>Section</span>
              <ChevronDown className="w-5 h-5" />
            </button>
            <div className="mt-2 w-full p-2 bg-[#ffffff] border-2 border-[#000000]/20 rounded-2xl">
              <div className="px-4 py-2 text-center text-[#1e1e1e]">{selectedSection || "-"}</div>
            </div>
            {showSectionDropdown && selectedSemester && (
              <div className="absolute w-full mt-2 p-2 bg-[#ffffff] border-2 border-[#000000]/20 rounded-2xl z-50">
                {sections.map((section) => (
                  <div
                    key={section}
                    onClick={() => {
                      setSelectedSection(section)
                      setShowSectionDropdown(false)
                      setShowTable(false)
                      setIsUploaded(false)
                    }}
                    className="px-4 py-2 text-center hover:bg-[#d9d9d9] cursor-pointer"
                  >
                    {section}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-sm mb-4">Upload Student Overall Attendance Excel File in .xlsx format. Max size 10MB.</p>

      {showTable ? (
        <div className="border-2 border-[#000000]/20 rounded-2xl overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-[#000000]/20">
                  <th className="px-4 py-3 text-left">Regd #</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-center">Overall classes</th>
                  <th className="px-4 py-3 text-center">Overall present</th>
                  <th className="px-4 py-3 text-center">Overall absent</th>
                  <th className="px-4 py-3 text-center">Overall per(%)</th>
                </tr>
              </thead>
              <tbody>
                {studentData.map((student, index) => (
                  <tr key={student.regNo} className="border-b border-[#000000]/10 last:border-b-0">
                    <td className="px-4 py-3">{student.regNo}</td>
                    <td className="px-4 py-3">{student.name}</td>
                    <td className="px-4 py-3 text-center">{student.totalClasses}</td>
                    <td className="px-4 py-3 text-center">{student.present}</td>
                    <td className="px-4 py-3 text-center">{student.absent}</td>
                    <td className="px-4 py-3 text-center">{student.percentage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-[#000000]/20 rounded-2xl p-8 mb-8 text-center"
          onClick={selectedProgram && selectedSemester && selectedSection ? undefined : undefined}
        >
          {selectedProgram && selectedSemester && selectedSection ? (
            <div className="flex flex-col items-center gap-4">
              {isUploaded ? (
                <div className="w-full">
                  {isAnalyzing ? (
                    <div className="flex flex-col items-center py-8">
                      <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-[#1e1e1e] text-lg font-medium">Analyzing student data...</p>
                      <p className="text-[#1e1e1e] text-sm mt-2">This may take a few moments</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-[#1e1e1e] text-lg font-medium">Analysis Complete</p>
                      <p className="text-[#1e1e1e] text-sm mt-2">Student data has been processed successfully</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 py-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-[#1e1e1e] mb-2">Upload student attendance Excel file</p>
                  <label className="px-6 py-3 bg-[#000000] text-[#ffffff] rounded-full transition-all duration-200 hover:bg-[#000000]/80 hover:scale-105 active:scale-95 cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept=".xlsx,.xls"
                      onChange={(e) => {
                        e.preventDefault()
                        if (e.target.files && e.target.files[0]) {
                          setIsUploaded(true)
                          setIsAnalyzing(true)
                          // Simulate analysis time
                          setTimeout(() => {
                            setIsAnalyzing(false)
                            setShowTable(true)
                          }, 1500)
                        }
                      }}
                    />
                    Select Excel File
                  </label>
                  <p className="text-xs text-gray-500">Supports .xlsx or .xls format (max 10MB)</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-[#1e1e1e]">Please select the Program, Semester and Section</p>
          )}
        </div>
      )}

      <div className="flex justify-end gap-4">
        <button
          onClick={handleUpload}
          className="px-6 py-3 bg-[#000000] text-[#ffffff] rounded-full transition-all duration-200 hover:bg-[#000000]/80 hover:scale-105 active:scale-95"
        >
          Upload
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-[#ffffff] text-[#000000] border-2 border-[#000000] rounded-full transition-all duration-200 hover:bg-[#d9d9d9] hover:scale-105 active:scale-95"
        >
          Submit
        </button>
      </div>

      {/* Navigation Confirmation Dialog */}
      <NavigationConfirm
        isOpen={showNavigationConfirm}
        onClose={() => setShowNavigationConfirm(false)}
        destination={navigationDestination}
        message={`You are about to proceed to the ${navigationDestination.includes("review") ? "Review" : "Dashboard"} page. Your eligibility data has been submitted successfully.`}
      />

      {/* Completion Popup for AMC */}
      <CompletionPopup
        isOpen={showCompletionPopup}
        onClose={() => {
          setShowCompletionPopup(false)
          router.push("/dashboard")
        }}
        message="Task completed successfully! The student list has been submitted for review by the HOD."
      />
    </div>
  )
}
