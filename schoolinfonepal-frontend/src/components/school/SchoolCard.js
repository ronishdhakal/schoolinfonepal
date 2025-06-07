import Image from "next/image";
import Link from "next/link";
import { CheckCircle, MapPin, Calendar, ExternalLink, Star } from "lucide-react";

export default function SchoolCard({ school, onApply }) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
      {/* Cover Photo */}
      <div className="relative w-full h-40 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        {school.cover_photo ? (
          <Image
            src={school.cover_photo || "/placeholder.svg"}
            alt={`${school.name} Cover`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span className="text-sm">No Cover Image</span>
            </div>
          </div>
        )}

        {/* Featured Badge */}
        {school.featured && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </span>
          </div>
        )}

        {/* Logo Overlay */}
        <div className="absolute -bottom-8 left-6">
          <div className="bg-white rounded-2xl shadow-lg p-2 w-16 h-16 flex items-center justify-center border-2 border-white">
            {school.logo ? (
              <Image
                src={school.logo || "/placeholder.svg"}
                alt={school.name}
                width={48}
                height={48}
                className="object-contain rounded-lg"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="pt-10 px-6 pb-6">
        {/* School Name and Verification */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {school.name}
              </h3>
              {school.verification && (
                <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" title="Verified School" />
              )}
            </div>
          </div>
        </div>

        {/* Address */}
        {school.address && (
          <div className="flex items-start gap-2 mb-3">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-600 line-clamp-2">{school.address}</span>
          </div>
        )}

        {/* Established Date */}
        {school.established_date && (
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Established {new Date(school.established_date).getFullYear()}</span>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {school.level && (
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
              {school.level.title}
            </span>
          )}
          {school.type && (
            <span className="px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium">
              {school.type.name}
            </span>
          )}
          {school.district && (
            <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">
              {school.district.name}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/school/${school.slug}`}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm font-medium group"
          >
            View Details
            <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <button
            onClick={() => onApply && onApply(school)}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 text-sm font-medium"
            type="button"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}
