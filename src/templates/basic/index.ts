import type { ResumeTemplate } from '~/templates';
import { BasicTemplate } from '~/templates/basic/basicTemplate';

export const basicTemplate: ResumeTemplate = {
  id: 'basic',
  displayName: 'Basic',
  component: BasicTemplate,
};
