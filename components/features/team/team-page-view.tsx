"use client";

import React, { useState } from "react";
import { User, Role } from "@prisma/client";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { TeamTable } from "./team-table";
import { InviteMemberModal } from "./invite-member-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Search } from "lucide-react";

type UserWithCounts = User & {
  _count?: {
    assignedTasks: number;
    ledProjects: number;
  };
};

interface TeamPageViewProps {
  users: UserWithCounts[];
  currentUser: User;
}

export function TeamPageView({ users, currentUser }: TeamPageViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.department && u.department.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Team Roster & Access" }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-[#141414]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-mono font-bold uppercase tracking-tight text-[#141414]">
              TEAM ROSTER // ACCESS CONTROL
            </h1>
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-[#F27D26] text-white">
              ADMIN ONLY
            </span>
          </div>
          <p className="font-mono text-xs text-[#141414]/60 mt-0.5">
            Provision internal accounts, grant role-based authorizations, and manage operational access.
          </p>
        </div>

        <Button
          size="sm"
          variant="default"
          onClick={() => setModalOpen(true)}
          className="text-xs"
        >
          <UserPlus className="w-3.5 h-3.5 mr-1.5" />
          + PROVISION MEMBER
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 border border-[#141414] shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#141414]/40" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH BY NAME, EMAIL, DEPARTMENT..."
            className="pl-8 h-8 rounded-none border-[#141414] bg-zinc-50 text-xs font-mono placeholder:text-[#141414]/40 focus-visible:ring-[#141414]"
          />
        </div>

        <div className="text-xs text-[#141414]/70 font-mono">
          TOTAL RECORDS: <span className="font-bold text-[#141414]">{filteredUsers.length}</span>
        </div>
      </div>

      {/* Team Table */}
      <TeamTable users={filteredUsers} currentUserId={currentUser.id} />

      {/* Provision Modal */}
      <InviteMemberModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
