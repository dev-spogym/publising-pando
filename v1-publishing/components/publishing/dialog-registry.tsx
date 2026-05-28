"use client";

import * as React from "react";
import { DialogShell } from "@/components/publishing/dialog-shell";
import { dialogBlueprints } from "@/app/data/docs4-sources";

interface PublishingDialogProps {
  dialogId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMockAction?: (label: string) => void;
}

export function PublishingDialog({ dialogId, open, onOpenChange, onMockAction }: PublishingDialogProps) {
  const blueprint = dialogBlueprints[dialogId];
  if (!blueprint) return null;
  return <DialogShell blueprint={blueprint} open={open} onOpenChange={onOpenChange} onMockAction={onMockAction} />;
}

export const publishingDialogIds = Object.keys(dialogBlueprints);

export default PublishingDialog;
