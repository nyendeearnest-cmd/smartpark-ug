"use client";

import { Bell, Search, UserCircle2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface HeaderProps {
  title: string;
  description?: string;
}

export default function Header({
  title,
  description,
}: HeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });

      toast.success("Logged out successfully.");

      router.push("/login");
      router.refresh();

    } catch {
      toast.error("Logout failed.");
    }
  }

  return (
    <header className="h-20 bg-white border-b flex items-center justify-between px-8 shadow-sm">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          {title}
        </h1>

        {description && (
          <p className="text-slate-500 mt-1">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-6">

        <div className="hidden md:flex items-center border rounded-lg px-3 py-2 w-72">
          <Search className="w-4 h-4 text-gray-500" />

          <input
            type="text"
            placeholder="Search..."
            className="ml-2 w-full outline-none"
          />
        </div>

        <button className="relative">
          <Bell className="w-6 h-6 text-slate-700" />

          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
            0
          </span>
        </button>

        <div className="flex items-center gap-2">
          <UserCircle2 className="w-10 h-10 text-slate-700" />

          <div className="hidden md:block">
            <p className="font-semibold">
              Administrator
            </p>

            <p className="text-sm text-slate-500">
              SmartPark UG
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>
    </header>
  );
}