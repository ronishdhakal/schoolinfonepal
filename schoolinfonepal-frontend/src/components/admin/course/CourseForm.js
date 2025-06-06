"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { createCourse, updateCourse, fetchCourseBySlug } from "@/utils/api"

import CourseHeader from "./CourseHeader"
import CourseInfo from "./CourseInfo"
import CourseContent from "./CourseContent"
import CourseMeta from "./CourseMeta"
import CourseAttachments from "./CourseAttachments"

const CourseForm = ({ slug = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    abbreviation: "",
    university: "",
    slug: "",
    duration: "",
    level: "",
    disciplines: [],
    short_description: "",
    outcome: "",
    eligibility: "",
    curriculum: "",
    meta_title: "",
    meta_description: "",
    og_title: "",
    og_description: "",
    og_image: null,
    attachments: [],
  })
  const [loading, setLoading] = useState(!!slug)
  const router = useRouter()

  useEffect(() => {
    if (slug) {
      fetchCourseBySlug(slug)
        .then((data) => {
          setFormData({
            ...data,
            disciplines: data.disciplines || [],
            attachments: data.attachments || [],
          })
          setLoading(false)
        })
        .catch((err) => {
          console.error("Failed to load course:", err)
          setLoading(false)
        })
    }
  }, [slug])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData()

    // Basic fields
    const basicFields = [
      "name",
      "abbreviation",
      "university",
      "slug",
      "duration",
      "level",
      "short_description",
      "long_description",
      "outcome",
      "eligibility",
      "curriculum",
      "meta_title",
      "meta_description",
      "og_title",
      "og_description",
    ]

    basicFields.forEach((field) => {
      if (formData[field] !== undefined && formData[field] !== null) {
        data.append(field, formData[field])
      }
    })

    // Disciplines (many-to-many)
    data.append("disciplines", JSON.stringify(formData.disciplines || []))

    // OG Image
    if (formData.og_image instanceof File) {
      data.append("og_image", formData.og_image)
    }

    // Replace the current attachments handling with this:
    // Don't send attachments in JSON if we're not modifying them
    // Only send attachment files that are actually new files
    const newAttachmentFiles = (formData.attachment_files || []).filter((file) => file instanceof File)
    if (newAttachmentFiles.length > 0) {
      newAttachmentFiles.forEach((file) => {
        data.append("attachment_files", file)
      })
    }

    // Only send attachments JSON if we're explicitly managing them
    // For updates, we'll let the backend handle existing attachments unless we're removing them
    if (!slug || (formData.attachments && formData.attachments.length === 0)) {
      data.append("attachments", JSON.stringify(formData.attachments || []))
    }

    // Handle attachment removals
    if (formData.attachments_to_remove && formData.attachments_to_remove.length > 0) {
      data.append("remove_attachments", JSON.stringify(formData.attachments_to_remove))
    }

    try {
      if (slug) {
        await updateCourse(slug, data)
      } else {
        await createCourse(data)
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/admin/courses")
      }
    } catch (err) {
      console.error("Error submitting form:", err)
      alert("Submission failed. Please check the console for details.")
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <CourseHeader formData={formData} setFormData={setFormData} />
      <CourseInfo formData={formData} setFormData={setFormData} />
      <CourseContent formData={formData} setFormData={setFormData} />
      <CourseMeta formData={formData} setFormData={setFormData} />
      <CourseAttachments formData={formData} setFormData={setFormData} />

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={() => router.push("/admin/courses")}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
        >
          {slug ? "Update Course" : "Create Course"}
        </button>
      </div>
    </form>
  )
}

export default CourseForm
