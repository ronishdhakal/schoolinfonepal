"use client"

// ✅ FIXED: Client-side CSV export utility
const exportToCSV = (data, filename, type) => {
  if (!data || data.length === 0) {
    alert("No data to export")
    return
  }

  let headers = []
  let rows = []

  if (type === "pre_registrations") {
    headers = ["ID", "Full Name", "Email", "Phone", "Address", "Level", "Course", "Message", "Created At"]
    rows = data.map((inquiry) => [
      inquiry.id,
      inquiry.full_name || "N/A",
      inquiry.email || "N/A",
      inquiry.phone || "N/A",
      inquiry.address || "N/A",
      inquiry.level || "N/A",
      inquiry.course?.name || "N/A",
      inquiry.message || "N/A",
      new Date(inquiry.created_at).toLocaleString(),
    ])
  } else {
    headers = ["ID", "Full Name", "Email", "Phone", "Address", "Course", "Message", "Created At"]
    rows = data.map((inquiry) => [
      inquiry.id,
      inquiry.full_name || "N/A",
      inquiry.email || "N/A",
      inquiry.phone || "N/A",
      inquiry.address || "N/A",
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

const InquiryActions = ({ filters, activeTab }) => {
  const handleExport = async () => {
    try {
      // ✅ FIXED: Use client-side export instead of server-side
      const { fetchSchoolInquiries } = await import("@/utils/api")

      // Determine export type based on active tab
      let exportType = "inquiries"
      if (activeTab === "preregistrations") exportType = "pre_registrations"

      // Fetch all data for export (without pagination)
      const exportFilters = { ...filters, type: exportType, page_size: 10000 }
      const data = await fetchSchoolInquiries(exportFilters)

      // Get the appropriate data array
      const exportData = exportType === "pre_registrations" ? data.pre_registrations || [] : data.inquiries || []

      // Generate filename
      const filename = `${exportType}_${new Date().toISOString().split("T")[0]}.csv`

      // Export to CSV
      exportToCSV(exportData, filename, exportType)
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
          Export CSV
        </button>
      </div>
    </div>
  )
}

export default InquiryActions
