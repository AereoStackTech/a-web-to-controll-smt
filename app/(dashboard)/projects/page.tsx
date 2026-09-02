import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProjectCard } from "@/components/features/projects/project-card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import Link from "next/link";
import { FolderKanban, Plus, Filter, Search } from "lucide-react";
import { ProjectStatus, Role } from "@prisma/client";

interface ProjectsPageProps {
  searchParams: Promise<{
    status?: string;
    q?: string;
  }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const user = await getCurrentUser();
  const statusFilter = params.status as ProjectStatus | undefined;
  const searchQuery = params.q?.toLowerCase();

  const projects = await db.project.findMany({
    where: {
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(searchQuery
        ? {
            OR: [
              { title: { contains: searchQuery, mode: "insensitive" } },
              { code: { contains: searchQuery, mode: "insensitive" } },
              { description: { contains: searchQuery, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      lead: true,
      tasks: true,
      _count: {
        select: {
          tasks: true,
          files: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const statuses = [
    { label: "All Projects", value: undefined },
    { label: "Planning", value: ProjectStatus.PLANNING },
    { label: "In Progress", value: ProjectStatus.IN_PROGRESS },
    { label: "On Hold", value: ProjectStatus.ON_HOLD },
    { label: "Completed", value: ProjectStatus.COMPLETED },
    { label: "Archived", value: ProjectStatus.ARCHIVED },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Projects" }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Operational Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Structured initiative tracking with cross-functional milestone accountability.
          </p>
        </div>

        {(user?.role === Role.ADMIN || user?.role === Role.MANAGER) && (
          <Link href="/projects/new">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" />
              New Project
            </Button>
          </Link>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800 text-xs">
        {statuses.map((st) => {
          const isActive = statusFilter === st.value || (!statusFilter && !st.value);
          return (
            <Link
              key={st.label}
              href={st.value ? `/projects?status=${st.value}` : "/projects"}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {st.label}
            </Link>
          );
        })}
      </div>

      {/* Project Grid */}
      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No operational projects found"
          description="There are currently no projects matching this filter criteria in the workspace."
          actionLabel={
            user?.role === Role.ADMIN || user?.role === Role.MANAGER ? "Create Project" : undefined
          }
          actionHref="/projects/new"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
