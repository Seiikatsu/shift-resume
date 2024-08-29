import React, {FC} from 'react';
import {FieldLabel} from '~/components/sectionBuilder/fieldRenderer/fieldLabel';
import {FieldWrapper} from '~/components/sectionBuilder/fieldRenderer/fieldWrapper';
import {ContentField} from '~/components/sectionBuilder/fieldRenderer/types';

type NumberFieldProps = ContentField;

export const NumberField: FC<NumberFieldProps> = ({id, label}) => {
  return (
    <FieldWrapper>
      <FieldLabel id={id} label={label}/>
      <input id={id} name={id} type="number" className="border border-neutral-200 bg-neutral-100" disabled/>
    </FieldWrapper>
  );
}
