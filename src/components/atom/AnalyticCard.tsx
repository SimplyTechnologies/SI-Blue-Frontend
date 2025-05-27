import { cn } from '@/utils/cn';
import vehicle from '@/assets/carMarker.svg';
import customers from '@/assets/customer.svg';
import vehiclesSold from '@/assets/vehiclesSold.svg';

type titleType = 'vehicle' | 'customers' | 'vehiclesSold';

type AnalyticCardProps = {
  title: titleType;
  count: number;
};

const AnalyticCard: React.FC<AnalyticCardProps> = ({ title, count }) => {
  const bgColor =
    title === 'vehicle'
      ? 'bg-primary-5'
      : title === 'customers'
        ? 'bg-support-10'
        : 'bg-success-1';

  const iconBg = title === 'vehicle' ? 'bg-primary-3' : 'bg-support-9';

  const label = title === 'vehicle' ? 'Vehicles' : title === 'customers' ? 'Customers' : 'Vehicles Sold';

  const icon = title === 'vehicle' ? vehicle : title === 'customers' ? customers : vehiclesSold;
  return (
    <div
      className={cn(
        bgColor,
        'flex-1 w-[313.5px] h-[117px] min-w-[250px] max-[480px]:w-full rounded-[8px] pl-[20px] pt-[14.5px] flex flex-col justify-center items-start gap-[12px]',
      )}
    >
      <div className="h-[32px] flex items-center justify-center gap-[0.5rem]">
        <div className={cn('w-[32px] h-[32px] rounded-[50%] flex justify-center items-center', iconBg)}>
          <img src={icon} alt="Analytic Card Icon" />
        </div>
        <p className="font-[var(--fw-regular)] text-[length:var(--sm-text)] text-support-6 leading-[140%]">
          {label}
        </p>
      </div>
      <span className="font-[var(--fw-bold)] text-[length:var(--md-text)] text-support-6">{count}</span>
    </div>
  );
};

export default AnalyticCard;
