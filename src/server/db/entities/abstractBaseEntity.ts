import {OptionalProps, PrimaryKey, Property} from '@mikro-orm/postgresql';
import {v7} from 'uuid';

export abstract class AbstractBaseEntity/*<Entity extends object, Optional extends keyof Entity = never>*/ {
  [OptionalProps]?: /*Optional | */'createdAt' | 'updatedAt';

  @PrimaryKey({type: 'uuid'})
  id = v7();

  @Property({type: 'timestamp', hidden: true})
  createdAt = new Date();

  @Property({type: 'timestamp', hidden: true, onUpdate: () => new Date()})
  updatedAt = new Date();

  @Property({type: 'timestamp', hidden: true, nullable: true})
  deletedAt?: Date;
}
