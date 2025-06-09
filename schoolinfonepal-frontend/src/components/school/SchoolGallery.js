"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

export default function SchoolGallery({ school }) {
  const gallery = school?.gallery || []
  const [showAll, setShowAll] = useState(false)
  const [popup, setPopup] = useState({ open: false, idx: 0 })
  const [keydownListener, setKeydownListener] = useState(null)

  if (!gallery.length) return null

  const displayed = showAll ? gallery : gallery.slice(0, 6)

  function openPopup(idx) {
    setPopup({ open: true, idx })
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden"
    }
  }

  function closePopup() {
    setPopup({ open: false, idx: 0 })
    if (typeof document !== "undefined") {
      document.body.style.overflow = ""
    }
  }

  function prevImg() {
    setPopup((p) => ({
      ...p,
      idx: (p.idx - 1 + gallery.length) % gallery.length,
    }))
  }

  function nextImg() {
    setPopup((p) => ({
      ...p,
      idx: (p.idx + 1) % gallery.length,
    }))
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    function handle(e) {
      if (!popup.open) return
      if (e.key === "Escape") closePopup()
      if (e.key === "ArrowLeft") prevImg()
      if (e.key === "ArrowRight") nextImg()
    }

    if (popup.open) {
      window.addEventListener("keydown", handle)
      setKeydownListener(() => () => window.removeEventListener("keydown", handle))
    } else if (keydownListener) {
      keydownListener()
      setKeydownListener(null)
    }

    return () => {
      if (keydownListener) {
        keydownListener()
      }
    }
  }, [popup.open, gallery.length, keydownListener])

  return (
    <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl md:text-3xl font-bold text-[#1868ae] mb-4 font-sans tracking-tight">
        Gallery
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
        {displayed.map((img, i) => (
          <button
            key={img.id}
            className="aspect-square rounded-lg overflow-hidden border border-gray-100 hover:border-[#1ca3fd] hover:shadow-sm transition-all"
            onClick={() => openPopup(showAll ? i : i)}
            aria-label="Open image"
            type="button"
          >
            <Image
              src={img.image || "/placeholder.svg"}
              alt={img.caption || `Gallery Image ${i + 1}`}
              width={400}
              height={400}
              className="object-cover w-full h-full"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </button>
        ))}
      </div>

      {gallery.length > 8 && (
        <button onClick={() => setShowAll((v) => !v)} className="text-[#1ca3fd] hover:underline text-sm" type="button">
          {showAll ? "Show less" : `Show all (${gallery.length})`}
        </button>
      )}

      {popup.open && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            className="absolute top-6 right-6 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
            onClick={closePopup}
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
              src={gallery[popup.idx].image || "/placeholder.svg"}
              alt={gallery[popup.idx].caption || `Gallery Image ${popup.idx + 1}`}
              width={900}
              height={600}
              className="rounded-lg object-contain max-h-[70vh]"
              sizes="100vw"
            />
            {gallery[popup.idx].caption && (
              <div className="mt-3 text-white text-center max-w-2xl px-2">{gallery[popup.idx].caption}</div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
