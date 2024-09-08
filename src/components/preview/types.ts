import type { ResumeWithoutDates } from '~/server/domain/resume';
import type { User } from '~/server/domain/user/dto/user';

export type ResumePreviewProps = {
  user: User;
  resume: ResumeWithoutDates;
};
