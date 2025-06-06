"use client"
import { useState } from "react"

const SchoolMessage = ({ formData, setFormData }) => {
  const [imageErrors, setImageErrors] = useState({})

  const handleMessageChange = (index, field, value) => {
    const messages = [...(formData.messages || [])]
    messages[index] = { ...messages[index], [field]: value }
    setFormData((prev) => ({ ...prev, messages }))
  }

  const handleImageChange = (index, e) => {
    const file = e.target.files[0]
    if (file) {
      handleMessageChange(index, "image", file)
      // Clear error state when new file is selected
      const newErrors = { ...imageErrors }
      delete newErrors[index]
      setImageErrors(newErrors)
    }
  }

  const addMessage = () => {
    setFormData((prev) => ({
      ...prev,
      messages: [...(prev.messages || []), { title: "", message: "", name: "", designation: "", image: null }],
    }))
  }

  const removeMessage = (index) => {
    const messages = (formData.messages || []).filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, messages }))

    // Remove error state for this image
    const newErrors = { ...imageErrors }
    delete newErrors[index]
    setImageErrors(newErrors)
  }

  // Helper function to get image URL safely
  const getImageUrl = (image, index) => {
    if (image instanceof File) {
      return URL.createObjectURL(image)
    }
    if (typeof image === "string") {
      // Skip if it's already marked as error
      if (imageErrors[index]) {
        return "/placeholder.svg?height=80&width=80"
      }

      // If it contains full URL or invalid characters, mark as error
      if (image.includes("http:") || image.includes("http%3A")) {
        setImageErrors((prev) => ({ ...prev, [index]: true }))
        return "/placeholder.svg?height=80&width=80"
      }

      // If it's a valid relative path
      if (image.startsWith("/")) {
        return `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}${image}`
      }
    }
    return "/placeholder.svg?height=80&width=80"
  }

  const handleImageError = (index) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Principal/Head Messages</h3>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Add messages from principal, head, or other officials</p>
          <button
            type="button"
            onClick={addMessage}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            + Add Message
          </button>
        </div>

        {formData.messages && formData.messages.length > 0 && (
          <div className="space-y-6">
            {formData.messages.map((msg, index) => (
              <div key={index} className="p-6 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={msg.title || ""}
                        onChange={(e) => handleMessageChange(index, "title", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Message title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={msg.name || ""}
                        onChange={(e) => handleMessageChange(index, "name", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                      <input
                        type="text"
                        value={msg.designation || ""}
                        onChange={(e) => handleMessageChange(index, "designation", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g., Principal, Head Teacher"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(index, e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      {msg.image && (
                        <div className="mt-2">
                          <img
                            src={getImageUrl(msg.image, index) || "/placeholder.svg"}
                            alt="Message author"
                            className="h-20 w-20 object-cover rounded-lg border"
                            onError={() => handleImageError(index)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={msg.message || ""}
                    onChange={(e) => handleMessageChange(index, "message", e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter the message content"
                  />
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => removeMessage(index)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {(!formData.messages || formData.messages.length === 0) && (
          <p className="text-gray-500 text-sm text-center py-4">No messages added</p>
        )}
      </div>
    </div>
  )
}

export default SchoolMessage
