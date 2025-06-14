"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import {
  getAuthToken,
  getUserData,
  fetchSchoolOwnProfile,
  fetchSchoolInquiriesAnalytics,
  fetchSchoolInquiries,
} from "../../utils/api"
import DashboardLayout from "../../components/dashboard/DashboardLayout"

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center">
      <div className={`flex-shrink-0 rounded-lg p-3 ${color}`}>{icon}</div>
      <div className="ml-5 w-0 flex-1">
        <dl>
          <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
          <dd>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            {subtitle && <div className="text-sm text-gray-600 mt-1">{subtitle}</div>}
          </dd>
        </dl>
      </div>
    </div>
  </div>
)

const InfoCard = ({ title, children, icon, action }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <div className="flex-shrink-0 text-blue-600 mr-3">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {action}
    </div>
    {children}
  </div>
)

const RecentInquiryItem = ({ inquiry, type }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
        <span className="text-white font-semibold text-xs">
          {inquiry.full_name ? inquiry.full_name.charAt(0).toUpperCase() : "?"}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900 truncate">{inquiry.full_name || "Name not provided"}</p>
        <p className="text-xs text-gray-500">{inquiry.course?.name || "No course specified"}</p>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          inquiry.contacted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {inquiry.contacted ? "Contacted" : "Pending"}
      </span>
      <span className="text-xs text-gray-500">{type === "pre-registration" ? "Pre-Reg" : "Inquiry"}</span>
    </div>
  </div>
)

