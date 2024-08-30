import {FormEncType} from '@remix-run/react';
import {PropsWithChildren, ReactElement} from 'react';
import {ControllerRenderProps, DefaultValues, FieldValues} from 'react-hook-form';
import {z} from 'zod';
import {ButtonProps} from '~/components/button';

export type FormProps<T extends FieldValues> = PropsWithChildren<{
  schema: z.ZodSchema<T>;
  defaultValues?: DefaultValues<T> | ((payload?: unknown) => Promise<T>);

  submitMode?: 'onBlur' | 'onSubmit';

  /**
   * Called after the form has been submitted.
   */
  submittedHandler?: (result: any) => void;

  /**
   * @default application/x-www-form-urlencoded
   */
  encType?: FormEncType;
  className?: string;
}>;

export type ControlledFormFieldProps = ControllerRenderProps & {
  placeholder?: string;
}

export type FormFieldProps = {
  name: string;
  i18nLabel?: string;
  placeholder?: string;
  i18nDescription?: string;
  component: ReactElement<ControlledFormFieldProps> | ((props: ControlledFormFieldProps) => ReactElement);
  className?: string;
};

export type PredefinedFormFieldProps = Omit<FormFieldProps, 'component'>;

export type FormButtonProps = Omit<ButtonProps, 'children' | 'type'> & {
  children: string;
  type: Exclude<ButtonProps['type'], 'button' | undefined>
};
