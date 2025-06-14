// pages/admin/information/index.jsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import {
  fetchInformation,
  fetchInformationBySlug,
  deleteInformation,
} from "@/utils/api"
import InformationForm from "@/components/admin/information/InformationForm"
import InformationHeader from "@/components/admin/information/InformationHeader"
import AdminLayout from "@/components/admin/AdminLayout"
import Pagination from "@/components/common/Pagination"

export default function InformationAdmin() {
  const router = useRouter()
  const { action, slug } = router.query

  const [information, setInformation] = useState([])
  const [selectedInformation, setSelectedInformation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, count: 0 })

  const loadInformation = async () => {
    try {
      setLoading(true)
      const data = await fetchInformation({ page: pagination.page })
      setInformation(data.results || [])
      setPagination((prev) => ({ ...prev, count: data.count || 0 }))
      setError(null)
    } catch (err) {
      console.error("Error loading information:", err)
      setError("Failed to load information. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const loadInformationItem = async (infoSlug) => {
    try {
      const data = await fetchInformationBySlug(infoSlug)
      setSelectedInformation(data)
    } catch (err) {
      console.error("Error loading information:", err)
      setError(err.message)
    }
  }

  useEffect(() => {
    loadInformation()
  }, [pagination.page])

  useEffect(() => {
    if (slug && (action === "edit" || action === "view")) {
      loadInformationItem(slug)
    } else {
      setSelectedInformation(null)
    }
  }, [slug, action])

  const handleCreate = () => {
    router.push("/admin/information?action=create")
  }

  const handleEdit = (info) => {
    router.push(`/admin/information?action=edit&slug=${info.slug}`)
  }

  const handleView = (info) => {
    router.push(`/admin/information?action=view&slug=${info.slug}`)
  }

  const handleDelete = async (info) => {
    if (!confirm("Are you sure you want to delete this information?")) return

    try {
      await deleteInformation(info.slug)
      await loadInformation()
      if (selectedInformation?.slug === info.slug) {
        router.push("/admin/information")
      }
    } catch (err) {
      console.error("Error deleting information:", err)
      alert("Failed to delete information: " + err.message)
    }
  }

  const handleFormSuccess = async () => {
    await loadInformation()
    router.push("/admin/information")
  }

  const handleCancel = () => {
    router.push("/admin/information")
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/default-placeholder.png"
    if (imagePath.startsWith("http")) return imagePath
    return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://127.0.0.1:8000"}${imagePath}`
  }

  if (action === "create" || action === "edit") {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <InformationForm
            information={action === "edit" ? selectedInformation : null}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        </div>
      </AdminLayout>
    )
  }

  if (action === "view" && selectedInformation) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <InformationHeader
            information={selectedInformation}
            onEdit={() => handleEdit(selectedInformation)}
            onDelete={() => handleDelete(selectedInformation)}
          />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Information</h1>
          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Create Information
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">Loading information...</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Information</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Published Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {information.map((info) => (
                    <tr key={info.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-12 object-cover rounded"
                              src={getImageUrl(info.featured_image)}
                              alt={info.title}
                              onError={(e) => {
                                e.target.src = "/default-placeholder.png"
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{info.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {info.top_description?.substring(0, 50)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(info.published_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {info.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            info.featured
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {info.featured ? "Featured" : "Regular"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleView(info)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(info)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(info)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={pagination.page}
              total={pagination.count}
              pageSize={12}
              onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
            />
          </>
        )}
      </div>
    </AdminLayout>
  )
}
