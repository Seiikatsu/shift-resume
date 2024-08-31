import {FC} from 'react';
import {FormField} from '~/components/form/formField';
import {PredefinedFormFieldProps} from '~/components/form/types';
import {Input} from '~/components/shadcn/input';

export const FormInputField: FC<PredefinedFormFieldProps> = (props) => {
  return (
    <FormField {...props}
               component={(props) => <Input {...props}/>}
    />
  );
};