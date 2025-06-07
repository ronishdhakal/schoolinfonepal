"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import AdminLayout from "@/components/admin/AdminLayout"
import InquiryFilters from "@/components/admin/inquiry/InquiryFilters"
import InquiryTable from "@/components/admin/inquiry/InquiryTable"
import InquiryAnalytics from "@/components/admin/inquiry/InquiryAnalytics"
import InquiryActions from "@/components/admin/inquiry/InquiryActions"
import { fetchAdminInquiries, fetchAdminPreRegistrations } from "@/utils/api"

export default function InquiriesPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [filters, setFilters] = useState({
    search: "",
    school: "",
    course: "",
    start_date: "",
    end_date: "",
  })
  const [appliedFilters, setAppliedFilters] = useState({})
  const [inquiries, setInquiries] = useState([])
  const [preRegistrations, setPreRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load inquiries based on filters
  useEffect(() => {
    const loadInquiries = async () => {
      try {
        setLoading(true)
        setError(null)

        // Only fetch data for the active tab or both if "all" is selected
        const promises = []

        if (activeTab === "all" || activeTab === "inquiries") {
          promises.push(fetchAdminInquiries(appliedFilters))
        } else {
          promises.push(Promise.resolve([]))
        }

        if (activeTab === "all" || activeTab === "pre_registrations") {
          promises.push(fetchAdminPreRegistrations(appliedFilters))
        } else {
          promises.push(Promise.resolve([]))
        }

        const [inquiriesData, preRegistrationsData] = await Promise.all(promises)

        setInquiries(inquiriesData.results || inquiriesData)
        setPreRegistrations(preRegistrationsData.results || preRegistrationsData)
      } catch (err) {
        console.error("Failed to load inquiries:", err)
        setError("Failed to load inquiries. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadInquiries()
  }, [activeTab, appliedFilters])

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters })
  }

  const handleResetFilters = () => {
    setFilters({
      search: "",
      school: "",
      course: "",
      start_date: "",
      end_date: "",
    })
    setAppliedFilters({})
  }

  return (
    <AdminLayout>
      <Head>
        <title>Inquiry Management | School Info Nepal</title>
      </Head>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <InquiryActions filters={appliedFilters} activeTab={activeTab} />

          {/* Analytics Dashboard */}
          <InquiryAnalytics filters={appliedFilters} />

          {/* Filters */}
          <InquiryFilters
            filters={filters}
            setFilters={setFilters}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("all")}
                className={`${
                  activeTab === "all"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                All Inquiries
              </button>
              <button
                onClick={() => setActiveTab("inquiries")}
                className={`${
                  activeTab === "inquiries"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Regular Inquiries
              </button>
              <button
                onClick={() => setActiveTab("pre_registrations")}
                className={`${
                  activeTab === "pre_registrations"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Pre-Registration Inquiries
              </button>
            </nav>
          </div>

          {/* Tables */}
          {activeTab === "all" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Regular Inquiries</h3>
                <InquiryTable inquiries={inquiries} loading={loading} type="regular" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Pre-Registration Inquiries</h3>
                <InquiryTable inquiries={preRegistrations} loading={loading} type="pre-registration" />
              </div>
            </div>
          )}

          {activeTab === "inquiries" && <InquiryTable inquiries={inquiries} loading={loading} type="regular" />}

          {activeTab === "pre_registrations" && (
            <InquiryTable inquiries={preRegistrations} loading={loading} type="pre-registration" />
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
