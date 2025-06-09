"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { fetchFeaturedAdmissions } from "@/utils/api"
import { Calendar, School, ArrowRight } from "lucide-react"

export default function FeaturedAdmissions() {
  const [admissions, setAdmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedAdmissions()
      .then((data) => {
        const result = data?.results || data
        setAdmissions(Array.isArray(result) ? result : [])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="py-12 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Admissions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {[1, 2].map((j) => (
                    <div key={j} className="h-6 bg-gray-200 rounded-full w-20"></div>
                  ))}
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mt-4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!admissions.length) {
    return (
      <section className="py-12 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Admissions</h2>
          </div>
          <div className="bg-gray-50 rounded-xl p-10 text-center">
            <School className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Admissions Found</h3>
            <p className="text-gray-500">There are no featured admissions at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <School size={28} className="text-[#1ca3fd]" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Admissions</h2>
          </div>
          <Link
            href="/admission"
            className="flex items-center gap-2 text-[#1ca3fd] hover:text-blue-600 font-medium transition-colors"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {admissions.map((adm) => (
            <Link
              key={adm.id}
              href={`/admission/${adm.slug}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-6 flex flex-col items-start group"
            >
              {/* Logo and School Name */}
              <div className="flex items-center mb-4 w-full">
                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                  {adm.school && adm.school.logo ? (
                    <Image
                      src={adm.school.logo || "/placeholder.svg"}
                      alt={adm.school.name}
                      width={64}
                      height={64}
                      className="object-contain w-full h-full"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                      <School size={24} />
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-[#1ca3fd] transition-colors">
                    {adm.school?.name || "Unknown School"}
                  </h3>
                  {adm.title && <p className="text-sm text-gray-500 line-clamp-1">{adm.title}</p>}
                </div>
              </div>

              {/* Courses */}
              <div className="flex flex-wrap gap-2 mb-4">
                {(adm.courses || []).slice(0, 3).map((c) =>
                  c && typeof c === "object" ? (
                    <span key={c.id} className="bg-blue-50 text-blue-600 rounded-full px-3 py-1 text-xs font-medium">
                      {c.name}
                    </span>
                  ) : null,
                )}
                {adm.courses && adm.courses.length > 3 && (
                  <span className="text-xs text-gray-500 flex items-center">+{adm.courses.length - 3} more</span>
                )}
              </div>

              {/* Admission Dates */}
              <div className="flex items-center mt-auto pt-2 border-t border-gray-100 w-full text-sm text-gray-500">
                <Calendar size={16} className="mr-2 text-[#1ca3fd]" />
                <span>
                  {adm.active_from && adm.active_until ? (
                    <>
                      {adm.active_from} – {adm.active_until}
                    </>
                  ) : (
                    "Dates not specified"
                  )}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
