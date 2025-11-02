import axios from "axios"
import Cookies from "js-cookie"
import toast from "react-hot-toast"

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const message = error.response?.data?.message || "An error occurred"

    // Handle authentication errors
    if (error.response?.status === 401) {
      Cookies.remove("auth_token")
      Cookies.remove("user_data")
      window.location.href = "/login"
      toast.error("Session expired. Please login again.")
      return Promise.reject(error)
    }

    // Handle other errors
    if (error.response?.status >= 400) {
      toast.error(message)
    }

    return Promise.reject(error)
  },
)

// Auth API functions
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post("/auth/login", credentials)
    return response.data
  },

  register: async (userData: {
    name: string
    email: string
    phone: string
    password: string
    role: "admin" | "doctor" | "patient"
    doctorProfile?: any
    patientProfile?: any
  }) => {
    const response = await api.post("/auth/register", userData)
    return response.data
  },

  getProfile: async () => {
    const response = await api.get("/auth/profile")
    return response.data
  },

  updateProfile: async (updates: any) => {
    const response = await api.put("/auth/profile", updates)
    return response.data
  },

  logout: async () => {
    const response = await api.post("/auth/logout")
    return response.data
  },
}

// Users API functions
export const usersAPI = {
  getAll: async (params?: { role?: string; page?: number; limit?: number; search?: string }) => {
    const response = await api.get("/users", { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  update: async (id: string, updates: any) => {
    const response = await api.put(`/users/${id}`, updates)
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },

  getStats: async () => {
    const response = await api.get("/users/stats/overview")
    return response.data
  },
}

// Patients API functions
export const patientsAPI = {
  getAll: async (params?: { page?: number; limit?: number; search?: string; status?: string }) => {
    const response = await api.get("/patients", { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/patients/${id}`)
    return response.data
  },

  create: async (patientData: any) => {
    const response = await api.post("/patients", patientData)
    return response.data
  },

  update: async (id: string, updates: any) => {
    const response = await api.put(`/patients/${id}`, updates)
    return response.data
  },

  addVitals: async (id: string, vitals: any) => {
    const response = await api.post(`/patients/${id}/vitals`, vitals)
    return response.data
  },
}

// Doctors API functions
export const doctorsAPI = {
  getAll: async (params?: { page?: number; limit?: number; search?: string; specialty?: string }) => {
    const response = await api.get("/doctors", { params })
    return response.data
  },

  getDashboardStats: async () => {
    const response = await api.get("/doctors/dashboard/stats")
    return response.data
  },

  getPatients: async (params?: { page?: number; limit?: number; status?: string }) => {
    const response = await api.get("/doctors/patients", { params })
    return response.data
  },
}

// Treatments API functions
export const treatmentsAPI = {
  getAll: async (params?: {
    page?: number
    limit?: number
    patientId?: string
    status?: string
    date?: string
  }) => {
    const response = await api.get("/treatments", { params })
    return response.data
  },

  create: async (treatmentData: any) => {
    const response = await api.post("/treatments", treatmentData)
    return response.data
  },

  update: async (id: string, updates: any) => {
    const response = await api.put(`/treatments/${id}`, updates)
    return response.data
  },

  getUpcoming: async () => {
    const response = await api.get("/treatments/upcoming")
    return response.data
  },
}

// Medicines API functions
export const medicinesAPI = {
  getAll: async (params?: {
    page?: number
    limit?: number
    patientId?: string
    status?: string
  }) => {
    const response = await api.get("/medicines", { params })
    return response.data
  },

  create: async (medicineData: any) => {
    const response = await api.post("/medicines", medicineData)
    return response.data
  },

  recordAdherence: async (id: string, adherenceData: any) => {
    const response = await api.post(`/medicines/${id}/adherence`, adherenceData)
    return response.data
  },

  getActive: async () => {
    const response = await api.get("/medicines/active")
    return response.data
  },
}

// Videos API functions
export const videosAPI = {
  getAll: async (params?: {
    category?: string
    treatmentType?: string
    difficulty?: string
    recommended?: boolean
    search?: string
  }) => {
    const response = await api.get("/videos", { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/videos/${id}`)
    return response.data
  },

  getRecommendations: async () => {
    const response = await api.get("/videos/recommendations/personalized")
    return response.data
  },

  recordProgress: async (id: string, progressData: any) => {
    const response = await api.post(`/videos/${id}/progress`, progressData)
    return response.data
  },

  getCategories: async () => {
    const response = await api.get("/videos/meta/categories")
    return response.data
  },
}

// Chat API functions
export const chatAPI = {
  sendToAI: async (message: string) => {
    const response = await api.post("/chat/ai-assistant", { message })
    return response.data
  },

  getHistory: async () => {
    const response = await api.get("/chat/history")
    return response.data
  },

  sendToCareTeam: async (messageData: {
    message: string
    priority?: "low" | "medium" | "high" | "urgent"
    category?: "general" | "symptoms" | "medication" | "appointment" | "emergency"
  }) => {
    const response = await api.post("/chat/care-team", messageData)
    return response.data
  },

  getCareTeamMessages: async () => {
    const response = await api.get("/chat/care-team/messages")
    return response.data
  },
}

export default api
