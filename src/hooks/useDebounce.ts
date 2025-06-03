import { useEffect, useState } from 'react';

type UseDebounceTypes = {
  inputValue: string;
  delay: number;
};

export const useDebounce = ({ inputValue, delay }: UseDebounceTypes) => {
  const [debounceValue, setDebounceValue] = useState(inputValue);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceValue(inputValue);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [inputValue, delay]);

  return {debounceValue};
};

