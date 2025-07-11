import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { ChevronLeft, SearchIcon, X } from 'lucide-react';
import { Input } from '@/components/atom/Input';
import { Button } from '@/components/atom/Button';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchStore } from '@/stores/useSearchStore';

const searchSchema = z.string().trim().min(1).max(100, 'Search too long');

type DebounceSearchType = {
  setDebounceValue: (e: string) => void;
};

const DebounceSearch = ({ setDebounceValue }: DebounceSearchType) => {
  const { isSearchActive, searchValue, setIsSearchActive, setSearchValue } = useSearchStore();

  const [inputValue, setInputValue] = useState(searchValue || '');
  const [error, setError] = useState<string | null>(null);

  const { debounceValue } = useDebounce({ inputValue, delay: 300 });

  useEffect(() => {
    try {
      const searchValidationRes = searchSchema.safeParse(debounceValue);
      if (searchValidationRes?.error?.errors && debounceValue) {
        setError(searchValidationRes.error.errors[0].message);
        return;
      }

      setError(null);
      setDebounceValue(debounceValue);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Something went wrong';
      setError(errMsg);
    }
  }, [debounceValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSearchValue(e.target.value);
  };

  const cleanInput = () => {
    setInputValue('');
    setError('');
  };

  const handleBack = () => {
    cleanInput();
    setIsSearchActive(false);
    setSearchValue('');
  };

  const onFocus = () => {
    setIsSearchActive(true);
  };

  return (
    <div className="w-full transition-all duration-300 ease-in-out">
      <div className="w-full flex gap-2 items-center transition-all duration-300 ease-in-out">
        {isSearchActive ? (
          <Button variant="text" className="w-auto flex text-xs text-primary hover:opacity-80" onClick={handleBack}>
            <ChevronLeft color="currentColor" className="h-[24px] w-[24px]" />
          </Button>
        ) : null}
        <div
          className={`relative w-full transition-all duration-300 ease-in-out ${isSearchActive ? 'max-w-full' : 'max-w-[308px]'}`}
        >
          <SearchIcon className="text-support-3 absolute left-[1.5rem] top-1/2 -translate-y-1/2" />
          <Input
            className="pr-10 w-full h-[42px] pl-[3.5rem]"
            placeholder="Search..."
            onChange={handleInputChange}
            value={inputValue}
            onFocus={onFocus}
            maxLength={100}
          />
          {inputValue && (
            <Button
              variant="text"
              className="absolute right-[1rem] top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={cleanInput}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>
      </div>
      {error && (
        <p className="text-support-2 text-sm font-normal pl-8 mt-1">{error}</p>
      )}
    </div>
  );
};
export default DebounceSearch;