export default function DashboardIndex() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [school, setSchool] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [recentInquiries, setRecentInquiries] = useState([])
  const [weeklyStats, setWeeklyStats] = useState({ inquiries: 0, preRegistrations: 0 })
  const router = useRouter()

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const token = getAuthToken()
        if (!token) {
          router.push("/login")
          return
        }

        const userData = getUserData()
        if (!userData || userData.role !== "school") {
          router.push("/login")
          return
        }

        setUser(userData)

        // Load school data first
        const schoolData = await fetchSchoolOwnProfile()
        setSchool(schoolData)

        // Only load inquiry data if school is verified
        if (schoolData?.verification) {
          const [analyticsData, inquiriesData] = await Promise.all([
            fetchSchoolInquiriesAnalytics(),
            fetchSchoolInquiries({ limit: 10 }),
          ])

          setAnalytics(analyticsData)

          // Combine and sort recent inquiries
          const allRecentInquiries = [
            ...(inquiriesData.inquiries || []).map((inq) => ({ ...inq, type: "inquiry" })),
            ...(inquiriesData.pre_registrations || []).map((inq) => ({ ...inq, type: "pre-registration" })),
          ]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 6)

          setRecentInquiries(allRecentInquiries)

          // Calculate weekly stats
          if (analyticsData.daily_trends) {
            const lastWeekData = analyticsData.daily_trends.slice(-7)
            const weeklyInquiries = lastWeekData.reduce((sum, day) => sum + day.inquiries, 0)
            const weeklyPreReg = lastWeekData.reduce((sum, day) => sum + day.pre_registrations, 0)
            setWeeklyStats({ inquiries: weeklyInquiries, preRegistrations: weeklyPreReg })
          }
        }
      } catch (error) {
        console.error("Error loading dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeDashboard()
  }, [router])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening"

  const profileCompleteness = () => {
    let completed = 0
    const total = 8

    if (school?.name) completed++
    if (school?.admin_email) completed++
    if (school?.address) completed++
    if (school?.district) completed++
    if (school?.level) completed++
    if (school?.type) completed++
    if (school?.about_college) completed++
    if (school?.logo) completed++

    return Math.round((completed / total) * 100)
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Dashboard | {school?.name || "School Dashboard"}</title>
      </Head>

      <div className="p-6 space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg text-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {greeting}, {school?.name || "School"}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                {school?.verification
                  ? "Your school is verified and ready to receive inquiries."
                  : "Complete your profile to get verified and start receiving inquiries."}
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-blue-100">{new Date().toLocaleDateString("en-US", { year: "numeric" })}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Status Alert */}
        {!school?.verification && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">
                  <strong>Verification Required:</strong> Complete your school profile to get verified and start
                  receiving student inquiries.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* School Profile Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* School Basic Information */}
          <div className="lg:col-span-2">
            <InfoCard
              title="School Profile"
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h4m6 0v-3.87a3.37 3.37 0 00-.94-2.61c-.26-.26-.61-.42-1.06-.42h-2c-.45 0-.8.16-1.06.42A3.37 3.37 0 0010 17.13V21"
                  />
                </svg>
              }
              action={
                <button
                  onClick={() => router.push("/dashboard/profile")}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Edit Profile →
                </button>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">School Name</label>
                    <p className="text-gray-900 font-medium">{school?.name || "Not set"}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{school?.admin_email || user?.email || "Not set"}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">
                      {school?.phones && school.phones.length > 0 ? school.phones[0].number : "Not set"}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Website</label>
                    <p className="text-gray-900">{school?.website || "Not set"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-gray-900">{school?.address || "Not set"}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">District</label>
                    <p className="text-gray-900">{school?.district?.name || "Not set"}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Level</label>
                    <p className="text-gray-900">{school?.level?.title || "Not set"}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Type</label>
                    <p className="text-gray-900">{school?.type?.name || "Not set"}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Verification Status</span>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                      school?.verification ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {school?.verification ? "✓ Verified" : "⏳ Pending Verification"}
                  </span>
                </div>
              </div>
            </InfoCard>
          </div>

          {/* Profile Completion & Quick Stats */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <InfoCard
              title="Profile Completion"
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            >
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-medium text-gray-900">{profileCompleteness()}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${profileCompleteness()}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Basic Info</span>
                    <span className={school?.name && school?.admin_email ? "text-green-600" : "text-gray-400"}>
                      {school?.name && school?.admin_email ? "✓" : "○"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className={school?.address && school?.district ? "text-green-600" : "text-gray-400"}>
                      {school?.address && school?.district ? "✓" : "○"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Categories</span>
                    <span className={school?.level && school?.type ? "text-green-600" : "text-gray-400"}>
                      {school?.level && school?.type ? "✓" : "○"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">About & Logo</span>
                    <span className={school?.about_college && school?.logo ? "text-green-600" : "text-gray-400"}>
                      {school?.about_college && school?.logo ? "✓" : "○"}
                    </span>
                  </div>
                </div>
              </div>
            </InfoCard>

            {/* Gallery & Messages Count */}
            <InfoCard
              title="Content Overview"
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              }
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Gallery Images</span>
                  <span className="text-lg font-semibold text-gray-900">{school?.gallery?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Messages</span>
                  <span className="text-lg font-semibold text-gray-900">{school?.messages?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Brochures</span>
                  <span className="text-lg font-semibold text-gray-900">{school?.brochures?.length || 0}</span>
                </div>

                <button
                  onClick={() => router.push("/dashboard/profile?tab=gallery")}
                  className="w-full mt-4 text-center text-sm font-medium text-blue-600 hover:text-blue-500 border border-blue-200 rounded-lg py-2 hover:bg-blue-50 transition-colors"
                >
                  Manage Content
                </button>
              </div>
            </InfoCard>
          </div>
        </div>

        {/* Quick Actions */}
        <InfoCard
          title="Quick Actions"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => router.push("/dashboard/profile")}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="ml-4 text-left">
                <p className="text-sm font-medium text-gray-900">Update Profile</p>
                <p className="text-sm text-gray-500">Basic information</p>
              </div>
            </button>

            <button
              onClick={() => router.push("/dashboard/profile?tab=gallery")}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-4 text-left">
                <p className="text-sm font-medium text-gray-900">Add Gallery</p>
                <p className="text-sm text-gray-500">Photos & images</p>
              </div>
            </button>

            <button
              onClick={() => router.push("/dashboard/profile?tab=messages")}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div className="ml-4 text-left">
                <p className="text-sm font-medium text-gray-900">Add Messages</p>
                <p className="text-sm text-gray-500">Principal messages</p>
              </div>
            </button>

            {school?.verification && (
              <button
                onClick={() => router.push("/dashboard/inquiries")}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div className="ml-4 text-left">
                  <p className="text-sm font-medium text-gray-900">View Inquiries</p>
                  <p className="text-sm text-gray-500">Student inquiries</p>
                </div>
              </button>
            )}
          </div>
        </InfoCard>

        {/* Inquiries Section - Only for Verified Schools */}
        {school?.verification && (
          <>
            {/* Inquiry Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="Total Inquiries"
                value={analytics?.total_inquiries || 0}
                subtitle="All time"
                icon={
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                }
                color="bg-blue-500"
              />

              <StatCard
                title="Pre-Registrations"
                value={analytics?.total_pre_registrations || 0}
                subtitle="All time"
                icon={
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                }
                color="bg-green-500"
              />

              <StatCard
                title="This Week"
                value={weeklyStats.inquiries + weeklyStats.preRegistrations}
                subtitle={`${weeklyStats.inquiries} inquiries, ${weeklyStats.preRegistrations} pre-reg`}
                icon={
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                }
                color="bg-purple-500"
              />

              <StatCard
                title="Pending Contact"
                value={(analytics?.not_contacted_inquiries || 0) + (analytics?.not_contacted_pre_registrations || 0)}
                subtitle="Need follow-up"
                icon={
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
                color="bg-amber-500"
              />
            </div>

            {/* Recent Inquiries */}
            <InfoCard
              title="Recent Inquiries"
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              action={
                <button
                  onClick={() => router.push("/dashboard/inquiries")}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View All →
                </button>
              }
            >
              <div className="space-y-1">
                {recentInquiries.length > 0 ? (
                  recentInquiries.map((inquiry) => (
                    <RecentInquiryItem key={`${inquiry.type}-${inquiry.id}`} inquiry={inquiry} type={inquiry.type} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No recent inquiries</h3>
                    <p className="mt-1 text-sm text-gray-500">New inquiries will appear here.</p>
                  </div>
                )}
              </div>
            </InfoCard>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
