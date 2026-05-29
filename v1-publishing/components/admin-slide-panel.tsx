"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/app/lib/utils";

export function AdminSlidePanel({
  open,
  onClose,
  eyebrow,
  title,
  children,
  footer,
  size = "md",
  testId,
}: {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  testId?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const widthClass = {
    sm: "max-w-[360px]",
    md: "max-w-[520px]",
    lg: "max-w-[640px]",
    xl: "max-w-[800px]",
  }[size];

  return (
    <div className="fixed inset-0 z-[9999]" data-testid={testId}>
      <button className="absolute inset-0 h-full w-full cursor-default bg-black/30 backdrop-blur-[1px]" aria-label="패널 닫기" onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "absolute right-0 top-0 flex h-full w-[92vw] flex-col border-l border-line bg-white shadow-2xl",
          "animate-in slide-in-from-right duration-300 ease-out",
          widthClass,
        )}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-6 py-4">
          <div>
            {eyebrow && <p className="text-[11px] font-black uppercase tracking-[0.14em] text-primary">{eyebrow}</p>}
            <h3 className="mt-0.5 text-[18px] font-black text-content">{title}</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="닫기"><X size={16} /></Button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto bg-surface-secondary/40 px-6 py-5">{children}</div>
        {footer && <footer className="flex shrink-0 justify-end gap-2 border-t border-line bg-white px-6 py-4">{footer}</footer>}
      </aside>
    </div>
  );
}
