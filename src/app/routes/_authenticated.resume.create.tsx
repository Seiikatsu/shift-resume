import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import { resumeService } from '~/server/domain/resume';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { resumeId } = await resumeService.createResume({
    userId: context.user.id,
  });

  return redirect(`/resume/${resumeId}`);
};
