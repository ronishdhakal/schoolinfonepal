"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import Pagination from "@/components/common/Pagination"

const PAGE_SIZE = 12

// Client-side export utility
const exportToCSV = (data, filename, type) => {
  if (!data || data.length === 0) {
    alert("No data to export")
    return
  }

  let headers = []
  let rows = []

  if (type === "pre-registration") {
    headers = ["ID", "Full Name", "Email", "Phone", "Address", "Level", "School", "Course", "Message", "Created At"]
    rows = data.map((inquiry) => [
      inquiry.id,
      inquiry.full_name || "N/A",
      inquiry.email || "N/A",
      inquiry.phone || "N/A",
      inquiry.address || "N/A",
      inquiry.level || "N/A",
      inquiry.school?.name || "N/A",
      inquiry.course?.name || "N/A",
      inquiry.message || "N/A",
      new Date(inquiry.created_at).toLocaleString(),
    ])
  } else {
    headers = ["ID", "Full Name", "Email", "Phone", "Address", "School", "Course", "Message", "Created At"]
    rows = data.map((inquiry) => [
      inquiry.id,
      inquiry.full_name || "N/A",
      inquiry.email || "N/A",
      inquiry.phone || "N/A",
      inquiry.address || "N/A",
      inquiry.school?.name || "N/A",
      inquiry.course?.name || "N/A",
      inquiry.message || "N/A",
      new Date(inquiry.created_at).toLocaleString(),
    ])
  }

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

const InquiryTable = ({
  inquiries,
  loading,
  type = "regular",
  total = 0,
  currentPage = 1,
  onPageChange = () => {},
  allInquiries = [],
}) => {
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

  const handleExport = () => {
    const exportData = allInquiries.length > 0 ? allInquiries : inquiries
    const filename = `${type}_inquiries_${new Date().toISOString().split("T")[0]}.csv`
    exportToCSV(exportData, filename, type)
  }

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
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          {type === "pre-registration" ? "Pre-Registration Inquiries" : "Regular Inquiries"} ({total} total)
        </h2>
        <button
          onClick={handleExport}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("full_name")}
              >
                Name {getSortIcon("full_name")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("email")}
              >
                Contact {getSortIcon("email")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("school.name")}
              >
                School {getSortIcon("school.name")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("course.name")}
              >
                Course {getSortIcon("course.name")}
              </th>
              {type === "pre-registration" && (
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("level")}
                >
                  Level {getSortIcon("level")}
                </th>
              )}
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("created_at")}
              >
                Date {getSortIcon("created_at")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View Message
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* ✅ FIXED: Proper pagination component */}
      <Pagination current={currentPage} total={total} pageSize={PAGE_SIZE} onPageChange={onPageChange} />
    </div>
  )
}

export default InquiryTable
