"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { inviteMemberSchema, InviteMemberInput, updateRoleSchema } from "@/lib/validations/auth";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function inviteMemberAction(rawInput: InviteMemberInput) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Authentication required." };
    }

    if (user.role !== Role.ADMIN) {
      return { success: false, error: "Permission denied: Only workspace Admins can provision new team accounts." };
    }

    const validated = inviteMemberSchema.safeParse(rawInput);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues.map((e) => e.message).join(", "),
      };
    }

    const { name, email, role, department, password } = validated.data;

    const existing = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existing) {
      return { success: false, error: `Account with email ${email} already exists.` };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        role,
        department,
        avatarUrl: `https://picsum.photos/seed/${name}/100/100`,
        isActive: true,
      },
    });

    await db.activityLog.create({
      data: {
        userId: user.id,
        action: "MEMBER_INVITED",
        entityType: "User",
        entityId: newUser.id,
        details: {
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          department: newUser.department,
        },
      },
    });

    revalidatePath("/team");
    revalidatePath("/dashboard");
    revalidatePath("/activity");

    return { success: true, user: newUser };
  } catch (error: any) {
    console.error("inviteMemberAction error:", error);
    return { success: false, error: error.message || "Failed to invite member." };
  }
}

export async function updateUserRoleAction(userId: string, role: Role) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Authentication required." };
    }

    if (user.role !== Role.ADMIN) {
      return { success: false, error: "Permission denied: Only workspace Admins can update roles." };
    }

    const validated = updateRoleSchema.safeParse({ userId, role });
    if (!validated.success) {
      return { success: false, error: "Invalid role update payload." };
    }

    const targetUser = await db.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return { success: false, error: "User not found." };
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: { role },
    });

    await db.activityLog.create({
      data: {
        userId: user.id,
        action: "MEMBER_ROLE_UPDATED",
        entityType: "User",
        entityId: userId,
        details: {
          targetEmail: targetUser.email,
          previousRole: targetUser.role,
          newRole: role,
        },
      },
    });

    revalidatePath("/team");
    revalidatePath("/dashboard");

    return { success: true, user: updated };
  } catch (error: any) {
    console.error("updateUserRoleAction error:", error);
    return { success: false, error: error.message || "Failed to update member role." };
  }
}

export async function toggleUserStatusAction(userId: string, isActive: boolean) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Authentication required." };
    }

    if (user.role !== Role.ADMIN) {
      return { success: false, error: "Permission denied: Only workspace Admins can toggle account status." };
    }

    if (userId === user.id) {
      return { success: false, error: "Cannot deactivate your own active admin account." };
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: { isActive },
    });

    await db.activityLog.create({
      data: {
        userId: user.id,
        action: isActive ? "MEMBER_ACTIVATED" : "MEMBER_DEACTIVATED",
        entityType: "User",
        entityId: userId,
        details: {
          targetEmail: updated.email,
          isActive,
        },
      },
    });

    revalidatePath("/team");

    return { success: true, user: updated };
  } catch (error: any) {
    console.error("toggleUserStatusAction error:", error);
    return { success: false, error: error.message || "Failed to update account status." };
  }
}
