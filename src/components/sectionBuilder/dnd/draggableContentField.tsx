import type {FC} from 'react';
import React from 'react';

import {DraggableField} from '~/components/sectionBuilder/dnd/draggableField';
import type {ContentField} from '~/components/sectionBuilder/fieldRenderer';
import { FieldRenderer} from '~/components/sectionBuilder/fieldRenderer';

export const DraggableContentField: FC<ContentField> = (props) => {
  return (
    <DraggableField id={props.id} type={props.type}>
      <FieldRenderer {...props}/>
    </DraggableField>
  );
};
