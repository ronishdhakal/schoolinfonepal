"use client"

const InquiryFilters = ({ filters, setFilters, onApplyFilters, onResetFilters }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleApplyFilters = (e) => {
    e.preventDefault()
    onApplyFilters()
  }

  const handleResetFilters = () => {
    onResetFilters()
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <form onSubmit={handleApplyFilters} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search || ""}
              onChange={handleInputChange}
              placeholder="Name, Email, Phone..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contact Status */}
          <div>
            <label htmlFor="contacted" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Status
            </label>
            <select
              id="contacted"
              name="contacted"
              value={filters.contacted || ""}
              onChange={handleSelectChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="true">Contacted</option>
              <option value="false">Not Contacted</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                From
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={filters.start_date || ""}
                onChange={handleDateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={filters.end_date || ""}
                onChange={handleDateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Active filters display */}
        {Object.keys(filters).some((key) => filters[key]) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null

              let label = ""
              if (key === "search") label = `Search: ${value}`
              else if (key === "contacted") {
                if (value === "true") label = "Status: Contacted"
                else if (value === "false") label = "Status: Not Contacted"
              } else if (key === "start_date") label = `From: ${value}`
              else if (key === "end_date") label = `To: ${value}`
              else label = `${key}: ${value}`

              return (
                <span
                  key={key}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {label}
                  <button
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, [key]: "" }))}
                    className="ml-1 inline-flex text-blue-500 focus:outline-none"
                  >
                    <span className="sr-only">Remove filter</span>
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </span>
              )
            })}
          </div>
        )}

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reset Filters
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  )
}

export default InquiryFilters
