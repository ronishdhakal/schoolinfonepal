"use client"
import { useState, useEffect } from "react"
import { fetchUniversitiesDropdown, fetchLevelsDropdown } from "@/utils/api"

const CourseHeader = ({ formData, setFormData }) => {
  const [universities, setUniversities] = useState([])
  const [levels, setLevels] = useState([])

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [universitiesData, levelsData] = await Promise.all([fetchUniversitiesDropdown(), fetchLevelsDropdown()])
        setUniversities(universitiesData)
        setLevels(levelsData)
      } catch (err) {
        console.error("Failed to load dropdowns:", err)
      }
    }
    loadDropdowns()
  }, [])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Course Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Course Name *</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">University *</label>
          <select
            value={formData.university || ""}
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
          <select
            value={formData.level || ""}
            onChange={(e) => handleChange("level", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Level</option>
            {levels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))}
          </select>
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
