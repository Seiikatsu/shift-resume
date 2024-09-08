import { IconUser } from '@tabler/icons-react';
import { DateTime } from 'luxon';
import type { FC } from 'react';

import {
  FormCheckboxField,
  FormDateField,
  FormInputField,
  FormLanguageSelectField,
  FormTextareaField,
} from '~/components/form';
import { ResumeSection } from '~/components/resume-edit/resumeSection';
import type { PersonalInformationSectionProps } from '~/components/resume-edit/types';
import { Avatar, AvatarFallback } from '~/components/shadcn/avatar';

export const PersonalInformationSection: FC<PersonalInformationSectionProps> = ({ user }) => {
  return (
    <ResumeSection
      titleMessageId="resume-edit.section.personal-information.section-title"
      icon={IconUser}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 grid grid-cols-[120px_1fr_1fr] gap-4">
          <div className="row-span-2 flex flex-col gap-2 self-center">
            <Avatar className="h-[110px] w-[110px]">
              <AvatarFallback>MP</AvatarFallback>
            </Avatar>
            <FormCheckboxField
              i18nLabel="resume-edit.section.personal-information.field.show-avatar.label"
              name="personalInformation.showAvatar"
            />
          </div>
          <FormInputField
            i18nLabel="resume-edit.section.personal-information.field.title.label"
            name="personalInformation.title"
            placeholder={user.title ?? undefined}
          />
          <div />
          <FormInputField
            i18nLabel="resume-edit.section.personal-information.field.firstname.label"
            name="personalInformation.firstname"
            placeholder={user.firstname}
          />
          <FormInputField
            name="personalInformation.lastname"
            i18nLabel="resume-edit.section.personal-information.field.lastname.label"
            placeholder={user.lastname}
          />
        </div>

        <FormDateField
          name="personalInformation.birthday"
          i18nLabel="resume-edit.section.personal-information.field.birthday.label"
          placeholder={DateTime.fromFormat(user.birthday, 'yyyy-MM-dd').toISODate() ?? undefined}
        />
        <FormLanguageSelectField
          name="personalInformation.nationality"
          i18nLabel="resume-edit.section.personal-information.field.nationality.label"
          placeholder={user.nationality ?? undefined}
        />
        <FormInputField
          name="personalInformation.street"
          i18nLabel="resume-edit.section.personal-information.field.street.label"
          placeholder={user.address.street}
        />
        <FormInputField
          name="personalInformation.city"
          placeholder={user.address.city}
          className="self-end"
        />
        <FormInputField
          name="personalInformation.postalCode"
          placeholder={user.address.postalCode}
        />
        <FormLanguageSelectField
          name="personalInformation.country"
          placeholder={user.address.country}
        />

        <FormInputField
          name="personalInformation.webUrl"
          i18nLabel="resume-edit.section.personal-information.field.web-url.label"
          placeholder={user.webUrl?.href}
          className="col-span-2"
        />

        <FormTextareaField
          name="personalInformation.description"
          i18nLabel="resume-edit.section.personal-information.field.description.label"
          className="col-span-2"
        />
      </div>
    </ResumeSection>
  );
};
