import Head from "next/head";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InquiryModal from "@/components/common/InquiryModal";
import SchoolHeader from "@/components/school/SchoolHeader";
import SchoolOverview from "@/components/school/SchoolOverview";
import SchoolAdmission from "@/components/school/SchoolAdmission";
import SchoolCourses from "@/components/school/SchoolCourses";
import SchoolScholarship from "@/components/school/SchoolScholarship";
import SchoolFacilities from "@/components/school/SchoolFacilities";
import SchoolSalientFeatures from "@/components/school/SchoolSalientFeatures";
import SchoolGallery from "@/components/school/SchoolGallery";
import SchoolMessage from "@/components/school/SchoolMessage";
import SchoolAbout from "@/components/school/SchoolAbout";
import SchoolMapAndSocial from "@/components/school/SchoolMapAndSocial";
import SchoolFAQs from "@/components/school/SchoolFAQs";
import { useRef, useState, useEffect } from "react";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "admission", label: "Admissions" },
  { id: "courses", label: "Courses" },
  { id: "scholarship", label: "Scholarship" },
  { id: "facilities", label: "Facilities" },
  { id: "salient", label: "Salient Features" },
  { id: "gallery", label: "Gallery" },
  { id: "message", label: "Messages" },
  { id: "about", label: "About" },
  { id: "map", label: "Map & Social" },
  { id: "faqs", label: "FAQs" },
];

export default function SchoolSlugPage({ school }) {
  const [active, setActive] = useState("overview");
  const sectionRefs = useRef({});
  const [modalOpen, setModalOpen] = useState(false);

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
    school?.meta_title?.trim() ||
    (school
      ? `${school.name || ""}${school.address ? " - " + school.address : ""}${
          school.district?.name ? ", " + school.district.name : ""
        }`
      : "School Info Nepal");
  const metaDesc =
    school?.meta_description?.trim() ||
    (school
      ? `Explore ${school.name || ""}${school.address ? ", " + school.address : ""}${
          school.district?.name ? ", " + school.district.name : ""
        } at School Info Nepal. View courses, facilities, scholarships, and more.`
      : "Find the best schools in Nepal - explore courses, events, scholarships, and more.");
  const ogTitle = school?.og_title?.trim() || metaTitle;
  const ogDesc = school?.og_description?.trim() || metaDesc;
  const ogImage =
    school?.og_image ||
    school?.cover_photo ||
    school?.logo ||
    "https://schoolinfonepal.com/default-og-image.jpg";

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDesc} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://schoolinfonepal.com/school/${school?.slug || ""}`} />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDesc} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Header />

      <InquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        school={school}
      />

      <div className="bg-gray-50 min-h-screen w-full">
        <SchoolHeader school={school} />

        <div className="w-full flex flex-col lg:flex-row max-w-screen-2xl mx-auto gap-0 lg:gap-6 px-4 sm:px-6 md:px-8 lg:px-10">
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
          <main className="flex-1 flex flex-col gap-12 py-6 md:py-8 lg:py-12 px-4 sm:px-6">
            {!school?.id ? (
              <div className="text-center text-gray-400 py-12 text-lg">
                Loading school details...
              </div>
            ) : (
              <>
                <div ref={(el) => (sectionRefs.current.overview = el)} id="overview">
                  <SchoolOverview school={school} />
                </div>
                <div ref={(el) => (sectionRefs.current.admission = el)} id="admission">
                  <SchoolAdmission school={school} />
                </div>
                <div ref={(el) => (sectionRefs.current.courses = el)} id="courses">
                  <SchoolCourses school={school} />
                </div>
                <div ref={(el) => (sectionRefs.current.scholarship = el)} id="scholarship">
                  <SchoolScholarship school={school} />
                </div>
                <div ref={(el) => (sectionRefs.current.facilities = el)} id="facilities">
                  <SchoolFacilities school={school} />
                </div>
                <div ref={(el) => (sectionRefs.current.salient = el)} id="salient">
                  <SchoolSalientFeatures school={school} />
                </div>
                <div ref={(el) => (sectionRefs.current.gallery = el)} id="gallery">
                  <SchoolGallery school={school} />
                </div>
                <div ref={(el) => (sectionRefs.current.message = el)} id="message">
                  <SchoolMessage school={school} />
                </div>
                <div ref={(el) => (sectionRefs.current.about = el)} id="about">
                  <SchoolAbout school={school} />
                </div>
                <div ref={(el) => (sectionRefs.current.map = el)} id="map">
                  <SchoolMapAndSocial school={school} />
                </div>
                <div ref={(el) => (sectionRefs.current.faqs = el)} id="faqs">
                  <SchoolFAQs school={school} />
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
  let school = null;
  try {
    const res = await fetch(`${API_BASE_URL}/schools/${slug}/`);
    if (res.ok) {
      school = await res.json();
    }
  } catch (e) {
    // leave school as null
  }
  return {
    props: { school },
  };
}
