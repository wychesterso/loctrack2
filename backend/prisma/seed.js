const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function main() {
  const passwordHash = await bcrypt.hash("pw1234", 10);
  await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      password: passwordHash,
    },
  });
}

main().finally(() => prisma.$disconnect());
