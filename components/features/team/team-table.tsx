"use client";

import React, { useTransition } from "react";
import { User, Role } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Shield, ShieldAlert, ShieldCheck, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { updateUserRoleAction, toggleUserStatusAction } from "@/lib/actions/team";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TeamTableProps {
  users: (User & {
    _count?: {
      assignedTasks: number;
      ledProjects: number;
    };
  })[];
  currentUserId: string;
}

export function TeamTable({ users, currentUserId }: TeamTableProps) {
  const [isPending, startTransition] = useTransition();

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return (
          <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 border border-red-600 bg-red-50 text-red-700">
            <ShieldAlert className="w-3 h-3 text-red-600" />
            ADMIN
          </span>
        );
      case Role.MANAGER:
        return (
          <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 border border-[#141414] bg-[#141414] text-white">
            <ShieldCheck className="w-3 h-3 text-[#F27D26]" />
            MANAGER
          </span>
        );
      case Role.MEMBER:
        return (
          <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase font-medium px-1.5 py-0.5 border border-[#141414]/40 bg-zinc-100 text-[#141414]">
            <Shield className="w-3 h-3 text-[#141414]/60" />
            MEMBER
          </span>
        );
    }
  };

  const handleRoleChange = (userId: string, role: Role) => {
    startTransition(async () => {
      await updateUserRoleAction(userId, role);
    });
  };

  const handleToggleStatus = (userId: string, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleUserStatusAction(userId, !currentStatus);
    });
  };

  return (
    <div className="border border-[#141414] bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>MEMBER PROFILE</TableHead>
            <TableHead className="w-[140px]">DEPARTMENT</TableHead>
            <TableHead className="w-[120px]">ROLE / ACCESS</TableHead>
            <TableHead className="w-[110px]">ACCOUNT STATUS</TableHead>
            <TableHead className="w-[110px]">ASSIGNED WORKLOAD</TableHead>
            <TableHead className="w-[120px]">PROVISIONED</TableHead>
            <TableHead className="w-[60px] text-right">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => {
            const isSelf = u.id === currentUserId;
            return (
              <TableRow key={u.id} className="group hover:bg-[#141414]/5">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <UserAvatar name={u.name} avatarUrl={u.avatarUrl} size="md" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#141414] text-xs">
                          {u.name}
                        </span>
                        {isSelf && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-[#141414] text-white">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#141414]/60 font-mono">{u.email}</span>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="font-mono text-xs text-[#141414]">
                  {u.department || "GENERAL"}
                </TableCell>

                <TableCell>{getRoleBadge(u.role)}</TableCell>

                <TableCell>
                  {u.isActive ? (
                    <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 border border-emerald-700 bg-emerald-50 text-emerald-800">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 border border-zinc-400 bg-zinc-100 text-zinc-600">
                      DEACTIVATED
                    </span>
                  )}
                </TableCell>

                <TableCell className="font-mono text-xs text-[#141414]">
                  <span>{u._count?.assignedTasks ?? 0} tasks</span>
                  {u._count?.ledProjects ? (
                    <span className="block text-[10px] text-[#F27D26] font-bold">
                      {u._count.ledProjects} led
                    </span>
                  ) : null}
                </TableCell>

                <TableCell className="font-mono text-[11px] text-[#141414]/70">
                  {format(new Date(u.createdAt), "MMM dd, yyyy").toUpperCase()}
                </TableCell>

                <TableCell className="text-right">
                  {!isSelf && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          disabled={isPending}
                          className="p-1 border border-[#141414]/20 hover:border-[#141414] hover:bg-zinc-100 text-[#141414] cursor-pointer"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 text-xs font-mono border border-[#141414] rounded-none bg-white p-1">
                        <DropdownMenuLabel className="text-[10px] uppercase text-[#141414]/60">MODIFY ROLE</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleRoleChange(u.id, Role.ADMIN)} className="hover:bg-[#141414] hover:text-white cursor-pointer">
                          ELEVATE TO ADMIN
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(u.id, Role.MANAGER)} className="hover:bg-[#141414] hover:text-white cursor-pointer">
                          SET AS MANAGER
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(u.id, Role.MEMBER)} className="hover:bg-[#141414] hover:text-white cursor-pointer">
                          SET AS MEMBER
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-[#141414]/20" />
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(u.id, u.isActive)}
                          className={u.isActive ? "text-red-600 hover:bg-red-600 hover:text-white cursor-pointer" : "text-emerald-700 hover:bg-emerald-700 hover:text-white cursor-pointer"}
                        >
                          {u.isActive ? "DEACTIVATE ACCOUNT" : "REACTIVATE ACCOUNT"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
