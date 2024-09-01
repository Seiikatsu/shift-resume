import type { FC } from 'react';

import { FormField } from '~/components/form/formField';
import type { PredefinedFormFieldProps } from '~/components/form/types';
import { Checkbox } from '~/components/shadcn/checkbox';

export const FormCheckboxField: FC<PredefinedFormFieldProps> = (props) => {
  return (
    <FormField
      {...props}
      component={({ value, onChange, ...props }) => (
        <Checkbox {...props} checked={Boolean(value)} onCheckedChange={onChange} />
      )}
      className="flex justify-center items-center gap-2 space-y-0"
    />
  );
};
