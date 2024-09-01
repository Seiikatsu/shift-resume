import { createResume } from '~/server/domain/resume/endpoints/createResume';
import { findResume } from '~/server/domain/resume/endpoints/findResume';
import { saveResume } from '~/server/domain/resume/endpoints/saveResume';
import { userResumes } from '~/server/domain/resume/endpoints/userResumes';

export const resumeService = {
  userResumes,
  findResume,
  createResume,
  saveResume,
};

export * from './dto';
