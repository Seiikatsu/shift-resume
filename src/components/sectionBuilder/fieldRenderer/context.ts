import {createContext} from 'react';

export const SectionContext = createContext({
  values: [],
  setValue: () => {},
});
