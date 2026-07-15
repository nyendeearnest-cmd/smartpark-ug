import { prisma } from "@/lib/prisma";

export async function logAction(
  user: string,
  action: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        user,
        action,
      },
    });
  } catch (error) {
    console.error("Audit Log Error:", error);
  }
}