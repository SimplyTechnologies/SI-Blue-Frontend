import type { ReactElement } from 'react';

type NothingToShow = {
  title: string;
  subtitle: string;
  icon: ReactElement;
};

const NothingToShow = ({ title, subtitle, icon }: NothingToShow) => {
  return (
    <div className="flex flex-col gap-1 w-full h-full justify-center items-center  max-w-[335px] mx-auto">
      <div className="w-[42px] h-[42px] mb-3">{icon}</div>
      <div className="text-primary text-[18px] font-bold text-center whitespace-pre-line">{title}</div>
      <div className="text-support-5 text-[14px] text-center whitespace-pre-line">{subtitle}</div>
    </div>
  );
};

export default NothingToShow;
