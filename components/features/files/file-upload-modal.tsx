"use client";

import React, { useState } from "react";
import { Project, FileCategory } from "@prisma/client";
import { registerFileAction } from "@/lib/actions/file";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadCloud, Link as LinkIcon, Loader2, AlertCircle } from "lucide-react";

interface FileUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: Project[];
  defaultProjectId?: string;
  defaultTaskId?: string;
}

export function FileUploadModal({
  open,
  onOpenChange,
  projects,
  defaultProjectId,
  defaultTaskId,
}: FileUploadModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileSizeKb, setFileSizeKb] = useState<number | undefined>(256);
  const [mimeType, setMimeType] = useState("application/pdf");
  const [category, setCategory] = useState<FileCategory>(FileCategory.SPECIFICATION);
  const [projectId, setProjectId] = useState(defaultProjectId || (projects[0]?.id ?? ""));
  const [taskId, setTaskId] = useState(defaultTaskId || "");

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setName(file.name);
      setFileSizeKb(Math.round(file.size / 1024));
      setMimeType(file.type || "application/octet-stream");
      // Auto assign sample verified internal CDN link for the asset
      setFileUrl(`https://storage.opspulse.internal/artifacts/${encodeURIComponent(file.name)}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !fileUrl) {
      setError("Asset name and verified URL are required.");
      return;
    }

    setError(null);
    setLoading(true);

    const res = await registerFileAction({
      name,
      fileUrl,
      fileSizeKb: fileSizeKb || 256,
      mimeType: mimeType || "application/pdf",
      category,
      projectId: projectId === "none" || !projectId ? undefined : projectId,
      taskId: taskId || undefined,
    });

    setLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to register file");
      return;
    }

    onOpenChange(false);
    // Reset fields
    setName("");
    setFileUrl("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-none border border-[#141414] bg-white text-[#141414]">
        <DialogHeader className="border-b border-[#141414] pb-3">
          <DialogTitle className="font-mono text-base font-bold uppercase tracking-tight">
            REGISTER OPERATIONAL ASSET
          </DialogTitle>
          <DialogDescription className="font-mono text-xs text-[#141414]/60">
            Attach specification documents, architecture references, contracts, or metric reports.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="p-3 border border-red-600 bg-red-50 text-red-800 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Drag and Drop or Choose File input */}
          <div className="relative border-2 border-dashed border-[#141414]/30 hover:border-[#141414] p-4 text-center cursor-pointer transition-colors bg-zinc-50">
            <input
              type="file"
              onChange={handleSimulatedFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center">
              <UploadCloud className="w-8 h-8 text-[#141414] mb-2" />
              <span className="font-mono text-xs font-bold uppercase text-[#141414]">
                CLICK TO BROWSE OR DRAG ARTIFACT HERE
              </span>
              <span className="font-mono text-[10px] text-[#141414]/60 mt-0.5">
                Auto-fills metadata & verified internal artifact reference
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-xs font-bold uppercase text-[#141414]">
              ASSET / DOCUMENT TITLE <span className="text-[#F27D26]">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Disaster Recovery Plan v2.pdf"
              className="rounded-none border-[#141414] bg-zinc-50 text-xs font-mono"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-xs font-bold uppercase text-[#141414]">
              VERIFIED ARTIFACT URL / STORAGE PATH <span className="text-[#F27D26]">*</span>
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 absolute left-3 top-2.5 text-[#141414]/40" />
              <Input
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://storage.internal/assets/..."
                className="pl-9 text-xs font-mono rounded-none border-[#141414] bg-zinc-50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-mono text-xs font-bold uppercase text-[#141414]">
                CATEGORY
              </label>
              <Select value={category} onValueChange={(v) => setCategory(v as FileCategory)}>
                <SelectTrigger className="rounded-none border-[#141414] bg-zinc-50 text-xs font-mono">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-[#141414] font-mono text-xs">
                  <SelectItem value={FileCategory.SPECIFICATION}>SPECIFICATION</SelectItem>
                  <SelectItem value={FileCategory.ASSET}>ASSET</SelectItem>
                  <SelectItem value={FileCategory.CONTRACT}>CONTRACT</SelectItem>
                  <SelectItem value={FileCategory.REPORT}>REPORT</SelectItem>
                  <SelectItem value={FileCategory.REFERENCE}>REFERENCE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs font-bold uppercase text-[#141414]">
                TARGET WORKSPACE
              </label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger className="rounded-none border-[#141414] bg-zinc-50 text-xs font-mono">
                  <SelectValue placeholder="Project" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-[#141414] font-mono text-xs">
                  <SelectItem value="none">GLOBAL / UNLINKED</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      [{p.code}] {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#141414]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              size="sm"
              variant="default"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  REGISTERING...
                </>
              ) : (
                "SAVE ASSET REFERENCE"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
