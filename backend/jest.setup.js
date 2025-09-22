const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

beforeEach(async () => {
  // clean all tables
  await prisma.share.deleteMany();
  await prisma.location.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

global.prisma = prisma;
