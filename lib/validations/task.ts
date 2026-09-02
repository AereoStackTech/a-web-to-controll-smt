import { z } from "zod";
import { Priority, TaskStatus } from "@prisma/client";

export const taskSchema = z.object({
  title: z.string().min(3, "Task title must be at least 3 characters").max(150, "Title is too long"),
  description: z.string().optional().nullable(),
  projectId: z.string().min(1, "Project selection is required"),
  assigneeId: z.string().optional().nullable(),
  priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
  dueDate: z.string().optional().nullable(),
});

export type TaskInput = z.infer<typeof taskSchema>;

export const updateTaskStatusSchema = z.object({
  id: z.string().min(1, "Task ID is required"),
  status: z.nativeEnum(TaskStatus),
});

export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;

export const assignTaskSchema = z.object({
  id: z.string().min(1, "Task ID is required"),
  assigneeId: z.string().nullable(),
});

export type AssignTaskInput = z.infer<typeof assignTaskSchema>;
