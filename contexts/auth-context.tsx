"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// Define user roles
export type UserRole = "Admin" | "HOD" | "Exam Coordinator" | "AMC"

// Define user interface
export interface User {
  id: string
  username: string
  name: string
  role: UserRole
}

// Define the predefined users
export const USERS: Record<string, { password: string; user: User }> = {
  Cyni: {
    password: "Vpu09370@",
    user: {
      id: "admin1",
      username: "Cyni",
      name: "Cyni",
      role: "Admin",
    },
  },
  "11301": {
    password: "HOD11301",
    user: {
      id: "hod1",
      username: "11301",
      name: "T. Uma Devi",
      role: "HOD",
    },
  },
  "22501": {
    password: "EC22501",
    user: {
      id: "ec1",
      username: "22501",
      name: "M. Suresh",
      role: "Exam Coordinator",
    },
  },
  "33701": {
    password: "AMC33701",
    user: {
      id: "amc1",
      username: "33701",
      name: "G. Ramesh Naidu",
      role: "AMC",
    },
  },
}

// Define the page access permissions for each role
export const ROLE_ACCESS: Record<UserRole, string[]> = {
  Admin: ["eligibility", "review", "allocation", "invigilation", "message"],
  HOD: ["eligibility", "review", "allocation", "invigilation", "message"],
  "Exam Coordinator": ["allocation", "invigilation", "message"],
  AMC: ["eligibility", "review"],
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => boolean
  logout: () => void
  hasAccess: (page: string) => boolean
  isAdmin: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (username: string, password: string): boolean => {
    const userRecord = USERS[username]

    if (userRecord && userRecord.password === password) {
      setUser(userRecord.user)
      localStorage.setItem("user", JSON.stringify(userRecord.user))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  const hasAccess = (page: string): boolean => {
    if (!user) return false
    return ROLE_ACCESS[user.role].includes(page)
  }

  const isAdmin = (): boolean => {
    return user?.role === "Admin"
  }

  return <AuthContext.Provider value={{ user, login, logout, hasAccess, isAdmin }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
