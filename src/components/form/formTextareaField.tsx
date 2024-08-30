import {FC} from 'react';
import {FormField} from '~/components/form/formField';
import {PredefinedFormFieldProps} from '~/components/form/types';
import {Textarea} from '~/components/shadcn/textarea';

export const FormTextareaField: FC<PredefinedFormFieldProps> = (props) => {
  return (
    <FormField {...props}
               component={<Textarea/>}
    />
  );
};
