"use client"

import { useState, useEffect } from "react"
import {
  fetchSchoolOwnProfile,
  updateSchoolOwnProfile,
  fetchUniversitiesDropdown,
  fetchFacilitiesDropdown,
} from "../../../utils/api"

export default function ProfileUniversities() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [universities, setUniversities] = useState([])
  const [facilities, setFacilities] = useState([])
  const [selectedUniversities, setSelectedUniversities] = useState([])
  const [selectedFacilities, setSelectedFacilities] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [schoolData, universitiesData, facilitiesData] = await Promise.all([
        fetchSchoolOwnProfile(),
        fetchUniversitiesDropdown(),
        fetchFacilitiesDropdown(),
      ])

      setUniversities(universitiesData)
      setFacilities(facilitiesData)
      setSelectedUniversities(schoolData.universities?.map((u) => u.id) || [])
      setSelectedFacilities(schoolData.facilities?.map((f) => f.id) || [])
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUniversityChange = (universityId) => {
    setSelectedUniversities((prev) =>
      prev.includes(universityId) ? prev.filter((id) => id !== universityId) : [...prev, universityId],
    )
  }

  const handleFacilityChange = (facilityId) => {
    setSelectedFacilities((prev) =>
      prev.includes(facilityId) ? prev.filter((id) => id !== facilityId) : [...prev, facilityId],
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData()

      console.log("=== FRONTEND DEBUG ===")
      console.log("Selected universities:", selectedUniversities)
      console.log("Selected facilities:", selectedFacilities)

      // ✅ CRITICAL FIX: Always send the keys, even if arrays are empty
      if (selectedUniversities.length > 0) {
        selectedUniversities.forEach((id) => {
          formData.append("universities", id)
          console.log(`Appended university ID: ${id}`)
        })
      } else {
        // Send empty value to indicate "clear all universities"
        formData.append("universities", "")
        console.log("Appended empty universities to clear all")
      }

      if (selectedFacilities.length > 0) {
        selectedFacilities.forEach((id) => {
          formData.append("facilities", id)
          console.log(`Appended facility ID: ${id}`)
        })
      } else {
        // Send empty value to indicate "clear all facilities"
        formData.append("facilities", "")
        console.log("Appended empty facilities to clear all")
      }

      // Debug FormData contents
      console.log("=== FORMDATA CONTENTS ===")
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`)
      }
      console.log("=== END FORMDATA ===")

      await updateSchoolOwnProfile(formData)
      alert("Universities and facilities updated successfully!")

      // Reload data to show updated state
      await loadData()
    } catch (error) {
      console.error("Error updating:", error)
      alert("Error updating: " + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading universities and facilities...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Universities */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Affiliated Universities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {universities.map((university) => (
            <label key={university.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedUniversities.includes(university.id)}
                onChange={() => handleUniversityChange(university.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{university.name}</span>
            </label>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">Selected: {selectedUniversities.length} universities</p>
      </div>

      {/* Facilities */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Available Facilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {facilities.map((facility) => (
            <label key={facility.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedFacilities.includes(facility.id)}
                onChange={() => handleFacilityChange(facility.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{facility.name}</span>
            </label>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">Selected: {selectedFacilities.length} facilities</p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Universities & Facilities"}
        </button>
      </div>
    </form>
  )
}
