import { cn } from '@/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'w-full rounded-[0.5rem] font-[var(--fw-bold)] text-[18px] leading-[140%] cursor-pointer disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary-3 text-white  hover:bg-[#534FB1] active:bg-[#322E6F]',
        outline:
          'bg-transparent border-[1px] border-primary-3 text-primary-3 hover:bg-primary-3 hover:text-white active:bg-[#322E6F] active:border[#322E6F] active:text-white h-[40px]',
        outlineStrong:
          'bg-transparent border-[2px] border-primary-3 text-primary-3 hover:bg-primary-3 hover:text-white active:bg-[#322E6F] active:border[#322E6F] active:text-white h-[56px]',
        text: 'bg-transparent',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
    },
  },
);

function Button({
  className,
  variant,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
  return <button data-slot="button" className={cn(buttonVariants({ variant, className }))} {...props} />;
}

export { Button, buttonVariants };

