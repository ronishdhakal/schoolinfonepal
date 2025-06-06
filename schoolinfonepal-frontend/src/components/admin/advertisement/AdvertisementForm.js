"use client"

import { useState, useEffect } from "react"
import { createAdvertisement, updateAdvertisement } from "../../../utils/api"

const PLACEMENT_CHOICES = [
  { value: "home-1", label: "Home 1" },
  { value: "home-2", label: "Home 2" },
  { value: "home-3", label: "Home 3" },
  { value: "home-4", label: "Home 4" },
  { value: "home-5", label: "Home 5" },
  { value: "home-6", label: "Home 6" },
  { value: "home-7", label: "Home 7" },
  { value: "home-8", label: "Home 8" },
  { value: "home-9", label: "Home 9" },
  { value: "home-10", label: "Home 10" },
  { value: "home-11", label: "Home 11" },
  { value: "home-12", label: "Home 12" },
]

export default function AdvertisementForm({ advertisement, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    placement: "",
    is_active: true,
  })
  const [files, setFiles] = useState({
    image_mobile: null,
    image_desktop: null,
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const isEdit = !!advertisement

  useEffect(() => {
    if (advertisement) {
      setFormData({
        title: advertisement.title || "",
        link: advertisement.link || "",
        placement: advertisement.placement || "",
        is_active: advertisement.is_active ?? true,
      })
    }
  }, [advertisement])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target
    setFiles((prev) => ({
      ...prev,
      [name]: fileList[0] || null,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.link.trim()) newErrors.link = "Link is required"
    if (!formData.placement) newErrors.placement = "Placement is required"

    if (!isEdit) {
      if (!files.image_mobile) newErrors.image_mobile = "Mobile image is required"
      if (!files.image_desktop) newErrors.image_desktop = "Desktop image is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      const submitData = new FormData()

      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key])
      })

      if (files.image_mobile) {
        submitData.append("image_mobile", files.image_mobile)
      }
      if (files.image_desktop) {
        submitData.append("image_desktop", files.image_desktop)
      }

      if (isEdit) {
        await updateAdvertisement(advertisement.id, submitData)
      } else {
        await createAdvertisement(submitData)
      }

      onSuccess?.()
    } catch (error) {
      console.error("Submit error:", error)
      setErrors({ submit: error.message })
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith("http")) return imagePath
    return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://127.0.0.1:8000"}${imagePath}`
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{isEdit ? "Edit Advertisement" : "Create Advertisement"}</h2>
        <button onClick={onCancel} className="px-4 py-2 text-gray-600 hover:text-gray-800">
          Cancel
        </button>
      </div>

      {errors.submit && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errors.submit}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter advertisement title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Placement *</label>
            <select
              name="placement"
              value={formData.placement}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.placement ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select placement</option>
              {PLACEMENT_CHOICES.map((choice) => (
                <option key={choice.value} value={choice.value}>
                  {choice.label}
                </option>
              ))}
            </select>
            {errors.placement && <p className="mt-1 text-sm text-red-600">{errors.placement}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Link *</label>
          <input
            type="url"
            name="link"
            value={formData.link}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.link ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="https://example.com"
          />
          {errors.link && <p className="mt-1 text-sm text-red-600">{errors.link}</p>}
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Image {!isEdit && "*"}</label>
            <input
              type="file"
              name="image_mobile"
              onChange={handleFileChange}
              accept="image/*"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.image_mobile ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.image_mobile && <p className="mt-1 text-sm text-red-600">{errors.image_mobile}</p>}

            {isEdit && advertisement?.image_mobile && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Current image:</p>
                <img
                  src={getImageUrl(advertisement.image_mobile) || "/placeholder.svg"}
                  alt="Current mobile"
                  className="mt-1 h-20 w-auto object-cover rounded border"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=80&width=80"
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Desktop Image {!isEdit && "*"}</label>
            <input
              type="file"
              name="image_desktop"
              onChange={handleFileChange}
              accept="image/*"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.image_desktop ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.image_desktop && <p className="mt-1 text-sm text-red-600">{errors.image_desktop}</p>}

            {isEdit && advertisement?.image_desktop && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Current image:</p>
                <img
                  src={getImageUrl(advertisement.image_desktop) || "/placeholder.svg"}
                  alt="Current desktop"
                  className="mt-1 h-20 w-auto object-cover rounded border"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=80&width=120"
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  )
}
