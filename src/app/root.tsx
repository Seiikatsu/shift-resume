import type {LoaderFunctionArgs} from '@remix-run/node';
import {Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData} from '@remix-run/react';
import type {FC, PropsWithChildren} from 'react';
import {useTranslation} from 'react-i18next';
import {useChangeLanguage} from 'remix-i18next/react';

import i18next from '~/app/i18n/i18next.server';
import './tailwind.css';
import {Toaster} from '~/components/shadcn/ui/toaster';

export async function loader({request}: LoaderFunctionArgs) {
  const locale = await i18next.getLocale(request);
  return {locale};
}

/**
 * <b>Do not</b> export the layout function as it's predefined by remix, we are using props here which cannot be passed automatically by remix.
 */
const Layout: FC<PropsWithChildren<{ locale?: string; dir?: string; }>> = ({locale, dir, children}) => {
  return (
    <html lang={locale ?? 'en'} dir={dir ?? 'ltr'}>
    <head>
      <meta charSet="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <Meta/>
      <Links/>
    </head>
    <body>
    {children}
    <ScrollRestoration/>
    <Scripts/>
    </body>
    </html>
  );
};

export const handle = {
  i18n: ['common'],
};

export default function Root() {
  const {locale} = useLoaderData<typeof loader>();

  const {i18n} = useTranslation();

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(locale);

  return (
    <Layout locale={locale} dir={i18n.dir()}>
      <Outlet/>
      <Toaster/>
    </Layout>
  );
}
