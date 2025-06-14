"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { fetchAdmissions, fetchAdmissionBySlug, deleteAdmission } from "@/utils/api"
import AdmissionForm from "@/components/admin/admission/AdmissionForm"
import AdminLayout from "@/components/admin/AdminLayout"
import Pagination from "@/components/common/Pagination"

export default function AdmissionsAdmin() {
  const router = useRouter()
  const { action, slug } = router.query

  const [admissions, setAdmissions] = useState([])
  const [selectedAdmission, setSelectedAdmission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalAdmissions, setTotalAdmissions] = useState(0)
  const [pageSize, setPageSize] = useState(12)

  const loadAdmissions = async () => {
    try {
      setLoading(true)
      const data = await fetchAdmissions({ page: currentPage, page_size: pageSize })
      setAdmissions(Array.isArray(data) ? data : data.results || [])
      setTotalAdmissions(data.count || data.length || 0)
      setError(null)
    } catch (err) {
      console.error("Error loading admissions:", err)
      setError("Failed to load admissions. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const loadAdmission = async (admissionSlug) => {
    try {
      const data = await fetchAdmissionBySlug(admissionSlug)
      setSelectedAdmission(data)
    } catch (err) {
      console.error("Error loading admission:", err)
      setError(err.message)
    }
  }

  useEffect(() => {
    loadAdmissions()
  }, [currentPage])

  useEffect(() => {
    if (slug && (action === "edit" || action === "view")) {
      loadAdmission(slug)
    } else {
      setSelectedAdmission(null)
    }
  }, [slug, action])

  const handleCreate = () => {
    router.push("/admin/admissions?action=create")
  }

  const handleEdit = (admission) => {
    router.push(`/admin/admissions?action=edit&slug=${admission.slug}`)
  }

  const handleView = (admission) => {
    router.push(`/admin/admissions?action=view&slug=${admission.slug}`)
  }

  const handleDelete = async (admission) => {
    if (!confirm("Are you sure you want to delete this admission?")) return

    try {
      await deleteAdmission(admission.slug)
      await loadAdmissions()
      if (selectedAdmission?.slug === admission.slug) {
        router.push("/admin/admissions")
      }
    } catch (err) {
      console.error("Error deleting admission:", err)
      alert("Failed to delete admission: " + err.message)
    }
  }

  const handleFormSuccess = async () => {
    await loadAdmissions()
    router.push("/admin/admissions")
  }

  const handleCancel = () => {
    router.push("/admin/admissions")
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusBadge = (admission) => {
    const now = new Date()
    const activeFrom = new Date(admission.active_from)
    const activeUntil = new Date(admission.active_until)

    if (now < activeFrom) {
      return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">Upcoming</span>
    } else if (now > activeUntil) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">Expired</span>
    } else {
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">Active</span>
    }
  }

  if (action === "create" || action === "edit") {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdmissionForm
            admission={action === "edit" ? selectedAdmission : null}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        </div>
      </AdminLayout>
    )
  }

  if (action === "view" && selectedAdmission) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{selectedAdmission.title}</h1>
                <p className="text-gray-600 mt-2">Slug: {selectedAdmission.slug}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(selectedAdmission)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(selectedAdmission)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                <div className="space-y-2">
                  <p><strong>Published Date:</strong> {formatDate(selectedAdmission.published_date)}</p>
                  <p><strong>Active From:</strong> {formatDate(selectedAdmission.active_from)}</p>
                  <p><strong>Active Until:</strong> {formatDate(selectedAdmission.active_until)}</p>
                  <p><strong>School:</strong> {selectedAdmission.school?.name || "N/A"}</p>
                  <p><strong>Status:</strong> {getStatusBadge(selectedAdmission)}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Additional Details</h3>
                <div className="space-y-2">
                  <p><strong>Level:</strong> {selectedAdmission.level?.name || "N/A"}</p>
                  <p><strong>University:</strong> {selectedAdmission.university?.name || "N/A"}</p>
                  <p><strong>Featured:</strong> {selectedAdmission.featured ? "Yes" : "No"}</p>
                </div>
              </div>

              {selectedAdmission.courses && selectedAdmission.courses.length > 0 && (
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-3">Courses</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAdmission.courses.map((course) => (
                      <span key={course.id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {course.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedAdmission.description && (
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedAdmission.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admissions</h1>
          <button onClick={handleCreate} className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Create Admission
          </button>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading admissions...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Admission</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">School</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Active Period</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admissions.map((admission) => (
                  <tr key={admission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{admission.title}</div>
                        <div className="text-sm text-gray-500">Published: {formatDate(admission.published_date)}</div>
                        {admission.featured && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{admission.school?.name || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(admission.active_from)} - {formatDate(admission.active_until)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(admission)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleView(admission)} className="text-blue-600 hover:text-blue-900 mr-4">View</button>
                      <button onClick={() => handleEdit(admission)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                      <button onClick={() => handleDelete(admission)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {admissions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No admissions found.</p>
                <button
                  onClick={handleCreate}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create First Admission
                </button>
              </div>
            )}

            <Pagination
              total={totalAdmissions}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  )
}