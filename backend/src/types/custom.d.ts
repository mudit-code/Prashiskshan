import { User as PrismaUser, Role as PrismaRole } from '@prisma/client';

declare global {
  namespace Express {
    export interface Request {
      user?: PrismaUser & { role: PrismaRole };
    }
  }
}
