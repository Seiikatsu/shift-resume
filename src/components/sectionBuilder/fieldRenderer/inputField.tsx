import type {FC} from 'react';
import React from 'react';

import {FieldLabel} from '~/components/sectionBuilder/fieldRenderer/fieldLabel';
import {FieldWrapper} from '~/components/sectionBuilder/fieldRenderer/fieldWrapper';
import type {ContentField} from '~/components/sectionBuilder/fieldRenderer/types';

type InputFieldProps = ContentField;

export const InputField: FC<InputFieldProps> = ({id, label}) => {
  return (
    <FieldWrapper>
      <FieldLabel id={id} label={label}/>
      <input id={id} name={id} type="text" className="border border-neutral-200 bg-neutral-100" disabled/>
    </FieldWrapper>
  );
};
