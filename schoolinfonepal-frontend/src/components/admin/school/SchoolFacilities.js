"use client"
import { useState, useEffect } from "react"
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

  const handleFacilityChange = (facilityId) => {
    const currentFacilities = formData.facilities || []
    const updatedFacilities = currentFacilities.includes(facilityId)
      ? currentFacilities.filter((id) => id !== facilityId)
      : [...currentFacilities, facilityId]

    setFormData((prev) => ({ ...prev, facilities: updatedFacilities }))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">School Facilities</h3>

      <div className="space-y-4">
        <p className="text-sm text-gray-600">Select the facilities available at the school</p>

        {facilities.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
            {facilities.map((facility) => (
              <label key={facility.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(formData.facilities || []).includes(facility.id)}
                  onChange={() => handleFacilityChange(facility.id)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">{facility.name}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Loading facilities...</p>
        )}

        {formData.facilities && formData.facilities.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Selected Facilities ({formData.facilities.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {formData.facilities.map((facilityId) => {
                const facility = facilities.find((f) => f.id === facilityId)
                return facility ? (
                  <span
                    key={facilityId}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {facility.name}
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

export default SchoolFacilities
