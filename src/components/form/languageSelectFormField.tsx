import {countries, getEmojiFlag, TCountryCode} from 'countries-list';
import {FC, forwardRef} from 'react';
import {ControllerRenderProps} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {FormField} from '~/components/form/formField';
import {LanguageSelectFormFieldProps} from '~/components/form/types';
import {SearchableSelect, SearchableSelectOption} from '~/components/searchableSelect';

type PlaceholderProps = Pick<LanguageSelectFormFieldProps, 'i18nPlaceholder'>;

const languageValues: SearchableSelectOption<TCountryCode>[] = Object.entries(countries)
  .map(([code, country]) => ({
    value: code,
    label: `${getEmojiFlag(code)} ${country.name}`,
  }));

type FieldProps = Omit<Partial<ControllerRenderProps>, 'ref'>;

const LanguageSelectField: FC<FieldProps & PlaceholderProps> = forwardRef(({
                                                                             value,
                                                                             name,
                                                                             onChange,
                                                                             disabled,
                                                                             i18nPlaceholder
                                                                           }, ref) => {
  const {t} = useTranslation();

  return (
    <SearchableSelect<TCountryCode> name={name}
                                    value={value}
                                    options={languageValues}
                                    onChange={onChange}
                                    placeholder={{
                                      search: t(i18nPlaceholder.search),
                                      noValue: t(i18nPlaceholder.noValue),
                                    }}
    />
  );
});

LanguageSelectField.displayName = 'LanguageSelectField';

export const LanguageSelectFormField: FC<LanguageSelectFormFieldProps> = ({i18nPlaceholder, ...props}) => {
  return (
    <FormField {...props}
               component={<LanguageSelectField i18nPlaceholder={i18nPlaceholder}/>}
               className="flex flex-col justify-end"
    />
  );
};
