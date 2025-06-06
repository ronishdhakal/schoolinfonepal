"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import AdminLayout from "@/components/admin/AdminLayout"
import LevelForm from "@/components/admin/level/LevelForm"
import { fetchLevels, fetchLevelBySlug, createLevel, updateLevel, deleteLevel } from "@/utils/api"
import { Plus } from "lucide-react"

const LevelsAdmin = () => {
  const router = useRouter()
  const { action, slug } = router.query

  const [levels, setLevels] = useState([])
  const [currentLevel, setCurrentLevel] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("title")
  const [selectedLevels, setSelectedLevels] = useState([])

  // Load levels
  useEffect(() => {
    loadLevels()
  }, [])

  // Load specific level for edit/view
  useEffect(() => {
    if (slug && (action === "edit" || action === "view")) {
      loadLevel(slug)
    } else {
      setCurrentLevel(null)
    }
  }, [slug, action])

  const loadLevels = async () => {
    try {
      setIsLoading(true)
      const data = await fetchLevels()
      setLevels(data || [])
    } catch (error) {
      console.error("Error loading levels:", error)
      alert("Failed to load levels")
      setLevels([])
    } finally {
      setIsLoading(false)
    }
  }

  const loadLevel = async (levelSlug) => {
    try {
      setIsLoading(true)
      const data = await fetchLevelBySlug(levelSlug)
      setCurrentLevel(data)
    } catch (error) {
      console.error("Error loading level:", error)
      alert("Failed to load level")
      router.push("/admin/levels")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (formData) => {
    try {
      setIsLoading(true)
      await createLevel(formData)
      await loadLevels()
      router.push("/admin/levels")
      alert("Level created successfully!")
    } catch (error) {
      console.error("Error creating level:", error)
      alert(error.message || "Failed to create level")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async (formData) => {
    try {
      setIsLoading(true)
      const updatedLevel = await updateLevel(currentLevel.slug, formData)
      setLevels((prev) => prev.map((l) => (l.slug === updatedLevel.slug ? updatedLevel : l)))
      setCurrentLevel(updatedLevel)
      router.push("/admin/levels")
      alert("Level updated successfully!")
    } catch (error) {
      console.error("Error updating level:", error)
      alert(error.message || "Failed to update level")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (levelSlug) => {
    if (window.confirm("Are you sure you want to delete this level?")) {
      try {
        setIsLoading(true)
        await deleteLevel(levelSlug)
        setLevels((prev) => prev.filter((l) => l.slug !== levelSlug))
        router.push("/admin/levels")
        alert("Level deleted successfully!")
      } catch (error) {
        console.error("Error deleting level:", error)
        alert("Failed to delete level")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleCancel = () => {
    router.push("/admin/levels")
  }

  // Filter and sort levels
  const filteredLevels = (levels || [])
    .filter((level) => level.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title)
      }
      return a.id - b.id
    })

  const handleSelectLevel = (levelId) => {
    setSelectedLevels((prev) => {
      if (prev.includes(levelId)) {
        return prev.filter((id) => id !== levelId)
      } else {
        return [...prev, levelId]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectedLevels.length === filteredLevels.length) {
      setSelectedLevels([])
    } else {
      setSelectedLevels(filteredLevels.map((level) => level.id))
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
                {action === "create" ? "Add New Level" : "Edit Level"}
              </h2>
              <button
                onClick={handleCancel}
                className="text-red-600 hover:text-red-800 font-medium transition-colors duration-150"
              >
                Cancel
              </button>
            </div>
            <LevelForm
              level={currentLevel}
              onSubmit={action === "create" ? handleCreate : handleUpdate}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          </div>
        </div>
      </AdminLayout>
    )
  }

  // Show level detail
  if (action === "view" && currentLevel) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">{currentLevel.title}</h2>
              <div className="space-x-4">
                <button
                  onClick={() => router.push(`/admin/levels?action=edit&slug=${currentLevel.slug}`)}
                  className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-150"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(currentLevel.slug)}
                  className="text-red-600 hover:text-red-800 font-medium transition-colors duration-150"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Title</p>
                <p className="text-lg text-gray-900">{currentLevel.title}</p>
                <p className="text-sm font-medium text-gray-500 mt-4">Slug</p>
                <p className="text-lg text-gray-900">{currentLevel.slug}</p>
                <p className="text-sm font-medium text-gray-500 mt-4">ID</p>
                <p className="text-lg text-gray-900">#{currentLevel.id}</p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  // Show levels list
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Levels</h1>
          <button
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-sm"
            onClick={() => router.push("/admin/levels?action=create")}
          >
            <Plus className="w-4 h-4 mr-2 inline" />
            Add Level
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
                  placeholder="Search levels..."
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
                <option value="title">Sort by Title</option>
                <option value="id">Sort by ID</option>
              </select>
            </div>
          </div>
        </div>

        {/* Levels Table */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedLevels.length === filteredLevels.length}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
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
                      <p className="mt-2">Loading levels...</p>
                    </td>
                  </tr>
                ) : filteredLevels.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500 text-sm">
                      No levels found.{" "}
                      {searchTerm ? "Try adjusting your search terms." : "Get started by creating a new level."}
                    </td>
                  </tr>
                ) : (
                  filteredLevels.map((level) => (
                    <tr key={level.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedLevels.includes(level.id)}
                          onChange={() => handleSelectLevel(level.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {level.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{level.slug}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">#{level.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-4">
                        <button
                          className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-150"
                          onClick={() => router.push(`/admin/levels?action=view&slug=${level.slug}`)}
                        >
                          View
                        </button>
                        <button
                          className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-150"
                          onClick={() => router.push(`/admin/levels?action=edit&slug=${level.slug}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 font-medium transition-colors duration-150"
                          onClick={() => handleDelete(level.slug)}
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

export default LevelsAdmin