import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { cn } from '@/utils/cn';
import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
import { Checkbox } from '@/components/atom/Checkbox';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const schema = z
  .object({
    name: z.string().min(2, {
      message: 'Name must be at least 2 characters.',
    }),
    email: z.string().email({
      message: 'Invalid email address.',
    }),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type FormData = z.infer<typeof schema>;

const AccountActivation: React.FC = () => {
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
    <form className={cn('flex flex-col gap-[3.25rem]')} onSubmit={handleSubmit(onSubmit)}>
      <div>
        <p className="text-[var(--color-support-6)] text-[length:var(--xl-text)] font-[var(--fw-bold)] leading-[120%]">
          Account Activation
        </p>
      </div>
      <div className="grid gap-[2.25rem]">
        <div className="grid gap-[1rem]">
          <div className="grid gap-[6px] focus-within:[&>label]:text-[var(--color-support-6)]">
            <Label
              htmlFor="email"
              className="text-[var(--color-support-5)] text-[length:var(--xs-text)] font-[var(--fw-medium)] leading-[140%] focus:text-[var(--color-support-6)]"
            >
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register('email')}
              onBlur={() => trigger('email')}
              className="h-[56px] rounded-[0.5rem] border-[1px] border-[var(--color-support-8)] pl-[22px] placeholder:text-[var(--color-support-7)] placeholder:text-[length:var(--sm-text)] caret-[var(--color-support-8)] focus:border-[var(--color-primary-4)] focus:border-[2px] focus:placeholder:text-[var(--color-support-6)] focus:caret-[var(--color-support-6)]"
              required
            />
            {errors.email && (
              <p className="text-[var(--color-support-2)] text-[length:var(--xs-text)] font-[var(--fw-medium)] leading-[140%]">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-[6px] focus-within:[&>label]:text-[var(--color-support-6)]">
            <Label
              htmlFor="name"
              className="text-[var(--color-support-5)] text-[length:var(--xs-text)] font-[var(--fw-medium)] leading-[140%] focus:text-[var(--color-support-6)]"
            >
              Name
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register('name')}
              onBlur={() => trigger('name')}
              className="h-[56px] rounded-[0.5rem] border-[1px] border-[var(--color-support-8)] pl-[22px] placeholder:text-[var(--color-support-7)] placeholder:text-[length:var(--sm-text)] caret-[var(--color-support-8)] focus:border-[var(--color-primary-4)] focus:border-[2px] focus:placeholder:text-[var(--color-support-6)] focus:caret-[var(--color-support-6)]"
              required
            />
            {errors.name && (
              <p className="text-[var(--color-support-2)] text-[length:var(--xs-text)] font-[var(--fw-medium)] leading-[140%]">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="grid gap-[6px] focus-within:[&>label]:text-[var(--color-support-6)]">
            <Label
              htmlFor="password"
              className="text-[var(--color-support-5)] text-[length:var(--xs-text)] font-[var(--fw-medium)] leading-[140%] focus:text-[var(--color-support-6)]"
            >
              Password
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
              Confirm Password
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
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                className="w-[18px] h-[18px] rounded-[0.25rem] bg-[transparent] border-[1px] border-[var(--color-primary-3)] data-[state=checked]:text-[var(--color-white)] data-[state=checked]:bg-[var(--color-primary-3)] cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="font-[var(--fw-medium)] text-[var(--color-primary-3)] text-[length:var(--xs-text)] leading-[140%] cursor-pointer"
              >
                Remember me
              </label>
            </div>
            {/* <a
              href="#"
              className="font-[var(--fw-medium)] text-[var(--color-primary-3)] text-[length:var(--xs-text)] leading-[140%]"
              onClick={() => navigate('/forgot-password')}
            >
              Forgot password
            </a> */}
          </div>
        </div>
        <Button type="submit" className="h-[56px]" variant={'default'}>
          Sign in
        </Button>
      </div>
    </form>
  );
};

export default AccountActivation;
