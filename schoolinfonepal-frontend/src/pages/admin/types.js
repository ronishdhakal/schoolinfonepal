"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import AdminLayout from "@/components/admin/AdminLayout"
import TypeForm from "@/components/admin/type/TypeForm"
import { fetchTypes, fetchTypeBySlug, createType, updateType, deleteType } from "@/utils/api"
import { Plus } from "lucide-react"

const TypesAdmin = () => {
  const router = useRouter()
  const { action, slug } = router.query

  const [types, setTypes] = useState([])
  const [currentType, setCurrentType] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [selectedTypes, setSelectedTypes] = useState([])

  // Load types
  useEffect(() => {
    loadTypes()
  }, [])

  // Load specific type for edit/view
  useEffect(() => {
    if (slug && (action === "edit" || action === "view")) {
      loadType(slug)
    } else {
      setCurrentType(null)
    }
  }, [slug, action])

  const loadTypes = async () => {
    try {
      setIsLoading(true)
      const data = await fetchTypes()
      setTypes(data || [])
    } catch (error) {
      console.error("Error loading types:", error)
      alert("Failed to load types")
      setTypes([])
    } finally {
      setIsLoading(false)
    }
  }

  const loadType = async (typeSlug) => {
    try {
      setIsLoading(true)
      const data = await fetchTypeBySlug(typeSlug)
      setCurrentType(data)
    } catch (error) {
      console.error("Error loading type:", error)
      alert("Failed to load type")
      router.push("/admin/types")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (formData) => {
    try {
      setIsLoading(true)
      await createType(formData)
      await loadTypes()
      router.push("/admin/types")
      alert("Type created successfully!")
    } catch (error) {
      console.error("Error creating type:", error)
      alert(error.message || "Failed to create type")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async (formData) => {
    try {
      setIsLoading(true)
      const updatedType = await updateType(currentType.slug, formData)
      setTypes((prev) => prev.map((t) => (t.slug === updatedType.slug ? updatedType : t)))
      setCurrentType(updatedType)
      router.push("/admin/types")
      alert("Type updated successfully!")
    } catch (error) {
      console.error("Error updating type:", error)
      alert(error.message || "Failed to update type")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (typeSlug) => {
    if (window.confirm("Are you sure you want to delete this type?")) {
      try {
        setIsLoading(true)
        await deleteType(typeSlug)
        setTypes((prev) => prev.filter((t) => t.slug !== typeSlug))
        router.push("/admin/types")
        alert("Type deleted successfully!")
      } catch (error) {
        console.error("Error deleting type:", error)
        alert("Failed to delete type")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleCancel = () => {
    router.push("/admin/types")
  }

  // Filter and sort types
  const filteredTypes = (types || [])
    .filter((type) => type.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      }
      return a.id - b.id
    })

  const handleSelectType = (typeId) => {
    setSelectedTypes((prev) => {
      if (prev.includes(typeId)) {
        return prev.filter((id) => id !== typeId)
      } else {
        return [...prev, typeId]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectedTypes.length === filteredTypes.length) {
      setSelectedTypes([])
    } else {
      setSelectedTypes(filteredTypes.map((type) => type.id))
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
                {action === "create" ? "Add New Type" : "Edit Type"}
              </h2>
              <button
                onClick={handleCancel}
                className="text-red-600 hover:text-red-800 font-medium transition-colors duration-150"
              >
                Cancel
              </button>
            </div>
            <TypeForm
              type={currentType}
              onSubmit={action === "create" ? handleCreate : handleUpdate}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          </div>
        </div>
      </AdminLayout>
    )
  }

  // Show type detail
  if (action === "view" && currentType) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">{currentType.name}</h2>
              <div className="space-x-4">
                <button
                  onClick={() => router.push(`/admin/types?action=edit&slug=${currentType.slug}`)}
                  className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(currentType.slug)}
                  className="text-red-600 hover:text-red-800 font-medium text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-700">Name</p>
                <p className="text-lg text-gray-900">{currentType.name}</p>
                <p className="text-sm font-medium text-gray-700 mt-4">Slug</p>
                <p className="text-lg text-gray-900">{currentType.slug}</p>
                <p className="text-sm font-medium text-gray-700 mt-4">ID</p>
                <p className="text-lg text-gray-900">#{currentType.id}</p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  // Show types list
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Types</h1>
          <button
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 font-medium shadow-sm"
            onClick={() => router.push("/admin/types?action=create")}
          >
            <Plus className="w-4 h-4 mr-2 inline" />
            Add Type
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-200">
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
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search types..."
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
                className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Sort by Name</option>
                <option value="id">Sort by ID</option>
              </select>
            </div>
          </div>
        </div>

        {/* Types Table */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedTypes.length === filteredTypes.length}
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
                      <p className="mt-2">Loading types...</p>
                    </td>
                  </tr>
                ) : filteredTypes.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500 text-sm">
                      No types found.{" "}
                      {searchTerm ? "Try adjusting your search terms." : "Get started by creating a new type."}
                    </td>
                  </tr>
                ) : (
                  filteredTypes.map((type) => (
                    <tr key={type.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type.id)}
                          onChange={() => handleSelectType(type.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{type.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{type.slug}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">#{type.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                        <button
                          className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-150"
                          onClick={() => router.push(`/admin/types?action=view&slug=${type.slug}`)}
                        >
                          View
                        </button>
                        <button
                          className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-150"
                          onClick={() => router.push(`/admin/types?action=edit&slug=${type.slug}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 font-medium transition-colors duration-150"
                          onClick={() => handleDelete(type.slug)}
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

export default TypesAdmin