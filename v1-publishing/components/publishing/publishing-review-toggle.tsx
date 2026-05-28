"use client";

import * as React from "react";
import { ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePublishingReviewMode, togglePublishingReviewMode } from "@/app/lib/publishing-review-store";
import { cn } from "@/app/lib/utils";

interface PublishingReviewToggleProps {
  className?: string;
}

export function PublishingReviewToggle({ className }: PublishingReviewToggleProps) {
  const enabled = usePublishingReviewMode();
  return (
    <div className={cn("group relative", className)}>
      <Button
        type="button"
        size="sm"
        variant={enabled ? "default" : "outline"}
        aria-pressed={enabled}
        aria-label="퍼블리싱 검수 모드"
        onClick={togglePublishingReviewMode}
        className={cn(
          "gap-2",
          enabled && "bg-sky-100 text-sky-700 ring-1 ring-sky-200 hover:bg-sky-100"
        )}
      >
        <ScanSearch className="size-4" />
        <span className="hidden lg:inline">검수 모드</span>
      </Button>
      <span className="pointer-events-none absolute -bottom-8 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100">
        퍼블리싱 검수 모드
      </span>
    </div>
  );
}

export default PublishingReviewToggle;
