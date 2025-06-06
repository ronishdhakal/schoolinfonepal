"use client"

import { useState, useEffect } from "react"
import {
  createInformation,
  updateInformation,
  fetchSchoolsDropdown,
  fetchUniversitiesDropdown,
  fetchCoursesDropdown,
  fetchLevelsDropdown,
  fetchInformationCategories,
} from "../../../utils/api"
import InformationBasicInfo from "./InformationBasicInfo"
import InformationContent from "./InformationContent"
import InformationRelations from "./InformationRelations"
import InformationMedia from "./InformationMedia"
import InformationMeta from "./InformationMeta"

export default function InformationForm({ information, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    published_date: "",
    summary: "",
    top_description: "",
    below_description: "",
    content: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    featured: false,
    is_active: true,
    universities: [],
    levels: [],
    courses: [],
    schools: [],
  })

  const [featuredImage, setFeaturedImage] = useState(null)
  const [bannerImage, setBannerImage] = useState(null)
  const [dropdowns, setDropdowns] = useState({
    schools: [],
    universities: [],
    courses: [],
    levels: [],
    categories: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    loadDropdowns()
    if (information) {
      setFormData({
        title: information.title || "",
        slug: information.slug || "",
        category: information.category?.id || information.category || "",
        published_date: information.published_date || "",
        summary: information.summary || "",
        top_description: information.top_description || "",
        below_description: information.below_description || "",
        content: information.content || "",
        meta_title: information.meta_title || "",
        meta_description: information.meta_description || "",
        meta_keywords: information.meta_keywords || "",
        featured: information.featured || false,
        is_active: information.is_active !== undefined ? information.is_active : true,
        universities: information.universities?.map((u) => u.id || u) || [],
        levels: information.levels?.map((l) => l.id || l) || [],
        courses: information.courses?.map((c) => c.id || c) || [],
        schools: information.schools?.map((s) => s.id || s) || [],
      })
    }
  }, [information])

  const loadDropdowns = async () => {
    try {
      const [schoolsData, universitiesData, coursesData, levelsData, categoriesData] = await Promise.all([
        fetchSchoolsDropdown(),
        fetchUniversitiesDropdown(),
        fetchCoursesDropdown(),
        fetchLevelsDropdown(),
        fetchInformationCategories(),
      ])
      setDropdowns({
        schools: schoolsData || [],
        universities: universitiesData || [],
        courses: coursesData || [],
        levels: levelsData || [],
        categories: categoriesData || [],
      })
    } catch (err) {
      console.error("Error loading dropdowns:", err)
      setError("Failed to load dropdown data. Please refresh the page.")
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Auto-generate slug from title
    if (name === "title" && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
      setFormData((prev) => ({ ...prev, slug }))
    }

    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleImageChange = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(`${type} image must be less than 5MB`)
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError(`${type} file must be an image`)
        return
      }

      if (type === "featured") {
        setFeaturedImage(file)
      } else if (type === "banner") {
        setBannerImage(file)
      }
    }
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith("http")) return imagePath
    return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://127.0.0.1:8000"}${imagePath}`
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.published_date) newErrors.published_date = "Published date is required"

    // Validate slug format
    if (formData.slug && !/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = "Slug can only contain lowercase letters, numbers, and hyphens"
    }

    // Validate meta fields length
    if (formData.meta_title && formData.meta_title.length > 200) {
      newErrors.meta_title = "Meta title must be 200 characters or less"
    }
    if (formData.meta_description && formData.meta_description.length > 500) {
      newErrors.meta_description = "Meta description must be 500 characters or less"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCategoryCreated = (newCategory) => {
    // Add the new category to the dropdown list
    setDropdowns((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }))

    // Automatically select the newly created category
    setFormData((prev) => ({
      ...prev,
      category: newCategory.id,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      setError("Please fix the errors below")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const submitData = new FormData()

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        if (Array.isArray(formData[key])) {
          // Handle array fields (relationships)
          if (formData[key].length > 0) {
            submitData.append(key, JSON.stringify(formData[key]))
          }
        } else if (formData[key] !== "" && formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key])
        }
      })

      // Add images
      if (featuredImage) {
        submitData.append("featured_image", featuredImage)
      }

      if (bannerImage) {
        submitData.append("banner_image", bannerImage)
      }

      // Submit to API
      if (information) {
        await updateInformation(information.slug, submitData)
      } else {
        await createInformation(submitData)
      }

      onSuccess()
    } catch (err) {
      console.error("Submit error:", err)
      setError(err.message || "Failed to save information")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {information ? "Edit Information" : "Create Information"}
          </h1>
          <p className="text-gray-600 mt-1">
            {information ? "Update existing information post" : "Create a new information post"}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-1 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <InformationBasicInfo
          formData={formData}
          onChange={handleChange}
          categories={dropdowns.categories}
          errors={errors}
          onCategoryCreated={handleCategoryCreated}
        />

        {/* Content Section */}
        <InformationContent formData={formData} onChange={handleChange} errors={errors} />

        {/* Media Section */}
        <InformationMedia
          formData={formData}
          featuredImage={featuredImage}
          bannerImage={bannerImage}
          onImageChange={handleImageChange}
          getImageUrl={getImageUrl}
        />

        {/* Relations Section */}
        <InformationRelations
          formData={formData}
          onChange={handleChange}
          schools={dropdowns.schools}
          universities={dropdowns.universities}
          courses={dropdowns.courses}
          levels={dropdowns.levels}
          errors={errors}
        />

        {/* SEO Meta Section */}
        <InformationMeta formData={formData} onChange={handleChange} errors={errors} />

        {/* Form Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {information
                ? "Last updated: " + new Date(information.updated_at).toLocaleDateString()
                : "New information post"}
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </div>
                ) : information ? (
                  "Update Information"
                ) : (
                  "Create Information"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
