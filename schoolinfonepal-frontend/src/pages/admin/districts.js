"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import AdminLayout from "@/components/admin/AdminLayout"
import DistrictForm from "@/components/admin/district/DistrictForm"
import {
  fetchDistricts,
  fetchDistrictBySlug,
  createDistrict,
  updateDistrict,
  deleteDistrict,
} from "@/utils/api"
import { Plus } from "lucide-react"

const DistrictsAdmin = () => {
  const router = useRouter()
  const { action, slug } = router.query

  const [districts, setDistricts] = useState([])
  const [currentDistrict, setCurrentDistrict] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [selectedDistricts, setSelectedDistricts] = useState([])

  // Load districts on component mount
  useEffect(() => {
    loadDistricts()
  }, [])

  // Handle route changes
  useEffect(() => {
    if (action === "edit" && slug) {
      loadDistrict(slug)
    } else if (action === "create") {
      setCurrentDistrict(null)
    }
  }, [action, slug])

  const loadDistricts = async () => {
    try {
      setIsLoading(true)
      const data = await fetchDistricts()
      setDistricts(data.results || data)
    } catch (error) {
      console.error("Error loading districts:", error)
      alert("Failed to load districts")
    } finally {
      setIsLoading(false)
    }
  }

  const loadDistrict = async (districtSlug) => {
    try {
      setIsLoading(true)
      const district = await fetchDistrictBySlug(districtSlug)
      setCurrentDistrict(district)
    } catch (error) {
      console.error("Error loading district:", error)
      alert("Failed to load district")
      router.push("/admin/districts")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (formData) => {
    try {
      setIsLoading(true)
      await createDistrict(formData)
      await loadDistricts()
      router.push("/admin/districts")
      alert("District created successfully!")
    } catch (error) {
      console.error("Error creating district:", error)
      alert(error.message || "Failed to create district")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async (formData) => {
    try {
      setIsLoading(true)
      const updatedDistrict = await updateDistrict(currentDistrict.slug, formData)
      setDistricts((prev) => prev.map((d) => (d.slug === updatedDistrict.slug ? updatedDistrict : d)))
      setCurrentDistrict(updatedDistrict)
      router.push("/admin/districts")
      alert("District updated successfully!")
    } catch (error) {
      console.error("Error updating district:", error)
      alert(error.message || "Failed to update district")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (districtSlug) => {
    if (window.confirm("Are you sure you want to delete this district?")) {
      try {
        setIsLoading(true)
        await deleteDistrict(districtSlug)
        setDistricts((prev) => prev.filter((d) => d.slug !== districtSlug))
        router.push("/admin/districts")
        alert("District deleted successfully!")
      } catch (error) {
        console.error("Error deleting district:", error)
        alert("Failed to delete district")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleCancel = () => {
    router.push("/admin/districts")
  }

  // Filter and sort districts
  const filteredDistricts = districts
    .filter((district) => district.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      }
      return a.id - b.id
    })

  const handleSelectDistrict = (districtId) => {
    setSelectedDistricts((prev) => {
      if (prev.includes(districtId)) {
        return prev.filter((id) => id !== districtId)
      } else {
        return [...prev, districtId]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectedDistricts.length === filteredDistricts.length) {
      setSelectedDistricts([])
    } else {
      setSelectedDistricts(filteredDistricts.map((d) => d.id))
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
                {action === "create" ? "Add New District" : "Edit District"}
              </h2>
              <button
                onClick={handleCancel}
                className="text-red-600 hover:text-red-800 font-medium transition-colors duration-150"
              >
                Cancel
              </button>
            </div>
            <DistrictForm
              district={currentDistrict}
              onSubmit={action === "create" ? handleCreate : handleUpdate}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          </div>
        </div>
      </AdminLayout>
    )
  }

  // Show district detail
  if (slug && currentDistrict) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">{currentDistrict.name}</h2>
              <div className="space-x-4">
                <button
                  onClick={() => router.push(`/admin/districts?action=edit&slug=${currentDistrict.slug}`)}
                  className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-150"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(currentDistrict.slug)}
                  className="text-red-600 hover:text-red-800 font-medium transition-colors duration-150"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-lg text-gray-900">{currentDistrict.name}</p>
                <p className="text-sm font-medium text-gray-500 mt-4">Slug</p>
                <p className="text-lg text-gray-900">{currentDistrict.slug}</p>
                <p className="text-sm font-medium text-gray-500 mt-4">ID</p>
                <p className="text-lg text-gray-900">#{currentDistrict.id}</p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  // Show districts list
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Districts</h1>
          <button
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-sm"
            onClick={() => router.push("/admin/districts?action=create")}
          >
            <Plus className="w-4 h-4 mr-2 inline" />
            Add District
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
                  placeholder="Search districts..."
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

        {/* Districts Table */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedDistricts.length === filteredDistricts.length}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Slug</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500 text-sm">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <p className="mt-2">Loading districts...</p>
                    </td>
                  </tr>
                ) : filteredDistricts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500 text-sm">
                      No districts found.{" "}
                      {searchTerm ? "Try adjusting your search terms." : "Get started by creating a new district."}
                    </td>
                  </tr>
                ) : (
                  filteredDistricts.map((district) => (
                    <tr key={district.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedDistricts.includes(district.id)}
                          onChange={() => handleSelectDistrict(district.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {district.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{district.slug}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">#{district.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-4">
                        <button
                          className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-150"
                          onClick={() => router.push(`/admin/districts?slug=${district.slug}`)}
                        >
                          View
                        </button>
                        <button
                          className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-150"
                          onClick={() => router.push(`/admin/districts?action=edit&slug=${district.slug}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 font-medium transition-colors duration-150"
                          onClick={() => handleDelete(district.slug)}
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

export default DistrictsAdmin