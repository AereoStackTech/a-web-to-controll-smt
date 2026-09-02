"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Project, User, Task, FileAsset, ActivityLog, Role, ProjectStatus } from "@prisma/client";
import { ProjectStatusSelector } from "./project-status-selector";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { TaskBoard } from "@/components/features/tasks/task-board";
import { TaskTable } from "@/components/features/tasks/task-table";
import { FileTable } from "@/components/features/files/file-table";
import { FileUploadModal } from "@/components/features/files/file-upload-modal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Calendar,
  CheckSquare,
  FileText,
  Plus,
  Trash2,
  LayoutGrid,
  List,
} from "lucide-react";
import { format } from "date-fns";
import { deleteProjectAction } from "@/lib/actions/project";
import { useRouter } from "next/navigation";

type ProjectFull = Project & {
  lead: {
    id?: string;
    name: string;
    avatarUrl?: string | null;
    email?: string;
    role?: any;
    department?: string | null;
  } | null;
  tasks: (Task & {
    assignee?: User | null;
    project?: Project | null;
  })[];
  files: (FileAsset & {
    uploader: {
      id?: string;
      name: string;
      avatarUrl?: string | null;
      email?: string;
      role?: any;
    };
    task?: Task | null;
  })[];
  activities?: (ActivityLog & {
    user: {
      id?: string;
      name: string;
      avatarUrl?: string | null;
    };
  })[];
};

interface ProjectDetailViewProps {
  project: ProjectFull;
  currentUser: User;
  allUsers: User[];
  allProjects: Project[];
}

