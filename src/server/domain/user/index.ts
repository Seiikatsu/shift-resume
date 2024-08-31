import type {DeepPartial} from 'utility-types';

import {getEntityManager} from '~/server/db';
import {DbUser} from '~/server/db/entities/dbUser';
import {countriesUnion} from '~/server/domain/common/dto/countries';
import {User} from '~/server/domain/user/dto/user';

type Exact<T, U extends T> = T & { [K in keyof U]: K extends keyof T ? U[K] : never };

type OptionalUser = Pick<User, 'id'> & DeepPartial<Omit<User, 'id'>>;

export const userService = {
  getCurrentUser: async () => {
    const userRepository = (await getEntityManager()).getRepository(DbUser);

    const dbUser = await userRepository.findOne({
      email: 'email@example.com',
    });

    if (dbUser === null) {
      throw new Error('User not found');
    }

    return new User({
      id: dbUser.id,
      title: dbUser.title ?? null,
      picture: null,
      firstname: dbUser.firstname,
      lastname: dbUser.lastname,
      birthday: dbUser.birthday,
      email: dbUser.email,
      phone: dbUser.phone ?? null,

      nationality: dbUser.nationality === undefined ? null : countriesUnion.parse(dbUser.nationality),

      address: {
        street: dbUser.streetName,
        postalCode: dbUser.postalCode,
        city: dbUser.city,
        country: countriesUnion.parse(dbUser.country),
      },

      webUrl: null,
    });
  },

  /**
   * Update the given user.
   * All fields except the id are optional, if a field is undefined / not provided it is not updated.
   */
  updateUser: async <T extends Exact<OptionalUser, T>>(user: T) => {
    const userRepository = (await getEntityManager()).getRepository(DbUser);

    await userRepository.nativeUpdate({
      id: user.id
    }, {
      title: user.title,
      firstname: user.firstname,
      lastname: user.lastname,
      birthday: user.birthday,
      email: user.email,
      phone: user.phone,
      nationality: user.nationality,

      streetName: user.address?.street,
      postalCode: user.address?.postalCode,
      city: user.address?.city,
      country: user.address?.country,
    });
  }
};
