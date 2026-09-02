"use client";

import React, { useTransition } from "react";
import { ProjectStatus } from "@prisma/client";
import { updateProjectStatusAction } from "@/lib/actions/project";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectStatusBadge } from "./project-status-badge";
import { Loader2 } from "lucide-react";

interface ProjectStatusSelectorProps {
  projectId: string;
  currentStatus: ProjectStatus;
  disabled?: boolean;
}

export function ProjectStatusSelector({
  projectId,
  currentStatus,
  disabled = false,
}: ProjectStatusSelectorProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      await updateProjectStatusAction(projectId, newStatus as ProjectStatus);
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
        <SelectTrigger className="w-[160px] h-8 text-xs bg-white dark:bg-slate-900">
          <SelectValue>
            <ProjectStatusBadge status={currentStatus} />
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ProjectStatus.PLANNING}>Planning</SelectItem>
          <SelectItem value={ProjectStatus.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={ProjectStatus.ON_HOLD}>On Hold</SelectItem>
          <SelectItem value={ProjectStatus.COMPLETED}>Completed</SelectItem>
          <SelectItem value={ProjectStatus.ARCHIVED}>Archived</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
