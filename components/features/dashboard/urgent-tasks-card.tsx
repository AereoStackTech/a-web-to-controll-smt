import React from "react";
import Link from "next/link";
import { Task, Project, User } from "@prisma/client";
import { TaskPriorityBadge } from "@/components/features/tasks/task-priority-badge";
import { TaskStatusBadge } from "@/components/features/tasks/task-status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Calendar, ArrowRight, AlertCircle } from "lucide-react";
import { format } from "date-fns";

type TaskWithRelations = Task & {
  project: {
    id: string;
    title: string;
    code: string;
    description?: string | null;
  };
  assignee: User | null;
};

interface UrgentTasksCardProps {
  tasks: TaskWithRelations[];
}

export function UrgentTasksCard({ tasks }: UrgentTasksCardProps) {
  return (
    <div className="border border-[#141414] bg-white text-[#141414] flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#141414] bg-zinc-100">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#F27D26]" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#141414]">
            CRITICAL PATH & URGENT TASKS
          </h3>
        </div>
        <Link
          href="/tasks?priority=URGENT"
          className="font-mono text-[10px] uppercase font-bold text-[#141414] hover:text-[#F27D26] flex items-center gap-1 transition-colors"
        >
          VIEW ALL [{tasks.length}] <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Task List */}
      <div className="divide-y divide-[#141414]/15 flex-1 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="py-12 text-center font-mono text-xs text-[#141414]/60">
            NO CRITICAL BOTTLENECK TASKS IDENTIFIED IN WORKSPACE.
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="p-3.5 flex items-start justify-between gap-3 hover:bg-zinc-50 transition-colors"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold px-1.5 py-0.2 bg-[#141414] text-white">
                    {task.project.code}-{task.taskNumber}
                  </span>
                  <Link
                    href={`/tasks/${task.id}`}
                    className="text-xs font-bold text-[#141414] hover:text-[#F27D26] truncate block transition-colors"
                  >
                    {task.title}
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-[#141414]/60">
                  <span className="font-semibold text-[#141414]/80">{task.project.title}</span>
                  {task.dueDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#141414]/40" />
                      DUE {format(new Date(task.dueDate), "MMM dd").toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <TaskPriorityBadge priority={task.priority} />
                <TaskStatusBadge status={task.status} />
                {task.assignee && (
                  <UserAvatar name={task.assignee.name} avatarUrl={task.assignee.avatarUrl} size="sm" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
