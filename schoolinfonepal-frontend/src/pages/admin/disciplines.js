// pages/admin/disciplines/index.jsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { fetchDisciplines, fetchDisciplineBySlug, deleteDiscipline } from "@/utils/api"
import DisciplineForm from "@/components/admin/discipline/DisciplineForm"
import DisciplineHeader from "@/components/admin/discipline/DisciplineHeader"
import AdminLayout from "@/components/admin/AdminLayout"

export default function DisciplinesAdmin() {
  const router = useRouter()
  const { action, slug } = router.query

  const [disciplines, setDisciplines] = useState([])
  const [selectedDiscipline, setSelectedDiscipline] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load disciplines list
  const loadDisciplines = async () => {
    try {
      setLoading(true)
      const data = await fetchDisciplines()
      setDisciplines(Array.isArray(data) ? data : data.results || [])
    } catch (err) {
      console.error("Error loading disciplines:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Load specific discipline for edit/view
  const loadDiscipline = async (disciplineSlug) => {
    try {
      const data = await fetchDisciplineBySlug(disciplineSlug)
      setSelectedDiscipline(data)
    } catch (err) {
      console.error("Error loading discipline:", err)
      setError(err.message)
    }
  }

  useEffect(() => {
    loadDisciplines()
  }, [])

  useEffect(() => {
    if (slug && (action === "edit" || action === "view")) {
      loadDiscipline(slug)
    } else {
      setSelectedDiscipline(null)
    }
  }, [slug, action])

  const handleCreate = () => {
    router.push("/admin/disciplines?action=create")
  }

  const handleEdit = (discipline) => {
    router.push(`/admin/disciplines?action=edit&slug=${discipline.slug}`)
  }

  const handleView = (discipline) => {
    router.push(`/admin/disciplines?action=view&slug=${discipline.slug}`)
  }

  const handleDelete = async (discipline) => {
    if (!confirm("Are you sure you want to delete this discipline?")) return

    try {
      await deleteDiscipline(discipline.slug)
      await loadDisciplines()
      if (selectedDiscipline?.slug === discipline.slug) {
        router.push("/admin/disciplines")
      }
    } catch (err) {
      console.error("Error deleting discipline:", err)
      alert("Failed to delete discipline: " + err.message)
    }
  }

  const handleFormSuccess = async () => {
    await loadDisciplines()
    router.push("/admin/disciplines")
  }

  const handleCancel = () => {
    router.push("/admin/disciplines")
  }

  // Show form for create/edit
  if (action === "create" || action === "edit") {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DisciplineForm
            discipline={action === "edit" ? selectedDiscipline : null}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        </div>
      </AdminLayout>
    )
  }

  // Show detail view
  if (action === "view" && selectedDiscipline) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DisciplineHeader
            discipline={selectedDiscipline}
            onEdit={() => handleEdit(selectedDiscipline)}
            onDelete={() => handleDelete(selectedDiscipline)}
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
          <h1 className="text-3xl font-bold text-gray-900">Disciplines</h1>
          <button onClick={handleCreate} className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Create Discipline
          </button>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded border border-red-200">{error}</div>}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">Loading disciplines...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {disciplines.map((discipline) => (
                  <tr key={discipline.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{discipline.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded font-mono">
                        {discipline.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleView(discipline)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(discipline)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDelete(discipline)} className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {disciplines.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No disciplines found.</p>
                <button
                  onClick={handleCreate}
                  className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Create First Discipline
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}