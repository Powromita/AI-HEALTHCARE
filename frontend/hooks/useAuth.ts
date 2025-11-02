"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import auth, { type User } from "@/lib/auth"
import toast from "react-hot-toast"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUser = auth.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true)
      const user = await auth.login(credentials)
      setUser(user)
      toast.success("Login successful!")

      // Redirect based on role
      switch (user.role) {
        case "admin":
          router.push("/admin")
          break
        case "doctor":
          router.push("/doctor")
          break
        case "patient":
          router.push("/patient")
          break
        default:
          router.push("/")
      }
    } catch (error: any) {
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: {
    name: string
    email: string
    phone: string
    password: string
    role: "admin" | "doctor" | "patient"
    doctorProfile?: any
    patientProfile?: any
  }) => {
    try {
      setLoading(true)
      const user = await auth.register(userData)
      setUser(user)
      toast.success("Registration successful!")

      // Redirect based on role
      switch (user.role) {
        case "admin":
          router.push("/admin")
          break
        case "doctor":
          router.push("/doctor")
          break
        case "patient":
          router.push("/patient")
          break
        default:
          router.push("/")
      }
    } catch (error: any) {
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await auth.logout()
      setUser(null)
      toast.success("Logged out successfully")
    } catch (error: any) {
      toast.error("Logout failed")
    }
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    auth.updateUserData(updatedUser)
  }

  return {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isDoctor: user?.role === "doctor",
    isPatient: user?.role === "patient",
  }
}
