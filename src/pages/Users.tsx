import NothingToShow from '@/components/molecule/NothingToShow';
import { nothingToShowOptions } from '@/utils/constants';

function Users() {
  return (
    <div className='w-full h-full flex justify-center items-center'>
      <NothingToShow
        title={nothingToShowOptions.users.title}
        subtitle={nothingToShowOptions.users.subtitle}
        icon={nothingToShowOptions.users.icon}
      />
    </div>
  );
}

export default Users;

