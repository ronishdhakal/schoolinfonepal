"use client"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Head from "next/head"
import { useEffect, useState } from "react"
import SchoolFilters from "@/components/school/SchoolFilters"
import SchoolCard from "@/components/school/SchoolCard"
import Pagination from "@/components/common/Pagination"
import InquiryModal from "@/components/common/InquiryModal"
import EmptyState from "@/components/common/EmptyState"
import LoadingState from "@/components/common/LoadingState"
import { fetchSchools } from "@/utils/api"
import { GraduationCap, Search } from "lucide-react"

const PAGE_SIZE = 12

export default function SchoolListPage({ initialSchools, initialCount, initialPage, initialFilters }) {
  const [schools, setSchools] = useState(initialSchools || [])
  const [filters, setFilters] = useState(
    initialFilters || {
      level: "",
      district: "",
      university: "",
      type: "",
      course: "",
    },
  )
  const [searchTerm, setSearchTerm] = useState("")
  const [pagination, setPagination] = useState({
    page: initialPage || 1,
    count: initialCount || 0,
  })
  const [loading, setLoading] = useState(false)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState(null)

  // SEO meta
  const pageTitle = "Top Schools in Nepal | School Info Nepal"
  const pageDescription =
    "Explore the best schools and colleges in Nepal. Filter by location, level, type, and courses. Find contact details, verify status, and send inquiries instantly."
  const pageUrl = "https://schoolinfonepal.com/school"
  const pageImage = "/school-info-nepal-og.png"

  // Reset to page 1 if filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }))
  }, [filters, searchTerm])

  // Fetch schools when filters or page changes
  useEffect(() => {
    // Don't refetch on initial SSR mount
    if (pagination.page === initialPage && JSON.stringify(filters) === JSON.stringify(initialFilters) && !searchTerm)
      return

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

    fetchSchools(params)
      .then((res) => {
        setSchools(res.results || res || [])
        setPagination((prev) => ({
          ...prev,
          count: res.count || (Array.isArray(res) ? res.length : 0),
        }))
      })
      .catch((error) => {
        console.error("Error fetching schools:", error)
      })
      .finally(() => setLoading(false))
  }, [filters, pagination.page, searchTerm])

  // Handler for Apply button
  function handleApply(school) {
    setSelectedSchool(school)
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
              <GraduationCap size={20} className="text-[#1ca3fd]" />
              <h1 className="text-3xl font-bold text-gray-900">Top Schools in Nepal</h1>
            </div>
            <p className="text-gray-600 max-w-3xl">
              Explore the best schools and colleges in Nepal. Filter by location, level, type, and courses to find the
              perfect educational institution for you.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="relative max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Search schools and colleges..."
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
          <SchoolFilters filters={filters} onChange={setFilters} />

          {/* Results Count */}
          {!loading && (
            <div className="mb-6 text-sm text-gray-600">
              Showing <span className="font-medium">{schools.length}</span> of{" "}
              <span className="font-medium">{pagination.count}</span> schools
              {(filters.level ||
                filters.district ||
                filters.university ||
                filters.type ||
                filters.course ||
                searchTerm) && <span> matching your criteria</span>}
            </div>
          )}

          {/* Loading State */}
          {loading && <LoadingState />}

          {/* Empty State */}
          {!loading && !schools.length && (
            <EmptyState
              message="No schools found"
              description={
                filters.level || filters.district || filters.university || filters.type || filters.course || searchTerm
                  ? "Try adjusting your filters or search criteria."
                  : "There are no schools available at the moment."
              }
            />
          )}

          {/* Schools Grid */}
          {!loading && schools.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {schools.map((school) => (
                <SchoolCard key={school.id} school={school} onApply={handleApply} />
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

          {/* Inquiry Modal */}
          {modalOpen && selectedSchool && (
            <InquiryModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              school={{ id: selectedSchool.id, name: selectedSchool.name }}
            />
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

// SSR for Schools list
export async function getServerSideProps(context) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"
  const { level = "", district = "", university = "", type = "", course = "", page = "1" } = context.query || {}

  let initialSchools = []
  let initialCount = 0
  const initialPage = Number.parseInt(page) || 1

  try {
    const params = new URLSearchParams({
      level,
      district,
      university,
      type,
      course,
      page: initialPage,
      page_size: PAGE_SIZE,
    })
    const res = await fetch(`${API_BASE_URL}/schools/?${params.toString()}`)
    if (res.ok) {
      const data = await res.json()
      initialSchools = data.results || []
      initialCount = data.count || 0
    }
  } catch (e) {
    // Fail silently: initialSchools stays empty
  }

  return {
    props: {
      initialSchools,
      initialCount,
      initialPage,
      initialFilters: { level, district, university, type, course },
    },
  }
}
