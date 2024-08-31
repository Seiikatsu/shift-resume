import {Collection, Entity, EntityRepositoryType, OneToMany, Property} from '@mikro-orm/postgresql';

import {AbstractBaseEntity} from '~/server/db/entities/abstractBaseEntity';
import {DbResume} from '~/server/db/entities/dbResume';
import {UserRepository} from '~/server/db/repository/userRepository';

@Entity({tableName: 'users', repository: () => UserRepository})
export class DbUser extends AbstractBaseEntity {
  [EntityRepositoryType]?: UserRepository;

  @Property({type: 'varchar', length: 256, nullable: true})
  title?: string;

  @Property({type: 'varchar', length: 256})
  firstname!: string;

  @Property({type: 'varchar', length: 256})
  lastname!: string;

  @Property({type: 'varchar', length: 256})
  birthday!: string;

  @Property({type: 'varchar', length: 256, nullable: true})
  nationality?: string;

  @Property({type: 'varchar', length: 256, nullable: true})
  phone?: string;

  @Property({type: 'varchar', length: 256, unique: true, index: true})
  email!: string;

  @Property({type: 'varchar', length: 256})
  streetName!: string;

  @Property({type: 'varchar', length: 256})
  postalCode!: string;

  @Property({type: 'varchar', length: 256})
  city!: string;

  @Property({type: 'varchar', length: 256})
  country!: string;

  @OneToMany(() => DbResume, resume => resume.owner)
  resumes = new Collection<DbResume>(this);
}
