import type { ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/atom/DropdownMenu';

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
  menuClassName?: string;
  sideOffset?: number;
  align?: 'end' | 'center' | 'start';
}

export default function CustomDropdown({ trigger, items, label, menuClassName, sideOffset, align }: DropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className={menuClassName} alignOffset={sideOffset} align={align || 'end'}>
        {label && <DropdownMenuLabel>{label}</DropdownMenuLabel>}
        {label && <DropdownMenuSeparator />}
        {items.map((item, index) =>
          item.separator ? (
            <DropdownMenuSeparator key={`sep-${index}`} />
          ) : (
            <DropdownMenuItem key={index} onClick={item.onClick} disabled={item.disabled} className="dd-dropdown-item">
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

