import { IconPencil } from '@tabler/icons-react';
import type { FC } from 'react';
import React, { useContext, useRef, useState } from 'react';

import type { BaseField } from '~/components/sectionBuilder/fieldRenderer/types';
import { SectionPreviewContext } from '~/components/sectionBuilder/preview/context';

type FieldLabelProps = Pick<BaseField, 'id' | 'label'>;

export const FieldLabel: FC<FieldLabelProps> = ({ id, label }) => {
  const { updateLabel } = useContext(SectionPreviewContext);

  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onMouseLeave={() => {
        setEditing(false);
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <small
        className="inline-flex gap-1 items-center cursor-pointer flex-0"
        onClick={() => {
          setEditing(true);
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }}
      >
        <input
          ref={inputRef}
          value={label}
          readOnly={!editing}
          onChange={(e) => {
            updateLabel(id, e.target.value);
          }}
          style={{ width: `${label.length}ch` }}
        />
        <IconPencil size={16} />
      </small>
    </div>
  );
};
