import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { TaskForm } from "@/components/features/tasks/task-form";
import { TaskStatus } from "@prisma/client";

interface NewTaskPageProps {
  searchParams: Promise<{
    projectId?: string;
    status?: string;
  }>;
}

export default async function NewTaskPage({ searchParams }: NewTaskPageProps) {
  const params = await searchParams;
  const user = await getCurrentUser();

  const [projects, users] = await Promise.all([
    db.project.findMany({
      orderBy: { title: "asc" },
    }),
    db.user.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const defaultStatus = params.status as TaskStatus | undefined;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Tasks", href: "/tasks" },
          { label: "Create Task" },
        ]}
      />

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Create Operational Task
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Assign work to a team member, set priority, and align with an active project initiative.
          </p>
        </div>

        <TaskForm
          projects={projects}
          users={users}
          defaultProjectId={params.projectId}
          defaultStatus={defaultStatus}
        />
      </div>
    </div>
  );
}
