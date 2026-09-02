import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { TasksPageView } from "@/components/features/tasks/tasks-page-view";

export default async function TasksPage() {
  const user = await getCurrentUser();

  const [tasks, projects, users] = await Promise.all([
    db.task.findMany({
      include: {
        project: true,
        assignee: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    db.project.findMany({
      orderBy: { title: "asc" },
    }),
    db.user.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <TasksPageView
      tasks={tasks}
      projects={projects}
      users={users}
      currentUserId={user?.id || ""}
    />
  );
}
