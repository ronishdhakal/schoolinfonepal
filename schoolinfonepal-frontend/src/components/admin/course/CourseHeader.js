"use client"
import { useState, useEffect } from "react"
import { fetchUniversitiesDropdown, fetchLevelsDropdown } from "@/utils/api"

const CourseHeader = ({ formData, setFormData }) => {
  const [universities, setUniversities] = useState([])
  const [levels, setLevels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [universitiesData, levelsData] = await Promise.all([fetchUniversitiesDropdown(), fetchLevelsDropdown()])

        console.log("=== DROPDOWN DATA ===")
        console.log("Universities:", universitiesData)
        console.log("Levels:", levelsData)

        setUniversities(Array.isArray(universitiesData) ? universitiesData : [])
        setLevels(Array.isArray(levelsData) ? levelsData : [])
      } catch (err) {
        console.error("Failed to load dropdowns:", err)
      } finally {
        setLoading(false)
      }
    }
    loadDropdowns()
  }, [])

  const handleChange = (field, value) => {
    console.log(`=== FIELD UPDATE ===`)
    console.log(`Updating ${field} from "${formData[field]}" to "${value}"`)

    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      console.log("Updated form data:", updated)
      return updated
    })
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Course Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter course name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Abbreviation</label>
          <input
            type="text"
            value={formData.abbreviation || ""}
            onChange={(e) => handleChange("abbreviation", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., MBA, BBA"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            University <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.university?.id || formData.university || ""}
            onChange={(e) => handleChange("university", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="">Select University</option>
            {universities.map((university) => (
              <option key={university.id} value={university.id}>
                {university.name}
              </option>
            ))}
          </select>
          {/* ✅ DEBUG: Show current value */}
          <p className="mt-1 text-xs text-gray-500">
            Current value: "{formData.university?.id || formData.university}"
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
          <select
            value={formData.level?.id || formData.level || ""}
            onChange={(e) => handleChange("level", e.target.value || "")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Level</option>
            {levels.map((level) => (
              <option key={level.id} value={level.id}>
                {/* ✅ FIXED: Use level.title instead of level.name */}
                {level.title || level.name}
              </option>
            ))}
          </select>
          {/* ✅ DEBUG: Show current value */}
          <p className="mt-1 text-xs text-gray-500">Current value: "{formData.level?.id || formData.level}"</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
          <input
            type="text"
            value={formData.slug || ""}
            onChange={(e) => handleChange("slug", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="URL slug (auto-generated if empty)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
          <input
            type="text"
            value={formData.duration || ""}
            onChange={(e) => handleChange("duration", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., 2 years, 4 semesters"
          />
        </div>
      </div>
    </div>
  )
}

export default CourseHeader
