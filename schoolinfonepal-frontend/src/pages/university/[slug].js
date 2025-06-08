import Head from "next/head";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InquiryModal from "@/components/common/InquiryModal";
import { useRef, useState, useEffect } from "react";
import UniversityHeader from "@/components/university/UniversityHeader";
import UniversityOverview from "@/components/university/UniversityOverview";
import UniversitySalientFeatures from "@/components/university/UniversitySalientFeatures";
import UniversityAbout from "@/components/university/UniversityAbout";
import UniversityGallery from "@/components/university/UniversityGallery";
import UniversityCourses from "@/components/university/UniversityCourses";
import UniversitySchools from "@/components/university/UniversitySchools";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "salient", label: "Salient Features" },
  { id: "courses", label: "Courses Offered" },
  { id: "schools", label: "Affiliated Schools/Colleges" },
  { id: "gallery", label: "Gallery" },
  { id: "about", label: "About" },
];

export default function UniversitySlugPage({ university }) {
  const [active, setActive] = useState("overview");
  const sectionRefs = useRef({});
  const [modalOpen, setModalOpen] = useState(false);
  const [inquiryTarget, setInquiryTarget] = useState(null);

  // Section highlight on scroll
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => {
      let cur = "overview";
      for (const s of SECTIONS) {
        const ref = sectionRefs.current[s.id];
        if (ref && ref.getBoundingClientRect().top <= 110) {
          cur = s.id;
        }
      }
      setActive(cur);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to section
  const scrollToSection = (id) => {
    const ref = sectionRefs.current[id];
    if (ref) {
      window.scrollTo({
        top: ref.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      });
    }
  };

  // SEO meta
  const metaTitle =
    university?.meta_title?.trim() ||
    (university
      ? `${university.name || ""}${university.address ? " - " + university.address : ""}`
      : "University | School Info Nepal");
  const metaDesc =
    university?.meta_description?.trim() ||
    (university
      ? `Explore ${university.name || ""}${university.address ? ", " + university.address : ""} at School Info Nepal. View features, gallery, about, and more.`
      : "Find the best universities in Nepal - explore all details at School Info Nepal.");
  const ogTitle = university?.og_title?.trim() || metaTitle;
  const ogDesc = university?.og_description?.trim() || metaDesc;
  const ogImage =
    university?.og_image ||
    university?.cover_photo ||
    university?.logo ||
    "https://schoolinfonepal.com/default-og-image.jpg";

  // Handler for University "Inquire" button
  const handleApplyUniversity = () => {
    setInquiryTarget({ university }); // pass university object
    setModalOpen(true);
  };

  // Handler for School "Inquire" button
  const handleApplySchool = (school) => {
    setInquiryTarget({ school }); // pass school object
    setModalOpen(true);
  };

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDesc} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://schoolinfonepal.com/university/${university?.slug || ""}`} />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDesc} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Header />

      {/* Inquiry Modal for university or schools */}
      <InquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        university={inquiryTarget?.university}
        school={inquiryTarget?.school}
      />

      <div className="bg-gray-50 min-h-screen w-full">
        <UniversityHeader university={university} />

        {/* Inquire University Button */}
        <div className="flex justify-end max-w-screen-2xl mx-auto px-6 sm:px-8 md:px-14 lg:px-20 mt-2 mb-0">
          <button
            onClick={handleApplyUniversity}
            className="px-6 py-3 bg-[#1868ae] hover:bg-[#145287] text-white font-semibold rounded-xl shadow transition-all duration-200 text-base"
            type="button"
            aria-label={`Apply to ${university?.name}`}
          >
            Inquire University
          </button>
        </div>

        <div className="w-full flex flex-col lg:flex-row max-w-screen-2xl mx-auto gap-0 lg:gap-6 px-6 sm:px-8 md:px-14 lg:px-20">
          {/* Sticky left nav */}
          <nav className="hidden lg:block flex-shrink-0 pt-6 sticky top-28 self-start w-60">
            <ul className="flex flex-col gap-2">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      active === s.id
                        ? "bg-blue-50 text-[#1868ae] font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => scrollToSection(s.id)}
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main content */}
          <main className="flex-1 flex flex-col gap-6 py-6 md:py-8 lg:py-12">
            {!university?.id ? (
              <div className="text-center text-gray-400 py-12 text-lg">
                Loading university details...
              </div>
            ) : (
              <>
                <div ref={(el) => (sectionRefs.current.overview = el)} id="overview">
                  <UniversityOverview university={university} />
                </div>
                <div ref={(el) => (sectionRefs.current.salient = el)} id="salient">
                  <UniversitySalientFeatures university={university} />
                </div>
                <div ref={(el) => (sectionRefs.current.courses = el)} id="courses">
                  <UniversityCourses university={university} />
                </div>
                <div ref={(el) => (sectionRefs.current.schools = el)} id="schools">
                  <UniversitySchools university={university} onApply={handleApplySchool} />
                </div>
                <div ref={(el) => (sectionRefs.current.gallery = el)} id="gallery">
                  <UniversityGallery university={university} />
                </div>
                <div ref={(el) => (sectionRefs.current.about = el)} id="about">
                  <UniversityAbout university={university} />
                </div>
              </>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}

// --- Server-Side Fetching (SEO-Ready) ---
export async function getServerSideProps({ params }) {
  const { slug } = params;
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
  let university = null;
  try {
    const res = await fetch(`${API_BASE_URL}/universities/${slug}/`);
    if (res.ok) {
      university = await res.json();
    }
  } catch (e) {
    // leave university as null
  }
  return {
    props: { university },
  };
}
