"use client";
import Head from "next/head";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useEffect, useState } from "react";
import CourseFilters from "@/components/course/CourseFilters";
import CourseCard from "@/components/course/CourseCard";
import Pagination from "@/components/common/Pagination";
import InquiryModal from "@/components/common/InquiryModal";
import { fetchCourses } from "@/utils/api";

const PAGE_SIZE = 12;

export default function CourseListPage() {
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({
    university: "",
    level: "",
    discipline: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    count: 0,
  });
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // SEO meta
  const pageTitle = "All Courses | School Info Nepal";
  const pageDescription =
    "Explore all courses offered by schools and colleges in Nepal. Filter by university, level, or discipline and send inquiries easily on School Info Nepal.";
  const pageUrl = "https://schoolinfonepal.com/course";
  const pageImage = "/school-info-nepal-og.png"; // Replace with your actual OG image path

  // Reset to page 1 if filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [filters]);

  // Fetch courses when filters or page changes
  useEffect(() => {
    setLoading(true);
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
    );
    fetchCourses({ ...cleanFilters, page: pagination.page, page_size: PAGE_SIZE })
      .then((res) => {
        // Works with both paginated and non-paginated response
        setCourses(res.results || res || []);
        setPagination((prev) => ({
          ...prev,
          count: res.count || (Array.isArray(res) ? res.length : 0),
        }));
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [filters, pagination.page]);

  // Handler for Inquire button
  function handleInquire(course) {
    setSelectedCourse(course);
    setModalOpen(true);
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
        <h1 className="text-3xl font-bold text-blue-700 mb-6">All Courses</h1>
        <CourseFilters filters={filters} setFilters={setFilters} />

        {loading && <div className="text-gray-500 py-10 text-center">Loading...</div>}

        {!loading && !courses.length && (
          <div className="text-gray-400 py-10 text-center">No courses found.</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {!loading &&
            courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onInquire={handleInquire}
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
        {modalOpen && selectedCourse && (
          <InquiryModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            course={{ id: selectedCourse.id, name: selectedCourse.name }}
          />
        )}
      </main>

      <Footer />
    </>
  );
}
