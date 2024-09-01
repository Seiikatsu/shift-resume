import {
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/postgresql';

import { AbstractBaseEntity } from '~/server/db/entities/abstractBaseEntity';
import { DbResumeSection } from '~/server/db/entities/DbResumeSection';
import type { DbUser } from '~/server/db/entities/dbUser';
import { ResumeRepository } from '~/server/db/repository/resumeRepository';

@Entity({ tableName: 'resumes', repository: () => ResumeRepository })
export class DbResume extends AbstractBaseEntity {
  [EntityRepositoryType]?: ResumeRepository;

  @Property({ type: 'varchar', length: 256, unique: true, index: true })
  title!: string;

  @ManyToOne('DbUser')
  owner!: DbUser;

  @OneToMany(() => DbResumeSection, (section) => section.resume)
  sections = new Collection<DbResumeSection>(this);
}
