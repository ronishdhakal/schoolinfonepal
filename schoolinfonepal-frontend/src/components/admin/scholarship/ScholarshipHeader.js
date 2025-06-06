"use client"

import { useState } from "react"
import { Edit, Trash2, Eye, Calendar, Building, GraduationCap, Award } from "lucide-react"

export default function ScholarshipHeader({
  scholarship,
  onEdit,
  onDelete,
  schools = [],
  universities = [],
  levels = [],
  courses = [],
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const getOrganizerName = () => {
    if (scholarship.organizer_school) {
      const school = schools.find((s) => s.id === scholarship.organizer_school)
      return school?.name || "Unknown School"
    }
    if (scholarship.organizer_university) {
      const university = universities.find((u) => u.id === scholarship.organizer_university)
      return university?.name || "Unknown University"
    }
    return scholarship.organizer_custom || "Unknown Organizer"
  }

  const getLevelName = () => {
    if (scholarship.level) {
      const level = levels.find((l) => l.id === scholarship.level)
      return level?.name || "Unknown Level"
    }
    return null
  }

  const getUniversityName = () => {
    if (scholarship.university) {
      const university = universities.find((u) => u.id === scholarship.university)
      return university?.name || "Unknown University"
    }
    return null
  }

  const isActive = () => {
    const now = new Date()
    const activeFrom = new Date(scholarship.active_from)
    const activeUntil = new Date(scholarship.active_until)
    return now >= activeFrom && now <= activeUntil
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleDelete = () => {
    onDelete(scholarship.slug)
    setShowDeleteConfirm(false)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{scholarship.title}</h2>
            {scholarship.featured && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <Award className="w-3 h-3 mr-1" />
                Featured
              </span>
            )}
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isActive() ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {isActive() ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="text-sm text-gray-500">Slug: {scholarship.slug}</p>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => window.open(`/scholarships/${scholarship.slug}`, "_blank")}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dates */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Important Dates
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500">Published:</span>
              <span className="ml-2 text-gray-900">{formatDate(scholarship.published_date)}</span>
            </div>
            <div>
              <span className="text-gray-500">Active From:</span>
              <span className="ml-2 text-gray-900">{formatDate(scholarship.active_from)}</span>
            </div>
            <div>
              <span className="text-gray-500">Active Until:</span>
              <span className="ml-2 text-gray-900">{formatDate(scholarship.active_until)}</span>
            </div>
          </div>
        </div>

        {/* Organizer */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900 flex items-center">
            <Building className="w-4 h-4 mr-2" />
            Organizer
          </h3>
          <div className="text-sm">
            <p className="text-gray-900 font-medium">{getOrganizerName()}</p>
            <p className="text-gray-500">
              {scholarship.organizer_school && "School"}
              {scholarship.organizer_university && "University"}
              {scholarship.organizer_custom && "Custom Organizer"}
            </p>
          </div>
        </div>

        {/* Academic Info */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900 flex items-center">
            <GraduationCap className="w-4 h-4 mr-2" />
            Academic Information
          </h3>
          <div className="space-y-2 text-sm">
            {getLevelName() && (
              <div>
                <span className="text-gray-500">Level:</span>
                <span className="ml-2 text-gray-900">{getLevelName()}</span>
              </div>
            )}
            {scholarship.courses?.length > 0 && (
              <div>
                <span className="text-gray-500">Courses:</span>
                <span className="ml-2 text-gray-900">{scholarship.courses.length} selected</span>
              </div>
            )}
            {getUniversityName() && (
              <div>
                <span className="text-gray-500">University:</span>
                <span className="ml-2 text-gray-900">{getUniversityName()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Scholarship</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete "{scholarship.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
