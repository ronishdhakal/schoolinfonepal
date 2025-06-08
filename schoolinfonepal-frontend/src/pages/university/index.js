"use client";
import Head from "next/head";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useEffect, useState } from "react";
import UniversityFilter from "@/components/university/UniversityFilter";
import UniversityCard from "@/components/university/UniversityCard";
import Pagination from "@/components/common/Pagination";
import { fetchUniversities } from "@/utils/api";

const PAGE_SIZE = 12;

export default function UniversityListPage() {
  const [universities, setUniversities] = useState([]);
  const [filters, setFilters] = useState({
    foreign_affiliation: "", // keep as "" (not null or undefined)
  });
  const [pagination, setPagination] = useState({
    page: 1,
    count: 0,
  });
  const [loading, setLoading] = useState(true);

  // SEO meta
  const pageTitle = "All Universities | School Info Nepal";
  const pageDescription =
    "Explore all universities in Nepal, including foreign-affiliated ones. Filter and discover universities easily with School Info Nepal.";
  const pageUrl = "https://schoolinfonepal.com/university";
  const pageImage = "/school-info-nepal-og.png"; // Update as needed

  // Reset page to 1 if filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [filters]);

  // Fetch universities when filters or page changes
  useEffect(() => {
    setLoading(true);

    // Filter out keys with "" (All) before sending to API
    const filterQuery = {};
    if (filters.foreign_affiliation === "true" || filters.foreign_affiliation === "false") {
      filterQuery.foreign_affiliation = filters.foreign_affiliation;
    }

    fetchUniversities({ ...filterQuery, page: pagination.page, page_size: PAGE_SIZE })
      .then((res) => {
        setUniversities(res.results || res || []);
        setPagination((prev) => ({
          ...prev,
          count: res.count || (Array.isArray(res) ? res.length : 0),
        }));
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [filters, pagination.page]);

  // Optional: card click handler
  function handleCardClick(university) {
    // e.g., router.push(`/university/${university.slug}`)
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={pageImage} />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
        <link rel="canonical" href={pageUrl} />
      </Head>

      <Header />

      <main className="min-h-screen max-w-7xl mx-auto px-4 md:px-8 py-10">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">All Universities</h1>
        <UniversityFilter filters={filters} setFilters={setFilters} />

        {loading && <div className="text-gray-500 py-10 text-center">Loading...</div>}
        {!loading && !universities.length && (
          <div className="text-gray-400 py-10 text-center">No universities found.</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {!loading &&
            universities.map((university) => (
              <UniversityCard
                key={university.id}
                university={university}
                onClick={handleCardClick}
              />
            ))}
        </div>

        {/* Pagination */}
        {!loading && pagination.count > PAGE_SIZE && (
          <Pagination
            current={pagination.page}
            total={pagination.count}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
          />
        )}
      </main>

      <Footer />
    </>
  );
}
