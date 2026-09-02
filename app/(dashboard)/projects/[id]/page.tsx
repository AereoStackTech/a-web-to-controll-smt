import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProjectDetailView } from "@/components/features/projects/project-detail-view";

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  const [project, allUsers, allProjects] = await Promise.all([
    db.project.findUnique({
      where: { id },
      include: {
        lead: true,
        tasks: {
          include: {
            assignee: true,
            project: true,
          },
          orderBy: { createdAt: "desc" },
        },
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

  if (!project) {
    notFound();
  }

  return (
    <ProjectDetailView
      project={project}
      currentUser={user!}
      allUsers={allUsers}
      allProjects={allProjects}
    />
  );
}
