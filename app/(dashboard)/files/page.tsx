import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { FilesPageView } from "@/components/features/files/files-page-view";

export default async function FilesPage() {
  const user = await getCurrentUser();

  const [files, projects] = await Promise.all([
    db.fileAsset.findMany({
      include: {
        project: true,
        task: true,
        uploader: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    db.project.findMany({
      orderBy: { title: "asc" },
    }),
  ]);

  return (
    <FilesPageView
      files={files}
      projects={projects}
      currentUser={user!}
    />
  );
}
