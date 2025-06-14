"use client"
import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import CourseForm from "@/components/admin/course/CourseForm"
import Pagination from "@/components/common/Pagination"
import { fetchCourses, deleteCourse } from "@/utils/api"
import { useRouter } from "next/router"

const PAGE_SIZE = 12

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([])
  const [selectedSlug, setSelectedSlug] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)

  const router = useRouter()

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCourses({ page: currentPage, page_size: PAGE_SIZE })
        let arr = []
        if (Array.isArray(data)) {
          arr = data
        } else if (Array.isArray(data?.results)) {
          arr = data.results
          setTotal(data.count || 0)
        }
        setCourses(arr)
        setError(null)
      } catch (err) {
        console.error("Unauthorized or fetch failed:", err)
        setError("You are not authorized. Please login again.")
        setCourses([])
      }
    }
    loadCourses()
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
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse(slug)
        setRefresh((prev) => !prev)
      } catch (err) {
        console.error("Delete failed:", err)
        alert("Failed to delete course")
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
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Courses</h1>
          <button
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-sm"
            onClick={handleCreate}
          >
            + Add Course
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 border border-red-200">{error}</div>
        )}

        {!showForm && (
          <>
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Course Name</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">University</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Level</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Duration</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Array.isArray(courses) && courses.length > 0 ? (
                      courses.map((course) => (
                        <tr key={course.slug} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            <div>
                              <div className="font-semibold">{course.name}</div>
                              {course.abbreviation && (
                                <div className="text-gray-500 text-xs">({course.abbreviation})</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 text-center">
                            {course.university?.name || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 text-center">
                            {course.level?.name || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 text-center">
                            {course.duration || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-center space-x-4">
                            <button
                              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-150"
                              onClick={() => handleEdit(course.slug)}
                            >
                              Edit
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800 font-medium transition-colors duration-150"
                              onClick={() => handleDelete(course.slug)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-gray-500 text-sm">
                          No courses found.
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
                {selectedSlug ? "Edit Course" : "Add New Course"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-red-600 hover:text-red-800 font-medium transition-colors duration-150"
              >
                Cancel
              </button>
            </div>
            <CourseForm slug={selectedSlug} onSuccess={handleSuccess} />
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
