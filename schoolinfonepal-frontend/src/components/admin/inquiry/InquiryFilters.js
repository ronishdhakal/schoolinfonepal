"use client"

import { useState, useEffect } from "react"
import { fetchSchoolsDropdown, fetchCoursesDropdown } from "@/utils/api"

const InquiryFilters = ({ filters, setFilters, onApplyFilters, onResetFilters }) => {
  const [schools, setSchools] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [schoolsData, coursesData] = await Promise.all([fetchSchoolsDropdown(), fetchCoursesDropdown()])
        setSchools(schoolsData)
        setCourses(coursesData)
      } catch (error) {
        console.error("Failed to load dropdown data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDropdowns()
  }, [])

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
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Inquiries</h3>

      <form onSubmit={handleApplyFilters} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search by name, email, phone */}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* School dropdown */}
          <div>
            <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">
              School
            </label>
            <select
              id="school"
              name="school"
              value={filters.school || ""}
              onChange={handleSelectChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Schools</option>
              {loading ? (
                <option disabled>Loading schools...</option>
              ) : (
                schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Course dropdown */}
          <div>
            <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <select
              id="course"
              name="course"
              value={filters.course || ""}
              onChange={handleSelectChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Courses</option>
              {loading ? (
                <option disabled>Loading courses...</option>
              ) : (
                courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Date range - Start date */}
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={filters.start_date || ""}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Date range - End date */}
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={filters.end_date || ""}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Active filters display */}
        {Object.keys(filters).some((key) => filters[key]) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null

              let label = ""
              if (key === "search") label = `Search: ${value}`
              else if (key === "school") {
                const school = schools.find((s) => s.id === Number.parseInt(value))
                label = `School: ${school ? school.name : value}`
              } else if (key === "course") {
                const course = courses.find((c) => c.id === Number.parseInt(value))
                label = `Course: ${course ? course.name : value}`
              } else if (key === "start_date") label = `From: ${value}`
              else if (key === "end_date") label = `To: ${value}`
              else label = `${key}: ${value}`

              return (
                <span
                  key={key}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {label}
                  <button
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, [key]: "" }))}
                    className="ml-1 inline-flex text-indigo-500 focus:outline-none"
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
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Reset Filters
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  )
}

export default InquiryFilters
