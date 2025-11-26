import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  roleId: z.number(),
  collegeName: z.string().optional(),
  companyName: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.roleId === 2 && !data.companyName) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Company Name is required for Employer role",
      path: ["companyName"],
    });
  }
  if (data.roleId === 3 && !data.collegeName) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "College Name is required for College Admin role",
      path: ["collegeName"],
    });
  }
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});
