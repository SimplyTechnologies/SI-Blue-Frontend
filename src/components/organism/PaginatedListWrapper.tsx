import { useEffect, useState } from 'react';
import { SearchIcon } from 'lucide-react';

import { Input } from '../atom/Input';
import { DataTableDemo } from './DataTable';
import type { User, UsersResponse } from '@/types/User';
import type { Customers, CustomersResponse } from '@/types/Customer';

import { useDebounce } from '@/hooks/useDebounce';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { useDynamicPageSize } from '@/hooks/useDynamicRows';

type PaginatedListWrapperProps = {
  title?: string;
  showButton?: boolean;
  queryKey: 'usersList' | 'customersList';
  endpoint: string;
  type: 'users' | 'customers';
  addButtonText?: string;
  renderAddButton?: () => React.ReactNode;
};

export const PaginatedListWrapper = ({
  queryKey,
  endpoint,
  type,
  showButton = false,
  renderAddButton,
}: PaginatedListWrapperProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const pageSize = useDynamicPageSize();
  const { debounceValue: debounceSearch } = useDebounce({ inputValue: searchInput, delay: 100 });

  const { data, isLoading } = usePaginatedList({
    endpoint,
    queryKey,
    page: currentPage,
    offset: pageSize,
    search: debounceSearch,
  });

  useEffect(() => {
    if (debounceSearch !== searchInput) {
      setCurrentPage(1);
    }
  }, [debounceSearch, searchInput]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getTableData = () => {
    if (!data) return [];

    if (type === 'users') {
      return (data as UsersResponse).users || [];
    } else {
      return (data as CustomersResponse).customers || [];
    }
  };
  const tableData = getTableData();
  return (
    <div className="w-full h-full p-[1.5rem] max-[480px]:px-[1rem] flex flex-col gap-[0.5rem] bg-bg-1">
      <div className="flex items-center justify-between pb-[1rem] max-[480px]:flex-col max-[480px]:gap-[1rem] max-[480px]:items-start">
        <div className="relative">
          <SearchIcon className="absolute left-[1.5rem] top-1/2 -translate-y-1/2 text-support-3" />
          <Input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="max-w-[327px] h-[42px] pl-[3.5rem]"
            placeholder="Search..."
          />
        </div>

        {showButton && renderAddButton && renderAddButton()}
      </div>

      {type === 'users' ? (
        <DataTableDemo<User>
          type="users"
          data={tableData as User[]}
          pagination={{
            page: data?.page || 1,
            pageSize: data?.pageSize || 25,
            total: data?.total || 0,
            totalPages: data?.totalPages || 0,
            onPageChange: handlePageChange,
          }}
          isLoading={isLoading}
        />
      ) : (
        <DataTableDemo<Customers>
          type="customers"
          data={tableData as Customers[]}
          pagination={{
            page: data?.page || 1,
            pageSize: data?.pageSize || 25,
            total: data?.total || 0,
            totalPages: data?.totalPages || 0,
            onPageChange: handlePageChange,
          }}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};
