import type * as SelectPrimitive from '@radix-ui/react-select';
import * as React from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { CalendarProps } from '~/components/shadcn/ui/calendar';
import { Calendar } from '~/components/shadcn/ui/calendar';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/shadcn/ui/select';

export type SelectItemProps = {
  value: string;
  label: string;
};

type SelectExtended = {
  label?: string;
  items: SelectItemProps[];
} & SelectPrimitive.SelectProps;

function SelectComponent({ label, items, ...rest }: SelectExtended) {
  return (
    <Select {...rest}>
      <SelectTrigger>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

/**
 * @see https://github.com/shadcn-ui/ui/issues/546#issuecomment-2170413363
 */
export const DatePicker = (props: CalendarProps) => {
  const [date, setDate] = React.useState<Date>(new Date());

  const { t } = useTranslation();

  const monthsLib = useMemo(() => {
    return new Array(12).fill(null).map((_, idx) => t(`common:calendar.month.long.${idx}`));
  }, [t]);

  return (
    <>
      <div className="flex space-x-2">
        <SelectComponent
          items={[...(new Array(12) as number[])].map((_, index) => ({
            label: monthsLib[index],
            value: (index + 1).toString(),
          }))}
          value={(new Date(date).getMonth() + 1).toString()}
          onValueChange={(value) => {
            setDate(new Date(date.setMonth(parseInt(value) - 1)));
          }}
        />
        <SelectComponent
          items={[...(new Array(new Date().getFullYear()) as number[])]
            .map((_, index) => ({
              label: (index + 1).toString(),
              value: (index + 1).toString(),
            }))
            .slice(1900, new Date().getFullYear() + 1)
            .reverse()}
          value={new Date(date).getFullYear().toString()}
          onValueChange={(value) => {
            setDate(new Date(date.setFullYear(parseInt(value))));
          }}
        />
      </div>
      <Calendar
        {...props}
        month={date}
        disableNavigation
        className="p-0 [&_#react-day-picker-2]:hidden"
      />
    </>
  );
};
