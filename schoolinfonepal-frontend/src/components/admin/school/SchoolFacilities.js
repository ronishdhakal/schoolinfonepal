"use client"

import { useState, useEffect } from "react"
import Select from "react-select"
import { fetchFacilitiesDropdown } from "@/utils/api"

const SchoolFacilities = ({ formData, setFormData }) => {
  const [facilities, setFacilities] = useState([])

  useEffect(() => {
    const loadFacilities = async () => {
      try {
        const data = await fetchFacilitiesDropdown()
        setFacilities(data)
      } catch (err) {
        console.error("Failed to load facilities:", err)
      }
    }
    loadFacilities()
  }, [])

  const options = facilities.map((f) => ({ value: f.id, label: f.name }))
  const selectedOptions = options.filter((opt) => (formData.facilities || []).includes(opt.value))

  const handleChange = (selected) => {
    const ids = selected.map((opt) => opt.value)
    setFormData((prev) => ({ ...prev, facilities: ids }))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">School Facilities</h3>
      <p className="text-sm text-gray-600 mb-2">Select the facilities available at the school</p>

      <Select
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        isMulti
        placeholder="Select facilities"
        className="react-select-container"
        classNamePrefix="react-select"
      />

      {selectedOptions.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Selected Facilities ({selectedOptions.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedOptions.map((opt) => (
              <span
                key={opt.value}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
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

export default SchoolFacilities
