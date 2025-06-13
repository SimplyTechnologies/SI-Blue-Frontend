import { Skeleton } from '@/components/atom/Skeleton';

type VehicleCardSkeleton = {
  details?: boolean;
};

const VehicleCardSkeleton = ({ details }: VehicleCardSkeleton) => {
  return (
    <div className="w-full py-6 border-b border-support-12 ">
      <div className="flex">
        {/* Marker Circle */}
        <Skeleton className="mr-3 w-12 h-12 flex justify-center items-center rounded-full border-2" />

        {/* Vehicle Info */}
        <div className="flex flex-col flex-1 w-full mb-2">
          <div className="flex justify-between items-center mb-1">
            <Skeleton className="w-[160px] h-[18px]" />
          </div>

          <div className="flex flex-col gap-1 cursor-pointer">
            <Skeleton className="max-w-[140px] h-[18px] w-full" />
            <Skeleton className="max-w-[200px] h-[18px] w-full" />
          </div>
        </div>

        {/* Status & Favorite */}
        <div className="flex items-start gap-5 ml-4 mr-1">
          <Skeleton className="px-2 w-[46px] h-[16px]" />
          <Skeleton className="w-[16px] h-[16px] rounded-full" />
        </div>
      </div>
      {details ? (
        <div className="mt-3">
          <Skeleton className="w-full h-[40px] rounded-md" />
        </div>
      ) : null}
    </div>
  );
};

export default VehicleCardSkeleton;

