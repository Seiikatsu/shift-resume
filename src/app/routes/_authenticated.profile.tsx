import {ActionFunctionArgs, LoaderFunctionArgs} from '@remix-run/node';
import {useLoaderData} from '@remix-run/react';
import type {SerializeFrom} from '@remix-run/server-runtime';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {z} from 'zod';
import {zfd} from 'zod-form-data';
import {logger} from '~/common/logger.server';
import {unknownCatchToPayload} from '~/common/unknownCatchToPayload';
import {Form, FormButton, FormDateField, FormField, FormLanguageSelectField} from '~/components/form';
import {Avatar, AvatarFallback, AvatarImage} from '~/components/shadcn/avatar';
import {Input} from '~/components/shadcn/input';
import {useToast} from '~/components/shadcn/ui/use-toast';
import {countriesUnion} from '~/server/domain/common/dto/countries';
import {userService} from '~/server/domain/user';

const formSchema = z.object({
  title: z.string().optional(),
  // base64 encoded profile image
  // TODO: file?!
  picture: z.string().optional(),
  firstname: z.string(),
  lastname: z.string(),

  email: z.string().email(),
  phone: z.string().optional(),

  birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),

  addressStreet: z.string(),
  addressPostalCode: z.string(),
  addressCity: z.string(),
  addressCountry: countriesUnion.optional(),

  nationality: countriesUnion.optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const loader = async ({context}: LoaderFunctionArgs) => {
  const {user} = context;

  return {
    title: user.title ?? undefined,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phone: user.phone ?? undefined,
    birthday: user.birthday,
    addressStreet: user.address.street,
    addressPostalCode: user.address.postalCode,
    addressCity: user.address.city,
    addressCountry: user.address.country ?? undefined,
    nationality: user.nationality ?? undefined,
  } satisfies FormValues;
};

export const action = async ({context, request}: ActionFunctionArgs): Promise<{ ok: boolean; messageId: string; }> => {
  const schema = await zfd.formData(formSchema);
  const formData = await request.formData();
  const result = schema.safeParse(formData);
  if (!result.success) {
    return {
      ok: false,
      messageId: 'common:messages.form.failed'
    };
  }

  const {addressStreet, addressPostalCode, addressCity, addressCountry, ...userData} = result.data;

  try {
    await userService.updateUser({
      id: context.user.id,
      ...userData,
      address: {
        street: addressStreet,
        postalCode: addressPostalCode,
        city: addressCity,
        country: addressCountry,
      }
    });

    return {
      ok: true,
      messageId: 'common:messages.form.success'
    };
  } catch (e) {
    logger.error(unknownCatchToPayload(e, 'Failed to update user'));
    return {
      ok: false,
      messageId: 'common:messages.form.failed'
    };
  }
};

export default function ProfilePage() {
  const user = useLoaderData<typeof loader>();
  const {toast} = useToast();
  const {t} = useTranslation();

  const defaultValues = useMemo(() => ({
    ...user,
    birthday: user.birthday,
  }), [user]);

  return (
    <Form<FormValues> schema={formSchema}
                      defaultValues={defaultValues}
                      className="grid grid-cols-2 gap-4 w-[40rem]"
                      submittedHandler={(args: SerializeFrom<typeof action>) => {
                        toast({
                          variant: args.ok ? 'default' : 'destructive',
                          description: t(args.messageId),
                        });
                      }}
    >
      <div className="col-span-2 grid grid-cols-3 grid-rows-2 gap-2">
        <div className="row-span-2 flex justify-center items-center">
          <Avatar className="w-32 h-32">
            <AvatarImage src="https://localhost:5173/does-not-exist.png"/>
            <AvatarFallback>MP</AvatarFallback>
          </Avatar>
        </div>
        <FormField i18nLabel="profile.form.title.label"
                   name="title"
                   component={<Input/>}
        />
        <div/>
        <FormField i18nLabel="profile.form.firstname.label"
                   name="firstname"
                   component={<Input/>}
        />
        <FormField i18nLabel="profile.form.lastname.label"
                   name="lastname"
                   component={<Input/>}
        />
      </div>

      <FormDateField i18nLabel="profile.form.birthday.label" name="birthday"/>
      <FormLanguageSelectField i18nLabel="profile.form.nationality.label"
                               name="nationality"
                               placeholder={t('profile.form.nationality.placeholder.no-value')}
      />

      <FormField i18nLabel="profile.form.phone.label"
                 name="phone"
                 component={<Input/>}
      />
      <FormField i18nLabel="profile.form.email.label"
                 name="email"
                 component={<Input/>}
      />

      <FormField i18nLabel="profile.form.address.street.label"
                 name="addressStreet"
                 component={<Input/>}
      />
      <FormField i18nLabel="profile.form.address.postal-code.label"
                 name="addressPostalCode"
                 component={<Input/>}
      />
      <FormField i18nLabel="profile.form.address.city.label"
                 name="addressCity"
                 component={<Input/>}
      />
      <FormLanguageSelectField i18nLabel="profile.form.address.country.label"
                               name="addressCountry"
                               placeholder={t('profile.form.address.country.placeholder.no-value')}
      />

      <div className="flex justify-start">
        <FormButton type="submit" variant="primary">
          common:actions.save
        </FormButton>
      </div>
    </Form>
  );
}
