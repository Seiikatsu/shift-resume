import { z } from 'zod';

import { personalInformationSection } from '~/server/domain/resume/dto/personalInformationSection';
import { workExperience } from '~/server/domain/resume/dto/workExperience';

export const resumeMetadataSchema = z.object({
  id: z.string().uuid(),
  owner: z.string().uuid(),

  title: z.string(),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type ResumeMetadata = z.infer<typeof resumeMetadataSchema>;

export const resumeSchema = resumeMetadataSchema.extend({
  id: z.string().uuid(),
  owner: z.string().uuid(),

  title: z.string(),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),

  personalInformation: personalInformationSection.nullable(),
  workExperience: z.array(workExperience).nullable(),
});

export type Resume = z.infer<typeof resumeSchema>;

export type ResumeWithoutDates = Omit<Resume, 'createdAt' | 'updatedAt'>;
