"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import ScholarshipForm from "@/components/admin/scholarship/ScholarshipForm"
import {
  fetchScholarships,
  deleteScholarship,
  fetchSchoolsDropdown,
  fetchUniversitiesDropdown,
  fetchCoursesDropdown,
  fetchLevelsDropdown,
} from "@/utils/api"
import { Plus } from "lucide-react"

export default function ScholarshipsAdmin() {
  const [scholarships, setScholarships] = useState([])
  const [dropdowns, setDropdowns] = useState({
    schools: [],
    universities: [],
    courses: [],
    levels: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingScholarship, setEditingScholarship] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [scholarshipsData, schoolsData, universitiesData, coursesData, levelsData] = await Promise.all([
        fetchScholarships(),
        fetchSchoolsDropdown(),
        fetchUniversitiesDropdown(),
        fetchCoursesDropdown(),
        fetchLevelsDropdown(),
      ])

      setScholarships(scholarshipsData?.results || scholarshipsData || [])
      setDropdowns({
        schools: schoolsData || [],
        universities: universitiesData || [],
        courses: coursesData || [],
        levels: levelsData || [],
      })
    } catch (err) {
      setError("Failed to load scholarships")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingScholarship(null)
    setShowForm(true)
  }

  const handleEdit = (scholarship) => {
    setEditingScholarship(scholarship)
    setShowForm(true)
  }

  const handleDelete = async (slug) => {
    if (window.confirm("Are you sure you want to delete this scholarship?")) {
      try {
        await deleteScholarship(slug)
        await loadData()
      } catch (err) {
        setError("Failed to delete scholarship")
      }
    }
  }

  const handleFormSuccess = async () => {
    setShowForm(false)
    setEditingScholarship(null)
    await loadData()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingScholarship(null)
  }

  const isActive = (scholarship) => {
    const now = new Date()
    const activeFrom = new Date(scholarship.active_from)
    const activeUntil = new Date(scholarship.active_until)
    return now >= activeFrom && now <= activeUntil
  }

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch =
      scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.organizer_custom?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && isActive(scholarship)) ||
      (filterStatus === "inactive" && !isActive(scholarship)) ||
      (filterStatus === "featured" && scholarship.featured)

    return matchesSearch && matchesFilter
  })

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Scholarships</h1>
          <button
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-sm"
            onClick={handleCreate}
          >
            <Plus className="w-4 h-4 mr-2 inline" />
            Add Scholarship
          </button>
        </div>

        {/* Error Display */}
        {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 border border-red-200">{error}</div>}

        {/* Form Display */}
        {showForm ? (
          <div className="bg-white shadow-lg rounded-xl p-8 mt-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {editingScholarship ? "Edit Scholarship" : "Add New Scholarship"}
              </h2>
              <button
                onClick={handleFormCancel}
                className="text-red-600 hover:text-red-800 font-medium transition-colors duration-150"
              >
                Cancel
              </button>
            </div>
            <ScholarshipForm
              scholarship={editingScholarship}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
              schools={dropdowns.schools}
              universities={dropdowns.universities}
              courses={dropdowns.courses}
              levels={dropdowns.levels}
            />
          </div>
        ) : (
          /* Scholarships Table */
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Scholarship Title</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Organizer</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Featured</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-500 text-sm">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2">Loading scholarships...</p>
                      </td>
                    </tr>
                  ) : filteredScholarships.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-500 text-sm">
                        No scholarships found.{" "}
                        {searchTerm || filterStatus !== "all"
                          ? "Try adjusting your search or filters."
                          : "Get started by creating a new scholarship."}
                      </td>
                    </tr>
                  ) : (
                    filteredScholarships.map((scholarship) => (
                      <tr key={scholarship.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{scholarship.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 text-center">
                          {scholarship.organizer_custom || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 text-center">
                          {isActive(scholarship) ? "Active" : "Inactive"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 text-center">
                          {scholarship.featured ? "Yes" : "No"}
                        </td>
                        <td className="px-6 py-4 text-sm text-center space-x-4">
                          <button
                            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-150"
                            onClick={() => handleEdit(scholarship)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800 font-medium transition-colors duration-150"
                            onClick={() => handleDelete(scholarship.slug)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}