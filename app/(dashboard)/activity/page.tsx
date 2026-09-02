import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { UserAvatar } from "@/components/shared/user-avatar";
import { formatDistanceToNow, format } from "date-fns";
import { Activity, FolderKanban, CheckSquare, FileText, UserPlus, Shield } from "lucide-react";

export default async function ActivityPage() {
  const user = await getCurrentUser();

  const activities = await db.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

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

  const formatActionMessage = (log: typeof activities[0]) => {
    const details = (log.details as any) || {};
    switch (log.action) {
      case "PROJECT_CREATED":
        return `created project ${details.code || ""} "${details.title || ""}"`;
      case "PROJECT_STATUS_CHANGED":
        return `updated ${details.code || "project"} status to ${details.toStatus}`;
      case "PROJECT_DELETED":
        return `deleted project ${details.code || ""} "${details.title || ""}"`;
      case "TASK_CREATED":
        return `created task "${details.title || ""}"`;
      case "TASK_STATUS_CHANGED":
        return `moved task #${details.taskNumber || ""} to ${details.toStatus}`;
      case "TASK_ASSIGNED":
        return `assigned task #${details.taskNumber || ""} to ${details.assignedTo}`;
      case "TASK_DELETED":
        return `deleted task #${details.taskNumber || ""} "${details.title || ""}"`;
      case "FILE_UPLOADED":
        return `uploaded asset "${details.name || ""}" (${details.category || "GENERAL"})`;
      case "FILE_DELETED":
        return `deleted asset "${details.name || ""}"`;
      case "MEMBER_INVITED":
        return `provisioned new ${details.role} account for ${details.name}`;
      case "MEMBER_ROLE_UPDATED":
        return `elevated permissions for ${details.targetEmail} to ${details.newRole}`;
      case "MEMBER_ACTIVATED":
        return `reactivated user account for ${details.targetEmail}`;
      case "MEMBER_DEACTIVATED":
        return `deactivated user account for ${details.targetEmail}`;
      default:
        return log.action.toLowerCase().replace(/_/g, " ");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Breadcrumbs items={[{ label: "Audit Stream" }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-[#141414]">
        <div>
          <h1 className="text-xl sm:text-2xl font-mono font-bold uppercase tracking-tight text-[#141414]">
            WORKSPACE OPERATIONAL AUDIT STREAM
          </h1>
          <p className="font-mono text-xs text-[#141414]/60 mt-0.5">
            Immutable log of state modifications, project status changes, and user authorizations.
          </p>
        </div>
      </div>

      {/* Timeline List */}
      <div className="border border-[#141414] bg-white p-6 shadow-xs">
        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#141414]/20">
          {activities.length === 0 ? (
            <div className="py-8 text-center font-mono text-xs text-[#141414]/60">
              NO AUDIT ACTIVITY LOGGED IN CURRENT RECORD.
            </div>
          ) : (
            activities.map((log) => (
              <div key={log.id} className="relative flex items-start gap-4 text-xs">
                {/* Dot */}
                <div className="absolute -left-6 top-1 flex h-4 w-4 items-center justify-center bg-white border border-[#141414]">
                  {getActionIcon(log.action)}
                </div>

                <div className="flex-1 border border-[#141414]/20 bg-zinc-50/70 p-3 space-y-1 hover:border-[#141414] transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <UserAvatar name={log.user.name} avatarUrl={log.user.avatarUrl} size="sm" />
                      <span className="font-bold text-[#141414]">
                        {log.user.name}
                      </span>
                    </div>

                    <span className="font-mono text-[10px] text-[#141414]/60">
                      {format(new Date(log.createdAt), "MMM d, yyyy HH:mm:ss")}
                    </span>
                  </div>

                  <p className="text-[#141414] text-xs font-medium">
                    {formatActionMessage(log)}
                  </p>

                  <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-[#141414]/50">
                    <span className="uppercase font-bold text-[#141414]/70">{log.entityType}</span>
                    <span>{"//"}</span>
                    <span>RECORD_ID: {log.entityId}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
