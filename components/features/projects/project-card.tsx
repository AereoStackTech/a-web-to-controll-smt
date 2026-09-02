"use client";

import React from "react";
import Link from "next/link";
import { Project, User, Task } from "@prisma/client";
import { ProjectStatusBadge } from "./project-status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { CheckSquare, FileText, ArrowRight } from "lucide-react";

type ProjectWithStats = Project & {
  lead: {
    id?: string;
    name: string;
    avatarUrl?: string | null;
    email?: string;
    role?: any;
    department?: string | null;
  } | null;
  tasks?: Task[];
  _count?: {
    tasks: number;
    files: number;
  };
};

interface ProjectCardProps {
  project: ProjectWithStats;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const taskCount = project._count?.tasks ?? project.tasks?.length ?? 0;
  const completedTasks = project.tasks
    ? project.tasks.filter((t) => t.status === "DONE").length
    : 0;
  const progressPercent = taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0;

  return (
    <div className="group border border-[#141414] bg-white p-5 hover:shadow-md transition-all flex flex-col justify-between">
      <div className="space-y-3">
        {/* Top bar: Project Code + Status */}
        <div className="flex items-center justify-between gap-2 border-b border-[#141414]/15 pb-2.5">
          <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#141414] text-white">
            {project.code}
          </span>
          <ProjectStatusBadge status={project.status} />
        </div>

        {/* Title and Description */}
        <div>
          <Link
            href={`/projects/${project.id}`}
            className="text-sm font-bold text-[#141414] group-hover:text-[#F27D26] transition-colors line-clamp-1 uppercase tracking-tight"
          >
            {project.title}
          </Link>
          <p className="mt-1 text-xs text-[#141414]/70 line-clamp-2 leading-relaxed">
            {project.description || "No project scope details documented."}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase text-[#141414]/60">
            <span>COMPLETION</span>
            <span className="font-bold text-[#141414]">{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-200 overflow-hidden">
            <div
              className="h-full bg-[#141414] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Meta: Lead + Tasks & Files Count + Date */}
      <div className="mt-5 pt-3 border-t border-[#141414]/15 flex items-center justify-between text-xs text-[#141414]">
        <div className="flex items-center gap-2">
          {project.lead ? (
            <div className="flex items-center gap-1.5" title={`Lead: ${project.lead.name}`}>
              <UserAvatar name={project.lead.name} avatarUrl={project.lead.avatarUrl} size="sm" />
              <span className="truncate max-w-[100px] text-[#141414] text-xs font-semibold">
                {project.lead.name.split(" ")[0]}
              </span>
            </div>
          ) : (
            <span className="font-mono text-[10px] text-[#141414]/40 italic">UNASSIGNED LEAD</span>
          )}
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="flex items-center gap-1 text-[#141414]/70" title="Tasks">
            <CheckSquare className="w-3.5 h-3.5 text-[#141414]/50" />
            <span>{taskCount}</span>
          </span>
          <span className="flex items-center gap-1 text-[#141414]/70" title="Files">
            <FileText className="w-3.5 h-3.5 text-[#141414]/50" />
            <span>{project._count?.files || 0}</span>
          </span>
          <Link
            href={`/projects/${project.id}`}
            className="p-1 border border-[#141414]/20 hover:border-[#141414] hover:bg-[#141414] hover:text-white transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
