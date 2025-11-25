import { PrismaClient } from '@prisma/client';
import logger from '../src/logger.js';

const prisma = new PrismaClient();

async function main() {
  try {
    const studentRole = await prisma.role.upsert({
      where: { name: 'Student' },
      update: {},
      create: { name: 'Student' },
    });

    const companyRole = await prisma.role.upsert({
      where: { name: 'Company' },
      update: {},
      create: { name: 'Company' },
    });

    const adminRole = await prisma.role.upsert({
      where: { name: 'Admin' },
      update: {},
      create: { name: 'Admin' },
    });

    logger.info({ studentRole, companyRole, adminRole });
  } catch (e) {
    logger.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
