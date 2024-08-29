import React, {FC, PropsWithChildren} from 'react';

export const FieldWrapper: FC<PropsWithChildren> = ({children}) => {
  return (
    <div className="flex flex-col gap-1">
      {children}
    </div>
  );
};
