import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt, { type JwtPayload, type Secret } from 'jsonwebtoken';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { authMiddleware, requireRole } from './middleware/auth.js';
import crypto from 'crypto';
import { validate } from './middleware/validation.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './validation/auth.js';
import {
  createInternship,
  getEmployerInternships,
  getAllInternships,
  getInternshipById
} from './controllers/internship.controller.js';
import {
  applyForInternship,
  getInternshipApplications,
  updateApplicationStatus,
  getStudentApplications,
  requestNOC
} from './controllers/application.controller.js';
import {
  createInternshipSchema,
  updateInternshipSchema,
} from './validation/internships.js';
import logger from './logger.js';

import studentRoutes from './routes/student.routes.js';
import companyRoutes from './routes/company.routes.js';
import collegeRoutes from './routes/college.routes.js';
import path from 'path';
import fs from 'fs';
import { sendVerificationEmail } from './services/email.service.js';

dotenv.config();

const { JWT_SECRET, REFRESH_TOKEN_SECRET, PORT, NODE_ENV } = process.env;

if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error('Missing JWT secret or refresh token secret in environment variables.');
}

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow loading images from frontend
}));
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use('/api/student', studentRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/college', collegeRoutes);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Increased for testing
  message: { error: 'Too many login attempts, please try again later.' }
});

app.get('/health', (_req: Request, res: Response) => res.json({ ok: true }));

app.post('/auth/register', authLimiter, validate(registerSchema), async (req: Request, res: Response) => {
  const { email, password, name, roleId, collegeName, companyName, aisheCode, collegeWebsite } = req.body;

  try {
    const role = await prisma.role.findUnique({ where: { id: Number(roleId) } });
    if (!role) {
      return res.status(400).json({ error: 'Invalid roleId' });
    }

    // Check for existing user with same email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    // If College Admin (roleId === 3), check for existing college or AISHE code
    if (Number(roleId) === 3) {
      const orConditions: any[] = [{ collegeName: collegeName }];
      if (aisheCode) orConditions.push({ aisheCode: aisheCode });
      if (collegeWebsite) orConditions.push({ collegeWebsite: collegeWebsite });

      const existingCollege = await prisma.user.findFirst({
        where: {
          roleId: 3,
          OR: orConditions
        }
      });

      if (existingCollege) {
        if (existingCollege.collegeName === collegeName) {
          return res.status(400).json({ error: 'A College Admin is already registered for this College Name.' });
        }
        if (aisheCode && existingCollege.aisheCode === aisheCode) {
          return res.status(400).json({ error: 'A College Admin is already registered with this AISHE Code.' });
        }
        if (collegeWebsite && existingCollege.collegeWebsite === collegeWebsite) {
          return res.status(400).json({ error: 'A College Admin is already registered with this College Website.' });
        }
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        roleId: Number(roleId),
        collegeName,
        companyName,
        aisheCode: aisheCode || null, // Ensure empty string becomes null to avoid unique constraint violation
        collegeWebsite,
        emailVerificationToken,
      },
    });

    await sendVerificationEmail(email, emailVerificationToken);
    logger.info('Email verification link generated and sent');
    const { password: _, ...safeUser } = user;
    res.status(201).json({ user: safeUser });

  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Registration failed. Please try again.' });
  }
});

app.get('/auth/verify-email', async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Missing verification token' });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token as string },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
      },
    });

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/auth/login', loginLimiter, validate(loginSchema), async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      return res.status(429).json({ error: 'Account locked. Please try again later.' });
    }

    if (!user.emailVerified) {
      return res.status(401).json({ error: 'Please verify your email address.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const failedAttempts = user.failedLoginAttempts + 1;
      let lockoutUntil = user.lockoutUntil;

      if (failedAttempts >= 5) {
        lockoutUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: failedAttempts,
          lockoutUntil,
        },
      });

      return res.status(401).json({ error: 'Incorrect password.' });
    }

    // Reset failed attempts on successful login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockoutUntil: null,
      },
    });

    const accessToken = jwt.sign({ userId: user.id, role: user.role.name }, JWT_SECRET as Secret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET as Secret, { expiresIn: '7d' });
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ accessToken });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Something went wrong.' });
  }
});

