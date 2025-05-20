import type { ComponentProps, ComponentPropsWithoutRef, MouseEvent, ReactNode } from 'react';
import { Root, Trigger, Portal, Overlay, Content, Title, Close } from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '@/utils/cn';
import { Button } from '@/components/atom/Button';

interface TModalProps extends Omit<ComponentPropsWithoutRef<typeof Content>, 'title'> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: ReactNode;
  title: ReactNode;
  children: ReactNode;
  footerButtonProps: ComponentProps<'button'> & {
    text: string;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'auto';
  bodyClassName?: string;
}

const Modal = ({
  isOpen,
  onOpenChange,
  trigger,
  title,
  children,
  footerButtonProps,
  size = 'md',
  className,
  bodyClassName,
  ...props
}: TModalProps) => {
  const { text: footerButtonText, onClick: onFooterButtonClick, ...restFooterButtonProps } = footerButtonProps;

  const sizeClasses = {
    auto: 'max-w-max',
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl',
    xl: 'sm:max-w-4xl',
  };

  return (
    <Root open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <Trigger asChild>{trigger}</Trigger>}
      <Portal>
        <Overlay className="fixed inset-0 z-50 bg-black/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Content
          onOpenAutoFocus={e => e.preventDefault()}
          className={cn(
            'fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%]',
            'border bg-background shadow-lg duration-200',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'sm:rounded-lg',
            'max-h-[90vh]',
            sizeClasses[size],
            className,
          )}
          {...props}
        >
          <div className="flex flex-col h-full w-full p-8">
            <div className="relative flex-shrink-0">
              <Close
                className={cn(
                  'absolute -top-2 -right-2',
                  'h-6 w-6 flex items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
                )}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Close>

              <Title
                className={cn(
                  'text-center font-bold text-2xl leading-[1.3] text-[var(--color-support-6)]',
                  'mt-2 mb-6',
                )}
              >
                {title}
              </Title>
            </div>
            <div className={cn('flex-grow overflow-y-auto', bodyClassName)}>{children}</div>
            <div className="mt-auto flex-shrink-0 pt-6">
              <Button
                variant="default"
                type="submit"
                className="w-full h-[56px]"
                onClick={onFooterButtonClick}
                {...restFooterButtonProps}
              >
                {footerButtonText}
              </Button>
            </div>
          </div>
        </Content>
      </Portal>
    </Root>
  );
};

export default Modal;
