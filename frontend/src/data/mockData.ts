// Mock data for the healthcare system

export interface Patient {
  id: string
  patientId: string
  name: string
  email: string
  phone: string
  diagnosis: string
  status: "active" | "inactive" | "completed"
  doctorId: string
  treatmentPlan: {
    diagnosis: string
    status: "active" | "inactive" | "completed"
    startDate: string
    endDate?: string
  }
}

export interface Doctor {
  id: string
  name: string
  email: string
  specialty: string
  patientCount: number
  isActive: boolean
}

export interface Treatment {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  treatmentType: string
  scheduledDate: string
  scheduledTime: string
  status: "scheduled" | "completed" | "cancelled"
  location: {
    department: string
    room?: string
  }
  preparationInstructions: string[]
}

export interface Medicine {
  id: string
  patientId: string
  patientName: string
  medicineName: string
  dosage: {
    amount: string
    unit: string
  }
  frequency: {
    times: string[]
    interval: string
  }
  instructions: {
    specialInstructions: string
    withFood: boolean
  }
  status: "active" | "completed" | "paused"
  startDate: string
  endDate: string
}

export interface Video {
  id: string
  title: string
  description: string
  category: string
  duration: string
  url: string
  isRecommended: boolean
  treatmentType?: string
}

export interface ChatMessage {
  id: string
  sender: "user" | "ai" | "doctor"
  text: string
  timestamp: string
  read: boolean
}

// Mock Patients Data
export const mockPatients: Patient[] = [
  {
    id: "1",
    patientId: "P001",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1234567890",
    diagnosis: "Hypertension",
    status: "active",
    doctorId: "1",
    treatmentPlan: {
      diagnosis: "Hypertension",
      status: "active",
      startDate: "2024-01-01",
    },
  },
  {
    id: "2",
    patientId: "P002",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+1234567891",
    diagnosis: "Diabetes Type 2",
    status: "active",
    doctorId: "1",
    treatmentPlan: {
      diagnosis: "Diabetes Type 2",
      status: "active",
      startDate: "2024-01-15",
    },
  },
  {
    id: "3",
    patientId: "P003",
    name: "Bob Johnson",
    email: "bob.johnson@email.com",
    phone: "+1234567892",
    diagnosis: "Cardiac Rehabilitation",
    status: "active",
    doctorId: "2",
    treatmentPlan: {
      diagnosis: "Cardiac Rehabilitation",
      status: "active",
      startDate: "2024-01-10",
    },
  },
]

// Mock Doctors Data
export const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Wilson",
    email: "sarah.wilson@healthcare.ai",
    specialty: "Cardiology",
    patientCount: 15,
    isActive: true,
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    email: "michael.chen@healthcare.ai",
    specialty: "Endocrinology",
    patientCount: 12,
    isActive: true,
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@healthcare.ai",
    specialty: "Oncology",
    patientCount: 8,
    isActive: true,
  },
]

// Mock Treatments Data
export const mockTreatments: Treatment[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "John Doe",
    doctorId: "1",
    doctorName: "Dr. Sarah Wilson",
    treatmentType: "Chemotherapy",
    scheduledDate: "2024-01-20",
    scheduledTime: "10:00 AM",
    status: "scheduled",
    location: {
      department: "Oncology",
      room: "Room 201",
    },
    preparationInstructions: ["Fast for 8 hours before treatment", "Bring comfortable clothing"],
  },
  {
    id: "2",
    patientId: "2",
    patientName: "Jane Smith",
    doctorId: "2",
    doctorName: "Dr. Michael Chen",
    treatmentType: "Follow-up Consultation",
    scheduledDate: "2024-01-21",
    scheduledTime: "2:00 PM",
    status: "scheduled",
    location: {
      department: "Endocrinology",
      room: "Room 105",
    },
    preparationInstructions: ["Bring recent lab results", "List current medications"],
  },
  {
    id: "3",
    patientId: "3",
    patientName: "Bob Johnson",
    doctorId: "1",
    doctorName: "Dr. Sarah Wilson",
    treatmentType: "Radiotherapy",
    scheduledDate: "2024-01-22",
    scheduledTime: "9:00 AM",
    status: "scheduled",
    location: {
      department: "Radiology",
      room: "Room 301",
    },
    preparationInstructions: ["Remove all metal objects", "Arrive 30 minutes early"],
  },
]

