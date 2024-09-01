import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { IconBriefcase2, IconUser } from '@tabler/icons-react';
import { DateTime } from 'luxon';
import { z } from 'zod';

import { formDataToObject } from '~/common/formData';
import {
  Form,
  FormButton,
  FormCheckboxField,
  FormDateField,
  FormInputField,
  FormLanguageSelectField,
} from '~/components/form';
import { FormTextareaField } from '~/components/form/formTextareaField';
import { ResumeSection, WorkExperienceSection } from '~/components/resume-edit';
import { Avatar, AvatarFallback } from '~/components/shadcn/avatar';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '~/components/shadcn/resizable';
import { Typography } from '~/components/typographqy';
import { countriesUnion } from '~/server/domain/common/dto/countries';
import { iso8601DateSchema } from '~/server/domain/common/dto/iso8601Date';
import { resumeService } from '~/server/domain/resume';
import { notificationSessionStorage } from '~/session/notificationSession.server';

const personalInformationSchema = z.object({
  avatar: z.string().optional(),
  showAvatar: z.boolean().optional(),
  title: z.string().optional(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string().email().optional(),
  birthday: iso8601DateSchema.optional(),
  nationality: countriesUnion.optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: countriesUnion.optional(),
  webUrl: z.string().optional(),
  description: z.string().optional(),
});

const workExperienceSchema = z.object({
  company: z.string(),
  title: z.string().optional(),
  city: z.string().optional(),
  country: countriesUnion.optional(),
  from: iso8601DateSchema.optional(),
  to: iso8601DateSchema.optional(),
  description: z.string().optional(),
});

const resumeSchema = z.object({
  personalInformation: personalInformationSchema.optional(),
  workExperience: z.array(workExperienceSchema).optional(),
});

export const loader = async ({ request, context, params }: LoaderFunctionArgs) => {
  const paramsSchema = z.object({
    resumeId: z.string().uuid(),
  });

  const paramsParseResult = paramsSchema.safeParse(params);
  if (!paramsParseResult.success) {
    return redirect('/resumes');
  }

  const resume = await resumeService.findResume({
    userId: context.user.id,
    resumeId: paramsParseResult.data.resumeId,
  });

  if (resume === null) {
    const session = await notificationSessionStorage.getSession(request.headers.get('Cookie'));
    session.flash('notification', {
      messageId: 'page:resume-edit.notification.resume-not-found',
      type: 'error',
    });

    return redirect('/resumes', {
      headers: {
        'Set-Cookie': await notificationSessionStorage.commitSession(session),
      },
    });
  }

  return {
    user: context.user,
    resume,
  };
};

export const action = async ({ request, context, params }: ActionFunctionArgs) => {
  const paramsSchema = z.object({
    resumeId: z.string().uuid(),
  });

  const paramsParseResult = paramsSchema.safeParse(params);
  if (!paramsParseResult.success) {
    return {};
  }
  const resumeId = paramsParseResult.data.resumeId;

  const resultObject = formDataToObject(await request.formData(), resumeSchema);
  if (resultObject === null) {
    return {};
  }

  const sectionOrUndefined = <T extends object>(value: T | undefined): T | undefined => {
    return value !== undefined && Object.keys(value).length > 0 ? value : undefined;
  };

  await resumeService.saveResume({
    userId: context.user.id,
    resumeId,
    personalInformation: sectionOrUndefined(resultObject.personalInformation),
    workExperience: sectionOrUndefined(resultObject.workExperience),
  });

  return {};
};

export default function EditResumePage() {
  const { user, resume } = useLoaderData<typeof loader>();

  return (
    <ResizablePanelGroup autoSaveId={`resume-${resume.id}`} direction="horizontal">
      <ResizablePanel className="flex flex-col gap-4">
        <Typography tag="h1">
          <Typography tag="span" messageId="resume-edit.title" />
          {' • '}
          <span>{resume.title}</span>
        </Typography>
        <div className="overflow-auto scroller h-full">
          <Form
            schema={resumeSchema}
            defaultValues={{
              personalInformation: {
                avatar: resume.personalInformation?.avatar ?? undefined,
                showAvatar: resume.personalInformation?.showAvatar ?? undefined,
                title: resume.personalInformation?.title ?? undefined,
                firstname: resume.personalInformation?.firstname ?? undefined,
                lastname: resume.personalInformation?.lastname ?? undefined,
                birthday: resume.personalInformation?.birthday ?? undefined,
                description: resume.personalInformation?.description ?? undefined,
                nationality: resume.personalInformation?.nationality ?? undefined,
                street: resume.personalInformation?.street ?? undefined,
                postalCode: resume.personalInformation?.postalCode ?? undefined,
                city: resume.personalInformation?.city ?? undefined,
                country: resume.personalInformation?.country ?? undefined,
                webUrl: resume.personalInformation?.webUrl ?? undefined,
              },
              workExperience: resume.workExperience ?? [],
            }}
            // TODO(bug): onBlur needs some fixes - triggers way to much!
            // submitMode="onBlur"
            submittedHandler={console.log}
            className="flex flex-col gap-8 pr-4 lg:pr-8"
          >
            <ResumeSection
              titleMessageId="resume-edit.section.personal-information.section-title"
              icon={IconUser}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 grid grid-cols-[120px_1fr_1fr] gap-4">
                  <div className="self-center flex flex-col gap-2 row-span-2">
                    <Avatar className="w-[110px] h-[110px]">
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
                  placeholder={
                    DateTime.fromFormat(user.birthday, 'yyyy-MM-dd').toISODate() ?? undefined
                  }
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
            <ResumeSection
              titleMessageId="resume-edit.section.work-experience.section-title"
              icon={IconBriefcase2}
            >
              <WorkExperienceSection />
            </ResumeSection>
            {/* TODO(testing): temporary - remove */}
            <FormButton type="submit">common:actions.save</FormButton>
          </Form>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel className="pl-4 lg:pl-8">
        <div className="flex justify-center items-center h-full">
          <Typography tag="h1">Preview!</Typography>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
