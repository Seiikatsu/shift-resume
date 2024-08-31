import type {FC} from 'react';
import {useFormState} from 'react-hook-form';

import {Button} from '~/components/button';
import type {FormButtonProps} from '~/components/form/types';
import {Typography} from '~/components/typographqy';

export const FormButton: FC<FormButtonProps> = ({type, variant, children}) => {
  const {isSubmitting} = useFormState();
  return (
    <Button type={type} variant={variant} disabled={isSubmitting}>
      <Typography tag="span" messageId={children}/>
    </Button>
  );
};
