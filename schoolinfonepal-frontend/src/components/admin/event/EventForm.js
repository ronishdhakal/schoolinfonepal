"use client"

import { useState, useEffect } from "react"
import { createEvent, updateEvent, fetchSchoolsDropdown, fetchUniversitiesDropdown } from "../../../utils/api"
import EventBasicInfo from "./EventBasicInfo"
import EventDateTime from "./EventDateTime"
import EventOrganizer from "./EventOrganizer"
import EventRegistration from "./EventRegistration"
import EventMedia from "./EventMedia"
import EventMeta from "./EventMeta"

export default function EventForm({ event, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    short_description: "",
    event_date: "",
    event_end_date: "",
    time: "",
    venue: "",
    event_type: "physical",
    seat_limit: "",
    organizer_school: "",
    organizer_university: "",
    organizer_custom: "",
    registration_type: "free",
    registration_price: "",
    registration_link: "",
    registration_deadline: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    featured: false,
    is_active: true,
  })

  const [featuredImage, setFeaturedImage] = useState(null)
  const [bannerImage, setBannerImage] = useState(null)
  const [schools, setSchools] = useState([])
  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    loadDropdowns()
    if (event) {
      setFormData({
        title: event.title || "",
        slug: event.slug || "",
        description: event.description || "",
        short_description: event.short_description || "",
        event_date: event.event_date || "",
        event_end_date: event.event_end_date || "",
        time: event.time || "",
        venue: event.venue || "",
        event_type: event.event_type || "physical",
        seat_limit: event.seat_limit || "",
        organizer_school: event.organizer_school || "",
        organizer_university: event.organizer_university || "",
        organizer_custom: event.organizer_custom || "",
        registration_type: event.registration_type || "free",
        registration_price: event.registration_price || "",
        registration_link: event.registration_link || "",
        registration_deadline: event.registration_deadline || "",
        meta_title: event.meta_title || "",
        meta_description: event.meta_description || "",
        meta_keywords: event.meta_keywords || "",
        featured: event.featured || false,
        is_active: event.is_active !== undefined ? event.is_active : true,
      })
    }
  }, [event])

  const loadDropdowns = async () => {
    try {
      const [schoolsData, universitiesData] = await Promise.all([fetchSchoolsDropdown(), fetchUniversitiesDropdown()])
      setSchools(schoolsData || [])
      setUniversities(universitiesData || [])
    } catch (err) {
      console.error("Error loading dropdowns:", err)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleImageChange = (e, type) => {
    const file = e.target.files[0]
    if (file) {
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
    if (!formData.event_date) newErrors.event_date = "Event date is required"
    if (!formData.time.trim()) newErrors.time = "Time is required"
    if (!formData.venue.trim()) newErrors.venue = "Venue is required"

    if (!formData.organizer_school && !formData.organizer_university && !formData.organizer_custom.trim()) {
      newErrors.organizer = "Please specify at least one organizer"
    }

    if (formData.registration_type === "paid" && !formData.registration_price) {
      newErrors.registration_price = "Registration price is required for paid events"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== "" && formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key])
        }
      })

      if (featuredImage) {
        submitData.append("featured_image", featuredImage)
      }

      if (bannerImage) {
        submitData.append("banner_image", bannerImage)
      }

      if (event) {
        await updateEvent(event.slug, submitData)
      } else {
        await createEvent(submitData)
      }

      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{event ? "Edit Event" : "Create Event"}</h1>
        <button onClick={onCancel} className="px-4 py-2 text-gray-600 hover:text-gray-800">
          Cancel
        </button>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <EventBasicInfo formData={formData} onChange={handleChange} errors={errors} />

        <EventDateTime formData={formData} onChange={handleChange} errors={errors} />

        <EventOrganizer
          formData={formData}
          onChange={handleChange}
          schools={schools}
          universities={universities}
          errors={errors}
        />

        <EventRegistration formData={formData} onChange={handleChange} errors={errors} />

        <EventMedia
          formData={formData}
          featuredImage={featuredImage}
          bannerImage={bannerImage}
          onImageChange={handleImageChange}
          getImageUrl={getImageUrl}
        />

        <EventMeta formData={formData} onChange={handleChange} errors={errors} />

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
            {loading ? "Saving..." : event ? "Update Event" : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  )
}
