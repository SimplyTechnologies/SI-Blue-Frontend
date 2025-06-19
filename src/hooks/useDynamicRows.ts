import { useEffect, useState } from 'react';

const ROW_HEIGHT = 80;

export const useDynamicPageSize = () => {
  const [pageSize, setPageSize] = useState(5);

  const calculatePageSize = () => {
    const availableHeight = window.innerHeight - 346;
    const rows = Math.floor(availableHeight / ROW_HEIGHT);
    setPageSize(rows > 1 ? rows : 1);
  };

  useEffect(() => {
    calculatePageSize();
    window.addEventListener('resize', calculatePageSize);
    return () => window.removeEventListener('resize', calculatePageSize);
  }, []);

  return pageSize;
};

