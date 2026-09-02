"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Project, User, TaskStatus, Priority } from "@prisma/client";
import { createTaskAction } from "@/lib/actions/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertCircle } from "lucide-react";

interface TaskFormProps {
  projects: Project[];
  users: User[];
  defaultProjectId?: string;
  defaultStatus?: TaskStatus;
  onSuccess?: (taskId: string) => void;
  onCancel?: () => void;
}

export function TaskForm({
  projects,
  users,
  defaultProjectId,
  defaultStatus = TaskStatus.TODO,
  onSuccess,
  onCancel,
}: TaskFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState(defaultProjectId || (projects[0]?.id ?? ""));
  const [assigneeId, setAssigneeId] = useState<string>("");
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) {
      setError("Please select a target project for this task.");
      return;
    }

    setError(null);
    setLoading(true);

    const res = await createTaskAction({
      title,
      description: description || undefined,
      projectId,
      assigneeId: assigneeId === "none" || !assigneeId ? undefined : assigneeId,
      priority,
      status,
      dueDate: dueDate || undefined,
    });

    setLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to create task");
      return;
    }

    if (onSuccess && res.task) {
      onSuccess(res.task.id);
    } else if (res.task) {
      router.push(`/tasks/${res.task.id}`);
    } else {
      router.push("/tasks");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 border border-red-600 bg-red-50 text-red-800 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="font-mono text-xs font-bold uppercase text-[#141414]">
          TASK TITLE <span className="text-[#F27D26]">*</span>
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Provision load balancer and SSL certs"
          required
          className="rounded-none border-[#141414] bg-zinc-50 text-xs font-mono"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="font-mono text-xs font-bold uppercase text-[#141414]">
            TARGET WORKSPACE <span className="text-[#F27D26]">*</span>
          </label>
          <Select value={projectId} onValueChange={setProjectId} required>
            <SelectTrigger className="rounded-none border-[#141414] bg-zinc-50 text-xs font-mono">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-[#141414] font-mono text-xs">
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  [{p.code}] {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="font-mono text-xs font-bold uppercase text-[#141414]">
            ASSIGNEE
          </label>
          <Select value={assigneeId} onValueChange={setAssigneeId}>
            <SelectTrigger className="rounded-none border-[#141414] bg-zinc-50 text-xs font-mono">
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-[#141414] font-mono text-xs">
              <SelectItem value="none">UNASSIGNED</SelectItem>
              {users.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.name} ({u.department || u.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="font-mono text-xs font-bold uppercase text-[#141414]">
            INITIAL STATUS
          </label>
          <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
            <SelectTrigger className="rounded-none border-[#141414] bg-zinc-50 text-xs font-mono">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-[#141414] font-mono text-xs">
              <SelectItem value={TaskStatus.BACKLOG}>BACKLOG</SelectItem>
              <SelectItem value={TaskStatus.TODO}>TO DO</SelectItem>
              <SelectItem value={TaskStatus.IN_PROGRESS}>IN PROGRESS</SelectItem>
              <SelectItem value={TaskStatus.IN_REVIEW}>IN REVIEW</SelectItem>
              <SelectItem value={TaskStatus.DONE}>DONE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="font-mono text-xs font-bold uppercase text-[#141414]">
            PRIORITY LEVEL
          </label>
          <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
            <SelectTrigger className="rounded-none border-[#141414] bg-zinc-50 text-xs font-mono">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-[#141414] font-mono text-xs">
              <SelectItem value={Priority.LOW}>LOW</SelectItem>
              <SelectItem value={Priority.MEDIUM}>MEDIUM</SelectItem>
              <SelectItem value={Priority.HIGH}>HIGH</SelectItem>
              <SelectItem value={Priority.URGENT}>URGENT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="font-mono text-xs font-bold uppercase text-[#141414]">
            TARGET DUE DATE
          </label>
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded-none border-[#141414] bg-zinc-50 text-xs font-mono"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="font-mono text-xs font-bold uppercase text-[#141414]">
          DESCRIPTION & ACCEPTANCE CRITERIA
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Details, technical requirements, links, or verification steps..."
          rows={3}
          className="rounded-none border-[#141414] bg-zinc-50 text-xs font-mono"
        />
      </div>

      <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#141414]">
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            CANCEL
          </Button>
        )}
        <Button type="submit" size="sm" variant="default" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              CREATING TASK...
            </>
          ) : (
            "+ CREATE OPERATIONAL TASK"
          )}
        </Button>
      </div>
    </form>
  );
}
