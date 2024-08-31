import type {ButtonHTMLAttributes, Dispatch, FC, SetStateAction} from 'react';
import React, {useCallback, useState} from 'react';
import {v7} from 'uuid';

import type {AllFieldTypes, ContentField, GroupField} from 'src/components/sectionBuilder/fieldRenderer';
import type {Section} from 'src/components/sectionBuilder/preview';
import {SectionPreview} from 'src/components/sectionBuilder/preview';
import {generateRandomLabel} from '~/__dev__/generateRandomLabel';
import {findField, getParents, promoteOrDemoteNode, reorderFields} from '~/components/sectionBuilder/dnd/utils';
import {SectionPreviewContext} from '~/components/sectionBuilder/preview/context';

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> & {
  setSection: Dispatch<SetStateAction<Section>>;
  fieldType: AllFieldTypes;
  additionalProps?: Record<string, unknown>;
}

const Button: FC<ButtonProps> = ({fieldType, setSection, additionalProps: _additionalProps = {}, ...props}) => {
  const onClick = useCallback(() => {
    setSection((prevState) => {
      let t: ContentField | GroupField;
      if (fieldType === 'group') {
        t = {
          id: v7(),
          type: fieldType,
          label: generateRandomLabel(),
          fields: [],
        };
      } else {
        t = {
          id: v7(),
          type: fieldType,
          label: generateRandomLabel(),
        };
      }

      return {
        ...prevState,
        fields: [
          ...prevState.fields,
          t,
        ]
      };
    });
  }, [setSection, fieldType]);

  return (
    <li>
      <button {...props} onClick={onClick} className="py-1 px-2 text-xs border border-neutral-200"/>
    </li>
  );
};

export default function SectionBuilder() {
  const [section, setSection] = useState<Section>({
    id: v7(),
    label: 'Example section',
    fields: [],
  });

  return (
    <SectionPreviewContext.Provider
      value={{
        fields: section.fields,
        reorderField: (dragItemId, hoverFieldId) => {
          setSection((prevState) => {
            const newFields = structuredClone(prevState.fields);

            // dragging from a group to root?
            const [dragParent, hoverParent] = getParents(newFields, dragItemId, hoverFieldId);
            const isSameParent = dragParent && hoverParent && dragParent.id === hoverParent.id;
            if (!isSameParent) {
              promoteOrDemoteNode(newFields, dragItemId, null);
            }

            reorderFields(newFields, dragItemId, hoverFieldId);

            return {
              ...prevState,
              fields: newFields,
            };
          });
        },
        promoteOrDemoteField: (fieldId, groupId) => {
          setSection((prevState) => {
            const modifiedFields = structuredClone(prevState.fields);

            promoteOrDemoteNode(modifiedFields, fieldId, groupId);

            return {
              ...prevState,
              fields: modifiedFields,
            };
          });
        },
        updateLabel: (fieldId: string, newLabel: string) => {
          setSection((prevState) => {
            const modifiedFields = structuredClone(prevState.fields);

            const field = findField(modifiedFields, fieldId);
            if (field) {
              field.label = newLabel;
            }

            return {
              ...prevState,
              fields: modifiedFields,
            };
          });
        },
      }}>
      <div className="h-screen p-4 flex flex-col gap-8">
        <div>
          <ul className="flex flex-row gap-2">
            <Button fieldType="text" setSection={setSection}>
              Text field
            </Button>
            <Button fieldType="number" setSection={setSection}>
              Number field
            </Button>
            <Button fieldType="rich-text" setSection={setSection}>
              WYSIWYG field
            </Button>
            <Button fieldType="image" setSection={setSection}>
              Image field
            </Button>
            <Button fieldType="group" setSection={setSection} additionalProps={{fields: []}}>
              Group
            </Button>
          </ul>
        </div>
        <div className="flex-1 flex flex-row gap-4">
          <div className="flex-1">
            <SectionPreview {...section}/>
          </div>
          <div className="flex-1">
            <textarea readOnly disabled className="w-full h-full" value={JSON.stringify(section, null, 2)}/>
          </div>
        </div>
      </div>
    </SectionPreviewContext.Provider>
  );
}