export function ProjectDetailView({
  project,
  currentUser,
  allUsers,
  allProjects,
}: ProjectDetailViewProps) {
  const router = useRouter();
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [taskViewMode, setTaskViewMode] = useState<"board" | "table">("board");

  const completedTasks = project.tasks.filter((t) => t.status === "DONE").length;
  const taskCount = project.tasks.length;
  const progressPercent = taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0;

  const handleDeleteProject = async () => {
    if (
      !confirm(
        `Are you sure you want to delete project "${project.title}" and all associated records? This cannot be undone.`
      )
    ) {
      return;
    }

    const res = await deleteProjectAction(project.id);
    if (res.success) {
      router.push("/projects");
    } else {
      alert(res.error || "Failed to delete project");
    }
  };

  const isManagerOrAdmin =
    currentUser.role === Role.ADMIN || currentUser.role === Role.MANAGER;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Projects", href: "/projects" },
          { label: `[${project.code}] ${project.title}` },
        ]}
      />

      {/* Main Project Header Card */}
      <div className="border border-[#141414] bg-white p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#141414] text-white">
                {project.code}
              </span>
              <h1 className="text-xl sm:text-2xl font-mono font-bold uppercase tracking-tight text-[#141414]">
                {project.title}
              </h1>
            </div>

            {project.description && (
              <p className="text-xs sm:text-sm text-[#141414]/70 max-w-3xl leading-relaxed">
                {project.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <ProjectStatusSelector
              projectId={project.id}
              currentStatus={project.status}
              disabled={!isManagerOrAdmin}
            />

            <Link href={`/tasks/new?projectId=${project.id}`}>
              <Button size="sm" variant="default" className="text-xs">
                <Plus className="w-3.5 h-3.5 mr-1" />
                + ADD TASK
              </Button>
            </Link>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setFileModalOpen(true)}
              className="text-xs"
            >
              <FileText className="w-3.5 h-3.5 mr-1" />
              ATTACH ASSET
            </Button>

            {currentUser.role === Role.ADMIN && (
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDeleteProject}
                className="text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Metadata Strip: Lead, Dates, Progress Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#141414]/15 text-xs">
          <div>
            <span className="text-[#141414]/50 font-mono font-bold block uppercase tracking-wider text-[10px]">
              PROJECT LEAD
            </span>
            <div className="mt-1 flex items-center gap-2">
              {project.lead ? (
                <>
                  <UserAvatar name={project.lead.name} avatarUrl={project.lead.avatarUrl} size="sm" />
                  <span className="font-bold text-[#141414]">
                    {project.lead.name}
                  </span>
                </>
              ) : (
                <span className="text-[#141414]/40 font-mono italic">UNASSIGNED</span>
              )}
            </div>
          </div>

          <div>
            <span className="text-[#141414]/50 font-mono font-bold block uppercase tracking-wider text-[10px]">
              TIMELINE // SCHEDULE
            </span>
            <div className="mt-1 flex items-center gap-1.5 font-mono text-[#141414]">
              <Calendar className="w-3.5 h-3.5 text-[#141414]/40" />
              <span>
                {project.startDate ? format(new Date(project.startDate), "MMM d").toUpperCase() : "START TBD"}
                {" → "}
                {project.targetDate ? format(new Date(project.targetDate), "MMM d, yyyy").toUpperCase() : "OPEN"}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[#141414]/50 font-mono font-bold block uppercase tracking-wider text-[10px]">
              DELIVERY RATIO
            </span>
            <div className="mt-1 flex items-center gap-2 font-mono">
              <span className="font-bold text-[#141414]">
                {completedTasks}/{taskCount} DELIVERED
              </span>
              <span className="text-[#F27D26] font-bold">({progressPercent}%)</span>
            </div>
          </div>

          <div>
            <span className="text-[#141414]/50 font-mono font-bold block uppercase tracking-wider text-[10px]">
              DOCUMENTED ASSETS
            </span>
            <div className="mt-1 flex items-center gap-1.5 font-mono text-[#141414]">
              <FileText className="w-3.5 h-3.5 text-[#141414]/40" />
              <span className="font-bold">
                {project.files.length} REGISTERED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Tabs */}
      <Tabs defaultValue="tasks" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#141414] pb-2">
          <TabsList className="bg-transparent gap-2 p-0">
            <TabsTrigger value="tasks" className="rounded-none border border-[#141414] bg-white data-[state=active]:bg-[#141414] data-[state=active]:text-white font-mono text-xs uppercase px-3 py-1.5">
              <CheckSquare className="w-3.5 h-3.5 mr-1.5" />
              TASKS ({taskCount})
            </TabsTrigger>
            <TabsTrigger value="files" className="rounded-none border border-[#141414] bg-white data-[state=active]:bg-[#141414] data-[state=active]:text-white font-mono text-xs uppercase px-3 py-1.5">
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              FILES & ASSETS ({project.files.length})
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-1 border border-[#141414] bg-white p-0.5">
            <button
              onClick={() => setTaskViewMode("board")}
              className={`px-2.5 py-1 text-xs font-mono font-bold uppercase flex items-center gap-1 transition-colors cursor-pointer ${
                taskViewMode === "board"
                  ? "bg-[#141414] text-white"
                  : "text-[#141414] hover:bg-zinc-100"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>BOARD</span>
            </button>
            <button
              onClick={() => setTaskViewMode("table")}
              className={`px-2.5 py-1 text-xs font-mono font-bold uppercase flex items-center gap-1 transition-colors cursor-pointer ${
                taskViewMode === "table"
                  ? "bg-[#141414] text-white"
                  : "text-[#141414] hover:bg-zinc-100"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>TABLE</span>
            </button>
          </div>
        </div>

        <TabsContent value="tasks" className="pt-2">
          {taskViewMode === "board" ? (
            <TaskBoard tasks={project.tasks} projectId={project.id} />
          ) : (
            <TaskTable tasks={project.tasks} showProject={false} />
          )}
        </TabsContent>

        <TabsContent value="files" className="pt-2">
          <FileTable
            files={project.files.map((f) => ({
              ...f,
              project,
              uploader: {
                id: f.uploader.id || "",
                name: f.uploader.name,
                email: f.uploader.email || "",
                passwordHash: "",
                role: f.uploader.role || Role.MEMBER,
                department: null,
                avatarUrl: f.uploader.avatarUrl || null,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            }))}
            currentUserId={currentUser.id}
            userRole={currentUser.role}
          />
        </TabsContent>
      </Tabs>

      {/* File Upload Modal */}
      <FileUploadModal
        open={fileModalOpen}
        onOpenChange={setFileModalOpen}
        projects={allProjects}
        defaultProjectId={project.id}
      />
    </div>
  );
}
