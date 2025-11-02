import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { 
  Stethoscope, 
  Users, 
  UserCheck, 
  Heart, 
  Shield, 
  Brain,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      // Redirect to appropriate dashboard
      navigate(`/${user.role}`)
    }
  }, [user, navigate])

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Diagnosis",
      description: "Advanced machine learning algorithms for accurate medical diagnosis and treatment recommendations."
    },
    {
      icon: Users,
      title: "Patient Management",
      description: "Comprehensive patient records, appointment scheduling, and health monitoring systems."
    },
    {
      icon: UserCheck,
      title: "Doctor Portal",
      description: "Streamlined workflow for doctors with patient management and treatment planning tools."
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "HIPAA-compliant platform with end-to-end encryption and secure data handling."
    }
  ]

  const stats = [
    { label: "Patients Served", value: "10,000+" },
    { label: "Doctors Onboard", value: "500+" },
    { label: "AI Accuracy", value: "95%" },
    { label: "Satisfaction Rate", value: "98%" }
  ]


  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="healthcare-gradient text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Stethoscope className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6">
              Healthcare AI System
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Revolutionizing healthcare with artificial intelligence, comprehensive patient management, 
              and seamless doctor-patient interactions.
            </p>
            <div className="flex justify-center space-x-4">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => navigate('/login')}
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => navigate('/register')}
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-card-foreground mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive healthcare AI system provides everything you need for modern medical practice.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 healthcare-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-card-foreground mb-4">
              Choose Your Role
            </h2>
            <p className="text-muted-foreground">
              Access tailored features based on your role in the healthcare system.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Admin */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 healthcare-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Administrator</CardTitle>
                <CardDescription>
                  Complete system management and oversight
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-left space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    Patient Management
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    Doctor Management
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    Treatment Scheduling
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    System Reports
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/login')}
                >
                  Access Admin Portal
                </Button>
              </CardContent>
            </Card>

            {/* Doctor */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 healthcare-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Doctor</CardTitle>
                <CardDescription>
                  Professional medical practice tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-left space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    Patient Records
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    Treatment Planning
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    Prescription Management
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    Schedule Management
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/login')}
                >
                  Access Doctor Portal
                </Button>
              </CardContent>
            </Card>

            {/* Patient */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 healthcare-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Patient</CardTitle>
                <CardDescription>
                  Personal health management and care
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-left space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    Appointment Booking
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    Health Records
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    AI Health Assistant
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-success mr-2" />
                    Prescription Tracking
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/login')}
                >
                  Access Patient Portal
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Stethoscope className="w-6 h-6" />
            <span className="text-xl font-bold">HealthAI</span>
          </div>
          <p className="text-white/80">
            © 2024 Healthcare AI System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage