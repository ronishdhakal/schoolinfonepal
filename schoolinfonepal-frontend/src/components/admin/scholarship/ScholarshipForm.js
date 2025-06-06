"use client"

import { useState, useEffect } from "react"
import {
  createScholarship,
  updateScholarship,
  fetchSchoolsDropdown,
  fetchUniversitiesDropdown,
  fetchCoursesDropdown,
  fetchLevelsDropdown,
} from "../../../utils/api"
import ScholarshipBasicInfo from "./ScholarshipBasicInfo"
import ScholarshipDates from "./ScholarshipDates"
import ScholarshipOrganizer from "./ScholarshipOrganizer"
import ScholarshipRelations from "./ScholarshipRelations"

export default function ScholarshipForm({ scholarship, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    published_date: "",
    active_from: "",
    active_until: "",
    organizer_school: "",
    organizer_university: "",
    organizer_custom: "",
    courses: [],
    level: "",
    university: "",
    featured: false,
  })

  const [dropdowns, setDropdowns] = useState({
    schools: [],
    universities: [],
    courses: [],
    levels: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    loadDropdowns()
    if (scholarship) {
      setFormData({
        title: scholarship.title || "",
        slug: scholarship.slug || "",
        published_date: scholarship.published_date || "",
        active_from: scholarship.active_from || "",
        active_until: scholarship.active_until || "",
        organizer_school: scholarship.organizer_school || "",
        organizer_university: scholarship.organizer_university || "",
        organizer_custom: scholarship.organizer_custom || "",
        courses: scholarship.courses || [],
        level: scholarship.level || "",
        university: scholarship.university || "",
        featured: scholarship.featured || false,
      })
    }
  }, [scholarship])

  const loadDropdowns = async () => {
    try {
      const [schoolsData, universitiesData, coursesData, levelsData] = await Promise.all([
        fetchSchoolsDropdown(),
        fetchUniversitiesDropdown(),
        fetchCoursesDropdown(),
        fetchLevelsDropdown(),
      ])
      setDropdowns({
        schools: schoolsData || [],
        universities: universitiesData || [],
        courses: coursesData || [],
        levels: levelsData || [],
      })
    } catch (err) {
      console.error("Error loading dropdowns:", err)
      setError("Failed to load dropdown data. Please refresh the page.")
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.published_date) newErrors.published_date = "Published date is required"
    if (!formData.active_from) newErrors.active_from = "Active from date is required"
    if (!formData.active_until) newErrors.active_until = "Active until date is required"

    // Date validation
    if (formData.active_from && formData.active_until) {
      if (new Date(formData.active_until) <= new Date(formData.active_from)) {
        newErrors.active_until = "Active until date must be after active from date"
      }
    }

    // Organizer validation
    if (!formData.organizer_school && !formData.organizer_university && !formData.organizer_custom) {
      newErrors.organizer = "Please specify at least one organizer"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      setError("Please fix the errors below")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const submitData = new FormData()

      Object.keys(formData).forEach((key) => {
        if (Array.isArray(formData[key])) {
          submitData.append(key, JSON.stringify(formData[key]))
        } else if (formData[key] !== "" && formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key])
        }
      })

      if (scholarship) {
        await updateScholarship(scholarship.slug, submitData)
      } else {
        await createScholarship(submitData)
      }

      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{scholarship ? "Edit Scholarship" : "Create Scholarship"}</h1>
        <button onClick={onCancel} className="px-4 py-2 text-gray-600 hover:text-gray-800">
          Cancel
        </button>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <ScholarshipBasicInfo formData={formData} onChange={handleChange} errors={errors} />

        <ScholarshipDates formData={formData} onChange={handleChange} errors={errors} />

        <ScholarshipOrganizer
          formData={formData}
          onChange={handleChange}
          schools={dropdowns.schools}
          universities={dropdowns.universities}
          errors={errors}
        />

        <ScholarshipRelations
          formData={formData}
          onChange={handleChange}
          courses={dropdowns.courses}
          levels={dropdowns.levels}
          universities={dropdowns.universities}
          errors={errors}
        />

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : scholarship ? "Update Scholarship" : "Create Scholarship"}
          </button>
        </div>
      </form>
    </div>
  )
}
