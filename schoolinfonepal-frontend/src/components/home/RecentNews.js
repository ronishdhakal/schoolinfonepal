"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { fetchRecentNews } from "@/utils/api"
import { Newspaper, ArrowRight, Calendar } from "lucide-react"

export default function RecentNews() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentNews(6)
      .then((data) => {
        // API might return paginated data or flat array
        const items = data?.results || data
        setNews(Array.isArray(items) ? items : [])
      })
      .finally(() => setLoading(false))
  }, [])

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 p-4 animate-pulse"
            >
              <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (!news.length) {
    return (
      <section className="py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Newspaper size={28} className="text-[#1ca3fd]" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Recent News</h2>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-10 text-center">
          <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No News Found</h3>
          <p className="text-gray-500">There are no recent news articles at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Newspaper size={28} className="text-[#1ca3fd]" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Recent News</h2>
        </div>
        <Link
          href="/information"
          className="flex items-center gap-2 text-[#1ca3fd] hover:text-blue-600 font-medium transition-colors"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.map((item) => (
          <Link
            key={item.id}
            href={`/information/${item.slug}`}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex items-center gap-4 p-4 group"
          >
            {/* News Image */}
            {item.featured_image ? (
              <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-gray-50">
                <Image
                  src={item.featured_image || "/placeholder.svg"}
                  alt={item.title}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex-shrink-0 w-24 h-24 rounded-xl bg-gray-50 flex items-center justify-center">
                <Newspaper className="w-8 h-8 text-gray-300" />
              </div>
            )}

            {/* News Content */}
            <div className="flex flex-col flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-[#1ca3fd] transition-colors">
                {item.title}
              </h3>
              {item.summary && <p className="text-sm text-gray-500 mb-2 line-clamp-2">{item.summary}</p>}
              <div className="flex items-center text-xs text-gray-400 mt-auto">
                <Calendar size={14} className="mr-1" />
                {item.published_date}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
