import {zodResolver} from '@hookform/resolvers/zod';
import {Form as RemixForm} from '@remix-run/react';
import {useCallback} from 'react';
import {FieldValues, useForm} from 'react-hook-form';
import {createFormDataRecursive} from '~/common/formData';
import {FormProps} from '~/components/form/types';
import {Form as ShadForm} from '~/components/shadcn/ui/form';
import {useSubmitPromise} from '~/hooks/useSubmitPromise';

export function Form<T extends FieldValues = FieldValues>({
                                                            schema,
                                                            defaultValues,
                                                            encType = 'application/x-www-form-urlencoded',
                                                            className,
                                                            submitMode = 'onSubmit',
                                                            submittedHandler,
                                                            children
                                                          }: FormProps<T>) {
  const form = useForm<T>({
    mode: submitMode,
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const submit = useSubmitPromise();

  const onSubmit = useCallback(async (data: FieldValues) => {
    const formData = createFormDataRecursive(data);

    // TODO: this might fail or causes errors if the result was a redirect?!
    const result = await submit(formData, {
      method: 'POST',
      encType: encType,
    });

    if (typeof submittedHandler === 'function') {
      submittedHandler(result);
    }
  }, [submit, submittedHandler]);

  const remixFormProps = {
    [submitMode]: form.handleSubmit(onSubmit),
  };

  return (
    <ShadForm {...form}>
      <RemixForm {...remixFormProps} className={className}>
        {children}
      </RemixForm>
    </ShadForm>
  );
}
