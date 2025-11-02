import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { 
  Calendar, 
  Pill, 
  FileText, 
  MessageSquare,
  Heart,
  Activity,
  Clock,
  CheckCircle,
  Stethoscope,
  Plus,
  Send
} from 'lucide-react'

const PatientDashboard: React.FC = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [chatMessage, setChatMessage] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const section = urlParams.get('section')
    if (section) {
      setActiveTab(section)
    }
  }, [location.search])

  // Mock data
  const upcomingAppointments = [
    { id: 1, doctor: 'Dr. Sarah Wilson', specialty: 'Cardiology', date: '2024-01-22', time: '10:00 AM', type: 'Follow-up' },
    { id: 2, doctor: 'Dr. Michael Chen', specialty: 'Neurology', date: '2024-01-25', time: '2:00 PM', type: 'Consultation' },
    { id: 3, doctor: 'Dr. Lisa Rodriguez', specialty: 'Pediatrics', date: '2024-01-28', time: '11:30 AM', type: 'Check-up' }
  ]

  const prescriptions = [
    { id: 1, medicine: 'Lisinopril 10mg', dosage: 'Once daily', startDate: '2024-01-01', endDate: '2024-04-01', status: 'active' },
    { id: 2, medicine: 'Metformin 500mg', dosage: 'Twice daily', startDate: '2024-01-05', endDate: '2024-07-05', status: 'active' },
    { id: 3, medicine: 'Atorvastatin 20mg', dosage: 'Once daily', startDate: '2024-01-10', endDate: '2024-04-10', status: 'active' }
  ]

  const healthRecords = [
    { id: 1, date: '2024-01-15', type: 'Blood Pressure', value: '120/80 mmHg', status: 'normal' },
    { id: 2, date: '2024-01-15', type: 'Blood Sugar', value: '95 mg/dL', status: 'normal' },
    { id: 3, date: '2024-01-15', type: 'Heart Rate', value: '72 bpm', status: 'normal' },
    { id: 4, date: '2024-01-10', type: 'Weight', value: '75 kg', status: 'stable' }
  ]

  const aiChatHistory = [
    { id: 1, type: 'user', message: 'I have been feeling tired lately. What could be the cause?', timestamp: '2024-01-20 10:30' },
    { id: 2, type: 'ai', message: 'Fatigue can have many causes. Based on your medical history, it could be related to your blood pressure medication or sleep patterns. I recommend discussing this with Dr. Wilson at your next appointment.', timestamp: '2024-01-20 10:31' },
    { id: 3, type: 'user', message: 'Should I be concerned about my blood pressure readings?', timestamp: '2024-01-20 10:35' },
    { id: 4, type: 'ai', message: 'Your recent readings of 120/80 mmHg are within normal range. Continue taking your medication as prescribed and maintain regular monitoring.', timestamp: '2024-01-20 10:36' }
  ]

  const wellnessTips = [
    { id: 1, title: 'Daily Exercise', description: 'Aim for 30 minutes of moderate exercise daily', category: 'Fitness' },
    { id: 2, title: 'Balanced Diet', description: 'Include fruits, vegetables, and whole grains in your meals', category: 'Nutrition' },
    { id: 3, title: 'Adequate Sleep', description: 'Get 7-9 hours of quality sleep each night', category: 'Sleep' },
    { id: 4, title: 'Stress Management', description: 'Practice meditation or deep breathing exercises', category: 'Mental Health' }
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: 'default' as const, icon: CheckCircle, text: 'Active', color: 'text-green-600' },
      normal: { variant: 'default' as const, icon: CheckCircle, text: 'Normal', color: 'text-green-600' },
      stable: { variant: 'secondary' as const, icon: Activity, text: 'Stable', color: 'text-blue-600' },
      upcoming: { variant: 'secondary' as const, icon: Clock, text: 'Upcoming', color: 'text-blue-600' },
      completed: { variant: 'outline' as const, icon: CheckCircle, text: 'Completed', color: 'text-gray-600' }
    }
    const config = variants[status as keyof typeof variants] || variants.upcoming
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    )
  }

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // In a real app, this would send to AI service
      console.log('Sending message:', chatMessage)
      setChatMessage('')
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">3</div>
            <p className="text-xs text-muted-foreground">Next: Jan 22, 2024</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Prescriptions</CardTitle>
            <Pill className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">3</div>
            <p className="text-xs text-muted-foreground">All up to date</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Health Score</CardTitle>
            <Heart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">85%</div>
            <p className="text-xs text-muted-foreground">Good health status</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">AI Consultations</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">12</div>
            <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>
            </div>

      {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
                <CardHeader>
            <CardTitle>Recent Health Records</CardTitle>
            <CardDescription>Your latest health measurements</CardDescription>
                </CardHeader>
                <CardContent>
            <div className="space-y-4">
              {healthRecords.slice(0, 4).map((record) => (
                <div key={record.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                          <div>
                      <p className="text-sm font-medium text-card-foreground">{record.type}</p>
                      <p className="text-xs text-muted-foreground">{record.date}</p>
                          </div>
                        </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-card-foreground">{record.value}</p>
                    {getStatusBadge(record.status)}
                  </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

        <Card>
                <CardHeader>
            <CardTitle>Wellness Tips</CardTitle>
            <CardDescription>Personalized health recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
              {wellnessTips.slice(0, 4).map((tip) => (
                <div key={tip.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-card-foreground">{tip.title}</h4>
                    <Badge variant="outline">{tip.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </div>
              ))}
                  </div>
                </CardContent>
              </Card>
            </div>
    </div>
  )

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-card-foreground">Appointments</h2>
        <Button className="healthcare-gradient">
          <Plus className="w-4 h-4 mr-2" />
          Book Appointment
              </Button>
            </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingAppointments.map((appointment) => (
          <Card key={appointment.id}>
              <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                {getStatusBadge('upcoming')}
              </div>
              <CardTitle className="text-lg">{appointment.doctor}</CardTitle>
              <CardDescription>{appointment.specialty}</CardDescription>
              </CardHeader>
              <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Date:</span>
                  <span className="text-sm font-medium text-card-foreground">{appointment.date}</span>
                        </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Time:</span>
                  <span className="text-sm font-medium text-card-foreground">{appointment.time}</span>
                      </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <span className="text-sm font-medium text-card-foreground">{appointment.type}</span>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  Reschedule
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Cancel
                </Button>
                </div>
              </CardContent>
            </Card>
        ))}
      </div>
    </div>
  )

  const renderPrescriptions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-card-foreground">Prescriptions</h2>
        <Button variant="outline">
          <FileText className="w-4 h-4 mr-2" />
          Download Report
        </Button>
            </div>

                <div className="space-y-4">
        {prescriptions.map((prescription) => (
          <Card key={prescription.id}>
            <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    <Pill className="w-6 h-6 text-white" />
                        </div>
                  <div>
                    <h3 className="font-medium text-card-foreground">{prescription.medicine}</h3>
                    <p className="text-sm text-muted-foreground">Dosage: {prescription.dosage}</p>
                    <p className="text-sm text-muted-foreground">
                      {prescription.startDate} - {prescription.endDate}
                    </p>
                      </div>
                    </div>
                <div className="flex items-center space-x-4">
                  {getStatusBadge(prescription.status)}
                  <Button variant="outline" size="sm">
                    Refill
                  </Button>
                </div>
                </div>
              </CardContent>
            </Card>
        ))}
      </div>
    </div>
  )

  const renderHealthRecords = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-card-foreground">Health Records</h2>
        <Button className="healthcare-gradient">
          <Plus className="w-4 h-4 mr-2" />
          Add Record
        </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {healthRecords.map((record) => (
          <Card key={record.id}>
                  <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-card-foreground">{record.type}</h3>
                    <p className="text-sm text-muted-foreground">{record.date}</p>
                        </div>
                      </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-card-foreground">{record.value}</p>
                  {getStatusBadge(record.status)}
                </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            </div>
  )

  const renderAIChat = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-card-foreground">AI Health Assistant</h2>
          <p className="text-muted-foreground">Get instant health advice and support</p>
                    </div>
        <Badge variant="default" className="flex items-center gap-1">
          <MessageSquare className="w-3 h-3" />
          Online
        </Badge>
                  </div>

      <Card className="h-96">
                <CardHeader>
          <CardTitle>Chat with AI Assistant</CardTitle>
          <CardDescription>Ask questions about your health, medications, or symptoms</CardDescription>
                </CardHeader>
        <CardContent className="flex flex-col h-full">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {aiChatHistory.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-muted text-card-foreground'
                }`}>
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>

          {/* Chat Input */}
          <div className="flex space-x-2">
            <Input
              placeholder="Ask about your health..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} className="healthcare-gradient">
              <Send className="w-4 h-4" />
            </Button>
          </div>
                </CardContent>
              </Card>
            </div>
  )

  const renderVitals = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-card-foreground">Vitals Tracking</h2>
        <Button className="healthcare-gradient">
          <Plus className="w-4 h-4 mr-2" />
          Log Vitals
        </Button>
            </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {healthRecords.map((record) => (
          <Card key={record.id}>
                <CardHeader>
              <CardTitle className="text-lg">{record.type}</CardTitle>
              <CardDescription>Latest reading</CardDescription>
                </CardHeader>
                <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-card-foreground mb-2">{record.value}</div>
                {getStatusBadge(record.status)}
                <p className="text-sm text-muted-foreground mt-2">{record.date}</p>
                            </div>
            </CardContent>
          </Card>
                        ))}
                      </div>
                    </div>
  )


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">Patient Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}. Manage your health and appointments.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Download Records
          </Button>
          <Button className="healthcare-gradient">
            <Plus className="w-4 h-4 mr-2" />
            Book Appointment
                      </Button>
                    </div>
                  </div>


      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'appointments' && renderAppointments()}
      {activeTab === 'prescriptions' && renderPrescriptions()}
      {activeTab === 'health-records' && renderHealthRecords()}
      {activeTab === 'ai-chat' && renderAIChat()}
      {activeTab === 'vitals' && renderVitals()}

      {/* Wellness Tips Section */}
      <Card>
                <CardHeader>
          <CardTitle>Personalized Wellness Tips</CardTitle>
          <CardDescription>Based on your health profile and current medications</CardDescription>
                </CardHeader>
                <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {wellnessTips.map((tip) => (
              <div key={tip.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-card-foreground">{tip.title}</h4>
                  <Badge variant="outline" className="text-xs">{tip.category}</Badge>
                          </div>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
    </div>
  )
}

export default PatientDashboard