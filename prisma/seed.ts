import { PrismaClient, Role, ProjectStatus, TaskStatus, Priority, FileCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding OpsPulse internal operational database...");

  const passwordHash = await bcrypt.hash("Password123!", 10);

  // 1. Seed Users
  const admin = await prisma.user.upsert({
    where: { email: "admin@opspulse.internal" },
    update: {},
    create: {
      id: "usr_admin_001",
      email: "admin@opspulse.internal",
      name: "Eleanor Vance",
      passwordHash,
      role: Role.ADMIN,
      department: "Operations Leadership",
      avatarUrl: "https://picsum.photos/seed/eleanor/100/100",
      isActive: true,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: "manager@opspulse.internal" },
    update: {},
    create: {
      id: "usr_mgr_002",
      email: "manager@opspulse.internal",
      name: "Marcus Chen",
      passwordHash,
      role: Role.MANAGER,
      department: "Technical Program Mgmt",
      avatarUrl: "https://picsum.photos/seed/marcus/100/100",
      isActive: true,
    },
  });

  const member = await prisma.user.upsert({
    where: { email: "member@opspulse.internal" },
    update: {},
    create: {
      id: "usr_mem_003",
      email: "member@opspulse.internal",
      name: "Sarah Jenkins",
      passwordHash,
      role: Role.MEMBER,
      department: "Infrastructure & Platform",
      avatarUrl: "https://picsum.photos/seed/sarah/100/100",
      isActive: true,
    },
  });

  console.log("Seeded primary users successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
