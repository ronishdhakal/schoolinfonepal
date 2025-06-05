"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { getAuthToken } from "@/utils/api"; // update as per your alias or path

const AdminLayout = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      window.location.href = "/login"; // ✅ safer than router.push
    } else {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) return null; // Avoid hydration mismatch

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex flex-col flex-1">
        <AdminHeader />
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
