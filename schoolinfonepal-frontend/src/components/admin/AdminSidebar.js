import Link from "next/link";
import { useRouter } from "next/router";

const navItems = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Schools", path: "/admin/schools" },
  { name: "Courses", path: "/admin/courses" },
  { name: "Universities", path: "/admin/universities" },
  { name: "Logout", path: "/logout" },
];

const AdminSidebar = () => {
  const router = useRouter();

  return (
    <aside className="w-64 bg-white border-r shadow-sm hidden md:block">
      <div className="p-4 font-bold text-xl border-b">Admin Panel</div>
      <nav className="flex flex-col space-y-2 p-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`px-4 py-2 rounded ${
              router.pathname.startsWith(item.path)
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
