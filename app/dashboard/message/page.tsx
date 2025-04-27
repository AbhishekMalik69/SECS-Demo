"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, X, Upload, HelpCircle, FileText, Info, Paperclip } from "lucide-react"
import { Notification } from "@/components/notification"
import { useAuth } from "@/contexts/auth-context"
import { NavigationConfirm } from "@/components/navigation-confirm"
import { generateStudentData } from "@/data/student-data"
import { facultyData } from "@/data/faculty-data"

// Interface for recipient
interface Recipient {
  id: string
  name: string
  type: "student" | "faculty"
  email?: string
  phone?: string
}

// Interface for message template
interface MessageTemplate {
  id: string
  name: string
  subject: string
  body: string
}

// Message templates
const messageTemplates: MessageTemplate[] = [
  {
    id: "1",
    name: "Exam Schedule Announcement",
    subject: "Mid-Term Examination Schedule for @program @semester @section",
    body: "Dear @recipientName,\n\nThis is to inform you that the Mid-Term Examination for @program @semester @section is scheduled to begin on @examDate.\n\nPlease find your seating arrangement details below:\n- Room: @roomNumber\n- Time: @examTime\n\nPlease ensure you arrive at least 15 minutes before the examination time with your ID card.\n\nBest regards,\n@senderName",
  },
  {
    id: "2",
    name: "Invigilation Duty",
    subject: "Invigilation Duty Assignment for Mid-Term Examinations",
    body: "Dear @recipientName,\n\nYou have been assigned invigilation duty for the upcoming Mid-Term Examinations as follows:\n\nDate: @examDate\nTime: @examTime\nRoom: @roomNumber\nSubject: @subjectName\n\nPlease ensure you arrive at the examination hall 30 minutes before the scheduled time to make necessary arrangements.\n\nThank you for your cooperation.\n\nBest regards,\n@senderName",
  },
  {
    id: "3",
    name: "Exam Postponement",
    subject: "Important: Postponement of @subjectName Examination",
    body: "Dear @recipientName,\n\nThis is to inform you that the @subjectName examination scheduled for @examDate has been postponed due to unavoidable circumstances.\n\nThe revised schedule will be communicated to you shortly.\n\nWe apologize for any inconvenience caused.\n\nBest regards,\n@senderName",
  },
]

// Available message variables
const messageVariables = [
  { variable: "@recipientName", description: "Name of the recipient" },
  { variable: "@senderName", description: "Your name" },
  { variable: "@program", description: "Program (BCA, MCA, etc.)" },
  { variable: "@semester", description: "Semester (I, II, III, etc.)" },
  { variable: "@section", description: "Section (A, B, etc.)" },
  { variable: "@examDate", description: "Examination date" },
  { variable: "@examTime", description: "Examination time" },
  { variable: "@roomNumber", description: "Room number" },
  { variable: "@subjectName", description: "Subject name" },
]

