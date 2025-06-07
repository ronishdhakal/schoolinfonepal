"use client"

import { exportSchoolInquiriesExcel } from "@/utils/api"

const InquiryActions = ({ filters, activeTab }) => {
  const handleExport = async () => {
    try {
      // Determine export type based on active tab
      let exportType = "all"
      if (activeTab === "inquiries") exportType = "inquiries"
      if (activeTab === "preregistrations") exportType = "pre_registrations"

      // Add export type to filters
      const exportFilters = { ...filters, type: exportType }

      await exportSchoolInquiriesExcel(exportFilters)
    } catch (error) {
      console.error("Export failed:", error)
      alert("Failed to export data. Please try again.")
    }
  }

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">Inquiry Management</h2>
      <div className="flex space-x-3">
        <button
          onClick={handleExport}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <svg
            className="mr-2 -ml-1 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Export to Excel
        </button>
      </div>
    </div>
  )
}

export default InquiryActions
