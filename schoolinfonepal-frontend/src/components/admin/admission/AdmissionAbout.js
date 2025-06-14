"use client"

import { useState, useEffect } from "react"
import Select from "react-select"
import { fetchLevelsDropdown, fetchUniversitiesDropdown } from "@/utils/api"

export default function AdmissionAbout({ formData, setFormData, errors = {} }) {
  const [levels, setLevels] = useState([])
  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [levelsData, universitiesData] = await Promise.all([
          fetchLevelsDropdown(),
          fetchUniversitiesDropdown(),
        ])

        setLevels(Array.isArray(levelsData) ? levelsData : [])
        setUniversities(Array.isArray(universitiesData) ? universitiesData : [])
      } catch (error) {
        console.error("Error loading dropdown data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDropdownData()
  }, [])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const levelOptions = levels.map((level) => ({ value: level.id, label: level.title || level.name }))
  const universityOptions = universities.map((uni) => ({ value: uni.id, label: uni.name }))

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
          <Select
            options={levelOptions}
            value={levelOptions.find((opt) => opt.value === formData.level) || null}
            onChange={(selected) => handleInputChange("level", selected?.value || "")}
            isClearable
            className="react-select-container"
            classNamePrefix="react-select"
          />
          {errors.level && <p className="mt-1 text-sm text-red-600">{errors.level}</p>}
        </div>

        {/* University */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
          <Select
            options={universityOptions}
            value={universityOptions.find((opt) => opt.value === formData.university) || null}
            onChange={(selected) => handleInputChange("university", selected?.value || "")}
            isClearable
            className="react-select-container"
            classNamePrefix="react-select"
          />
          {errors.university && <p className="mt-1 text-sm text-red-600">{errors.university}</p>}
        </div>

        {/* Featured */}
        <div className="md:col-span-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.featured || false}
              onChange={(e) => handleInputChange("featured", e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Featured Admission</span>
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Featured admissions will be highlighted on the homepage and in search results.
          </p>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={6}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter detailed description about the admission..."
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          <p className="mt-1 text-sm text-gray-500">
            Provide detailed information about admission requirements, process, and other relevant details.
          </p>
        </div>
      </div>
    </div>
  )
}
