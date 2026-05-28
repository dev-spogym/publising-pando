import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/app/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold w-fit whitespace-nowrap shrink-0 gap-1", {
  variants: {
    variant: {
      default: "border-primary/30 bg-primary-light text-primary",
      secondary: "border-line bg-surface-tertiary text-content-secondary",
      destructive: "border-error/30 bg-error/10 text-error",
      outline: "border-line/80 bg-white/80 text-content-secondary",
      success: "border-success/30 bg-success/10 text-success",
      warning: "border-warning/30 bg-warning/10 text-warning",
      info: "border-info/30 bg-info/10 text-info"
    }
  },
  defaultVariants: { variant: "default" }
});

function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
