import React, {FC, useContext} from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {DraggableContentField} from '~/components/sectionBuilder/dnd/draggableContentField';
import {DraggableGroup} from '~/components/sectionBuilder/dnd/draggableGroup';
import {SectionPreviewContext} from '~/components/sectionBuilder/preview/context';
import {Section} from '~/components/sectionBuilder/preview/types';

type SectionPreview = Omit<Section, 'fields'>;

export const SectionPreview: FC<SectionPreview> = ({id, label}) => {
  const {fields} = useContext(SectionPreviewContext);
  return (
    <div className="w-full border rounded-md border-neutral-200 shadow-md p-4">
      <h2 className="mb-4 text-2xl">
        {label}
      </h2>
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col gap-2">
          {fields.map((field) => {
            if (field.type === 'group') {
              return <DraggableGroup key={field.id} {...field}/>;
            }
            return (
              <DraggableContentField key={field.id} {...field}/>
            );
          })}
        </div>
      </DndProvider>
    </div>
  );
};
