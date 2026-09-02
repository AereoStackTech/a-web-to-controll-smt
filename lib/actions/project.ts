"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { projectSchema, ProjectInput, updateProjectStatusSchema } from "@/lib/validations/project";
import { ProjectStatus, Role } from "@prisma/client";

export async function createProjectAction(rawInput: ProjectInput) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Authentication required to initiate project." };
    }

    if (user.role !== Role.ADMIN && user.role !== Role.MANAGER) {
      return { success: false, error: "Permission denied: Only Admin and Manager roles can create operational projects." };
    }

    const validated = projectSchema.safeParse(rawInput);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues.map((e) => e.message).join(", "),
      };
    }

    const { title, code, description, status, startDate, targetDate, leadId } = validated.data;

    // Check if code already exists
    const existing = await db.project.findUnique({
      where: { code },
    });
    if (existing) {
      return { success: false, error: `Project code "${code}" is already assigned to another project.` };
    }

    const project = await db.project.create({
      data: {
        title,
        code,
        description,
        status,
        startDate: startDate ? new Date(startDate) : null,
        targetDate: targetDate ? new Date(targetDate) : null,
        leadId,
      },
    });

    // Record Activity Log
    await db.activityLog.create({
      data: {
        userId: user.id,
        action: "PROJECT_CREATED",
        entityType: "Project",
        entityId: project.id,
        details: {
          code: project.code,
          title: project.title,
          leadId: project.leadId,
          status: project.status,
        },
      },
    });

    revalidatePath("/projects");
    revalidatePath("/dashboard");
    revalidatePath("/activity");

    return { success: true, project };
  } catch (error: any) {
    console.error("createProjectAction error:", error);
    return { success: false, error: error.message || "Failed to create project." };
  }
}

export async function updateProjectStatusAction(id: string, status: ProjectStatus) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Authentication required." };
    }

    if (user.role !== Role.ADMIN && user.role !== Role.MANAGER) {
      return { success: false, error: "Permission denied: Only Admin and Manager can update project status." };
    }

    const validated = updateProjectStatusSchema.safeParse({ id, status });
    if (!validated.success) {
      return { success: false, error: "Invalid status or ID." };
    }

    const project = await db.project.findUnique({ where: { id } });
    if (!project) {
      return { success: false, error: "Project not found." };
    }

    const previousStatus = project.status;
    const updated = await db.project.update({
      where: { id },
      data: { status },
    });

    // Record Activity Log
    await db.activityLog.create({
      data: {
        userId: user.id,
        action: "PROJECT_STATUS_CHANGED",
        entityType: "Project",
        entityId: id,
        details: {
          code: project.code,
          title: project.title,
          fromStatus: previousStatus,
          toStatus: status,
        },
      },
    });

    revalidatePath("/projects");
    revalidatePath(`/projects/${id}`);
    revalidatePath("/dashboard");
    revalidatePath("/activity");

    return { success: true, project: updated };
  } catch (error: any) {
    console.error("updateProjectStatusAction error:", error);
    return { success: false, error: error.message || "Failed to update status." };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Authentication required." };
    }

    if (user.role !== Role.ADMIN) {
      return { success: false, error: "Permission denied: Only workspace Admins can delete projects." };
    }

    const project = await db.project.findUnique({ where: { id } });
    if (!project) {
      return { success: false, error: "Project not found." };
    }

    await db.project.delete({ where: { id } });

    await db.activityLog.create({
      data: {
        userId: user.id,
        action: "PROJECT_DELETED",
        entityType: "Project",
        entityId: id,
        details: {
          code: project.code,
          title: project.title,
        },
      },
    });

    revalidatePath("/projects");
    revalidatePath("/dashboard");
    revalidatePath("/tasks");
    revalidatePath("/files");

    return { success: true };
  } catch (error: any) {
    console.error("deleteProjectAction error:", error);
    return { success: false, error: error.message || "Failed to delete project." };
  }
}
