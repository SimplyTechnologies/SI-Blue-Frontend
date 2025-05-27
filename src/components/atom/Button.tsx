import { cn } from '@/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva('w-full rounded-[0.5rem] font-[var(--fw-bold)] text-[18px] leading-[140%] cursor-pointer disabled:pointer-events-none disabled:opacity-50', {
  variants: {
    variant: {
      default: 'bg-[var(--color-primary-3)] text-[var(--color-white)]  hover:bg-[#534FB1] active:bg-[#322E6F]',
      outline:
        'bg-[transparent] border-[2px] border-[var(--color-primary-3)] text-[var(--color-primary-4)] hover:bg-[var(--color-primary-3)] hover:text-[var(--color-white)] active:bg-[#322E6F] active:border[#322E6F] active:text-[var(--color-white)]',
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
