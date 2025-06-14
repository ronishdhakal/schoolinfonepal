"use client"

import { useState, useEffect } from "react"
import Select from "react-select"
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

      setSelectedUniversities(
        schoolData.universities?.map((u) => ({ value: u.id, label: u.name })) || []
      )
      setSelectedFacilities(
        schoolData.facilities?.map((f) => ({ value: f.id, label: f.name })) || []
      )
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData()

      const universityIds = selectedUniversities.map((item) => item.value)
      const facilityIds = selectedFacilities.map((item) => item.value)

      if (universityIds.length > 0) {
        universityIds.forEach((id) => formData.append("universities", id))
      } else {
        formData.append("universities", "")
      }

      if (facilityIds.length > 0) {
        facilityIds.forEach((id) => formData.append("facilities", id))
      } else {
        formData.append("facilities", "")
      }

      await updateSchoolOwnProfile(formData)
      alert("Universities and facilities updated successfully!")

      await loadData()
    } catch (error) {
      console.error("Error updating:", error)
      alert("Error updating: " + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="animate-pulse text-gray-600">Loading universities and facilities...</div>
  }

  const universityOptions = universities.map((u) => ({ value: u.id, label: u.name }))
  const facilityOptions = facilities.map((f) => ({ value: f.id, label: f.name }))

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Universities */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Affiliated Universities</h3>
        <Select
          options={universityOptions}
          value={selectedUniversities}
          onChange={setSelectedUniversities}
          isMulti
          placeholder="Select affiliated universities"
          className="react-select-container"
          classNamePrefix="react-select"
        />
        <p className="text-sm text-gray-500 mt-2">Selected: {selectedUniversities.length} universities</p>
      </div>

      {/* Facilities */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Available Facilities</h3>
        <Select
          options={facilityOptions}
          value={selectedFacilities}
          onChange={setSelectedFacilities}
          isMulti
          placeholder="Select available facilities"
          className="react-select-container"
          classNamePrefix="react-select"
        />
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
