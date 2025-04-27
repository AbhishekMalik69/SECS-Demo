"use client"

import type React from "react"

import { Eye, EyeOff, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate a slight delay for better UX
    setTimeout(() => {
      const success = login(formData.username, formData.password)

      if (success) {
        router.push("/dashboard")
      } else {
        setError("Invalid username or password")
        setIsLoading(false)
      }
    }, 800)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white p-6">
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

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Login</h2>
            <p className="text-gray-600 mt-2">Enter your credentials to access your account</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                className="w-full px-4 py-2 rounded-full border-2 border-black/20 focus:outline-none focus:border-black"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full px-4 py-2 rounded-full border-2 border-black/20 focus:outline-none focus:border-black"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-black text-white rounded-full hover:bg-black/90 transition-colors border-2 border-black flex items-center justify-center"
            >
              {isLoading ? <LoadingSpinner className="text-white" /> : "Login"}
            </button>
          </form>

          <div className="text-center">
            <button className="text-sm text-gray-600 hover:text-black transition-colors">Forget password</button>
          </div>
        </div>
      </div>
    </div>
  )
}
