"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { fetchAdvertisements } from "@/utils/api"

const SIDEBAR_PLACEMENTS = ["home-4", "home-5", "home-6", "home-7", "home-8", "home-9", "home-10", "home-11", "home-12"]

export default function SidebarAds() {
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdvertisements()
      .then((allAds) => {
        const filtered = allAds
          .filter((ad) => SIDEBAR_PLACEMENTS.includes(ad.placement))
          .sort((a, b) => SIDEBAR_PLACEMENTS.indexOf(a.placement) - SIDEBAR_PLACEMENTS.indexOf(b.placement))
        setAds(filtered)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-6 w-full md:w-[220px]">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-xl w-full md:w-[220px] h-[220px]" />
        ))}
      </div>
    )
  }

  if (!ads.length) return null

  return (
    <div className="flex flex-col gap-6 w-full md:w-[220px]">
      {ads.map((ad) => (
        <a
          key={ad.id}
          href={ad.link}
          target="_blank"
          rel="noopener noreferrer"
          className="
            block rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300
            w-full md:w-[220px] 
            bg-[#fafcff]
          "
        >
          <div className="hidden md:block">
            {/* Desktop version: 220x220 */}
            <Image
              src={ad.image_desktop || "/placeholder.svg"}
              alt={ad.title || "Advertisement"}
              width={220}
              height={220}
              className="object-contain w-full h-full"
              unoptimized
            />
          </div>
          <div className="block md:hidden">
            {/* Mobile version: 468x90 */}
            <Image
              src={ad.image_mobile || ad.image_desktop}
              alt={ad.title || "Advertisement"}
              width={468}
              height={90}
              className="object-contain w-full"
              unoptimized
            />
          </div>
        </a>
      ))}
    </div>
  )
}
