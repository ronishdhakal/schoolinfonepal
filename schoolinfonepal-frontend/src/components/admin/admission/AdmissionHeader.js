"use client"

import { useState, useEffect } from "react"
import { fetchSchoolsDropdown, fetchCoursesDropdown } from "@/utils/api"

export default function AdmissionHeader({ formData, setFormData, errors = {}, isEditing = false }) {
  const [schools, setSchools] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [schoolsData, coursesData] = await Promise.all([fetchSchoolsDropdown(), fetchCoursesDropdown()])

        console.log("Loaded schools:", schoolsData)
        console.log("Loaded courses:", coursesData)

        setSchools(Array.isArray(schoolsData) ? schoolsData : [])
        setCourses(Array.isArray(coursesData) ? coursesData : [])
      } catch (error) {
        console.error("Error loading dropdown data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDropdownData()
  }, [])

  const handleInputChange = (field, value) => {
    console.log(`Updating ${field} to:`, value)
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCourseChange = (courseId) => {
    const currentCourses = formData.course_ids || []
    const updatedCourses = currentCourses.includes(courseId)
      ? currentCourses.filter((id) => id !== courseId)
      : [...currentCourses, courseId]

    console.log("Updated courses:", updatedCourses)
    handleInputChange("course_ids", updatedCourses)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title || ""}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter admission title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* Slug */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug {isEditing && <span className="text-gray-500">(Read-only)</span>}
          </label>
          <input
            type="text"
            value={formData.slug || ""}
            onChange={(e) => handleInputChange("slug", e.target.value)}
            disabled={isEditing}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isEditing ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
            } ${errors.slug ? "border-red-500" : ""}`}
            placeholder="URL-friendly version of title (auto-generated if empty)"
          />
          {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
        </div>

        {/* Published Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Published Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.published_date || ""}
            onChange={(e) => handleInputChange("published_date", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.published_date ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.published_date && <p className="mt-1 text-sm text-red-600">{errors.published_date}</p>}
        </div>

        {/* Active From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Active From <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.active_from || ""}
            onChange={(e) => handleInputChange("active_from", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.active_from ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.active_from && <p className="mt-1 text-sm text-red-600">{errors.active_from}</p>}
        </div>

        {/* Active Until */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Active Until <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.active_until || ""}
            onChange={(e) => handleInputChange("active_until", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.active_until ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.active_until && <p className="mt-1 text-sm text-red-600">{errors.active_until}</p>}
        </div>

        {/* School */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            School <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.school_id || ""}
            onChange={(e) => handleInputChange("school_id", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.school_id ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select a school</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
          {errors.school_id && <p className="mt-1 text-sm text-red-600">{errors.school_id}</p>}
        </div>

        {/* Courses */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Courses</label>
          <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
            {courses.length === 0 ? (
              <p className="text-gray-500 text-sm">No courses available</p>
            ) : (
              <div className="space-y-2">
                {courses.map((course) => (
                  <label key={course.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(formData.course_ids || []).includes(course.id)}
                      onChange={() => handleCourseChange(course.id)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{course.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          {errors.course_ids && <p className="mt-1 text-sm text-red-600">{errors.course_ids}</p>}
          {/* ✅ DEBUG: Show selected courses */}
          <p className="mt-1 text-xs text-gray-500">Selected courses: {JSON.stringify(formData.course_ids)}</p>
        </div>
      </div>
    </div>
  )
}
