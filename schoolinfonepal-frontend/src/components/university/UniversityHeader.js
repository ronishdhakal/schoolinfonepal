"use client"
import Image from "next/image"
import { MapPin, BadgeCheck } from "lucide-react"

function getFullImageUrl(url) {
  if (!url) return ""
  if (url.startsWith("http")) return url
  const BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") || "http://127.0.0.1:8000"
  return `${BASE}${url}`
}

export default function UniversityHeader({ university }) {
  if (!university) return null

  return (
    <header className="relative w-full flex flex-col justify-end overflow-hidden">
      {/* Cover Photo */}
      <div className="relative w-full aspect-[21/6] md:aspect-[21/5] bg-gray-100">
        {university.cover_photo ? (
          <Image
            src={getFullImageUrl(university.cover_photo) || "/placeholder.svg"}
            alt={`${university.name} cover image`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-50 to-gray-100 flex items-center justify-center text-gray-400">
            <span className="text-lg font-light italic">No Cover Photo Available</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Header Info Block */}
      <div className="relative w-full bg-white px-6 sm:px-8 md:px-12 py-6 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-t-3xl shadow-md -mt-8">
        {/* Left: Logo and Info */}
        <div className="flex items-center gap-5 w-full sm:w-auto">
          {/* Logo */}
          {university.logo ? (
            <div className="relative -mt-16 sm:-mt-24 bg-white p-2.5 rounded-xl shadow-md border-4 border-white transition-all hover:shadow-lg">
              <Image
                src={getFullImageUrl(university.logo) || "/placeholder.svg"}
                alt={`${university.name} logo`}
                width={112}
                height={112}
                className="object-contain rounded-lg"
              />
            </div>
          ) : (
            <div
              className="bg-blue-50 flex items-center justify-center rounded-xl text-sm text-gray-500 -mt-16 sm:-mt-24 border-4 border-white shadow-md"
              style={{ width: "112px", height: "112px" }}
            >
              No Logo
            </div>
          )}

          {/* Name and Location */}
          <div className="flex-1 pt-2 sm:pt-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 flex items-center flex-wrap">
              {university.name}
              {university.verification && (
                <span className="ml-2" title="Verified University">
                  <BadgeCheck className="text-[#1ca3fd]" style={{ width: "28px", height: "28px" }} />
                </span>
              )}
            </h1>
            <div className="flex items-center flex-wrap text-gray-600 text-sm md:text-base mt-2 gap-2">
              {university.address && (
                <span className="flex items-center">
                  <MapPin className="mr-1 flex-shrink-0 text-[#1ca3fd]" style={{ width: "20px", height: "20px" }} />
                  <span>{university.address}</span>
                </span>
              )}
              {university.foreign_affiliation && (
                <span className="bg-blue-50 text-gray-800 rounded-full px-3 py-1 text-xs md:text-sm border border-blue-100">
                  Foreign Affiliated
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
