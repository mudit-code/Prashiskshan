import { type Request, type Response, type NextFunction } from 'express';
import jwt, { type JwtPayload, type Secret } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const { JWT_SECRET } = process.env;
const prisma = new PrismaClient();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as Secret) as JwtPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export const requireRole = (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role.name)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};
