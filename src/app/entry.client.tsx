import {RemixBrowser} from '@remix-run/react';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import {startTransition, StrictMode} from 'react';
import {hydrateRoot} from 'react-dom/client';
import {I18nextProvider, initReactI18next} from 'react-i18next';
import {getInitialNamespaces} from 'remix-i18next/client';

import i18n from '~/app/i18n/i18n';

function hydrate() {
  // eslint-disable-next-line import-x/no-named-as-default-member
  i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(Backend)
    .init({
      ...i18n, // spread the configuration
      ns: getInitialNamespaces(),
      backend: {loadPath: '/locales/{{lng}}/{{ns}}.json'},
      saveMissing: true,
      missingKeyHandler: (_lngs,
                          ns,
                          key,) => {
        console.error(`i18next::missing-key: "${key}" in namespace "${ns}"`);
      },
      detection: {
        // Here only enable htmlTag detection, we'll detect the language only
        // server-side with remix-i18next, by using the `<html lang>` attribute
        // we can communicate to the client the language detected server-side
        order: ['htmlTag'],
        // Because we only use htmlTag, there's no reason to cache the language
        // on the browser, so we disable it
        caches: [],
      },
    })
    .then(() => {
      startTransition(() => {
        hydrateRoot(
          document,
          <I18nextProvider i18n={i18next}>
            <StrictMode>
              <RemixBrowser/>
            </StrictMode>
          </I18nextProvider>,
        );
      });
    })
    .catch((error: unknown) => {
      console.error('Failed to initialize i18next:', error);
    });
}

if (typeof window.requestIdleCallback === 'function') {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1);
}
