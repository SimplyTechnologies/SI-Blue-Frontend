import { Button } from '@/components/atom/Button';
import { PaginatedListWrapper } from '@/components/organism/PaginatedListWrapper';

const Users = () => {
  return (
    <PaginatedListWrapper
      queryKey="usersList"
      endpoint="/users"
      type="users"
      showButton
      renderAddButton={() => (
        <Button
          variant="default"
          className="max-w-[143px] h-[40px] text-xs leading-[120%] flex gap-[0.5rem] justify-center items-center"
        >
          <span>+</span> Add New User
        </Button>
      )}
    />
  );
};

export default Users;
