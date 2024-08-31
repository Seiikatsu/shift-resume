import { IconGripVertical } from '@tabler/icons-react';
import type { FC, PropsWithChildren } from 'react';
import React, { useContext, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import type { AllFieldTypes } from '~/components/sectionBuilder/fieldRenderer';
import { SectionPreviewContext } from '~/components/sectionBuilder/preview/context';
import { ItemTypes } from '~/components/sectionBuilder/preview/types';

type DragObject = {
  id: string;
  type: AllFieldTypes;
};

type CollectedProps = {
  isDragging: boolean;
};

export const DraggableField: FC<PropsWithChildren<DragObject>> = ({ id, type, children }) => {
  const { fields, reorderField } = useContext(SectionPreviewContext);

  const ref = useRef<HTMLDivElement>(null);

  const [collected, drag, dragPreview] = useDrag<DragObject, unknown, CollectedProps>(() => ({
    type: type === 'group' ? ItemTypes.GROUP : ItemTypes.FIELD,
    item: {
      id,
      type,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop<DragObject>({
    accept: [ItemTypes.FIELD, ItemTypes.GROUP],
    hover: (item, monitor) => {
      if (ref.current === null) {
        console.warn('ref is null');
        return;
      }

      const dragId = item.id;
      const hoverId = id;
      if (dragId === hoverId) {
        return;
      }

      const hoverIndex = fields.findIndex((field) => field.id === hoverId);
      if (hoverIndex === -1) {
        console.warn('invalid hover index: -1');
        return;
      }

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      if (clientOffset === null) {
        console.warn('client offset is null');
        return;
      }

      reorderField(dragId, hoverId);
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={dragPreview}
      className="w-full flex flex-row items-center gap-2 border rounded-md"
      style={{
        opacity: collected.isDragging ? 0.5 : 1,
      }}
    >
      <div
        ref={ref}
        className="cursor-move h-16 w-8 flex justify-center items-center border-r border-r-neutral-200"
      >
        <IconGripVertical />
      </div>
      <div className="p-2 flex-1">{children}</div>
    </div>
  );
};
