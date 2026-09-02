import { ProjectStatus } from "@prisma/client";
import { Circle, Clock, CheckCircle2, PauseCircle, Archive } from "lucide-react";

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

export function ProjectStatusBadge({ status, className }: ProjectStatusBadgeProps) {
  switch (status) {
    case ProjectStatus.PLANNING:
      return (
        <span className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 border border-amber-600 bg-amber-50 text-amber-800 ${className || ""}`}>
          <Clock className="w-3 h-3 text-amber-600" />
          PLANNING
        </span>
      );
    case ProjectStatus.IN_PROGRESS:
      return (
        <span className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 border border-[#141414] bg-[#141414] text-white ${className || ""}`}>
          <Circle className="w-2 h-2 fill-[#F27D26] text-[#F27D26]" />
          ACTIVE
        </span>
      );
    case ProjectStatus.ON_HOLD:
      return (
        <span className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase font-medium px-1.5 py-0.5 border border-[#141414]/40 bg-zinc-100 text-[#141414] ${className || ""}`}>
          <PauseCircle className="w-3 h-3" />
          ON HOLD
        </span>
      );
    case ProjectStatus.COMPLETED:
      return (
        <span className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 border border-emerald-700 bg-emerald-50 text-emerald-800 ${className || ""}`}>
          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
          COMPLETED
        </span>
      );
    case ProjectStatus.ARCHIVED:
      return (
        <span className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase font-normal px-1.5 py-0.5 border border-[#141414]/20 bg-white text-[#141414]/60 ${className || ""}`}>
          <Archive className="w-3 h-3" />
          ARCHIVED
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase px-1.5 py-0.5 border border-[#141414]/30 ${className || ""}`}>
          {status}
        </span>
      );
  }
}
