import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  LayoutDashboard,
  Home,
  BookOpen,
  GraduationCap,
  Mail,
  Users,
  Megaphone,
  Calendar,
  Newspaper,
  Gift,
  Building2,
  Cog,
  LogOut,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: "Schools", path: "/admin/schools", icon: <Home className="w-5 h-5" /> },
  { name: "Courses", path: "/admin/courses", icon: <BookOpen className="w-5 h-5" /> },
  { name: "Universities", path: "/admin/universities", icon: <GraduationCap className="w-5 h-5" /> },
  { name: "Inquiries", path: "/admin/inquiries", icon: <Mail className="w-5 h-5" /> },
  { name: "Admissions", path: "/admin/admissions", icon: <Users className="w-5 h-5" /> },
  { name: "Advertisements", path: "/admin/advertisements", icon: <Megaphone className="w-5 h-5" /> },
  { name: "Events", path: "/admin/events", icon: <Calendar className="w-5 h-5" /> },
  { name: "Informations", path: "/admin/information", icon: <Newspaper className="w-5 h-5" /> },
  { name: "Scholarships", path: "/admin/scholarships", icon: <Gift className="w-5 h-5" /> },
  { name: "Facilities", path: "/admin/facilities", icon: <Building2 className="w-5 h-5" /> },
  { name: "Configuration", path: "/admin/configuration", icon: <Cog className="w-5 h-5" /> },
  { name: "Logout", path: "/logout", icon: <LogOut className="w-5 h-5" />, logout: true },
];

const AdminSidebar = () => {
  const router = useRouter();

  return (
    <aside className="w-64 min-h-screen bg-white border-r shadow-sm sticky top-0 z-40 flex flex-col">
      <div className="p-6 font-extrabold text-4xl text-blue-700 border-b tracking-tight flex items-center gap-3">
        <Image
          src="/assets/School-Info-Nepal-Logo.png"
          alt="School Info Nepal"
          width={158}
          height={158}
          className="rounded-lg object-contain"
          priority
        />
        
      </div>
      <nav className="flex-1 flex flex-col space-y-1 p-4">
        {navItems.map((item) => {
          const active =
            item.path === "/logout"
              ? false
              : router.pathname === item.path ||
                (item.path !== "/" && router.pathname.startsWith(item.path));
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`
                flex items-center gap-3 px-4 py-2 rounded-lg group transition-all duration-150
                ${
                  active
                    ? "bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-600 shadow-sm"
                    : item.logout
                    ? "text-red-600 hover:bg-red-50"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-700"
                }
              `}
              style={{ marginLeft: active ? "-4px" : undefined }}
            >
              <span
                className={`flex items-center transition-colors ${
                  active ? "text-blue-600" : item.logout ? "text-red-500" : "text-gray-400 group-hover:text-blue-500"
                }`}
              >
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="py-4 text-xs text-gray-400 text-center border-t">© {new Date().getFullYear()} School Info Nepal</div>
    </aside>
  );
};

export default AdminSidebar;
