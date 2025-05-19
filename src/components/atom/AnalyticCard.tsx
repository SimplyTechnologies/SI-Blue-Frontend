import vehicle from '@/assets/carMarker.svg';
import customers from '@/assets/customer.svg';
import vehiclesSold from '@/assets/vehiclesSold.svg';

type AnalyticCardProps = {
  title: string;
  count: number;
};

const AnalyticCard: React.FC<AnalyticCardProps> = ({ title, count }) => {
  return (
    <div className={`bg-[${title} === 'vehicle' ? var(--color-primary-5) : ${title} === 'customers' ? var(--color-support-10) : var(--color-success-1)] w-[313.5px] h-[117px] rounded-[8px] pl-[20px] pt-[14.5] flex-col justify-center items-start`}>
      <div className='w-[122px] h-[32px] flex items-center justify-center gap-[0.5rem]'>
        <div className={`w-[32px] h-[32px] rounded-[8px] bg-[${title === 'vehicle' ? 'var(--color-primary-3)' : 'var(--color-support-9)'}]`}>
          <img
            src={title === 'vehicle' ? vehicle : title === 'customers' ? customers : vehiclesSold}
            alt="Analytic Card Icon"
          />
        </div>
        <p className="font-[var(--fw-regular)] text-[length:var(--sm-text)] text-[var(--color-support-6)] leading-[140%]">
          {title === 'vehicle' ? 'Vehicles Total' : title === 'customers' ? 'Customers' : 'Vehicles Sold'}
        </p>
      </div>
      <span className="font-[var(--fw-bold)] text-[length:var(--md-text)] text-[--color-support-6]">{count}</span>
    </div>
  );
};

export default AnalyticCard;
