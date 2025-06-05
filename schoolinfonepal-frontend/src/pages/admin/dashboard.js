"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { getAuthToken } from "@/utils/api"; // make sure this exists

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      window.location.href = "/login"; // or router.push("/login")
    }
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Welcome to Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard title="Manage Schools" link="/admin/schools" />
          <DashboardCard title="Manage Courses" link="/admin/courses" />
          <DashboardCard title="Manage Universities" link="/admin/universities" />
        </div>
      </div>
    </AdminLayout>
  );
}

const DashboardCard = ({ title, link }) => (
  <Link href={link}>
    <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition cursor-pointer">
      <h2 className="text-lg font-semibold text-blue-700">{title}</h2>
      <p className="text-sm text-gray-500 mt-2">Go to section</p>
    </div>
  </Link>
);
