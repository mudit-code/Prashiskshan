import { User as PrismaUser, Role } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: PrismaUser & { role: Role };
    }
  }
}
