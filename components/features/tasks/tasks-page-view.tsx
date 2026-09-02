"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Task, Project, User, TaskStatus, Priority } from "@prisma/client";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { TaskBoard } from "./task-board";
import { TaskTable } from "./task-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, LayoutGrid, List, Search } from "lucide-react";

type TaskWithRelations = Task & {
  project?: {
    id: string;
    title: string;
    code: string;
    description?: string | null;
  } | null;
  assignee?: User | null;
};

interface TasksPageViewProps {
  tasks: TaskWithRelations[];
  projects: Project[];
  users: User[];
  currentUserId: string;
}

export function TasksPageView({
  tasks,
  projects,
  users,
  currentUserId,
}: TasksPageViewProps) {
  const [viewMode, setViewMode] = useState<"board" | "table">("board");
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("all");

  const filteredTasks = tasks.filter((task) => {
    if (search && !task.title.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (selectedProject !== "all" && task.projectId !== selectedProject) {
      return false;
    }
    if (selectedPriority !== "all" && task.priority !== selectedPriority) {
      return false;
    }
    if (selectedAssignee === "me" && task.assigneeId !== currentUserId) {
      return false;
    }
    if (
      selectedAssignee !== "all" &&
      selectedAssignee !== "me" &&
      task.assigneeId !== selectedAssignee
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Task Operations" }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-[#141414]">
        <div>
          <h1 className="text-xl sm:text-2xl font-mono font-bold uppercase tracking-tight text-[#141414]">
            TASK OPERATIONS & EXECUTION GRID
          </h1>
          <p className="font-mono text-xs text-[#141414]/60 mt-0.5">
            Cross-functional workload distribution, status progression, and accountability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/tasks/new">
            <Button size="sm" variant="default" className="text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" />
              + NEW TASK
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters Bar & View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 border border-[#141414] shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#141414]/40" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH BY TITLE..."
              className="pl-8 h-8 rounded-none border-[#141414] bg-zinc-50 text-xs font-mono placeholder:text-[#141414]/40 focus-visible:ring-[#141414]"
            />
          </div>

          {/* Project Filter */}
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[160px] h-8 rounded-none border-[#141414] bg-zinc-50 text-xs font-mono">
              <SelectValue placeholder="ALL PROJECTS" />
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

          {/* Priority Filter */}
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-[140px] h-8 rounded-none border-[#141414] bg-zinc-50 text-xs font-mono">
              <SelectValue placeholder="ALL PRIORITIES" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-[#141414] font-mono text-xs">
              <SelectItem value="all">ALL PRIORITIES</SelectItem>
              <SelectItem value={Priority.URGENT}>URGENT</SelectItem>
              <SelectItem value={Priority.HIGH}>HIGH</SelectItem>
              <SelectItem value={Priority.MEDIUM}>MEDIUM</SelectItem>
              <SelectItem value={Priority.LOW}>LOW</SelectItem>
            </SelectContent>
          </Select>

          {/* Assignee Filter */}
          <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
            <SelectTrigger className="w-[150px] h-8 rounded-none border-[#141414] bg-zinc-50 text-xs font-mono">
              <SelectValue placeholder="ASSIGNEE" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-[#141414] font-mono text-xs">
              <SelectItem value="all">ALL ASSIGNEES</SelectItem>
              <SelectItem value="me">ASSIGNED TO ME</SelectItem>
              {users.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 border border-[#141414] bg-white p-0.5 shrink-0">
          <button
            onClick={() => setViewMode("board")}
            className={`px-2.5 py-1 text-xs font-mono font-bold uppercase flex items-center gap-1 transition-colors cursor-pointer ${
              viewMode === "board"
                ? "bg-[#141414] text-white"
                : "text-[#141414] hover:bg-zinc-100"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>BOARD</span>
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`px-2.5 py-1 text-xs font-mono font-bold uppercase flex items-center gap-1 transition-colors cursor-pointer ${
              viewMode === "table"
                ? "bg-[#141414] text-white"
                : "text-[#141414] hover:bg-zinc-100"
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>TABLE</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div>
        {viewMode === "board" ? (
          <TaskBoard tasks={filteredTasks as any} />
        ) : (
          <TaskTable tasks={filteredTasks as any} showProject={true} />
        )}
      </div>
    </div>
  );
}
