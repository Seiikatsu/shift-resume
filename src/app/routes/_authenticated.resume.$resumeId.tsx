import {ActionFunctionArgs, LoaderFunctionArgs, redirect} from '@remix-run/node';
import {useLoaderData} from '@remix-run/react';
import {IconUser} from '@tabler/icons-react';
import {DateTime} from 'luxon';
import {z} from 'zod';
import {formDataToObject} from '~/common/formData';
import {logger} from '~/common/logger.server';
import {Form, FormDateField, FormInputField, FormLanguageSelectField} from '~/components/form';
import {FormTextareaField} from '~/components/form/formTextareaField';
import {Label} from '~/components/label';
import {ResumeSection} from '~/components/resume-edit';
import {Avatar, AvatarFallback} from '~/components/shadcn/avatar';
import {Checkbox} from '~/components/shadcn/checkbox';
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from '~/components/shadcn/resizable';
import {Typography} from '~/components/typographqy';
import {resumeService} from '~/server/domain/resume';
import {notificationSessionStorage} from '~/session/notificationSession.server';

const resumeSchema = z.object({
  avatar: z.string(),
  showAvatar: z.boolean(),
  title: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  birthday: z.string(),
  nationality: z.string(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  webUrl: z.string(),
  profile: z.string(),
});

export const loader = async ({request, context, params}: LoaderFunctionArgs) => {
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
      }
    });
  }

  return {
    user: context.user,
    resume,
  };
};

export const action = async ({request}: ActionFunctionArgs) => {
  const resultObject = formDataToObject(await request.formData());
  logger.info({msg: 'Form data', data: resultObject});

  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {};
};

export default function EditResumePage() {
  const {user, resume} = useLoaderData<typeof loader>();

  return (
    <ResizablePanelGroup
      autoSaveId={`resume-${resume.id}`}
      direction="horizontal"
    >
      <ResizablePanel className="flex flex-col gap-4">
        <Typography tag="h1">
          <Typography tag="span" messageId="resume-edit.title"/>
          {' • '}
          <span>{resume.title}</span>
        </Typography>
        <div className="overflow-auto scroller h-full">
          <Form schema={resumeSchema}
                defaultValues={{
                  avatar: '',
                  showAvatar: true,
                  title: '',
                  firstname: '',
                  lastname: '',
                  birthday: '',
                  profile: '',
                  nationality: '',
                  address: {
                    street: '',
                    postalCode: '',
                    city: '',
                    country: '',
                  },
                  webUrl: '',
                }}
                submitMode="onBlur"
                submittedHandler={console.log}
                className="pr-4 lg:pr-8"
          >
            <ResumeSection titleMessageId="resume-edit.section.personal-information.section-title" icon={IconUser}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 grid grid-cols-[120px_1fr_1fr] gap-4">
                  <div className="self-center flex flex-col gap-2 row-span-2">
                    <Avatar className="w-[110px] h-[110px]">
                      <AvatarFallback>MP</AvatarFallback>
                    </Avatar>
                    <div className="flex justify-center items-center gap-2">
                      <Checkbox id="showAvatar"/>
                      <Label htmlFor="showAvatar"
                             messageId="resume-edit.section.personal-information.field.show-avatar.label">
                      </Label>
                    </div>
                  </div>
                  <FormInputField i18nLabel="resume-edit.section.personal-information.field.title.label"
                                  name="title"
                                  placeholder={user.title ?? undefined}/>
                  <div/>
                  <FormInputField i18nLabel="resume-edit.section.personal-information.field.firstname.label"
                                  name="firstname"
                                  placeholder={user.firstname}/>
                  <FormInputField name="lastname"
                                  i18nLabel="resume-edit.section.personal-information.field.lastname.label"
                                  placeholder={user.lastname}/>
                </div>

                <FormDateField name="birthday"
                               i18nLabel="resume-edit.section.personal-information.field.birthday.label"
                               placeholder={DateTime.fromFormat(user.birthday, 'yyyy-MM-dd').toISODate() ?? undefined}/>
                <FormLanguageSelectField name="nationality"
                                         i18nLabel="resume-edit.section.personal-information.field.nationality.label"
                                         placeholder={user.nationality ?? undefined}/>
                <FormInputField name="address.street"
                                i18nLabel="resume-edit.section.personal-information.field.address.street.label"
                                placeholder={user.address.street}/>
                <FormInputField name="address.city"
                                placeholder={user.address.city}
                                className="self-end"/>
                <FormInputField name="address.postalCode"
                                placeholder={user.address.postalCode}/>
                <FormLanguageSelectField name="address.country"
                                         placeholder={user.address.country}/>

                <FormInputField name="webUrl"
                                i18nLabel="resume-edit.section.personal-information.field.web-url.label"
                                placeholder={user.webUrl?.href}
                                className="col-span-2"/>

                <FormTextareaField name="profile"
                                   i18nLabel="resume-edit.section.personal-information.field.profile.label"
                                   className="col-span-2"/>
              </div>
            </ResumeSection>
          </Form>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle/>
      <ResizablePanel className="pl-4 lg:pl-8">
        <div className="flex justify-center items-center h-full">
          <Typography tag="h1">Preview!</Typography>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
