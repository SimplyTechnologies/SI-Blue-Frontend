import NothingToShow from '@/components/molecule/NothingToShow';
import { nothingToShowOptions } from '@/utils/constants';

function Customers() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <NothingToShow
        title={nothingToShowOptions.customers.title}
        subtitle={nothingToShowOptions.customers.subtitle}
        icon={nothingToShowOptions.customers.icon}
      />
    </div>
  );
}

export default Customers;

