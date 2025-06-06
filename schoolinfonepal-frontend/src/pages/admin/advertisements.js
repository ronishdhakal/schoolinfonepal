// pages/admin/advertisements/index.jsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { fetchAdvertisements, fetchAdvertisementById, deleteAdvertisement } from "@/utils/api"
import AdvertisementForm from "@/components/admin/advertisement/AdvertisementForm"
import AdvertisementHeader from "@/components/admin/advertisement/AdvertisementHeader"
import AdminLayout from "@/components/admin/AdminLayout"

export default function AdvertisementsAdmin() {
  const router = useRouter()
  const { action, id } = router.query

  const [advertisements, setAdvertisements] = useState([])
  const [selectedAdvertisement, setSelectedAdvertisement] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load advertisements list
  const loadAdvertisements = async () => {
    try {
      setLoading(true)
      const data = await fetchAdvertisements()
      setAdvertisements(Array.isArray(data) ? data : data.results || [])
      setError(null)
    } catch (err) {
      console.error("Error loading advertisements:", err)
      setError("Failed to load advertisements. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Load specific advertisement for edit/view
  const loadAdvertisement = async (advertisementId) => {
    try {
      const data = await fetchAdvertisementById(advertisementId)
      setSelectedAdvertisement(data)
    } catch (err) {
      console.error("Error loading advertisement:", err)
      setError(err.message)
    }
  }

  useEffect(() => {
    loadAdvertisements()
  }, [])

  useEffect(() => {
    if (id && (action === "edit" || action === "view")) {
      loadAdvertisement(id)
    } else {
      setSelectedAdvertisement(null)
    }
  }, [id, action])

  const handleCreate = () => {
    router.push("/admin/advertisements?action=create")
  }

  const handleEdit = (advertisement) => {
    router.push(`/admin/advertisements?action=edit&id=${advertisement.id}`)
  }

  const handleView = (advertisement) => {
    router.push(`/admin/advertisements?action=view&id=${advertisement.id}`)
  }

  const handleDelete = async (advertisement) => {
    if (!confirm("Are you sure you want to delete this advertisement?")) return

    try {
      await deleteAdvertisement(advertisement.id)
      await loadAdvertisements()
      if (selectedAdvertisement?.id === advertisement.id) {
        router.push("/admin/advertisements")
      }
    } catch (err) {
      console.error("Error deleting advertisement:", err)
      alert("Failed to delete advertisement: " + err.message)
    }
  }

  const handleFormSuccess = async () => {
    await loadAdvertisements()
    router.push("/admin/advertisements")
  }

  const handleCancel = () => {
    router.push("/admin/advertisements")
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith("http")) return imagePath
    return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://127.0.0.1:8000"}${imagePath}`
  }

  // Show form for create/edit
  if (action === "create" || action === "edit") {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdvertisementForm
            advertisement={action === "edit" ? selectedAdvertisement : null}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        </div>
      </AdminLayout>
    )
  }

  // Show detail view
  if (action === "view" && selectedAdvertisement) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdvertisementHeader
            advertisement={selectedAdvertisement}
            onEdit={() => handleEdit(selectedAdvertisement)}
            onDelete={() => handleDelete(selectedAdvertisement)}
          />
        </div>
      </AdminLayout>
    )
  }

  // Show list view
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Advertisements</h1>
          <button onClick={handleCreate} className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Create Advertisement
          </button>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">Loading advertisements...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Advertisement
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Placement
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {advertisements.map((ad) => (
                  <tr key={ad.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 object-cover rounded"
                            src={getImageUrl(ad.image_mobile) || "/placeholder.svg"}
                            alt={ad.title}
                            onError={(e) => {
                              e.target.src = "/placeholder.svg?height=48&width=48"
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{ad.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{ad.link}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {ad.placement}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          ad.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {ad.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ad.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleView(ad)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        View
                      </button>
                      <button onClick={() => handleEdit(ad)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(ad)} className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {advertisements.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No advertisements found.</p>
                <button
                  onClick={handleCreate}
                  className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Create First Advertisement
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}