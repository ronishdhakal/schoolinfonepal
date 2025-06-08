"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScholarshipHeader from "@/components/scholarship/ScholarshipHeader";
import ScholarshipDescription from "@/components/scholarship/ScholarshipDescription";
import ScholarshipOther from "@/components/scholarship/ScholarshipOther";
import { fetchScholarshipBySlug } from "@/utils/api";

export default function ScholarshipDetailPage() {
  const params = useParams();
  const slug = params?.slug;
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchScholarshipBySlug(slug)
      .then(setScholarship)
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto py-8 px-4 min-h-screen">
        {loading ? (
          <div className="text-center text-gray-400 py-10">Loading…</div>
        ) : scholarship ? (
          <>
            <ScholarshipHeader scholarship={scholarship} />
            <ScholarshipDescription scholarship={scholarship} />
            <ScholarshipOther scholarship={scholarship} />
          </>
        ) : (
          <div className="text-center text-gray-400 py-10">Scholarship not found.</div>
        )}
      </main>
      <Footer />
    </>
  );
}
