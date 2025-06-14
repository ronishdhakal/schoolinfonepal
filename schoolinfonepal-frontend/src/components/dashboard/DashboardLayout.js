"use client"

import { useState } from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import { logout } from "../../utils/api"

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "🏠" },
    { name: "Profile", href: "/dashboard/profile", icon: "👤" },
    { name: "Inquiries", href: "/dashboard/inquiries", icon: "📧" },
  ]

  return (
    <>
      <head>
        <link rel="icon" href="/assets/School-Info-Nepal-Icon.png" />
        <title>Dashboard | School Info Nepal</title>
      </head>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
            ></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <span className="text-white text-xl">✕</span>
                </button>
              </div>
              <SidebarContent navigation={navigation} onLogout={handleLogout} />
            </div>
          </div>
        )}

        {/* Desktop sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200 shadow-md">
            <SidebarContent navigation={navigation} onLogout={handleLogout} />
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
            <button
              className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <span className="text-xl">☰</span>
            </button>
          </div>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </>
  )
}

function SidebarContent({ navigation, onLogout }) {
  const router = useRouter()

  return (
    <>
      <div className="flex items-center justify-center h-20 flex-shrink-0 px-4">
        <Image
          src="/assets/School-Info-Nepal-Logo.png"
          alt="School Info Nepal Logo"
          width={150}
          height={50}
          objectFit="contain"
        />
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`${
                router.pathname === item.href
                  ? "bg-blue-100 text-blue-900"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              } group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </a>
          ))}
        </nav>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <button onClick={onLogout} className="w-full group flex items-center space-x-3 text-sm font-medium text-gray-700 hover:text-red-600 transition">
            <span className="text-lg">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}
