"use client"
import { useState, useEffect } from "react"
import { fetchUniversitiesDropdown } from "@/utils/api"

const SchoolUniversity = ({ formData, setFormData }) => {
  const [universities, setUniversities] = useState([])

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        const data = await fetchUniversitiesDropdown()
        setUniversities(data)
      } catch (err) {
        console.error("Failed to load universities:", err)
      }
    }
    loadUniversities()
  }, [])

  const handleUniversityChange = (universityId) => {
    const currentUniversities = formData.universities || []
    const updatedUniversities = currentUniversities.includes(universityId)
      ? currentUniversities.filter((id) => id !== universityId)
      : [...currentUniversities, universityId]

    setFormData((prev) => ({ ...prev, universities: updatedUniversities }))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Affiliated Universities</h3>

      <div className="space-y-4">
        <p className="text-sm text-gray-600">Select universities that the school is affiliated with</p>

        {universities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
            {universities.map((university) => (
              <label key={university.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(formData.universities || []).includes(university.id)}
                  onChange={() => handleUniversityChange(university.id)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">{university.name}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Loading universities...</p>
        )}

        {formData.universities && formData.universities.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Selected Universities ({formData.universities.length}):
            </p>
            <div className="space-y-1">
              {formData.universities.map((universityId) => {
                const university = universities.find((u) => u.id === universityId)
                return university ? (
                  <span
                    key={universityId}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2 mb-1"
                  >
                    {university.name}
                  </span>
                ) : null
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SchoolUniversity
