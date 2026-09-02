import { TaskStatus } from "@prisma/client";
import { CircleDashed, CircleDot, PlayCircle, Eye, CheckCircle2 } from "lucide-react";

interface TaskStatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function TaskStatusBadge({ status, className }: TaskStatusBadgeProps) {
  switch (status) {
    case TaskStatus.BACKLOG:
      return (
        <span className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase font-medium px-1.5 py-0.5 border border-[#141414]/30 bg-zinc-100 text-[#141414]/70 ${className || ""}`}>
          <CircleDashed className="w-3 h-3 text-[#141414]/50" />
          BACKLOG
        </span>
      );
    case TaskStatus.TODO:
      return (
        <span className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase font-medium px-1.5 py-0.5 border border-[#141414] bg-white text-[#141414] ${className || ""}`}>
          <CircleDot className="w-3 h-3 text-[#141414]" />
          TO DO
        </span>
      );
    case TaskStatus.IN_PROGRESS:
      return (
        <span className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 border border-[#141414] bg-[#141414] text-white ${className || ""}`}>
          <PlayCircle className="w-3 h-3 text-[#F27D26]" />
          IN PROGRESS
        </span>
      );
    case TaskStatus.IN_REVIEW:
      return (
        <span className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 border border-amber-600 bg-amber-50 text-amber-800 ${className || ""}`}>
          <Eye className="w-3 h-3 text-amber-600" />
          REVIEW
        </span>
      );
    case TaskStatus.DONE:
      return (
        <span className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 border border-emerald-700 bg-emerald-50 text-emerald-800 ${className || ""}`}>
          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
          DONE
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
