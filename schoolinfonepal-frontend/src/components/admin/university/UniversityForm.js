"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { createUniversity, updateUniversity, fetchUniversityBySlug } from "@/utils/api"

import UniversityHeader from "./UniversityHeader"
import UniversityContact from "./UniversityContact"
import UniversityAbout from "./UniversityAbout"
import UniversityGallery from "./UniversityGallery"
import UniversityMeta from "./UniversityMeta"

// Utility: Extract metadata and collect files for gallery
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

const UniversityForm = ({ slug = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    established_date: "",
    type: "",
    website: "",
    location: "",
    salient_features: "",
    about: "",
    priority: 999,
    foreign_affiliated: false,
    status: true,
    is_verified: false,
    phones: [],
    emails: [],
    gallery: [],
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
      fetchUniversityBySlug(slug)
        .then((data) => {
          setFormData({
            ...data,
            phones: data.phones || [],
            emails: data.emails || [],
            gallery: data.gallery || [],
          })
          setLoading(false)
        })
        .catch((err) => {
          console.error("Failed to load university:", err)
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
      "type",
      "website",
      "location",
      "salient_features",
      "about",
      "priority",
      "foreign_affiliated",
      "status",
      "is_verified",
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

    // Phones and Emails
    data.append("phones", JSON.stringify(formData.phones || []))
    data.append("emails", JSON.stringify(formData.emails || []))

    try {
      if (slug) {
        await updateUniversity(slug, data)
      } else {
        await createUniversity(data)
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/admin/universities")
      }
    } catch (err) {
      console.error("Error submitting form:", err)
      alert("Submission failed. Please check the console for details.")
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <UniversityHeader formData={formData} setFormData={setFormData} />
      <UniversityContact formData={formData} setFormData={setFormData} />
      <UniversityAbout formData={formData} setFormData={setFormData} />
      <UniversityGallery formData={formData} setFormData={setFormData} />
      <UniversityMeta formData={formData} setFormData={setFormData} />

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={() => router.push("/admin/universities")}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
        >
          {slug ? "Update University" : "Create University"}
        </button>
      </div>
    </form>
  )
}

export default UniversityForm
