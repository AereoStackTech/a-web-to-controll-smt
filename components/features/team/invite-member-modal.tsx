"use client";

import React, { useState } from "react";
import { Role } from "@prisma/client";
import { inviteMemberAction } from "@/lib/actions/team";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertCircle } from "lucide-react";

interface InviteMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteMemberModal({ open, onOpenChange }: InviteMemberModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("Operations");
  const [role, setRole] = useState<Role>(Role.MEMBER);
  const [password, setPassword] = useState("Password123!");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await inviteMemberAction({
      name,
      email,
      department: department || "Operations",
      role,
      password,
    });

    setLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to provision member account");
      return;
    }

    onOpenChange(false);
    // reset
    setName("");
    setEmail("");
    setDepartment("Operations");
    setPassword("Password123!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-none border border-[#141414] bg-white text-[#141414]">
        <DialogHeader className="border-b border-[#141414] pb-3">
          <DialogTitle className="font-mono text-base font-bold uppercase tracking-tight">
            PROVISION INTERNAL TEAM MEMBER
          </DialogTitle>
          <DialogDescription className="font-mono text-xs text-[#141414]/60">
            Create an authenticated user account for operational leads and engineers.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="p-3 border border-red-600 bg-red-50 text-red-800 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-mono text-xs font-bold uppercase text-[#141414]">
              FULL NAME <span className="text-[#F27D26]">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Alex Mercer"
              required
              className="rounded-none border-[#141414] bg-zinc-50 text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-xs font-bold uppercase text-[#141414]">
              INTERNAL WORK EMAIL <span className="text-[#F27D26]">*</span>
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@opspulse.internal"
              required
              className="rounded-none border-[#141414] bg-zinc-50 text-xs font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-mono text-xs font-bold uppercase text-[#141414]">
                DEPARTMENT <span className="text-[#F27D26]">*</span>
              </label>
              <Input
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g., DevOps / SRE"
                required
                className="rounded-none border-[#141414] bg-zinc-50 text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs font-bold uppercase text-[#141414]">
                ASSIGNED ROLE
              </label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger className="rounded-none border-[#141414] bg-zinc-50 text-xs font-mono">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-[#141414] font-mono text-xs">
                  <SelectItem value={Role.MEMBER}>MEMBER (EXECUTION)</SelectItem>
                  <SelectItem value={Role.MANAGER}>MANAGER (LEAD)</SelectItem>
                  <SelectItem value={Role.ADMIN}>ADMIN (FULL CONTROL)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-xs font-bold uppercase text-[#141414]">
              INITIAL PASSWORD <span className="text-[#F27D26]">*</span>
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              required
              className="rounded-none border-[#141414] bg-zinc-50 text-xs font-mono"
            />
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
                  PROVISIONING...
                </>
              ) : (
                "+ PROVISION ACCOUNT"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
