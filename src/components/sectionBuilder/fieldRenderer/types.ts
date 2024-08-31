export type ContentFieldTypes = 'text' | 'number' | 'rich-text' | 'image';
export type GroupFieldTypes = 'group';
export type AllFieldTypes = ContentFieldTypes | GroupFieldTypes;

export type BaseField<TYPES = string> = {
  id: string;
  label: string;
  type: TYPES;
};

export type ContentField = BaseField<ContentFieldTypes>;

export type GroupField = BaseField<'group'> & {
  fields: ContentField[];
};

export type SectionField = ContentField | GroupField;
