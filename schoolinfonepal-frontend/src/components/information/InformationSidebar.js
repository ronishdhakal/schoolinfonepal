"use client"
import { useState, useEffect } from "react"
import { fetchInformation } from "@/utils/api"
import { Tag, ArrowRight } from "lucide-react"
import Link from "next/link"
import InformationCard from "./InformationCard"

export default function InformationSidebar({ currentInfoId, category }) {
  const [relatedInformation, setRelatedInformation] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedInformation = async () => {
      setLoading(true)
      try {
        // Fetch related information based on category if available
        const params = {
          page_size: 6,
          ordering: "-published_date",
          is_active: true,
        }

        if (category) {
          params.category = category
        }

        const response = await fetchInformation(params)

        const information = response.results || response || []
        // Filter out the current information
        const filtered = information.filter((info) => info.id !== currentInfoId)
        setRelatedInformation(filtered.slice(0, 5)) // Show max 5 related information
      } catch (error) {
        console.error("Error fetching related information:", error)
        setRelatedInformation([])
      } finally {
        setLoading(false)
      }
    }

    if (currentInfoId) {
      fetchRelatedInformation()
    }
  }, [currentInfoId, category])

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-[#1ca3fd]" />
          <h3 className="text-lg font-semibold text-gray-900">Related Information</h3>
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

  if (!relatedInformation.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-[#1ca3fd]" />
          <h3 className="text-lg font-semibold text-gray-900">Related Information</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Tag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No related information found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#1ca3fd]" />
          <h3 className="text-lg font-semibold text-gray-900">Related Information</h3>
        </div>
        <Link href="/information" className="text-sm text-[#1ca3fd] hover:text-blue-600 flex items-center gap-1">
          View All
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-4">
        {relatedInformation.map((info) => (
          <InformationCard key={info.id} info={info} compact />
        ))}
      </div>

      {relatedInformation.length >= 5 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link
            href="/information"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors"
          >
            <span>View All Information</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
