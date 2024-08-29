import {Check, ChevronsUpDown} from 'lucide-react';
import * as React from 'react';
import {cn} from '~/common/utils';
import {SearchableSelectProps} from '~/components/searchableSelect/types';
import {Button} from '~/components/shadcn/button';
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from '~/components/shadcn/command';
import {Popover, PopoverContent, PopoverTrigger} from '~/components/shadcn/popover';


export function SearchableSelect<VALUES extends string>({
                                                          name,
                                                          value,
                                                          options,
                                                          onChange,
                                                          placeholder
                                                        }: SearchableSelectProps<VALUES>) {
  const [open, setOpen] = React.useState(false);

  const selectedValue = value
    ? options.find((option) => option.value === value)?.label
    : placeholder.noValue;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          <input name={name} value={selectedValue} hidden readOnly/>
          {selectedValue}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder={placeholder.search}/>
          <CommandList>
            <CommandEmpty>No entries found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(selectedValue) => {
                    onChange?.(selectedValue as VALUES);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}