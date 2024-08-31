import { createContext } from 'react';

import type { SectionField } from 'src/components/sectionBuilder/fieldRenderer';

type SectionContextType = {
  fields: SectionField[];
  reorderField: (dragFieldId: string, hoverFieldId: string) => void;
  promoteOrDemoteField: (fieldId: string, groupId: string | null) => void;
  updateLabel: (fieldId: string, label: string) => void;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export const SectionPreviewContext = createContext<SectionContextType>({
  fields: [],
  reorderField: noop,
  promoteOrDemoteField: noop,
  updateLabel: noop,
});
