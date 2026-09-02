"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { fileSchema, FileInput } from "@/lib/validations/file";

export async function registerFileAction(rawInput: FileInput) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Authentication required to register operational assets." };
    }

    const validated = fileSchema.safeParse(rawInput);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues.map((e) => e.message).join(", "),
      };
    }

    const { name, fileUrl, fileSizeKb, mimeType, category, projectId, taskId } = validated.data;

    const file = await db.fileAsset.create({
      data: {
        name,
        fileUrl,
        fileSizeKb,
        mimeType,
        category,
        projectId: projectId || null,
        taskId: taskId || null,
        uploaderId: user.id,
      },
    });

    await db.activityLog.create({
      data: {
        userId: user.id,
        action: "FILE_UPLOADED",
        entityType: "FileAsset",
        entityId: file.id,
        details: {
          name: file.name,
          category: file.category,
          sizeKb: file.fileSizeKb,
          projectId: file.projectId,
        },
      },
    });

    revalidatePath("/files");
    if (projectId) revalidatePath(`/projects/${projectId}`);
    if (taskId) revalidatePath(`/tasks/${taskId}`);
    revalidatePath("/dashboard");
    revalidatePath("/activity");

    return { success: true, file };
  } catch (error: any) {
    console.error("registerFileAction error:", error);
    return { success: false, error: error.message || "Failed to register file." };
  }
}

export async function deleteFileAction(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Authentication required." };
    }

    const file = await db.fileAsset.delete({ where: { id } });

    await db.activityLog.create({
      data: {
        userId: user.id,
        action: "FILE_DELETED",
        entityType: "FileAsset",
        entityId: id,
        details: {
          name: file.name,
        },
      },
    });

    revalidatePath("/files");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: any) {
    console.error("deleteFileAction error:", error);
    return { success: false, error: error.message || "Failed to delete file." };
  }
}
