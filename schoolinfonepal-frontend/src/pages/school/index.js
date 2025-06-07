"use client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useEffect, useState } from "react";
import SchoolFilters from "@/components/school/SchoolFilters";
import SchoolCard from "@/components/school/SchoolCard";
import Pagination from "@/components/common/Pagination";
import { fetchSchools } from "@/utils/api";

const PAGE_SIZE = 12;

export default function SchoolListPage() {
  const [schools, setSchools] = useState([]);
  const [filters, setFilters] = useState({
    level: "",
    district: "",
    university: "",
    type: "",
    course: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    count: 0,
  });
  const [loading, setLoading] = useState(true);

  // Reset to page 1 if filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [filters]);

  // Fetch schools when filters or page changes
  useEffect(() => {
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

  return (
    <>
      <Header />

      <main className="min-h-screen max-w-7xl mx-auto px-4 md:px-8 py-10">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">All Schools</h1>
        <SchoolFilters filters={filters} onChange={setFilters} />

        {loading && <div className="text-gray-500 py-10 text-center">Loading...</div>}

        {!loading && !schools.length && (
          <div className="text-gray-400 py-10 text-center">No schools found.</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {!loading &&
            schools.map((school) => <SchoolCard key={school.id} school={school} />)}
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
      </main>

      <Footer />
    </>
  );
}
