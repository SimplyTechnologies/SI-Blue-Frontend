import { Button } from '@/components/atom/Button';

import { PaginatedListWrapper } from '@/components/organism/PaginatedListWrapper';
import { useState } from 'react'; 
import AddNewUser from '@/components/organism/AddNewUser';


const Users = () => {
  
  const [showAddUser, setShowAddUser] = useState(false);
  

  return (
    <>
      <PaginatedListWrapper
        queryKey="usersList"
        endpoint="/users"
        type="users"
        showButton
        renderAddButton={() => (
          <Button
            variant="default"
            className="max-w-[143px] h-[40px] text-xs leading-[120%] flex gap-[0.5rem] justify-center items-center"
            onClick={() => setShowAddUser(true)} 
          >
            <span>+</span> Add New User
          </Button>
        )}
      />
      
      <AddNewUser 
        open={showAddUser} 
        onOpenChange={setShowAddUser}        
      />
    </>
  );
};

export default Users;