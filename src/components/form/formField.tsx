import {cloneElement, FC} from 'react';
import {useFormContext} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {FormFieldProps} from '~/components/form/types';
import {
  FormControl,
  FormDescription,
  FormField as ShadFormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/shadcn/ui/form';

export const FormField: FC<FormFieldProps> = ({name, i18nLabel, i18nDescription, component, className}) => {
  const {t} = useTranslation();
  const form = useFormContext();

  return (
    <ShadFormField
      control={form.control}
      name={name}
      render={({field}) => {
        let controlledField;
        if (typeof component === 'function') {
          controlledField = component(field);
        } else {
          controlledField = cloneElement(component, field);
        }
        return (
          <FormItem className={className}>
            <FormLabel>{t(i18nLabel)}</FormLabel>
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
