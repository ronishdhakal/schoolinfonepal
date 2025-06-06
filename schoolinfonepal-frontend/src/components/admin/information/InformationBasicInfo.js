"use client"

import { useState } from "react"
import CategoryModal from "./CategoryModal"

export default function InformationBasicInfo({ formData, onChange, categories = [], errors = {}, onCategoryCreated }) {
  const [showCategoryModal, setShowCategoryModal] = useState(false)

  const handleCategoryCreated = (newCategory) => {
    if (onCategoryCreated) {
      onCategoryCreated(newCategory)
    }
    setShowCategoryModal(false)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
        <div className="text-sm text-gray-500">Required fields are marked with *</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *{errors.title && <span className="text-red-500 ml-1">({errors.title})</span>}
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            required
            className={`w-full px-3 py-2 border ${
              errors.title ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            } rounded-md focus:outline-none focus:ring-2 text-black placeholder-gray-400`}
            placeholder="Enter information title"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug
            {errors.slug && <span className="text-red-500 ml-1">({errors.slug})</span>}
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={onChange}
            className={`w-full px-3 py-2 border ${
              errors.slug ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            } rounded-md focus:outline-none focus:ring-2 text-black placeholder-gray-400`}
            placeholder="auto-generated-from-title"
          />
          <p className="mt-1 text-xs text-gray-500">URL-friendly version of the title. Leave blank to auto-generate.</p>
        </div>

        {/* Published Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Published Date *
            {errors.published_date && <span className="text-red-500 ml-1">({errors.published_date})</span>}
          </label>
          <input
            type="date"
            name="published_date"
            value={formatDate(formData.published_date)}
            onChange={onChange}
            required
            className={`w-full px-3 py-2 border ${
              errors.published_date ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            } rounded-md focus:outline-none focus:ring-2 text-black`}
          />
        </div>

        {/* Category */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *{errors.category && <span className="text-red-500 ml-1">({errors.category})</span>}
          </label>
          <div className="flex items-center space-x-2">
            <select
              name="category"
              value={formData.category}
              onChange={onChange}
              required
              className={`flex-1 px-3 py-2 border ${
                errors.category ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              } rounded-md focus:outline-none focus:ring-2 text-black`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowCategoryModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 whitespace-nowrap"
            >
              + New Category
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={onChange}
            rows={3}
            maxLength={500}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400"
            placeholder="Brief summary of the information (optional, used for listings and meta description)"
          />
          <div className="flex justify-between mt-1">
            <p className="text-xs text-gray-500">Brief summary for listings and search results</p>
            <p className="text-xs text-gray-500">{formData.summary?.length || 0}/500 characters</p>
          </div>
        </div>

        {/* Status Flags */}
        <div className="md:col-span-2">
          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={onChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Featured Information</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={onChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Active</span>
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Featured information appears prominently on the site. Inactive information is hidden from public view.
          </p>
        </div>
      </div>

      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSuccess={handleCategoryCreated}
      />
    </div>
  )
}
