import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { getUserDataOnAccountActivation } from '@/api/accountActivation';
import useAuthStore from '@/stores/useAuthStore';
import { useActivateAccount } from '@/hooks/useActivateAccount';
import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
import { Checkbox } from '@/components/atom/Checkbox';
import LinkExpired from '@/components/molecule/LinkExpired';
import PasswordInput from '@/components/molecule/PasswordInput';
import PasswordValidator from '@/components/molecule/PasswordValidator';
import AnimatedDotsLoader from '@/components/molecule/AnimatedDotsLoader';
import { ActiveUserIcon } from '@/assets/svgIconComponents/ActiveUserIcon';

const passwordSchema = z
  .string()
  .min(1, 'Password is required')
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
    email: z.string().min(1, 'Email address is required').email({
      message: 'Enter a valid email address.',
    }),
    password: passwordSchema,
    confirmPassword: z.string(),
    remember: z.boolean().optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type FormData = z.infer<typeof schema>;

const AccountActivation: React.FC = () => {
  const navigate = useNavigate();
  const activateAccount = useActivateAccount();
  const { auth } = useAuthStore();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { data, isError, isPending } = useQuery({
    queryKey: ['userData', token],
    queryFn: () => token && getUserDataOnAccountActivation(token),
    enabled: !!token,
    retry: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: { remember: false },
  });

  const [loading, setLoading] = useState(false);
  const [showValidator, setShowValidator] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [serverError, setServerError] = useState('');
  const [password, setPassword] = useState('');

  const remember = watch('remember');

  const onSubmit = (data: FormData) => {
    setServerError('');
    if (!token) {
      setServerError('Invalid token');
      return;
    }

    setLoading(true);

    activateAccount.mutate(
      { password: data.password, confirmPassword: data.confirmPassword, token, remember: data.remember },
      {
        onSuccess: response => {
          const { user, tokens } = response;
          auth(user, tokens);
          navigate('/dashboard');
        },
        onError: error => {
          setServerError(error.message);
        },
        onSettled: () => setLoading(false),
      },
    );
  };

  useEffect(() => {
    if (data?.user?.isActive) {
      const timeout = setTimeout(() => navigate('/login'), 3000);
      return () => clearTimeout(timeout);
    }

    if (data?.user?.firstName && data?.user?.lastName && data?.user?.email) {
      setValue('email', data.user.email);
      setValue('name', data.user.firstName + ' ' + data.user.lastName);
    }
  }, [data]);

  if (isError) {
    return <LinkExpired />;
  }

  if (data?.user?.isActive) {
    return (
      <div>
        <div className="w-[100px] h-[100px] mb-[63px]">
          <ActiveUserIcon />
        </div>
        <div className="text-primary text-4xl font-bold leading-[1.2] mb-[58px]">Account Already activated</div>
        <div className="text-primary text-4xl leading-[1.4] mb-[29px]">Hold on!</div>
        <div className="flex gap-[80px] items-center">
          <p className="text-primary text-sm font-medium leading-[1.4]">You’re being redirected to another page</p>
          <AnimatedDotsLoader />
        </div>
      </div>
    );
  }

  if (isPending) {
    return;
  }

  return (
    <form className={cn('flex flex-col gap-[3.25rem]')} onSubmit={handleSubmit(onSubmit)}>
      <div>
        <p className="text-support-6 text-4xl font-bold leading-[120%]">Account Activation</p>
      </div>
      <div className="grid gap-[2.25rem]">
        <div className="grid gap-[1rem] flex-grow overflow-y-auto scroll-smooth max-h-[calc(90vh_-_200px)] pr-2">
          <div className="grid gap-[4px] focus-within:[&>label]:text-support-6">
            <Label
              htmlFor="email"
              className="text-support-5 text-sm font-medium leading-[140%] focus:text-support-6 mb-0.5"
            >
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register('email')}
              onBlur={() => trigger('email')}
              disabled={true}
              className="h-[56px] px-[22px]"
            />
            {errors.email && (
              <p className="text-support-2 text-sm font-normal leading-[140%]">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-[4px] focus-within:[&>label]:text-support-6">
            <Label
              htmlFor="name"
              className="text-support-5 text-sm font-medium leading-[140%] focus:text-support-6 mb-0.5"
            >
              Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              disabled={true}
              {...register('name')}
              onBlur={() => trigger('name')}
              className="h-[56px] px-[22px]"
            />
            {errors.name && (
              <p className="text-support-2 text-sm font-normal leading-[140%]">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="grid gap-[1rem]">
            <div className="grid gap-[4px] focus-within:[&>label]:text-support-6">
              <Label
                htmlFor="password"
                className="text-support-5 text-sm font-medium leading-[140%] focus:text-support-6 mb-0.5"
              >
                Password
              </Label>
              <div className="relative">
                <PasswordInput
                  id="password"
                  type="password"
                  placeholder="Enter Password"
                  {...register('password', {
                    onChange: e => setPassword(e.target.value),
                  })}
                  onFocus={() => {setIsPasswordFocused(true); setShowValidator(true)}}
                  onBlur={() => {setIsPasswordFocused(false); trigger('password')}}
                  className="h-[56px] pl-[22px] pr-[42px]"
                />
                <PasswordValidator password={password} show={showValidator} isPasswordFocused={isPasswordFocused} />
              </div>
            </div>
            <div className="grid gap-[4px] focus-within:[&>label]:text-support-6">
              <Label
                htmlFor="confirmPassword"
                className="text-support-5 text-sm font-medium leading-[140%] focus:text-support-6 mb-0.5"
              >
                Confirm Password
              </Label>
              <PasswordInput
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                {...register('confirmPassword')}
                onBlur={() => trigger('confirmPassword')}
                className="h-[56px] pl-[22px] pr-[42px]"
              />
              {errors.confirmPassword && (
                <p className="text-support-2 text-sm font-normal leading-[140%]">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {serverError && (
            <p className="text-support-2 text-sm font-medium leading-[140%]">{serverError}</p>
          )}
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={!!remember}
                onCheckedChange={checked => setValue('remember', !!checked)}
                className="w-[18px] h-[18px] rounded-[0.25rem] bg-[transparent] border-[1px] border-primary-3 data-[state=checked]:text-white data-[state=checked]:bg-primary-3 cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="font-medium text-primary-3 text-sm leading-[140%] cursor-pointer"
              >
                Remember me
              </label>
            </div>
          </div>
        </div>
        <Button type="submit" className="h-[56px]" variant="default" disabled={loading}>
          <div className="flex gap-2 items-center justify-center">
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : null} Sign in
          </div>
        </Button>
      </div>
    </form>
  );
};

export default AccountActivation;
