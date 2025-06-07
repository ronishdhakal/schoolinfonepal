"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { getAuthToken, fetchSchoolInquiries } from "../../utils/api"
import DashboardLayout from "../../components/dashboard/DashboardLayout"

export default function InquiriesPage() {
  const [loading, setLoading] = useState(true)
  const [inquiries, setInquiries] = useState([])
  const [preRegistrations, setPreRegistrations] = useState([])
  const [activeTab, setActiveTab] = useState("inquiries")
  const router = useRouter()

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.push("/login")
      return
    }

    loadInquiries()
  }, [router])

  const loadInquiries = async () => {
    try {
      const data = await fetchSchoolInquiries()
      setInquiries(data.inquiries || [])
      setPreRegistrations(data.pre_registrations || [])
    } catch (error) {
      console.error("Error loading inquiries:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="animate-pulse">Loading inquiries...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
          <p className="text-gray-600 mt-2">Manage student inquiries and pre-registrations</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow">
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

          <div className="p-6">
            {activeTab === "inquiries" ? (
              <InquiriesList inquiries={inquiries} />
            ) : (
              <PreRegistrationsList preRegistrations={preRegistrations} />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function InquiriesList({ inquiries }) {
  if (inquiries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <span className="text-4xl mb-4 block">📧</span>
        <p>No inquiries received yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {inquiries.map((inquiry) => (
        <div key={inquiry.id} className="border rounded-lg p-4 hover:bg-gray-50">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium text-gray-900">{inquiry.full_name}</h3>
              <p className="text-sm text-gray-600">
                {inquiry.email} • {inquiry.phone}
              </p>
            </div>
            <span className="text-xs text-gray-500">{new Date(inquiry.created_at).toLocaleDateString()}</span>
          </div>

          {inquiry.course && <p className="text-sm text-blue-600 mb-2">Course: {inquiry.course.name}</p>}

          {inquiry.message && (
            <div className="bg-gray-50 rounded p-3">
              <p className="text-sm text-gray-700">{inquiry.message}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function PreRegistrationsList({ preRegistrations }) {
  if (preRegistrations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <span className="text-4xl mb-4 block">📝</span>
        <p>No pre-registrations received yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {preRegistrations.map((registration) => (
        <div key={registration.id} className="border rounded-lg p-4 hover:bg-gray-50">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium text-gray-900">{registration.student_full_name}</h3>
              <p className="text-sm text-gray-600">Parent: {registration.parent_name}</p>
              <p className="text-sm text-gray-600">
                {registration.email} • {registration.phone}
              </p>
            </div>
            <span className="text-xs text-gray-500">{new Date(registration.created_at).toLocaleDateString()}</span>
          </div>

          <p className="text-sm text-blue-600 mb-2">Grade/Class: {registration.grade_or_class}</p>

          {registration.message && (
            <div className="bg-gray-50 rounded p-3">
              <p className="text-sm text-gray-700">{registration.message}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
