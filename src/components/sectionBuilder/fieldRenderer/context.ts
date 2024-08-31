import { createContext } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export const SectionContext = createContext({
  values: [],
  setValue: noop,
});
