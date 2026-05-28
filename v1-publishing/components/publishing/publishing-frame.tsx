"use client";

import * as React from "react";
import { SourceBadge } from "@/components/publishing/source-badge";
import { usePublishingReviewMode } from "@/app/lib/publishing-review-store";
import { cn } from "@/app/lib/utils";
import type { PublishingSource } from "@/app/data/docs4-sources";

interface PublishingFrameProps {
  source: PublishingSource;
  children: React.ReactNode;
  className?: string;
  labelPosition?: "left" | "right";
}

export function PublishingFrame({ source, children, className, labelPosition = "right" }: PublishingFrameProps) {
  const enabled = usePublishingReviewMode();
  if (!enabled) return <>{children}</>;

  return (
    <div
      className={cn("relative rounded-[22px] border border-dashed border-sky-300/80 p-1.5", className)}
      data-publishing-source={source.id}
    >
      <div className={cn("absolute z-20 -top-3", labelPosition === "right" ? "right-3" : "left-3")}>
        <div className="rounded-full border border-sky-200 bg-white/95 px-2 py-0.5 shadow-sm backdrop-blur">
          <SourceBadge source={source} compact />
        </div>
      </div>
      {children}
    </div>
  );
}

export default PublishingFrame;
