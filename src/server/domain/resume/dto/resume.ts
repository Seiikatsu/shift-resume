import { Validated } from 'validated-extendable';
import { z } from 'zod';

const resumeSchema = z.object({
  id: z.string().uuid(),
  owner: z.string().uuid(),

  title: z.string(),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export class Resume extends Validated(resumeSchema) {}
