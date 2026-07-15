import { prisma } from "@/lib/prisma";

export async function logAction(
  user: string,
  action: string
) {
  await prisma.auditLog.create({
    data: {
      user,
      action,
    },
  });
}