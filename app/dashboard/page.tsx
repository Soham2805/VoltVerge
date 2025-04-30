"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import UserDashboard from "@/components/user-dashboard"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return <UserDashboard />
}
