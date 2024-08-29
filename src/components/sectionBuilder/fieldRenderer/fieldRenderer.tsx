import React, {FC} from 'react';
import {FieldLabel} from '~/components/sectionBuilder/fieldRenderer/fieldLabel';
import {FieldWrapper} from '~/components/sectionBuilder/fieldRenderer/fieldWrapper';
import {ImageField} from '~/components/sectionBuilder/fieldRenderer/imageField';
import {InputField} from '~/components/sectionBuilder/fieldRenderer/inputField';
import {NumberField} from '~/components/sectionBuilder/fieldRenderer/numberField';
import {RichTextField} from '~/components/sectionBuilder/fieldRenderer/richTextField';
import {ContentField} from './types';

export const FieldRenderer: FC<ContentField> = (props) => {
  let element = null;
  switch (props.type) {
    case 'text':
      return (
        <InputField
          {...props}
        />
      );
    case 'number':
      return (
        <NumberField {...props} />
      );
    case 'rich-text':
      return (
        <RichTextField {...props}/>
      )
    case 'image':
      return (
        <ImageField {...props}/>
      );
    default:
      element = (
        <span>
          Unknown field type: {props.type}
        </span>
      );
      break;
  }

  return (
    <FieldWrapper>
      <FieldLabel id={props.id} label={props.label}/>
      {element}
    </FieldWrapper>
  );
};
