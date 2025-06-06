import NothingToShow from '@/components/molecule/NothingToShow';
import { nothingToShowOptions } from '@/utils/constants';
import { Button } from '@/components/atom/Button';

import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/atom/Input';
// import { DataTableDemo } from '@/components/organism/DataTable';

function Users() {
  return (
    <div className="w-full h-full pt-[1.5rem] px-[1.5rem] max-[480px]:px-[1rem] flex flex-col gap-[0.5rem] bg-bg-1">
      <div className="flex items-center justify-between pb-4">
        <div className="relative">
          <SearchIcon className="absolute left-[1.5rem] top-1/2 -translate-y-1/2 text-support-3" />
          <Input
            className=" max-w-[327px] h-[42px] rounded-[0.5rem] bg-white border-[1px] border-support-8 pl-[3.5rem] placeholder:text-support-7 placeholder:text-[length:var(--sm-text)] placeholder:leading-[140%] placeholder:font-[var(--fw-regular)] caret-[var(--color-support-8)] focus:border-[var(--color-primary-4)] focus:border-[2px] focus:placeholder:text-[var(--color-support-6)] focus:caret-[var(--color-support-6)]"
            placeholder="Search..."
          />
        </div>
        <Button
          variant="default"
          className="max-w-[143px] h-[40px] py-[10px] px-[18px] text-xs leading-[120%] flex gap-[0.5rem] justify-center items-center"
        >
          <span>+</span> Add New User
        </Button>
      </div>
      <NothingToShow
        title={nothingToShowOptions.users.title}
        subtitle={nothingToShowOptions.users.subtitle}
        icon={nothingToShowOptions.users.icon}
      />
      {/* <DataTableDemo type='users' /> */}
    </div>
  );
}

export default Users;
