import {zodResolver} from '@hookform/resolvers/zod';
import {Form as RemixForm} from '@remix-run/react';
import {useCallback} from 'react';
import {FieldValues, useForm} from 'react-hook-form';
import {FormProps} from '~/components/form/types';
import {Form as ShadForm} from '~/components/shadcn/ui/form';
import {useSubmitPromise} from '~/hooks/useSubmitPromise';

export function Form<T extends FieldValues = FieldValues>({
                                                            schema,
                                                            defaultValues,
                                                            encType,
                                                            className,
                                                            submittedHandler,
                                                            children
                                                          }: FormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const submit = useSubmitPromise();

  const onSubmit = useCallback(async (data: FieldValues) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    }

    // TODO: right now we always ignore the result of the submit!
    const result = await submit(formData, {
      method: 'POST',
      encType: encType,
    });

    if (typeof submittedHandler === 'function') {
      submittedHandler(result);
    }
  }, [submit, submittedHandler]);

  return (
    <ShadForm {...form}>
      <RemixForm onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
      </RemixForm>
    </ShadForm>
  );
}
