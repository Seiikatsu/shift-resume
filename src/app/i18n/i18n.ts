import type { InitOptions } from 'i18next';

export default {
  // This is the list of languages your application supports
  supportedLngs: ['en'],
  defaultNS: 'page',
  // This is the language you want to use in case
  // if the user language is not in the supportedLngs
  fallbackLng: 'en',
} satisfies InitOptions;
