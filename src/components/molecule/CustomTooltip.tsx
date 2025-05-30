import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Arrow } from '@radix-ui/react-tooltip';
import type { ReactNode } from 'react';

interface TooltipProps {
  trigger: ReactNode;
  content: string;
  delayDuration?: number;
  hidden?: boolean;
  side?: 'right' | 'top' | 'bottom' | 'left';
  align?: 'center' | 'start' | 'end';
}

export default function CustomTooltip({
  trigger,
  content,
  delayDuration = 0,
  hidden = false,
  side = 'right',
  align = 'center',
}: TooltipProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent
          hidden={hidden}
          side={side}
          align={align}
          className="bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance"
        >
          <p>{content}</p>
          <Arrow width={11} height={5} className="fill-[#192252]" />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

