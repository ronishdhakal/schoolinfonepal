"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { createSchool, updateSchool, fetchSchoolBySlug } from "@/utils/api"

import SchoolHeader from "./SchoolHeader"
import SchoolContact from "./SchoolContact"
import SchoolAbout from "./SchoolAbout"
import SchoolGallery from "./SchoolGallery"
import SchoolBrochure from "./SchoolBrochure"
import SchoolSocialMedia from "./SchoolSocialMedia"
import SchoolFAQ from "./SchoolFAQ"
import SchoolMessage from "./SchoolMessage"
import SchoolCourses from "./SchoolCourses"
import SchoolFacilities from "./SchoolFacilities"
import SchoolUniversity from "./SchoolUniversity"
import SchoolMeta from "./SchoolMeta"

// Utility functions for processing nested data with files
function processGallery(gallery) {
  const metadata = []
  const files = {}
  ;(gallery || []).forEach((item, i) => {
    if (item.image instanceof File) {
      files[`gallery_${i}_image`] = item.image
      metadata.push({ caption: item.caption || "" })
    } else {
      metadata.push({ image: item.image, caption: item.caption || "" })
    }
  })
  return { metadata, files }
}

function processBrochures(brochures) {
  const metadata = []
  const files = {}
  ;(brochures || []).forEach((item, i) => {
    if (item.file instanceof File) {
      files[`brochures_${i}_file`] = item.file
      metadata.push({ description: item.description || "" })
    } else {
      metadata.push({ file: item.file, description: item.description || "" })
    }
  })
  return { metadata, files }
}

function processMessages(messages) {
  if (!messages || !messages.length) return { metadata: [], files: {} }
  const metadata = []
  const files = {}
  messages.forEach((item, i) => {
    const meta = { ...item }
    if (item.image instanceof File) {
      files[`messages_${i}_image`] = item.image
      meta.image = ""
    }
    metadata.push(meta)
  })
  return { metadata, files }
}

