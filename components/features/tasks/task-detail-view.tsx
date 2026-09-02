"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Task, Project, User, FileAsset, Role, TaskStatus, Priority } from "@prisma/client";
import { TaskStatusSelector } from "./task-status-selector";
import { TaskPriorityBadge } from "./task-priority-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { FileTable } from "@/components/features/files/file-table";
import { FileUploadModal } from "@/components/features/files/file-upload-modal";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, FileText, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { assignTaskAction, deleteTaskAction } from "@/lib/actions/task";

type TaskFull = Task & {
  project: {
    id: string;
    title: string;
    code: string;
    description?: string | null;
  };
  assignee: User | null;
  creator: {
    id?: string;
    name: string;
    avatarUrl?: string | null;
  } | null;
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
};

interface TaskDetailViewProps {
  task: TaskFull;
  currentUser: User;
  allUsers: User[];
  allProjects: Project[];
}

export function TaskDetailView({
  task,
  currentUser,
  allUsers,
  allProjects,
}: TaskDetailViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fileModalOpen, setFileModalOpen] = useState(false);

  const handleAssigneeChange = (newAssigneeId: string) => {
    startTransition(async () => {
      await assignTaskAction(task.id, newAssigneeId === "none" ? null : newAssigneeId);
    });
  };

  const handleDeleteTask = async () => {
    if (!confirm(`Are you sure you want to delete task #${task.taskNumber} "${task.title}"?`)) {
      return;
    }

    startTransition(async () => {
      const res = await deleteTaskAction(task.id);
      if (res.success) {
        router.push("/tasks");
      } else {
        alert(res.error || "Failed to delete task");
      }
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Tasks", href: "/tasks" },
          { label: `${task.project.code}-${task.taskNumber}` },
        ]}
      />

      {/* Main Task Detail Card */}
      <div className="border border-[#141414] bg-white p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header bar: Project code, Task #, Priority, Status, Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#141414]">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/projects/${task.project.id}`}
              className="font-mono text-xs font-bold px-2 py-0.5 bg-[#141414] text-white hover:bg-zinc-800 transition-colors"
            >
              {task.project.code}-{task.taskNumber}
            </Link>
            <TaskPriorityBadge priority={task.priority} />
            <span className="font-mono text-xs text-[#141414]/50">IN</span>
            <Link
              href={`/projects/${task.project.id}`}
              className="text-xs font-bold text-[#141414] hover:text-[#F27D26] uppercase transition-colors"
            >
              {task.project.title}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <TaskStatusSelector taskId={task.id} currentStatus={task.status} />

            <Button
              size="sm"
              variant="destructive"
              onClick={handleDeleteTask}
              disabled={isPending}
              className="text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Task Title */}
        <div>
          <h1 className="text-xl sm:text-2xl font-mono font-bold uppercase tracking-tight text-[#141414]">
            {task.title}
          </h1>
        </div>

        {/* 2-Column Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Main Description */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]/70 mb-2">
                SCOPE & OPERATIONAL REQUIREMENTS
              </h3>
              <div className="border border-[#141414]/20 bg-zinc-50 p-4 text-xs text-[#141414] leading-relaxed whitespace-pre-wrap font-mono">
                {task.description || "No specific acceptance criteria or description provided."}
              </div>
            </div>

            {/* Task Assets Section */}
            <div className="pt-4 border-t border-[#141414]/15">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#141414]">
                  LINKED SPECIFICATIONS & ASSETS ({task.files.length})
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setFileModalOpen(true)}
                  className="text-xs"
                >
                  <FileText className="w-3.5 h-3.5 mr-1" />
                  ATTACH ASSET
                </Button>
              </div>

              <FileTable
                files={task.files.map((f) => ({
                  ...f,
                  task,
                  project: task.project as any,
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
            </div>
          </div>

          {/* Right Sidebar: Assignee & Metadata */}
          <div className="space-y-4 border border-[#141414]/20 bg-zinc-50 p-4 h-fit text-xs">
            <div className="space-y-1.5">
              <span className="font-mono font-bold uppercase tracking-wider text-[10px] text-[#141414]/60">
                CURRENT ASSIGNEE
              </span>
              <Select
                defaultValue={task.assigneeId || "none"}
                onValueChange={handleAssigneeChange}
                disabled={isPending}
              >
                <SelectTrigger className="w-full bg-white rounded-none border-[#141414] font-mono text-xs">
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-[#141414] font-mono text-xs">
                  <SelectItem value="none">UNASSIGNED</SelectItem>
                  {allUsers.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <span className="font-mono font-bold uppercase tracking-wider text-[10px] text-[#141414]/60">
                TARGET DUE DATE
              </span>
              <div className="flex items-center gap-1.5 font-mono text-[#141414] font-bold">
                <Calendar className="w-3.5 h-3.5 text-[#141414]/40" />
                <span>{task.dueDate ? format(new Date(task.dueDate), "MMM dd, yyyy").toUpperCase() : "NO DUE DATE SET"}</span>
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t border-[#141414]/15">
              <span className="font-mono font-bold uppercase tracking-wider text-[10px] text-[#141414]/60">
                CREATED BY
              </span>
              <div className="flex items-center gap-2">
                {task.creator ? (
                  <>
                    <UserAvatar name={task.creator.name} avatarUrl={task.creator.avatarUrl} size="sm" />
                    <span className="text-[#141414] font-bold">
                      {task.creator.name}
                    </span>
                  </>
                ) : (
                  <span className="text-[#141414]/40 font-mono">SYSTEM</span>
                )}
              </div>
            </div>

            <div className="space-y-1 text-[#141414]/60 text-[10px] font-mono pt-2 border-t border-[#141414]/15">
              <div>CREATED: {format(new Date(task.createdAt), "MMM d, yyyy HH:mm").toUpperCase()}</div>
              <div>UPDATED: {format(new Date(task.updatedAt), "MMM d, yyyy HH:mm").toUpperCase()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* File Upload Modal */}
      <FileUploadModal
        open={fileModalOpen}
        onOpenChange={setFileModalOpen}
        projects={allProjects}
        defaultProjectId={task.projectId}
        defaultTaskId={task.id}
      />
    </div>
  );
}
