"use client"

import { useState, useEffect } from "react"
import { createDiscipline, updateDiscipline } from "../../../utils/api"

export default function DisciplineForm({ discipline, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const isEdit = !!discipline

  useEffect(() => {
    if (discipline) {
      setFormData({
        title: discipline.title || "",
        slug: discipline.slug || "",
      })
    }
  }, [discipline])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = "Title is required"

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
        if (formData[key]) {
          submitData.append(key, formData[key])
        }
      })

      if (isEdit) {
        await updateDiscipline(discipline.slug, submitData)
      } else {
        await createDiscipline(submitData)
      }

      onSuccess?.()
    } catch (error) {
      console.error("Submit error:", error)
      setErrors({ submit: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{isEdit ? "Edit Discipline" : "Create Discipline"}</h2>
        <button onClick={onCancel} className="px-4 py-2 text-gray-600 hover:text-gray-800">
          Cancel
        </button>
      </div>

      {errors.submit && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errors.submit}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
            placeholder="Enter discipline title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        {!isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Slug (Optional)</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Leave blank to auto-generate from title"
            />
            <p className="mt-1 text-sm text-gray-500">
              If left blank, slug will be automatically generated from the title
            </p>
          </div>
        )}

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
