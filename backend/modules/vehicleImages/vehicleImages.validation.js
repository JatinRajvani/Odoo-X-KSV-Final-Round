import { z } from 'zod';
export const uploadImageSchema = z.object({
  body: z.object({
    isPrimary: z.string().transform(v => v === 'true').optional()
  })
});
