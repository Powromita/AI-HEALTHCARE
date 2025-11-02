import Cookies from "js-cookie"
import { authAPI } from "./api"

export interface User {
  _id: string
  name: string
  email: string
  phone: string
  role: "admin" | "doctor" | "patient"
  isActive: boolean
  profileImage?: string
  doctorProfile?: {
    specialty: string
    licenseNumber: string
    experience: number
    department: string
    qualifications: string[]
    availableHours: {
      start: string
      end: string
    }
  }
  patientProfile?: {
    dateOfBirth: Date
    gender: "male" | "female" | "other"
    bloodGroup: string
    emergencyContact: {
      name: string
      phone: string
      relationship: string
    }
    medicalHistory: string[]
    allergies: string[]
    currentConditions: string[]
  }
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: User
    token: string
  }
}

// Auth utility functions
export const auth = {
  // Login user
  login: async (credentials: { email: string; password: string }): Promise<User> => {
    try {
      const response: AuthResponse = await authAPI.login(credentials)

      if (response.success) {
        // Store token and user data
        Cookies.set("auth_token", response.data.token, { expires: 7 }) // 7 days
        Cookies.set("user_data", JSON.stringify(response.data.user), { expires: 7 })

        return response.data.user
      } else {
        throw new Error(response.message)
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed")
    }
  },

  // Register user
  register: async (userData: {
    name: string
    email: string
    phone: string
    password: string
    role: "admin" | "doctor" | "patient"
    doctorProfile?: any
    patientProfile?: any
  }): Promise<User> => {
    try {
      const response: AuthResponse = await authAPI.register(userData)

      if (response.success) {
        // Store token and user data
        Cookies.set("auth_token", response.data.token, { expires: 7 })
        Cookies.set("user_data", JSON.stringify(response.data.user), { expires: 7 })

        return response.data.user
      } else {
        throw new Error(response.message)
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed")
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await authAPI.logout()
    } catch (error) {
      // Continue with logout even if API call fails
      console.error("Logout API error:", error)
    } finally {
      // Always clear local storage
      Cookies.remove("auth_token")
      Cookies.remove("user_data")
      window.location.href = "/"
    }
  },

  // Get current user from cookies
  getCurrentUser: (): User | null => {
    try {
      const userData = Cookies.get("user_data")
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error("Error parsing user data:", error)
      return null
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = Cookies.get("auth_token")
    const user = auth.getCurrentUser()
    return !!(token && user)
  },

  // Get auth token
  getToken: (): string | null => {
    return Cookies.get("auth_token") || null
  },

  // Update user data in cookies
  updateUserData: (user: User): void => {
    Cookies.set("user_data", JSON.stringify(user), { expires: 7 })
  },

  // Check user role
  hasRole: (role: string | string[]): boolean => {
    const user = auth.getCurrentUser()
    if (!user) return false

    if (Array.isArray(role)) {
      return role.includes(user.role)
    }

    return user.role === role
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    return auth.hasRole("admin")
  },

  // Check if user is doctor
  isDoctor: (): boolean => {
    return auth.hasRole("doctor")
  },

  // Check if user is patient
  isPatient: (): boolean => {
    return auth.hasRole("patient")
  },
}

export default auth
