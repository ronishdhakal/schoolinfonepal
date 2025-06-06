"use client"

import { useState } from "react"

export default function AdvertisementHeader({ advertisement, onEdit, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith("http")) return imagePath
    return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://127.0.0.1:8000"}${imagePath}`
  }

  const handleDelete = () => {
    onDelete?.()
    setShowDeleteConfirm(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{advertisement?.title || "Advertisement"}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <span className="font-medium">Placement:</span>
              <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded">{advertisement?.placement}</span>
            </span>
            <span className="flex items-center">
              <span className="font-medium">Status:</span>
              <span
                className={`ml-1 px-2 py-1 rounded ${
                  advertisement?.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {advertisement?.is_active ? "Active" : "Inactive"}
              </span>
            </span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button onClick={onEdit} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Edit
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Link */}
      {advertisement?.link && (
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-700">Link: </span>
          <a
            href={advertisement.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {advertisement.link}
          </a>
        </div>
      )}

      {/* Images Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {advertisement?.image_mobile && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Mobile Image</h3>
            <img
              src={getImageUrl(advertisement.image_mobile) || "/placeholder.svg"}
              alt="Mobile advertisement"
              className="w-full max-w-xs h-auto object-cover rounded border"
              onError={(e) => {
                e.target.src = "/placeholder.svg?height=200&width=150"
              }}
            />
          </div>
        )}

        {advertisement?.image_desktop && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Desktop Image</h3>
            <img
              src={getImageUrl(advertisement.image_desktop) || "/placeholder.svg"}
              alt="Desktop advertisement"
              className="w-full max-w-md h-auto object-cover rounded border"
              onError={(e) => {
                e.target.src = "/placeholder.svg?height=200&width=300"
              }}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this advertisement? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
