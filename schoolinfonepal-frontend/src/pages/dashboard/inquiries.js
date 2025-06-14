"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { getAuthToken, fetchSchoolInquiries, fetchSchoolOwnProfile } from "../../utils/api"
import DashboardLayout from "../../components/dashboard/DashboardLayout"
import InquiryAnalytics from "../../components/dashboard/inquiries/InquiryAnalytics"
import InquiryFilters from "../../components/dashboard/inquiries/InquiryFilters"
import InquiryTable from "../../components/dashboard/inquiries/InquiryTable"
import InquiryActions from "../../components/dashboard/inquiries/InquiryActions"

export default function InquiriesPage() {
  const [loading, setLoading] = useState(true)
  const [school, setSchool] = useState(null)
  const [inquiries, setInquiries] = useState([])
  const [preRegistrations, setPreRegistrations] = useState([])
  const [activeTab, setActiveTab] = useState("inquiries")
  const [filters, setFilters] = useState({
    search: "",
    contacted: "",
    start_date: "",
    end_date: "",
  })
  const [appliedFilters, setAppliedFilters] = useState({})
  const router = useRouter()

  // Check verification status first
  useEffect(() => {
    const checkVerification = async () => {
      try {
        const token = getAuthToken()
        if (!token) {
          router.push("/login")
          return
        }

        const schoolData = await fetchSchoolOwnProfile()
        setSchool(schoolData)

        if (!schoolData?.verification) {
          // Redirect to dashboard if not verified
          router.push("/dashboard")
          return
        }
      } catch (error) {
        console.error("Error checking verification:", error)
        router.push("/dashboard")
      }
    }

    checkVerification()
  }, [router])

  // Use useCallback to prevent unnecessary re-renders
  const loadInquiries = useCallback(async () => {
    if (!school?.verification) return

    try {
      setLoading(true)
      console.log("Fetching inquiries with filters:", appliedFilters)
      const data = await fetchSchoolInquiries(appliedFilters)
      console.log("Received inquiries data:", data)

      // Debug the data structure
      if (data.pre_registrations) {
        console.log("Pre-registration sample:", data.pre_registrations[0])
      }

      setInquiries(data.inquiries || [])
      setPreRegistrations(data.pre_registrations || [])
    } catch (error) {
      console.error("Error loading inquiries:", error)
    } finally {
      setLoading(false)
    }
  }, [appliedFilters, school?.verification])

  useEffect(() => {
    if (school?.verification) {
      loadInquiries()
    }
  }, [loadInquiries, school?.verification])

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters })
  }

  const handleResetFilters = () => {
    setFilters({
      search: "",
      contacted: "",
      start_date: "",
      end_date: "",
    })
    setAppliedFilters({})
  }

  // Show loading while checking verification
  if (!school) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  // Show verification required message
  if (!school.verification) {
    return (
      <DashboardLayout>
        <Head>
          <title>Verification Required | School Dashboard</title>
        </Head>
        <div className="p-6">
          <div className="max-w-md mx-auto mt-20">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Verification Required</h3>
              <p className="text-sm text-gray-500 mb-6">
                Your school profile needs to be verified before you can access inquiries. Please complete your profile
                and wait for admin approval.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => router.push("/dashboard/profile")}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Complete Profile
                </button>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Inquiries | School Dashboard</title>
      </Head>
      <div className="p-6">
        <InquiryActions filters={appliedFilters} activeTab={activeTab} />

        {/* Analytics Dashboard */}
        <InquiryAnalytics />

        {/* Filters */}
        <InquiryFilters
          filters={filters}
          setFilters={setFilters}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("inquiries")}
                className={`${
                  activeTab === "inquiries"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <span>📧</span>
                <span>General Inquiries ({inquiries.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("preregistrations")}
                className={`${
                  activeTab === "preregistrations"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <span>📝</span>
                <span>Pre-Registrations ({preRegistrations.length})</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Tables */}
        {activeTab === "inquiries" ? (
          <InquiryTable inquiries={inquiries} loading={loading} type="regular" onUpdate={loadInquiries} />
        ) : (
          <InquiryTable
            inquiries={preRegistrations}
            loading={loading}
            type="pre-registration"
            onUpdate={loadInquiries}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
