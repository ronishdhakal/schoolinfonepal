"use client"

import { useState } from "react"
import ProfileHeader from "./profile/ProfileHeader"
import ProfileContact from "./profile/ProfileContact"
import ProfileUniversities from "./profile/ProfileUniversities"
import ProfileGallery from "./profile/ProfileGallery"
import ProfileCourses from "./profile/ProfileCourses"
import ProfileFAQ from "./profile/ProfileFAQ"
import ProfileMessages from "./profile/ProfileMessages"

export default function ProfileTabs() {
  const [activeTab, setActiveTab] = useState("header")

  const tabs = [
    { id: "header", name: "Basic Info", icon: "📋" },
    { id: "contact", name: "Contact", icon: "📞" },
    { id: "universities", name: "Universities", icon: "🎓" },
    { id: "gallery", name: "Gallery", icon: "🖼️" },
    { id: "courses", name: "Courses", icon: "📚" },
    { id: "faq", name: "FAQ", icon: "❓" },
    { id: "messages", name: "Messages", icon: "💬" },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "header":
        return <ProfileHeader />
      case "contact":
        return <ProfileContact />
      case "universities":
        return <ProfileUniversities />
      case "gallery":
        return <ProfileGallery />
      case "courses":
        return <ProfileCourses />
      case "faq":
        return <ProfileFAQ />
      case "messages":
        return <ProfileMessages />
      default:
        return <ProfileHeader />
    }
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">{renderTabContent()}</div>
    </div>
  )
}
