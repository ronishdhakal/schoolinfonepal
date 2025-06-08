"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdmissionFilters from "@/components/admission/AdmissionFilters";
import AdmissionCard from "@/components/admission/AdmissionCard";
import Pagination from "@/components/common/Pagination";
import { fetchAdmissions } from "@/utils/api";

const PAGE_SIZE = 12;

export default function AdmissionListPage() {
  const [admissions, setAdmissions] = useState([]);
  const [filters, setFilters] = useState({
    level: "",
    university: "",
    course: "",
    page: 1,
  });
  const [pagination, setPagination] = useState({
    count: 0,
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  // Fetch admissions when filters/page changes
  useEffect(() => {
    setLoading(true);
    fetchAdmissions({
      ...filters,
      page: filters.page || 1,
      page_size: PAGE_SIZE,
    })
      .then((data) => {
        setAdmissions(data.results || []);
        setPagination({
          count: data.count || 0,
          page: filters.page || 1,
          totalPages: data.count ? Math.ceil(data.count / PAGE_SIZE) : 1,
        });
      })
      .catch(() => {
        setAdmissions([]);
        setPagination({ count: 0, page: 1, totalPages: 1 });
      })
      .finally(() => setLoading(false));
  }, [filters]);

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <>
      <Head>
        <title>Admissions | School Info Nepal</title>
      </Head>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Admissions</h1>
        <AdmissionFilters filters={filters} setFilters={setFilters} />

        <div className="mt-8 min-h-[250px]">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : admissions.length === 0 ? (
            <div className="text-center text-gray-500 py-12">No admissions found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {admissions.map((admission) => (
                <AdmissionCard key={admission.id} admission={admission} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-center">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>

      <Footer />
    </>
  );
}
