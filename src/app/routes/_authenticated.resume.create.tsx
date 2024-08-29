import {LoaderFunctionArgs, redirect} from '@remix-run/node';
import {resumeService} from '~/server/domain/resume';

export const loader = async ({context}: LoaderFunctionArgs) => {
  const {resumeId} = await resumeService.createResume({userId: context.user.id});

  return redirect(`/resume/${resumeId}`);
};
