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

  // Separate page and total states
  const [inquiriesPage, setInquiriesPage] = useState(1)
  const [preRegistrationsPage, setPreRegistrationsPage] = useState(1)
  const [totalInquiries, setTotalInquiries] = useState(0)
  const [totalPreRegistrations, setTotalPreRegistrations] = useState(0)

  useEffect(() => {
    const loadInquiries = async () => {
      try {
        setLoading(true)
        setError(null)

        if (activeTab === "all" || activeTab === "inquiries") {
          const data = await fetchAdminInquiries({
            ...appliedFilters,
            page: inquiriesPage,
            page_size: 12,
          })
          setInquiries(data.results || [])
          setTotalInquiries(data.count || 0)
        }

        if (activeTab === "all" || activeTab === "pre_registrations") {
          const data = await fetchAdminPreRegistrations({
            ...appliedFilters,
            page: preRegistrationsPage,
            page_size: 12,
          })
          setPreRegistrations(data.results || [])
          setTotalPreRegistrations(data.count || 0)
        }
      } catch (err) {
        console.error("Failed to load inquiries:", err)
        setError("Failed to load inquiries. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadInquiries()
  }, [activeTab, appliedFilters, inquiriesPage, preRegistrationsPage])

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters })
    setInquiriesPage(1)
    setPreRegistrationsPage(1)
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
    setInquiriesPage(1)
    setPreRegistrationsPage(1)
  }

  return (
    <AdminLayout>
      <Head>
        <title>Inquiry Management | School Info Nepal</title>
      </Head>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <InquiryActions filters={appliedFilters} activeTab={activeTab} />
          <InquiryAnalytics filters={appliedFilters} />
          <InquiryFilters
            filters={filters}
            setFilters={setFilters}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: "all", label: "All Inquiries" },
                { key: "inquiries", label: "Regular Inquiries" },
                { key: "pre_registrations", label: "Pre-Registration Inquiries" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key)
                    setInquiriesPage(1)
                    setPreRegistrationsPage(1)
                  }}
                  className={`${
                    activeTab === tab.key
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {activeTab === "all" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Regular Inquiries</h3>
                <InquiryTable
                  inquiries={inquiries}
                  loading={loading}
                  type="regular"
                  total={totalInquiries}
                  currentPage={inquiriesPage}
                  onPageChange={setInquiriesPage}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Pre-Registration Inquiries</h3>
                <InquiryTable
                  inquiries={preRegistrations}
                  loading={loading}
                  type="pre-registration"
                  total={totalPreRegistrations}
                  currentPage={preRegistrationsPage}
                  onPageChange={setPreRegistrationsPage}
                />
              </div>
            </div>
          )}

          {activeTab === "inquiries" && (
            <InquiryTable
              inquiries={inquiries}
              loading={loading}
              type="regular"
              total={totalInquiries}
              currentPage={inquiriesPage}
              onPageChange={setInquiriesPage}
            />
          )}

          {activeTab === "pre_registrations" && (
            <InquiryTable
              inquiries={preRegistrations}
              loading={loading}
              type="pre-registration"
              total={totalPreRegistrations}
              currentPage={preRegistrationsPage}
              onPageChange={setPreRegistrationsPage}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
