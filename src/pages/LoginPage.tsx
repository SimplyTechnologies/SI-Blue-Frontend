import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { cn } from '@/utils/cn';
import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
import { Checkbox } from '@/components/atom/Checkbox';
import { useLogin } from '@/hooks/useLogin';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useLogin();

  type FormData = {
    email: string;
    password: string;
  };

  const { register, handleSubmit } = useForm<FormData>();
  const [serverError, setServerError] = useState('');

  const onSubmit = (data: FormData) => {
    setServerError('');
    login.mutate(data, {
      onSuccess: () => {
        navigate('/dashboard');
      },
      onError: error => {
        setServerError(error.message);
      },
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
          <div className="grid gap-[6px] focus-within:[&>label]:text-[var(--color-support-6)]">
            <Label
              htmlFor="email"
              className="text-[var(--color-support-5)] text-[length:var(--xs-text)] font-[var(--fw-medium)] leading-[140%] focus:text-[var(--color-support-6)]"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register('email')}
              className="h-[56px] rounded-[0.5rem] border-[1px] border-[var(--color-support-8)] pl-[22px] placeholder:text-[var(--color-support-7)] placeholder:text-[length:var(--sm-text)] caret-[var(--color-support-8)] focus:border-[var(--color-primary-4)] focus:border-[2px] focus:placeholder:text-[var(--color-support-6)] focus:caret-[var(--color-support-6)]"
              required
            />
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
              className="h-[56px] rounded-[0.5rem] border-[1px] border-[var(--color-support-8)] pl-[22px] placeholder:text-[var(--color-support-7)] placeholder:text-[length:var(--sm-text)] caret-[var(--color-support-8)] focus:border-[var(--color-primary-4)] focus:border-[2px] focus:placeholder:text-[var(--color-support-6)] focus:caret-[var(--color-support-6)]"
              required
            />
          </div>

          {serverError && (
            <p className="text-[var(--color-support-2)] text-[length:var(--xs-text)] font-[var(--fw-medium)] leading-[140%]">
              {serverError}
            </p>
          )}

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
            <a
              href="#"
              className="font-[var(--fw-medium)] text-[var(--color-primary-3)] text-[length:var(--xs-text)] leading-[140%]"
              onClick={() => navigate('/forgot-password')}
            >
              Forgot password
            </a>
          </div>
        </div>
        <Button type="submit" className="h-[56px] " variant={'default'}>
          Sign in
        </Button>
      </div>
    </form>
  );
};

export default LoginPage;
