"use client";

import React, { useTransition } from "react";
import { TaskStatus } from "@prisma/client";
import { updateTaskStatusAction } from "@/lib/actions/task";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskStatusBadge } from "./task-status-badge";
import { Loader2 } from "lucide-react";

interface TaskStatusSelectorProps {
  taskId: string;
  currentStatus: TaskStatus;
  disabled?: boolean;
}

export function TaskStatusSelector({
  taskId,
  currentStatus,
  disabled = false,
}: TaskStatusSelectorProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      await updateTaskStatusAction(taskId, newStatus as TaskStatus);
    });
  };

  return (
    <div className="flex items-center gap-2">
      {isPending && <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />}
      <Select
        defaultValue={currentStatus}
        onValueChange={handleStatusChange}
        disabled={disabled || isPending}
      >
        <SelectTrigger className="w-[150px] h-8 text-xs bg-white dark:bg-slate-900">
          <SelectValue>
            <TaskStatusBadge status={currentStatus} />
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
