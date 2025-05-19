import { cn } from "@/utils/cn";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Label } from "@/components/shared/Label";
import { Checkbox } from "@/components/shared/Checkbox";
import carBg from "@/assets/carBackground.svg";
import carlifeLogo from "@/assets/carlifeLogo.svg";

const LoginPage: React.FC = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-start gap-2 md:justify-start">
          <img src={carlifeLogo} alt="carlifeLogo" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[450px]">
            <form className={cn("flex flex-col gap-[3.25rem]")}>
              <div>
                <h1 className="text-[var(--color-support-6)] text-[length:var(--xl-text)] font-[var(--fw-bold)] leading-[120%]">
                  Welcome Back!
                </h1>
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
                      className="h-[56px] rounded-[0.5rem] border-[1px] border-[var(--color-support-8)] pl-[22px] placeholder:text-[var(--color-support-7)] placeholder:text-[length:var(--sm-text)] caret-[var(--color-support-8)] focus:border-[var(--color-primary-4)] focus:border-[2px] focus:placeholder:text-[var(--color-support-6)] focus:caret-[var(--color-support-6)]"
                      required
                    />
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
                    <a
                      href="#"
                      className="font-[var(--fw-medium)] text-[var(--color-primary-3)] text-[length:var(--xs-text)] leading-[140%]"
                    >
                      Forgot password
                    </a>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-[56px] rounded-[0.5rem] bg-[var(--color-primary-3)] text-[var(--color-white)] font-[var(--fw-bold)] text-[18px] leading-[140%] cursor-pointer"
                >
                  Sign in
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={carBg}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default LoginPage;
