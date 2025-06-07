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

      <main className="bg-[#f5fafd] min-h-screen">
        {/* Top banner ad */}
        <div className="w-full flex justify-center pt-6">
          <TopAds />
        </div>

        {/* Main content grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 px-4 md:px-8 py-10">
          {/* Left/Main column */}
          <div>
            <FeaturedSchools />
            <FeaturedAdmissions />
            <RecentNews />
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block pt-2">
            <SidebarAds />
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
