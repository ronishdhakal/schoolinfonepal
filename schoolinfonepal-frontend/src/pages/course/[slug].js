"use client"
import { useEffect, useRef, useState } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import CourseHeader from "@/components/course/CourseHeader"
import CourseAbout from "@/components/course/CourseAbout"
import CourseOutcomes from "@/components/course/CourseOutcomes"
import CourseEligibility from "@/components/course/CourseEligibility"
import CourseCurriculum from "@/components/course/CourseCurriculum"
import CourseSchools from "@/components/course/CourseSchools"
import CourseAttachments from "@/components/course/CourseAttachments"
import InquiryModal from "@/components/common/InquiryModal"
import Head from "next/head"
import { BookOpen, FileText, Users, Target, Info } from "lucide-react"

const SECTIONS = [
  { id: "colleges", label: "Colleges", icon: Users },
  { id: "eligibility", label: "Eligibility", icon: FileText },
  { id: "curriculum", label: "Curriculum", icon: BookOpen },
  { id: "outcomes", label: "Outcomes", icon: Target },
  { id: "attachments", label: "Attachments", icon: FileText },
  { id: "about", label: "About", icon: Info },
]

export default function CourseSlugPage({ course: initialCourse }) {
  const [course, setCourse] = useState(initialCourse)
  const [inquiryData, setInquiryData] = useState({ open: false, school: null })
  const [active, setActive] = useState(SECTIONS[0].id)
  const sectionRefs = useRef({})

  // Section highlight on scroll
  useEffect(() => {
    if (typeof window === "undefined") return
    const handleScroll = () => {
      let cur = SECTIONS[0].id
      for (const s of SECTIONS) {
        const ref = sectionRefs.current[s.id]
        if (ref && ref.getBoundingClientRect().top <= 120) {
          cur = s.id
        }
      }
      setActive(cur)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Scroll to section
  const scrollToSection = (id) => {
    const ref = sectionRefs.current[id]
    if (ref) {
      window.scrollTo({
        top: ref.getBoundingClientRect().top + window.scrollY - 100,
        behavior: "smooth",
      })
    }
  }

  // Inquiry handlers
  const handleHeaderInquire = () => setInquiryData({ open: true, school: null })
  const handleSchoolInquire = (school) => setInquiryData({ open: true, school })
  const handleCloseModal = () => setInquiryData({ open: false, school: null })

  if (!course)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen size={24} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Course not found</h2>
          <p className="text-gray-500">The course you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )

  // Meta tags for SEO
  const metaTitle = course.meta_title || `${course.name} - School Info Nepal`
  const metaDesc = course.meta_description || course.short_description || ""
  const ogTitle = course.og_title || metaTitle
  const ogDesc = course.og_description || metaDesc
  const ogImage = course.og_image || "/default-og-image.png"

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDesc} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://schoolinfonepal.com/course/${course.slug || ""}`} />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDesc} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <Header />

      <div className="bg-gray-50 min-h-screen">
        {/* Course Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CourseHeader course={course} onInquire={handleHeaderInquire} />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24">
                {/* Mobile Navigation */}
                <div className="lg:hidden mb-6">
                  <select
                    value={active}
                    onChange={(e) => scrollToSection(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1ca3fd] focus:border-[#1ca3fd]"
                  >
                    {SECTIONS.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:block bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">Contents</h3>
                  <ul className="space-y-1">
                    {SECTIONS.map((section) => {
                      const Icon = section.icon
                      return (
                        <li key={section.id}>
                          <button
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              active === section.id
                                ? "bg-[#1ca3fd] text-white"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                            }`}
                            onClick={() => scrollToSection(section.id)}
                          >
                            <Icon size={16} />
                            {section.label}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 space-y-8">
              {/* Colleges Section */}
              <section ref={(el) => (sectionRefs.current.colleges = el)} id="colleges">
                <CourseSchools courseId={course.id} onApply={handleSchoolInquire} />
              </section>

              {/* Eligibility Section */}
              <section ref={(el) => (sectionRefs.current.eligibility = el)} id="eligibility">
                <CourseEligibility eligibility={course.eligibility} />
              </section>

              {/* Curriculum Section */}
              <section ref={(el) => (sectionRefs.current.curriculum = el)} id="curriculum">
                <CourseCurriculum curriculum={course.curriculum} />
              </section>

              {/* Outcomes Section */}
              <section ref={(el) => (sectionRefs.current.outcomes = el)} id="outcomes">
                <CourseOutcomes outcome={course.outcome} />
              </section>

              {/* Attachments Section */}
              <section ref={(el) => (sectionRefs.current.attachments = el)} id="attachments">
                <CourseAttachments attachments={course.attachments} />
              </section>

              {/* About Section */}
              <section ref={(el) => (sectionRefs.current.about = el)} id="about">
                <CourseAbout longDescription={course.long_description} />
              </section>
            </main>
          </div>
        </div>

        {/* Inquiry Modal */}
        <InquiryModal open={inquiryData.open} onClose={handleCloseModal} course={course} school={inquiryData.school} />
      </div>

      <Footer />
    </>
  )
}

// SSR for Course Data
export async function getServerSideProps({ params }) {
  const { slug } = params
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"
  let course = null
  try {
    const res = await fetch(`${API_BASE_URL}/courses/${slug}/`)
    if (res.ok) {
      course = await res.json()
    }
  } catch (e) {
    // leave course as null
  }
  return {
    props: { course },
  }
}
