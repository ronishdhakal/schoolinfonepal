"use client"

import { useState } from "react"

export default function DisciplineHeader({ discipline, onEdit, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = () => {
    onDelete?.()
    setShowDeleteConfirm(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{discipline?.title || "Discipline"}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <span className="font-medium">Slug:</span>
              <span className="ml-1 px-2 py-1 bg-gray-100 text-gray-800 rounded font-mono">{discipline?.slug}</span>
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this discipline? This action cannot be undone.
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
