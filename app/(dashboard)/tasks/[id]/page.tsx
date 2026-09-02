import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { TaskDetailView } from "@/components/features/tasks/task-detail-view";

interface TaskDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  const [task, allUsers, allProjects] = await Promise.all([
    db.task.findUnique({
      where: { id },
      include: {
        project: true,
        assignee: true,
        creator: true,
        files: {
          include: {
            uploader: true,
            task: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    db.user.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
    db.project.findMany({
      orderBy: { title: "asc" },
    }),
  ]);

  if (!task) {
    notFound();
  }

  return (
    <TaskDetailView
      task={task}
      currentUser={user!}
      allUsers={allUsers}
      allProjects={allProjects}
    />
  );
}
