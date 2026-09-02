"use client";

import React from "react";
import Link from "next/link";
import { Task, Project, User, TaskStatus } from "@prisma/client";
import { TaskStatusBadge } from "./task-status-badge";
import { TaskPriorityBadge } from "./task-priority-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, ChevronRight } from "lucide-react";
import { format } from "date-fns";

type TaskWithMeta = Task & {
  project?: Project | null;
  assignee?: User | null;
};

interface TaskTableProps {
  tasks: TaskWithMeta[];
  showProject?: boolean;
}

export function TaskTable({ tasks, showProject = true }: TaskTableProps) {
  if (tasks.length === 0) {
    return (
      <div className="border border-[#141414] bg-white p-8 text-center font-mono text-xs text-[#141414]/60">
        NO TASKS MATCH THE APPLIED GRID FILTERS.
      </div>
    );
  }

  return (
    <div className="border border-[#141414] bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">IDENTIFIER</TableHead>
            <TableHead>TASK DESCRIPTION</TableHead>
            {showProject && <TableHead className="w-[160px]">PROJECT</TableHead>}
            <TableHead className="w-[120px]">STATUS</TableHead>
            <TableHead className="w-[100px]">PRIORITY</TableHead>
            <TableHead className="w-[140px]">ASSIGNEE</TableHead>
            <TableHead className="w-[110px]">DUE DATE</TableHead>
            <TableHead className="w-[40px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className="group hover:bg-[#141414]/5">
              <TableCell className="font-mono text-xs font-bold text-[#141414]">
                <span className="px-1.5 py-0.5 bg-zinc-100 border border-[#141414]/20">
                  {task.project ? `${task.project.code}-${task.taskNumber}` : `TASK-${task.taskNumber}`}
                </span>
              </TableCell>

              <TableCell>
                <Link
                  href={`/tasks/${task.id}`}
                  className="font-bold text-xs text-[#141414] group-hover:text-[#F27D26] transition-colors block"
                >
                  {task.title}
                </Link>
                {task.description && (
                  <p className="text-[11px] text-[#141414]/60 truncate max-w-md mt-0.5 font-normal">
                    {task.description}
                  </p>
                )}
              </TableCell>

              {showProject && (
                <TableCell className="font-mono text-xs">
                  {task.project ? (
                    <Link
                      href={`/projects/${task.project.id}`}
                      className="font-semibold text-[#141414] hover:underline"
                    >
                      {task.project.title}
                    </Link>
                  ) : (
                    <span className="text-[#141414]/40">—</span>
                  )}
                </TableCell>
              )}

              <TableCell>
                <TaskStatusBadge status={task.status} />
              </TableCell>

              <TableCell>
                <TaskPriorityBadge priority={task.priority} />
              </TableCell>

              <TableCell>
                {task.assignee ? (
                  <div className="flex items-center gap-2">
                    <UserAvatar name={task.assignee.name} avatarUrl={task.assignee.avatarUrl} size="sm" />
                    <span className="text-xs font-medium text-[#141414] truncate max-w-[100px]">
                      {task.assignee.name}
                    </span>
                  </div>
                ) : (
                  <span className="font-mono text-[11px] text-[#141414]/40 italic">UNASSIGNED</span>
                )}
              </TableCell>

              <TableCell className="font-mono text-[11px] text-[#141414]/70">
                {task.dueDate ? (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#141414]/40" />
                    {format(new Date(task.dueDate), "MMM dd, yyyy").toUpperCase()}
                  </span>
                ) : (
                  <span className="text-[#141414]/40">—</span>
                )}
              </TableCell>

              <TableCell>
                <Link
                  href={`/tasks/${task.id}`}
                  className="p-1 text-[#141414]/40 hover:text-[#141414]"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
