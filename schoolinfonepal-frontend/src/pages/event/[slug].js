"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import EventHeader from "@/components/event/EventHeader"
import EventOverview from "@/components/event/EventOverview"
import EventDescription from "@/components/event/EventDescription"
import EventSidebar from "@/components/event/EventSidebar"
import { fetchEventBySlug } from "@/utils/api"

export default function EventDetailPage({ event: initialEvent }) {
  const router = useRouter()
  const { slug } = router.query
  const [event, setEvent] = useState(initialEvent)
  const [loading, setLoading] = useState(!initialEvent)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!slug || initialEvent) return

    setLoading(true)
    fetchEventBySlug(slug)
      .then(setEvent)
      .catch(() => setError("Event not found."))
      .finally(() => setLoading(false))
  }, [slug, initialEvent])

  // SEO meta
  const metaTitle =
    event?.meta_title?.trim() || (event ? `${event.title} | School Info Nepal` : "Event | School Info Nepal")
  const metaDesc =
    event?.meta_description?.trim() ||
    (event
      ? `Join ${event.title} on ${event.event_date}. ${event.venue ? `Venue: ${event.venue}.` : ""}`
      : "Find event details and register directly through School Info Nepal.")
  const ogTitle = event?.og_title?.trim() || metaTitle
  const ogDesc = event?.og_description?.trim() || metaDesc
  const ogImage = event?.og_image || event?.featured_image || "https://schoolinfonepal.com/default-og-image.jpg"

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDesc} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://schoolinfonepal.com/event/${event?.slug || ""}`} />
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
              <div className="text-gray-500">Loading event details...</div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-lg font-medium mb-2">Error</div>
              <div className="text-gray-600">{error}</div>
            </div>
          ) : event ? (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="flex-1">
                <EventHeader event={event} />
                <EventOverview event={event} />
                <EventDescription event={event} />
              </div>

              {/* Sidebar */}
              <div className="lg:w-80 flex-shrink-0">
                <div className="sticky top-8 space-y-6">
                  <EventSidebar currentEventId={event.id} />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500">Event not found.</div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

// SSR for Event detail
export async function getServerSideProps({ params }) {
  const { slug } = params
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"
  let event = null

  try {
    const res = await fetch(`${API_BASE_URL}/events/${slug}/`)
    if (res.ok) {
      event = await res.json()
    }
  } catch (e) {
    // leave event as null
  }

  return {
    props: { event },
  }
}
