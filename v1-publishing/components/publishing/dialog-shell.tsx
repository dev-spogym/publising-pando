"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SourceBadge } from "@/components/publishing/source-badge";
import { DialogPolicyBanner } from "@/components/publishing/dialog-policy-banner";
import { cn } from "@/app/lib/utils";
import type { DialogActionSpec, DialogBlueprint, DialogSectionSpec } from "@/app/data/docs4-sources";

interface DialogShellProps {
  blueprint: DialogBlueprint;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMockAction?: (label: string) => void;
}

function sectionClass(tone: DialogSectionSpec["tone"]) {
  if (tone === "warning") return "border-amber-200 bg-amber-50/60";
  if (tone === "danger") return "border-rose-200 bg-rose-50/60";
  if (tone === "success") return "border-emerald-200 bg-emerald-50/60";
  if (tone === "info") return "border-sky-200 bg-sky-50/70";
  return "border-slate-200 bg-white/80";
}

// admin-pando custom Button variant -> v1-publishing shadcn Button variant
function actionVariant(variant: DialogActionSpec["variant"]): React.ComponentProps<typeof Button>["variant"] {
  if (variant === "primary") return "default";
  if (variant === "danger") return "destructive";
  if (variant === "secondary") return "secondary";
  if (variant === "ghost") return "ghost";
  return "outline";
}

export function DialogShell({ blueprint, open, onOpenChange, onMockAction }: DialogShellProps) {
  const { source } = blueprint;
  const handleAction = (label: string) => {
    onMockAction?.(`${source.id} · ${label} 처리`);
    if (!["이전", "기존 회원 이동", "강제 등록"].includes(label)) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {source.id} {source.label}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-2xl border border-blue-200/60 bg-blue-50/60 p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <SourceBadge source={source} />
              {blueprint.entryRoute && (
                <span className="font-mono text-[11px] text-slate-500">entry: {blueprint.entryRoute}</span>
              )}
            </div>
            <p className="text-[13px] leading-6 text-slate-600">{blueprint.purpose}</p>
          </div>

          {blueprint.rolePolicy && (
            <DialogPolicyBanner title="역할/권한 표시" tone="info">
              {blueprint.rolePolicy}
            </DialogPolicyBanner>
          )}
          {blueprint.backendPolicy && (
            <DialogPolicyBanner title="화면 계약 범위" tone={source.status === "policy-pending" ? "warning" : "info"}>
              {blueprint.backendPolicy}
            </DialogPolicyBanner>
          )}

          <div className="grid gap-3">
            {blueprint.sections.map((section) => (
              <section key={section.title} className={cn("rounded-2xl border p-4", sectionClass(section.tone))}>
                <div className="mb-2">
                  <h3 className="text-[14px] font-bold text-slate-950">{section.title}</h3>
                  {section.description && (
                    <p className="mt-0.5 font-mono text-[11px] text-slate-500">{section.description}</p>
                  )}
                </div>
                {section.fields && (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {section.fields.map((field) => (
                      <label key={field.label} className="block rounded-xl border border-slate-200/70 bg-white/80 px-3 py-2">
                        <span className="mb-1 flex items-center gap-1 text-[11px] font-bold text-slate-600">
                          {field.label}
                          {field.required && <span className="text-blue-600">필수</span>}
                        </span>
                        {field.type === "textarea" ? (
                          <div className="min-h-[62px] rounded-lg bg-slate-100 px-2 py-1 text-[12px] text-slate-500">
                            {field.hint ?? "입력 영역"}
                          </div>
                        ) : (
                          <div className="text-[13px] font-semibold text-slate-950">
                            {field.value ?? field.hint ?? "입력/선택 UI"}
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                )}
                {section.items && (
                  <ul className="space-y-1 text-[12px] leading-5 text-slate-600">
                    {section.items.map((item) => (
                      <li key={item} className="flex gap-1">
                        <span>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-[11px] text-slate-500">목데이터 상태 · 버튼/토스트 동작 확인용</div>
          <div className="flex flex-wrap justify-end gap-2">
            {blueprint.actions.map((action) => (
              <Button
                key={action.label}
                variant={actionVariant(action.variant)}
                size="sm"
                onClick={() => handleAction(action.label)}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DialogShell;
