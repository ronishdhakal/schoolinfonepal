"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import AdminLayout from "@/components/admin/AdminLayout"
import FacilityForm from "@/components/admin/facility/FacilityForm"
import {
  fetchFacilities,
  fetchFacilityBySlug,
  createFacility,
  updateFacility,
  deleteFacility,
} from "@/utils/api"
import { Plus } from "lucide-react"

const FacilitiesAdmin = () => {
  const router = useRouter()
  const { action, slug } = router.query

  const [facilities, setFacilities] = useState([])
  const [currentFacility, setCurrentFacility] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [selectedFacilities, setSelectedFacilities] = useState([])

  // Load facilities on component mount
  useEffect(() => {
    loadFacilities()
  }, [])

  // Handle route changes
  useEffect(() => {
    if (action === "edit" && slug) {
      loadFacility(slug)
    } else if (action === "create") {
      setCurrentFacility(null)
    }
  }, [action, slug])

  const loadFacilities = async () => {
    try {
      setIsLoading(true)
      const data = await fetchFacilities()
      setFacilities(data.results || data)
    } catch (error) {
      console.error("Error loading facilities:", error)
      alert("Failed to load facilities")
    } finally {
      setIsLoading(false)
    }
  }

  const loadFacility = async (facilitySlug) => {
    try {
      setIsLoading(true)
      const facility = await fetchFacilityBySlug(facilitySlug)
      setCurrentFacility(facility)
    } catch (error) {
      console.error("Error loading facility:", error)
      alert("Failed to load facility")
      router.push("/admin/facilities")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (formData) => {
    try {
      setIsLoading(true)
      await createFacility(formData)
      await loadFacilities()
      router.push("/admin/facilities")
      alert("Facility created successfully!")
    } catch (error) {
      console.error("Error creating facility:", error)
      alert(error.message || "Failed to create facility")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async (formData) => {
    try {
      setIsLoading(true)
      const updatedFacility = await updateFacility(currentFacility.slug, formData)
      setFacilities((prev) => prev.map((f) => (f.slug === updatedFacility.slug ? updatedFacility : f)))
      setCurrentFacility(updatedFacility)
      router.push("/admin/facilities")
      alert("Facility updated successfully!")
    } catch (error) {
      console.error("Error updating facility:", error)
      alert(error.message || "Failed to update facility")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (facilitySlug) => {
    if (window.confirm("Are you sure you want to delete this facility?")) {
      try {
        setIsLoading(true)
        await deleteFacility(facilitySlug)
        setFacilities((prev) => prev.filter((f) => f.slug !== facilitySlug))
        router.push("/admin/facilities")
        alert("Facility deleted successfully!")
      } catch (error) {
        console.error("Error deleting facility:", error)
        alert("Failed to delete facility")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleCancel = () => {
    router.push("/admin/facilities")
  }

  // Filter and sort facilities
  const filteredFacilities = facilities
    .filter((facility) => facility.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      }
      return a.id - b.id
    })

  const handleSelectFacility = (facilityId) => {
    setSelectedFacilities((prev) => {
      if (prev.includes(facilityId)) {
        return prev.filter((id) => id !== facilityId)
      } else {
        return [...prev, facilityId]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectedFacilities.length === filteredFacilities.length) {
      setSelectedFacilities([])
    } else {
      setSelectedFacilities(filteredFacilities.map((f) => f.id))
    }
  }

  // Show form for create/edit
  if (action === "create" || action === "edit") {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow-lg rounded-xl p-8 mt-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {action === "create" ? "Add New Facility" : "Edit Facility"}
              </h2>
              <button
                onClick={handleCancel}
                className="text-red-600 hover:text-red-800 font-medium transition-colors duration-150"
              >
                Cancel
              </button>
            </div>
            <FacilityForm
              facility={currentFacility}
              onSubmit={action === "create" ? handleCreate : handleUpdate}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          </div>
        </div>
      </AdminLayout>
    )
  }

  // Show facility detail
  if (slug && currentFacility) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">{currentFacility.name}</h2>
              <div className="space-x-4">
                <button
                  onClick={() => router.push(`/admin/facilities?action=edit&slug=${currentFacility.slug}`)}
                  className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-150"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(currentFacility.slug)}
                  className="text-red-600 hover:text-red-800 font-medium transition-colors duration-150"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentFacility.icon && (
                <img
                  src={currentFacility.icon || "/placeholder.svg"}
                  alt={currentFacility.name}
                  className="h-32 w-32 object-cover rounded-lg border border-gray-300"
                />
              )}
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-lg text-gray-900">{currentFacility.name}</p>
                <p className="text-sm font-medium text-gray-500 mt-4">Slug</p>
                <p className="text-lg text-gray-900">{currentFacility.slug}</p>
                <p className="text-sm font-medium text-gray-500 mt-4">ID</p>
                <p className="text-lg text-gray-900">#{currentFacility.id}</p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  // Show facilities list
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Facilities</h1>
          <button
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-sm"
            onClick={() => router.push("/admin/facilities?action=create")}
          >
            <Plus className="w-4 h-4 mr-2 inline" />
            Add Facility
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search facilities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Sort by Name</option>
                <option value="id">Sort by ID</option>
              </select>
            </div>
          </div>
        </div>

        {/* Facilities Table */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedFacilities.length === filteredFacilities.length}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Icon</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Slug</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500 text-sm">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <p className="mt-2">Loading facilities...</p>
                    </td>
                  </tr>
                ) : filteredFacilities.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500 text-sm">
                      No facilities found.{" "}
                      {searchTerm ? "Try adjusting your search terms." : "Get started by creating a new facility."}
                    </td>
                  </tr>
                ) : (
                  filteredFacilities.map((facility) => (
                    <tr key={facility.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedFacilities.includes(facility.id)}
                          onChange={() => handleSelectFacility(facility.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {facility.icon ? (
                          <img
                            src={facility.icon || "/placeholder.svg"}
                            alt={facility.name}
                            className="h-10 w-10 object-cover rounded-lg border border-gray-300"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {facility.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{facility.slug}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">#{facility.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-4">
                        <button
                          className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-150"
                          onClick={() => router.push(`/admin/facilities?slug=${facility.slug}`)}
                        >
                          View
                        </button>
                        <button
                          className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-150"
                          onClick={() => router.push(`/admin/facilities?action=edit&slug=${facility.slug}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 font-medium transition-colors duration-150"
                          onClick={() => handleDelete(facility.slug)}
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
      </div>
    </AdminLayout>
  )
}

export default FacilitiesAdmin