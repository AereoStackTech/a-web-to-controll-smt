import React from "react";
import Link from "next/link";
import { ActivityLog, User } from "@prisma/client";
import { UserAvatar } from "@/components/shared/user-avatar";
import { formatDistanceToNow } from "date-fns";
import { Activity, ArrowRight, FolderKanban, CheckSquare, FileText, UserPlus } from "lucide-react";

type ActivityWithUser = ActivityLog & {
  user: {
    id?: string;
    name: string;
    email?: string;
    avatarUrl?: string | null;
    role?: any;
    department?: string | null;
  };
};

interface RecentActivityFeedProps {
  activities: ActivityWithUser[];
}

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  const getActionIcon = (action: string) => {
    if (action.startsWith("PROJECT")) {
      return <FolderKanban className="w-3.5 h-3.5 text-[#141414]" />;
    }
    if (action.startsWith("TASK")) {
      return <CheckSquare className="w-3.5 h-3.5 text-[#141414]" />;
    }
    if (action.startsWith("FILE")) {
      return <FileText className="w-3.5 h-3.5 text-[#141414]" />;
    }
    if (action.startsWith("MEMBER")) {
      return <UserPlus className="w-3.5 h-3.5 text-[#141414]" />;
    }
    return <Activity className="w-3.5 h-3.5 text-[#141414]" />;
  };

  const formatActionMessage = (log: ActivityWithUser) => {
    const details = (log.details as any) || {};
    switch (log.action) {
      case "PROJECT_CREATED":
        return `created project ${details.code || ""} "${details.title || ""}"`;
      case "PROJECT_STATUS_CHANGED":
        return `updated ${details.code || "project"} status to ${details.toStatus}`;
      case "TASK_CREATED":
        return `created task "${details.title || ""}"`;
      case "TASK_STATUS_CHANGED":
        return `moved task #${details.taskNumber || ""} to ${details.toStatus}`;
      case "TASK_ASSIGNED":
        return `assigned task #${details.taskNumber || ""} to ${details.assignedTo}`;
      case "FILE_UPLOADED":
        return `uploaded asset "${details.name || ""}" (${details.category || "GENERAL"})`;
      case "MEMBER_INVITED":
        return `provisioned ${details.role} account for ${details.name}`;
      case "MEMBER_ROLE_UPDATED":
        return `elevated permissions for ${details.targetEmail} to ${details.newRole}`;
      default:
        return log.action.toLowerCase().replace(/_/g, " ");
    }
  };

  return (
    <div className="border border-[#141414] bg-white text-[#141414] flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#141414] bg-zinc-100">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#141414]" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#141414]">
            OPERATIONAL AUDIT STREAM
          </h3>
        </div>
        <Link
          href="/activity"
          className="font-mono text-[10px] uppercase font-bold text-[#141414] hover:text-[#F27D26] flex items-center gap-1 transition-colors"
        >
          FULL LOG <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Activity stream rows */}
      <div className="p-4 space-y-3.5 flex-1 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="py-12 text-center font-mono text-xs text-[#141414]/60">
            NO AUDIT RECORDS RECORDED IN CURRENT WORKSPACE CYCLE.
          </div>
        ) : (
          activities.map((log) => (
            <div key={log.id} className="flex items-start gap-3 text-xs border-b border-[#141414]/10 pb-3 last:border-0 last:pb-0">
              <UserAvatar name={log.user.name} avatarUrl={log.user.avatarUrl} size="sm" className="mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="text-[#141414] leading-snug">
                  <span className="font-bold">{log.user.name}</span>{" "}
                  <span className="text-[#141414]/80">{formatActionMessage(log)}</span>
                </p>
                <div className="flex items-center gap-2 font-mono text-[10px] text-[#141414]/50">
                  <span className="flex items-center gap-1">
                    {getActionIcon(log.action)}
                    <span className="uppercase font-semibold text-[#141414]/70">{log.entityType}</span>
                  </span>
                  <span>{"//"}</span>
                  <span>{formatDistanceToNow(new Date(log.createdAt), { addSuffix: true }).toUpperCase()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
