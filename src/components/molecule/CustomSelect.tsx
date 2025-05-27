import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/atom/Select';

interface SelectProps {
  items: { id: string | number; name: string }[];
  onChange: (value: string) => void;
  value: string;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  addNoSelect?: boolean;
}

export default function CustomSelect({
  items,
  onChange,
  value,
  label,
  placeholder,
  className,
  disabled,
  addNoSelect,
}: SelectProps) {
  const handleChange = (val: string) => {
    if (val === '__none__' || val === value) {
      onChange('');
    } else {
      onChange(val);
    }
  };

  return (
    <Select value={value} onValueChange={() => {}}>
      {label && <div className="text-support-5 text-sm mb-[6px]">{label}</div>}
      <SelectTrigger className={`w-full ${className}`} disabled={disabled}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {addNoSelect ? (
            <SelectItem value="__none__" onPointerDown={() => handleChange('__none__')}>
              No selection
            </SelectItem>
          ) : null}
          {items.length ? (
            items.map(item => (
              <SelectItem
                value={item.id.toString()}
                key={item.id}
                onPointerDown={() => handleChange(item.id.toString())}
              >
                {item.name}
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-center text-sm text-support-5">No results found.</div>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

