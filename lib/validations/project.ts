import { z } from "zod";
import { ProjectStatus } from "@prisma/client";

export const projectSchema = z.object({
  title: z.string().min(3, "Project title must be at least 3 characters").max(100, "Title is too long"),
  code: z
    .string()
    .min(2, "Project code must be at least 2 characters")
    .max(16, "Project code cannot exceed 16 characters")
    .regex(/^[A-Za-z0-9-_]+$/, "Code must contain only letters, numbers, hyphens, or underscores")
    .transform((v) => v.toUpperCase()),
  description: z.string().min(5, "Project description must be at least 5 characters"),
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.PLANNING),
  startDate: z.string().optional().nullable(),
  targetDate: z.string().optional().nullable(),
  leadId: z.string().min(1, "Project lead must be selected"),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export const updateProjectStatusSchema = z.object({
  id: z.string().min(1, "Project ID is required"),
  status: z.nativeEnum(ProjectStatus),
});

export type UpdateProjectStatusInput = z.infer<typeof updateProjectStatusSchema>;
