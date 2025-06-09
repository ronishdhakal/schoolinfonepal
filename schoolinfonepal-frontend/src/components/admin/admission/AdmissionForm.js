"use client"

import { useState, useEffect } from "react"
import { createAdmission, updateAdmission } from "@/utils/api"
import AdmissionHeader from "./AdmissionHeader"
import AdmissionAbout from "./AdmissionAbout"

export default function AdmissionForm({ admission = null, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    published_date: "",
    active_from: "",
    active_until: "",
    school_id: "",
    course_ids: [],
    level: "",
    university: "",
    featured: false,
    description: "",
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const isEditing = !!admission

  // Initialize form data when admission prop changes
  useEffect(() => {
    if (admission) {
      console.log("=== INITIALIZING FORM ===")
      console.log("Raw admission data:", admission)

      const initialData = {
        title: admission.title || "",
        slug: admission.slug || "",
        published_date: admission.published_date || "",
        active_from: admission.active_from || "",
        active_until: admission.active_until || "",
        school_id: admission.school?.id || "",
        course_ids: admission.courses?.map((course) => course.id) || [],
        // ✅ FIXED: Extract IDs from objects properly
        level: admission.level?.id || "",
        university: admission.university?.id || "",
        featured: admission.featured || false,
        description: admission.description || "",
      }

      console.log("Processed form data:", initialData)
      console.log("Level ID:", initialData.level)
      console.log("University ID:", initialData.university)
      console.log("Course IDs:", initialData.course_ids)

      setFormData(initialData)
    }
  }, [admission])

  const validateForm = () => {
    const newErrors = {}

    // Required fields
    if (!formData.title?.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.published_date) {
      newErrors.published_date = "Published date is required"
    }

    if (!formData.active_from) {
      newErrors.active_from = "Active from date is required"
    }

    if (!formData.active_until) {
      newErrors.active_until = "Active until date is required"
    }

    if (!formData.school_id) {
      newErrors.school_id = "School is required"
    }

    // Date validation
    if (formData.active_from && formData.active_until) {
      if (new Date(formData.active_from) >= new Date(formData.active_until)) {
        newErrors.active_until = "Active until date must be after active from date"
      }
    }

    if (formData.published_date && formData.active_from) {
      if (new Date(formData.published_date) > new Date(formData.active_from)) {
        newErrors.active_from = "Active from date should not be before published date"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setSubmitError("")

    try {
      console.log("=== SUBMITTING FORM ===")
      console.log("Form data before submission:", formData)

      // Prepare form data for submission
      const submitData = new FormData()

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        if (key === "course_ids") {
          // Handle course IDs as JSON string
          submitData.append("courses", JSON.stringify(formData[key]))
          console.log("Added courses:", JSON.stringify(formData[key]))
        } else if (formData[key] !== null && formData[key] !== "") {
          submitData.append(key, formData[key])
          console.log(`Added ${key}:`, formData[key])
        }
      })

      // ✅ FIXED: Debug logging
      console.log("FormData contents:")
      for (const [key, value] of submitData.entries()) {
        console.log(`${key}:`, value)
      }

      let result
      if (isEditing) {
        console.log("Updating admission with slug:", admission.slug)
        result = await updateAdmission(admission.slug, submitData)
      } else {
        console.log("Creating new admission")
        result = await createAdmission(submitData)
      }

      console.log("Submission result:", result)

      if (onSuccess) {
        onSuccess(result)
      }
    } catch (error) {
      console.error("Error submitting admission:", error)
      setSubmitError(error.message || "An error occurred while saving the admission")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{isEditing ? "Edit Admission" : "Create New Admission"}</h1>
        <p className="mt-2 text-gray-600">
          {isEditing ? "Update the admission information below." : "Fill in the details to create a new admission."}
        </p>
      </div>

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">{submitError}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <AdmissionHeader formData={formData} setFormData={setFormData} errors={errors} isEditing={isEditing} />

        <AdmissionAbout formData={formData} setFormData={setFormData} errors={errors} />

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
          >
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
            {loading
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
                ? "Update Admission"
                : "Create Admission"}
          </button>
        </div>
      </form>
    </div>
  )
}
