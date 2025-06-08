"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InformationFilter from "@/components/information/InformationFilter";
import InformationCard from "@/components/information/InformationCard";
import Pagination from "@/components/common/Pagination";
import { fetchInformation } from "@/utils/api";

const PAGE_SIZE = 12;

export default function InformationListPage() {
  const [information, setInformation] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    university: "",
    level: "",
    course: "",
    school: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    count: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchInformation({
      ...filters,
      page: pagination.page,
      page_size: PAGE_SIZE,
    })
      .then((data) => {
        setInformation(data.results || []);
        setPagination((prev) => ({
          ...prev,
          count: data.count || 0,
        }));
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [filters, pagination.page]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  return (
    <>
      <Head>
        <title>Information - School Info Nepal</title>
        <meta name="description" content="Find news, notices, and education info for Nepal." />
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Information</h1>
        <InformationFilter filters={filters} setFilters={setFilters} />
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : information.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No information found.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {information.map((info) => (
                <InformationCard key={info.id} info={info} />
              ))}
            </div>
            <Pagination
              current={pagination.page}
              total={pagination.count}
              pageSize={PAGE_SIZE}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
