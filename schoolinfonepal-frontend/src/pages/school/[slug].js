"use client";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InquiryModal from "@/components/common/InquiryModal";
import SchoolHeader from "@/components/school/SchoolHeader";
import SchoolOverview from "@/components/school/SchoolOverview";
import SchoolCourses from "@/components/school/SchoolCourses";
import SchoolScholarship from "@/components/school/SchoolScholarship";
import SchoolFacilities from "@/components/school/SchoolFacilities";
import SchoolSalientFeatures from "@/components/school/SchoolSalientFeatures";
import SchoolGallery from "@/components/school/SchoolGallery";
import SchoolMessage from "@/components/school/SchoolMessage";
import SchoolAbout from "@/components/school/SchoolAbout";
import SchoolMapAndSocial from "@/components/school/SchoolMapAndSocial";
import SchoolFAQs from "@/components/school/SchoolFAQs";
import { fetchSchoolBySlug } from "@/utils/api";

const SECTIONS = [
  { id: "overview", label: "Overview" },
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

export default function SchoolSlugPage() {
  const router = useRouter();
  const slug = router.query.slug;

  const [school, setSchool] = useState(null);
  const [active, setActive] = useState("overview");
  const sectionRefs = useRef({});
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetchSchoolBySlug(slug)
      .then((result) => {
        if (result?.id) setSchool(result);
        else setSchool(null);
      })
      .catch((err) => {
        setSchool(null);
        console.error(err);
      });
  }, [slug]);

  // Intersection observer for section highlight
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

  return (
    <>
      <Header />

      {/* Inquiry modal, top-level for sticky/scroll bug avoidance */}
      <InquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        school={school}
      />

      <div className="bg-gray-50 min-h-screen">
        {/* School Header */}
        <SchoolHeader school={school} />

        <div className="max-w-7xl mx-auto flex gap-10 px-4 md:px-8">
          {/* Sticky left nav */}
          <nav className="hidden lg:block w-60 flex-shrink-0 pt-6 sticky top-24 self-start">
            <ul className="flex flex-col gap-2">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
                      active === s.id
                        ? "bg-blue-50 text-blue-700 shadow"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => scrollToSection(s.id)}
                  >
                    {active === s.id && (
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mr-2 align-middle" />
                    )}
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main content - only render sections when school?.id is loaded */}
          <main className="flex-1 flex flex-col gap-10">
            {!school?.id ? (
              <div className="text-center text-gray-400 py-12 text-lg">Loading school details...</div>
            ) : (
              <>
                <div ref={(el) => (sectionRefs.current.overview = el)} id="overview">
                  <SchoolOverview school={school} />
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
