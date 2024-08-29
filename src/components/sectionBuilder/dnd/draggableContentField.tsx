import React, {FC} from 'react';
import {DraggableField} from '~/components/sectionBuilder/dnd/draggableField';
import {ContentField, FieldRenderer} from '~/components/sectionBuilder/fieldRenderer';

export const DraggableContentField: FC<ContentField> = (props) => {
  return (
    <DraggableField id={props.id} type={props.type}>
      <FieldRenderer {...props}/>
    </DraggableField>
  );
};
