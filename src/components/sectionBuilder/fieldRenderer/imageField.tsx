import type { FC } from 'react';
import React from 'react';

import { FieldLabel } from '~/components/sectionBuilder/fieldRenderer/fieldLabel';
import { FieldWrapper } from '~/components/sectionBuilder/fieldRenderer/fieldWrapper';
import type { ContentField } from '~/components/sectionBuilder/fieldRenderer/types';

type NumberFieldProps = ContentField;

export const ImageField: FC<NumberFieldProps> = ({ id, label }) => {
  return (
    <FieldWrapper>
      <FieldLabel id={id} label={label} />
      <div className="rounded-full bg-neutral-100 h-16 w-16"></div>
    </FieldWrapper>
  );
};
