import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar } from "@/components/shared/sidebar";
import { Header } from "@/components/shared/header";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#E4E3E0] font-sans text-[#141414] antialiased">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
        <Sidebar userRole={user.role} />
      </div>

      {/* Main App Canvas */}
      <div className="flex flex-col flex-1 md:pl-64 h-full overflow-hidden bg-[#E4E3E0]">
        <Header
          user={{
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            avatarUrl: user.avatarUrl,
          }}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#E4E3E0]">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
