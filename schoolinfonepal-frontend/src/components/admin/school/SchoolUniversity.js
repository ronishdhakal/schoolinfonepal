"use client"

import { useState, useEffect } from "react"
import Select from "react-select"
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

  const options = universities.map((u) => ({ value: u.id, label: u.name }))
  const selectedOptions = options.filter((opt) => (formData.universities || []).includes(opt.value))

  const handleChange = (selected) => {
    const ids = selected.map((opt) => opt.value)
    setFormData((prev) => ({ ...prev, universities: ids }))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Affiliated Universities</h3>
      <p className="text-sm text-gray-600 mb-2">Select universities that the school is affiliated with</p>

      <Select
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        isMulti
        placeholder="Select universities"
        className="react-select-container"
        classNamePrefix="react-select"
      />

      {selectedOptions.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Selected Universities ({selectedOptions.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedOptions.map((opt) => (
              <span
                key={opt.value}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                {opt.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SchoolUniversity
