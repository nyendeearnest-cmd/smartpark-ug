"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  ParkingSquare,
  ClipboardList,
  FileText,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Vehicles",
    href: "/vehicles",
    icon: Car,
  },
  {
    title: "Vehicle Types",
    href: "/vehicle-types",
    icon: Car,
  },
  {
    title: "Parking Slots",
    href: "/parking-slots",
    icon: ParkingSquare,
  },
  {
    title: "Check-In",
    href: "/parking-records",
    icon: ClipboardList,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col shadow-lg">
      {/* HEADER */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight">
          SmartPark UG
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Parking Management System
        </p>
      </div>

      {/* NAV */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">
                {item.title}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
        <p>© 2026 SmartPark UG</p>
        <p className="mt-1">All rights reserved</p>
      </div>
    </aside>
  );
}