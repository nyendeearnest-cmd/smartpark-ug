"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  Car,
  ParkingSquare,
  ClipboardList,
  FileText,
  Users,
  Settings,
  ShieldCheck,
} from "lucide-react";
type UserRole = "ADMIN" | "ATTENDANT";

type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

const allMenuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Vehicle Types",
    href: "/vehicle-types",
    icon: Car,
  },
  {
    title: "Vehicles",
    href: "/vehicles",
    icon: Car,
  },
  {
    title: "Parking Slots",
    href: "/parking-slots",
    icon: ParkingSquare,
  },
  {
    title: "Parking Records",
    href: "/parking-records",
    icon: ClipboardList,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
    adminOnly: true,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
    adminOnly: true,
  },
  {
  title: "Audit Logs",
  href: "/audit",
  icon: ShieldCheck,
},
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    adminOnly: true,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const res = await fetch("/api/me");

      if (!res.ok) return;

      const data = await res.json();

      setUser(data);
    } catch (error) {
      console.error(error);
    }
  }

  const menuItems =
    user?.role === "ADMIN"
      ? allMenuItems
      : allMenuItems.filter(
          (item) => !item.adminOnly
        );

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">
          SmartPark UG
        </h1>

        <p className="text-sm text-slate-400">
          Parking Management System
        </p>

        {user && (
          <div className="mt-4">
            <p className="font-semibold">
              {user.name}
            </p>

            <p className="text-xs text-slate-400">
              {user.role}
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                pathname === item.href
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-800 text-slate-300"
              }`}
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700 text-sm text-slate-400">
        © 2026 SmartPark UG
      </div>
    </aside>
  );
}