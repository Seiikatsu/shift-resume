import { Entity, EntityRepositoryType, Enum, ManyToOne, Property } from '@mikro-orm/postgresql';

import type { JSONValue } from '~/common/json';
import { AbstractBaseEntity } from '~/server/db/entities/abstractBaseEntity';
import type { DbResume } from '~/server/db/entities/dbResume';
import { ResumeSectionType } from '~/server/db/enum/resumeSectionType';
import { ResumeRepository } from '~/server/db/repository/resumeRepository';

@Entity({ tableName: 'resume_sections', repository: () => ResumeRepository })
export class DbResumeSection extends AbstractBaseEntity {
  [EntityRepositoryType]?: ResumeRepository;

  @ManyToOne('DbResume')
  resume!: DbResume;

  @Enum({
    items: () => ResumeSectionType,
    nativeEnumName: 'resume_section_type',
  })
  type!: ResumeSectionType;

  @Property({ type: 'jsonb' })
  content!: JSONValue;
}
