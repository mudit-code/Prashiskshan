import { type Request, type Response, type NextFunction } from 'express';
import { type z, ZodError } from 'zod';

export const validate = (schema: z.ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};
