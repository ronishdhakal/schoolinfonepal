"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { getAuthToken } from "../../utils/api"
import DashboardLayout from "../../components/dashboard/DashboardLayout"
import ProfileTabs from "../../components/dashboard/ProfileTabs"

export default function SchoolDashboard() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.push("/login")
      return
    }

    // Verify token and get user info
    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    if (userData.role !== "school") {
      router.push("/login")
      return
    }

    setUser(userData)
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">School Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your school profile and inquiries</p>
        </div>
        <ProfileTabs />
      </div>
    </DashboardLayout>
  )
}
