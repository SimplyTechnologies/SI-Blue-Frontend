// import NothingToShow from '@/components/molecule/NothingToShow';
// import { nothingToShowOptions } from '@/utils/constants';
import { useEffect, useState } from 'react';
import { DataTableDemo } from '@/components/organism/DataTable';
import { useGetCustomers } from '@/hooks/useCustomers';

import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/atom/Input';
import { useDebounce } from '@/hooks/useDebounce';

const Customers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [searchInput, setSearchInput] = useState('');

  const { debounceValue: debounceSearch } = useDebounce({ inputValue: searchInput, delay: 300 });

  const {
    data: customersResponse,
    isLoading,
    // error,
    // isError,
  } = useGetCustomers({ page: currentPage, offset: pageSize, search: debounceSearch });

  useEffect(() => {
    if (debounceSearch !== searchInput) {
      setCurrentPage(1);
    }
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div className="w-full h-full pt-[1.5rem] px-[1.5rem] max-[480px]:px-[1rem] flex flex-col gap-[0.5rem] bg-bg-1">
      {/* <NothingToShow
        title={nothingToShowOptions.customers.title}
        subtitle={nothingToShowOptions.customers.subtitle}
        icon={nothingToShowOptions.customers.icon}
      /> */}
      <div className="flex items-center justify-between pb-4">
        <div className="relative">
          <SearchIcon className="absolute left-[1.5rem] top-1/2 -translate-y-1/2 text-support-3" />
          <Input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className=" max-w-[327px] h-[42px] rounded-[0.5rem] bg-white border-[1px] border-support-8 pl-[3.5rem] placeholder:text-support-7 placeholder:text-[length:var(--sm-text)] placeholder:leading-[140%] placeholder:font-[var(--fw-regular)] caret-[var(--color-support-8)] focus:border-[var(--color-primary-4)] focus:border-[2px] focus:placeholder:text-[var(--color-support-6)] focus:caret-[var(--color-support-6)]"
            placeholder="Search..."
          />
        </div>
      </div>
      <DataTableDemo
        type="customers"
        data={customersResponse?.customers || []}
        pagination={{
          page: customersResponse?.page || 1,
          pageSize: customersResponse?.pageSize || 25,
          total: customersResponse?.total || 0,
          totalPages: customersResponse?.totalPages || 0,
          onPageChange: handlePageChange,
        }}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Customers;
