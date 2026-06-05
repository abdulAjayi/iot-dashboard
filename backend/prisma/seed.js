import bcrypt from "bcryptjs";
import { prisma } from "./lib/prismaClient.js";

async function main() {
  const hashedPassword = await bcrypt.hash("greenpeg_db", 10);

  await prisma.user.create({
    data: {
      username: "greenpeg_admin",
      password: hashedPassword,
      role: "admin",
      isActive: true,
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
