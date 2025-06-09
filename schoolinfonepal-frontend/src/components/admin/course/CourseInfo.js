"use client"
import { useState, useEffect } from "react"
import { fetchDisciplinesDropdown } from "@/utils/api"

const CourseInfo = ({ formData, setFormData }) => {
  const [disciplines, setDisciplines] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDisciplines = async () => {
      try {
        const data = await fetchDisciplinesDropdown()
        console.log("=== DISCIPLINES DATA ===")
        console.log("Loaded disciplines:", data)
        setDisciplines(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Failed to load disciplines:", err)
      } finally {
        setLoading(false)
      }
    }
    loadDisciplines()
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

  const handleDisciplineChange = (disciplineId) => {
    const currentDisciplines = formData.disciplines || []
    const updatedDisciplines = currentDisciplines.includes(disciplineId)
      ? currentDisciplines.filter((id) => id !== disciplineId)
      : [...currentDisciplines, disciplineId]

    console.log(`=== DISCIPLINE UPDATE ===`)
    console.log(`Toggling discipline ${disciplineId}`)
    console.log(`From:`, currentDisciplines)
    console.log(`To:`, updatedDisciplines)

    handleChange("disciplines", updatedDisciplines)
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Course Details</h3>

      <div className="space-y-6">
        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
          <textarea
            value={formData.short_description || ""}
            onChange={(e) => handleChange("short_description", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Brief description of the course"
          />
        </div>

        {/* Long Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Long Description</label>
          <textarea
            value={formData.long_description || ""}
            onChange={(e) => handleChange("long_description", e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Detailed course information, syllabus, teaching approach, etc."
          />
        </div>

        {/* Disciplines */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Disciplines</label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4">
            {disciplines.length === 0 ? (
              <p className="text-gray-500 text-sm col-span-full">No disciplines available</p>
            ) : (
              disciplines.map((discipline) => (
                <label key={discipline.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(formData.disciplines || []).includes(discipline.id)}
                    onChange={() => handleDisciplineChange(discipline.id)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-900">
                    {/* ✅ FIXED: Use discipline.title instead of discipline.name */}
                    {discipline.title || discipline.name}
                  </span>
                </label>
              ))
            )}
          </div>
          {/* ✅ DEBUG: Show selected disciplines */}
          <p className="mt-1 text-xs text-gray-500">Selected disciplines: {JSON.stringify(formData.disciplines)}</p>
        </div>

        {/* Outcome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Outcome</label>
          <textarea
            value={formData.outcome || ""}
            onChange={(e) => handleChange("outcome", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Expected outcomes and career prospects"
          />
        </div>

        {/* Eligibility */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Eligibility</label>
          <textarea
            value={formData.eligibility || ""}
            onChange={(e) => handleChange("eligibility", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eligibility criteria and requirements"
          />
        </div>
      </div>
    </div>
  )
}

export default CourseInfo
