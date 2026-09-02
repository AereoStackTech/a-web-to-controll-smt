"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { Task, Project, User, TaskStatus } from "@prisma/client";
import { TaskPriorityBadge } from "./task-priority-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Calendar, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { updateTaskStatusAction } from "@/lib/actions/task";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TaskWithMeta = Task & {
  project?: Project | null;
  assignee?: User | null;
};

interface TaskCardProps {
  task: TaskWithMeta;
  showProject?: boolean;
}

export function TaskCard({ task, showProject = true }: TaskCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleQuickStatus = (nextStatus: TaskStatus) => {
    startTransition(async () => {
      await updateTaskStatusAction(task.id, nextStatus);
    });
  };

  return (
    <div className="group relative border border-[#141414] bg-white p-3.5 space-y-2.5 shadow-xs hover:border-[#141414] hover:shadow-sm transition-all">
      {/* Top row: Project Key + Priority */}
      <div className="flex items-center justify-between gap-2 border-b border-[#141414]/15 pb-2">
        <div className="font-mono text-[11px] font-bold text-[#141414]">
          {task.project ? (
            <Link
              href={`/projects/${task.project.id}`}
              className="hover:underline text-[#141414]"
            >
              {task.project.code}-{task.taskNumber}
            </Link>
          ) : (
            <span>TASK-{task.taskNumber}</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <TaskPriorityBadge priority={task.priority} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-5 w-5 flex items-center justify-center border border-[#141414]/20 hover:border-[#141414] hover:bg-zinc-100 text-[#141414]/60 cursor-pointer">
                <MoreHorizontal className="w-3 h-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 text-xs font-mono border border-[#141414] rounded-none bg-white p-1">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-[#141414]/60">MOVE STATUS</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#141414]/20" />
              <DropdownMenuItem onClick={() => handleQuickStatus(TaskStatus.BACKLOG)} className="hover:bg-[#141414] hover:text-white cursor-pointer">
                BACKLOG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleQuickStatus(TaskStatus.TODO)} className="hover:bg-[#141414] hover:text-white cursor-pointer">
                TO DO
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleQuickStatus(TaskStatus.IN_PROGRESS)} className="hover:bg-[#141414] hover:text-white cursor-pointer">
                IN PROGRESS
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleQuickStatus(TaskStatus.IN_REVIEW)} className="hover:bg-[#141414] hover:text-white cursor-pointer">
                IN REVIEW
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleQuickStatus(TaskStatus.DONE)} className="hover:bg-[#141414] hover:text-white cursor-pointer">
                DONE
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Task Title */}
      <div>
        <Link
          href={`/tasks/${task.id}`}
          className="text-xs font-bold text-[#141414] group-hover:text-[#F27D26] line-clamp-2 leading-snug transition-colors"
        >
          {task.title}
        </Link>
        {task.description && (
          <p className="mt-1 text-[11px] text-[#141414]/60 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Bottom metadata */}
      <div className="pt-2 border-t border-[#141414]/15 flex items-center justify-between text-xs font-mono">
        <div className="text-[#141414]/60">
          {task.dueDate ? (
            <span
              className="flex items-center gap-1 text-[10px]"
              title={`Due date: ${format(new Date(task.dueDate), "PPP")}`}
            >
              <Calendar className="w-3 h-3 text-[#141414]/40" />
              {format(new Date(task.dueDate), "MMM dd").toUpperCase()}
            </span>
          ) : (
            <span className="text-[10px] text-[#141414]/40">NO DUE DATE</span>
          )}
        </div>

        <div>
          {task.assignee ? (
            <div className="flex items-center gap-1" title={`Assigned to: ${task.assignee.name}`}>
              <UserAvatar name={task.assignee.name} avatarUrl={task.assignee.avatarUrl} size="sm" />
            </div>
          ) : (
            <span className="text-[10px] text-[#141414]/40 italic">UNASSIGNED</span>
          )}
        </div>
      </div>
    </div>
  );
}
