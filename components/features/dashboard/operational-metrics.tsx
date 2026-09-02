import React from "react";
import { FolderKanban, CheckSquare, AlertTriangle, CheckCircle2 } from "lucide-react";

interface OperationalMetricsProps {
  metrics: {
    activeProjectsCount: number;
    totalProjectsCount: number;
    inProgressTasksCount: number;
    urgentTasksCount: number;
    completedTasksCount: number;
    totalTasksCount: number;
    totalFilesCount: number;
  };
}

export function OperationalMetrics({ metrics }: OperationalMetricsProps) {
  const completionRate =
    metrics.totalTasksCount > 0
      ? Math.round((metrics.completedTasksCount / metrics.totalTasksCount) * 100)
      : 0;

  const cards = [
    {
      id: "METRIC-01",
      title: "Active Projects",
      value: metrics.activeProjectsCount,
      subtext: `OF ${metrics.totalProjectsCount} TOTAL WORKSPACES`,
      icon: FolderKanban,
      highlight: false,
    },
    {
      id: "METRIC-02",
      title: "Tasks In Flight",
      value: metrics.inProgressTasksCount,
      subtext: `${metrics.completedTasksCount} CLOSED THIS CYCLE`,
      icon: CheckSquare,
      highlight: false,
    },
    {
      id: "METRIC-03",
      title: "Urgent Priority Items",
      value: metrics.urgentTasksCount,
      subtext: metrics.urgentTasksCount > 0 ? "REQUIRES IMMEDIATE LEAD ACTION" : "ZERO BOTTLENECK SIGNALS",
      icon: AlertTriangle,
      highlight: metrics.urgentTasksCount > 0,
    },
    {
      id: "METRIC-04",
      title: "Completion Ratio",
      value: `${completionRate}%`,
      subtext: `${metrics.completedTasksCount}/${metrics.totalTasksCount} DELIVERED`,
      icon: CheckCircle2,
      highlight: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`flex flex-col justify-between p-5 border border-[#141414] transition-all ${
              card.highlight
                ? "bg-[#141414] text-[#E4E3E0]"
                : "bg-white text-[#141414]"
            }`}
          >
            <div className="flex items-center justify-between border-b border-current pb-3 opacity-80">
              <span className="font-mono text-[10px] tracking-widest uppercase font-semibold">
                {card.title}
              </span>
              <span className="font-mono text-[9px] px-1 py-0.2 border border-current">
                {card.id}
              </span>
            </div>

            <div className="my-4">
              <div
                className={`text-4xl sm:text-5xl font-mono font-bold tracking-tighter tabular-nums ${
                  card.highlight ? "text-[#F27D26]" : "text-[#141414]"
                }`}
              >
                {card.value}
              </div>
            </div>

            <div className="pt-2 border-t border-current/20 flex items-center justify-between font-mono text-[10px] tracking-wider opacity-70">
              <span>{card.subtext}</span>
              <Icon className="w-3.5 h-3.5 shrink-0" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
