"use client"

import { useState, useEffect } from "react"
import {
  fetchSchoolOwnProfile,
  updateSchoolOwnProfile,
  fetchDistrictsDropdown,
  fetchLevelsDropdown,
  fetchTypesDropdown,
} from "@/utils/api"

export default function ProfileHeader() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [school, setSchool] = useState({})
  const [districts, setDistricts] = useState([])
  const [levels, setLevels] = useState([])
  const [types, setTypes] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    established_date: "",
    district: "",
    level: "",
    type: "",
    level_text: "",
    website: "",
    salient_feature: "",
    scholarship: "",
    about_college: "",
    meta_title: "",
    meta_description: "",
    og_title: "",
    og_description: "",
  })
  const [files, setFiles] = useState({
    logo: null,
    cover_photo: null,
    og_image: null,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [schoolData, districtsData, levelsData, typesData] = await Promise.all([
        fetchSchoolOwnProfile(),
        fetchDistrictsDropdown(),
        fetchLevelsDropdown(),
        fetchTypesDropdown(),
      ])

      setSchool(schoolData)
      setDistricts(districtsData)
      setLevels(levelsData)
      setTypes(typesData)

      // Convert IDs to strings for proper comparison in select elements
      setFormData({
        name: schoolData.name || "",
        address: schoolData.address || "",
        established_date: schoolData.established_date || "",
        district: schoolData.district?.id ? String(schoolData.district.id) : "",
        level: schoolData.level?.id ? String(schoolData.level.id) : "",
        type: schoolData.type?.id ? String(schoolData.type.id) : "",
        level_text: schoolData.level_text || "",
        website: schoolData.website || "",
        salient_feature: schoolData.salient_feature || "",
        scholarship: schoolData.scholarship || "",
        about_college: schoolData.about_college || "",
        meta_title: schoolData.meta_title || "",
        meta_description: schoolData.meta_description || "",
        og_title: schoolData.og_title || "",
        og_description: schoolData.og_description || "",
      })
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target
    setFiles((prev) => ({
      ...prev,
      [name]: fileList[0],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const submitData = new FormData()

      // Add all form fields, including empty ones (backend might need them)
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key] || "")
      })

      // Add files
      Object.keys(files).forEach((key) => {
        if (files[key]) {
          submitData.append(key, files[key])
        }
      })

      // Debug: Log what we're sending
      console.log("Form data being sent:")
      for (const [key, value] of submitData.entries()) {
        console.log(`${key}: ${value}`)
      }

      await updateSchoolOwnProfile(submitData)
      alert("Profile updated successfully!")
      await loadData() // Reload data to see changes
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Error updating profile: " + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">School Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Established Date</label>
            <input
              type="date"
              name="established_date"
              value={formData.established_date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <select
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district.id} value={String(district.id)}>
                  {district.name}
                </option>
              ))}
            </select>
            {formData.district && (
              <p className="text-xs text-gray-500 mt-1">
                Selected: {districts.find((d) => String(d.id) === formData.district)?.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Level</option>
              {levels.map((level) => (
                <option key={level.id} value={String(level.id)}>
                  {level.title}
                </option>
              ))}
            </select>
            {formData.level && (
              <p className="text-xs text-gray-500 mt-1">
                Selected: {levels.find((l) => String(l.id) === formData.level)?.title}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Type</option>
              {types.map((type) => (
                <option key={type.id} value={String(type.id)}>
                  {type.name}
                </option>
              ))}
            </select>
            {formData.type && (
              <p className="text-xs text-gray-500 mt-1">
                Selected: {types.find((t) => String(t.id) === formData.type)?.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level Text</label>
            <input
              type="text"
              name="level_text"
              value={formData.level_text}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Images</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
            {school.logo && (
              <div className="mb-2">
                <img
                  src={school.logo || "/placeholder.svg"}
                  alt="Current logo"
                  className="h-20 w-20 object-cover rounded"
                />
                <p className="text-xs text-gray-500">Current logo</p>
              </div>
            )}
            <input
              type="file"
              name="logo"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Photo</label>
            {school.cover_photo && (
              <div className="mb-2">
                <img
                  src={school.cover_photo || "/placeholder.svg"}
                  alt="Current cover"
                  className="h-32 w-full object-cover rounded"
                />
                <p className="text-xs text-gray-500">Current cover photo</p>
              </div>
            )}
            <input
              type="file"
              name="cover_photo"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">OG Image</label>
            {school.og_image && (
              <div className="mb-2">
                <img
                  src={school.og_image || "/placeholder.svg"}
                  alt="Current OG image"
                  className="h-32 w-full object-cover rounded"
                />
                <p className="text-xs text-gray-500">Current OG image</p>
              </div>
            )}
            <input
              type="file"
              name="og_image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Text Areas */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Salient Features</label>
          <textarea
            name="salient_feature"
            value={formData.salient_feature}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Scholarship Information</label>
          <textarea
            name="scholarship"
            value={formData.scholarship}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">About College</label>
          <textarea
            name="about_college"
            value={formData.about_college}
            onChange={handleInputChange}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* SEO Fields */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">SEO Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
            <input
              type="text"
              name="meta_title"
              value={formData.meta_title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">OG Title</label>
            <input
              type="text"
              name="og_title"
              value={formData.og_title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
          <textarea
            name="meta_description"
            value={formData.meta_description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">OG Description</label>
          <textarea
            name="og_description"
            value={formData.og_description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  )
}
