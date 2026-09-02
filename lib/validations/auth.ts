import { z } from "zod";
import { Role } from "@prisma/client";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid work email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const inviteMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid work email address"),
  role: z.nativeEnum(Role),
  department: z.string().min(2, "Department is required"),
  password: z.string().min(6, "Initial password must be at least 6 characters"),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;

export const updateRoleSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.nativeEnum(Role),
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
