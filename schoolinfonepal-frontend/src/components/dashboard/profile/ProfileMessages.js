"use client"

import { useState, useEffect } from "react"
import { fetchSchoolOwnProfile, updateSchoolOwnProfile } from "../../../utils/api"

export default function ProfileMessages() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentMessages, setCurrentMessages] = useState([])
  const [messages, setMessages] = useState([{ title: "", message: "", name: "", designation: "", file: null }])

  useEffect(() => {
    loadMessagesData()
  }, [])

  const loadMessagesData = async () => {
    try {
      const schoolData = await fetchSchoolOwnProfile()
      setCurrentMessages(schoolData.messages || [])
    } catch (error) {
      console.error("Error loading messages:", error)
    } finally {
      setLoading(false)
    }
  }

  const addMessage = () => {
    setMessages([...messages, { title: "", message: "", name: "", designation: "", file: null }])
  }

  const removeMessage = (index) => {
    setMessages(messages.filter((_, i) => i !== index))
  }

  const updateMessage = (index, field, value) => {
    const updated = messages.map((msg, i) => (i === index ? { ...msg, [field]: value } : msg))
    setMessages(updated)
  }

  const handleFileChange = (index, file) => {
    updateMessage(index, "file", file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData()

      // Filter messages that have at least some content
      const validMessages = messages.filter(
        (msg) => msg.title.trim() || msg.message.trim() || msg.name.trim() || msg.designation.trim() || msg.file,
      )

      formData.append(
        "messages",
        JSON.stringify(
          validMessages.map((msg) => ({
            title: msg.title,
            message: msg.message,
            name: msg.name,
            designation: msg.designation,
          })),
        ),
      )

      validMessages.forEach((msg, index) => {
        if (msg.file) {
          formData.append(`messages_${index}_image`, msg.file)
        }
      })

      await updateSchoolOwnProfile(formData)
      alert("Messages updated successfully!")
      loadMessagesData() // Reload to show updated messages
      setMessages([{ title: "", message: "", name: "", designation: "", file: null }]) // Reset form
    } catch (error) {
      console.error("Error updating messages:", error)
      alert("Error updating messages: " + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading messages...</div>
  }

  return (
    <div className="space-y-8">
      {/* Current Messages */}
      {currentMessages.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Current Messages</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentMessages.map((msg, index) => (
              <div key={index} className="border rounded-lg p-4">
                {msg.image && (
                  <img
                    src={msg.image || "/placeholder.svg"}
                    alt={msg.name}
                    className="w-16 h-16 rounded-full object-cover mb-3"
                  />
                )}
                <h4 className="font-medium text-gray-900">{msg.title}</h4>
                <p className="text-gray-600 mb-2">{msg.message}</p>
                <div className="text-sm text-gray-500">
                  <p className="font-medium">{msg.name}</p>
                  <p>{msg.designation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Messages */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Add New Messages</h3>
          <button
            type="button"
            onClick={addMessage}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            Add Message
          </button>
        </div>

        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={msg.title}
                    onChange={(e) => updateMessage(index, "title", e.target.value)}
                    placeholder="Message title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Person Name</label>
                  <input
                    type="text"
                    value={msg.name}
                    onChange={(e) => updateMessage(index, "name", e.target.value)}
                    placeholder="Person's name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={msg.designation}
                    onChange={(e) => updateMessage(index, "designation", e.target.value)}
                    placeholder="Person's designation"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(index, e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={msg.message}
                  onChange={(e) => updateMessage(index, "message", e.target.value)}
                  placeholder="Enter message content"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {messages.length > 1 && (
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeMessage(index)}
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
            {saving ? "Saving..." : "Save Messages"}
          </button>
        </div>
      </form>
    </div>
  )
}
