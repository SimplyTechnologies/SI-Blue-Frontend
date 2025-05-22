import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/atom/Select';

interface SelectProps {
  items: string[];
  onChange: (value: string) => void;
  value: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function CustomSelect({ items, onChange, value, label, placeholder, className }: SelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      {label && <div className="text-[#636777] text-sm mb-[6px]">{label}</div>}
      <SelectTrigger className={`w-full ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map(item => (
            <SelectItem value={item} key={item}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

