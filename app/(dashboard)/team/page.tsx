import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { TeamPageView } from "@/components/features/team/team-page-view";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function TeamPage() {
  const user = await getCurrentUser();

  if (user?.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const [users, tasks, projects] = await Promise.all([
    db.user.findMany({
      orderBy: { createdAt: "desc" },
    }),
    db.task.findMany(),
    db.project.findMany(),
  ]);

  const usersWithCounts = users.map((u) => ({
    ...u,
    _count: {
      assignedTasks: tasks.filter((t) => t.assigneeId === u.id).length,
      ledProjects: projects.filter((p) => p.leadId === u.id).length,
    },
  }));

  return <TeamPageView users={usersWithCounts} currentUser={user!} />;
}
