import { useEffect, useRef } from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import type { CustomerType } from '@/types/Customer';
import { Input } from '@/components/atom/Input';

interface CustomerEmailSuggest {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleAutocomplete: (customer: CustomerType) => void;
  options: CustomerType[];
  inputClassname: string;
  field: ControllerRenderProps<
    {
      email: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
    },
    'email'
  >;
  inputValue: string;
}

export default function CustomerEmailSuggest({
  open,
  setOpen,
  handleAutocomplete,
  options,
  inputClassname,
  field,
  inputValue,
}: CustomerEmailSuggest) {
  const autocompleteRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.target && open) {
        handleBlur(e.target);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [autocompleteRef, inputRef, open, options]);

  const onEmailFocus = () => {
    if (options?.length) {
      setOpen(true);
    }
  };

  const handleBlur = (target: EventTarget) => {
    if (target instanceof Node && !autocompleteRef?.current?.contains(target) && !inputRef?.current?.contains(target)) {
      setOpen(false);
      if (options?.length === 1 && options[0].email === inputValue) {
        handleAutocomplete(options[0]);
      }
    }
  };

  return (
    <div className="relative">
      <Input
        className={`${inputClassname} w-full`}
        placeholder="Enter Email"
        {...field}
        onFocus={onEmailFocus}
        autoComplete="off"
        ref={inputRef}
        maxLength={100}
      />
      <div
        ref={autocompleteRef}
        className={`absolute top-[56px] left-0 ${open ? '' : 'hidden'} w-full overflow-auto bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-[150px] min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md`}
      >
        {options?.map((item, index) => (
          <div
            className="hover:text-primary hover:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            key={index}
            onClick={() => handleAutocomplete(item)}
          >
            {item.email}
          </div>
        ))}
      </div>
    </div>
  );
}

