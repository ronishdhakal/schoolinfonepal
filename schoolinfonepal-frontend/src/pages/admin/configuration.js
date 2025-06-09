// pages/admin/configuration.js
"use client";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { Settings, Map, GraduationCap, Tag } from "lucide-react";

const CONFIGS = [
  {
    title: "Disciplines",
    description: "Manage subject disciplines offered in your schools.",
    href: "/admin/disciplines",
    icon: <Settings className="w-7 h-7 text-indigo-600" />,
    color: "bg-indigo-50",
  },
  {
    title: "Districts",
    description: "Manage school districts and regions.",
    href: "/admin/districts",
    icon: <Map className="w-7 h-7 text-green-600" />,
    color: "bg-green-50",
  },
  {
    title: "Levels",
    description: "Manage academic levels (e.g., Primary, Bachelor, Master).",
    href: "/admin/levels",
    icon: <GraduationCap className="w-7 h-7 text-yellow-600" />,
    color: "bg-yellow-50",
  },
  {
    title: "Types",
    description: "Manage institution types (e.g., Public, Private).",
    href: "/admin/types",
    icon: <Tag className="w-7 h-7 text-pink-600" />,
    color: "bg-pink-50",
  },
];

export default function AdminConfigurationPage() {
  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Configuration Settings</h1>
        <p className="mb-8 text-gray-600">
          Quickly access and manage Disciplines, Districts, Levels, and Types for your portal.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {CONFIGS.map((cfg) => (
            <Link
              key={cfg.title}
              href={cfg.href}
              className={`flex items-center rounded-2xl p-6 border border-gray-200 bg-white shadow hover:shadow-lg transition group`}
              style={{ textDecoration: "none" }}
            >
              <div className={`mr-5 rounded-xl ${cfg.color} flex items-center justify-center w-14 h-14`}>
                {cfg.icon}
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900 group-hover:text-indigo-700">{cfg.title}</div>
                <div className="text-gray-500 text-sm mt-1">{cfg.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
