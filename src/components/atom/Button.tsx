import { cn } from '@/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva('w-full rounded-[0.5rem] font-[var(--fw-bold)] text-[18px] leading-[140%] cursor-pointer', {
  variants: {
    variant: {
      default: 'bg-[var(--color-primary-3)] text-[var(--color-white)] hover:bg-[#353278]',
      outline: 'bg-[transparent] border-[2px] border-[var(--color-primary-3)] text-[var(--color-primary-4)] hover:bg-[#ebeafb]',
      text: 'bg-[transparent]',
    },
  },
});

function Button({
  className,
  variant,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
  return <button data-slot="button" className={cn(buttonVariants({ variant, className }))} {...props} />;
}

export { Button };
