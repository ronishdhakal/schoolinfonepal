"use client"

import { useState } from "react"

export default function ScholarshipBasicInfo({ formData, onChange, errors }) {
  const [slugEdited, setSlugEdited] = useState(false)

  const handleTitleChange = (e) => {
    const title = e.target.value
    onChange(e)

    // Auto-generate slug if not manually edited
    if (!slugEdited && title) {
      const autoSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()

      onChange({
        target: {
          name: "slug",
          value: autoSlug,
        },
      })
    }
  }

  const handleSlugChange = (e) => {
    setSlugEdited(true)
    onChange(e)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleTitleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
            }`}
            placeholder="Enter scholarship title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* Slug */}
        <div className="md:col-span-2">
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
            URL Slug
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleSlugChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.slug ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
            }`}
            placeholder="auto-generated-from-title"
          />
          {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
          <p className="mt-1 text-sm text-gray-500">URL-friendly version of the title. Leave blank to auto-generate.</p>
        </div>

        {/* Published Date */}
        <div>
          <label htmlFor="published_date" className="block text-sm font-medium text-gray-700 mb-2">
            Published Date *
          </label>
          <input
            type="date"
            id="published_date"
            name="published_date"
            value={formData.published_date}
            onChange={onChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.published_date ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
            }`}
          />
          {errors.published_date && <p className="mt-1 text-sm text-red-600">{errors.published_date}</p>}
        </div>

        {/* Featured */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={onChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
            Featured Scholarship
          </label>
        </div>
      </div>
    </div>
  )
}
