import * as React from "react";
import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface DialogPolicyBannerProps {
  tone?: "warning" | "info" | "danger" | "success";
  title: string;
  children: React.ReactNode;
}

const toneClass: Record<NonNullable<DialogPolicyBannerProps["tone"]>, string> = {
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  info: "border-sky-200 bg-sky-50 text-sky-900",
  danger: "border-rose-200 bg-rose-50 text-rose-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
};

export function DialogPolicyBanner({ tone = "info", title, children }: DialogPolicyBannerProps) {
  const Icon = tone === "warning" ? AlertTriangle : tone === "danger" ? ShieldAlert : tone === "success" ? CheckCircle2 : Info;
  return (
    <div className={cn("rounded-2xl border px-4 py-3 text-[12px] leading-5", toneClass[tone])}>
      <div className="mb-1 flex items-center gap-1.5 font-bold">
        <Icon className="size-3.5" />
        {title}
      </div>
      <div className="opacity-80">{children}</div>
    </div>
  );
}

export default DialogPolicyBanner;
