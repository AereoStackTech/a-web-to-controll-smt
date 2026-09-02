"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { FileAsset, Project, Task, User, FileCategory } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserAvatar } from "@/components/shared/user-avatar";
import {
  FileText,
  Download,
  ExternalLink,
  Trash2,
  FileCode,
  FileSpreadsheet,
  FileImage,
  Archive,
} from "lucide-react";
import { format } from "date-fns";
import { deleteFileAction } from "@/lib/actions/file";

type FileWithRelations = FileAsset & {
  project?: Project | null;
  task?: Task | null;
  uploader: User;
};

interface FileTableProps {
  files: FileWithRelations[];
  currentUserId?: string;
  userRole?: string;
}

export function FileTable({ files, currentUserId, userRole }: FileTableProps) {
  const [isPending, startTransition] = useTransition();

  const getCategoryBadge = (cat: FileCategory) => {
    switch (cat) {
      case FileCategory.SPECIFICATION:
        return <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 border border-[#141414] bg-[#141414] text-white">SPEC</span>;
      case FileCategory.ASSET:
        return <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 border border-sky-700 bg-sky-50 text-sky-800">ASSET</span>;
      case FileCategory.CONTRACT:
        return <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 border border-amber-600 bg-amber-50 text-amber-800">CONTRACT</span>;
      case FileCategory.REPORT:
        return <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 border border-emerald-700 bg-emerald-50 text-emerald-800">REPORT</span>;
      case FileCategory.REFERENCE:
        return <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 border border-purple-700 bg-purple-50 text-purple-800">REF</span>;
      default:
        return <span className="font-mono text-[10px] uppercase font-medium px-1.5 py-0.5 border border-[#141414]/30 bg-zinc-100 text-[#141414]">GEN</span>;
    }
  };

  const getFileIcon = (mime?: string | null) => {
    if (!mime) return <FileText className="w-4 h-4 text-[#141414]" />;
    if (mime.includes("pdf")) return <FileText className="w-4 h-4 text-red-600" />;
    if (mime.includes("sheet") || mime.includes("csv"))
      return <FileSpreadsheet className="w-4 h-4 text-emerald-700" />;
    if (mime.includes("json") || mime.includes("yaml") || mime.includes("markdown"))
      return <FileCode className="w-4 h-4 text-[#141414]" />;
    if (mime.includes("image")) return <FileImage className="w-4 h-4 text-[#F27D26]" />;
    if (mime.includes("zip") || mime.includes("tar"))
      return <Archive className="w-4 h-4 text-purple-700" />;
    return <FileText className="w-4 h-4 text-[#141414]" />;
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete file "${name}"?`)) return;
    startTransition(async () => {
      await deleteFileAction(id);
    });
  };

  if (files.length === 0) {
    return (
      <div className="border border-[#141414] bg-white p-8 text-center font-mono text-xs text-[#141414]/60">
        NO OPERATIONAL ASSETS REGISTERED IN WORKSPACE.
      </div>
    );
  }

  return (
    <div className="border border-[#141414] bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ASSET NAME</TableHead>
            <TableHead className="w-[120px]">CATEGORY</TableHead>
            <TableHead className="w-[160px]">PROJECT</TableHead>
            <TableHead className="w-[90px]">SIZE</TableHead>
            <TableHead className="w-[140px]">UPLOADED BY</TableHead>
            <TableHead className="w-[110px]">TIMESTAMP</TableHead>
            <TableHead className="w-[90px] text-right">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id} className="group hover:bg-[#141414]/5">
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 border border-[#141414]/20 bg-zinc-50 shrink-0">
                    {getFileIcon(file.mimeType)}
                  </div>
                  <div>
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-xs text-[#141414] hover:text-[#F27D26] flex items-center gap-1.5 transition-colors"
                    >
                      <span>{file.name}</span>
                      <ExternalLink className="w-3 h-3 text-[#141414]/40" />
                    </a>
                    {file.task && (
                      <span className="font-mono text-[10px] text-[#141414]/50 block">
                        LINKED: #{file.task.taskNumber} {file.task.title}
                      </span>
                    )}
                  </div>
                </div>
              </TableCell>

              <TableCell>{getCategoryBadge(file.category)}</TableCell>

              <TableCell className="font-mono text-xs">
                {file.project ? (
                  <Link
                    href={`/projects/${file.project.id}`}
                    className="font-semibold text-[#141414] hover:underline"
                  >
                    [{file.project.code}] {file.project.title}
                  </Link>
                ) : (
                  <span className="text-[#141414]/40">—</span>
                )}
              </TableCell>

              <TableCell className="font-mono text-xs text-[#141414]/70">
                {file.fileSizeKb ? `${file.fileSizeKb} KB` : "—"}
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <UserAvatar
                    name={file.uploader.name}
                    avatarUrl={file.uploader.avatarUrl}
                    size="sm"
                  />
                  <span className="text-xs font-medium text-[#141414] truncate max-w-[100px]">
                    {file.uploader.name}
                  </span>
                </div>
              </TableCell>

              <TableCell className="font-mono text-[11px] text-[#141414]/70">
                {format(new Date(file.createdAt), "MMM dd, yyyy").toUpperCase()}
              </TableCell>

              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 border border-[#141414]/20 hover:border-[#141414] hover:bg-[#141414] hover:text-white text-[#141414] transition-colors"
                    title="Open / Download Asset"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                  {(userRole === "ADMIN" || file.uploaderId === currentUserId) && (
                    <button
                      onClick={() => handleDelete(file.id, file.name)}
                      disabled={isPending}
                      className="p-1 border border-red-200 hover:border-red-600 hover:bg-red-600 hover:text-white text-red-600 transition-colors cursor-pointer"
                      title="Delete Asset Reference"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
