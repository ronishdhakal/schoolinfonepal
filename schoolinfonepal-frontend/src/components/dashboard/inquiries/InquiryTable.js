"use client"

import React from "react"
import { useState } from "react"
import { updateInquiryContactStatus } from "../../../utils/api"

const InquiryDetailModal = ({ inquiry, isOpen, onClose, type }) => {
  if (!isOpen || !inquiry) return null

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Debug the inquiry object in the modal
  console.log("Modal inquiry data:", inquiry)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {type === "pre-registration" ? "Pre-Registration" : "General Inquiry"} Details
              </h2>
              <p className="text-blue-100">ID: #{inquiry.id}</p>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <p className="text-gray-900 font-medium">{inquiry.full_name || "Not provided"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{inquiry.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p className="text-gray-900">{inquiry.phone}</p>
              </div>
              {inquiry.address && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <p className="text-gray-900">{inquiry.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Academic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <p className="text-gray-900">{inquiry.course?.name || "Not specified"}</p>
              </div>
              {type === "pre-registration" && inquiry.level && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <p className="text-gray-900">{inquiry.level}</p>
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          {inquiry.message && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Message
              </h3>
              <div className="bg-white rounded-lg p-4 border">
                <p className="text-gray-900 whitespace-pre-wrap">{inquiry.message}</p>
              </div>
            </div>
          )}

          {/* Contact Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div>
                  <p className="font-medium text-gray-900">Inquiry Submitted</p>
                  <p className="text-sm text-gray-600">{formatDate(inquiry.created_at)}</p>
                </div>
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
              {inquiry.contacted && inquiry.contacted_at && (
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div>
                    <p className="font-medium text-gray-900">Contacted</p>
                    <p className="text-sm text-gray-600">{formatDate(inquiry.contacted_at)}</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  inquiry.contacted ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {inquiry.contacted ? "✓ Contacted" : "⏳ Pending Contact"}
              </span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const ContactToggle = ({ inquiry, onToggle, loading, type }) => {
  return (
    <button
      onClick={() => onToggle(inquiry.id, inquiry.contacted, type)}
      disabled={loading}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        inquiry.contacted ? "bg-green-600" : "bg-gray-200"
      } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          inquiry.contacted ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  )
}

const InquiryTable = ({ inquiries = [], loading = false, type = "regular", onUpdate }) => {
  // Debug: Log the inquiries data to see the structure
  console.log(`${type} inquiries data:`, inquiries)

  const [loadingStates, setLoadingStates] = useState({})
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [expandedRows, setExpandedRows] = useState(new Set())

  const handleContactStatusUpdate = async (inquiryId, currentStatus, inquiryType) => {
    const newStatus = !currentStatus

    setLoadingStates((prev) => ({ ...prev, [inquiryId]: true }))

    try {
      await updateInquiryContactStatus(inquiryId, newStatus)
      if (onUpdate) {
        await onUpdate()
      }
    } catch (error) {
      console.error("Error updating contact status:", error)
      alert("Failed to update contact status. Please try again.")
    } finally {
      setLoadingStates((prev) => ({ ...prev, [inquiryId]: false }))
    }
  }

  const handleViewDetails = (inquiry) => {
    setSelectedInquiry(inquiry)
    setIsModalOpen(true)
  }

  const toggleRowExpansion = (inquiryId) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(inquiryId)) {
      newExpanded.delete(inquiryId)
    } else {
      newExpanded.add(inquiryId)
    }
    setExpandedRows(newExpanded)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (dateString) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-t-lg"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 border-b border-gray-200"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Course
                </th>
                {type === "pre-registration" && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Level
                  </th>
                )}
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Contacted
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inquiries.map((inquiry) => {
                // Debug each inquiry to check for full_name
                console.log(`Inquiry ${inquiry.id} data:`, inquiry)

                return (
                  <React.Fragment key={inquiry.id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      {/* Student Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {inquiry.full_name ? inquiry.full_name.charAt(0).toUpperCase() : "?"}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {inquiry.full_name || "Name not provided"}
                            </div>
                            <div className="text-sm text-gray-500">ID: #{inquiry.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{inquiry.email}</div>
                        <div className="text-sm text-gray-500">{inquiry.phone}</div>
                      </td>

                      {/* Course */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {inquiry.course?.name || <span className="text-gray-400 italic">Not specified</span>}
                        </div>
                      </td>

                      {/* Level (for pre-registration) */}
                      {type === "pre-registration" && (
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {inquiry.level || <span className="text-gray-400 italic">Not specified</span>}
                          </div>
                        </td>
                      )}

                      {/* Date */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{formatDate(inquiry.created_at)}</div>
                        <div className="text-xs text-gray-500">{formatTime(inquiry.created_at)}</div>
                      </td>

                      {/* Contact Status */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <ContactToggle
                            inquiry={inquiry}
                            onToggle={handleContactStatusUpdate}
                            loading={loadingStates[inquiry.id]}
                            type={type}
                          />
                          <span
                            className={`text-xs font-medium ${inquiry.contacted ? "text-green-700" : "text-gray-500"}`}
                          >
                            {inquiry.contacted ? "Yes" : "No"}
                          </span>
                        </div>
                        {inquiry.contacted && inquiry.contacted_at && (
                          <div className="text-xs text-gray-500 mt-1">{formatDate(inquiry.contacted_at)}</div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(inquiry)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            View
                          </button>
                          {inquiry.message && (
                            <button
                              onClick={() => toggleRowExpansion(inquiry.id)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                              <svg
                                className={`w-3 h-3 mr-1 transform transition-transform ${
                                  expandedRows.has(inquiry.id) ? "rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                              Message
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Message Row */}
                    {expandedRows.has(inquiry.id) && inquiry.message && (
                      <tr className="bg-gray-50">
                        <td colSpan={type === "pre-registration" ? 7 : 6} className="px-6 py-4">
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <svg
                                  className="w-5 h-5 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                  />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">
                                  Message from {inquiry.full_name || "Student"}
                                </h4>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{inquiry.message}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}

              {inquiries.length === 0 && (
                <tr>
                  <td colSpan={type === "pre-registration" ? 7 : 6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-12 h-12 text-gray-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries found</h3>
                      <p className="text-gray-500">
                        {type === "pre-registration"
                          ? "No pre-registration inquiries match your current filters."
                          : "No general inquiries match your current filters."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <InquiryDetailModal
        inquiry={selectedInquiry}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={type}
      />
    </>
  )
}

export default InquiryTable
