"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdmissionHeader from "@/components/admission/AdmissionHeader";
import AdmissionInfo from "@/components/admission/AdmissionInfo";
import AdmissionAbout from "@/components/admission/AdmissionAbout";
import { fetchAdmissionBySlug } from "@/utils/api";

export default function AdmissionDetailPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [admission, setAdmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchAdmissionBySlug(slug)
      .then(setAdmission)
      .catch(() => setError("Admission not found."))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <>
      <Head>
        <title>{admission?.title || "Admission"} | School Info Nepal</title>
      </Head>
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : admission ? (
          <>
            <AdmissionHeader admission={admission} />
            <AdmissionInfo admission={admission} />
            <AdmissionAbout admission={admission} />
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">Admission not found.</div>
        )}
      </main>

      <Footer />
    </>
  );
}
