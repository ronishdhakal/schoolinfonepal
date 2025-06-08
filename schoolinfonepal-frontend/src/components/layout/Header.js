"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search } from "lucide-react";

const navLinks = [
  { label: "Courses", href: "/course" },
  { label: "Schools", href: "/school" },
  { label: "Admissions", href: "/admission" },
  { label: "Universities", href: "/university" },
  { label: "Scholarships", href: "/scholarship" },
  { label: "Events", href: "/event" },
  { label: "Information", href: "/information" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-10 h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/School-Info-Nepal-Logo.png"
            alt="School Info Nepal Logo"
            width={180}
            height={40}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[#273043] hover:text-[#1ca3fd] transition text-base font-medium px-2 py-1"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Search Button */}
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1ca3fd] hover:bg-[#1894e0] text-white text-sm font-semibold transition focus:outline-none"
          aria-label="Search"
        >
          <Search className="w-5 h-5" strokeWidth={2} />
          <span>Search</span>
        </button>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden ml-4 p-2"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg
            className="h-6 w-6 text-[#1ca3fd]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b shadow-md md:hidden z-50">
            <ul className="flex flex-col items-center py-3">
              {navLinks.map((link) => (
                <li key={link.href} className="w-full">
                  <Link
                    href={link.href}
                    className="block w-full text-[#273043] hover:text-[#1ca3fd] py-2 px-6 font-medium text-base text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="w-full pt-2">
                <button
                  type="button"
                  className="flex items-center justify-center w-full gap-2 px-4 py-2 rounded-full bg-[#1ca3fd] hover:bg-[#1894e0] text-white text-sm font-semibold"
                  aria-label="Search"
                  onClick={() => setMenuOpen(false)}
                >
                  <Search className="w-5 h-5" strokeWidth={2} />
                  <span>Search</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}