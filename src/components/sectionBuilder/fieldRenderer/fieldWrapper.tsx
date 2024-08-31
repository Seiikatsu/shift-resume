import type { FC, PropsWithChildren } from 'react';
import React from 'react';

export const FieldWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <div className="flex flex-col gap-1">{children}</div>;
};