app.post('/auth/refresh', async (req: Request, res: Response) => {
  const { refreshToken: oldRefreshToken } = req.cookies;

  if (!oldRefreshToken) {
    return res.sendStatus(401);
  }

  try {
    const oldTokenHash = crypto.createHash('sha256').update(oldRefreshToken).digest('hex');
    const oldToken = await prisma.refreshToken.findUnique({
      where: { tokenHash: oldTokenHash },
    });

    if (!oldToken || oldToken.revoked || new Date() > oldToken.expiresAt) {
      return res.sendStatus(403);
    }

    await prisma.refreshToken.update({
      where: { id: oldToken.id },
      data: { revoked: true },
    });

    const decoded = jwt.verify(oldRefreshToken, REFRESH_TOKEN_SECRET as Secret) as JwtPayload;
    const { userId } = decoded;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user) {
      return res.sendStatus(403);
    }

    const newAccessToken = jwt.sign({ userId: user.id, role: user.role.name }, JWT_SECRET as Secret, { expiresIn: '15m' });
    const newRefreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET as Secret, { expiresIn: '7d' });
    const newTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: newTokenHash,
        expiresAt,
      },
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    logger.error(err);
    res.sendStatus(403);
  }
});

app.get('/auth/me', authMiddleware, async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        collegeId: true,
        createdAt: true,
      },
    });

    res.json(userWithRole);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/auth/logout', async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await prisma.refreshToken.updateMany({
      where: { tokenHash: tokenHash },
      data: { revoked: true },
    });
  }

  res.clearCookie('refreshToken');
  res.sendStatus(204);
});

app.post('/auth/forgot-password', authLimiter, validate(forgotPasswordSchema), async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour

      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken,
          passwordResetExpires,
        },
      });

      logger.info('Password reset link generated');
    }

    res.json({ message: 'If your email address is registered with us, you will receive a password reset link.' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.post('/auth/reset-password', authLimiter, validate(resetPasswordSchema), async (req: Request, res: Response) => {
  const { token, password } = req.body;

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { gte: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired password reset token.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    await prisma.refreshToken.updateMany({
      where: { userId: user.id },
      data: { revoked: true },
    });

    res.json({ message: 'Password reset successfully.' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.post('/internships', authMiddleware, requireRole('Company', 'Admin'), validate(createInternshipSchema), createInternship);

app.get('/internships', getAllInternships);

app.get('/internships/:id', getInternshipById);

app.put('/internships/:id', authMiddleware, requireRole('Company', 'Admin'), validate(updateInternshipSchema), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const internship = await prisma.internship.update({
      where: { id: Number(id) },
      data: { title, description },
    });
    res.json(internship);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Could not update internship' });
  }
});

app.delete('/internships/:id', authMiddleware, requireRole('Company', 'Admin'), async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.internship.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Could not delete internship' });
  }
});

app.post('/applications', authMiddleware, requireRole('Student'), async (req: Request, res: Response) => {
  const { internshipId } = req.body;
  const { user } = req;

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const internship = await prisma.internship.findUnique({
      where: { id: internshipId },
    });

    if (!internship) {
      return res.status(404).json({ error: 'Internship not found' });
    }

    if (internship.isCreditBased) {
      if (!user.collegeId) {
        return res.status(403).json({ error: 'You must be linked to a college to apply for credit-based internships.' });
      }

      const profile = await prisma.studentProfile.findUnique({
        where: { userId: user.id },
      });

      if (!profile || profile.approvalStatus !== 'Approved') {
        return res.status(403).json({ error: 'Your profile must be approved by your college to apply for credit-based internships.' });
      }
    }

    const application = await prisma.application.create({
      data: {
        internshipId,
        studentId: user.id,
        status: 'Pending',
      },
    });
    res.status(201).json(application);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Could not create application' });
  }
});

app.get('/applications', authMiddleware, requireRole('Student'), async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const applications = await prisma.application.findMany({
      where: { studentId: user.id },
      include: { internship: true },
    });
    res.json(applications);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Could not fetch applications' });
  }
});

