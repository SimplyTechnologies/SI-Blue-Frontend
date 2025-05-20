import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/atom/DropdownMenu';
import type { ReactNode } from 'react';

interface DropdownProps {
  trigger: ReactNode;
  items: {
    label: string;
    onClick?: () => void;
    icon?: ReactNode;
    disabled?: boolean;
    separator?: boolean;
  }[];
  label?: string;
}

export default function CustomDropdown({ trigger, items, label }: DropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent>
        {label && <DropdownMenuLabel>{label}</DropdownMenuLabel>}
        {label && <DropdownMenuSeparator />}
        {items.map((item, index) =>
          item.separator ? (
            <DropdownMenuSeparator key={`sep-${index}`} />
          ) : (
            <DropdownMenuItem key={index} onClick={item.onClick} disabled={item.disabled}>
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
