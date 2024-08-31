import type { TCountryCode} from 'countries-list';
import {countries, getEmojiFlag} from 'countries-list';
import type {FC} from 'react';
import {useTranslation} from 'react-i18next';

import {FormField} from '~/components/form/formField';
import type {PredefinedFormFieldProps} from '~/components/form/types';
import type { SearchableSelectOption} from '~/components/searchableSelect';
import {SearchableSelect} from '~/components/searchableSelect';

const languageValues: SearchableSelectOption<TCountryCode>[] = Object.entries(countries)
  .map(([code, country]) => ({
    value: code,
    label: `${getEmojiFlag(code)} ${country.name}`,
  }));


export const FormLanguageSelectField: FC<PredefinedFormFieldProps> = ({...props}) => {
  const {t} = useTranslation();
  return (
    <FormField {...props}
               component={({ref, ...props}) => (
                 <SearchableSelect<TCountryCode> {...props}
                                                 searchPlaceholder={t('common:field.language-search.search-placeholder')}
                                                 options={languageValues}/>
               )}
               className="flex flex-col justify-end"
    />
  );
};
