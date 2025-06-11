import { useState } from 'react';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { cn } from '@/utils/cn';
import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
import { Checkbox } from '@/components/atom/Checkbox';
import { useLogin } from '@/hooks/useLogin';
import useAuthStore from '@/stores/authStore';
import { Loader2 } from 'lucide-react';
import PasswordInput from '@/components/molecule/PasswordInput';

const passwordSchema = z.string().min(1, 'Password is required');

const schema = z.object({
  email: z.string().min(1, 'Email address is required').email('Enter a valid email address.'),
  password: passwordSchema,
  remember: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useLogin();
  const { auth } = useAuthStore();

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
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const remember = watch('remember');

  const onSubmit = (data: FormData) => {
    setServerError('');
    setLoading(true);

    login.mutate(data, {
      onSuccess: response => {
        console.log(response)
        const { user, tokens } = response;
        auth(user, tokens);
        navigate('/dashboard');
      },
      onError: error => {
        console.log(error)
        setServerError(error.message);
      },
      onSettled: () => setLoading(false),
    });
  };

  return (
    <form className={cn('flex flex-col gap-[3.25rem]')} onSubmit={handleSubmit(onSubmit)}>
      <div>
        <p className="text-[var(--color-support-6)] text-[length:var(--xl-text)] font-[var(--fw-bold)] leading-[120%]">
          Welcome Back!
        </p>
      </div>
      <div className="grid gap-[2.25rem]">
        <div className="grid gap-[1rem]">
          <div className="grid gap-[4px] focus-within:[&>label]:text-[var(--color-support-6)]">
            <Label
              htmlFor="email"
              className="text-[var(--color-support-5)] text-[length:var(--xs-text)] font-[var(--fw-medium)] leading-[140%] focus:text-[var(--color-support-6)] mb-0.5"
            >
              Email
            </Label>
            <Input
              id="email"
              placeholder="m@example.com"
              {...register('email')}
              onBlur={() => trigger('email')}
              className="h-[56px] px-[22px]"
            />
            {errors.email && (
              <p className="text-[var(--color-support-2)] text-[length:var(--xs-text)] font-[var(--fw-normal)] leading-[140%]">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-[4px] focus-within:[&>label]:text-[var(--color-support-6)]">
            <Label
              htmlFor="password"
              className="text-[var(--color-support-5)] text-[length:var(--xs-text)] font-[var(--fw-medium)] leading-[140%] focus:text-[var(--color-support-6)]  mb-0.5"
            >
              Password
            </Label>
            <PasswordInput
              id="password"
              type="password"
              placeholder="Enter Password"
              {...register('password')}
              onBlur={() => trigger('password')}
              className="h-[56px] pl-[22px] pr-[42px]"
            />
            {errors.password && (
              <p className="text-[var(--color-support-2)] text-[length:var(--xs-text)] font-[var(--fw-normal)] leading-[140%]">
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-[var(--color-support-2)] text-[length:var(--xs-text)] font-[var(--fw-normal)] leading-[140%]">
              {serverError}
            </p>
          )}

          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={!!remember}
                onCheckedChange={checked => setValue('remember', !!checked)}
                className="w-[18px] h-[18px] rounded-[0.25rem] bg-[transparent] border-[1px] border-[var(--color-primary-3)] data-[state=checked]:text-[var(--color-white)] data-[state=checked]:bg-[var(--color-primary-3)] cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="font-[var(--fw-medium)] text-[var(--color-primary-3)] text-[length:var(--xs-text)] leading-[140%] cursor-pointer"
              >
                Remember me
              </label>
            </div>
            <a
              href="#"
              className="font-[var(--fw-medium)] text-[var(--color-primary-3)] text-[length:var(--xs-text)] leading-[140%]"
              onClick={() => navigate('/forgot-password')}
            >
              Forgot password
            </a>
          </div>
        </div>
        <Button
          type="submit"
          className="h-[56px] flex justify-center items-center"
          variant="default"
          disabled={loading}
        >
          <div className="flex gap-2 items-center justify-center">
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : null} Sign in
          </div>
        </Button>
      </div>
    </form>
  );
};

export default LoginPage;

