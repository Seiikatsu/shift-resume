import type {EntityManager} from '@mikro-orm/postgresql';
import {Seeder} from '@mikro-orm/seeder';

import {DbResume} from '~/server/db/entities/dbResume';
import {DbUser} from '~/server/db/entities/dbUser';

export class DevSeeder extends Seeder {

  run(em: EntityManager) {
    const user = em.getRepository(DbUser).create({
      title: null,
      firstname: 'Dev',
      lastname: 'User',

      birthday: '1999-10-14',

      phone: '+49 1234 1234 1234',
      email: 'email@example.com',

      // TODO (feature): Union?
      nationality: 'DE',

      streetName: 'Musterstraße 123',
      postalCode: '12345',
      city: 'Musterstadt',
      country: 'DE',
    });

    em.getRepository(DbResume).create({
      title: 'Example Resume',
      owner: user,
    });
  }
}
