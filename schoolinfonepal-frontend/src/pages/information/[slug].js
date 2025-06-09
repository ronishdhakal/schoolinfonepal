"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import InformationHeader from "@/components/information/InformationHeader"
import InformationTopDescription from "@/components/information/InformationTopDescription"
import InformationContent from "@/components/information/InformationContent"
import InformationBelowDescription from "@/components/information/InformationBelowDescription"
import InformationSidebar from "@/components/information/InformationSidebar"
import { fetchInformationBySlug } from "@/utils/api"

export default function InformationDetailPage({ info: initialInfo, recentInformation }) {
  const router = useRouter()
  const { slug } = router.query
  const [info, setInfo] = useState(initialInfo)
  const [loading, setLoading] = useState(!initialInfo)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!slug || initialInfo) return

    setLoading(true)
    fetchInformationBySlug(slug)
      .then(setInfo)
      .catch(() => setError("Information not found."))
      .finally(() => setLoading(false))
  }, [slug, initialInfo])

  // SEO meta
  const metaTitle =
    info?.meta_title?.trim() || (info ? `${info.title} | School Info Nepal` : "Information | School Info Nepal")
  const metaDesc =
    info?.meta_description?.trim() ||
    info?.summary ||
    (info ? `Read about ${info.title} on School Info Nepal.` : "Find educational information on School Info Nepal.")
  const ogTitle = info?.og_title?.trim() || metaTitle
  const ogDesc = info?.og_description?.trim() || metaDesc
  const ogImage = info?.featured_image || "https://schoolinfonepal.com/default-og-image.jpg"

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDesc} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://schoolinfonepal.com/information/${info?.slug || ""}`} />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDesc} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        {info?.meta_keywords && <meta name="keywords" content={info.meta_keywords} />}
      </Head>

      <Header />

      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1ca3fd] mx-auto mb-4"></div>
              <div className="text-gray-500">Loading information...</div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-lg font-medium mb-2">Error</div>
              <div className="text-gray-600">{error}</div>
            </div>
          ) : info ? (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="flex-1">
                <InformationHeader info={info} />
                <InformationTopDescription info={info} />
                <InformationContent info={info} />
                <InformationBelowDescription info={info} />
              </div>

              {/* Sidebar */}
              <div className="lg:w-80 flex-shrink-0">
                <div className="sticky top-8 space-y-6">
                  <InformationSidebar currentInfoId={info.id} category={info.category?.slug} />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500">Information not found.</div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

// SSR for Information detail
export async function getServerSideProps({ params }) {
  const { slug } = params
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"
  let info = null
  let recentInformation = []

  try {
    const [infoRes, recentRes] = await Promise.all([
      fetch(`${API_BASE_URL}/information/${slug}/`),
      fetch(`${API_BASE_URL}/information/?is_active=true&ordering=-published_date&page_size=6`),
    ])

    if (infoRes.ok) info = await infoRes.json()
    if (recentRes.ok) {
      const recentData = await recentRes.json()
      recentInformation = Array.isArray(recentData.results)
        ? recentData.results
        : Array.isArray(recentData)
          ? recentData
          : []
    }
  } catch (err) {
    console.error("Error fetching information:", err)
  }

  return {
    props: { info, recentInformation },
  }
}
