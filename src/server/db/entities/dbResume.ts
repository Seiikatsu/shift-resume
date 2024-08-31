import {Entity, EntityRepositoryType, ManyToOne, Property} from '@mikro-orm/postgresql';

import {AbstractBaseEntity} from '~/server/db/entities/abstractBaseEntity';
import type {DbUser} from '~/server/db/entities/dbUser';
import {ResumeRepository} from '~/server/db/repository/resumeRepository';

@Entity({tableName: 'resumes', repository: () => ResumeRepository})
export class DbResume extends AbstractBaseEntity {
  [EntityRepositoryType]?: ResumeRepository;

  @Property({type: 'varchar', length: 256, unique: true, index: true})
  title!: string;

  @ManyToOne('DbUser')
  owner!: DbUser;
}
