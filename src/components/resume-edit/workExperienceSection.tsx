import { IconChevronDown, IconTrash } from '@tabler/icons-react';
import { Controller, useFieldArray } from 'react-hook-form';

import { cn } from '~/common/utils';
import {
  FormDateField,
  FormInputField,
  FormLanguageSelectField,
  FormTextareaField,
} from '~/components/form';
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
    <div className="flex flex-col gap-4 w-full">
      {fields.map((field, index) => {
        return (
          <Collapsible key={field.id} className="bg-secondary w-full rounded-md">
            <CollapsibleTrigger className="w-full p-4 flex items-center gap-4 group">
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
                className="stroke-secondary-foreground group-data-[state=open]:rotate-180 transition-transform duration-300"
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
        className="border-2 border-dashed border-secondary w-full rounded-md h-8 flex justify-center items-center cursor-pointer hover:bg-secondary/25 transition ease duration-300"
      >
        <Typography tag="p" className="text-sm">
          <Typography tag="span" messageId="resume-edit.section.work-experience.add-experience" />
        </Typography>
      </button>
    </div>
  );
};
