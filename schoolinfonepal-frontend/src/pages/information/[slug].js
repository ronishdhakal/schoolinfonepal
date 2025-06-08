import Head from "next/head";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InformationHeader from "@/components/information/InformationHeader";
import InformationTopDescription from "@/components/information/InformationTopDescription";
import InformationContent from "@/components/information/InformationContent";
import InformationBelowDescription from "@/components/information/InformationBelowDescription";
import RecentInformation from "@/components/information/RecentInformation";

export default function InformationDetailPage({ info, recentInformation }) {
  if (!info) {
    return (
      <>
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center text-gray-400">No information found.</div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{info.meta_title || info.title}</title>
        <meta name="description" content={info.meta_description || info.summary || ""} />
        <meta name="keywords" content={info.meta_keywords || ""} />
        <meta property="og:title" content={info.meta_title || info.title} />
        <meta property="og:description" content={info.meta_description || info.summary || ""} />
        {info.featured_image && <meta property="og:image" content={info.featured_image} />}
      </Head>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main content area: take more width on desktop */}
          <div className="w-full md:flex-[3] min-w-0">
            <InformationHeader info={info} />
            <InformationTopDescription info={info} />
            <InformationContent info={info} />
            <InformationBelowDescription info={info} />
          </div>
          {/* Sidebar */}
          <div className="w-full md:flex-[1] md:max-w-xs flex-shrink-0">
            <RecentInformation items={recentInformation} currentSlug={info.slug} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// --------------------------
// SSR - Server-side fetching
// --------------------------
export async function getServerSideProps(context) {
  const { slug } = context.params;
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_BASE_URL ||
    "http://127.0.0.1:8000/api";

  let info = null;
  let recentInformation = [];

  try {
    const [infoRes, recentRes] = await Promise.all([
      fetch(`${baseUrl}/information/${slug}/`),
      fetch(`${baseUrl}/information/?is_active=true&ordering=-published_date&page_size=6`)
    ]);

    if (infoRes.ok) info = await infoRes.json();
    if (recentRes.ok) {
      const recentData = await recentRes.json();
      recentInformation = Array.isArray(recentData.results)
        ? recentData.results
        : Array.isArray(recentData)
        ? recentData
        : [];
    }
  } catch (err) {
    // ignore error, show fallback UI
  }

  return {
    props: { info, recentInformation },
  };
}
