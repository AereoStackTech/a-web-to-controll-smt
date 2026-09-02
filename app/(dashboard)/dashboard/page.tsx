import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { OperationalMetrics } from "@/components/features/dashboard/operational-metrics";
import { UrgentTasksCard } from "@/components/features/dashboard/urgent-tasks-card";
import { RecentActivityFeed } from "@/components/features/dashboard/recent-activity-feed";
import { ProjectCard } from "@/components/features/projects/project-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FolderKanban, Plus, ArrowRight } from "lucide-react";
import { ProjectStatus, TaskStatus, Priority, Role } from "@prisma/client";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  // Parallel data queries
  const [
    projects,
    tasks,
    urgentTasks,
    activities,
    totalFilesCount,
  ] = await Promise.all([
    db.project.findMany({
      include: {
        lead: true,
        tasks: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    db.task.findMany({
      include: {
        project: true,
        assignee: true,
      },
    }),
    db.task.findMany({
      where: {
        priority: Priority.URGENT,
        status: { not: TaskStatus.DONE },
      },
      include: {
        project: true,
        assignee: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    db.fileAsset.count(),
  ]);

  const activeProjects = projects.filter(
    (p) => p.status !== ProjectStatus.COMPLETED && p.status !== ProjectStatus.ARCHIVED
  );

  const inProgressTasks = tasks.filter(
    (t) => t.status === TaskStatus.IN_PROGRESS || t.status === TaskStatus.IN_REVIEW
  );

  const completedTasks = tasks.filter((t) => t.status === TaskStatus.DONE);

  const metrics = {
    activeProjectsCount: activeProjects.length,
    totalProjectsCount: projects.length,
    inProgressTasksCount: inProgressTasks.length,
    urgentTasksCount: urgentTasks.length,
    completedTasksCount: completedTasks.length,
    totalTasksCount: tasks.length,
    totalFilesCount,
  };

  return (
    <div className="space-y-6">
      {/* Overview Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-[#141414]">
        <div>
          <h1 className="text-xl sm:text-2xl font-mono font-bold uppercase tracking-tight text-[#141414]">
            OPERATIONS CONSOLE // TELEMETRY & WORKSPACE
          </h1>
          <p className="font-mono text-xs text-[#141414]/60 mt-0.5">
            Real-time status of active workstreams, critical paths, and operational records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(user?.role === Role.ADMIN || user?.role === Role.MANAGER) && (
            <Link href="/projects/new">
              <Button size="sm" variant="outline" className="text-xs">
                <FolderKanban className="w-3.5 h-3.5 mr-1" />
                + NEW PROJECT
              </Button>
            </Link>
          )}
          <Link href="/tasks/new">
            <Button size="sm" variant="default" className="text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" />
              + NEW TASK
            </Button>
          </Link>
        </div>
      </div>

      {/* Operational Metrics Cards */}
      <OperationalMetrics metrics={metrics} />

      {/* Two column layout: Critical Path / Urgent tasks & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <UrgentTasksCard tasks={urgentTasks} />
        <RecentActivityFeed activities={activities} />
      </div>

      {/* Active Workstreams / Projects Showcase */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-[#141414] pb-2">
          <div className="flex items-center gap-2">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
              ACTIVE WORKSTREAMS & PROJECTS
            </h2>
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 bg-[#141414] text-white">
              {activeProjects.length}
            </span>
          </div>

          <Link
            href="/projects"
            className="font-mono text-[10px] font-bold uppercase text-[#141414] hover:text-[#F27D26] flex items-center gap-1 transition-colors"
          >
            VIEW ALL WORKSTREAMS <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {activeProjects.length === 0 ? (
          <div className="border border-dashed border-[#141414]/30 bg-white p-8 text-center font-mono text-xs text-[#141414]/60">
            NO ACTIVE PROJECTS CURRENTLY INITIALIZED.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeProjects.slice(0, 6).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
