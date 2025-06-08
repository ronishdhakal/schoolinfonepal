"use client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Head from "next/head";
import { useEffect, useState } from "react";
import SchoolFilters from "@/components/school/SchoolFilters";
import SchoolCard from "@/components/school/SchoolCard";
import Pagination from "@/components/common/Pagination";
import InquiryModal from "@/components/common/InquiryModal";
import { fetchSchools } from "@/utils/api";

// Default page size for SSR/fetch
const PAGE_SIZE = 12;

export default function SchoolListPage({ initialSchools, initialCount, initialPage, initialFilters }) {
  const [schools, setSchools] = useState(initialSchools || []);
  const [filters, setFilters] = useState(initialFilters || {
    level: "",
    district: "",
    university: "",
    type: "",
    course: "",
  });
  const [pagination, setPagination] = useState({
    page: initialPage || 1,
    count: initialCount || 0,
  });
  const [loading, setLoading] = useState(false);

  // Modal state (lifted up)
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);

  // Reset to page 1 if filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [filters]);

  // Fetch schools when filters or page changes
  useEffect(() => {
    // Don't refetch on initial SSR mount
    if (
      pagination.page === initialPage &&
      JSON.stringify(filters) === JSON.stringify(initialFilters)
    )
      return;
    setLoading(true);
    fetchSchools({ ...filters, page: pagination.page, page_size: PAGE_SIZE })
      .then((res) => {
        setSchools(res.results || []);
        setPagination((prev) => ({
          ...prev,
          count: res.count || 0,
        }));
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [filters, pagination.page]);

  // Handler for Apply button
  function handleApply(school) {
    setSelectedSchool(school);
    setModalOpen(true);
  }

  return (
    <>
      <Head>
        <title>Top Schools in Nepal | College Info Nepal</title>
        <meta
          name="description"
          content="Explore the best schools in Nepal. Filter by location, level, type, and more. Find contact details, verify status, and send inquiries instantly on College Info Nepal."
        />
        {/* OG Tags */}
        <meta property="og:title" content="Top Schools in Nepal | College Info Nepal" />
        <meta property="og:description" content="Explore the best schools in Nepal. Filter by location, level, type, and more. Find contact details, verify status, and send inquiries instantly on College Info Nepal." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://collegeinfonepal.com/school/" />
        <meta property="og:image" content="https://collegeinfonepal.com/og-schools.jpg" />
        {/* Twitter */}
        <meta name="twitter:title" content="Top Schools in Nepal | College Info Nepal" />
        <meta name="twitter:description" content="Explore the best schools in Nepal. Filter by location, level, type, and more. Find contact details, verify status, and send inquiries instantly on College Info Nepal." />
        <meta name="twitter:image" content="https://collegeinfonepal.com/og-schools.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Header />

      <main className="min-h-screen max-w-7xl mx-auto px-4 md:px-8 py-10">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Top Schools in Nepal</h1>
        <SchoolFilters filters={filters} onChange={setFilters} />

        {loading && <div className="text-gray-500 py-10 text-center">Loading...</div>}

        {!loading && !schools.length && (
          <div className="text-gray-400 py-10 text-center">No schools found.</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {!loading &&
            schools.map((school) => (
              <SchoolCard
                key={school.id}
                school={school}
                onApply={handleApply}
              />
            ))}
        </div>

        {/* Pagination */}
        {!loading && pagination.count > PAGE_SIZE && (
          <Pagination
            current={pagination.page}
            total={pagination.count}
            pageSize={PAGE_SIZE}
            onPageChange={(page) =>
              setPagination((prev) => ({ ...prev, page }))
            }
          />
        )}

        {/* Inquiry Modal rendered at page level */}
        {modalOpen && selectedSchool && (
          <InquiryModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            school={{ id: selectedSchool.id, name: selectedSchool.name }}
          />
        )}
      </main>

      <Footer />
    </>
  );
}

// --- SSR for Schools list ---
export async function getServerSideProps(context) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
  // Initial filters from query (optional for SEO links/sharing)
  const { level = "", district = "", university = "", type = "", course = "", page = "1" } = context.query || {};

  let initialSchools = [];
  let initialCount = 0;
  let initialPage = parseInt(page) || 1;

  try {
    const params = new URLSearchParams({
      level, district, university, type, course,
      page: initialPage,
      page_size: PAGE_SIZE,
    });
    const res = await fetch(`${API_BASE_URL}/schools/?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      initialSchools = data.results || [];
      initialCount = data.count || 0;
    }
  } catch (e) {
    // Fail silently: initialSchools stays empty
  }

  return {
    props: {
      initialSchools,
      initialCount,
      initialPage,
      initialFilters: { level, district, university, type, course },
    },
  };
}
