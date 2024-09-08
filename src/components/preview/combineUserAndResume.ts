import type { ResumeWithoutDates } from '~/server/domain/resume';
import type { User } from '~/server/domain/user/dto/user';
import type { ResumeTemplateData } from '~/templates';

export const combineUserAndResume = (
  { address, id, picture, title, phone, nationality, webUrl, ...user }: User,
  resume: ResumeWithoutDates,
): ResumeTemplateData => {
  return {
    ...resume,
    personalInformation: {
      ...user,
      ...address,
      title: title ?? undefined,
      phone: phone ?? undefined,
      nationality: nationality ?? undefined,
      webUrl: webUrl?.href ?? undefined,
      ...resume.personalInformation,
    },
  };
};
