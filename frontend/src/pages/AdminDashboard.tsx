import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Pill, 
  FileText, 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

const AdminDashboard: React.FC = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const section = urlParams.get('section')
    if (section) {
      setActiveTab(section)
    }
  }, [location.search])

  // Mock data
  const stats = [
    { label: 'Total Patients', value: '1,247', change: '+12%', icon: Users, color: 'text-blue-600' },
    { label: 'Active Doctors', value: '45', change: '+3%', icon: UserCheck, color: 'text-green-600' },
    { label: 'Appointments Today', value: '89', change: '+8%', icon: Calendar, color: 'text-purple-600' },
    { label: 'Prescriptions', value: '156', change: '+15%', icon: Pill, color: 'text-orange-600' }
  ]

  const recentPatients = [
    { id: 1, name: 'John Smith', email: 'john@email.com', phone: '+1-234-567-8900', status: 'active', lastVisit: '2024-01-15' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1-234-567-8901', status: 'pending', lastVisit: '2024-01-14' },
    { id: 3, name: 'Mike Davis', email: 'mike@email.com', phone: '+1-234-567-8902', status: 'active', lastVisit: '2024-01-13' },
    { id: 4, name: 'Emily Brown', email: 'emily@email.com', phone: '+1-234-567-8903', status: 'inactive', lastVisit: '2024-01-10' }
  ]

  const doctors = [
    { id: 1, name: 'Dr. Sarah Wilson', specialty: 'Cardiology', patients: 45, status: 'active' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Neurology', patients: 38, status: 'active' },
    { id: 3, name: 'Dr. Lisa Rodriguez', specialty: 'Pediatrics', patients: 52, status: 'active' },
    { id: 4, name: 'Dr. James Thompson', specialty: 'Orthopedics', patients: 29, status: 'pending' }
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: 'default' as const, icon: CheckCircle, text: 'Active' },
      pending: { variant: 'secondary' as const, icon: AlertCircle, text: 'Pending' },
      inactive: { variant: 'outline' as const, icon: Activity, text: 'Inactive' }
    }
    const config = variants[status as keyof typeof variants] || variants.inactive
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    )
  }


  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>Latest patient registrations and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.slice(0, 4).map((patient) => (
                <div key={patient.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {patient.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">{patient.email}</p>
                    </div>
                  </div>
                  {getStatusBadge(patient.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Doctor Performance</CardTitle>
            <CardDescription>Top performing doctors this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {doctors.slice(0, 4).map((doctor) => (
                <div key={doctor.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {doctor.name.split(' ')[1].charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{doctor.name}</p>
                      <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-card-foreground">{doctor.patients}</p>
                    <p className="text-xs text-muted-foreground">patients</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderPatients = () => (
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
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
        <Button className="healthcare-gradient">
          <Plus className="w-4 h-4 mr-2" />
          Add Patient
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Management</CardTitle>
          <CardDescription>Manage all patient records and information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPatients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {patient.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">{patient.email}</p>
                    <p className="text-sm text-muted-foreground">{patient.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Last Visit</p>
                    <p className="text-sm font-medium text-card-foreground">{patient.lastVisit}</p>
                  </div>
                  {getStatusBadge(patient.status)}
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderDoctors = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-card-foreground">Doctor Management</h2>
        <Button className="healthcare-gradient">
          <Plus className="w-4 h-4 mr-2" />
          Add Doctor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <Card key={doctor.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-white">
                    {doctor.name.split(' ')[1].charAt(0)}
                  </span>
                </div>
                {getStatusBadge(doctor.status)}
              </div>
              <CardTitle className="text-lg">{doctor.name}</CardTitle>
              <CardDescription>{doctor.specialty}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Patients:</span>
                  <span className="text-sm font-medium text-card-foreground">{doctor.patients}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span className="text-sm font-medium text-card-foreground capitalize">{doctor.status}</span>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  View Profile
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Edit
                </Button>
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
          <h1 className="text-3xl font-bold text-card-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}. Here's what's happening today.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button className="healthcare-gradient">
            <Plus className="w-4 h-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>


      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'patients' && renderPatients()}
      {activeTab === 'doctors' && renderDoctors()}
      {activeTab === 'treatments' && (
        <Card>
          <CardHeader>
            <CardTitle>Treatment Management</CardTitle>
            <CardDescription>Schedule and manage treatments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Treatment management features coming soon...</p>
          </CardContent>
        </Card>
      )}
      {activeTab === 'medicines' && (
        <Card>
          <CardHeader>
            <CardTitle>Medicine Management</CardTitle>
            <CardDescription>Manage medicine inventory and prescriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Medicine management features coming soon...</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AdminDashboard