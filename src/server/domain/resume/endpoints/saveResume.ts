import type { JSONValue } from '~/common/json';
import { logger } from '~/common/logger.server';
import { unknownCatchToPayload } from '~/common/unknownCatchToPayload';
import { getEntityManager } from '~/server/db';
import { DbResume } from '~/server/db/entities/dbResume';
import { DbResumeSection } from '~/server/db/entities/DbResumeSection';
import { ResumeSectionType } from '~/server/db/enum/resumeSectionType';
import type { PersonalInformationSection, WorkExperience } from '~/server/domain/resume/dto';

const isNotEmpty = <T extends object>(value?: T): value is T => {
  return value !== undefined && Object.keys(value).length > 0;
};

const createFindOrCreateSection = async () => {
  const em = await getEntityManager();
  const resumeSectionRepository = em.getRepository(DbResumeSection);

  return (resume: DbResume, type: ResumeSectionType, sectionData: JSONValue) => {
    let section = resume.sections.find((section) => section.type === type);
    if (section !== undefined) {
      section.content = sectionData;
    } else {
      section = resumeSectionRepository.create({
        resume,
        type: type,
        content: sectionData,
      });

      resume.sections.add(section);
    }
  };
};

type Input = {
  userId: string;
  resumeId: string;
  personalInformation?: PersonalInformationSection;
  workExperience?: WorkExperience[];
};

type Output = boolean;

export const saveResume = async ({
  userId,
  resumeId,
  personalInformation,
  workExperience,
}: Input): Promise<Output> => {
  const em = await getEntityManager();
  const resumeRepository = em.getRepository(DbResume);
  const findOrCreateSection = await createFindOrCreateSection();

  try {
    const resume = await resumeRepository.findOneOrFail(
      {
        id: resumeId,
        owner: userId,
      },
      {
        populate: ['sections'],
      },
    );

    if (isNotEmpty(personalInformation)) {
      findOrCreateSection(resume, ResumeSectionType.PERSONAL_INFORMATION, personalInformation);
    }

    if (workExperience !== undefined && workExperience.length > 0) {
      const storableExperiences = workExperience.filter(isNotEmpty);
      for (const storableExperience of storableExperiences) {
        findOrCreateSection(resume, ResumeSectionType.WORK_EXPERIENCE, storableExperience);
      }
    }

    return true;
  } catch (e: unknown) {
    logger.error(unknownCatchToPayload(e, 'Error saving resume'));
    return false;
  }
};
