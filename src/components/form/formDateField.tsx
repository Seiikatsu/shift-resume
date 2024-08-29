import {format} from 'date-fns';
import {CalendarIcon} from 'lucide-react';
import {DateTime} from 'luxon';
import {FC} from 'react';
import {cn} from '~/common/utils';
import {FormField} from '~/components/form/formField';
import {DateFormFieldProps} from '~/components/form/types';
import {Calendar} from '~/components/shadcn/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '~/components/shadcn/popover';
import {Button} from '~/components/shadcn/ui/button';
import {FormControl} from '~/components/shadcn/ui/form';

export const FormDateField: FC<DateFormFieldProps> = (props) => {
  return (
    <FormField {...props}
               component={(field) => {
                 const value = field.value instanceof Date ? field.value : DateTime.fromFormat(field.value, 'yyyy-MM-dd').toJSDate();
                 return (
                   <Popover>
                     <PopoverTrigger asChild>
                       <FormControl>
                         <Button
                           variant={'outline'}
                           className={cn(
                             'pl-3 text-left font-normal gap-2',
                             !field.value && 'text-muted-foreground'
                           )}
                         >
                           {value ? (
                             format(value, 'PPP')
                           ) : (
                             <span>Pick a date</span>
                           )}
                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                         </Button>
                       </FormControl>
                     </PopoverTrigger>
                     <PopoverContent className="w-auto p-0" align="start">
                       <Calendar
                         mode="single"
                         defaultMonth={value}
                         selected={value}
                         onSelect={field.onChange}
                         initialFocus
                       />
                     </PopoverContent>
                   </Popover>
                 );
               }}
               className="flex flex-col justify-end"
    />
  );
};
