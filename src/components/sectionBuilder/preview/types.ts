import type {SectionField} from 'src/components/sectionBuilder/fieldRenderer';

export type Section = {
  id: string;
  label: string;
  fields: SectionField[];
}

export const ItemTypes = {
  FIELD: 'field',
  GROUP: 'group',
};
