"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Shield, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function UnauthorizedPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleGoBack = () => {
    if (user) {
      // Redirect to appropriate dashboard based on role
      switch (user.role) {
        case "admin":
          navigate("/admin")
          break
        case "doctor":
          navigate("/doctor")
          break
        case "patient":
          navigate("/patient")
          break
        default:
          navigate("/")
      }
    } else {
      navigate("/")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="bg-card border-border max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-destructive/10 rounded-full w-fit">
            <Shield className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-xl text-card-foreground">Access Denied</CardTitle>
          <CardDescription className="text-muted-foreground">
            You don't have permission to access this page. Please contact your administrator if you believe this is an
            error.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Current Role:{" "}
              <span className="font-medium text-card-foreground capitalize">{user?.role || "Unknown"}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              User: <span className="font-medium text-card-foreground">{user?.name || "Unknown"}</span>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={handleGoBack} className="w-full bg-primary hover:bg-primary-hover text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
            <Button onClick={logout} variant="outline" className="w-full bg-transparent">
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
