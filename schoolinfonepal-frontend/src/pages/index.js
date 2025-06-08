// pages/index.js
"use client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TopAds from "@/components/home/TopAds";
import SidebarAds from "@/components/home/SidebarAds";
import FeaturedSchools from "@/components/home/FeaturedSchools";
import FeaturedAdmissions from "@/components/home/FeaturedAdmissions";
import RecentNews from "@/components/home/RecentNews";

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="bg-[#f7fbfd] min-h-screen">
        {/* Top banner ad */}
        <div className="w-full flex justify-center pt-8 pb-4">
          <TopAds />
        </div>

        {/* Main grid for desktop */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-12 px-2 sm:px-6 lg:px-8 py-8">
          {/* Main content */}
          <section>
            <FeaturedSchools />
            <FeaturedAdmissions />

            {/* Sidebar Ads for mobile/tablet (below admissions, hidden on lg+) */}
            <div className="block lg:hidden my-8">
              <SidebarAds />
            </div>

            <RecentNews />
          </section>

          {/* Sidebar for desktop only */}
          <aside className="hidden lg:flex flex-col items-center gap-8 pt-4">
            <SidebarAds />
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
