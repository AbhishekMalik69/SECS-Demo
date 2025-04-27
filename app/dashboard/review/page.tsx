"use client"

import type React from "react"

import { ChevronDown, X, FileText, Upload } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Notification } from "@/components/notification"
import { useAuth } from "@/contexts/auth-context"
import { NavigationConfirm } from "@/components/navigation-confirm"
import { CompletionPopup } from "@/components/completion-popup"
import { getStudentsByFilter, getReviewStats } from "@/data/student-data"

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  student: any
  onSubmit: (amcRemark: string, hodRemark: string, action: "accept" | "reject") => void
  isAMC?: boolean
}

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  student: any
  onSubmit: (file: File | null) => void
}

const ReviewModal = ({ isOpen, onClose, student, onSubmit, isAMC = false }: ReviewModalProps) => {
  const [amcRemark, setAmcRemark] = useState("")
  const [hodRemark, setHodRemark] = useState("")

  if (!isOpen || !student) return null

  const handleSubmit = (action: "accept" | "reject") => {
    onSubmit(amcRemark, hodRemark, action)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-[90vw] max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-black">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 border-b-2 pb-2">Review</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">REGD. NO.</label>
            <div className="p-2 border-2 border-black/20 rounded-lg">{student.regNo}</div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">NAME</label>
            <div className="p-2 border-2 border-black/20 rounded-lg">{student.name}</div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ATTENDANCE PERCENTAGE %</label>
            <div className="p-2 border-2 border-black/20 rounded-lg">{student.percentage}</div>
          </div>

          {isAMC ? (
            <div>
              <label className="block text-sm font-medium mb-1">AMC REMARK</label>
              <textarea
                value={amcRemark}
                onChange={(e) => setAmcRemark(e.target.value)}
                placeholder="Enter your remarks here..."
                className="w-full p-2 border-2 border-black/20 rounded-lg min-h-[100px] max-h-[200px] focus:outline-none focus:border-black"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">AMC REMARK</label>
                <div className="p-2 border-2 border-black/20 rounded-lg">{student.amcRemark || "No remarks"}</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">HOD REMARK</label>
                <textarea
                  value={hodRemark}
                  onChange={(e) => setHodRemark(e.target.value)}
                  placeholder="Enter your remarks here..."
                  className="w-full p-2 border-2 border-black/20 rounded-lg min-h-[100px] max-h-[200px] focus:outline-none focus:border-black"
                />
              </div>
            </>
          )}

          <div className="border-2 border-black/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <button className="bg-black text-white px-4 py-2 rounded-full text-sm">Upload</button>
              <span className="text-sm text-gray-500">Medical Certificate in PDF format. Max size 10MB.</span>
            </div>

            {student.medicalCertificate === "submitted" && (
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Medical Certificate.pdf</span>
                  <span className="text-xs text-gray-500">2m ago</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="bg-black text-white px-3 py-1 rounded-full text-sm">View</button>
                  <button className="text-gray-500 hover:text-black">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => handleSubmit("accept")}
            className="px-6 py-2 bg-black text-white rounded-full hover:bg-black/90 transition-colors"
          >
            Accept
          </button>
          <button
            onClick={() => handleSubmit("reject")}
            className="px-6 py-2 bg-white text-black border-2 border-black rounded-full hover:bg-gray-50 transition-colors"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  )
}

const UploadModal = ({ isOpen, onClose, student, onSubmit }: UploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen || !student) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = () => {
    onSubmit(selectedFile)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-[90vw] max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-black">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 border-b-2 pb-2">Upload Medical Certificate</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">REGD. NO.</label>
            <div className="p-2 border-2 border-black/20 rounded-lg">{student.regNo}</div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">NAME</label>
            <div className="p-2 border-2 border-black/20 rounded-lg">{student.name}</div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ATTENDANCE PERCENTAGE %</label>
            <div className="p-2 border-2 border-black/20 rounded-lg">{student.percentage}</div>
          </div>

          <div className="border-2 border-black/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <button
                onClick={handleUploadClick}
                className="bg-black text-white px-4 py-2 rounded-full text-sm flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>
              <span className="text-sm text-gray-500">Medical Certificate in PDF format. Max size 10MB.</span>
            </div>

            {selectedFile && (
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">{selectedFile.name}</span>
                  <span className="text-xs text-gray-500">Just now</span>
                </div>
                <button onClick={() => setSelectedFile(null)} className="text-gray-500 hover:text-black">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleSubmit}
            disabled={!selectedFile}
            className={`px-6 py-2 rounded-full transition-colors ${
              selectedFile ? "bg-black text-white hover:bg-black/90" : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white text-black border-2 border-black rounded-full hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ReviewPage() {
  const { user, isAdmin } = useAuth()
  const [selectedProgram, setSelectedProgram] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const [showProgramDropdown, setShowProgramDropdown] = useState(false)
  const [showSemesterDropdown, setShowSemesterDropdown] = useState(false)
  const [showSectionDropdown, setShowSectionDropdown] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [notification, setNotification] = useState<{
    message: string
    type: "success" | "warning"
  } | null>(null)
  const [students, setStudents] = useState<any[]>([])
  const [isUploaded, setIsUploaded] = useState(false)
  const [showNavigationConfirm, setShowNavigationConfirm] = useState(false)
  const [showCompletionPopup, setShowCompletionPopup] = useState(false)
  const [navigationDestination, setNavigationDestination] = useState("")
  const [stats, setStats] = useState({ eligible: 0, nonEligible: 0, underEvaluation: 0, overall: 0 })
  const [isAMCReview, setIsAMCReview] = useState(user?.role === "AMC")

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

  // Load student data from localStorage or use default
  useEffect(() => {
    const storedProgram = localStorage.getItem("selectedProgram")
    const storedSemester = localStorage.getItem("selectedSemester")
    const storedSection = localStorage.getItem("selectedSection")
    const storedStudentData = localStorage.getItem("studentData")

    if (storedProgram) setSelectedProgram(storedProgram)
    if (storedSemester) setSelectedSemester(storedSemester)
    if (storedSection) setSelectedSection(storedSection)

    // If we have stored data, use it; otherwise, use our generated data
    if (storedProgram && storedSemester && storedSection) {
      let studentsData = []

      if (storedStudentData) {
        try {
          studentsData = JSON.parse(storedStudentData)
        } catch (error) {
          console.error("Error parsing student data:", error)
          studentsData = getStudentsByFilter(storedProgram, storedSemester, storedSection)
        }
      } else {
        studentsData = getStudentsByFilter(storedProgram, storedSemester, storedSection)
      }

      // Filter students based on eligibility criteria for review
      const filteredStudents = studentsData.filter((student: any) => {
        const percentage = Number.parseFloat(student.percentage)
        return percentage >= 65 && percentage < 75 // Only show students under evaluation
      })

      setStudents(filteredStudents)

      // Update stats
      const reviewStats = getReviewStats(storedProgram, storedSemester, storedSection)
      setStats(reviewStats)
    }
  }, [])

  // Update stats when selection changes
  useEffect(() => {
    if (selectedProgram && selectedSemester && selectedSection) {
      const reviewStats = getReviewStats(selectedProgram, selectedSemester, selectedSection)
      setStats(reviewStats)

      // Filter students based on eligibility criteria for review
      const studentsData = getStudentsByFilter(selectedProgram, selectedSemester, selectedSection)
      const filteredStudents = studentsData.filter((student: any) => {
        const percentage = Number.parseFloat(student.percentage)
        return percentage >= 65 && percentage < 75 // Only show students under evaluation
      })

      setStudents(filteredStudents)
    }
  }, [selectedProgram, selectedSemester, selectedSection])

  const handleReview = (student: any) => {
    setSelectedStudent(student)
    setShowReviewModal(true)
  }

  const handleUpload = (student: any) => {
    setSelectedStudent(student)
    setShowUploadModal(true)
  }

  const handleReviewSubmit = (amcRemark: string, hodRemark: string, action: "accept" | "reject") => {
    setStudents((currentStudents) =>
      currentStudents.map((student) => {
        if (student.regNo === selectedStudent.regNo) {
          const updatedStudent = {
            ...student,
            status: "completed",
            eligibilityStatus: action === "accept" ? "Eligible" : "Ineligible",
          }

          if (isAMCReview) {
            updatedStudent.amcRemark = amcRemark
          } else {
            updatedStudent.hodRemark = hodRemark
          }

          return updatedStudent
        }
        return student
      }),
    )

    setNotification({
      message: `Review ${action === "accept" ? "accepted" : "rejected"} successfully`,
      type: "success",
    })
  }

  const handleUploadSubmit = (file: File | null) => {
    if (file) {
      setStudents((currentStudents) =>
        currentStudents.map((student) =>
          student.regNo === selectedStudent.regNo
            ? { ...student, medicalCertificate: "submitted", status: "pending" }
            : student,
        ),
      )

      setNotification({
        message: "Medical certificate uploaded successfully",
        type: "success",
      })
    }
  }

  const handleProgramChange = (program: string) => {
    setSelectedProgram(program)
    setSelectedSemester("")
    setSelectedSection("")
    setShowProgramDropdown(false)
  }

  const handleSemesterChange = (semester: string) => {
    setSelectedSemester(semester)
    setSelectedSection("")
    setShowSemesterDropdown(false)
  }

  const handleSectionChange = (section: string) => {
    setSelectedSection(section)
    setShowSectionDropdown(false)
  }

  const handleSubmit = () => {
    if (!selectedProgram || !selectedSemester || !selectedSection) {
      setNotification({
        message: "Please select program, semester, and section",
        type: "warning",
      })
      return
    }

    setNotification({
      message: "Review submitted successfully",
      type: "success",
    })

    // Store eligible students in localStorage for allocation page
    const eligibleStudents = students.filter(
      (s) =>
        Number.parseFloat(s.percentage) >= 75 ||
        (s.medicalCertificate === "submitted" && s.status === "completed" && s.eligibilityStatus === "Eligible"),
    )
    localStorage.setItem("eligibleStudents", JSON.stringify(eligibleStudents))

    // Show different popups based on user role
    if (isAMCReview) {
      // For AMC, show completion popup and then navigate to dashboard
      setShowCompletionPopup(true)
    } else {
      // For HOD or admin, navigate to allocation page
      const destination = "/dashboard/allocation"
      setNavigationDestination(destination)
      setShowNavigationConfirm(true)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {notification && (
        <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
      )}
      <div className="border-2 rounded-3xl p-8">
        <h1 className="text-3xl font-bold mb-4 border-b-2 pb-4">Review</h1>

        <p className="mb-8">
          Uploaded document is to be reviewed by the <span className="font-semibold">{user?.role}</span>. To verify the
          medical documents of the ineligible students.
        </p>

        <div className="flex gap-6 mb-8">
          {/* Program Dropdown */}
          <div className="flex-1">
            <div className="relative">
              <button
                onClick={() => setShowProgramDropdown(!showProgramDropdown)}
                className="w-full flex items-center justify-between px-6 py-3 bg-black text-white rounded-full"
              >
                <span>Program</span>
                <ChevronDown className="w-5 h-5" />
              </button>
              <div className="mt-2 w-full p-2 bg-white border-2 border-black/20 rounded-full">
                <div className="px-4 py-2 text-center">{selectedProgram || "-"}</div>
              </div>
              {showProgramDropdown && (
                <div className="absolute w-full mt-2 p-2 bg-white border-2 border-black/20 rounded-2xl z-50">
                  {programs.map((program) => (
                    <div
                      key={program}
                      onClick={() => handleProgramChange(program)}
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
                  if (!selectedProgram) {
                    setNotification({
                      message: "Please select a program first",
                      type: "warning",
                    })
                    return
                  }
                  setShowSemesterDropdown(!showSemesterDropdown)
                }}
                className="w-full flex items-center justify-between px-6 py-3 bg-black text-white rounded-full"
              >
                <span>Semester</span>
                <ChevronDown className="w-5 h-5" />
              </button>
              <div className="mt-2 w-full p-2 bg-white border-2 border-black/20 rounded-full">
                <div className="px-4 py-2 text-center">{selectedSemester || "-"}</div>
              </div>
              {showSemesterDropdown && selectedProgram && (
                <div className="absolute w-full mt-2 p-2 bg-white border-2 border-black/20 rounded-2xl z-50">
                  {getSemesters(selectedProgram).map((semester) => (
                    <div
                      key={semester}
                      onClick={() => handleSemesterChange(semester)}
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
                  if (!selectedSemester) {
                    setNotification({
                      message: "Please select a semester first",
                      type: "warning",
                    })
                    return
                  }
                  setShowSectionDropdown(!showSectionDropdown)
                }}
                className="w-full flex items-center justify-between px-6 py-3 bg-black text-white rounded-full"
              >
                <span>Section</span>
                <ChevronDown className="w-5 h-5" />
              </button>
              <div className="mt-2 w-full p-2 bg-white border-2 border-black/20 rounded-full">
                <div className="px-4 py-2 text-center">{selectedSection || "-"}</div>
              </div>
              {showSectionDropdown && selectedSemester && (
                <div className="absolute w-full mt-2 p-2 bg-white border-2 border-black/20 rounded-2xl z-50">
                  {sections.map((section) => (
                    <div
                      key={section}
                      onClick={() => handleSectionChange(section)}
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

        {/* Statistics */}
        {selectedProgram && selectedSemester && selectedSection && (
          <div className="flex gap-4 mb-8">
            <div className="flex-1 p-4 border-2 border-black rounded-full text-center">
              <span>Non-Eligible Students: {stats.nonEligible}</span>
            </div>
            <div className="flex-1 p-4 border-2 border-black rounded-full text-center">
              <span>Eligible Students: {stats.eligible}</span>
            </div>
            <div className="flex-1 p-4 border-2 border-black rounded-full text-center bg-yellow-50">
              <span>Students Under Evaluation: {stats.underEvaluation}</span>
            </div>
            <div className="flex-1 p-4 border-2 border-black rounded-full text-center">
              <span>Overall Students: {stats.overall}</span>
            </div>
          </div>
        )}

        {/* Table Structure */}
        {selectedProgram && selectedSemester && selectedSection ? (
          <div className="border-2 border-black/20 rounded-2xl overflow-hidden mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-black/20">
                  <th className="px-6 py-4 text-left">Regd. No.</th>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Overall Attendance %</th>
                  <th className="px-6 py-4 text-left">Medical Certificate</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.regNo} className="border-b border-black/10 last:border-b-0">
                      <td className="px-6 py-4">{student.regNo}</td>
                      <td className="px-6 py-4">{student.name}</td>
                      <td className="px-6 py-4 text-center">{student.percentage}</td>
                      <td className="px-6 py-4 text-center">
                        {student.medicalCertificate === "submitted" ? (
                          <a href="#" className="text-blue-600 hover:underline">
                            View
                          </a>
                        ) : (
                          <button onClick={() => handleUpload(student)} className="text-red-600 hover:underline">
                            Not Submitted
                          </button>
                        )}
                      </td>
                      <td
                        className={`px-6 py-4 text-center ${
                          student.medicalCertificate === "submitted"
                            ? student.status === "completed"
                              ? "bg-green-200"
                              : "bg-red-200"
                            : "bg-yellow-200"
                        }`}
                      >
                        {student.medicalCertificate === "submitted" ? (
                          student.status === "completed" ? (
                            "Review Completed"
                          ) : (
                            <button onClick={() => handleReview(student)} className="text-red-600 hover:underline">
                              Review Pending
                            </button>
                          )
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No students under evaluation for this selection
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border-2 border-black/20 rounded-2xl p-8 mb-8 text-center">
            <p className="text-gray-600">Please select Program, Semester, and Section to view students</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => {
              if (!selectedProgram || !selectedSemester || !selectedSection) {
                setNotification({
                  message: "Please select program, semester, and section",
                  type: "warning",
                })
                return
              }
              setIsUploaded(true)
              setNotification({
                message: "Review saved successfully",
                type: "success",
              })
            }}
            className="px-8 py-3 bg-black text-white rounded-full hover:bg-black/90 transition-colors"
          >
            Save
          </button>
          <button
            onClick={handleSubmit}
            className={`px-8 py-3 rounded-full transition-colors ${
              selectedProgram && selectedSemester && selectedSection
                ? "bg-white text-black border-2 border-black hover:bg-gray-50"
                : "bg-gray-200 text-gray-500 border-2 border-gray-200 cursor-not-allowed"
            }`}
          >
            Submit
          </button>
        </div>
      </div>

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        student={selectedStudent}
        onSubmit={handleReviewSubmit}
        isAMC={isAMCReview}
      />

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        student={selectedStudent}
        onSubmit={handleUploadSubmit}
      />

      {/* Navigation Confirmation Dialog */}
      <NavigationConfirm
        isOpen={showNavigationConfirm}
        onClose={() => setShowNavigationConfirm(false)}
        destination={navigationDestination}
        message={`You are about to proceed to the ${navigationDestination.includes("allocation") ? "Allocation" : "Dashboard"} page. Your review has been submitted successfully.`}
      />

      {/* Completion Popup for AMC */}
      <CompletionPopup
        isOpen={showCompletionPopup}
        onClose={() => {
          setShowCompletionPopup(false)
          window.location.href = "/dashboard"
        }}
        message={
          isAMCReview
            ? "Task completed successfully! The review has been submitted to HOD for final approval."
            : "Task completed successfully! The review has been submitted and eligible students are now ready for seating allocation."
        }
      />
    </div>
  )
}
