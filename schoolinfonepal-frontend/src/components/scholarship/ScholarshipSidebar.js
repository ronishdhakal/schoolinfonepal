"use client"
import { useState, useEffect } from "react"
import { fetchScholarships } from "@/utils/api"
import { Award, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ScholarshipSidebar({ currentScholarshipId, level, university }) {
  const [relatedScholarships, setRelatedScholarships] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedScholarships = async () => {
      setLoading(true)
      try {
        // Fetch related scholarships based on level or university if available
        const params = {
          page_size: 6,
          ordering: "-published_date",
        }

        if (level) {
          params.level = level
        }

        if (university) {
          params.university = university
        }

        const response = await fetchScholarships(params)

        const scholarships = response.results || response || []
        // Filter out the current scholarship
        const filtered = scholarships.filter((scholarship) => scholarship.id !== currentScholarshipId)
        setRelatedScholarships(filtered.slice(0, 5)) // Show max 5 related scholarships
      } catch (error) {
        console.error("Error fetching related scholarships:", error)
        setRelatedScholarships([])
      } finally {
        setLoading(false)
      }
    }

    if (currentScholarshipId) {
      fetchRelatedScholarships()
    }
  }, [currentScholarshipId, level, university])

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-[#1ca3fd]" />
          <h3 className="text-lg font-semibold text-gray-900">Related Scholarships</h3>
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

  if (!relatedScholarships.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-[#1ca3fd]" />
          <h3 className="text-lg font-semibold text-gray-900">Related Scholarships</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No related scholarships found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-[#1ca3fd]" />
          <h3 className="text-lg font-semibold text-gray-900">Related Scholarships</h3>
        </div>
        <Link href="/scholarship" className="text-sm text-[#1ca3fd] hover:text-blue-600 flex items-center gap-1">
          View All
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-4">
        {relatedScholarships.map((scholarship) => (
          <ScholarshipSidebarCard key={scholarship.id} scholarship={scholarship} />
        ))}
      </div>

      {relatedScholarships.length >= 5 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link
            href="/scholarship"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors"
          >
            <span>View All Scholarships</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}

// Compact scholarship card for sidebar
function ScholarshipSidebarCard({ scholarship }) {
  const scholarshipUrl = `/scholarship/${scholarship.slug}`
  const deadline = scholarship.active_until ? new Date(scholarship.active_until).toLocaleDateString() : "N/A"

  return (
    <div className="group border border-gray-100 rounded-lg p-4 hover:border-[#1ca3fd] hover:shadow-sm transition-all duration-200">
      <Link href={scholarshipUrl} className="block">
        <div className="mb-3">
          <h4 className="font-semibold text-gray-900 group-hover:text-[#1ca3fd] transition-colors line-clamp-2 text-sm">
            {scholarship.title}
          </h4>

          {/* Organizer */}
          {(scholarship.organizer_custom ||
            scholarship.organizer_school?.name ||
            scholarship.organizer_university?.name) && (
            <p className="text-xs text-gray-600 mt-1 truncate">
              {scholarship.organizer_custom ||
                scholarship.organizer_school?.name ||
                scholarship.organizer_university?.name}
            </p>
          )}
        </div>

        <div className="text-xs text-gray-500 mb-3">
          <span className="bg-blue-50 text-[#1ca3fd] px-2 py-1 rounded border border-blue-100">
            Deadline: {deadline}
          </span>
        </div>

        {/* Level */}
        {scholarship.level?.title && (
          <div className="text-xs text-gray-600">
            <span className="inline-block bg-gray-50 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
              {scholarship.level.title}
            </span>
          </div>
        )}
      </Link>
    </div>
  )
}
