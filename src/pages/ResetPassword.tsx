import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResetPassword } from '@/hooks/useResetPassword';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { getUserDataOnAccountActivation } from '@/api/accountActivation';
import { Label } from '@/components/atom/Label';
import { Button } from '@/components/atom/Button';
import LinkExpired from '@/components/molecule/LinkExpired';
import PasswordInput from '@/components/molecule/PasswordInput';
import PasswordValidator from '@/components/molecule/PasswordValidator';

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

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resetPassword = useResetPassword();
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [showValidator, setShowValidator] = useState(false);
  const token = searchParams.get('token') || '';
  const [loading, setLoading] = useState(false);

  const { isError, isPending } = useQuery({
    queryKey: [token],
    queryFn: () => token && getUserDataOnAccountActivation(token),
    enabled: !!token,
    retry: false,
  });

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
    setLoading(true);
    setError('');
    resetPassword.mutate(
      { ...data, token },
      {
        onSuccess: () => {
          navigate('/login');
        },
        onError: error => {
          setError(error.message);
        },
        onSettled: () => setLoading(false),
      },
    );
  };

  if (isPending) {
    return;
  }

  if (isError) {
    return <LinkExpired />;
  }

  return (
    <form className={cn('flex flex-col gap-[3.25rem]')} onSubmit={handleSubmit(onSubmit)}>
      <div>
        <p className="text-support-6 text-4xl font-bold leading-[120%]">
          Reset Password
        </p>
      </div>
      <div className="grid gap-[2.25rem]">
        <div className="grid gap-[1rem]">
          <div className="grid gap-[4px] focus-within:[&>label]:text-support-6">
            <Label
              htmlFor="password"
              className="text-support-5 text-sm font-medium leading-[140%] focus:text-support-6 mb-0.5"
            >
              New Password
            </Label>
            <div className="relative">
              <PasswordInput
                id="password"
                type="password"
                placeholder="Enter Password"
                {...register('password', {
                  onChange: e => setPassword(e.target.value),
                })}
                onFocus={() => setShowValidator(true)}
                onBlur={() => trigger('password')}
                className="h-[56px] pl-[22px] pr-[42px]"
              />
              <PasswordValidator password={password} show={showValidator} />
            </div>
          </div>
          <div className="grid gap-[4px] focus-within:[&>label]:text-support-6">
            <Label
              htmlFor="confirmPassword"
              className="text-support-5 text-sm font-medium leading-[140%] focus:text-support-6 mb-0.5"
            >
              Confirm New Password
            </Label>
            <PasswordInput
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              {...register('confirmPassword')}
              onBlur={() => trigger('confirmPassword')}
              onFocus={() => setShowValidator(false)}
              className="h-[56px] pl-[22px] pr-[42px]"
            />
            {errors.confirmPassword && (
              <p className="text-support-2 text-sm font-normal leading-[140%]">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
        <Button type="submit" className="h-[56px]" variant={'default'} disabled={loading}>
          <div className="flex gap-2 items-center justify-center">
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : null} Reset Password
          </div>
        </Button>
        {error && (
          <p className="text-support-2 text-sm font-normal leading-[140%]">
            {error}
          </p>
        )}
      </div>
    </form>
  );
};

export default ResetPassword;

