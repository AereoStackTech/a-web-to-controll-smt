import { Priority } from "@prisma/client";
import { AlertCircle, ArrowUp, ArrowRight, ArrowDown } from "lucide-react";

interface TaskPriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export function TaskPriorityBadge({ priority, className }: TaskPriorityBadgeProps) {
  switch (priority) {
    case Priority.URGENT:
      return (
        <span className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 border border-red-600 bg-red-50 text-red-700 ${className || ""}`}>
          <AlertCircle className="w-3 h-3 text-red-600" />
          URGENT
        </span>
      );
    case Priority.HIGH:
      return (
        <span className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 border border-[#F27D26] bg-[#F27D26]/10 text-[#d96a1a] ${className || ""}`}>
          <ArrowUp className="w-3 h-3 text-[#F27D26]" />
          HIGH
        </span>
      );
    case Priority.MEDIUM:
      return (
        <span className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase font-medium px-1.5 py-0.5 border border-[#141414]/40 bg-zinc-100 text-[#141414] ${className || ""}`}>
          <ArrowRight className="w-3 h-3 text-[#141414]/60" />
          MED
        </span>
      );
    case Priority.LOW:
      return (
        <span className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase font-normal px-1.5 py-0.5 border border-[#141414]/20 bg-white text-[#141414]/70 ${className || ""}`}>
          <ArrowDown className="w-3 h-3 text-[#141414]/40" />
          LOW
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase px-1.5 py-0.5 border border-[#141414]/30 ${className || ""}`}>
          {priority}
        </span>
      );
  }
}
