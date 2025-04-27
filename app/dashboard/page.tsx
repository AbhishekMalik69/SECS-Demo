"use client"

import { Calendar } from "@/components/calendar"
import { ExamSchedule } from "@/components/exam-schedule"
import { InfoCard } from "@/components/info-card"
import { Building2, CheckCircle, Users2, Info } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardPage() {
  const { user, hasAccess } = useAuth()

  if (!user) return null

  return (
    <div className="flex justify-between items-start">
      <div className="flex-1 mr-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}</h1>
          <p className="text-gray-600">
            You are logged in as <span className="font-semibold">{user.role}</span>.
            {user.role === "Admin" && " You have full access to all system features."}
            {user.role === "HOD" && " You can manage eligibility, review documents, and oversee the exam process."}
            {user.role === "Exam Coordinator" && " You can manage seating allocation and invigilation assignments."}
            {user.role === "AMC" && " You can upload eligibility data and review student documents."}
          </p>
        </div>

        <ExamSchedule />
        <div className="grid grid-cols-2 gap-6 mt-6">
          {hasAccess("eligibility") && (
            <InfoCard
              title="Eligibility Criteria"
              description="Upload the students attendance document by the HOD. To verify the eligibility criteria for attending the examination."
              icon={<CheckCircle className="w-6 h-6" />}
              href="/dashboard/eligibility"
            />
          )}

          {hasAccess("review") && (
            <InfoCard
              title="Review Document"
              description="Uploaded document is to be reviewed by the HOD. To verify the medical documents of the ineligible students."
              icon={<Info className="w-6 h-6" />}
              href="/dashboard/review"
            />
          )}

          {hasAccess("allocation") && (
            <InfoCard
              title="Seating Allocation"
              description="The final eligible students seats are allocated for they respective exams. Customize the seating allocation by the Exam coordinator."
              icon={<Building2 className="w-6 h-6" />}
              href="/dashboard/allocation"
            />
          )}

          {hasAccess("invigilation") && (
            <InfoCard
              title="Invigilation Assignment"
              description="Invigilators are assigned in respective of their free schedule and organize balanced workflow."
              icon={<Users2 className="w-6 h-6" />}
              href="#"
            />
          )}
        </div>
      </div>
      <Calendar />
    </div>
  )
}
