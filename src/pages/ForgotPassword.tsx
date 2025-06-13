import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForgotPassword } from '@/hooks/useForgotPassword';
import { cn } from '@/utils/cn';
import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
import { Loader2 } from 'lucide-react';

const schema = z.object({
  email: z.string().email({
    message: 'Invalid email address.',
  }),
});

type FormData = z.infer<typeof schema>;

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const forgotPasswordMutation = useForgotPassword();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, trigger } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onBlur',
  });

  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>('');

  const onSubmit = (data: FormData) => {
    setLoading(true);
    forgotPasswordMutation.mutate(
      { email: data.email },
      {
        onSuccess: () => {
          setEmail(data.email);
          setSuccess(true);
        },
        onError: error => {
          setError(error.message);

          console.error('Forgot password error', error.message);
        },
        onSettled: () => setLoading(false),
      },
    );
  };

  return (
    <form className={cn('flex flex-col gap-[3.25rem]')} onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-[1rem]">
        <p className="text-[var(--color-support-6)] text-[length:var(--xl-text)] font-[var(--fw-bold)] leading-[120%]">
          Forgot Password
        </p>
        <p className="text-[var(--color-support-5)] text-[length:var(--sm-text)] font-[var(--fw-regular)] leading-[140%]">
          {success ? (
            <>
              We’ve just sent an email to{' '}
              <span className="font-[var(--fw-medium)] text-[var(--color-support-9)]">{email}</span>. Please check your
              inbox and follow the instructions to reset your password. The link will expire in 10 minutes.
            </>
          ) : (
            'Enter your email account to reset your password'
          )}
        </p>
      </div>
      <div className="grid gap-[2.25rem]">
        <div className={`${success ? 'hidden' : 'grid gap-[1rem]'}`}>
          <div className="grid gap-[4px] focus-within:[&>label]:text-[var(--color-support-6)]">
            <Label
              htmlFor="email"
              className="text-[var(--color-support-5)] text-[length:var(--xs-text)] font-[var(--fw-medium)] leading-[140%] focus:text-[var(--color-support-6)] mb-0.5"
            >
              Your Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register('email')}
              onBlur={() => trigger('email')}
              className="h-[56px] px-[22px]"
            />

            {error && (
              <p className="text-[var(--color-support-2)] text-[length:var(--xs-text)] font-[var(--fw-normal)] leading-[140%]">
                {error}
              </p>
            )}
          </div>
        </div>
        <Button
          type={success ? 'button' : 'submit'}
          className="h-[56px] flex justify-center items-center"
          variant={'default'}
          disabled={loading}
          onClick={() => {
            if (success) navigate('/login');
          }}
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : success ? 'Back to Sign In' : 'Send Reset Link'}
        </Button>
        <div className={`${success ? 'hidden' : 'relative text-center text-[length:var(--sm-text)] h-[22px]'}`}>
          <div className="absolute inset-0 top-1/2 z-0 border-t border-[#EAEAEA] w-full" />
          <span className="relative z-10 inline-block bg-[var(--color-bg-1)] px-2 text-[var(--color-support-6)]">
            Or
          </span>
        </div>
        <Button className={`${success ? 'hidden' : 'h-[56px]'}`} variant={'outline'} onClick={() => navigate('/login')}>
          Back to Sign In
        </Button>
      </div>
    </form>
  );
};

export default ForgotPassword;