// Mock Medicines Data
export const mockMedicines: Medicine[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "John Doe",
    medicineName: "Metformin 500mg",
    dosage: {
      amount: "500",
      unit: "mg",
    },
    frequency: {
      times: ["8:00 AM", "8:00 PM"],
      interval: "2x daily",
    },
    instructions: {
      specialInstructions: "Take with meals to reduce stomach upset",
      withFood: true,
    },
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-03-01",
  },
  {
    id: "2",
    patientId: "2",
    patientName: "Jane Smith",
    medicineName: "Lisinopril 10mg",
    dosage: {
      amount: "10",
      unit: "mg",
    },
    frequency: {
      times: ["8:00 AM"],
      interval: "1x daily",
    },
    instructions: {
      specialInstructions: "Take at the same time each day",
      withFood: false,
    },
    status: "active",
    startDate: "2024-01-15",
    endDate: "2024-04-15",
  },
  {
    id: "3",
    patientId: "3",
    patientName: "Bob Johnson",
    medicineName: "Atorvastatin 20mg",
    dosage: {
      amount: "20",
      unit: "mg",
    },
    frequency: {
      times: ["10:00 PM"],
      interval: "1x daily",
    },
    instructions: {
      specialInstructions: "Take in the evening for best effectiveness",
      withFood: false,
    },
    status: "active",
    startDate: "2024-01-10",
    endDate: "2024-07-10",
  },
]

// Mock Videos Data
export const mockVideos: Video[] = [
  {
    id: "1",
    title: "Understanding Chemotherapy",
    description: "Learn what to expect during chemotherapy treatment and how to prepare.",
    category: "Treatment Education",
    duration: "8:30",
    url: "#",
    isRecommended: true,
    treatmentType: "Chemotherapy",
  },
  {
    id: "2",
    title: "Managing Diabetes Through Diet",
    description: "Nutritional guidelines for managing Type 2 diabetes effectively.",
    category: "Lifestyle",
    duration: "12:15",
    url: "#",
    isRecommended: true,
    treatmentType: "Diabetes Management",
  },
  {
    id: "3",
    title: "Heart-Healthy Exercise Routines",
    description: "Safe exercises for cardiac rehabilitation patients.",
    category: "Exercise",
    duration: "15:45",
    url: "#",
    isRecommended: false,
    treatmentType: "Cardiac Rehabilitation",
  },
  {
    id: "4",
    title: "Meditation for Cancer Patients",
    description: "Mindfulness techniques to help cope with cancer treatment.",
    category: "Mental Health",
    duration: "10:20",
    url: "#",
    isRecommended: true,
    treatmentType: "Cancer Care",
  },
]

// Mock Chat Messages Data
export const mockChatMessages: ChatMessage[] = [
  {
    id: "1",
    sender: "ai",
    text: "Hello! I'm here to help with any questions about your treatment. How are you feeling today?",
    timestamp: "2024-01-19T09:00:00Z",
    read: true,
  },
  {
    id: "2",
    sender: "user",
    text: "I'm feeling a bit anxious about my upcoming chemotherapy session.",
    timestamp: "2024-01-19T09:05:00Z",
    read: true,
  },
  {
    id: "3",
    sender: "ai",
    text: "It's completely normal to feel anxious. Would you like me to share some information about what to expect during your treatment?",
    timestamp: "2024-01-19T09:06:00Z",
    read: true,
  },
]

// Mock Care Team Messages
export const mockCareTeamMessages: ChatMessage[] = [
  {
    id: "1",
    sender: "doctor",
    text: "Your latest lab results look good. Please continue with your current medication schedule.",
    timestamp: "2024-01-18T14:30:00Z",
    read: false,
  },
  {
    id: "2",
    sender: "doctor",
    text: "Reminder: Please fast for 8 hours before your treatment tomorrow.",
    timestamp: "2024-01-19T08:00:00Z",
    read: false,
  },
]

// Mock Dashboard Stats
export const mockDashboardStats = {
  admin: {
    totalPatients: mockPatients.length,
    totalDoctors: mockDoctors.length,
    scheduledTreatments: mockTreatments.filter((t) => t.status === "scheduled").length,
    activeMedicines: mockMedicines.filter((m) => m.status === "active").length,
  },
  doctor: {
    todayAppointments: 3,
    totalPatients: 15,
    activePatients: 12,
    recentPatients: mockPatients.slice(0, 3),
  },
  patient: {
    upcomingTreatments: mockTreatments.filter((t) => t.status === "scheduled").slice(0, 2),
    activeMedicines: mockMedicines.filter((m) => m.status === "active").slice(0, 3),
    videosWatched: 12,
  },
}
