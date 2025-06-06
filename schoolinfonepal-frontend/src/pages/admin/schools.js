"use client"
import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import SchoolForm from "@/components/admin/school/SchoolForm"
import { fetchSchools, deleteSchool } from "@/utils/api"
import { useRouter } from "next/router"

export default function AdminSchoolsPage() {
  const [schools, setSchools] = useState([])
  const [selectedSlug, setSelectedSlug] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [error, setError] = useState(null)

  const router = useRouter()

  useEffect(() => {
    const loadSchools = async () => {
      try {
        const data = await fetchSchools()
        setSchools(data)
        setError(null)
      } catch (err) {
        console.error("Unauthorized or fetch failed:", err)
        setError("You are not authorized. Please login again.")
      }
    }

    loadSchools()
  }, [refresh])

  const handleEdit = (slug) => {
    setSelectedSlug(slug)
    setShowForm(true)
  }

  const handleCreate = () => {
    setSelectedSlug(null)
    setShowForm(true)
  }

  const handleSuccess = () => {
    setShowForm(false)
    setRefresh((prev) => !prev)
  }

  const handleDelete = async (slug) => {
    if (window.confirm("Are you sure you want to delete this school?")) {
      try {
        await deleteSchool(slug)
        setRefresh((prev) => !prev)
      } catch (err) {
        console.error("Delete failed:", err)
        alert("Failed to delete school")
      }
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Schools</h1>
          <button
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-sm"
            onClick={handleCreate}
          >
            + Add School
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 border border-red-200">{error}</div>}

        {!showForm && (
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">School Name</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">District</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Level</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Type</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {schools.map((school) => (
                    <tr key={school.slug} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        <div className="flex items-center space-x-3">
                          {school.logo && (
                            <img
                              src={school.logo || "/placeholder.svg"}
                              alt={school.name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <div className="font-semibold">{school.name}</div>
                            <div className="text-gray-500 text-xs">{school.address}</div>
                            <div className="flex items-center space-x-2 mt-1">
                              {school.verification && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Verified
                                </span>
                              )}
                              {school.featured && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">{school.district_name || "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">
                        {school.level_name || school.level_text || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">{school.type_name || "-"}</td>
                      <td className="px-6 py-4 text-sm text-center">
                        <span className="text-green-600 font-medium">Active</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-center space-x-4">
                        <button
                          className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-150"
                          onClick={() => handleEdit(school.slug)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 font-medium transition-colors duration-150"
                          onClick={() => handleDelete(school.slug)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {schools.length === 0 && !error && (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-500 text-sm">
                        No schools found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showForm && (
          <div className="bg-white shadow-lg rounded-xl p-8 mt-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {selectedSlug ? "Edit School" : "Add New School"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-red-600 hover:text-red-800 font-medium transition-colors duration-150"
              >
                Cancel
              </button>
            </div>
            <SchoolForm slug={selectedSlug} onSuccess={handleSuccess} />
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
