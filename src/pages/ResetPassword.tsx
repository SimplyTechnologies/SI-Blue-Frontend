import { cn } from '@/utils/cn';
import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';

const ResetPassword: React.FC = () => {
  return (
    <form className={cn('flex flex-col gap-[3.25rem]')}>
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
              className="h-[56px] rounded-[0.5rem] border-[1px] border-[var(--color-support-8)] pl-[22px] placeholder:text-[var(--color-support-7)] placeholder:text-[length:var(--sm-text)] caret-[var(--color-support-8)] focus:border-[var(--color-primary-4)] focus:border-[2px] focus:placeholder:text-[var(--color-support-6)] focus:caret-[var(--color-support-6)]"
              required
            />
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
              className="h-[56px] rounded-[0.5rem] border-[1px] border-[var(--color-support-8)] pl-[22px] placeholder:text-[var(--color-support-7)] placeholder:text-[length:var(--sm-text)] caret-[var(--color-support-8)] focus:border-[var(--color-primary-4)] focus:border-[2px] focus:placeholder:text-[var(--color-support-6)] focus:caret-[var(--color-support-6)]"
              required
            />
          </div>
        </div>
        <Button
          type="submit"
          className="h-[56px]"
          variant={'default'}
        >
          Reset Password
        </Button>
      </div>
    </form>
  );
};

export default ResetPassword;
