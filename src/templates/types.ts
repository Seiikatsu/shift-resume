import type { ComponentType } from 'react';

import type { GetRequiredKeys, RequiredByKeys } from '~/common/types';
import type { ResumeWithoutDates } from '~/server/domain/resume';
import type { User } from '~/server/domain/user/dto/user';

// TODO(improvement): it would help if user and resume have a similar structure here - might refactor it?
type MandatoryUserKeys = Exclude<GetRequiredKeys<User>, 'id' | 'address'>;
type MandatoryAddressKeys = GetRequiredKeys<User['address']>;

type RequiredUserKeys = MandatoryUserKeys | MandatoryAddressKeys;

type PersonalInfo = Exclude<ResumeWithoutDates['personalInformation'], null>;

type PersonalInformation = RequiredByKeys<PersonalInfo, RequiredUserKeys>;

// TODO(typing): a bit hacky, not working perfectly - improve it
export type ResumeTemplateData = Omit<ResumeWithoutDates, 'personalInformation'> & {
  // TODO(feat): this won't work on a long run - we also need information like labels, etc.
  personalInformation: PersonalInformation;
};

export type ResumeTemplate = {
  id: string;
  displayName: string;

  component: ComponentType<ResumeTemplateData>;
};
