import {LoaderFunctionArgs, redirect} from '@remix-run/node';
import {useLoaderData} from '@remix-run/react';
import {IconChevronDown, IconUser} from '@tabler/icons-react';
import {FC, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {z} from 'zod';
import {cn} from '~/common/utils';
import {Label} from '~/components/label';
import {Avatar, AvatarFallback} from '~/components/shadcn/avatar';
import {Checkbox} from '~/components/shadcn/checkbox';
import {Input} from '~/components/shadcn/input';
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from '~/components/shadcn/resizable';
import {Textarea} from '~/components/shadcn/textarea';
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from '~/components/shadcn/ui/collapsible';
import {Typography} from '~/components/typographqy';
import {resumeService} from '~/server/domain/resume';
import {notificationSessionStorage} from '~/session/notificationSession.server';

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
    resume,
  };
};

const InputWithLabel: FC<{ name: string; label?: string; placeholder?: string }> = ({name, label, placeholder}) => {
  const {t} = useTranslation();

  const translatedPlaceholder = useMemo(() => placeholder ? t(placeholder) : undefined, [placeholder, t]);

  return (
    <div className="flex flex-col gap-2">
      {label ? <Label htmlFor={name} messageId={label}/> : null}
      <Input id={name} name={name} placeholder={translatedPlaceholder}/>
    </div>
  );
};

export default function EditResumePage() {
  const {resume} = useLoaderData<typeof loader>();
  return (
    <ResizablePanelGroup
      autoSaveId={`resume-${resume.id}`}
      direction="horizontal"
    >
      <ResizablePanel className="flex flex-col gap-4">
        <Typography tag="h1" messageId="resume-edit.title"/>
        <div className="overflow-auto scroller h-full">
          <div className="pr-4 lg:pr-8">
            <Collapsible className="w-full border border-secondary rounded-md">
              <CollapsibleTrigger
                className="w-full p-4 flex items-center gap-2 group">
                <IconUser size={32}/>
                <Typography className="flex-1" tag="h2"
                            messageId="resume-edit.section.personal-information.section-title"/>
                <div
                  className="transition-opacity duration-300 opacity-0 group-data-[state=open]:opacity-100">
                  <IconChevronDown
                    className="stroke-neutral-400 group-data-[state=open]:rotate-180 transition-transform duration-300"
                    size={32}/>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent
                className={cn('outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95')}>
                <div className="flex flex-col gap-4 p-4">
                  <div className="grid grid-cols-[120px_1fr_1fr] grid-rows-3 gap-4">
                    <div className="flex flex-col gap-2 row-span-3">
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
                    <InputWithLabel name="title" label="resume-edit.section.personal-information.field.title.label"/>
                    <div/>
                    <InputWithLabel name="firstname"
                                    label="resume-edit.section.personal-information.field.firstname.label"/>
                    <InputWithLabel name="lastname"
                                    label="resume-edit.section.personal-information.field.lastname.label"/>
                    <InputWithLabel name="phone" label="resume-edit.section.personal-information.field.phone.label"/>
                    <InputWithLabel name="email" label="resume-edit.section.personal-information.field.email.label"/>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <InputWithLabel name="birthday"
                                    label="resume-edit.section.personal-information.field.birthday.label"/>
                    <InputWithLabel name="nationality"
                                    label="resume-edit.section.personal-information.field.nationality.label"/>
                  </div>

                  <div className="grid grid-cols-2 grid-rows-1 gap-2 items-end">
                    <InputWithLabel name="address.street"
                                    label="resume-edit.section.personal-information.field.address.street.label"
                                    placeholder="resume-edit.section.personal-information.field.address.street.placeholder"/>
                    <InputWithLabel name="address.city"
                                    placeholder="resume-edit.section.personal-information.field.address.city.placeholder"/>
                    <InputWithLabel name="address.postalCode"
                                    placeholder="resume-edit.section.personal-information.field.address.postal-code.placeholder"/>
                    <InputWithLabel name="address.country"
                                    placeholder="resume-edit.section.personal-information.field.address.country.placeholder"/>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <InputWithLabel name="webUrl"
                                    label="resume-edit.section.personal-information.field.web-url.label"
                                    placeholder="resume-edit.section.personal-information.field.web-url.placeholder"/>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="profile" messageId="resume-edit.section.personal-information.field.profile.label"/>
                    <Textarea name="profile" rows={5}/>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          {/*<ScrollArea className="h-72">*/}
          {/*  <div className="flex flex-col gap-4">*/}
          {/*  {new Array(1000).fill(null).map((_, index) => <div key={index} className={`h-8 w-8 ${index % 2 === 0 ? 'bg-red-500' : 'bg-green-500'}`}/>)}*/}
          {/*  </div>*/}
          {/*</ScrollArea>*/}
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
