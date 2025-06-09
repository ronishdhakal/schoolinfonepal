"use client"

import { useState, useEffect } from "react"
import { fetchLevelsDropdown, fetchUniversitiesDropdown } from "@/utils/api"

export default function AdmissionAbout({ formData, setFormData, errors = {} }) {
  const [levels, setLevels] = useState([])
  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [levelsData, universitiesData] = await Promise.all([fetchLevelsDropdown(), fetchUniversitiesDropdown()])

        console.log("=== DROPDOWN DATA ===")
        console.log("Loaded levels:", levelsData)
        console.log("Loaded universities:", universitiesData)

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
    console.log(`=== FIELD UPDATE ===`)
    console.log(`Updating ${field} from "${formData[field]}" to "${value}"`)

    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      }
      console.log("Updated form data:", updated)
      return updated
    })
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
          <select
            value={formData.level || ""}
            onChange={(e) => handleInputChange("level", e.target.value || "")}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.level ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select a level</option>
            {levels.map((level) => (
              <option key={level.id} value={level.id}>
                {/* ✅ FIXED: Use level.title instead of level.name */}
                {level.title || level.name}
              </option>
            ))}
          </select>
          {errors.level && <p className="mt-1 text-sm text-red-600">{errors.level}</p>}
          {/* ✅ DEBUG: Show current value */}
          <p className="mt-1 text-xs text-gray-500">Current value: "{formData.level}"</p>
        </div>

        {/* University */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
          <select
            value={formData.university || ""}
            onChange={(e) => handleInputChange("university", e.target.value || "")}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.university ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select a university</option>
            {universities.map((university) => (
              <option key={university.id} value={university.id}>
                {university.name}
              </option>
            ))}
          </select>
          {errors.university && <p className="mt-1 text-sm text-red-600">{errors.university}</p>}
          {/* ✅ DEBUG: Show current value */}
          <p className="mt-1 text-xs text-gray-500">Current value: "{formData.university}"</p>
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
          {errors.featured && <p className="mt-1 text-sm text-red-600">{errors.featured}</p>}
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
