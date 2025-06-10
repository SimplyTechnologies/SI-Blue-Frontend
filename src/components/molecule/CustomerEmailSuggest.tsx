import { useEffect, useRef } from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import getColorFromName from '@/utils/getRandomColor';
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
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setTimeout(() => {
          setOpen(false);
          if (options.length === 1 && options[0].email === inputValue) {
            handleAutocomplete(options[0]);
          }
        }, 0);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [setOpen, handleAutocomplete, options, inputValue]);

  const handleFocus = () => {
    setOpen(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      const activeEl = document.activeElement;
      if (!containerRef?.current?.contains(activeEl)) {
        field.onBlur();
      } else {
        return;
      }
    }, 0);
  };

  return (
    <div ref={containerRef} className="relative" onBlur={handleBlur} tabIndex={0}>
      <Input
        className={`${inputClassname} w-full`}
        placeholder="Enter Email"
        {...field}
        onFocus={handleFocus}
        onBlur={() => {
          return;
        }}
        autoComplete="off"
        maxLength={100}
      />

      <div
        className={`absolute top-[56px] left-0 ${
          open && options?.length ? '' : 'hidden'
        } w-full overflow-auto bg-popover text-popover-foreground z-50 max-h-[150px] min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md`}
      >
        {options.map(item => (
          <div
            key={item.id}
            onClick={e => {
              e.preventDefault();
              handleAutocomplete(item);
            }}
            className="hover:text-primary hover:bg-accent focus:text-accent-foreground relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none"
          >
            <Avatar
              className="w-[52px] h-[52px] rounded-[50%] flex justify-center items-center"
              style={{ backgroundColor: getColorFromName(`${item.firstName} ${item.lastName}`).bg }}
            >
              <AvatarImage src="" />
              <AvatarFallback
                className="font-bold text-sm bg-primary-5 leading-[120%]"
                style={{
                  backgroundColor: 'transparent',
                  color: getColorFromName(`${item.firstName} ${item.lastName}`).color,
                }}
              >
                {(item.firstName[0] || '') + (item.lastName[0] || '')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="capitalize font-bold text-sm text-support-6">
                {item.firstName} {item.lastName}
              </div>
              <div className='text-sm text-support-5'>{item.email}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