export default function MessagePage() {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Recipient type selection
  const [recipientType, setRecipientType] = useState<"student" | "faculty" | "main">("student")
  const [showStudentDropdown, setShowStudentDropdown] = useState(false)
  const [showFacultyDropdown, setShowFacultyDropdown] = useState(false)
  const [showMainDropdown, setShowMainDropdown] = useState(false)
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false)

  // Message form
  const [messageForm, setMessageForm] = useState({
    to: "",
    by: user?.name || "",
    subject: "",
    body: "",
  })

  // Send options
  const [sendViaWhatsApp, setSendViaWhatsApp] = useState(true)
  const [sendViaEmail, setSendViaEmail] = useState(false)

  // Recipients data
  const [students, setStudents] = useState<Recipient[]>([])
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null)

  // File uploads
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  // Help tooltip
  const [showVariablesHelp, setShowVariablesHelp] = useState(false)

  // Notification and navigation
  const [notification, setNotification] = useState<{
    message: string
    type: "success" | "warning"
  } | null>(null)
  const [showNavigationConfirm, setShowNavigationConfirm] = useState(false)

  // Load student data
  useEffect(() => {
    // Get student data from localStorage or generate new data
    const storedStudentData = localStorage.getItem("studentData")
    let studentRecipients: Recipient[] = []

    if (storedStudentData) {
      try {
        const parsedData = JSON.parse(storedStudentData)
        studentRecipients = parsedData.map((student: any) => ({
          id: student.regNo,
          name: student.name,
          type: "student",
          email: `${student.name.toLowerCase().replace(/\s+/g, ".")}@student.example.com`,
          phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        }))
      } catch (error) {
        console.error("Error parsing student data:", error)
      }
    }

    // If no stored data, generate random student data
    if (studentRecipients.length === 0) {
      const generatedStudents = generateStudentData("MCA", "VI", "B", 15)
      studentRecipients = generatedStudents.map((student: any) => ({
        id: student.regNo,
        name: student.name,
        type: "student",
        email: `${student.name.toLowerCase().replace(/\s+/g, ".")}@student.example.com`,
        phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      }))
    }

    setStudents(studentRecipients)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowStudentDropdown(false)
        setShowFacultyDropdown(false)
        setShowMainDropdown(false)
        setShowTemplateDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Faculty recipients
  const facultyRecipients: Recipient[] = facultyData.map((faculty) => ({
    id: faculty.id,
    name: faculty.name,
    type: "faculty",
    email: faculty.email,
    phone: faculty.phone,
  }))

  // Handle recipient selection
  const handleRecipientSelect = (recipient: Recipient) => {
    setSelectedRecipient(recipient)
    setMessageForm({
      ...messageForm,
      to: recipient.id,
    })

    // Close dropdowns
    setShowStudentDropdown(false)
    setShowFacultyDropdown(false)
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setMessageForm({
      ...messageForm,
      [name]: value,
    })
  }

  // Handle template selection
  const handleTemplateSelect = (template: MessageTemplate) => {
    setMessageForm({
      ...messageForm,
      subject: template.subject,
      body: template.body,
    })
    setShowTemplateDropdown(false)
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setUploadedFiles([...uploadedFiles, ...newFiles])
    }
  }

  // Remove uploaded file
  const handleRemoveFile = (index: number) => {
    const newFiles = [...uploadedFiles]
    newFiles.splice(index, 1)
    setUploadedFiles(newFiles)
  }

  // Insert variable into message
  const insertVariable = (variable: string) => {
    const textArea = document.getElementById("messageBody") as HTMLTextAreaElement
    if (textArea) {
      const start = textArea.selectionStart
      const end = textArea.selectionEnd
      const text = messageForm.body
      const newText = text.substring(0, start) + variable + text.substring(end)

      setMessageForm({
        ...messageForm,
        body: newText,
      })

      // Set focus back to textarea with cursor after the inserted variable
      setTimeout(() => {
        textArea.focus()
        textArea.setSelectionRange(start + variable.length, start + variable.length)
      }, 0)
    } else {
      setMessageForm({
        ...messageForm,
        body: messageForm.body + variable,
      })
    }
  }

  // Handle message submission
  const handleSubmit = () => {
    // Validate form
    if (!messageForm.to || !messageForm.subject || !messageForm.body) {
      setNotification({
        message: "Please fill all the required fields",
        type: "warning",
      })
      return
    }

    // Check if at least one send method is selected
    if (!sendViaWhatsApp && !sendViaEmail) {
      setNotification({
        message: "Please select at least one send method",
        type: "warning",
      })
      return
    }

    // Show success notification
    setNotification({
      message: `Message sent successfully via ${sendViaWhatsApp && sendViaEmail ? "WhatsApp and Email" : sendViaWhatsApp ? "WhatsApp" : "Email"}`,
      type: "success",
    })

    // Show navigation confirmation
    setShowNavigationConfirm(true)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {notification && (
        <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
      )}

      <div className="border-2 rounded-3xl p-8">
        <h1 className="text-3xl font-bold mb-4 border-b-2 pb-4">Message</h1>

        <p className="mb-8">
          After seat allocation and invigilation assignment, the WhatsApp message is posted for all students. The
          message contains all the required information regarding the exam.
        </p>

        {/* Recipient Type Selection */}
        <div className="flex gap-6 mb-8">
          {/* Student Button */}
          <div className="flex-1">
            <button
              onClick={() => {
                setRecipientType("student")
                setShowStudentDropdown(true)
                setShowFacultyDropdown(false)
                setShowMainDropdown(false)

                // If no specific student is selected, set "All Students" as default
                if (recipientType !== "student") {
                  setMessageForm({
                    ...messageForm,
                    to: "All Students",
                  })
                }
              }}
              className={`w-full flex items-center justify-between px-6 py-3 rounded-full ${
                recipientType === "student" ? "bg-black text-white" : "bg-white text-black border-2 border-black"
              }`}
            >
              <span>Student</span>
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Faculty Button */}
          <div className="flex-1">
            <button
              onClick={() => {
                setRecipientType("faculty")
                setShowFacultyDropdown(true)
                setShowStudentDropdown(false)
                setShowMainDropdown(false)

                // If no specific faculty is selected, set "All Faculty" as default
                if (recipientType !== "faculty") {
                  setMessageForm({
                    ...messageForm,
                    to: "All Faculty",
                  })
                }
              }}
              className={`w-full flex items-center justify-between px-6 py-3 rounded-full ${
                recipientType === "faculty" ? "bg-black text-white" : "bg-white text-black border-2 border-black"
              }`}
            >
              <span>Faculty</span>
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Main Button */}
          <div className="flex-1">
            <button
              onClick={() => {
                setRecipientType("main")
                setShowMainDropdown(true)
                setShowStudentDropdown(false)
                setShowFacultyDropdown(false)

                // Set "All Students and Faculty" as default for main
                setMessageForm({
                  ...messageForm,
                  to: "All Students and Faculty",
                })
              }}
              className={`w-full flex items-center justify-between px-6 py-3 rounded-full ${
                recipientType === "main" ? "bg-black text-white" : "bg-white text-black border-2 border-black"
              }`}
            >
              <span>Main</span>
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Announcement Form */}
        <div className="border-2 border-black/20 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Announcement</h2>

            {/* Template Selector */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-black/90 transition-colors"
              >
                <span>Use Template</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showTemplateDropdown && (
                <div className="absolute right-0 w-64 mt-2 p-2 bg-white border-2 border-black/20 rounded-xl z-50 shadow-lg">
                  {messageTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                    >
                      {template.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* To Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">To</label>
            <div className="relative">
              <input
                type="text"
                name="to"
                value={messageForm.to}
                onChange={handleInputChange}
                placeholder={`Enter ${recipientType === "student" ? "student" : recipientType === "faculty" ? "faculty" : "recipient"} ID`}
                className="w-full px-4 py-2 rounded-full border-2 border-black/20 focus:outline-none focus:border-black"
              />

              {/* Recipient Dropdown */}
              {showStudentDropdown && (
                <div className="absolute left-0 w-full mt-1 p-2 bg-white border-2 border-black/20 rounded-2xl z-50 max-h-60 overflow-y-auto">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      onClick={() => handleRecipientSelect(student)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {student.id} - {student.name}
                    </div>
                  ))}
                </div>
              )}

              {showFacultyDropdown && (
                <div className="absolute left-0 w-full mt-1 p-2 bg-white border-2 border-black/20 rounded-2xl z-50 max-h-60 overflow-y-auto">
                  {facultyRecipients.map((faculty) => (
                    <div
                      key={faculty.id}
                      onClick={() => handleRecipientSelect(faculty)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {faculty.id} - {faculty.name}
                    </div>
                  ))}
                </div>
              )}

              {showMainDropdown && (
                <div className="absolute left-0 w-full mt-1 p-2 bg-white border-2 border-black/20 rounded-2xl z-50">
                  <div
                    onClick={() => {
                      setMessageForm({
                        ...messageForm,
                        to: "All Students",
                      })
                      setShowMainDropdown(false)
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    All Students
                  </div>
                  <div
                    onClick={() => {
                      setMessageForm({
                        ...messageForm,
                        to: "All Faculty",
                      })
                      setShowMainDropdown(false)
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    All Faculty
                  </div>
                  <div
                    onClick={() => {
                      setMessageForm({
                        ...messageForm,
                        to: "All Students and Faculty",
                      })
                      setShowMainDropdown(false)
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    All Students and Faculty
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* By Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">By</label>
            <input
              type="text"
              name="by"
              value={messageForm.by}
              onChange={handleInputChange}
              placeholder="Your name"
              className="w-full px-4 py-2 rounded-full border-2 border-black/20 focus:outline-none focus:border-black"
            />
          </div>

          {/* Subject Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              value={messageForm.subject}
              onChange={handleInputChange}
              placeholder="Enter subject"
              className="w-full px-4 py-2 rounded-full border-2 border-black/20 focus:outline-none focus:border-black"
            />
          </div>

          {/* Body Field */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Body</label>
              <div className="relative">
                <button
                  onClick={() => setShowVariablesHelp(!showVariablesHelp)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-black"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Message Variables</span>
                </button>

                {showVariablesHelp && (
                  <div className="absolute right-0 w-80 mt-2 p-4 bg-white border-2 border-black/20 rounded-xl z-50 shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Available Variables</h3>
                      <button onClick={() => setShowVariablesHelp(false)} className="text-gray-500 hover:text-black">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Click on a variable to insert it at the cursor position in your message.
                    </p>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {messageVariables.map((item) => (
                        <div
                          key={item.variable}
                          onClick={() => insertVariable(item.variable)}
                          className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                        >
                          <code className="text-blue-600 font-mono">{item.variable}</code>
                          <span className="text-sm text-gray-600">{item.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <textarea
              id="messageBody"
              name="body"
              value={messageForm.body}
              onChange={handleInputChange}
              placeholder="Enter message body"
              rows={6}
              className="w-full px-4 py-2 rounded-xl border-2 border-black/20 focus:outline-none focus:border-black resize-none font-mono"
            />
          </div>

          {/* File Attachments */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Attachments</label>
            <div className="border-2 border-black/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-black/90 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Files</span>
                </button>
                <span className="text-sm text-gray-500">Excel, PDF, Word, or Image files. Max size 10MB.</span>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                      <button onClick={() => handleRemoveFile(index)} className="text-gray-500 hover:text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {uploadedFiles.length === 0 && (
                <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                  <Paperclip className="w-8 h-8 mb-2" />
                  <p>Drag and drop files here or click Upload Files</p>
                </div>
              )}
            </div>
          </div>

          {/* Message Preview */}
          <div className="mb-6 border-2 border-black/20 rounded-xl p-4 bg-gray-50">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium">Message Preview</h3>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <p className="font-medium mb-1">
                Subject: {messageForm.subject.replace(/@(\w+)/g, '<span class="text-blue-600">@$1</span>')}
              </p>
              <div className="whitespace-pre-wrap text-gray-700">
                {messageForm.body.split("\n").map((line, i) => (
                  <p key={i} className="mb-1">
                    {line}
                  </p>
                ))}
              </div>
              {uploadedFiles.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Attachments: {uploadedFiles.length}</p>
                  <div className="flex flex-wrap gap-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {file.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Send Options */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Send to</label>
            <div className="flex gap-4">
              <button
                onClick={() => setSendViaWhatsApp(!sendViaWhatsApp)}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  sendViaWhatsApp ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                  <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                  <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                  <path d="M9.5 13.5c.5 1 1.5 1 2.5 1s2-.5 2.5-1" />
                </svg>
              </button>

              <button
                onClick={() => setSendViaEmail(!sendViaEmail)}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  sendViaEmail ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Recipient Details */}
          {selectedRecipient && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Recipient Details</h3>
                <button onClick={() => setSelectedRecipient(null)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p>{selectedRecipient.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ID</p>
                  <p>{selectedRecipient.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{selectedRecipient.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{selectedRecipient.phone}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => {
              setNotification({
                message: "File uploaded successfully",
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
        message="You are about to proceed to the Dashboard. Your message has been sent successfully."
      />
    </div>
  )
}
