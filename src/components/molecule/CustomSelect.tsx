import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/atom/Select';

interface SelectProps {
  items: {id: string | undefined, name: string}[];
  onChange: (value: string) => void;
  value: string;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function CustomSelect({ items, onChange, value, label, placeholder, className, disabled }: SelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      {label && <div className="text-[#636777] text-sm mb-[6px]">{label}</div>}
      <SelectTrigger className={`w-full ${className}`} disabled={disabled}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map(item => (
            <SelectItem value={item.id || 'test'} key={item.id}>
              {item.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

