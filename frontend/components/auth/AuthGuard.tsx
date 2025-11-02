"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import auth, { type User } from "@/lib/auth"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: string | string[]
  redirectTo?: string
}

export default function AuthGuard({ children, requiredRole, redirectTo = "/" }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = auth.getCurrentUser()
      const isAuthenticated = auth.isAuthenticated()

      if (!isAuthenticated) {
        router.push("/login")
        return
      }

      if (requiredRole && !auth.hasRole(requiredRole)) {
        router.push("/unauthorized")
        return
      }

      setUser(currentUser)
      setLoading(false)
    }

    checkAuth()
  }, [router, requiredRole])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
