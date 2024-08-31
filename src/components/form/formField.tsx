import type { FC} from 'react';
import {cloneElement} from 'react';
import {useFormContext} from 'react-hook-form';
import {useTranslation} from 'react-i18next';

import type {ControlledFormFieldProps, FormFieldProps} from '~/components/form/types';
import {
  FormControl,
  FormDescription,
  FormField as ShadFormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/shadcn/ui/form';

export const FormField: FC<FormFieldProps> = ({
                                                name,
                                                i18nLabel,
                                                i18nDescription,
                                                placeholder,
                                                component,
                                                className
                                              }) => {
  const {t} = useTranslation();
  const form = useFormContext();

  return (
    <ShadFormField
      control={form.control}
      name={name}
      render={({field}) => {
        const fieldProps: ControlledFormFieldProps = {
          ...field,
        };
        if (placeholder) {
          fieldProps.placeholder = placeholder;
        }

        let controlledField;
        if (typeof component === 'function') {
          controlledField = component(fieldProps);
        } else {
          controlledField = cloneElement(component, fieldProps);
        }
        return (
          <FormItem className={className}>
            {i18nLabel ? (
              <FormLabel>{t(i18nLabel)}</FormLabel>
            ) : null}
            <FormControl>
              {controlledField}
            </FormControl>
            {i18nDescription ? (
              <FormDescription>
                {t(i18nDescription)}
              </FormDescription>
            ) : null}
            <FormMessage/>
          </FormItem>
        );
      }}
    />
  );
};
