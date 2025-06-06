"use client"
import { useState, useEffect } from "react"
import { fetchDistrictsDropdown, fetchLevelsDropdown, fetchTypesDropdown } from "@/utils/api"

const SchoolHeader = ({ formData, setFormData }) => {
  const [districts, setDistricts] = useState([])
  const [levels, setLevels] = useState([])
  const [types, setTypes] = useState([])
  const [imageErrors, setImageErrors] = useState({})

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [districtsData, levelsData, typesData] = await Promise.all([
          fetchDistrictsDropdown(),
          fetchLevelsDropdown(),
          fetchTypesDropdown(),
        ])
        setDistricts(districtsData)
        setLevels(levelsData)
        setTypes(typesData)
      } catch (err) {
        console.error("Failed to load dropdowns:", err)
      }
    }
    loadDropdowns()
  }, [])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (field, e) => {
    const file = e.target.files[0]
    if (file) {
      handleChange(field, file)
      // Clear error state when new file is selected
      const newErrors = { ...imageErrors }
      delete newErrors[field]
      setImageErrors(newErrors)
    }
  }

  // Helper function to get image URL safely
  const getImageUrl = (image, field) => {
    if (image instanceof File) {
      return URL.createObjectURL(image)
    }
    if (typeof image === "string") {
      // Skip if it's already marked as error
      if (imageErrors[field]) {
        return "/placeholder.svg"
      }

      // If it contains full URL or invalid characters, mark as error
      if (image.includes("http:") || image.includes("http%3A")) {
        setImageErrors((prev) => ({ ...prev, [field]: true }))
        return "/placeholder.svg"
      }

      // If it's a valid relative path
      if (image.startsWith("/")) {
        return `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}${image}`
      }
    }
    return "/placeholder.svg"
  }

  const handleImageError = (field) => {
    setImageErrors((prev) => ({ ...prev, [field]: true }))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">School Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">School Name *</label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter school name"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input
            type="text"
            value={formData.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter school address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
          <select
            value={formData.district || ""}
            onChange={(e) => handleChange("district", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Level Text</label>
          <input
            type="text"
            value={formData.level_text || ""}
            onChange={(e) => handleChange("level_text", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Custom level description"
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
            placeholder="https://school.edu"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Map Link</label>
          <input
            type="url"
            value={formData.map_link || ""}
            onChange={(e) => handleChange("map_link", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Google Maps link"
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

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.verification || false}
              onChange={(e) => handleChange("verification", e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Verified School</span>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.featured || false}
              onChange={(e) => handleChange("featured", e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Featured School</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange("logo", e)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {formData.logo && (
            <div className="mt-2">
              <img
                src={getImageUrl(formData.logo, "logo") || "/placeholder.svg"}
                alt="Current Logo"
                className="h-16 w-16 object-cover rounded border"
                onError={() => handleImageError("logo")}
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
          {formData.cover_photo && (
            <div className="mt-2">
              <img
                src={getImageUrl(formData.cover_photo, "cover_photo") || "/placeholder.svg"}
                alt="Current Cover"
                className="h-16 w-24 object-cover rounded border"
                onError={() => handleImageError("cover_photo")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SchoolHeader
