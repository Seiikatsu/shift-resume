import {FormEncType} from '@remix-run/react';
import {PropsWithChildren, ReactElement} from 'react';
import {ControllerRenderProps, DefaultValues, FieldValues} from 'react-hook-form';
import {z} from 'zod';
import {ButtonProps} from '~/components/button';
import {SearchableSelectProps} from '~/components/searchableSelect';

export type FormProps<T extends FieldValues> = PropsWithChildren<{
  schema: z.ZodSchema<T>;
  defaultValues: DefaultValues<T> | ((payload?: unknown) => Promise<T>);

  /**
   * Called after the form has been submitted.
   */
  submittedHandler?: (result: any) => void;

  encType?: FormEncType;
  className?: string;
}>;

export type FormFieldProps = {
  i18nLabel: string;
  name: string;
  i18nDescription?: string;
  component: ReactElement<ControllerRenderProps> | ((props: ControllerRenderProps) => ReactElement);
  className?: string;
}

export type FormButtonProps = Omit<ButtonProps, 'children' | 'type'> & {
  children: string;
  type: Exclude<ButtonProps['type'], 'button' | undefined>
};

export type LanguageSelectFormFieldProps = Omit<FormFieldProps, 'component'> & {
  i18nPlaceholder: SearchableSelectProps<any>['placeholder'];
};

export type DateFormFieldProps = Omit<FormFieldProps, 'component'>;
