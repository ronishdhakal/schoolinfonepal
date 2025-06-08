// pages/scholarship/index.js
"use client";
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScholarshipCard from "@/components/scholarship/ScholarshipCard";
import { fetchScholarships } from "@/utils/api";

const PAGE_SIZE = 12;

export default function ScholarshipListPage() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, count: 0 });

  useEffect(() => {
    setLoading(true);
    fetchScholarships({ page: pagination.page, page_size: PAGE_SIZE })
      .then((data) => {
        setScholarships(data.results || []);
        setPagination((prev) => ({
          ...prev,
          count: data.count || 0,
        }));
      })
      .finally(() => setLoading(false));
  }, [pagination.page]);

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto py-10 px-4 min-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-center">Scholarships</h1>
        {loading ? (
          <div className="text-center text-gray-400 py-10">Loading scholarships…</div>
        ) : scholarships.length === 0 ? (
          <div className="text-center text-gray-400 py-10">No scholarships found.</div>
        ) : (
          <div>
            {scholarships.map((scholarship) => (
              <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
            ))}
            {/* Pagination */}
            {pagination.count > PAGE_SIZE && (
              <div className="flex justify-center mt-6 gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                  disabled={pagination.page === 1}
                >
                  Prev
                </button>
                <span className="px-2 py-1">
                  Page {pagination.page} / {Math.ceil(pagination.count / PAGE_SIZE)}
                </span>
                <button
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                  disabled={pagination.page === Math.ceil(pagination.count / PAGE_SIZE)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
