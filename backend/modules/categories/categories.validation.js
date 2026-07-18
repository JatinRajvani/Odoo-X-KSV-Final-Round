import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    status: z.boolean().optional(),
  })
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    description: z.string().optional(),
    status: z.boolean().optional(),
  })
});