app.post('/applications/:applicationId/request-noc', authMiddleware, requireRole('Student'), requestNOC);

app.get('/logbooks', authMiddleware, requireRole('Student'), async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const logbooks = await prisma.logbook.findMany({
      where: { studentId: user.id },
    });
    res.json(logbooks);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Could not fetch logbooks' });
  }
});

app.post('/logbooks', authMiddleware, requireRole('Student'), async (req: Request, res: Response) => {
  const { content } = req.body;
  const { user } = req;

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const logbook = await prisma.logbook.create({
      data: {
        entry: content,
        studentId: user.id,
      },
    });
    res.status(201).json(logbook);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Could not create logbook' });
  }
});

app.delete('/logbooks/:id', authMiddleware, requireRole('Student'), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req;

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const logbook = await prisma.logbook.findUnique({
      where: { id: Number(id) },
    });

    if (!logbook || logbook.studentId !== user.id) {
      return res.status(404).json({ error: 'Logbook not found' });
    }

    await prisma.logbook.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Could not delete logbook' });
  }
});

app.get('/logbooks/:id/export', authMiddleware, requireRole('Student'), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req;

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const logbook = await prisma.logbook.findUnique({
      where: { id: Number(id) },
    });

    if (!logbook || logbook.studentId !== user.id) {
      return res.status(404).json({ error: 'Logbook not found' });
    }

    // PDF export logic here

    res.send('PDF export not implemented');
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Could not export logbook' });
  }
});

app.get('/company/internships', authMiddleware, requireRole('Company'), getEmployerInternships);

app.get('/company/internships/:id/applications', authMiddleware, requireRole('Company'), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req;

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const internship = await prisma.internship.findUnique({
      where: { id: Number(id) },
    });

    if (!internship || internship.postedById !== user.id) {
      return res.status(404).json({ error: 'Internship not found' });
    }

    const applications = await prisma.application.findMany({
      where: { internshipId: Number(id) },
      include: {
        student: {
          include: {
            studentProfile: {
              include: {
                education: true,
                workExperience: true,
                certifications: true,
                socialLinks: true,
                address: true
              }
            }
          }
        }
      },
    });

    res.json(applications);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Could not fetch applications' });
  }
});

app.put('/company/applications/:id', authMiddleware, requireRole('Company'), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const { user } = req;

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const application = await prisma.application.findUnique({
      where: { id: Number(id) },
      include: { internship: true },
    });

    if (!application || application.internship.postedById !== user.id) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const updatedApplication = await prisma.application.update({
      where: { id: Number(id) },
      data: { status },
    });

    res.json(updatedApplication);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Could not update application' });
  }
});

app.get('/company/logbooks/:studentId', authMiddleware, requireRole('Company'), async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const { user } = req;

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Check if the company has accepted an application from this student
    const application = await prisma.application.findFirst({
      where: {
        studentId: Number(studentId),
        internship: {
          postedById: user.id,
        },
        status: 'Accepted',
      },
    });

    if (!application) {
      return res.status(403).json({ error: 'You are not authorized to view these logbooks' });
    }

    const logbooks = await prisma.logbook.findMany({
      where: { studentId: Number(studentId) },
    });

    res.json(logbooks);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Could not fetch logbooks' });
  }
});

app.post('/seed', async (_req: Request, res: Response) => {
  try {
    await prisma.role.createMany({
      data: [{ name: 'Student' }, { name: 'Company' }, { name: 'Admin' }],
    });
    res.status(200).send('Roles seeded');
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Could not seed roles' });
  }
});

app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
  logger.error(err.stack);
  fs.appendFileSync('debug_log.txt', `Global Error: ${err.message}\nStack: ${err.stack}\n`);
  res.status(500).json({ error: err.message || 'Something went wrong' });
});

const port = Number(PORT) || 5000;
app.listen(port, '0.0.0.0', () => logger.info(`Server running on port ${port}`));
