"use client"

import { Building2, CheckCircle, Info, MessageSquare, Users2, LogOut } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useMemo } from "react"

const navigation = [
  { name: "Eligibility", icon: CheckCircle, href: "/dashboard/eligibility", page: "eligibility" },
  { name: "Review", icon: Info, href: "/dashboard/review", page: "review" },
  { name: "Allocation", icon: Building2, href: "/dashboard/allocation", page: "allocation" },
  { name: "Invigilation", icon: Users2, href: "/dashboard/invigilation", page: "invigilation" },
  { name: "Message", icon: MessageSquare, href: "/dashboard/message", page: "message" },
]

// Function to generate a random color
const getRandomColor = () => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export function Sidebar() {
  const { user, logout, hasAccess } = useAuth()

  // Generate a random color for the profile avatar (memoized so it doesn't change on re-renders)
  const profileColor = useMemo(() => getRandomColor(), [])

  if (!user) return null

  // Filter navigation items based on user role
  const accessibleNavigation = navigation.filter((item) => hasAccess(item.page))

  // Get initials from user name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="w-64 min-h-screen bg-black text-white p-6 flex flex-col">
      <div className="mb-12">
        <h1 className="text-2xl font-bold leading-tight">
          Smart
          <br />
          Exam
          <br />
          Coordination
          <br />
          System
        </h1>
      </div>
      <nav className="space-y-2 flex-1">
        {accessibleNavigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-3 px-3 py-2 bg-white/10 rounded-full group hover:bg-white/20 transition-colors">
        <div
          className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center ${profileColor} transition-all group-hover:grayscale`}
        >
          <span className="text-white font-bold">{getInitials(user.name)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{user.name}</div>
          <div className="text-sm text-gray-400">{user.role}</div>
        </div>
        <button onClick={logout} className="p-2 rounded-full hover:bg-white/10 flex-shrink-0" title="Logout">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
