"use client";
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EventCard from "@/components/event/EventCard";
import Pagination from "@/components/common/Pagination";
import { fetchEvents } from "@/utils/api";
import { Search } from "lucide-react";

const PAGE_SIZE = 12;

export default function Home({ initialEvents, initialCount, initialPage, initialSearch }) {
  const [events, setEvents] = useState(initialEvents || []);
  const [pagination, setPagination] = useState({
    page: initialPage || 1,
    count: initialCount || 0,
  });
  const [searchTerm, setSearchTerm] = useState(initialSearch || "");
  const [loading, setLoading] = useState(false);

  // Fetch events on search/page change (except for initial SSR render)
  useEffect(() => {
    // Don't fetch again if this is the SSR'd page and SSR values match state
    if (pagination.page === initialPage && searchTerm === initialSearch) return;

    setLoading(true);
    fetchEvents({
      page: pagination.page,
      page_size: PAGE_SIZE,
      ...(searchTerm ? { search: searchTerm } : {}),
    })
      .then((data) => {
        if (data && data.results) setEvents(data.results);
        else if (Array.isArray(data)) setEvents(data);
        else setEvents([]);
        setPagination((prev) => ({
          ...prev,
          count: data.count || (Array.isArray(data) ? data.length : 0),
        }));
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [pagination.page, searchTerm, initialPage, initialSearch]);

  // Search submit handler
  function handleSearch(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    setSearchTerm(formData.get("search") || "");
    setPagination((prev) => ({ ...prev, page: 1 }));
  }

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-10 min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8 max-w-2xl relative">
          <input
            type="text"
            name="search"
            placeholder="Search events..."
            defaultValue={searchTerm}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1ca3fd] focus:border-[#1ca3fd]"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-[#1ca3fd] text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </form>
        {/* Events Grid */}
        {loading ? (
          <div className="text-gray-500">Loading events…</div>
        ) : events.length === 0 ? (
          <div className="text-gray-400">No events found.</div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing <span className="font-medium">{events.length}</span> of{" "}
              <span className="font-medium">{pagination.count}</span> events
              {searchTerm && <span> matching your search</span>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </>
        )}
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

// --- SSR: Fetch events for the first page + search ---
export async function getServerSideProps(context) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
  const { page = "1", search = "" } = context.query || {};

  let initialEvents = [];
  let initialCount = 0;
  const initialPage = Number.parseInt(page) || 1;
  const initialSearch = search || "";

  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    params.append("page", initialPage.toString());
    params.append("page_size", PAGE_SIZE.toString());

    const res = await fetch(`${API_BASE_URL}/events/?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      initialEvents = data.results || [];
      initialCount = data.count || 0;
    }
  } catch (e) {
    // fail silently
  }

  return {
    props: {
      initialEvents,
      initialCount,
      initialPage,
      initialSearch,
    },
  };
}
