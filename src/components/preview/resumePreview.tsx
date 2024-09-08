import type { FC } from 'react';
import { useMemo } from 'react';

import { combineUserAndResume } from '~/components/preview/combineUserAndResume';
import type { ResumePreviewProps } from '~/components/preview/types';
import { Typography } from '~/components/typographqy';
import { templates } from '~/templates';

export const ResumePreview: FC<ResumePreviewProps> = ({ user, resume }) => {
  const preview = useMemo(() => {
    return combineUserAndResume(user, resume);
  }, [user, resume]);

  const { component: TemplateComponent } = useMemo(() => {
    return templates[0];
  }, []);

  return (
    <div className="preview my-12 flex flex-col items-center gap-4">
      <div className="page">
        <TemplateComponent {...preview} />
      </div>
      <div className="m-0 box-border h-[297mm] w-[210mm] bg-white p-[20mm]">
        <div className="flex h-full items-center justify-center">
          <Typography tag="h1" className="text-red-500">
            Preview!
          </Typography>
        </div>
      </div>
    </div>
  );
};
