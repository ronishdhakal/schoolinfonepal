"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"

const InquiryTable = ({ inquiries, loading, type = "regular" }) => {
  const [sortField, setSortField] = useState("created_at")
  const [sortDirection, setSortDirection] = useState("desc")

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? "↑" : "↓"
  }

  // Render loading state
  if (loading) {
    return (
      <div className="bg-white overflow-hidden shadow-sm rounded-lg">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 mb-2"></div>
          ))}
        </div>
      </div>
    )
  }

  // Render empty state
  if (!inquiries || inquiries.length === 0) {
    return (
      <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No inquiries found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {type === "regular"
            ? "No regular inquiries match your search criteria."
            : "No pre-registration inquiries match your search criteria."}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("full_name")}
              >
                Name {getSortIcon("full_name")}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("email")}
              >
                Contact {getSortIcon("email")}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("school.name")}
              >
                School {getSortIcon("school.name")}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("course.name")}
              >
                Course {getSortIcon("course.name")}
              </th>
              {type === "pre-registration" && (
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("level")}
                >
                  Level {getSortIcon("level")}
                </th>
              )}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("created_at")}
              >
                Date {getSortIcon("created_at")}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{inquiry.full_name || "N/A"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{inquiry.email}</div>
                  <div className="text-sm text-gray-500">{inquiry.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{inquiry.school?.name || "N/A"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{inquiry.course?.name || "N/A"}</div>
                </td>
                {type === "pre-registration" && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inquiry.level || "N/A"}</div>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500" title={new Date(inquiry.created_at).toLocaleString()}>
                    {formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    type="button"
                    onClick={() => alert(`Message: ${inquiry.message || "No message"}`)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    View Message
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InquiryTable
