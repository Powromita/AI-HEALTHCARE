"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Heart, Shield, Users, Calendar, Pill, Activity, UserCheck, Stethoscope, User } from "lucide-react"

// Main App Component - Single function handling all functionality
export default function HealthcareAISystem() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(null)
  const [userType, setUserType] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    phone: "",
    otp: "",
  })

  // Dashboard States
  const [activeTab, setActiveTab] = useState("overview")
  const [patients, setPatients] = useState([
    { id: 1, name: "John Doe", age: 45, condition: "Hypertension", status: "active", lastVisit: "2024-01-15" },
    { id: 2, name: "Jane Smith", age: 32, condition: "Diabetes", status: "pending", lastVisit: "2024-01-10" },
  ])
  const [doctors, setDoctors] = useState([
    { id: 1, name: "Dr. Sarah Wilson", specialty: "Cardiology", patients: 25, status: "active" },
    { id: 2, name: "Dr. Michael Chen", specialty: "Endocrinology", patients: 18, status: "active" },
  ])

  // Authentication Functions
  const handleLogin = (type) => {
    setCurrentUser({ name: "User", type })
    setUserType(type)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setUserType("")
    setLoginData({ email: "", password: "", phone: "", otp: "" })
  }

  // Render Authentication Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="healthcare-gradient p-3 rounded-2xl">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                HealthcareAI
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Advanced AI-powered healthcare management system for seamless patient care, treatment scheduling, and
              medical workflow optimization.
            </p>
          </div>

          {/* User Type Selection */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              {
                type: "admin",
                title: "Admin Portal",
                description: "Complete system management and oversight",
                icon: Shield,
                features: ["Patient Management", "Doctor Management", "Treatment Scheduling", "System Analytics"],
              },
              {
                type: "doctor",
                title: "Doctor Dashboard",
                description: "Patient care and treatment management",
                icon: Stethoscope,
                features: [
                  "Patient Information",
                  "Treatment Planning",
                  "Prescription Management",
                  "Schedule Management",
                ],
              },
              {
                type: "patient",
                title: "Patient Portal",
                description: "Personal health journey and care access",
                icon: User,
                features: ["Treatment Schedule", "Medicine Reminders", "Awareness Videos", "Health Tracking"],
              },
            ].map((portal) => (
              <Card
                key={portal.type}
                className="bg-card border-border hover:border-accent/50 transition-all duration-300 cursor-pointer group"
                onClick={() => handleLogin(portal.type)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-4 bg-muted rounded-2xl group-hover:bg-accent/10 transition-colors">
                    <portal.icon className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl text-card-foreground">{portal.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{portal.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {portal.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6 bg-primary hover:bg-primary-hover text-white">
                    Access {portal.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Login Demo */}
          <Card className="bg-muted/50 border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Demo Mode - Click any portal above to explore the system
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="status-indicator status-active" />
                    System Online
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Secure Access
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    AI Powered
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Admin Dashboard
  if (userType === "admin") {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="healthcare-gradient p-2 rounded-lg">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">Admin Dashboard</h1>
                  <p className="text-sm text-muted-foreground">System Management Portal</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="border-success text-success">
                  <div className="status-indicator status-active mr-2" />
                  System Online
                </Badge>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-muted">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="doctors">Doctors</TabsTrigger>
              <TabsTrigger value="treatments">Treatments</TabsTrigger>
              <TabsTrigger value="medicines">Medicines</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Total Patients", value: "1,247", change: "+12%", icon: Users, color: "text-blue-400" },
                  { title: "Active Doctors", value: "89", change: "+3%", icon: UserCheck, color: "text-green-400" },
                  {
                    title: "Scheduled Treatments",
                    value: "156",
                    change: "+8%",
                    icon: Calendar,
                    color: "text-purple-400",
                  },
                  { title: "Medicine Doses", value: "2,341", change: "+15%", icon: Pill, color: "text-orange-400" },
                ].map((stat, idx) => (
                  <Card key={idx} className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.title}</p>
                          <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                          <p className="text-sm text-success">{stat.change} from last month</p>
                        </div>
                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground">Recent Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { action: "New patient registered", time: "2 minutes ago", type: "success" },
                        { action: "Treatment scheduled", time: "15 minutes ago", type: "info" },
                        { action: "Doctor added to system", time: "1 hour ago", type: "success" },
                        { action: "Medicine dose updated", time: "2 hours ago", type: "warning" },
                      ].map((activity, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div
                            className={`status-indicator status-${activity.type === "success" ? "active" : activity.type === "warning" ? "pending" : "active"}`}
                          />
                          <div className="flex-1">
                            <p className="text-sm text-card-foreground">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground">System Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { metric: "Database Performance", value: "98%", status: "active" },
                        { metric: "API Response Time", value: "120ms", status: "active" },
                        { metric: "User Sessions", value: "234 active", status: "active" },
                        { metric: "Storage Usage", value: "67%", status: "pending" },
                      ].map((metric, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`status-indicator status-${metric.status}`} />
                            <span className="text-sm text-card-foreground">{metric.metric}</span>
                          </div>
                          <span className="text-sm font-medium text-card-foreground">{metric.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Patients Tab */}
            <TabsContent value="patients" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Patient Management</h2>
                <Button className="bg-primary hover:bg-primary-hover text-white">Add New Patient</Button>
              </div>

              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {patients.map((patient) => (
                      <div key={patient.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-card-foreground">{patient.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Age: {patient.age} • {patient.condition}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={patient.status === "active" ? "default" : "secondary"}>
                            {patient.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">Last visit: {patient.lastVisit}</span>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Doctors Tab */}
            <TabsContent value="doctors" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Doctor Management</h2>
                <Button className="bg-primary hover:bg-primary-hover text-white">Add New Doctor</Button>
              </div>

              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {doctors.map((doctor) => (
                      <div key={doctor.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                            <Stethoscope className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <h3 className="font-medium text-card-foreground">{doctor.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {doctor.specialty} • {doctor.patients} patients
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="default">{doctor.status}</Badge>
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Treatments Tab */}
            <TabsContent value="treatments" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Treatment Scheduling</h2>
                <Button className="bg-primary hover:bg-primary-hover text-white">Schedule Treatment</Button>
              </div>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Upcoming Treatments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        patient: "John Doe",
                        treatment: "Chemotherapy",
                        date: "2024-01-20",
                        time: "10:00 AM",
                        doctor: "Dr. Sarah Wilson",
                      },
                      {
                        patient: "Jane Smith",
                        treatment: "Follow-up Consultation",
                        date: "2024-01-21",
                        time: "2:00 PM",
                        doctor: "Dr. Michael Chen",
                      },
                      {
                        patient: "Bob Johnson",
                        treatment: "Radiotherapy",
                        date: "2024-01-22",
                        time: "9:00 AM",
                        doctor: "Dr. Sarah Wilson",
                      },
                    ].map((treatment, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-card-foreground">{treatment.patient}</h3>
                          <p className="text-sm text-muted-foreground">
                            {treatment.treatment} • {treatment.doctor}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-card-foreground">{treatment.date}</p>
                          <p className="text-sm text-muted-foreground">{treatment.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Medicines Tab */}
            <TabsContent value="medicines" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Medicine Dose Scheduling</h2>
                <Button className="bg-primary hover:bg-primary-hover text-white">Add Medicine Schedule</Button>
              </div>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Active Prescriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        patient: "John Doe",
                        medicine: "Metformin 500mg",
                        frequency: "2x daily",
                        nextDose: "6:00 PM today",
                      },
                      {
                        patient: "Jane Smith",
                        medicine: "Lisinopril 10mg",
                        frequency: "1x daily",
                        nextDose: "8:00 AM tomorrow",
                      },
                      {
                        patient: "Bob Johnson",
                        medicine: "Atorvastatin 20mg",
                        frequency: "1x daily",
                        nextDose: "10:00 PM today",
                      },
                    ].map((prescription, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                            <Pill className="h-5 w-5 text-orange-500" />
                          </div>
                          <div>
                            <h3 className="font-medium text-card-foreground">{prescription.patient}</h3>
                            <p className="text-sm text-muted-foreground">
                              {prescription.medicine} • {prescription.frequency}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-card-foreground">Next dose:</p>
                          <p className="text-sm text-muted-foreground">{prescription.nextDose}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  // Doctor Dashboard
  if (userType === "doctor") {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="healthcare-gradient p-2 rounded-lg">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">Doctor Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Patient Care Management</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="border-success text-success">
                  <div className="status-indicator status-active mr-2" />
                  On Duty
                </Badge>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-muted">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="patients">My Patients</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            </TabsList>

            {/* Doctor Overview */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Today's Patients", value: "8", icon: Users, color: "text-blue-400" },
                  { title: "Pending Treatments", value: "3", icon: Calendar, color: "text-orange-400" },
                  { title: "Active Prescriptions", value: "15", icon: Pill, color: "text-green-400" },
                ].map((stat, idx) => (
                  <Card key={idx} className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.title}</p>
                          <p className="text-3xl font-bold text-card-foreground">{stat.value}</p>
                        </div>
                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground">Today's Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { time: "9:00 AM", patient: "John Doe", type: "Consultation" },
                        { time: "10:30 AM", patient: "Jane Smith", type: "Follow-up" },
                        { time: "2:00 PM", patient: "Bob Johnson", type: "Treatment" },
                        { time: "3:30 PM", patient: "Alice Brown", type: "Check-up" },
                      ].map((appointment, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium text-card-foreground">{appointment.patient}</p>
                            <p className="text-sm text-muted-foreground">{appointment.type}</p>
                          </div>
                          <span className="text-sm font-medium text-accent">{appointment.time}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground">Recent Patient Updates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { patient: "John Doe", update: "Blood pressure improved", time: "2 hours ago" },
                        { patient: "Jane Smith", update: "Medication adherence: 95%", time: "4 hours ago" },
                        { patient: "Bob Johnson", update: "Treatment response positive", time: "1 day ago" },
                      ].map((update, idx) => (
                        <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-card-foreground">{update.patient}</span>
                            <span className="text-xs text-muted-foreground">{update.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{update.update}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Patient Management */}
            <TabsContent value="patients" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">My Patients</h2>
                <Button className="bg-primary hover:bg-primary-hover text-white">Add Patient</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patients.map((patient) => (
                  <Card
                    key={patient.id}
                    className="bg-card border-border hover:border-accent/50 transition-colors cursor-pointer"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-card-foreground">{patient.name}</h3>
                          <p className="text-sm text-muted-foreground">Age: {patient.age}</p>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Condition:</span>
                          <span className="text-sm text-card-foreground">{patient.condition}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Last Visit:</span>
                          <span className="text-sm text-card-foreground">{patient.lastVisit}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-primary hover:bg-primary-hover text-white">
                          Schedule Treatment
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          Prescribe
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Schedule Management */}
            <TabsContent value="schedule" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Schedule Management</h2>
                <Button className="bg-primary hover:bg-primary-hover text-white">Add Appointment</Button>
              </div>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Weekly Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-4">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
                      <div key={day} className="text-center">
                        <h3 className="font-medium text-card-foreground mb-2">{day}</h3>
                        <div className="space-y-2">
                          {idx < 5 && <div className="bg-primary/20 p-2 rounded text-xs text-primary">9:00 AM</div>}
                          {idx < 4 && <div className="bg-accent/20 p-2 rounded text-xs text-accent">2:00 PM</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Prescriptions */}
            <TabsContent value="prescriptions" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Prescription Management</h2>
                <Button className="bg-primary hover:bg-primary-hover text-white">New Prescription</Button>
              </div>

              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      {
                        patient: "John Doe",
                        medicine: "Metformin 500mg",
                        dosage: "2x daily with meals",
                        duration: "30 days",
                        status: "active",
                      },
                      {
                        patient: "Jane Smith",
                        medicine: "Lisinopril 10mg",
                        dosage: "1x daily morning",
                        duration: "90 days",
                        status: "active",
                      },
                      {
                        patient: "Bob Johnson",
                        medicine: "Atorvastatin 20mg",
                        dosage: "1x daily evening",
                        duration: "60 days",
                        status: "pending",
                      },
                    ].map((prescription, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                            <Pill className="h-5 w-5 text-orange-500" />
                          </div>
                          <div>
                            <h3 className="font-medium text-card-foreground">{prescription.patient}</h3>
                            <p className="text-sm text-muted-foreground">{prescription.medicine}</p>
                            <p className="text-xs text-muted-foreground">
                              {prescription.dosage} • {prescription.duration}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={prescription.status === "active" ? "default" : "secondary"}>
                            {prescription.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  // Patient Dashboard
  if (userType === "patient") {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="healthcare-gradient p-2 rounded-lg">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">Patient Portal</h1>
                  <p className="text-sm text-muted-foreground">Your Health Journey</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="border-success text-success">
                  <div className="status-indicator status-active mr-2" />
                  Treatment Active
                </Badge>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-muted">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="medicines">Medicines</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="motivation">Motivation</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>

            {/* Patient Dashboard */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Next Treatment",
                    value: "Jan 25, 2024",
                    subtitle: "Chemotherapy",
                    icon: Calendar,
                    color: "text-blue-400",
                  },
                  {
                    title: "Medicine Adherence",
                    value: "95%",
                    subtitle: "Excellent",
                    icon: Pill,
                    color: "text-green-400",
                  },
                  {
                    title: "Videos Watched",
                    value: "12",
                    subtitle: "This week",
                    icon: Activity,
                    color: "text-purple-400",
                  },
                ].map((stat, idx) => (
                  <Card key={idx} className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.title}</p>
                          <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                          <p className="text-sm text-muted-foreground">{stat.subtitle}</p>
                        </div>
                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground">Today's Reminders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { time: "8:00 AM", task: "Take Metformin 500mg", status: "completed" },
                        { time: "2:00 PM", task: "Take Lisinopril 10mg", status: "pending" },
                        { time: "6:00 PM", task: "Watch preparation video", status: "pending" },
                        { time: "9:00 PM", task: "Take evening medication", status: "pending" },
                      ].map((reminder, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div
                              className={`status-indicator status-${reminder.status === "completed" ? "active" : "pending"}`}
                            />
                            <div>
                              <p className="font-medium text-card-foreground">{reminder.task}</p>
                              <p className="text-sm text-muted-foreground">{reminder.time}</p>
                            </div>
                          </div>
                          {reminder.status === "pending" && (
                            <Button size="sm" variant="outline">
                              Mark Done
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground">Treatment Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Overall Progress</span>
                          <span className="text-sm font-medium text-card-foreground">65%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-success">8</p>
                          <p className="text-sm text-muted-foreground">Completed Sessions</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">4</p>
                          <p className="text-sm text-muted-foreground">Remaining Sessions</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Treatment Schedule */}
            <TabsContent value="schedule" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Treatment Schedule</h2>
                <Button variant="outline">Download Calendar</Button>
              </div>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Upcoming Treatments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        date: "January 25, 2024",
                        time: "10:00 AM",
                        type: "Chemotherapy Session 9",
                        location: "Oncology Department",
                        doctor: "Dr. Sarah Wilson",
                        preparation: "Fasting required 8 hours before",
                      },
                      {
                        date: "January 30, 2024",
                        time: "2:00 PM",
                        type: "Follow-up Consultation",
                        location: "Room 205",
                        doctor: "Dr. Sarah Wilson",
                        preparation: "Bring recent lab results",
                      },
                      {
                        date: "February 5, 2024",
                        time: "9:00 AM",
                        type: "Blood Test",
                        location: "Laboratory",
                        doctor: "Lab Technician",
                        preparation: "Fasting required 12 hours before",
                      },
                    ].map((appointment, idx) => (
                      <div key={idx} className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-card-foreground">{appointment.type}</h3>
                            <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                          </div>
                          <Badge variant="outline">{appointment.date}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Time: </span>
                            <span className="text-card-foreground">{appointment.time}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Location: </span>
                            <span className="text-card-foreground">{appointment.location}</span>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-warning/10 rounded border-l-4 border-warning">
                          <p className="text-sm text-card-foreground">
                            <strong>Preparation:</strong> {appointment.preparation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Medicine Reminders */}
            <TabsContent value="medicines" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Medicine Reminders</h2>
                <Button variant="outline">Set Reminder</Button>
              </div>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Daily Medicine Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        medicine: "Metformin 500mg",
                        times: ["8:00 AM", "8:00 PM"],
                        instructions: "Take with meals",
                        remaining: "25 tablets",
                        adherence: 95,
                      },
                      {
                        medicine: "Lisinopril 10mg",
                        times: ["8:00 AM"],
                        instructions: "Take on empty stomach",
                        remaining: "28 tablets",
                        adherence: 98,
                      },
                      {
                        medicine: "Vitamin D3 1000IU",
                        times: ["12:00 PM"],
                        instructions: "Take with food",
                        remaining: "45 tablets",
                        adherence: 87,
                      },
                    ].map((med, idx) => (
                      <div key={idx} className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-card-foreground">{med.medicine}</h3>
                            <p className="text-sm text-muted-foreground">{med.instructions}</p>
                          </div>
                          <Badge variant={med.adherence >= 90 ? "default" : "secondary"}>
                            {med.adherence}% adherence
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {med.times.map((time, timeIdx) => (
                              <span key={timeIdx} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">
                                {time}
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">{med.remaining} remaining</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Awareness Videos */}
            <TabsContent value="videos" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Awareness Videos</h2>
                <Button variant="outline">View All</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Preparing for Chemotherapy",
                    duration: "8:45",
                    category: "Treatment Preparation",
                    recommended: true,
                    description: "Learn what to expect during your upcoming chemotherapy session",
                  },
                  {
                    title: "Managing Side Effects",
                    duration: "12:30",
                    category: "Recovery Tips",
                    recommended: false,
                    description: "Practical tips for managing common treatment side effects",
                  },
                  {
                    title: "Nutrition During Treatment",
                    duration: "15:20",
                    category: "Lifestyle",
                    recommended: true,
                    description: "Maintaining proper nutrition throughout your treatment journey",
                  },
                  {
                    title: "Exercise and Recovery",
                    duration: "10:15",
                    category: "Physical Wellness",
                    recommended: false,
                    description: "Safe exercises to maintain strength during treatment",
                  },
                ].map((video, idx) => (
                  <Card
                    key={idx}
                    className="bg-card border-border hover:border-accent/50 transition-colors cursor-pointer"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-card-foreground mb-1">{video.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{video.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {video.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{video.duration}</span>
                          </div>
                        </div>
                        {video.recommended && <Badge className="bg-accent text-white">Recommended</Badge>}
                      </div>
                      <Button className="w-full bg-primary hover:bg-primary-hover text-white">Watch Video</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Motivational Content */}
            <TabsContent value="motivation" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Motivational Content</h2>
                <Button variant="outline">Share Story</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground">Daily Inspiration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
                        <p className="text-card-foreground font-medium mb-2">
                          "Every day is a new opportunity to heal and grow stronger."
                        </p>
                        <p className="text-sm text-muted-foreground">- Daily Motivation</p>
                      </div>
                      <Button className="w-full bg-accent hover:bg-accent-hover text-white">Get New Quote</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground">Success Stories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          name: "Sarah M.",
                          story: "Completed treatment successfully after 6 months",
                          time: "2 days ago",
                        },
                        { name: "John D.", story: "Celebrating 1 year cancer-free today!", time: "1 week ago" },
                        { name: "Maria L.", story: "Back to work and feeling stronger than ever", time: "2 weeks ago" },
                      ].map((story, idx) => (
                        <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-card-foreground">{story.name}</span>
                            <span className="text-xs text-muted-foreground">{story.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{story.story}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Chat/Communication */}
            <TabsContent value="chat" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Healthcare Communication</h2>
                <Button className="bg-primary hover:bg-primary-hover text-white">New Message</Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground">AI Health Assistant</CardTitle>
                    <CardDescription>Ask questions about your treatment, medications, or symptoms</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="h-64 bg-muted/50 rounded-lg p-4 overflow-y-auto">
                        <div className="space-y-3">
                          <div className="flex justify-start">
                            <div className="bg-primary/20 text-primary p-3 rounded-lg max-w-xs">
                              <p className="text-sm">
                                Hello! I'm here to help with any questions about your treatment. How are you feeling
                                today?
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <div className="bg-accent/20 text-accent p-3 rounded-lg max-w-xs">
                              <p className="text-sm">
                                I'm feeling a bit tired after yesterday's session. Is this normal?
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-start">
                            <div className="bg-primary/20 text-primary p-3 rounded-lg max-w-xs">
                              <p className="text-sm">
                                Yes, fatigue is a common side effect. Make sure to rest and stay hydrated. I'll notify
                                your care team.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Input placeholder="Type your message..." className="flex-1" />
                        <Button className="bg-primary hover:bg-primary-hover text-white">Send</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground">Care Team Messages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          from: "Dr. Sarah Wilson",
                          message: "Your latest lab results look good. Keep up the great work!",
                          time: "2 hours ago",
                          unread: true,
                        },
                        {
                          from: "Nurse Jennifer",
                          message: "Reminder: Please arrive 30 minutes early for your next appointment",
                          time: "1 day ago",
                          unread: false,
                        },
                        {
                          from: "Pharmacy",
                          message: "Your prescription is ready for pickup",
                          time: "2 days ago",
                          unread: false,
                        },
                      ].map((message, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg ${message.unread ? "bg-primary/10 border border-primary/20" : "bg-muted/50"}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-card-foreground">{message.from}</span>
                            <div className="flex items-center gap-2">
                              {message.unread && <div className="w-2 h-2 bg-primary rounded-full" />}
                              <span className="text-xs text-muted-foreground">{message.time}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{message.message}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  return null
}
