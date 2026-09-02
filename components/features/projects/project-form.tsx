"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, ProjectStatus } from "@prisma/client";
import { createProjectAction } from "@/lib/actions/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertCircle } from "lucide-react";

interface ProjectFormProps {
  leads: User[];
  onSuccess?: (projectId: string) => void;
  onCancel?: () => void;
}

export function ProjectForm({ leads, onSuccess, onCancel }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>(ProjectStatus.PLANNING);
  const [leadId, setLeadId] = useState<string>(leads[0]?.id || "");
  const [startDate, setStartDate] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!code && val.length > 0) {
      // Auto-generate a clean project code slug
      const slug = val
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 4)
        .toUpperCase();
      if (slug) setCode(slug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadId || leadId === "none") {
      setError("Please select a project lead.");
      return;
    }
    setError(null);
    setLoading(true);

    const res = await createProjectAction({
      title,
      code: code.trim().toUpperCase(),
      description: description || "Operational workstream initialized.",
      status,
      leadId,
      startDate: startDate || undefined,
      targetDate: targetDate || undefined,
    });

    setLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to create project");
      return;
    }

    if (onSuccess && res.project) {
      onSuccess(res.project.id);
    } else if (res.project) {
      router.push(`/projects/${res.project.id}`);
    } else {
      router.push("/projects");
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-1.5">
          <label className="font-mono text-xs font-bold uppercase text-[#141414]">
            PROJECT TITLE <span className="text-[#F27D26]">*</span>
          </label>
          <Input
            value={title}
            onChange={handleTitleChange}
            placeholder="e.g., Cloud Migration Phase 2"
            required
            className="rounded-none border-[#141414] bg-zinc-50 text-xs font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-mono text-xs font-bold uppercase text-[#141414]">
            PROJECT CODE <span className="text-[#F27D26]">*</span>
          </label>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g., MIGR"
            maxLength={10}
            required
            className="font-mono text-xs uppercase rounded-none border-[#141414] bg-zinc-50"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="font-mono text-xs font-bold uppercase text-[#141414]">
          SCOPE & OPERATIONAL GOALS
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of deliverables, operational milestones, and stakeholders..."
          rows={3}
          className="rounded-none border-[#141414] bg-zinc-50 text-xs font-mono"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="font-mono text-xs font-bold uppercase text-[#141414]">
            INITIAL STATUS
          </label>
          <Select value={status} onValueChange={(v) => setStatus(v as ProjectStatus)}>
            <SelectTrigger className="rounded-none border-[#141414] bg-zinc-50 text-xs font-mono">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-[#141414] font-mono text-xs">
              <SelectItem value={ProjectStatus.PLANNING}>PLANNING</SelectItem>
              <SelectItem value={ProjectStatus.IN_PROGRESS}>IN PROGRESS</SelectItem>
              <SelectItem value={ProjectStatus.ON_HOLD}>ON HOLD</SelectItem>
              <SelectItem value={ProjectStatus.COMPLETED}>COMPLETED</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="font-mono text-xs font-bold uppercase text-[#141414]">
            PROJECT LEAD <span className="text-[#F27D26]">*</span>
          </label>
          <Select value={leadId} onValueChange={setLeadId}>
            <SelectTrigger className="rounded-none border-[#141414] bg-zinc-50 text-xs font-mono">
              <SelectValue placeholder="Select operational lead" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-[#141414] font-mono text-xs">
              {leads.map((lead) => (
                <SelectItem key={lead.id} value={lead.id}>
                  {lead.name} ({lead.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="font-mono text-xs font-bold uppercase text-[#141414]">
            START DATE
          </label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-none border-[#141414] bg-zinc-50 text-xs font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-mono text-xs font-bold uppercase text-[#141414]">
            TARGET COMPLETION DATE
          </label>
          <Input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="rounded-none border-[#141414] bg-zinc-50 text-xs font-mono"
          />
        </div>
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
              CREATING PROJECT...
            </>
          ) : (
            "+ CREATE OPERATIONAL PROJECT"
          )}
        </Button>
      </div>
    </form>
  );
}
