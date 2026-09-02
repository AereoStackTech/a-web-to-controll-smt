"use client";

import React from "react";
import { Task, Project, User, TaskStatus } from "@prisma/client";
import { TaskCard } from "./task-card";
import { Plus, CircleDot, PlayCircle, Eye, CheckCircle2, CircleDashed } from "lucide-react";
import Link from "next/link";

type TaskWithMeta = Task & {
  project?: Project | null;
  assignee?: User | null;
};

interface TaskBoardProps {
  tasks: TaskWithMeta[];
  projectId?: string;
}

export function TaskBoard({ tasks, projectId }: TaskBoardProps) {
  const columns: {
    status: TaskStatus;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      status: TaskStatus.BACKLOG,
      title: "BACKLOG",
      icon: CircleDashed,
    },
    {
      status: TaskStatus.TODO,
      title: "TO DO",
      icon: CircleDot,
    },
    {
      status: TaskStatus.IN_PROGRESS,
      title: "IN PROGRESS",
      icon: PlayCircle,
    },
    {
      status: TaskStatus.IN_REVIEW,
      title: "IN REVIEW",
      icon: Eye,
    },
    {
      status: TaskStatus.DONE,
      title: "COMPLETED",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-6 min-h-[500px]">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status);
        const Icon = col.icon;

        return (
          <div
            key={col.status}
            className="flex flex-col border border-[#141414] bg-white/70 min-w-[260px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between p-3 border-b border-[#141414] bg-zinc-100 text-[#141414]">
              <div className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-[#141414]" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">{col.title}</span>
              </div>
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 bg-[#141414] text-white">
                {colTasks.length}
              </span>
            </div>

            {/* Task list in column */}
            <div className="p-3 space-y-3 flex-1 min-h-[160px] bg-zinc-50/50">
              {colTasks.length === 0 ? (
                <div className="flex items-center justify-center h-24 border border-dashed border-[#141414]/20 font-mono text-[11px] text-[#141414]/40 uppercase">
                  EMPTY STAGE
                </div>
              ) : (
                colTasks.map((task) => <TaskCard key={task.id} task={task} />)
              )}
            </div>

            {/* Quick add button in column */}
            <div className="p-2 border-t border-[#141414] bg-white">
              <Link
                href={
                  projectId
                    ? `/tasks/new?projectId=${projectId}&status=${col.status}`
                    : `/tasks/new?status=${col.status}`
                }
                className="flex items-center justify-center gap-1.5 w-full py-1.5 border border-[#141414] hover:bg-[#141414] hover:text-white text-[#141414] font-mono text-[10px] font-bold uppercase tracking-wider transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>+ ADD TASK</span>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
