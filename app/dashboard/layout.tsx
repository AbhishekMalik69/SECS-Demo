"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Sidebar } from "@/components/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, hasAccess } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // If not logged in, redirect to login page
    if (!user) {
      router.push("/")
      return
    }

    // Check if user has access to the current page
    const currentPage = pathname.split("/").pop() || "dashboard"
    if (currentPage !== "dashboard" && !hasAccess(currentPage)) {
      router.push("/dashboard")
    }
  }, [user, pathname, router, hasAccess])

  if (!user) {
    return null // Don't render anything while redirecting
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
