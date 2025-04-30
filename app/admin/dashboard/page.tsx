"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import AdminDashboard from "@/components/admin-dashboard"

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/")
    } else if (user.role !== "admin") {
      router.push("/dashboard")
    }
  }, [user, router])

  if (!user || user.role !== "admin") {
    return null
  }

  return <AdminDashboard />
}
