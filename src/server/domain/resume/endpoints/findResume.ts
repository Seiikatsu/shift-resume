import type { JSONValue } from '~/common/json';
import { logger } from '~/common/logger.server';
import { computeIfAbsent } from '~/common/mapUtils';
import { unknownCatchToPayload } from '~/common/unknownCatchToPayload';
import { getEntityManager } from '~/server/db';
import { DbResume } from '~/server/db/entities/dbResume';
import type { DbResumeSection } from '~/server/db/entities/DbResumeSection';
import { ResumeSectionType } from '~/server/db/enum/resumeSectionType';
import type { Resume } from '~/server/domain/resume/dto';
import { resumeSchema } from '~/server/domain/resume/dto';

type Input = {
  userId: string;
  resumeId: string;
};

type Output = Resume | null;

const getWithLimitOfThrow = (
  map: Map<ResumeSectionType, DbResumeSection[]>,
  key: ResumeSectionType,
  limit?: number,
): JSONValue[] | null => {
  const value = map.get(key);
  if (value === undefined) {
    return null;
  }

  if (limit !== undefined && value.length > limit) {
    throw new Error(`Limit of ${limit} exceeded for key ${key}`);
  }

  return value.map((section) => section.content);
};

export const findResume = async ({ userId, resumeId }: Input): Promise<Output> => {
  const resumeRepository = (await getEntityManager()).getRepository(DbResume);

  try {
    const dbResume = await resumeRepository.findOneOrFail(
      {
        id: resumeId,
        owner: userId,
      },
      {
        populate: ['sections'],
      },
    );

    const sectionMap = dbResume.sections.reduce((acc, section) => {
      computeIfAbsent(acc, section.type, () => []).push(section);
      return acc;
    }, new Map<ResumeSectionType, DbResumeSection[]>());

    const personalInformation =
      getWithLimitOfThrow(sectionMap, ResumeSectionType.PERSONAL_INFORMATION, 1)?.[0] ?? null;

    return resumeSchema.parse({
      id: dbResume.id,
      title: dbResume.title,
      owner: dbResume.owner.id,
      createdAt: dbResume.createdAt,
      updatedAt: dbResume.updatedAt,
      personalInformation: personalInformation,
      workExperience: getWithLimitOfThrow(sectionMap, ResumeSectionType.WORK_EXPERIENCE),
    });
  } catch (e: unknown) {
    logger.error(unknownCatchToPayload(e, 'Could not load resume'));
    return null;
  }
};
