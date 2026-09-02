"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { taskSchema, TaskInput, updateTaskStatusSchema, assignTaskSchema } from "@/lib/validations/task";
import { Priority, TaskStatus } from "@prisma/client";

export async function createTaskAction(rawInput: TaskInput) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Authentication required to create tasks." };
    }

    const validated = taskSchema.safeParse(rawInput);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues.map((e) => e.message).join(", "),
      };
    }

    const { title, description, projectId, assigneeId, priority, status, dueDate } = validated.data;

    const task = await db.task.create({
      data: {
        title,
        description: description || null,
        projectId,
        assigneeId: assigneeId || null,
        creatorId: user.id,
        priority: priority || Priority.MEDIUM,
        status: status || TaskStatus.TODO,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    await db.activityLog.create({
      data: {
        userId: user.id,
        action: "TASK_CREATED",
        entityType: "Task",
        entityId: task.id,
        details: {
          taskNumber: task.taskNumber,
          title: task.title,
          priority: task.priority,
          status: task.status,
          projectId: task.projectId,
        },
      },
    });

    revalidatePath("/tasks");
    revalidatePath("/dashboard");
    revalidatePath(`/projects/${projectId}`);
    revalidatePath("/activity");

    return { success: true, task };
  } catch (error: any) {
    console.error("createTaskAction error:", error);
    return { success: false, error: error.message || "Failed to create task." };
  }
}

export async function updateTaskStatusAction(id: string, status: TaskStatus) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Authentication required." };
    }

    const validated = updateTaskStatusSchema.safeParse({ id, status });
    if (!validated.success) {
      return { success: false, error: "Invalid task ID or status." };
    }

    const existing = await db.task.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Task not found." };
    }

    const previousStatus = existing.status;
    const updated = await db.task.update({
      where: { id },
      data: { status },
    });

    await db.activityLog.create({
      data: {
        userId: user.id,
        action: "TASK_STATUS_CHANGED",
        entityType: "Task",
        entityId: id,
        details: {
          taskNumber: existing.taskNumber,
          title: existing.title,
          fromStatus: previousStatus,
          toStatus: status,
        },
      },
    });

    revalidatePath("/tasks");
    revalidatePath(`/tasks/${id}`);
    revalidatePath(`/projects/${existing.projectId}`);
    revalidatePath("/dashboard");
    revalidatePath("/activity");

    return { success: true, task: updated };
  } catch (error: any) {
    console.error("updateTaskStatusAction error:", error);
    return { success: false, error: error.message || "Failed to update task status." };
  }
}

export async function assignTaskAction(id: string, assigneeId: string | null) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Authentication required." };
    }

    const validated = assignTaskSchema.safeParse({ id, assigneeId });
    if (!validated.success) {
      return { success: false, error: "Invalid assignee payload." };
    }

    const existing = await db.task.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Task not found." };
    }

    const updated = await db.task.update({
      where: { id },
      data: { assigneeId: assigneeId || null },
    });

    const assignee = assigneeId ? await db.user.findUnique({ where: { id: assigneeId } }) : null;

    await db.activityLog.create({
      data: {
        userId: user.id,
        action: "TASK_ASSIGNED",
        entityType: "Task",
        entityId: id,
        details: {
          taskNumber: existing.taskNumber,
          title: existing.title,
          assignedTo: assignee ? assignee.name : "Unassigned",
        },
      },
    });

    revalidatePath("/tasks");
    revalidatePath(`/tasks/${id}`);
    revalidatePath(`/projects/${existing.projectId}`);
    revalidatePath("/dashboard");

    return { success: true, task: updated };
  } catch (error: any) {
    console.error("assignTaskAction error:", error);
    return { success: false, error: error.message || "Failed to assign task." };
  }
}

export async function deleteTaskAction(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Authentication required." };
    }

    const existing = await db.task.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Task not found." };
    }

    await db.task.delete({ where: { id } });

    await db.activityLog.create({
      data: {
        userId: user.id,
        action: "TASK_DELETED",
        entityType: "Task",
        entityId: id,
        details: {
          taskNumber: existing.taskNumber,
          title: existing.title,
        },
      },
    });

    revalidatePath("/tasks");
    revalidatePath(`/projects/${existing.projectId}`);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: any) {
    console.error("deleteTaskAction error:", error);
    return { success: false, error: error.message || "Failed to delete task." };
  }
}
