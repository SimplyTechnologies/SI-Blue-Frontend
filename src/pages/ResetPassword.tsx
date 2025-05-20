import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { cn } from '@/utils/cn';
import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
import Auth from '@/layouts/Auth';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const schema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type FormData = z.infer<typeof schema>;

const ResetPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onBlur',
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <Auth>
      <form className={cn('flex flex-col gap-[3.25rem]')} onSubmit={handleSubmit(onSubmit)}>
        <div>
          <p className="text-[var(--color-support-6)] text-[length:var(--xl-text)] font-[var(--fw-bold)] leading-[120%]">
            Reset Password
          </p>
        </div>
        <div className="grid gap-[2.25rem]">
          <div className="grid gap-[1rem]">
            <div className="grid gap-[6px] focus-within:[&>label]:text-[var(--color-support-6)]">
              <Label
                htmlFor="password"
                className="text-[var(--color-support-5)] text-[length:var(--xs-text)] font-[var(--fw-medium)] leading-[140%] focus:text-[var(--color-support-6)]"
              >
                New Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter Password"
                {...register('password')}
                onBlur={() => trigger('password')}
                className="h-[56px] rounded-[0.5rem] border-[1px] border-[var(--color-support-8)] pl-[22px] placeholder:text-[var(--color-support-7)] placeholder:text-[length:var(--sm-text)] caret-[var(--color-support-8)] focus:border-[var(--color-primary-4)] focus:border-[2px] focus:placeholder:text-[var(--color-support-6)] focus:caret-[var(--color-support-6)]"
                required
              />
              {errors.password && (
                <p className="text-[var(--color-support-2)] text-[length:var(--xs-text)] font-[var(--fw-medium)] leading-[140%]">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="grid gap-[6px] focus-within:[&>label]:text-[var(--color-support-6)]">
              <Label
                htmlFor="password"
                className="text-[var(--color-support-5)] text-[length:var(--xs-text)] font-[var(--fw-medium)] leading-[140%] focus:text-[var(--color-support-6)]"
              >
                Confirm New Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter Password"
                {...register('confirmPassword')}
                onBlur={() => trigger('confirmPassword')}
                className="h-[56px] rounded-[0.5rem] border-[1px] border-[var(--color-support-8)] pl-[22px] placeholder:text-[var(--color-support-7)] placeholder:text-[length:var(--sm-text)] caret-[var(--color-support-8)] focus:border-[var(--color-primary-4)] focus:border-[2px] focus:placeholder:text-[var(--color-support-6)] focus:caret-[var(--color-support-6)]"
                required
              />
              {errors.confirmPassword && (
                <p className="text-[var(--color-support-2)] text-[length:var(--xs-text)] font-[var(--fw-medium)] leading-[140%]">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
          <Button type="submit" className="h-[56px]" variant={'default'}>
            Reset Password
          </Button>
        </div>
      </form>
    </Auth>
  );
};

export default ResetPassword;
