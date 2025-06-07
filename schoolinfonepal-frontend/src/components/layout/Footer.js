import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/assets/School-Info-Nepal-Logo.png"
                alt="School Info Nepal"
                width={180}
                height={40}
                className="object-contain"
                priority
              />
            </Link>
            <p className="text-sm mb-4 max-w-xs">
              School Info Nepal Pvt. Ltd.<br />
              Kirtipur-10, Kathmandu,<br />
              Dol: Reg No. 4247-2080/2081<br />
              info@schoolinfonepal.com<br />
              +977-9745450062
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-[#273043] mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/courses" className="text-[#273043] hover:text-[#1ca3fd] transition">Courses</Link></li>
              <li><Link href="/schools" className="text-[#273043] hover:text-[#1ca3fd] transition">Schools</Link></li>
              <li><Link href="/events" className="text-[#273043] hover:text-[#1ca3fd] transition">Events</Link></li>
              <li><Link href="/university" className="text-[#273043] hover:text-[#1ca3fd] transition">University</Link></li>
              <li><Link href="/gallery" className="text-[#273043] hover:text-[#1ca3fd] transition">Gallery</Link></li>
              <li><Link href="/contact-us" className="text-[#273043] hover:text-[#1ca3fd] transition">Contact Us</Link></li>
              <li><Link href="/about-us" className="text-[#273043] hover:text-[#1ca3fd] transition">About Us</Link></li>
            </ul>
          </div>

          {/* For College */}
          <div>
            <h3 className="text-lg font-semibold text-[#273043] mb-4">For College</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="text-[#273043] hover:text-[#1ca3fd] transition">Login</Link></li>
              <li><Link href="/signup" className="text-[#273043] hover:text-[#1ca3fd] transition">Signup</Link></li>
              <li><Link href="/learn-more" className="text-[#273043] hover:text-[#1ca3fd] transition">Learn More</Link></li>
              <li><Link href="/membership" className="text-[#273043] hover:text-[#1ca3fd] transition">Membership</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-lg font-semibold text-[#273043] mb-4">Information</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/exam-routine" className="text-[#273043] hover:text-[#1ca3fd] transition">Exam Routine</Link></li>
              <li><Link href="/exam-center" className="text-[#273043] hover:text-[#1ca3fd] transition">Exam Center</Link></li>
              <li><Link href="/enroll-it-courses" className="text-[#273043] hover:text-[#1ca3fd] transition">Enroll IT Courses</Link></li>
            </ul>
          </div>

         
        </div>

        {/* Copyright and Social Media */}
        <div className="border-t border-gray-200 mt-8 pt-4 text-center text-sm text-gray-500">
          <p>© 2025 School Info Nepal. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="text-[#1ca3fd] hover:text-[#1894e0] transition">
              <span className="sr-only">Facebook</span>📘
            </a>
            <a href="#" className="text-[#1ca3fd] hover:text-[#1894e0] transition">
              <span className="sr-only">Twitter</span>🐦
            </a>
            <a href="#" className="text-[#1ca3fd] hover:text-[#1894e0] transition">
              <span className="sr-only">Instagram</span>📷
            </a>
            <a href="#" className="text-[#1ca3fd] hover:text-[#1894e0] transition">
              <span className="sr-only">LinkedIn</span>💼
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}