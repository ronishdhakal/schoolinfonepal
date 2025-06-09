"use client"
import { useState, useEffect } from "react"
import { fetchAdmissions } from "@/utils/api"
import { CalendarDays, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function AdmissionSidebar({ currentAdmissionId, onApply }) {
  const [relatedAdmissions, setRelatedAdmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedAdmissions = async () => {
      setLoading(true)
      try {
        // Fetch recent active admissions, excluding the current one
        const response = await fetchAdmissions({
          page_size: 6,
          ordering: "-published_date",
        })

        const admissions = response.results || response || []
        // Filter out the current admission
        const filtered = admissions.filter((admission) => admission.id !== currentAdmissionId)
        setRelatedAdmissions(filtered.slice(0, 5)) // Show max 5 related admissions
      } catch (error) {
        console.error("Error fetching related admissions:", error)
        setRelatedAdmissions([])
      } finally {
        setLoading(false)
      }
    }

    if (currentAdmissionId) {
      fetchRelatedAdmissions()
    }
  }, [currentAdmissionId])

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-5 h-5 text-[#1ca3fd]" />
          <h3 className="text-lg font-semibold text-gray-900">Other Active Admissions</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!relatedAdmissions.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-5 h-5 text-[#1ca3fd]" />
          <h3 className="text-lg font-semibold text-gray-900">Other Active Admissions</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <CalendarDays className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No other active admissions found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-[#1ca3fd]" />
          <h3 className="text-lg font-semibold text-gray-900">Other Active Admissions</h3>
        </div>
        <Link href="/admission" className="text-sm text-[#1ca3fd] hover:text-blue-600 flex items-center gap-1">
          View All
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-4">
        {relatedAdmissions.map((admission) => (
          <AdmissionSidebarCard key={admission.id} admission={admission} onApply={onApply} />
        ))}
      </div>

      {relatedAdmissions.length >= 5 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link
            href="/admission"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors"
          >
            <span>View All Admissions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}

// Compact admission card for sidebar
function AdmissionSidebarCard({ admission, onApply }) {
  const admissionUrl = `/admission/${admission.slug}`
  const fromDate = admission.active_from ? new Date(admission.active_from).toLocaleDateString() : "N/A"
  const untilDate = admission.active_until ? new Date(admission.active_until).toLocaleDateString() : "N/A"

  return (
    <div className="group border border-gray-100 rounded-lg p-4 hover:border-[#1ca3fd] hover:shadow-sm transition-all duration-200">
      <Link href={admissionUrl} className="block">
        <div className="mb-3">
          <h4 className="font-semibold text-gray-900 group-hover:text-[#1ca3fd] transition-colors line-clamp-2 text-sm">
            {admission.title}
          </h4>

          {admission.school?.name && <p className="text-xs text-gray-600 mt-1 truncate">{admission.school.name}</p>}
        </div>

        <div className="text-xs text-gray-500 mb-3">
          <span className="bg-blue-50 text-[#1ca3fd] px-2 py-1 rounded border border-blue-100">
            {fromDate} → {untilDate}
          </span>
        </div>

        {/* Courses preview */}
        {admission.courses && admission.courses.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {admission.courses.slice(0, 2).map((course) => (
                <span
                  key={course.id}
                  className="inline-block bg-gray-50 text-gray-600 px-2 py-0.5 rounded text-xs border border-gray-200"
                >
                  {course.name}
                </span>
              ))}
              {admission.courses.length > 2 && (
                <span className="inline-block bg-gray-50 text-gray-600 px-2 py-0.5 rounded text-xs border border-gray-200">
                  +{admission.courses.length - 2}
                </span>
              )}
            </div>
          </div>
        )}
      </Link>

      {/* Apply button */}
      {onApply && (
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onApply(admission)
          }}
          className="w-full px-3 py-2 bg-[#1ca3fd] hover:bg-blue-600 text-white text-xs font-medium rounded-md transition-colors"
          type="button"
        >
          Apply Now
        </button>
      )}
    </div>
  )
}
