"use client"
import { useState, useEffect } from "react"
import { fetchTypesDropdown } from "@/utils/api"

const UniversityHeader = ({ formData, setFormData }) => {
  const [types, setTypes] = useState([])

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const data = await fetchTypesDropdown()
        setTypes(data)
      } catch (err) {
        console.error("Failed to load types:", err)
      }
    }
    loadTypes()
  }, [])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (field, e) => {
    const file = e.target.files[0]
    if (file) {
      handleChange(field, file)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">University Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">University Name *</label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter university name"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
          <input
            type="text"
            value={formData.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter university address"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select
            value={formData.type || ""}
            onChange={(e) => handleChange("type", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Type</option>
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Established Date</label>
          <input
            type="date"
            value={formData.established_date || ""}
            onChange={(e) => handleChange("established_date", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
          <input
            type="url"
            value={formData.website || ""}
            onChange={(e) => handleChange("website", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="https://university.edu"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location/Map Link</label>
          <input
            type="text"
            value={formData.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Location or Google Maps link"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <input
            type="number"
            value={formData.priority || 999}
            onChange={(e) => handleChange("priority", Number.parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            min="1"
            max="999"
          />
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Verification Status</label>
            <select
              value={formData.is_verified ? "true" : "false"}
              onChange={(e) => handleChange("is_verified", e.target.value === "true")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="false">Not Verified</option>
              <option value="true">Verified</option>
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.foreign_affiliated || false}
                onChange={(e) => handleChange("foreign_affiliated", e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Foreign Affiliated</span>
            </label>
          </div>

          <div className="flex items-end">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.status !== false}
                onChange={(e) => handleChange("status", e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Active Status</span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange("logo", e)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {formData.logo && typeof formData.logo === "string" && (
            <div className="mt-2">
              <img
                src={formData.logo || "/placeholder.svg"}
                alt="Current Logo"
                className="h-16 w-16 object-cover rounded border"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cover Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange("cover_photo", e)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {formData.cover_photo && typeof formData.cover_photo === "string" && (
            <div className="mt-2">
              <img
                src={formData.cover_photo || "/placeholder.svg"}
                alt="Current Cover"
                className="h-16 w-24 object-cover rounded border"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UniversityHeader
