"use client";
import { useEffect, useState } from "react";
import SchoolCard from "@/components/school/SchoolCard";
import UniversityCard from "@/components/university/UniversityCard";
import CourseCard from "@/components/course/CourseCard";
import AdmissionCard from "@/components/admission/AdmissionCard";
import EventCard from "@/components/event/EventCard";
import InformationCard from "@/components/information/InformationCard";
import { Search } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const RESULT_TYPES = [
  { key: "schools", label: "Schools", Card: SchoolCard },
  { key: "universities", label: "Universities", Card: UniversityCard },
  { key: "courses", label: "Courses", Card: CourseCard },
  { key: "admissions", label: "Admissions", Card: AdmissionCard },
  { key: "events", label: "Events", Card: EventCard },
  { key: "information", label: "Information", Card: InformationCard },
];

export default function GlobalSearchPage() {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  // Search API call
  useEffect(() => {
    if (!searchTerm) {
      setResults({});
      return;
    }
    setLoading(true);
    fetch(`/api/core/global-search/?q=${encodeURIComponent(searchTerm)}`)
      .then((res) => res.json())
      .then((data) => setResults(data))
      .finally(() => setLoading(false));
  }, [searchTerm]);

  // Handle search submit
  function handleSearch(e) {
    e.preventDefault();
    setSearchTerm(query.trim());
  }

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-10 min-h-[70vh]">
        <h1 className="text-3xl font-bold mb-6">Global Search</h1>
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6 max-w-2xl relative">
          <input
            type="text"
            name="q"
            placeholder="Search schools, courses, universities, events…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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

        {/* Results */}
        {loading && (
          <div className="text-gray-400 py-12 text-center">Searching…</div>
        )}

        {!loading && searchTerm && RESULT_TYPES.every(t => !(results[t.key] && results[t.key].length)) && (
          <div className="text-gray-400 py-12 text-center">No results found for "{searchTerm}".</div>
        )}

        {!loading && searchTerm && RESULT_TYPES.map(({ key, label, Card }) =>
          results[key] && results[key].length > 0 && (
            <section key={key} className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-[#1868ae]">{label} <span className="text-gray-400 text-lg">({results[key].length})</span></h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
                {results[key].map((item) => (
                  <Card key={item.id} {...{ [key.slice(0, -1)]: item }} />
                ))}
              </div>
            </section>
          )
        )}
      </main>
      <Footer />
    </>
  );
}
