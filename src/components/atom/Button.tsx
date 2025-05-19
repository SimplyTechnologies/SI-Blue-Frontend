import { cn } from "@/utils/cn";

function Button({ className, ...props }: React.ComponentProps<"button">) {
  return <button data-slot="button" className={cn(className)} {...props} />;
}

export { Button };
