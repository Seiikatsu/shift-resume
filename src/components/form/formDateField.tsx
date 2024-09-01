import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DateTime } from 'luxon';
import type { FC } from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { anyToDate, dateToIso8601 } from '~/common/dateUtils';
import { cn } from '~/common/utils';
import { DatePicker } from '~/components/datePicker';
import { FormField } from '~/components/form/formField';
import type { ControlledFormFieldProps, PredefinedFormFieldProps } from '~/components/form/types';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/shadcn/popover';
import { Button } from '~/components/shadcn/ui/button';
import { FormControl } from '~/components/shadcn/ui/form';

export const FormDateField: FC<PredefinedFormFieldProps> = (props) => {
  const { t } = useTranslation();

  const componentFactory = useCallback(
    (field: ControlledFormFieldProps) => {
      const value: Date | undefined = anyToDate(field.value);

      let displayedValue: string;
      if (value) {
        displayedValue = format(value, 'PPP');
      } else if (field.placeholder) {
        const placeholderAsDate = DateTime.fromFormat(field.placeholder, 'yyyy-MM-dd');
        if (placeholderAsDate.isValid) {
          displayedValue = format(placeholderAsDate.toJSDate(), 'PPP');
        } else {
          displayedValue = field.placeholder;
        }
      } else {
        displayedValue = t('common:field.datepicker.placeholder');
      }

      return (
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant="outline"
                className={cn(
                  'w-full pl-3 text-left font-normal gap-2',
                  !field.value && 'text-muted-foreground',
                )}
              >
                {displayedValue}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <DatePicker
              mode="single"
              defaultMonth={value}
              selected={value}
              onSelect={(e) => {
                // instead of storing the date object, we store the iso8601 string (is possible)
                field.onChange(e instanceof Date ? dateToIso8601(e) : e);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      );
    },
    [t],
  );

  return (
    <FormField {...props} component={componentFactory} className="flex flex-col justify-end" />
  );
};
