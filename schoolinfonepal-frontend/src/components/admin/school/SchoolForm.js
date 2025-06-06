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
    address: "",
    established_date: "",
    verification: false,
    featured: false,
    district: "",
    level: "",
    level_text: "",
    type: "",
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
  const [loading, setLoading] = useState(!!slug)
  const router = useRouter()

  useEffect(() => {
    if (slug) {
      fetchSchoolBySlug(slug)
        .then((data) => {
          setFormData({
            ...data,
            phones: data.phones || [],
            emails: data.emails || [],
            gallery: data.gallery || [],
            brochures: data.brochures || [],
            social_media: data.social_media || [],
            faqs: data.faqs || [],
            messages: data.messages || [],
            school_courses: data.school_courses || [],
            facilities: data.facilities || [],
            universities: data.universities || [],
          })
          setLoading(false)
        })
        .catch((err) => {
          console.error("Failed to load school:", err)
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
      "address",
      "established_date",
      "verification",
      "featured",
      "district",
      "level",
      "level_text",
      "type",
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

    // Gallery
    const { metadata: galleryMeta, files: galleryFiles } = processGallery(formData.gallery)
    data.append("gallery", JSON.stringify(galleryMeta))
    Object.entries(galleryFiles).forEach(([key, file]) => {
      data.append(key, file)
    })

    // Brochures
    const { metadata: brochuresMeta, files: brochuresFiles } = processBrochures(formData.brochures)
    data.append("brochures", JSON.stringify(brochuresMeta))
    Object.entries(brochuresFiles).forEach(([key, file]) => {
      data.append(key, file)
    })

    // Messages
    const { metadata: messagesMeta, files: messagesFiles } = processMessages(formData.messages)
    data.append("messages", JSON.stringify(messagesMeta))
    Object.entries(messagesFiles).forEach(([key, file]) => {
      data.append(key, file)
    })

    // Simple JSON fields
    data.append("phones", JSON.stringify(formData.phones || []))
    data.append("emails", JSON.stringify(formData.emails || []))
    data.append("social_media", JSON.stringify(formData.social_media || []))
    data.append("faqs", JSON.stringify(formData.faqs || []))
    data.append("school_courses", JSON.stringify(formData.school_courses || []))

    // M2M fields
    ;(formData.facilities || []).forEach((id) => data.append("facilities", id))
    ;(formData.universities || []).forEach((id) => data.append("universities", id))

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
      <SchoolHeader formData={formData} setFormData={setFormData} />
      <SchoolContact formData={formData} setFormData={setFormData} />
      <SchoolAbout formData={formData} setFormData={setFormData} />
      <SchoolGallery formData={formData} setFormData={setFormData} />
      <SchoolBrochure formData={formData} setFormData={setFormData} />
      <SchoolSocialMedia formData={formData} setFormData={setFormData} />
      <SchoolFAQ formData={formData} setFormData={setFormData} />
      <SchoolMessage formData={formData} setFormData={setFormData} />
      <SchoolCourses formData={formData} setFormData={setFormData} />
      <SchoolFacilities formData={formData} setFormData={setFormData} />
      <SchoolUniversity formData={formData} setFormData={setFormData} />
      <SchoolMeta formData={formData} setFormData={setFormData} />

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
