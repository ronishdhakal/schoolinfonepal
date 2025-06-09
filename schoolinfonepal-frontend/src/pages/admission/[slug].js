"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import ScholarshipHeader from "@/components/scholarship/ScholarshipHeader"
import ScholarshipDescription from "@/components/scholarship/ScholarshipDescription"
import ScholarshipOther from "@/components/scholarship/ScholarshipOther"
import ScholarshipSidebar from "@/components/scholarship/ScholarshipSidebar"
import { fetchScholarshipBySlug } from "@/utils/api"

export default function ScholarshipDetailPage({ scholarship: initialScholarship }) {
  const router = useRouter()
  const { slug } = router.query
  const [scholarship, setScholarship] = useState(initialScholarship)
  const [loading, setLoading] = useState(!initialScholarship)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!slug || initialScholarship) return

    setLoading(true)
    fetchScholarshipBySlug(slug)
      .then(setScholarship)
      .catch(() => setError("Scholarship not found."))
      .finally(() => setLoading(false))
  }, [slug, initialScholarship])

  // SEO meta
  const metaTitle =
    scholarship?.meta_title?.trim() ||
    (scholarship ? `${scholarship.title} | School Info Nepal` : "Scholarship | School Info Nepal")
  const metaDesc =
    scholarship?.meta_description?.trim() ||
    (scholarship
      ? `Apply for ${scholarship.title}. Deadline: ${scholarship.active_until}.`
      : "Find scholarship details and apply directly through School Info Nepal.")
  const ogTitle = scholarship?.og_title?.trim() || metaTitle
  const ogDesc = scholarship?.og_description?.trim() || metaDesc
  const ogImage =
    scholarship?.og_image ||
    scholarship?.organizer_school?.logo ||
    scholarship?.organizer_university?.logo ||
    "https://schoolinfonepal.com/default-og-image.jpg"

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDesc} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://schoolinfonepal.com/scholarship/${scholarship?.slug || ""}`} />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDesc} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <Header />

      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1ca3fd] mx-auto mb-4"></div>
              <div className="text-gray-500">Loading scholarship details...</div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-lg font-medium mb-2">Error</div>
              <div className="text-gray-600">{error}</div>
            </div>
          ) : scholarship ? (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="flex-1">
                <ScholarshipHeader scholarship={scholarship} />
                <ScholarshipDescription scholarship={scholarship} />
                <ScholarshipOther scholarship={scholarship} />
              </div>

              {/* Sidebar */}
              <div className="lg:w-80 flex-shrink-0">
                <div className="sticky top-8 space-y-6">
                  <ScholarshipSidebar
                    currentScholarshipId={scholarship.id}
                    level={scholarship.level?.slug}
                    university={scholarship.university?.slug}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500">Scholarship not found.</div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

// SSR for Scholarship detail
export async function getServerSideProps({ params }) {
  const { slug } = params
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"
  let scholarship = null

  try {
    const res = await fetch(`${API_BASE_URL}/scholarships/${slug}/`)
    if (res.ok) {
      scholarship = await res.json()
    }
  } catch (e) {
    // leave scholarship as null
  }

  return {
    props: { scholarship },
  }
}
