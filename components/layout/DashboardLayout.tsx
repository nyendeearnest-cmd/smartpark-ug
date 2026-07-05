"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

interface DashboardLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function DashboardLayout({
  title,
  description,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header title={title} description={description} />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}