import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/app/lib/utils";
import type { PublishingSource } from "@/app/data/docs4-sources";

interface SourceBadgeProps {
  source: PublishingSource;
  compact?: boolean;
  className?: string;
}

const statusLabel: Record<NonNullable<PublishingSource["status"]>, string> = {
  base: "기준",
  reference: "참고",
  "policy-pending": "정책 확인",
  "external-pending": "외부연동 확인",
};

// admin-pando 커스텀 Badge variant 매핑:
// - V2/reference -> secondary (보라/회색 톤)
// - V1 base -> info (파랑)
// - status별 추가: policy-pending=warning, external-pending=destructive
function versionVariant(source: PublishingSource): "secondary" | "info" {
  const isV2 = source.version === "V2" || source.referenceVersion === "V2";
  return isV2 ? "secondary" : "info";
}

function statusVariant(status: PublishingSource["status"]): "outline" | "warning" | "destructive" {
  if (status === "policy-pending") return "warning";
  if (status === "external-pending") return "destructive";
  return "outline";
}

export function SourceBadge({ source, compact = false, className }: SourceBadgeProps) {
  const status = source.status ?? "base";
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)} title={source.source}>
      <Badge variant={versionVariant(source)}>
        {source.version} {statusLabel[status]}
      </Badge>
      <Badge variant={statusVariant(source.status)}>{source.id}</Badge>
      {!compact && <span className="text-[11px] font-semibold text-slate-600">{source.label}</span>}
      {!compact && source.referenceVersion && source.referenceVersion !== source.version && (
        <Badge variant="outline">{source.referenceVersion} 참고</Badge>
      )}
    </div>
  );
}

export default SourceBadge;
