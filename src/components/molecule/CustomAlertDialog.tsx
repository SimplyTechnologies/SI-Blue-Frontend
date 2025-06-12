import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/atom/AlertDialog';
import { AlertDialogIcon } from '@/assets/svgIconComponents/AlertDialogIcon';

interface AlertDialog  {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description: string;
  handleConfirm: () => void;
  variant?: 'default' | 'destructive';
  actionBtnText: string;
  actionBtnDisabled?: boolean;
};

export function CustomAlertDialog({
  open,
  setOpen,
  title,
  description,
  handleConfirm,
  variant = 'default',
  actionBtnText,
  actionBtnDisabled = false,
}: AlertDialog) {
  const variants = {
    default: {
      icon: 'text-primary flex items-center justify-center',
      confirm: 'bg-primary-3 hover:bg-[#534FB1] active:bg-[#322E6F] p-2 text-white h-[56px]',
      cancel:
        'border-primary-3 text-primary-3 hover:bg-primary-3 hover:text-white active:bg-[#322E6F] active:border[#322E6F] bg-transparent p-2 border-[1px] active:text-white h-[56px]',
    },
    destructive: {
      icon: 'text-destructive flex items-center justify-center',
      confirm: 'bg-destructive hover:bg-[#e03d71] active:bg-[#e03d71] p-2 text-white border-destructive h-[56px]',
      cancel:
        'border-destructive text-destructive hover:bg-destructive hover:text-white active:bg-[#e03d71] active:border-[#e03d71] bg-transparent p-2 border-[1px] active:text-white h-[56px]',
    },
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-[450px]!">
        <div className={variants[variant].icon}>
          <AlertDialogIcon variant={variant} />
        </div>
        <AlertDialogHeader className="pb-4 pt-2">
          <AlertDialogTitle className="text-[#101828] text-center text-[18px] font-bold">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-[#667085] text-center text-[16px]">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={variants[variant].cancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={e => {
              e.preventDefault();
              handleConfirm();
            }}
            className={variants[variant].confirm}
            disabled={actionBtnDisabled}
          >
            {actionBtnText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
