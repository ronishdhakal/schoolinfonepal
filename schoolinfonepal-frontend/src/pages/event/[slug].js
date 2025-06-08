import Head from "next/head";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EventHeader from "@/components/event/EventHeader";
import EventOverview from "@/components/event/EventOverview";
import EventDescription from "@/components/event/EventDescription";
import OtherEvents from "@/components/event/OtherEvents";
import { fetchEventBySlug, fetchEvents } from "@/utils/api";

export async function getServerSideProps({ params }) {
  const slug = params.slug;
  let event = null;
  let events = [];
  try {
    event = await fetchEventBySlug(slug);
    const allEvents = await fetchEvents();
    events = allEvents?.results || allEvents || [];
  } catch (err) {
    return { notFound: true };
  }
  if (!event) return { notFound: true };
  return { props: { event, events } };
}

export default function EventDetailPage({ event, events }) {
  // SEO meta fields
  const metaTitle = event.meta_title || event.title || "Event | School Info Nepal";
  const metaDesc =
    event.meta_description ||
    event.short_description ||
    "Learn more about this event happening at School Info Nepal.";
  const metaImage = event.featured_image || "/default-event.jpg";
  const metaKeywords = event.meta_keywords || "event, school, university, Nepal";

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta name="keywords" content={metaKeywords} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:image" content={metaImage} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://schoolinfonepal.com/event/${event.slug}/`} />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image" content={metaImage} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-10 min-h-[70vh]">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content left */}
          <section className="flex-1 min-w-0">
            <EventHeader event={event} />
            <EventOverview event={event} />
            <EventDescription event={event} />
          </section>

          {/* Sidebar right */}
          <aside className="w-full lg:w-[350px] shrink-0">
            <div className="sticky top-28">
              <OtherEvents
                events={events}
                currentSlug={event.slug}
                sidebar
              />
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
