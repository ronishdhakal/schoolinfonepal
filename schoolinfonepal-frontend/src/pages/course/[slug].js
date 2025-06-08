import { useEffect, useRef, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CourseHeader from "@/components/course/CourseHeader";
import CourseAbout from "@/components/course/CourseAbout";
import CourseOutcomes from "@/components/course/CourseOutcomes";
import CourseEligibility from "@/components/course/CourseEligibility";
import CourseCurriculum from "@/components/course/CourseCurriculum";
import CourseSchools from "@/components/course/CourseSchools";
import InquiryModal from "@/components/common/InquiryModal";
import Head from "next/head";

// --- Attachments section with file descriptions as link label ---
function CourseAttachmentsWithTitle({ attachments }) {
  if (!attachments || attachments.length === 0) return null;
  return (
    <section className="my-10">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Course Attachments</h2>
      <ul className="space-y-4">
        {attachments.map((att) => (
          <li key={att.id} className="flex items-center gap-3">
            <a
              href={att.file}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-2 font-medium"
              download
            >
              {att.description ? att.description : "Attachment"}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

const SECTIONS = [
  { id: "colleges", label: "Colleges" },
  { id: "eligibility", label: "Eligibility" },
  { id: "curriculum", label: "Curriculum" },
  { id: "outcomes", label: "Outcomes" },
  { id: "attachments", label: "Attachments" },
  { id: "about", label: "About" },
];

export default function CourseSlugPage({ course: initialCourse }) {
  const [course, setCourse] = useState(initialCourse);
  const [inquiryData, setInquiryData] = useState({ open: false, school: null });
  const [active, setActive] = useState(SECTIONS[0].id);
  const sectionRefs = useRef({});

  // Section highlight on scroll
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => {
      let cur = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const ref = sectionRefs.current[s.id];
        if (ref && ref.getBoundingClientRect().top <= 120) {
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

  // Inquiry handlers
  const handleHeaderInquire = () => setInquiryData({ open: true, school: null });
  const handleSchoolInquire = (school) => setInquiryData({ open: true, school });
  const handleCloseModal = () => setInquiryData({ open: false, school: null });

  if (!course)
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-lg">
        Course not found.
      </div>
    );

  // Meta tags for SEO
  const metaTitle = course.meta_title || course.name || "Course Info - College Info Nepal";
  const metaDesc = course.meta_description || course.short_description || "";
  const ogTitle = course.og_title || metaTitle;
  const ogDesc = course.og_description || metaDesc;
  const ogImage = course.og_image || "/default-og-image.png";

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDesc} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://collegeinfonepal.com/course/${course.slug || ""}`} />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDesc} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Header />

      <div className="bg-gray-50 min-h-screen w-full">
        {/* Full-width header */}
        <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-10 pt-6">
          <CourseHeader course={course} onInquire={handleHeaderInquire} />
        </div>

        {/* Tabs/Sidebar start after header */}
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-0 lg:gap-8 px-2 sm:px-6 md:px-10 pt-2">
          {/* Sidebar nav */}
          <nav className="hidden lg:block flex-shrink-0 pt-8 sticky top-28 self-start w-60">
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
          <main className="flex-1 flex flex-col gap-10 py-8">
            {/* Colleges */}
            <section ref={(el) => (sectionRefs.current.colleges = el)} id="colleges">
              <CourseSchools courseId={course.id} onApply={handleSchoolInquire} />
            </section>
            {/* Eligibility */}
            <section ref={(el) => (sectionRefs.current.eligibility = el)} id="eligibility">
              <CourseEligibility eligibility={course.eligibility} />
            </section>
            {/* Curriculum */}
            <section ref={(el) => (sectionRefs.current.curriculum = el)} id="curriculum">
              <CourseCurriculum curriculum={course.curriculum} />
            </section>
            {/* Outcomes */}
            <section ref={(el) => (sectionRefs.current.outcomes = el)} id="outcomes">
              <CourseOutcomes outcome={course.outcome} />
            </section>
            {/* Attachments */}
            <section ref={(el) => (sectionRefs.current.attachments = el)} id="attachments">
              <CourseAttachmentsWithTitle attachments={course.attachments} />
            </section>
            {/* About at the very end */}
            <section ref={(el) => (sectionRefs.current.about = el)} id="about">
              <CourseAbout longDescription={course.long_description} />
            </section>
          </main>
        </div>
        {/* Inquiry Modal */}
        <InquiryModal
          open={inquiryData.open}
          onClose={handleCloseModal}
          course={course}
          school={inquiryData.school}
        />
      </div>
      <Footer />
    </>
  );
}

// --- SSR for Course Data ---
export async function getServerSideProps({ params }) {
  const { slug } = params;
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
  let course = null;
  try {
    const res = await fetch(`${API_BASE_URL}/courses/${slug}/`);
    if (res.ok) {
      course = await res.json();
    }
  } catch (e) {
    // leave course as null
  }
  return {
    props: { course },
  };
}
