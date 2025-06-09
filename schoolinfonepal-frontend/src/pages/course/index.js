"use client"
import Head from "next/head"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { useEffect, useState } from "react"
import CourseFilters from "@/components/course/CourseFilters"
import CourseCard from "@/components/course/CourseCard"
import Pagination from "@/components/common/Pagination"
import InquiryModal from "@/components/common/InquiryModal"
import EmptyState from "@/components/common/EmptyState"
import LoadingState from "@/components/common/LoadingState"
import { fetchCourses } from "@/utils/api"
import { BookOpen, Search } from "lucide-react"

const PAGE_SIZE = 12

export default function CourseListPage() {
  const [courses, setCourses] = useState([])
  const [filters, setFilters] = useState({
    university: "",
    level: "",
    discipline: "",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [pagination, setPagination] = useState({
    page: 1,
    count: 0,
  })
  const [loading, setLoading] = useState(true)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)

  // SEO meta
  const pageTitle = "All Courses | School Info Nepal"
  const pageDescription =
    "Explore all courses offered by schools and colleges in Nepal. Filter by university, level, or discipline and send inquiries easily on School Info Nepal."
  const pageUrl = "https://schoolinfonepal.com/course"
  const pageImage = "/school-info-nepal-og.png"

  // Reset to page 1 if filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }))
  }, [filters, searchTerm])

  // Fetch courses when filters or page changes
  useEffect(() => {
    setLoading(true)
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== "" && v !== null && v !== undefined),
    )

    const params = {
      ...cleanFilters,
      page: pagination.page,
      page_size: PAGE_SIZE,
    }

    if (searchTerm) {
      params.search = searchTerm
    }

    fetchCourses(params)
      .then((res) => {
        setCourses(res.results || res || [])
        setPagination((prev) => ({
          ...prev,
          count: res.count || (Array.isArray(res) ? res.length : 0),
        }))
      })
      .catch((error) => {
        console.error("Error fetching courses:", error)
      })
      .finally(() => setLoading(false))
  }, [filters, pagination.page, searchTerm])

  // Handler for Inquire button
  function handleInquire(course) {
    setSelectedCourse(course)
    setModalOpen(true)
  }

  // Handler for search
  function handleSearch(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    setSearchTerm(formData.get("search") || "")
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={pageImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
        <link rel="canonical" href={pageUrl} />
      </Head>

      <Header />

      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={20} className="text-[#1ca3fd]" />
              <h1 className="text-3xl font-bold text-gray-900">All Courses</h1>
            </div>
            <p className="text-gray-600 max-w-3xl">
              Explore courses offered by schools and colleges in Nepal. Filter by university, level, or discipline to
              find the perfect course for you.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="relative max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Search courses..."
                  defaultValue={searchTerm}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1ca3fd] focus:border-[#1ca3fd]"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
              </div>
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-[#1ca3fd] text-white text-sm font-medium rounded-md hover:bg-[#0b8de0] transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Filters */}
          <CourseFilters filters={filters} setFilters={setFilters} />

          {/* Results Count */}
          {!loading && (
            <div className="mb-6 text-sm text-gray-600">
              Showing <span className="font-medium">{courses.length}</span> of{" "}
              <span className="font-medium">{pagination.count}</span> courses
              {(filters.university || filters.level || filters.discipline || searchTerm) && (
                <span> matching your criteria</span>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && <LoadingState />}

          {/* Empty State */}
          {!loading && !courses.length && (
            <EmptyState
              message="No courses found"
              description={
                filters.university || filters.level || filters.discipline || searchTerm
                  ? "Try adjusting your filters or search criteria."
                  : "There are no courses available at the moment."
              }
            />
          )}

          {/* Course Grid */}
          {!loading && courses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} onInquire={handleInquire} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.count > PAGE_SIZE && (
            <Pagination
              current={pagination.page}
              total={pagination.count}
              pageSize={PAGE_SIZE}
              onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
            />
          )}

          {/* Inquiry Modal rendered at page level */}
          {modalOpen && selectedCourse && (
            <InquiryModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              course={{ id: selectedCourse.id, name: selectedCourse.name }}
            />
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