const SchoolForm = ({ slug = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    admin_email: "",
    address: "",
    established_date: "",
    verification: false,
    featured: false,
    district_id: "",
    level_id: "",
    level_text: "",
    type_id: "",
    website: "",
    priority: 999,
    map_link: "",
    salient_feature: "",
    scholarship: "",
    about_college: "",
    phones: [],
    emails: [],
    gallery: [],
    brochures: [],
    social_media: [],
    faqs: [],
    messages: [],
    school_courses: [],
    facilities: [],
    universities: [],
    meta_title: "",
    meta_description: "",
    og_title: "",
    og_description: "",
    logo: null,
    cover_photo: null,
    og_image: null,
  })

  // ✅ NEW: Track which sections have been modified
  const [modifiedSections, setModifiedSections] = useState({
    gallery: false,
    brochures: false,
    messages: false,
  })

  const [loading, setLoading] = useState(!!slug)
  const [originalData, setOriginalData] = useState({}) // Store original data for comparison
  const router = useRouter()

  useEffect(() => {
    if (slug) {
      fetchSchoolBySlug(slug)
        .then((data) => {
          // ✅ FIXED: Process school_courses to use course_id format
          const processedSchoolCourses = (data.school_courses_display || data.school_courses || []).map((sc) => ({
            course_id: sc.course?.id || sc.course_id || sc.course,
            fee: sc.fee || "",
            status: sc.status || "Open",
            admin_open: sc.admin_open !== false,
          }))

          // ✅ FIXED: Process facilities and universities to use IDs
          const facilityIds = (data.facilities || []).map((f) => f.id)
          const universityIds = (data.universities || []).map((u) => u.id)

          const processedData = {
            ...data,
            // ✅ FIXED: Map the relationship IDs correctly
            district_id: data.district?.id || "",
            level_id: data.level?.id || "",
            type_id: data.type?.id || "",
            phones: data.phones || [],
            emails: data.emails || [],
            gallery: data.gallery || [],
            brochures: data.brochures || [],
            social_media: data.social_media || [],
            faqs: data.faqs || [],
            messages: data.messages || [],
            school_courses: processedSchoolCourses,
            facilities: facilityIds,
            universities: universityIds,
          }

          setFormData(processedData)
          setOriginalData(processedData) // Store original data
          setLoading(false)
        })
        .catch((err) => {
          console.error("Failed to load school:", err)
          setLoading(false)
        })
    }
  }, [slug])

  // ✅ NEW: Enhanced setFormData to track modifications
  const updateFormData = (updater) => {
    setFormData((prev) => {
      const newData = typeof updater === "function" ? updater(prev) : updater

      // Check if gallery, brochures, or messages have been modified
      if (originalData.gallery && JSON.stringify(newData.gallery) !== JSON.stringify(originalData.gallery)) {
        setModifiedSections((ms) => ({ ...ms, gallery: true }))
      }
      if (originalData.brochures && JSON.stringify(newData.brochures) !== JSON.stringify(originalData.brochures)) {
        setModifiedSections((ms) => ({ ...ms, brochures: true }))
      }
      if (originalData.messages && JSON.stringify(newData.messages) !== JSON.stringify(originalData.messages)) {
        setModifiedSections((ms) => ({ ...ms, messages: true }))
      }

      return newData
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData()

    // Basic fields
    const basicFields = [
      "name",
      "admin_email",
      "address",
      "established_date",
      "verification",
      "featured",
      "district_id",
      "level_id",
      "level_text",
      "type_id",
      "website",
      "priority",
      "map_link",
      "salient_feature",
      "scholarship",
      "about_college",
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

    // Images
    if (formData.logo instanceof File) {
      data.append("logo", formData.logo)
    }
    if (formData.cover_photo instanceof File) {
      data.append("cover_photo", formData.cover_photo)
    }
    if (formData.og_image instanceof File) {
      data.append("og_image", formData.og_image)
    }

    // ✅ FIXED: Only send gallery data if it has been modified or it's a new school
    if (!slug || modifiedSections.gallery) {
      data.append("update_gallery", "true")
      const { metadata: galleryMeta, files: galleryFiles } = processGallery(formData.gallery)
      data.append("gallery", JSON.stringify(galleryMeta))
      Object.entries(galleryFiles).forEach(([key, file]) => {
        data.append(key, file)
      })
      console.log("Sending gallery data:", galleryMeta)
    }

    // ✅ FIXED: Only send brochures data if it has been modified or it's a new school
    if (!slug || modifiedSections.brochures) {
      data.append("update_brochures", "true")
      const { metadata: brochuresMeta, files: brochuresFiles } = processBrochures(formData.brochures)
      data.append("brochures", JSON.stringify(brochuresMeta))
      Object.entries(brochuresFiles).forEach(([key, file]) => {
        data.append(key, file)
      })
      console.log("Sending brochures data:", brochuresMeta)
    }

    // ✅ FIXED: Only send messages data if it has been modified or it's a new school
    if (!slug || modifiedSections.messages) {
      data.append("update_messages", "true")
      const { metadata: messagesMeta, files: messagesFiles } = processMessages(formData.messages)
      data.append("messages", JSON.stringify(messagesMeta))
      Object.entries(messagesFiles).forEach(([key, file]) => {
        data.append(key, file)
      })
      console.log("Sending messages data:", messagesMeta)
    }

    // Simple JSON fields
    data.append("phones", JSON.stringify(formData.phones || []))
    data.append("emails", JSON.stringify(formData.emails || []))
    data.append("social_media", JSON.stringify(formData.social_media || []))
    data.append("faqs", JSON.stringify(formData.faqs || []))

    // ✅ FIXED: Process school_courses to ensure course_id is used
    const processedCourses = (formData.school_courses || [])
      .filter((sc) => sc.course_id)
      .map((sc) => ({
        course_id: Number.parseInt(sc.course_id),
        fee: sc.fee || "",
        status: sc.status || "Open",
        admin_open: sc.admin_open !== false,
      }))
    data.append("school_courses", JSON.stringify(processedCourses))

    // ✅ FIXED: M2M fields - ALWAYS send the keys, even if empty
    const facilityIds = Array.isArray(formData.facilities) ? formData.facilities : []
    const universityIds = Array.isArray(formData.universities) ? formData.universities : []

    // ✅ CRITICAL FIX: Always append the keys, even if arrays are empty
    if (facilityIds.length > 0) {
      facilityIds.forEach((id) => {
        if (id) data.append("facilities", id)
      })
    } else {
      // Send empty value to indicate "clear all facilities"
      data.append("facilities", "")
    }

    if (universityIds.length > 0) {
      universityIds.forEach((id) => {
        if (id) data.append("universities", id)
      })
    } else {
      // Send empty value to indicate "clear all universities"
      data.append("universities", "")
    }

    // Debug logging
    console.log("=== FRONTEND DEBUG ===")
    console.log("Modified sections:", modifiedSections)
    console.log("Submitting school courses:", processedCourses)
    console.log("Submitting facilities:", facilityIds)
    console.log("Submitting universities:", universityIds)

    try {
      if (slug) {
        await updateSchool(slug, data)
      } else {
        await createSchool(data)
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/admin/schools")
      }
    } catch (err) {
      console.error("Error submitting form:", err)
      alert("Submission failed. Please check the console for details.")
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <SchoolHeader formData={formData} setFormData={updateFormData} />
      <SchoolContact formData={formData} setFormData={updateFormData} />
      <SchoolAbout formData={formData} setFormData={updateFormData} />
      <SchoolGallery formData={formData} setFormData={updateFormData} />
      <SchoolBrochure formData={formData} setFormData={updateFormData} />
      <SchoolSocialMedia formData={formData} setFormData={updateFormData} />
      <SchoolFAQ formData={formData} setFormData={updateFormData} />
      <SchoolMessage formData={formData} setFormData={updateFormData} />
      <SchoolCourses formData={formData} setFormData={updateFormData} />
      <SchoolFacilities formData={formData} setFormData={updateFormData} />
      <SchoolUniversity formData={formData} setFormData={updateFormData} />
      <SchoolMeta formData={formData} setFormData={updateFormData} />

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={() => router.push("/admin/schools")}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
        >
          {slug ? "Update School" : "Create School"}
        </button>
      </div>
    </form>
  )
}

export default SchoolForm
