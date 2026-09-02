import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ProjectForm } from "@/components/features/projects/project-form";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function NewProjectPage() {
  const user = await getCurrentUser();

  if (user?.role !== Role.ADMIN && user?.role !== Role.MANAGER) {
    redirect("/projects");
  }

  const leads = await db.user.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Projects", href: "/projects" },
          { label: "Initiate Project" },
        ]}
      />

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Initiate Operational Project
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Define the scope, unique project code, lead engineer, and target milestones.
          </p>
        </div>

        <ProjectForm leads={leads} />
      </div>
    </div>
  );
}
