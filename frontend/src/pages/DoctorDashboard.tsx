import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { 
  Users, 
  Calendar, 
  Pill, 
  Plus,
  Search,
  Clock,
  Activity,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  TrendingUp
} from 'lucide-react'

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [activeTab, setActiveTab] = useState('patients')

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const section = urlParams.get('section')
    if (section) {
      setActiveTab(section)
    }
  }, [location.search])

  // Mock data
  const todaySchedule = [
    { time: '09:00', patient: 'John Smith', type: 'Follow-up', status: 'completed' },
    { time: '10:30', patient: 'Sarah Johnson', type: 'Consultation', status: 'upcoming' },
    { time: '14:00', patient: 'Mike Davis', type: 'Check-up', status: 'upcoming' },
    { time: '15:30', patient: 'Emily Brown', type: 'Follow-up', status: 'pending' }
  ]

  const myPatients = [
    { 
      id: 1, 
      name: 'John Smith', 
      age: 45, 
      condition: 'Hypertension', 
      lastVisit: '2024-01-15',
      nextAppointment: '2024-01-22',
      status: 'stable',
      notes: 'Blood pressure under control with medication'
    },
    { 
      id: 2, 
      name: 'Sarah Johnson', 
      age: 32, 
      condition: 'Diabetes Type 2', 
      lastVisit: '2024-01-14',
      nextAppointment: '2024-01-28',
      status: 'improving',
      notes: 'Blood sugar levels improving with diet changes'
    },
    { 
      id: 3, 
      name: 'Mike Davis', 
      age: 58, 
      condition: 'Heart Disease', 
      lastVisit: '2024-01-13',
      nextAppointment: '2024-01-20',
      status: 'monitoring',
      notes: 'Post-surgery recovery progressing well'
    },
    { 
      id: 4, 
      name: 'Emily Brown', 
      age: 28, 
      condition: 'Asthma', 
      lastVisit: '2024-01-10',
      nextAppointment: '2024-01-25',
      status: 'stable',
      notes: 'Inhaler usage reduced, symptoms controlled'
    }
  ]

  const prescriptions = [
    { id: 1, patient: 'John Smith', medicine: 'Lisinopril 10mg', dosage: 'Once daily', status: 'active' },
    { id: 2, patient: 'Sarah Johnson', medicine: 'Metformin 500mg', dosage: 'Twice daily', status: 'active' },
    { id: 3, patient: 'Mike Davis', medicine: 'Atorvastatin 20mg', dosage: 'Once daily', status: 'active' },
    { id: 4, patient: 'Emily Brown', medicine: 'Albuterol Inhaler', dosage: 'As needed', status: 'active' }
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      stable: { variant: 'default' as const, icon: CheckCircle, text: 'Stable', color: 'text-green-600' },
      improving: { variant: 'secondary' as const, icon: TrendingUp, text: 'Improving', color: 'text-blue-600' },
      monitoring: { variant: 'outline' as const, icon: Activity, text: 'Monitoring', color: 'text-orange-600' },
      completed: { variant: 'default' as const, icon: CheckCircle, text: 'Completed', color: 'text-green-600' },
      upcoming: { variant: 'secondary' as const, icon: Clock, text: 'Upcoming', color: 'text-blue-600' },
      pending: { variant: 'outline' as const, icon: AlertCircle, text: 'Pending', color: 'text-orange-600' },
      active: { variant: 'default' as const, icon: CheckCircle, text: 'Active', color: 'text-green-600' }
    }
    const config = variants[status as keyof typeof variants] || variants.pending
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    )
  }

  const PatientCard = ({ patient }: { patient: any }) => (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedPatient(patient)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {patient.name.charAt(0)}
              </span>
            </div>
            <div>
              <CardTitle className="text-lg">{patient.name}</CardTitle>
              <CardDescription>Age: {patient.age} • {patient.condition}</CardDescription>
            </div>
          </div>
          {getStatusBadge(patient.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last Visit:</span>
            <span className="text-card-foreground">{patient.lastVisit}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Next Appointment:</span>
            <span className="text-card-foreground">{patient.nextAppointment}</span>
          </div>
          <div className="mt-3 p-2 bg-muted rounded text-sm">
            <span className="text-muted-foreground">Notes: </span>
            <span className="text-card-foreground">{patient.notes}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const PatientDetailModal = ({ patient }: { patient: any }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-white">
                  {patient.name.charAt(0)}
                </span>
              </div>
              <div>
                <CardTitle className="text-xl">{patient.name}</CardTitle>
                <CardDescription>Age: {patient.age} • {patient.condition}</CardDescription>
              </div>
            </div>
            <Button variant="ghost" onClick={() => setSelectedPatient(null)}>
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-card-foreground mb-2">Schedule Treatment</h4>
              <Button className="w-full healthcare-gradient">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Appointment
              </Button>
            </div>
            <div>
              <h4 className="font-medium text-card-foreground mb-2">Prescribe Medicine</h4>
              <Button className="w-full healthcare-gradient">
                <Pill className="w-4 h-4 mr-2" />
                Add Prescription
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-card-foreground mb-2">Treatment History</h4>
            <div className="space-y-2">
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Follow-up Consultation</span>
                  <span className="text-sm text-muted-foreground">2024-01-15</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Blood pressure check and medication review</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Initial Consultation</span>
                  <span className="text-sm text-muted-foreground">2024-01-01</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">First visit and diagnosis</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-card-foreground mb-2">Current Prescriptions</h4>
            <div className="space-y-2">
              {prescriptions.filter(p => p.patient === patient.name).map((prescription) => (
                <div key={prescription.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{prescription.medicine}</span>
                    {getStatusBadge(prescription.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Dosage: {prescription.dosage}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">Doctor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Dr. {user?.name}. Manage your patients and schedule.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages
          </Button>
          <Button className="healthcare-gradient">
            <Plus className="w-4 h-4 mr-2" />
            New Patient
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">4</div>
            <p className="text-xs text-muted-foreground">2 completed, 2 upcoming</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">24</div>
            <p className="text-xs text-muted-foreground">Active patients</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Prescriptions</CardTitle>
            <Pill className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">18</div>
            <p className="text-xs text-muted-foreground">Active prescriptions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Tasks</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">3</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>


      {/* Content */}
      {activeTab === 'patients' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
            <Button className="healthcare-gradient">
              <Plus className="w-4 h-4 mr-2" />
              Add New Patient
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myPatients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Your appointments for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaySchedule.map((appointment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">{appointment.time}</p>
                        <p className="text-sm text-muted-foreground">{appointment.patient}</p>
                        <p className="text-sm text-muted-foreground">{appointment.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(appointment.status)}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'prescriptions' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Prescriptions</CardTitle>
              <CardDescription>Manage patient prescriptions and medications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <div key={prescription.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                        <Pill className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">{prescription.medicine}</p>
                        <p className="text-sm text-muted-foreground">{prescription.patient}</p>
                        <p className="text-sm text-muted-foreground">Dosage: {prescription.dosage}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(prescription.status)}
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Medical Reports</CardTitle>
              <CardDescription>Generate and view patient reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Report generation features coming soon...</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Patient Detail Modal */}
      {selectedPatient && <PatientDetailModal patient={selectedPatient} />}
    </div>
  )
}

export default DoctorDashboard