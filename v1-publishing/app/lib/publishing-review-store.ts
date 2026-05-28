"use client";

// 퍼블리싱 검수 모드 상태 store.
// admin-pando는 zustand를 쓰지만, v1-publishing은 prototype-app.tsx의 role/branch 패턴(localStorage + EventTarget + useSyncExternalStore)을 그대로 따른다.

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "pando-publishing-review-mode";
const EVENT_NAME = "pando-publishing-review-change";

function readEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "1";
}

function emitChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(EVENT_NAME));
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT_NAME, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT_NAME, callback);
  };
}

export function usePublishingReviewMode(): boolean {
  return useSyncExternalStore(subscribe, readEnabled, () => false);
}

export function togglePublishingReviewMode() {
  if (typeof window === "undefined") return;
  const next = !readEnabled();
  window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  emitChange();
}

export function setPublishingReviewMode(enabled: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
  emitChange();
}
