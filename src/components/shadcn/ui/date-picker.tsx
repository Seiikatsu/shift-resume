'use client';

import {format} from 'date-fns';
import {Calendar as CalendarIcon} from 'lucide-react';
import {FC} from 'react';
import * as React from 'react';
import {cn} from '~/common/utils';
import {Button} from '~/components/shadcn/button';
import {Calendar} from '~/components/shadcn/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '~/components/shadcn/popover';

type DatePickerProps = {
  value: string;
}

export const DatePicker: FC<DatePickerProps> = ({value}) => {
  const date = new Date(value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4"/>
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
