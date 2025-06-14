"use client"

import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import UniversityForm from "@/components/admin/university/UniversityForm"
import Pagination from "@/components/common/Pagination"
import { fetchUniversities, deleteUniversity } from "@/utils/api"
import { useRouter } from "next/router"

const PAGE_SIZE = 12

export default function AdminUniversitiesPage() {
  const [universities, setUniversities] = useState([])
  const [selectedSlug, setSelectedSlug] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)

  const router = useRouter()

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        const data = await fetchUniversities({ page: currentPage, page_size: PAGE_SIZE })
        if (data && data.results) {
          setUniversities(data.results)
          setTotal(data.count || 0)
        } else if (Array.isArray(data)) {
          setUniversities(data)
          setTotal(data.length)
        } else {
          setUniversities([])
          setTotal(0)
        }
        setError(null)
      } catch (err) {
        console.error("Unauthorized or fetch failed:", err)
        setError("You are not authorized. Please login again.")
        setUniversities([])
        setTotal(0)
      }
    }

    loadUniversities()
  }, [refresh, currentPage])

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
    if (window.confirm("Are you sure you want to delete this university?")) {
      try {
        await deleteUniversity(slug)
        setRefresh((prev) => !prev)
      } catch (err) {
        console.error("Delete failed:", err)
        alert("Failed to delete university")
      }
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Universities</h1>
          <button
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-sm"
            onClick={handleCreate}
          >
            + Add University
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 border border-red-200">{error}</div>}

        {!showForm && (
          <>
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">University Name</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Type</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Verified</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Foreign Affiliated</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Array.isArray(universities) && universities.length > 0 ? (
                      universities.map((university) => (
                        <tr key={university.slug} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            <div className="flex items-center space-x-3">
                              {university.logo && (
                                <img
                                  src={university.logo || "/placeholder.svg"}
                                  alt={university.name}
                                  className="h-8 w-8 rounded-full object-cover"
                                />
                              )}
                              <div>
                                <div className="font-semibold">{university.name}</div>
                                <div className="text-gray-500 text-xs">{university.address}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 text-center">{university.type_name || "-"}</td>
                          <td className="px-6 py-4 text-sm text-center">{university.is_verified ? "✅" : "❌"}</td>
                          <td className="px-6 py-4 text-sm text-center">{university.foreign_affiliated ? "🌍" : "🏠"}</td>
                          <td className="px-6 py-4 text-sm text-center">
                            {university.status ? (
                              <span className="text-green-600 font-medium">Active</span>
                            ) : (
                              <span className="text-red-600 font-medium">Inactive</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-center space-x-4">
                            <button
                              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-150"
                              onClick={() => handleEdit(university.slug)}
                            >
                              Edit
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800 font-medium transition-colors duration-150"
                              onClick={() => handleDelete(university.slug)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-8 text-gray-500 text-sm">
                          No universities found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <Pagination
              current={currentPage}
              total={total}
              pageSize={PAGE_SIZE}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {showForm && (
          <div className="bg-white shadow-lg rounded-xl p-8 mt-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {selectedSlug ? "Edit University" : "Add New University"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-red-600 hover:text-red-800 font-medium transition-colors duration-150"
              >
                Cancel
              </button>
            </div>
            <UniversityForm slug={selectedSlug} onSuccess={handleSuccess} />
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
