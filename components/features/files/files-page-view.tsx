"use client";

import React, { useState } from "react";
import { FileAsset, Project, Task, User, FileCategory } from "@prisma/client";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { FileTable } from "./file-table";
import { FileUploadModal } from "./file-upload-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilePlus, Search } from "lucide-react";

type FileWithRelations = FileAsset & {
  project?: Project | null;
  task?: Task | null;
  uploader: User;
};

interface FilesPageViewProps {
  files: FileWithRelations[];
  projects: Project[];
  currentUser: User;
}

export function FilesPageView({ files, projects, currentUser }: FilesPageViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<string>("all");

  const filteredFiles = files.filter((f) => {
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== "all" && f.category !== selectedCategory) {
      return false;
    }
    if (selectedProject !== "all" && f.projectId !== selectedProject) {
      return false;
    }
    return true;
  });

  const categories = [
    { label: "ALL ASSETS", value: "all" },
    { label: "SPECIFICATIONS", value: FileCategory.SPECIFICATION },
    { label: "ASSETS", value: FileCategory.ASSET },
    { label: "CONTRACTS", value: FileCategory.CONTRACT },
    { label: "REPORTS", value: FileCategory.REPORT },
    { label: "REFERENCES", value: FileCategory.REFERENCE },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "File & Asset Library" }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-[#141414]">
        <div>
          <h1 className="text-xl sm:text-2xl font-mono font-bold uppercase tracking-tight text-[#141414]">
            OPERATIONAL ASSETS // SPECIFICATIONS & DATA
          </h1>
          <p className="font-mono text-xs text-[#141414]/60 mt-0.5">
            Centralized registry for specifications, architecture diagrams, runbooks, and telemetry exports.
          </p>
        </div>

        <Button
          size="sm"
          variant="default"
          onClick={() => setModalOpen(true)}
          className="text-xs"
        >
          <FilePlus className="w-3.5 h-3.5 mr-1.5" />
          + REGISTER ASSET
        </Button>
      </div>

      {/* Category Pills & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 border border-[#141414] shadow-xs">
        {/* Category Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setSelectedCategory(c.value)}
              className={`px-3 py-1 font-mono text-xs font-bold uppercase whitespace-nowrap transition-colors border border-[#141414] cursor-pointer ${
                selectedCategory === c.value
                  ? "bg-[#141414] text-white"
                  : "bg-white text-[#141414] hover:bg-zinc-100"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search & Project Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#141414]/40" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH ASSETS..."
              className="pl-8 h-8 rounded-none border-[#141414] bg-zinc-50 text-xs font-mono placeholder:text-[#141414]/40 focus-visible:ring-[#141414]"
            />
          </div>

          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[160px] h-8 rounded-none border-[#141414] bg-zinc-50 text-xs font-mono">
              <SelectValue placeholder="ALL WORKSPACES" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-[#141414] font-mono text-xs">
              <SelectItem value="all">ALL WORKSPACES</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  [{p.code}] {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Files Table */}
      <FileTable
        files={filteredFiles}
        currentUserId={currentUser.id}
        userRole={currentUser.role}
      />

      {/* File Upload Modal */}
      <FileUploadModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        projects={projects}
      />
    </div>
  );
}
