import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckIcon, XCircle, XIcon, ChevronDownIcon } from 'lucide-react';

import { Separator } from '@/components/atom/Separator';
import { Button } from '@/components/atom/Button';
import { Badge } from '@/components/atom/Badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/atom/Popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/atom/Command';
import { cn } from '@/utils/cn';

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const multiSelectVariants = cva('m-1 bg-primary-3 text-white rounded-[4px] hover:bg-primary-3 hover:opacity-90', {
  variants: {
    variant: {
      default: 'border-foreground/10 text-foreground bg-card hover:bg-card/80',
      secondary: 'border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80',
      destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
      inverted: 'inverted',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

/**
 * Props for MultiSelect component
 */
interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  /**
   * An array of option objects to be displayed in the multi-select component.
   * Each option object has a label, value, and an optional icon.
   */
  options: {
    /** The text to display for the option. */
    id: string | number;
    /** The unique value associated with the option. */
    name: string;
    /** Optional icon component to display alongside the option. */
    icon?: React.ComponentType<{ className?: string }>;
  }[];

  /**
   * Callback function triggered when the selected values change.
   * Receives an array of the new selected values.
   */
  onValueChange: (value: string[]) => void;

  /** The default selected values when the component mounts. */
  value?: string[];

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string;

  /**
   * Maximum number of items to display. Extra selected items will be summarized.
   * Optional, defaults to 3.
   */
  maxCount?: number;

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * Optional, defaults to false.
   */
  modalPopover?: boolean;

  /**
   * If true, renders the multi-select component as a child of another component.
   * Optional, defaults to false.
   */
  asChild?: boolean;

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string;

  /**
   * Label to add above the dropdown. Optional.
   */
  label?: string;

  /**
   * Option to disable select. Optional
   */
  disabled?: boolean;
}

const CustomMultiSelect: React.FC<MultiSelectProps> = ({
  options,
  onValueChange,
  variant,
  value = [],
  placeholder = 'Select options',
  maxCount = 3,
  modalPopover = false,
  className,
  label,
  disabled,
  ...props
}) => {
  const updatedOptions = options.map(item => {
    return { ...item, id: item.id.toString() };
  });
  const ref = React.useRef<HTMLButtonElement | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setIsPopoverOpen(true);
    } else if (event.key === 'Backspace' && !event.currentTarget.value) {
      const newSelectedValues = [...value];
      newSelectedValues.pop();
      onValueChange(newSelectedValues);
    }
  };

  const toggleOption = (option: string) => {
    const newSelectedValues = value.includes(option) ? value.filter(val => val !== option) : [...value, option];
    onValueChange(newSelectedValues);
  };

  const handleClear = () => {
    onValueChange([]);
  };

  const handleTogglePopover = () => {
    setIsPopoverOpen(prev => !prev);
  };

  const clearExtraOptions = () => {
    const newSelectedValues = value.slice(0, maxCount);
    onValueChange(newSelectedValues);
  };

  const toggleAll = () => {
    if (value.length === updatedOptions.length) {
      handleClear();
    } else {
      const allValues = updatedOptions.map(option => option.id);
      onValueChange(allValues);
    }
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={modalPopover}>
      {label && <div className="text-support-5 text-sm mb-[6px]">{label}</div>}
      <PopoverTrigger asChild ref={ref}>
        <Button
          {...props}
          onClick={handleTogglePopover}
          disabled={disabled}
          className={cn(
            'flex w-full py-2 px-3 rounded-md border-input bg-white border min-h-14 shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50  h-auto items-center justify-between [&_svg]:pointer-events-auto',
            className,
          )}
        >
          {value.length > 0 ? (
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-wrap items-center">
                {value.slice(0, maxCount).map(value => {
                  const option = updatedOptions.find(o => o.id === value);
                  const IconComponent = option?.icon;
                  return (
                    <Badge key={value} className={cn(multiSelectVariants({ variant }))}>
                      {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
                      {option?.name}
                      <span
                        onClick={event => {
                          event.stopPropagation();
                          toggleOption(value);
                        }}
                      >
                        <XCircle className="ml-2 h-4 w-4 cursor-pointer" />
                      </span>
                    </Badge>
                  );
                })}
                {value.length > maxCount && (
                  <Badge
                    className={cn(
                      'bg-transparent text-foreground border-foreground/1 hover:bg-transparent',
                      multiSelectVariants({ variant }),
                    )}
                  >
                    {`+ ${value.length - maxCount} more`}
                    <span
                      onClick={event => {
                        event.stopPropagation();
                        clearExtraOptions();
                      }}
                    >
                      <XCircle className="ml-2 h-4 w-4 cursor-pointer" />
                    </span>
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <XIcon
                  className="h-4 mx-2 cursor-pointer text-muted-foreground"
                  onClick={event => {
                    event.stopPropagation();
                    handleClear();
                  }}
                  color="#AFAFAF"
                />
                <Separator orientation="vertical" className="flex min-h-6 h-full" />
                <ChevronDownIcon className="size-4 opacity-50 ml-2" color="#AFAFAF" />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full mx-auto">
              <span className="text-muted-foreground text-sm font-normal">{placeholder}</span>
              <ChevronDownIcon className="size-4 opacity-50 ml-2" color="#AFAFAF" />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        style={{ width: ref?.current?.offsetWidth }}
        className="w-full p-0"
        align="start"
        onEscapeKeyDown={() => setIsPopoverOpen(false)}
      >
        <Command>
          <CommandInput placeholder="Search..." onKeyDown={handleInputKeyDown} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <CommandItem key="all" onSelect={toggleAll} className="cursor-pointer">
                <div
                  className={cn(
                    'mr-2 flex h-4 w-4 items-center justify-center rounded-[4px] border border-primary',
                    value.length === updatedOptions.length ? 'bg-primary-3 text-white' : 'opacity-50 [&_svg]:invisible',
                  )}
                >
                  <CheckIcon className="h-4 w-4" color="white" />
                </div>
                <span>Select All</span>
              </CommandItem>
              {updatedOptions.map(option => {
                const isSelected = value.includes(option.id);
                return (
                  <CommandItem key={option.id} onSelect={() => toggleOption(option.id)} className="cursor-pointer">
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-[4px] border border-primary',
                        isSelected ? 'bg-primary-3 text-white' : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <CheckIcon className="h-4 w-4" color="#fff" />
                    </div>
                    {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                    <span>{option.name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <div className="flex items-center justify-between">
                {value.length > 0 && (
                  <>
                    <CommandItem onSelect={handleClear} className="flex-1 justify-center cursor-pointer">
                      Clear
                    </CommandItem>
                    <Separator orientation="vertical" className="flex min-h-6 h-full" />
                  </>
                )}
                <CommandItem
                  onSelect={() => setIsPopoverOpen(false)}
                  className="flex-1 justify-center cursor-pointer max-w-full"
                >
                  Close
                </CommandItem>
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CustomMultiSelect;

