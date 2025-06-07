"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { getAuthToken, fetchSchoolInquiries } from "../../utils/api"
import DashboardLayout from "../../components/dashboard/DashboardLayout"
import InquiryAnalytics from "../../components/dashboard/inquiries/InquiryAnalytics"
import InquiryFilters from "../../components/dashboard/inquiries/InquiryFilters"
import InquiryTable from "../../components/dashboard/inquiries/InquiryTable"
import InquiryActions from "../../components/dashboard/inquiries/InquiryActions"

export default function InquiriesPage() {
  const [loading, setLoading] = useState(true)
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

  // Use useCallback to prevent unnecessary re-renders
  const loadInquiries = useCallback(async () => {
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
  }, [appliedFilters])

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.push("/login")
      return
    }

    loadInquiries()
  }, [router, loadInquiries])

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
