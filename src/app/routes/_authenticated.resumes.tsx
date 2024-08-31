import type { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { IconPlus } from '@tabler/icons-react';
import type { FC, ReactNode } from 'react';

import { Typography } from '~/components/typographqy';
import { resumeService } from '~/server/domain/resume';

type ResumeMeta = {
  id: string;
  title: string;
  lastEdit: string;
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const resumes = await resumeService.userResumes({ userId: context.user.id });

  const resumeMeta = resumes.map((resume): ResumeMeta => {
    return {
      id: resume.id,
      title: resume.title,
      lastEdit: 'X days ago',
    };
  });

  return {
    resumes: resumeMeta,
  };
};

const Resume: FC<{
  id: string;
  title: ReactNode;
  lastEdit: string;
  template?: boolean;
}> = (resume) => {
  return (
    <Link to={`/resume/${resume.id}`}>
      <div className="cursor-pointer border bg-neutral-900 border-neutral-700 h-[600px] w-96 relative transition-transform hover:scale-105">
        {resume.template ? (
          <div className="absolute inset-0 flex justify-center items-center">
            <IconPlus size={48} />
          </div>
        ) : null}
        <div className="absolute bottom-0 left-0 right-0 h-12 flex flex-col items-start justify-between px-4 my-2">
          {resume.title}

          <small className="text-neutral-500">{resume.lastEdit}</small>
        </div>
      </div>
    </Link>
  );
};

export default function Resumes() {
  const { resumes } = useLoaderData<typeof loader>();
  return (
    <div className="flex gap-8 flex-wrap">
      <Resume
        id="create"
        title={<Typography tag="h3" variant="paragraph" messageId="resumes.create-resume" />}
        lastEdit=""
        template
      />
      {resumes.map((resume) => (
        <Resume
          key={resume.id}
          {...resume}
          title={<h3 className="text-neutral-100">{resume.title}</h3>}
        />
      ))}
    </div>
  );
}
