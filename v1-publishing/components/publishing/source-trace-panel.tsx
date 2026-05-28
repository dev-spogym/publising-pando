import * as React from "react";
import { SourceBadge } from "@/components/publishing/source-badge";
import type { PublishingSource } from "@/app/data/docs4-sources";

interface SourceTracePanelProps {
  sources: PublishingSource[];
  title?: string;
}

export function SourceTracePanel({ sources, title = "Source Trace" }: SourceTracePanelProps) {
  return (
    <aside className="rounded-2xl border bg-white/80 p-4 shadow-sm">
      <p className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">{title}</p>
      <div className="space-y-2">
        {sources.map((source) => (
          <div key={`${source.id}-${source.source}`} className="rounded-xl bg-slate-50/70 p-3">
            <SourceBadge source={source} />
            <p className="mt-1 text-[11px] leading-5 text-slate-500">{source.source}</p>
            {source.referenceVersion && source.referenceSource && (
              <p className="mt-0.5 text-[11px] leading-5 text-slate-400">↳ {source.referenceVersion}: {source.referenceSource}</p>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

export default SourceTracePanel;
