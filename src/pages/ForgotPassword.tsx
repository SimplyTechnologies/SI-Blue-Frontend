import { useState } from 'react';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { cn } from '@/utils/cn';
import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
import Auth from '@/layouts/Auth';

const schema = z.object({
  email: z.string().email({
    message: 'Invalid email address.',
  }),
});

type FormData = z.infer<typeof schema>;

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

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

  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const onSubmit = (data: FormData) => {
    setEmail(data.email);
    setSuccess(true);
    console.log(data);
  };

  return (
    <Auth>
      <form className={cn('flex flex-col gap-[3.25rem]')} onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-[1rem]">
          <p className="text-[var(--color-support-6)] text-[length:var(--xl-text)] font-[var(--fw-bold)] leading-[120%]">
            Forgot Password
          </p>
          <p className="text-[var(--color-support-5)] text-[length:var(--sm-text)] font-[var(--fw-regular)] leading-[140%]">
            {success ? (
              <>
                We’ve just sent an email to{' '}
                <span className="font-[var(--fw-medium)] text-[var(--color-support-9)]">{email}</span>. If the email
                doesn’t show up soon, check your spam folder.
              </>
            ) : (
              'Enter your email account to reset your password'
            )}
          </p>
        </div>
        <div className="grid gap-[2.25rem]">
          <div className={`${success ? 'hidden' : 'grid gap-[1rem]'}`}>
            <div className="grid gap-[6px] focus-within:[&>label]:text-[var(--color-support-6)]">
              <Label
                htmlFor="email"
                className="text-[var(--color-support-5)] text-[length:var(--xs-text)] font-[var(--fw-medium)] leading-[140%] focus:text-[var(--color-support-6)]"
              >
                Your Email
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
          </div>
          <Button
            type="submit"
            className="h-[56px]"
            variant={'default'}
            onClick={() => {
              if (success) navigate('/login');
            }}
          >
            {success ? 'Back to Sign In' : 'Send Reset Link'}
          </Button>
          <div className={`${success ? 'hidden' : 'relative text-center text-[length:var(--sm-text)] h-[22px]'}`}>
            <div className="absolute inset-0 top-1/2 z-0 border-t border-[#EAEAEA] w-full" />
            <span className="relative z-10 inline-block bg-background px-2 text-[var(--color-support-6)]">Or</span>
          </div>
          <Button
            className={`${success ? 'hidden' : 'h-[56px]'}`}
            variant={'outline'}
            onClick={() => navigate('/login')}
          >
            Back to Sign In
          </Button>
        </div>
      </form>
    </Auth>
  );
};

export default ForgotPassword;
