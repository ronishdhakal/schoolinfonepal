"use client"

import { useState, useEffect } from "react"
import { fetchSchoolOwnProfile, updateSchoolOwnProfile } from "../../../utils/api"

export default function ProfileGallery() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentGallery, setCurrentGallery] = useState([])
  const [galleryItems, setGalleryItems] = useState([{ caption: "", file: null }])

  useEffect(() => {
    loadGalleryData()
  }, [])

  const loadGalleryData = async () => {
    try {
      const schoolData = await fetchSchoolOwnProfile()
      setCurrentGallery(schoolData.gallery || [])
    } catch (error) {
      console.error("Error loading gallery:", error)
    } finally {
      setLoading(false)
    }
  }

  const addGalleryItem = () => {
    setGalleryItems([...galleryItems, { caption: "", file: null }])
  }

  const removeGalleryItem = (index) => {
    setGalleryItems(galleryItems.filter((_, i) => i !== index))
  }

  const updateGalleryItem = (index, field, value) => {
    const updated = galleryItems.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    setGalleryItems(updated)
  }

  const handleFileChange = (index, file) => {
    updateGalleryItem(index, "file", file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData()

      // Filter items that have files
      const validItems = galleryItems.filter((item) => item.file)

      formData.append("gallery", JSON.stringify(validItems.map((item) => ({ caption: item.caption }))))

      validItems.forEach((item, index) => {
        formData.append(`gallery_${index}_image`, item.file)
      })

      await updateSchoolOwnProfile(formData)
      alert("Gallery updated successfully!")
      loadGalleryData() // Reload to show updated gallery
      setGalleryItems([{ caption: "", file: null }]) // Reset form
    } catch (error) {
      console.error("Error updating gallery:", error)
      alert("Error updating gallery: " + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading gallery...</div>
  }

  return (
    <div className="space-y-8">
      {/* Current Gallery */}
      {currentGallery.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Current Gallery</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentGallery.map((item, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.caption || `Gallery image ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
                {item.caption && (
                  <div className="p-3">
                    <p className="text-sm text-gray-600">{item.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Gallery Items */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Add New Gallery Items</h3>
          <button
            type="button"
            onClick={addGalleryItem}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            Add Item
          </button>
        </div>

        <div className="space-y-4">
          {galleryItems.map((item, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(index, e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                  <input
                    type="text"
                    value={item.caption}
                    onChange={(e) => updateGalleryItem(index, "caption", e.target.value)}
                    placeholder="Image caption"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {galleryItems.length > 1 && (
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeGalleryItem(index)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Gallery"}
          </button>
        </div>
      </form>
    </div>
  )
}
