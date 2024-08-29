import {createContext} from 'react';
import {SectionField} from 'src/components/sectionBuilder/fieldRenderer';

type SectionContextType = {
  fields: SectionField[];
  reorderField: (dragFieldId: string, hoverFieldId: string) => void;
  promoteOrDemoteField: (fieldId: string, groupId: string | null) => void;
  updateLabel: (fieldId: string, label: string) => void;
};

const noop = () => {
};

export const SectionPreviewContext = createContext<SectionContextType>({
  fields: [],
  reorderField: noop,
  promoteOrDemoteField: noop,
  updateLabel: noop,
});
