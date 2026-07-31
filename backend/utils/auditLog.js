import { prisma } from "../prisma/lib/prismaClient.js";
export async function createAuditLog({ userId, action, ipAddress, metadata }) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId ?? null,
        action,
        ipAddress: ipAddress ?? null,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  } catch (error) {
    // never let audit logging crash your main app
    console.error("Audit log failed:", error.message);
  }
}