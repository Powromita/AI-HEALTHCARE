"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import toast from "react-hot-toast"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "doctor" | "patient"
  phone?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: { email: string; password: string }) => Promise<void>
  register: (userData: {
    name: string
    email: string
    phone: string
    password: string
    role: "admin" | "doctor" | "patient"
  }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users data
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@healthcare.ai",
    role: "admin",
    phone: "+1234567890",
  },
  {
    id: "2",
    name: "Dr. Sarah Wilson",
    email: "doctor@healthcare.ai",
    role: "doctor",
    phone: "+1234567891",
  },
  {
    id: "3",
    name: "John Patient",
    email: "patient@healthcare.ai",
    role: "patient",
    phone: "+1234567892",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("healthcare_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem("healthcare_user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication - check against demo credentials
    const foundUser = mockUsers.find((u) => u.email === credentials.email)

    if (foundUser && credentials.password === "password123") {
      setUser(foundUser)
      localStorage.setItem("healthcare_user", JSON.stringify(foundUser))
      toast.success(`Welcome back, ${foundUser.name}!`)
    } else {
      toast.error("Invalid email or password")
      throw new Error("Invalid credentials")
    }

    setLoading(false)
  }

  const register = async (userData: {
    name: string
    email: string
    phone: string
    password: string
    role: "admin" | "doctor" | "patient"
  }) => {
    setLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === userData.email)
    if (existingUser) {
      toast.error("User with this email already exists")
      throw new Error("User already exists")
    }

    // Create new user
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      phone: userData.phone,
    }

    mockUsers.push(newUser)
    setUser(newUser)
    localStorage.setItem("healthcare_user", JSON.stringify(newUser))
    toast.success(`Account created successfully! Welcome, ${newUser.name}!`)

    setLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("healthcare_user")
    toast.success("Logged out successfully")
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
