"use client"

import { useState, useEffect } from "react"

const DistrictForm = ({ district, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (district) {
      setFormData({
        name: district.name || "",
        slug: district.slug || "",
      })
    }
  }, [district])

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

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "District name is required"
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

    onSubmit(submitData)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">{district ? "Edit District" : "Create New District"}</h3>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* District Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            District Name *
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
            placeholder="Enter district name"
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
            disabled={isLoading || district} // Disable slug editing for existing districts
          />
          <p className="mt-1 text-xs text-gray-500">
            {district ? "Slug cannot be changed after creation" : "If left empty, will be auto-generated from name"}
          </p>
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
            {isLoading ? "Saving..." : district ? "Update District" : "Create District"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default DistrictForm
