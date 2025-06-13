import { Root, Indicator } from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"
import { cn } from "@/utils/cn"


function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof Root>) {
  return (
    <Root
      data-slot="checkbox"
      className={cn(
        className
      )}
      {...props}
    >
      <Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </Indicator>
    </Root>
  )
}

export { Checkbox }
