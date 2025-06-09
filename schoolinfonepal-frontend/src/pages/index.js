"use client"
import { useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import TopAds from "@/components/home/TopAds"
import SidebarAds from "@/components/home/SidebarAds"
import FeaturedSchools from "@/components/home/FeaturedSchools"
import FeaturedAdmissions from "@/components/home/FeaturedAdmissions"
import RecentNews from "@/components/home/RecentNews"
import { Search, GraduationCap, School, BookOpen, Calendar } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  return (
    <>
      <Head>
        <title>School Info Nepal - Find Schools, Universities, Events & More</title>
        <meta
          name="description"
          content="Discover schools, universities, events, scholarships, and educational opportunities in Nepal. Your comprehensive guide to education in Nepal."
        />
        <meta property="og:title" content="School Info Nepal - Find Schools, Universities, Events & More" />
        <meta
          property="og:description"
          content="Discover schools, universities, events, scholarships, and educational opportunities in Nepal."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://schoolinfonepal.com" />
        <meta property="og:image" content="/school-info-nepal-og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://schoolinfonepal.com" />
      </Head>

      <Header />

      <main className="bg-[#f7fbfd] min-h-screen">
        {/* Hero Section with Search */}
        <section className="bg-gradient-to-br from-blue-50 to-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Perfect
              <span className="text-[#1ca3fd] block">Educational Path</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover schools, universities, events, scholarships, and educational opportunities across Nepal. Your
              comprehensive guide to education.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for schools, universities, events..."
                  className="w-full pl-12 pr-4 py-4 text-lg bg-white border border-gray-200 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-[#1ca3fd] focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search size={24} className="text-gray-400" />
                </div>
              </div>
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-[#1ca3fd] text-white font-medium rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Search
              </button>
            </form>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/school"
                className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-[#1ca3fd] hover:text-[#1ca3fd]"
              >
                <School size={18} />
                Browse Schools
              </Link>
              <Link
                href="/university"
                className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-[#1ca3fd] hover:text-[#1ca3fd]"
              >
                <GraduationCap size={18} />
                Browse Universities
              </Link>
              <Link
                href="/scholarship"
                className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-[#1ca3fd] hover:text-[#1ca3fd]"
              >
                <BookOpen size={18} />
                Find Scholarships
              </Link>
              <Link
                href="/event"
                className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-[#1ca3fd] hover:text-[#1ca3fd]"
              >
                <Calendar size={18} />
                Upcoming Events
              </Link>
            </div>
          </div>
        </section>

        {/* Top banner ad */}
        <div className="w-full flex justify-center pt-8 pb-4">
          <TopAds />
        </div>

        {/* Main grid for desktop */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-12 px-4 sm:px-6 lg:px-8 pb-16">
          {/* Main content */}
          <section>
            <FeaturedSchools />
            <FeaturedAdmissions />

            {/* Sidebar Ads for mobile/tablet (below admissions, hidden on lg+) */}
            <div className="block lg:hidden my-8">
              <SidebarAds />
            </div>

            <RecentNews />
          </section>

          {/* Sidebar for desktop only */}
          <aside className="hidden lg:flex flex-col items-center gap-8 pt-4">
            <SidebarAds />
          </aside>
        </div>
      </main>

      <Footer />
    </>
  )
}
