import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Calendar, 
  Pill, 
  FileText, 
  MessageSquare,
  Settings,
  LogOut,
  Stethoscope,
  Heart,
  Activity
} from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getNavigationItems = () => {
    if (!user) return []

    switch (user.role) {
      case 'admin':
        return [
          { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/admin', label: 'Patients', icon: Users, section: 'patients' },
          { path: '/admin', label: 'Doctors', icon: UserCheck, section: 'doctors' },
          { path: '/admin', label: 'Treatments', icon: Calendar, section: 'treatments' },
          { path: '/admin', label: 'Medicines', icon: Pill, section: 'medicines' },
          { path: '/admin', label: 'Reports', icon: FileText, section: 'reports' },
          { path: '/admin', label: 'Settings', icon: Settings, section: 'settings' },
        ]
      
      case 'doctor':
        return [
          { path: '/doctor', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/doctor', label: 'My Patients', icon: Users, section: 'patients' },
          { path: '/doctor', label: 'Schedule', icon: Calendar, section: 'schedule' },
          { path: '/doctor', label: 'Prescriptions', icon: Pill, section: 'prescriptions' },
          { path: '/doctor', label: 'Treatments', icon: Stethoscope, section: 'treatments' },
          { path: '/doctor', label: 'Reports', icon: FileText, section: 'reports' },
        ]
      
      case 'patient':
        return [
          { path: '/patient', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/patient', label: 'Appointments', icon: Calendar, section: 'appointments' },
          { path: '/patient', label: 'Prescriptions', icon: Pill, section: 'prescriptions' },
          { path: '/patient', label: 'Health Records', icon: FileText, section: 'health-records' },
          { path: '/patient', label: 'AI Health Assistant', icon: MessageSquare, section: 'ai-chat' },
          { path: '/patient', label: 'Vitals Tracking', icon: Activity, section: 'vitals' },
          { path: '/patient', label: 'Wellness Tips', icon: Heart, section: 'wellness' },
        ]
      
      default:
        return []
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 healthcare-gradient rounded-lg flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-card-foreground">HealthAI</h1>
            <p className="text-xs text-muted-foreground capitalize">{user?.role} Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item, index) => {
          const Icon = item.icon
          const isActive = item.section ? 
            (location.pathname === item.path && new URLSearchParams(location.search).get('section') === item.section) :
            (location.pathname === item.path && !new URLSearchParams(location.search).get('section'))
          
          const handleClick = () => {
            if (item.section) {
              navigate(`${item.path}?section=${item.section}`)
            } else {
              navigate(item.path)
            }
          }
          
          return (
            <Button
              key={`${item.path}-${index}`}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive && "bg-primary text-white hover:bg-primary/90"
              )}
              onClick={handleClick}
            >
              <Icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-card-foreground truncate">
              {user?.name}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role}
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}

export default Sidebar
