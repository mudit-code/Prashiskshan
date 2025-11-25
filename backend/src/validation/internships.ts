import { z } from 'zod';

export const createInternshipSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
});

export const updateInternshipSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
});
