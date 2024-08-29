import {FC, useContext} from 'react';
import {useDrop} from 'react-dnd';
import {cn} from '~/common/utils';
import {DraggableContentField} from '~/components/sectionBuilder/dnd/draggableContentField';
import {DraggableField} from '~/components/sectionBuilder/dnd/draggableField';
import {FieldLabel} from '~/components/sectionBuilder/fieldRenderer/fieldLabel';
import {FieldWrapper} from '~/components/sectionBuilder/fieldRenderer/fieldWrapper';
import {ContentField, GroupField} from '~/components/sectionBuilder/fieldRenderer/types';
import {ItemTypes} from '~/components/sectionBuilder/preview';
import {SectionPreviewContext} from '~/components/sectionBuilder/preview/context';

export const DraggableGroup: FC<GroupField> = ({id, label, type, fields}) => {
  const {promoteOrDemoteField} = useContext(SectionPreviewContext);

  const [collected, drop] = useDrop({
    accept: ItemTypes.FIELD,
    hover: (item: ContentField) => {
      promoteOrDemoteField(item.id, id);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <DraggableField id={id} type={type}>
      <FieldWrapper>
        <FieldLabel id={id} label={label}/>
        <div ref={drop} className={cn(
          'min-h-16 w-full',
          collected.canDrop && 'border border-neutral-200 bg-yellow-100 rounded-md'
        )}>
          {fields.map(field => (
            <DraggableContentField key={field.id} {...field}/>
          ))}
        </div>
      </FieldWrapper>
    </DraggableField>
  );
};
