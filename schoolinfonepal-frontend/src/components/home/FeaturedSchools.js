"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { fetchFeaturedSchools } from "@/utils/api"
import { CheckCircle, MapPin, Building, ArrowRight } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import the modal to avoid SSR issues
const AdmissionInquiryModal = dynamic(() => import("@/components/common/AdmissionInquiryModal"), { ssr: false })

export default function FeaturedSchools() {
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [modalCourses, setModalCourses] = useState([])

  useEffect(() => {
    fetchFeaturedSchools()
      .then((data) => {
        const result = data?.results || data
        setSchools(Array.isArray(result) ? result.slice(0, 6) : [])
      })
      .finally(() => setLoading(false))
  }, [])

  const openModal = (e, school, openCourses) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedSchool(school)
    setModalCourses(openCourses)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedSchool(null)
    setModalCourses([])
  }

  if (loading) {
    return (
      <section className="py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            <div className="h-8 bg-gray-200 rounded w-40"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-32 bg-gray-200"></div>
              <div className="p-6 pt-8">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex gap-2 mb-4">
                  {[1, 2].map((j) => (
                    <div key={j} className="h-6 bg-gray-200 rounded-full w-16"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (!schools.length) {
    return (
      <section className="py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Building size={28} className="text-[#1ca3fd]" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Schools</h2>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-10 text-center">
          <Building className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Schools Found</h3>
          <p className="text-gray-500">There are no featured schools at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Building size={28} className="text-[#1ca3fd]" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Schools</h2>
        </div>
        <Link
          href="/school"
          className="flex items-center gap-2 text-[#1ca3fd] hover:text-blue-600 font-medium transition-colors"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schools.map((school) => {
          const openCourses =
            school.school_courses_display
              ?.filter((c) => c.status && c.status.trim().toLowerCase() === "open")
              .map((c) => ({
                id: c.course?.id,
                name: c.course?.name,
              })) || []

          // Combine address + district if available
          let addressDistrict = school.address || ""
          if (school.district && school.district.name) {
            if (addressDistrict) addressDistrict += ", "
            addressDistrict += school.district.name
          }

          return (
            <Link
              key={school.id}
              href={`/school/${school.slug}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden group"
            >
              {/* Cover Photo */}
              <div className="relative w-full h-32 bg-gray-50">
                {school.cover_photo ? (
                  <Image
                    src={school.cover_photo || "/placeholder.svg"}
                    alt={`${school.name} Cover`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm bg-gray-100">
                    <Building size={32} />
                  </div>
                )}

                {/* Apply Button */}
                <button
                  onClick={(e) => openModal(e, school, openCourses)}
                  className="absolute top-2 right-2 px-4 py-1.5 rounded-lg bg-[#1ca3fd] text-white text-sm font-semibold shadow-sm hover:bg-[#1692de] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1ca3fd] focus:ring-offset-2"
                >
                  Apply
                </button>

                {/* Logo */}
                <div className="absolute -bottom-6 left-4 bg-white rounded-full shadow-md p-1 w-12 h-12 flex items-center justify-center">
                  {school.logo ? (
                    <Image
                      src={school.logo || "/placeholder.svg"}
                      alt={school.name}
                      width={40}
                      height={40}
                      className="object-contain rounded-full"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs rounded-full bg-gray-50">
                      <Building size={20} />
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="pt-8 px-4 pb-4 flex flex-col flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#1ca3fd] transition-colors line-clamp-1">
                    {school.name}
                  </h3>
                  {school.verification && (
                    <CheckCircle className="w-4 h-4 text-[#1ca3fd] flex-shrink-0" title="Verified" />
                  )}
                </div>

                <div className="flex items-center text-xs text-gray-500 mb-3 gap-1.5">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="line-clamp-1">{addressDistrict || "Location not provided"}</span>
                </div>

                {/* Open Courses */}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {openCourses.length > 0 ? (
                    openCourses.slice(0, 3).map((c) =>
                      c.name ? (
                        <span
                          key={c.id}
                          className="bg-blue-50 text-blue-600 rounded-full px-2 py-0.5 text-xs font-medium"
                        >
                          {c.name}
                        </span>
                      ) : null,
                    )
                  ) : (
                    <span className="text-xs text-gray-400">No open courses</span>
                  )}
                  {openCourses.length > 3 && (
                    <span className="text-xs text-gray-500">+{openCourses.length - 3} more</span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Inquiry Modal */}
      <AdmissionInquiryModal
        open={modalOpen}
        onClose={closeModal}
        school={selectedSchool}
        courses={modalCourses}
        onSuccess={closeModal}
      />
    </section>
  )
}
