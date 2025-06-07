"use client"

import { useState, useEffect } from "react"
import { fetchSchoolOwnProfile, updateSchoolOwnProfile } from "../../../utils/api"

export default function ProfileContact() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [phones, setPhones] = useState([{ phone: "" }])
  const [emails, setEmails] = useState([{ email: "" }])
  const [socialMedia, setSocialMedia] = useState([{ platform: "", url: "" }])

  useEffect(() => {
    loadContactData()
  }, [])

  const loadContactData = async () => {
    try {
      const schoolData = await fetchSchoolOwnProfile()

      setPhones(schoolData.phones?.length > 0 ? schoolData.phones : [{ phone: "" }])
      setEmails(schoolData.emails?.length > 0 ? schoolData.emails : [{ email: "" }])
      setSocialMedia(schoolData.social_media?.length > 0 ? schoolData.social_media : [{ platform: "", url: "" }])
    } catch (error) {
      console.error("Error loading contact data:", error)
    } finally {
      setLoading(false)
    }
  }

  const addPhone = () => {
    setPhones([...phones, { phone: "" }])
  }

  const removePhone = (index) => {
    setPhones(phones.filter((_, i) => i !== index))
  }

  const updatePhone = (index, value) => {
    const updated = phones.map((phone, i) => (i === index ? { phone: value } : phone))
    setPhones(updated)
  }

  const addEmail = () => {
    setEmails([...emails, { email: "" }])
  }

  const removeEmail = (index) => {
    setEmails(emails.filter((_, i) => i !== index))
  }

  const updateEmail = (index, value) => {
    const updated = emails.map((email, i) => (i === index ? { email: value } : email))
    setEmails(updated)
  }

  const addSocialMedia = () => {
    setSocialMedia([...socialMedia, { platform: "", url: "" }])
  }

  const removeSocialMedia = (index) => {
    setSocialMedia(socialMedia.filter((_, i) => i !== index))
  }

  const updateSocialMedia = (index, field, value) => {
    const updated = socialMedia.map((social, i) => (i === index ? { ...social, [field]: value } : social))
    setSocialMedia(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData()

      // Filter out empty entries and stringify
      const validPhones = phones.filter((p) => p.phone.trim())
      const validEmails = emails.filter((e) => e.email.trim())
      const validSocialMedia = socialMedia.filter((s) => s.platform.trim() && s.url.trim())

      formData.append("phones", JSON.stringify(validPhones))
      formData.append("emails", JSON.stringify(validEmails))
      formData.append("social_media", JSON.stringify(validSocialMedia))

      await updateSchoolOwnProfile(formData)
      alert("Contact information updated successfully!")
    } catch (error) {
      console.error("Error updating contact:", error)
      alert("Error updating contact: " + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading contact information...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Phone Numbers */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Phone Numbers</h3>
          <button
            type="button"
            onClick={addPhone}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            Add Phone
          </button>
        </div>
        <div className="space-y-3">
          {phones.map((phone, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="tel"
                value={phone.phone}
                onChange={(e) => updatePhone(index, e.target.value)}
                placeholder="Phone number"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {phones.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePhone(index)}
                  className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Email Addresses */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Email Addresses</h3>
          <button
            type="button"
            onClick={addEmail}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            Add Email
          </button>
        </div>
        <div className="space-y-3">
          {emails.map((email, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="email"
                value={email.email}
                onChange={(e) => updateEmail(index, e.target.value)}
                placeholder="Email address"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {emails.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEmail(index)}
                  className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Social Media */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Social Media</h3>
          <button
            type="button"
            onClick={addSocialMedia}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            Add Social Media
          </button>
        </div>
        <div className="space-y-3">
          {socialMedia.map((social, index) => (
            <div key={index} className="flex gap-3">
              <select
                value={social.platform}
                onChange={(e) => updateSocialMedia(index, "platform", e.target.value)}
                className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Platform</option>
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="youtube">YouTube</option>
                <option value="website">Website</option>
              </select>
              <input
                type="url"
                value={social.url}
                onChange={(e) => updateSocialMedia(index, "url", e.target.value)}
                placeholder="URL"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {socialMedia.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSocialMedia(index)}
                  className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Contact Information"}
        </button>
      </div>
    </form>
  )
}
