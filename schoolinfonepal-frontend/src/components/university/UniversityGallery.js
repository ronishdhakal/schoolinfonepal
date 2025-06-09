"use client"
import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

function getFullImageUrl(url) {
  if (!url) return ""
  if (url.startsWith("http")) return url
  const BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") || "http://127.0.0.1:8000"
  return `${BASE}${url}`
}

export default function UniversityGallery({ university }) {
  const [selected, setSelected] = useState(null)
  const [showAll, setShowAll] = useState(false)

  if (!university || !Array.isArray(university.gallery) || university.gallery.length === 0) return null

  const displayed = showAll ? university.gallery : university.gallery.slice(0, 6)

  function openModal(img) {
    setSelected(img)
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden"
    }
  }

  function closeModal() {
    setSelected(null)
    if (typeof document !== "undefined") {
      document.body.style.overflow = ""
    }
  }

  const prevImg = useCallback(() => {
    if (!selected) return
    const currentIndex = university.gallery.findIndex((img) => img.id === selected.id)
    const prevIndex = (currentIndex - 1 + university.gallery.length) % university.gallery.length
    setSelected(university.gallery[prevIndex])
  }, [selected, university.gallery])

  const nextImg = useCallback(() => {
    if (!selected) return
    const currentIndex = university.gallery.findIndex((img) => img.id === selected.id)
    const nextIndex = (currentIndex + 1) % university.gallery.length
    setSelected(university.gallery[nextIndex])
  }, [selected, university.gallery])

  useEffect(() => {
    if (typeof window === "undefined") return

    function handle(e) {
      if (!selected) return
      if (e.key === "Escape") closeModal()
      if (e.key === "ArrowLeft") prevImg()
      if (e.key === "ArrowRight") nextImg()
    }

    if (selected) {
      window.addEventListener("keydown", handle)
      return () => window.removeEventListener("keydown", handle)
    }
  }, [selected, university.gallery, closeModal, prevImg, nextImg])

  return (
    <section className="mb-8 bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">Gallery</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
        {displayed.map((img, idx) => (
          <button
            key={img.id || idx}
            type="button"
            className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-100 hover:border-[#1ca3fd] hover:shadow-sm transition-all"
            onClick={() => openModal(img)}
            title={img.caption || ""}
          >
            <Image
              src={getFullImageUrl(img.image) || "/placeholder.svg"}
              alt={img.caption || `Gallery image ${idx + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </button>
        ))}
      </div>

      {university.gallery.length > 6 && (
        <button onClick={() => setShowAll((v) => !v)} className="text-[#1ca3fd] hover:underline text-sm" type="button">
          {showAll ? "Show less" : `Show all (${university.gallery.length})`}
        </button>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <button
            className="absolute top-6 right-6 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
            onClick={closeModal}
            aria-label="Close"
            type="button"
          >
            <X />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
            onClick={prevImg}
            aria-label="Previous"
            type="button"
          >
            <ChevronLeft className="text-white" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
            onClick={nextImg}
            aria-label="Next"
            type="button"
          >
            <ChevronRight className="text-white" />
          </button>
          <div className="max-w-4xl max-h-[80vh] flex flex-col items-center">
            <Image
              src={getFullImageUrl(selected.image) || "/placeholder.svg"}
              alt={selected.caption || "Gallery Image"}
              width={900}
              height={600}
              className="rounded-lg object-contain max-h-[70vh]"
              sizes="100vw"
            />
            {selected.caption && <div className="mt-3 text-white text-center max-w-2xl px-2">{selected.caption}</div>}
          </div>
        </div>
      )}
    </section>
  )
}
