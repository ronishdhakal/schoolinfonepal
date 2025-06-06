"use client"

import { useState, useEffect } from "react"

const FacilityForm = ({ facility, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  })
  const [iconFile, setIconFile] = useState(null)
  const [iconPreview, setIconPreview] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (facility) {
      setFormData({
        name: facility.name || "",
        slug: facility.slug || "",
      })
      if (facility.icon) {
        setIconPreview(facility.icon)
      }
    }
  }, [facility])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleIconChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          icon: "Please select a valid image file",
        }))
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          icon: "Image size should be less than 5MB",
        }))
        return
      }

      setIconFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setIconPreview(e.target.result)
      }
      reader.readAsDataURL(file)

      // Clear error
      if (errors.icon) {
        setErrors((prev) => ({
          ...prev,
          icon: "",
        }))
      }
    }
  }

  const removeIcon = () => {
    setIconFile(null)
    setIconPreview(facility?.icon || null)
    document.getElementById("icon").value = ""
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Facility name is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const submitData = new FormData()
    submitData.append("name", formData.name.trim())
    if (formData.slug.trim()) {
      submitData.append("slug", formData.slug.trim())
    }
    if (iconFile) {
      submitData.append("icon", iconFile)
    }

    onSubmit(submitData)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">{facility ? "Edit Facility" : "Create New Facility"}</h3>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Facility Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Facility Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.name ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Enter facility name"
            disabled={isLoading}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Custom Slug (Optional) */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
            Custom Slug (Optional)
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Leave empty for auto-generation"
            disabled={isLoading || facility} // Disable slug editing for existing facilities
          />
          <p className="mt-1 text-xs text-gray-500">
            {facility ? "Slug cannot be changed after creation" : "If left empty, will be auto-generated from name"}
          </p>
        </div>

        {/* Icon Upload */}
        <div>
          <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-2">
            Facility Icon
          </label>

          {/* Current/Preview Icon */}
          {iconPreview && (
            <div className="mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={iconPreview || "/placeholder.svg"}
                    alt="Icon preview"
                    className="h-16 w-16 object-cover rounded-lg border border-gray-300"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{iconFile ? "New icon selected" : "Current icon"}</p>
                  <button type="button" onClick={removeIcon} className="mt-1 text-sm text-red-600 hover:text-red-800">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}

          <input
            type="file"
            id="icon"
            name="icon"
            accept="image/*"
            onChange={handleIconChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
          {errors.icon && <p className="mt-1 text-sm text-red-600">{errors.icon}</p>}
          <p className="mt-1 text-xs text-gray-500">Supported formats: JPG, PNG, GIF. Max size: 5MB</p>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : facility ? "Update Facility" : "Create Facility"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default FacilityForm
