import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { SearchIcon, X } from 'lucide-react';
import { Input } from '@/components/atom/Input';
import { Button } from '@/components/atom/Button';
import { useDebounce } from '@/hooks/useDebounce';

const searchSchema = z.string().trim().min(1);

type DebounceSearchType = {
  setDebounceValue: (e: string) => void;
};

const DebounceSearch = ({ setDebounceValue }: DebounceSearchType) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { debounceValue } = useDebounce({ inputValue, delay: 300 });

  useEffect(() => {
    try {
      searchSchema.safeParse(debounceValue);
      setError(null);
      setDebounceValue(debounceValue);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Something went wrong';
      setError(errMsg);
    }
  }, [debounceValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const cleanInput = () => {
    setInputValue('');
  };

  return (
    <div className="relative w-full max-w-[308px]">
      <SearchIcon className="text-[#AFAFAF] absolute left-[1.5rem] top-1/2 -translate-y-1/2" />
      <Input
        className="bg-white pr-10 w-full h-[42px] rounded-[0.5rem] border-[1px] border-[var(--color-support-8)] pl-[3.5rem] placeholder:text-[var(--color-support-7)] placeholder:text-[length:var(--sm-text)] placeholder:leading-[140%] placeholder:font-[var(--fw-regular)] caret-[var(--color-support-8)] focus:border-[var(--color-primary-4)] focus:caret-[var(--color-support-6)]"
        placeholder="Search..."
        onChange={handleInputChange}
        value={inputValue}
      />
      {inputValue && (
        <Button variant="text" className="absolute right-[1rem] top-1/2 -translate-y-1/2 h-6 w-6" onClick={cleanInput}>
          <X className="h-4 w-4 text-muted-foreground" />
        </Button>
      )}
      {error && (
        <p className="text-[var(--color-support-2)] text-[length:var(--xs-text)] font-[var(--fw-medium)]">{error}</p>
      )}
    </div>
  );
};
export default DebounceSearch;

