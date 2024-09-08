import { IconBriefcase2, IconChevronDown, IconTrash } from '@tabler/icons-react';
import { Controller, useFieldArray } from 'react-hook-form';

import { cn } from '~/common/utils';
import {
  FormDateField,
  FormInputField,
  FormLanguageSelectField,
  FormTextareaField,
} from '~/components/form';
import { ResumeSection } from '~/components/resume-edit/resumeSection';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/shadcn/ui/collapsible';
import { Typography } from '~/components/typographqy';

export const WorkExperienceSection = () => {
  const { fields, append, remove } = useFieldArray({
    name: 'workExperience',
  });
  return (
    <ResumeSection
      titleMessageId="resume-edit.section.work-experience.section-title"
      icon={IconBriefcase2}
    >
      <div className="flex w-full flex-col gap-4">
        {fields.map((field, index) => {
          return (
            <Collapsible key={field.id} className="w-full rounded-md bg-secondary">
              <CollapsibleTrigger className="group flex w-full items-center gap-4 p-4">
                <Controller
                  name={`workExperience.${index}.company`}
                  render={({ field: { value } }) => (
                    <Typography className="flex-1 text-sm" tag="p" fontWeight="light">
                      {value}
                    </Typography>
                  )}
                />
                <IconTrash
                  className="hidden group-data-[state=open]:block"
                  size={20}
                  onClick={() => {
                    remove(index);
                  }}
                />
                {/* TODO(feat): implement reordering */}
                {/*<IconMenu2 className="block group-data-[state=open]:hidden" size={20}/>*/}
                <IconChevronDown
                  className="stroke-secondary-foreground transition-transform duration-300 group-data-[state=open]:rotate-180"
                  size={20}
                />
              </CollapsibleTrigger>
              <CollapsibleContent
                className={cn(
                  'outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                )}
              >
                <div className="grid grid-cols-3 gap-4 p-4">
                  <FormInputField
                    name={`workExperience.${index}.company`}
                    i18nLabel="resume-edit.section.work-experience.field.company.label"
                  />
                  <FormInputField
                    name={`workExperience.${index}.title`}
                    i18nLabel="resume-edit.section.work-experience.field.title.label"
                  />
                  <FormInputField
                    name={`workExperience.${index}.city`}
                    i18nLabel="resume-edit.section.work-experience.field.city.label"
                  />
                  <FormLanguageSelectField
                    name={`workExperience.${index}.country`}
                    i18nLabel="resume-edit.section.work-experience.field.country.label"
                  />
                  <FormDateField
                    name={`workExperience.${index}.from`}
                    i18nLabel="resume-edit.section.work-experience.field.from.label"
                  />
                  <FormDateField
                    name={`workExperience.${index}.to`}
                    i18nLabel="resume-edit.section.work-experience.field.to.label"
                  />
                  <FormTextareaField
                    name={`workExperience.${index}.description`}
                    i18nLabel="resume-edit.section.work-experience.field.description.label"
                    className="col-span-3"
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
        <button
          onClick={() => {
            append({});
          }}
          className="ease flex h-8 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-secondary transition duration-300 hover:bg-secondary/25"
        >
          <Typography tag="p" className="text-sm">
            <Typography tag="span" messageId="resume-edit.section.work-experience.add-experience" />
          </Typography>
        </button>
      </div>
    </ResumeSection>
  );
};
