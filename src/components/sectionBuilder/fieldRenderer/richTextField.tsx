import type {FC} from 'react';
import React from 'react';

import {FieldLabel} from '~/components/sectionBuilder/fieldRenderer/fieldLabel';
import {FieldWrapper} from '~/components/sectionBuilder/fieldRenderer/fieldWrapper';
import type {ContentField} from '~/components/sectionBuilder/fieldRenderer/types';

type RichTextFieldProps = ContentField;


export const RichTextField: FC<RichTextFieldProps> = ({id, label}) => {
  return (
    <FieldWrapper>
      <FieldLabel id={id} label={label}/>
      <textarea id={id} name={id} rows={5} className="border border-neutral-200 bg-neutral-100" disabled/>
    </FieldWrapper>
  )
}
