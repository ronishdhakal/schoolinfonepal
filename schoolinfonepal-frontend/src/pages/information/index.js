"use client"
import { useState, useEffect } from "react"
import Head from "next/head"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import InformationFilter from "@/components/information/InformationFilter"
import InformationCard from "@/components/information/InformationCard"
import Pagination from "@/components/common/Pagination"
import LoadingState from "@/components/common/LoadingState"
import EmptyState from "@/components/common/EmptyState"
import { fetchInformation } from "@/utils/api"
import { Tag, Search } from "lucide-react"

const PAGE_SIZE = 12

export default function InformationListPage({ initialInformation, initialCount, initialFilters, initialSearch }) {
  const [information, setInformation] = useState(initialInformation || [])
  const [filters, setFilters] = useState(
    initialFilters || {
      category: "",
      university: "",
      level: "",
      course: "",
      school: "",
    },
  )
  const [searchTerm, setSearchTerm] = useState(initialSearch || "")
  const [pagination, setPagination] = useState({
    page: 1,
    count: initialCount || 0,
  })
  const [loading, setLoading] = useState(false)

  // SEO meta
  const pageTitle = "Information & News | School Info Nepal"
  const pageDescription =
    "Stay updated with the latest educational news, notices, and information from schools and universities in Nepal."
  const pageUrl = "https://schoolinfonepal.com/information"
  const pageImage = "/school-info-nepal-og.png"

  // Reset to page 1 if filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }))
  }, [filters, searchTerm])

  // Fetch information when filters or page changes
  useEffect(() => {
    // Don't refetch on initial SSR mount
    if (
      pagination.page === 1 &&
      JSON.stringify(filters) === JSON.stringify(initialFilters) &&
      searchTerm === initialSearch
    )
      return

    setLoading(true)
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== "" && v !== null && v !== undefined),
    )

    const params = {
      ...cleanFilters,
      page: pagination.page,
      page_size: PAGE_SIZE,
      is_active: true,
    }

    if (searchTerm) {
      params.search = searchTerm
    }

    fetchInformation(params)
      .then((res) => {
        setInformation(res.results || res || [])
        setPagination((prev) => ({
          ...prev,
          count: res.count || (Array.isArray(res) ? res.length : 0),
        }))
      })
      .catch((error) => {
        console.error("Error fetching information:", error)
        setInformation([])
        setPagination({ count: 0, page: 1 })
      })
      .finally(() => setLoading(false))
  }, [filters, pagination.page, searchTerm])

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
              <Tag size={20} className="text-[#1ca3fd]" />
              <h1 className="text-3xl font-bold text-gray-900">Information & News</h1>
            </div>
            <p className="text-gray-600 max-w-3xl">
              Stay updated with the latest educational news, notices, and information from schools and universities
              across Nepal.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="relative max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Search information..."
                  defaultValue={searchTerm}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1ca3fd] focus:border-[#1ca3fd]"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
              </div>
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-[#1ca3fd] text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Filters */}
          <InformationFilter filters={filters} setFilters={setFilters} />

          {/* Results Count */}
          {!loading && (
            <div className="mb-6 text-sm text-gray-600">
              Showing <span className="font-medium">{information.length}</span> of{" "}
              <span className="font-medium">{pagination.count}</span> information
              {(Object.values(filters).some((v) => v !== "") || searchTerm) && <span> matching your criteria</span>}
            </div>
          )}

          {/* Loading State */}
          {loading && <LoadingState />}

          {/* Empty State */}
          {!loading && !information.length && (
            <EmptyState
              message="No information found"
              description={
                Object.values(filters).some((v) => v !== "") || searchTerm
                  ? "Try adjusting your filters or search criteria."
                  : "There is no information available at the moment."
              }
            />
          )}

          {/* Information Grid */}
          {!loading && information.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {information.map((info) => (
                <InformationCard key={info.id} info={info} />
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
        </div>
      </main>

      <Footer />
    </>
  )
}

// SSR for Information list
export async function getServerSideProps(context) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"
  const {
    category = "",
    university = "",
    level = "",
    course = "",
    school = "",
    search = "",
    page = "1",
  } = context.query || {}

  let initialInformation = []
  let initialCount = 0
  const initialPage = Number.parseInt(page) || 1

  try {
    const params = new URLSearchParams()
    if (category) params.append("category", category)
    if (university) params.append("university", university)
    if (level) params.append("level", level)
    if (course) params.append("course", course)
    if (school) params.append("school", school)
    if (search) params.append("search", search)
    params.append("page", initialPage.toString())
    params.append("page_size", PAGE_SIZE.toString())
    params.append("is_active", "true")

    const res = await fetch(`${API_BASE_URL}/information/?${params.toString()}`)
    if (res.ok) {
      const data = await res.json()
      initialInformation = data.results || []
      initialCount = data.count || 0
    }
  } catch (e) {
    console.error("Error fetching information:", e)
  }

  return {
    props: {
      initialInformation,
      initialCount,
      initialFilters: { category, university, level, course, school },
      initialSearch: search,
    },
  }
}
