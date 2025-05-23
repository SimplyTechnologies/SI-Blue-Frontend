import carMarker from '@/assets/carMarkerPrimary.svg';
import favorite from '@/assets/favorite.svg';
// import favoritePrimary from "@/assets/favoritePrimary.svg";

const VehicleCard: React.FC = () => {
  return (
    <div className="w-full py-[1.5rem] border-b-[1px] border-[#F5F5F7] flex">
      <div className="w-[60px] flex justify-start items-start cursor-pointer">
        <div className="w-[48px] h-[48px] flex justify-center items-center bg-[#F5F7FF] border-[2px] border-[var(--color-secondary-1)] rounded-[50%]">
          <div className="w-[24px] h-[24px] flex justify-center items-center">
            <img src={carMarker} alt="Vehicle" />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col">
        <div className="flex justify-between items-center">
          <div className="cursor-pointer">
            <p className="text-[var(--color-support-6)] text-[length:var(--xs-text)] font-[var(--fw-bold)] leading-[120%]">
              1FTEX1C85AKB67308
            </p>
          </div>
          <div className="flex gap-[2.5rem]">
            <div className="h-[21px] py-[2px] px-[0.5rem] bg-[#23A1E9] rounded-[0.5rem]">
              <p className="text-[var(--color-white)] text-[12px] font-[var(--fw-regular)] leading-[140%]">Sold</p>
            </div>
            <div className="w-[20px] h-[20px] flex justify-center items-center">
              <img src={favorite} alt="Favorite" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[0.25rem] cursor-pointer">
          <div>
            <p className="text-[var(--color-support-5)] text-[length:var(--xs-text)] font-[var(--fw-regular)] leading-[140%]">
              Toyota Corolla 2022
            </p>
          </div>
          <div>
            <p className="text-[var(--color-support-5)] text-[length:var(--xs-text)] font-[var(--fw-regular)] leading-[140%]">
              Location:{' '}
              <span className="text-[var(--color-support-6)] text-[length:var(--xs-text)] font-[var(--fw-medium)] leading-[140%]">
                NW 27th St, Allaratah
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
