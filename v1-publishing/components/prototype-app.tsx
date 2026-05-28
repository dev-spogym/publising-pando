"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { AlertTriangle, Bell, Building2, CheckCircle2, ChevronRight, ClipboardCheck, Lock, LogOut, Menu, MessageSquare, Search, ShieldCheck, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { branches, dialogById, dialogs, getScreenSourceLabel, hasPermission, menuGroups, roleById, roles, screens, type DialogDefinition, type RoleId, type ScreenDefinition } from "@/app/data/registry";
import { getDialogContract, getScreenContract } from "@/app/data/contracts";
import { cn } from "@/app/lib/utils";
import { PublishingReviewToggle } from "@/components/publishing/publishing-review-toggle";

const defaultRole: RoleId = "OWNER";

type ToastTone = "success" | "warning" | "info";
type ToastState = { message: string; tone: ToastTone } | null;
type Notify = (message: string, tone?: ToastTone) => void;

const preferencesEvent = "pando-preferences-change";

function subscribePreferences(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(preferencesEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(preferencesEvent, callback);
  };
}

function emitPreferencesChange() {
  window.dispatchEvent(new Event(preferencesEvent));
}

function getRoleSnapshot(): RoleId {
  const savedRole = window.localStorage.getItem("pando-role") as RoleId | null;
  return savedRole && roleById.has(savedRole) ? savedRole : defaultRole;
}

function getBranchSnapshot() {
  const savedBranch = window.localStorage.getItem("pando-branch");
  return savedBranch && branches.includes(savedBranch) ? savedBranch : branches[0];
}

export function PrototypeApp({ initialRoute }: { initialRoute: string }) {
  const pathname = usePathname();
  const route = pathname === "/" ? initialRoute : pathname.replace(/\/$/, "") || "/login";
  const screen = screens.find((item) => item.route === route) ?? screens[0];
  const role = useSyncExternalStore(subscribePreferences, getRoleSnapshot, () => defaultRole);
  const branch = useSyncExternalStore(subscribePreferences, getBranchSnapshot, () => branches[0]);
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const setRole = (nextRole: RoleId) => {
    window.localStorage.setItem("pando-role", nextRole);
    emitPreferencesChange();
  };
  const setBranch = (nextBranch: string) => {
    window.localStorage.setItem("pando-branch", nextBranch);
    emitPreferencesChange();
  };

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const openDialog = (dialogId: string) => setActiveDialog(dialogId);
  const notify = (message: string, tone: ToastTone = "success") => setToast({ message, tone });

  if (screen.id === "SCR-100") {
    return (
      <>
        <LoginScreen role={role} branch={branch} setRole={setRole} setBranch={setBranch} openDialog={openDialog} notify={notify} />
        <RuntimeDialog dialogId={activeDialog} role={role} onClose={() => setActiveDialog(null)} notify={notify} />
        <Toast toast={toast} />
      </>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-hidden p-3 lg:p-4 text-content">
      <div className="app-shell-frame flex h-[calc(100dvh-1.5rem)] w-full overflow-hidden rounded-[28px] lg:h-[calc(100dvh-2rem)]">
        <Sidebar currentRoute={screen.route} role={role} />
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <Topbar screen={screen} role={role} branch={branch} setRole={setRole} setBranch={setBranch} openDialog={openDialog} notify={notify} />
          <main className="flex-1 overflow-auto px-6 pb-6 pt-4">
            <div className="mx-auto max-w-[1480px]">
              <AdminScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />
            </div>
          </main>
        </div>
      </div>
      <RuntimeDialog dialogId={activeDialog} role={role} onClose={() => setActiveDialog(null)} notify={notify} />
      <Toast toast={toast} />
    </div>
  );
}

function LoginScreen({ role, branch, setRole, setBranch, openDialog, notify }: { role: RoleId; branch: string; setRole: (role: RoleId) => void; setBranch: (branch: string) => void; openDialog: (id: string) => void; notify: (message: string, tone?: "success" | "warning" | "info") => void }) {
  const router = useRouter();
  const roleInfo = roleById.get(role)!;
  const [loginId, setLoginId] = useState("owner.gangnam");
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [step, setStep] = useState<"credential" | "twoFactor" | "passwordChange">("credential");
  const [otp, setOtp] = useState("");
  const canSubmit = loginId.includes(".") && password.length >= 6;
  const submitLogin = () => {
    if (!canSubmit) {
      notify("로그인 ID 형식과 비밀번호 6자 이상을 확인해주세요.", "warning");
      return;
    }
    if (role === "HQ_ADMIN" && step === "credential") {
      setStep("twoFactor");
      notify("본사 관리자 2FA 인증 단계로 이동합니다.", "info");
      return;
    }
    if (loginId.includes("temp") && step !== "passwordChange") {
      setStep("passwordChange");
      notify("첫 로그인 임시 비밀번호 변경 단계입니다.", "warning");
      return;
    }
    if (step === "twoFactor" && otp.length < 6) {
      notify("6자리 인증 코드를 입력해주세요.", "warning");
      return;
    }
    notify(`mock 로그인 완료: ${remember ? "로그인 유지" : "세션 로그인"}로 회원 목록 이동`);
    router.push("/members");
  };
  return (
    <main className="min-h-screen overflow-hidden p-8 text-content">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl grid-cols-[minmax(0,1fr)_480px] items-center gap-12">
        <section>
          <Badge variant="info" className="border-primary/30 bg-primary-light text-primary">SCR-100 · AUTH-01 · 직원 1명 = 계정 1개</Badge>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary to-accent text-white text-[20px] font-black shadow-[0_16px_32px_rgba(15,23,42,0.08)]">P</div>
            <div>
              <h1 className="text-5xl font-black tracking-tight text-content">Pando CRM Admin V1</h1>
              <p className="mt-1 text-[13px] font-semibold text-content-tertiary">Publishing Workspace · FitGenie 톤</p>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-[17px] leading-8 text-content-secondary">운영자가 매일 쓰는 고밀도 Admin 퍼블리싱입니다. 역할·지점·보안 상태에 따라 진입 후 보이는 메뉴와 액션이 달라집니다.</p>
          <div className="mt-8 grid max-w-3xl grid-cols-3 gap-3">
            {["Next + shadcn", "docs4/V1 기준", "API 없는 mock"].map((item) => <div key={item} className="app-panel rounded-2xl p-4 text-[13px] font-semibold text-content">{item}</div>)}
          </div>
          <div className="mt-8 grid max-w-3xl grid-cols-2 gap-3 text-[13px] text-content-secondary">
            {["5회 실패 잠금 30분", "2FA 추가 인증", "첫 로그인 PW 변경", "세션 만료 후 복귀"].map((item) => <div key={item} className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success" />{item}</div>)}
          </div>
        </section>
        <Card className="admin-surface bg-white text-content shadow-[0_32px_80px_rgba(15,23,42,0.1)]">
          <CardHeader>
            <CardTitle className="text-2xl">직원 로그인</CardTitle>
            <CardDescription>문서의 지점 선택, 보안 상태, 2FA, 임시 비밀번호 플로우를 mock으로 확인합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label>지점 선택</Label><BranchSelect branch={branch} setBranch={setBranch} /></div><div className="space-y-2"><Label>역할 선택</Label><RoleSelect role={role} setRole={setRole} /></div></div>
            <div className="space-y-2"><Label>로그인 ID</Label><Input value={loginId} onChange={(event) => setLoginId(event.target.value)} placeholder="owner.gangnam" />{loginId && !loginId.includes(".") && <p className="text-xs text-rose-600">직원 로그인 ID 형식 예: owner.gangnam</p>}</div>
            <div className="space-y-2"><Label>비밀번호</Label><div className="flex gap-2"><Input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} /><Button type="button" variant="outline" onClick={() => setShowPassword((value) => !value)}>{showPassword ? "숨김" : "표시"}</Button></div>{password && password.length < 6 && <p className="text-xs text-rose-600">비밀번호는 6자 이상이어야 합니다.</p>}</div>
            <label className="flex items-center gap-2 rounded-lg border bg-surface-secondary p-3 text-sm"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /> 로그인 상태 유지 <span className="ml-auto text-xs text-content-tertiary">refresh token mock</span></label>
            {step === "twoFactor" && <div className="rounded-xl border border-blue-200 bg-blue-50 p-3"><Label>2단계 인증 코드</Label><Input className="mt-2 bg-white" value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="123456" /><p className="mt-2 text-xs text-blue-700">코드 만료/불일치 상태는 toast로 확인합니다.</p></div>}
            {step === "passwordChange" && <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">첫 로그인 임시 비밀번호 상태입니다. 실제 개발 시 비밀번호 변경 화면을 먼저 통과해야 합니다.</div>}
            <div className="rounded-lg border bg-surface-secondary p-3 text-sm text-content-secondary"><b className="text-content">{roleInfo.label}</b> · {roleInfo.branchScope}<br />{roleInfo.description}</div>
            <Button className="w-full" size="lg" onClick={submitLogin}>로그인</Button>
            <div className="grid grid-cols-2 gap-2"><Button variant="outline" onClick={() => notify("비밀번호 재설정 메일 발송 mock", "info")}>비밀번호 재설정</Button><Button data-dialog-id="DLG-000" variant="outline" onClick={() => openDialog("DLG-000")}>세션 만료 보기</Button></div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Sidebar({ currentRoute, role }: { currentRoute: string; role: RoleId }) {
  const roleInfo = roleById.get(role)!;
  const [sidebarQuery, setSidebarQuery] = useState("");

  // admin-pando 사이드바 구조 — 본부 관리 → 대시보드/도메인 그룹
  const hqMenu: { id: string; label: string }[] = [
    { id: "SCR-094", label: "통합 대시보드" },
    { id: "SCR-092", label: "지점 관리" },
    { id: "SCR-093", label: "지점 비교 리포트" },
    { id: "SCR-099", label: "자동 리포트" },
    { id: "SCR-H1001", label: "자동화 정책" },
    { id: "SCR-060", label: "전체 직원 관리" },
    { id: "SCR-097", label: "히스토리 로그" },
    { id: "SCR-084", label: "구독 관리" },
    { id: "SCR-H1002", label: "커스텀 대시보드" },
    { id: "SCR-H1003", label: "벤치마크 비교" },
    { id: "SCR-H1004", label: "예측 분석" },
    { id: "SCR-H1005", label: "NPS 설문" },
  ];

  const dashboardGroup: { id: string; label: string }[] = [
    { id: "SCR-090", label: "지점 대시보드" },
    { id: "SCR-098", label: "오늘의 할 일" },
    { id: "SCR-095", label: "KPI 센터" },
  ];

  // domain별 그룹 (D02~D11)
  const domainOrder: { id: DomainId; label: string }[] = [
    { id: "D02", label: "회원관리" },
    { id: "D03", label: "매출관리" },
    { id: "D04", label: "수업관리" },
    { id: "D05", label: "상품관리" },
    { id: "D06", label: "시설관리" },
    { id: "D07", label: "직원관리" },
    { id: "D08", label: "마케팅" },
    { id: "D09", label: "설정관리" },
    { id: "D11", label: "통합운영" },
  ];

  const matchesQuery = (label: string) => !sidebarQuery || label.includes(sidebarQuery);

  const renderItem = (item: { id: string; label: string }) => {
    const screen = screens.find((s) => s.id === item.id);
    if (!screen) return null;
    const isActive = currentRoute === screen.route;
    return (
      <Link
        key={item.id}
        href={screen.route}
        className={cn(
          "group flex h-[32px] w-full items-center justify-between gap-2 rounded-lg px-2.5 text-[12.5px] font-medium transition-all",
          isActive
            ? "bg-gradient-to-r from-primary-light via-primary-light to-white text-primary font-semibold shadow-sm"
            : "text-content-secondary hover:bg-white/70 hover:text-content"
        )}
      >
        <span className="truncate">{item.label}</span>
        <span className={cn("text-[9px] font-bold tracking-tight", isActive ? "text-primary/80" : "text-content-tertiary")}>
          {item.id.replace("SCR-", "")}
        </span>
      </Link>
    );
  };

  return (
    <aside className="flex h-full shrink-0 flex-col border-r border-line/80 bg-white/68 backdrop-blur-xl w-[268px] no-scrollbar">
      {/* 로고 — FitGenie CRM Publishing Workspace */}
      <div className="flex h-[72px] items-center border-b border-line/80 px-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary to-accent text-white text-[13px] font-black shadow-[0_16px_32px_rgba(15,23,42,0.08)]">
            FG
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[13.5px] font-black tracking-tight text-content">FitGenie CRM</span>
            <span className="text-[10.5px] font-medium text-content-tertiary">Publishing Workspace</span>
          </div>
        </div>
      </div>

      {/* 지점 전환 박스 — admin-pando 패턴 */}
      <div className="px-3 pt-3 pb-2 border-b border-line/60">
        <div className="relative mb-2">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-content-tertiary" size={12} />
          <input
            type="text"
            value={sidebarQuery}
            onChange={(e) => setSidebarQuery(e.target.value)}
            placeholder="메뉴 검색..."
            className="h-8 w-full rounded-lg border border-line/80 bg-white/80 pl-7 pr-2 text-[12px] text-content placeholder:text-content-tertiary outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>
        <button className="flex h-9 w-full items-center justify-between gap-2 rounded-xl border border-line/80 bg-white/80 px-3 text-[12.5px] font-semibold text-content transition-colors hover:border-primary/30">
          <div className="flex items-center gap-2 min-w-0">
            <Building2 className="size-3.5 text-primary shrink-0" />
            <span className="truncate">광화문 본점</span>
          </div>
          <ChevronRight className="size-3.5 text-content-tertiary rotate-90" />
        </button>
      </div>

      {/* 메뉴 — 본부 관리 → 대시보드 → 도메인 */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 scrollbar-hide">
        {/* 본부 관리 */}
        <div className="mb-3">
          <p className="px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-content-tertiary">본부 관리</p>
          <div className="space-y-px">
            {hqMenu.filter((item) => matchesQuery(item.label)).map(renderItem)}
          </div>
        </div>

        {/* 대시보드 */}
        <div className="mb-3">
          <p className="px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-content-tertiary">대시보드</p>
          <div className="space-y-px">
            {dashboardGroup.filter((item) => matchesQuery(item.label)).map(renderItem)}
          </div>
        </div>

        {/* 도메인별 (D02~D11) */}
        {domainOrder.map((dom) => {
          const items = screens
            .filter((s) => s.domain === dom.id)
            .filter((s) => !hqMenu.some((h) => h.id === s.id))
            .filter((s) => !dashboardGroup.some((d) => d.id === s.id))
            .filter((s) => matchesQuery(s.title));
          if (items.length === 0) return null;
          return (
            <div key={dom.id} className="mb-3">
              <p className="px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-content-tertiary">{dom.label}</p>
              <div className="space-y-px">
                {items.map((s) => renderItem({ id: s.id, label: s.title }))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* 하단 프로필 — admin-pando 패턴 */}
      <div className="border-t border-line/80 p-2.5 shrink-0">
        <div className="flex items-center gap-2.5 rounded-xl bg-primary-light/40 p-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-white shrink-0">
            <ShieldCheck size={14} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <Badge variant="info" className="border-primary/30 bg-white/80 text-[9px] px-1 py-0">본사</Badge>
              <p className="truncate text-[12px] font-bold text-content">{roleInfo.label}</p>
            </div>
            <p className="text-[10.5px] text-content-tertiary truncate mt-px">슈퍼관리자 · {roleInfo.branchScope}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <Link href="/login" className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-[11px] font-medium text-content-secondary transition-colors hover:bg-white/80 hover:text-content">
            <LogOut size={12} /> 로그아웃
          </Link>
          <Link href="/notifications" className="relative flex h-8 w-8 items-center justify-center rounded-lg text-content-secondary transition-colors hover:bg-white/80">
            <Bell size={13} />
            <span className="absolute right-0.5 top-0.5 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-primary px-0.5 text-[8.5px] font-black text-white">14</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ screen, role, branch, setRole, setBranch, openDialog, notify }: { screen: ScreenDefinition; role: RoleId; branch: string; setRole: (role: RoleId) => void; setBranch: (branch: string) => void; openDialog: (id: string) => void; notify: (message: string, tone?: "success" | "warning" | "info") => void }) {
  const [quickSearch, setQuickSearch] = useState("");
  return (
    <header className="relative z-30 flex h-[72px] shrink-0 items-center justify-between border-b border-line/80 bg-white/72 px-6 backdrop-blur-xl">
      {/* Left — 메뉴 + 지점 + 브래드크럼 */}
      <div className="flex min-w-0 items-center gap-3">
        <button className="flex h-9 w-9 items-center justify-center rounded-xl text-content-secondary transition-colors hover:bg-white/75 hover:text-content">
          <Menu size={18} />
        </button>
        <div className="app-control flex h-10 items-center gap-2 rounded-2xl px-3">
          <Building2 className="size-4 text-primary" />
          <BranchSelect branch={branch} setBranch={setBranch} compact />
        </div>
        <div className="hidden lg:flex min-w-0 items-center gap-2 text-[12px] text-content-secondary">
          <Badge variant="outline" className="border-line/80 bg-white/80 text-content-secondary">{screen.domain}</Badge>
          <Badge variant="info" className="border-primary/30 bg-primary-light text-primary">{screen.id}</Badge>
          <ChevronRight className="size-3.5 text-content-tertiary" />
          <div className="min-w-0">
            <div className="truncate text-[13px] font-bold text-content">{screen.title}</div>
            <div className="truncate text-[11px] text-content-tertiary">{screen.route} · mock only</div>
          </div>
        </div>
      </div>

      {/* Center — 검색 */}
      <div className="mx-6 hidden flex-1 max-w-[420px] xl:block">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary" size={16} />
          <input
            className="app-control h-10 w-full rounded-2xl pl-10 pr-3 text-[13px] text-content placeholder:text-content-tertiary outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
            type="text"
            placeholder="화면·문서 빠른 검색..."
            value={quickSearch}
            onChange={(event) => setQuickSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") notify(`${quickSearch || screen.title} 화면/문서 검색 mock`, "info");
            }}
          />
        </div>
      </div>

      {/* Right — 액션 */}
      <div className="flex items-center gap-1.5">
        <RoleSelect role={role} setRole={setRole} compact />
        <Button variant="ghost" size="sm" asChild className="text-content-secondary hover:bg-white/75 hover:text-content">
          <Link href="/dialogs"><MessageSquare className="size-4" /> DLG</Link>
        </Button>
        <PublishingReviewToggle />
        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl text-content-secondary transition-colors hover:bg-white/75 hover:text-content"
          onClick={() => openDialog("DLG-000")}
          title="세션 만료 보기"
        >
          <Lock size={16} />
        </button>
        <Link
          href="/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl text-content-secondary transition-colors hover:bg-white/75 hover:text-content"
        >
          <Bell size={18} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">14</span>
        </Link>
        <Link
          href="/login"
          className="ml-1 flex h-10 items-center gap-2 rounded-2xl border border-line/80 bg-white/80 px-3 text-[12.5px] font-semibold text-content-secondary transition-colors hover:border-primary/40 hover:text-content"
        >
          <LogOut className="size-4" /> 로그아웃
        </Link>
      </div>
    </header>
  );
}

function AdminScreen({ screen, role, branch, openDialog, notify }: { screen: ScreenDefinition; role: RoleId; branch: string; openDialog: (id: string) => void; notify: (message: string, tone?: "success" | "warning" | "info") => void }) {
  const roleInfo = roleById.get(role)!;
  const screenDialogs = screen.dialogs.map((id) => dialogById.get(id)).filter(Boolean) as DialogDefinition[];
  const contract = getScreenContract(screen);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  if (screen.id === "SCR-104") return <NotificationCenterScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-DLG") return <DialogGalleryScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-M001") return <MemberListScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-M002") return <MemberRegistrationScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-M003") return <MemberEditScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-M004") return <MemberDetailScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-M005") return <MemberTransferScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-M006") return <BodyCompositionScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-M007") return <MemberMergeScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-M008") return <FamilyMembersScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-M010") return <MemberSegmentsScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-S001") return <SalesOverviewScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-S002") return <PosSalesScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-S003") return <PaymentProcessingScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-S004") return <SalesAnalyticsScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-S006") return <DeferredRevenueScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-S007") return <RefundManagementScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-S008") return <ReceivablesScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-S009") return <InstallmentsScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-S010") return <TaxInvoiceScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-S012") return <CancelRefundScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  // D04 수업관리 specialized
  if (screen.id === "SCR-C001") return <ClassCalendarScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-C002") return <LessonManagementScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-C005") return <GroupClassStatusScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-C010") return <ExerciseProgramsScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-C014") return <LessonAttendanceScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-C016") return <ReservationListScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  // D05 상품관리 specialized
  if (screen.id === "SCR-P001") return <ProductManagementScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-P004") return <DiscountSettingsScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-P005") return <ProductCatalogScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  // D06 시설관리 specialized
  if (screen.id === "SCR-050") return <LockerManagementScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-051") return <LockerAssignmentScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-053") return <ExerciseRoomScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  // D07 직원관리 specialized
  if (screen.id === "SCR-060") return <StaffListScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-063") return <StaffAttendanceScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-064") return <PayrollManagementScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  // D08 마케팅 specialized
  if (screen.id === "SCR-070") return <LeadManagementScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-071") return <MessageDispatchScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-073") return <CouponManagementScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-077") return <ReferralProgramScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-085") return <NoticesScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  // D10 본사관리 specialized
  if (screen.id === "SCR-090") return <BranchDashboardScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-094") return <KpiDashboardScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-H1005") return <NpsSurveyScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  // D11 통합운영 specialized
  if (screen.id === "SCR-I001") return <UnifiedAttendanceScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-I004") return <ClothingLockerScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (["D04", "D05", "D06", "D07", "D08", "D09", "D10", "D11"].includes(screen.domain)) return <DomainOperationsScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;

  return (
    <div className="space-y-5">
      <section className="admin-surface p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info" className="border-primary/30 bg-primary-light text-primary">{screen.id}</Badge>
              <Badge variant="outline" className="border-line/80 bg-white/80 text-content-secondary">{screen.feature}</Badge>
              {screen.policyPending && <Badge variant="warning" className="border-warning/30 bg-warning/10 text-warning">정책 확인 필요</Badge>}
              <Badge variant="secondary" className="border-line bg-surface-tertiary text-content-secondary">{screen.source}</Badge>
              <Badge variant={contract.handoffStatus === "production-ready" ? "success" : contract.handoffStatus === "template-ready" ? "info" : "warning"} className={cn(
                contract.handoffStatus === "production-ready" && "border-success/30 bg-success/10 text-success",
                contract.handoffStatus === "template-ready" && "border-info/30 bg-info/10 text-info",
                contract.handoffStatus !== "production-ready" && contract.handoffStatus !== "template-ready" && "border-warning/30 bg-warning/10 text-warning"
              )}>{contract.handoffStatus}</Badge>
            </div>
            <h1 className="mt-3 text-[26px] font-black tracking-tight text-content">{screen.title}</h1>
            <p className="mt-2 max-w-4xl text-[13.5px] leading-6 text-content-secondary">{screen.purpose}</p>
          </div>
          <div className="min-w-72 rounded-2xl border border-line/80 bg-gradient-to-br from-primary-light/60 to-accent-light/40 p-4 text-sm">
            <div className="flex items-center gap-2 font-bold text-content"><UserRound className="size-4 text-primary" /> {roleInfo.label}</div>
            <div className="mt-1 text-content-secondary"><Building2 className="mr-1 inline size-4 text-accent" /> {branch} · {roleInfo.branchScope}</div>
            <p className="mt-2 text-xs leading-5 text-content-tertiary">{screen.roleNotes[role] ?? roleInfo.description}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-4 gap-3">
        {screen.metrics.map((metric) => (
          <button key={metric.label} type="button" onClick={() => { setSelectedMetric(metric.label); notify(`${metric.label} 지표 필터 mock 적용`, "info"); }} className={cn("text-left transition hover:-translate-y-0.5", selectedMetric === metric.label && "ring-2 ring-blue-400 rounded-xl")}><Card className="h-full shadow-none"><CardHeader className="pb-2"><CardDescription>{metric.label}</CardDescription><CardTitle className="text-xl">{metric.value}</CardTitle></CardHeader><CardContent><p className="text-xs text-content-tertiary">{metric.hint}</p></CardContent></Card></button>
        ))}
        {screen.metrics.length === 0 && <Card className="col-span-4"><CardContent className="pt-5 text-sm text-content-secondary">로그인 화면은 별도 폼 중심으로 구성됩니다.</CardContent></Card>}
      </section>

      <section className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-5">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>필터 / 탭 / 액션</CardTitle>
              <CardDescription>문서의 정보 밀도 높은 Admin UI 원칙에 맞춰 칩, 탭, 테이블 중심으로 구성했습니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {screen.filters.map((filter) => <Button key={filter} type="button" variant="outline" size="sm" onClick={() => notify(`${filter} 필터 chip mock 적용`, "info")}>{filter}</Button>)}
                {role === "HQ_ADMIN" && <Badge variant="info">전 지점 필터</Badge>}
              </div>
              <Tabs defaultValue={screen.tabs[0] ?? "기본"} onValueChange={(value) => notify(`${value} 탭으로 전환`, "info")}>
                <TabsList className="max-w-full overflow-x-auto no-scrollbar">
                  {screen.tabs.slice(0, 8).map((tab) => <TabsTrigger key={tab} value={tab}>{tab}</TabsTrigger>)}
                </TabsList>
                {(screen.tabs.length ? screen.tabs.slice(0, 1) : ["기본"]).map((tab) => <TabsContent key={tab} value={tab}><DataPanel screen={screen} notify={notify} /></TabsContent>)}
              </Tabs>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader><CardTitle>권한별 액션 큐</CardTitle><CardDescription>불가 액션은 숨기지 않고 검수 가능하도록 권한 필요 상태와 차단 toast를 표시합니다.</CardDescription></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {screen.primaryActions.map((action) => {
                const allowed = hasPermission(role, action.permission);
                return (
                  <Button key={action.label} data-dialog-id={action.dialogId} variant={action.danger ? "destructive" : allowed ? "default" : "outline"} data-blocked={!allowed} title={!allowed ? `${action.permission} 권한 필요` : undefined} onClick={() => {
                    if (!allowed) {
                      notify(`${action.label}: ${roleInfo.label} 권한으로는 실행할 수 없습니다.`, "warning");
                      return;
                    }
                    if (action.dialogId) {
                      openDialog(action.dialogId);
                    } else {
                      notify(`${action.label} mock 처리 완료`);
                    }
                  }}>
                    {!allowed && <Lock className="size-4" />}{action.label}{action.policyPending && <Badge variant="warning">정책</Badge>}
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </div>
        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none">
            <CardHeader><CardTitle>연결 DLG</CardTitle><CardDescription>화면에서 열리는 모달/다이얼로그</CardDescription></CardHeader>
            <CardContent className="space-y-2">
              {screenDialogs.map((dialog) => {
                const allowed = hasPermission(role, dialog.requiredPermission);
                return <Button key={dialog.id} data-dialog-id={dialog.id} variant="outline" className="w-full min-w-0 justify-between gap-2" onClick={() => openDialog(dialog.id)}><span className="shrink-0">{dialog.id}</span><span className="min-w-0 truncate text-right">{dialog.title}</span>{!allowed && <Lock className="size-3 shrink-0" />}</Button>;
              })}
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader><CardTitle>개발 핸드오프 계약</CardTitle><CardDescription>퍼블리싱 컴포넌트를 실제 개발 상태관리로 연결할 때 쓰는 mock contract입니다.</CardDescription></CardHeader>
            <CardContent className="space-y-3 text-xs text-content-secondary">
              <div><b className="text-content">퍼블리싱 범위</b>: API 호출 없음 · toast/modal/local state만 동작</div>
              <div><b className="text-content">연결 키</b>: <code>{contract.apiContracts[0]?.key}</code> · endpoint는 개발 단계 확정</div>
              <div><b className="text-content">상태</b>: {contract.stateMatrix.slice(0, 4).join(" · ")}</div>
              <div><b className="text-content">액션</b>: {contract.actionContracts.slice(0, 3).map((action) => action.label).join(" / ") || "none"}</div>
              <div className="rounded-lg bg-surface-secondary p-2">모든 버튼은 mock toast, modal open, role-blocked feedback 중 하나를 실행합니다.</div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader><CardTitle>범위 검증</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-content-secondary">
              <CheckLine label="API 호출 없음" />
              <CheckLine label="로컬 mock 데이터" />
              <CheckLine label="역할별 권한 상태 표시" />
              <CheckLine label="V1 문서 ID 배지 표시" />
              {screen.policyPending && <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800"><AlertTriangle className="mr-2 inline size-4" />정책·외부연동 확정 전 임시 UI입니다.</div>}
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  );
}


type SpecializedScreenProps = { screen: ScreenDefinition; role: RoleId; branch: string; openDialog: (id: string) => void; notify: Notify };

const memberDirectoryRows = [
  { no: "10291", status: "활성", name: "김민준", gender: "남", birth: "1991-04-18", age: "35", phone: "010-1234-5678", pass: "PT 20회 · 8회 잔여", branch: "강남점", visit: "오늘 09:20", registered: "2026-01-12", owner: "이FC", source: "회원소개", purpose: "체중 감량" },
  { no: "10254", status: "임박", name: "박서연", gender: "여", birth: "1994-10-03", age: "32", phone: "010-2222-8899", pass: "회원권 3개월 · D-3", branch: "강남점", visit: "2026-05-12", registered: "2025-11-02", owner: "최매니저", source: "인스타", purpose: "재등록 상담" },
  { no: "10187", status: "홀딩", name: "정하준", gender: "남", birth: "1988-02-09", age: "38", phone: "010-7755-4300", pass: "수강권 홀딩 · 12일", branch: "서초점", visit: "2026-04-19", registered: "2025-09-21", owner: "박트레이너", source: "블로그", purpose: "재활" },
  { no: "10044", status: "만료", name: "오지우", gender: "여", birth: "1998-07-22", age: "28", phone: "010-9080-1122", pass: "회원권 만료 · 미수 80,000", branch: "잠실점", visit: "2026-03-30", registered: "2025-05-10", owner: "이FC", source: "당근", purpose: "이탈 위험" }
];

const salesLedgerRows = [
  { id: "S-260528-001", buyer: "김민준", product: "PT 20회", gross: "1,200,000", discount: "50,000", paid: "1,150,000", status: "결제완료", method: "카드", owner: "이FC", route: "POS", date: "오늘 09:42" },
  { id: "S-260528-002", buyer: "박서연", product: "회원권 3개월", gross: "450,000", discount: "0", paid: "330,000", status: "미수", method: "현금", owner: "최매니저", route: "수기", date: "오늘 11:20" },
  { id: "S-260527-003", buyer: "정하준", product: "락커 1개월", gross: "30,000", discount: "0", paid: "30,000", status: "환불요청", method: "계좌", owner: "박트레이너", route: "링크", date: "어제 17:03" },
  { id: "S-260526-004", buyer: "오지우", product: "할부 회원권", gross: "900,000", discount: "90,000", paid: "300,000", status: "할부", method: "복합", owner: "이FC", route: "POS", date: "05-26 14:10" }
];

const posProducts = [
  { name: "PT 20회", category: "수강권", price: 1200000, stock: "판매중", color: "bg-blue-50 text-blue-700" },
  { name: "회원권 3개월", category: "회원권", price: 450000, stock: "판매중", color: "bg-emerald-50 text-emerald-700" },
  { name: "락커 1개월", category: "락커", price: 30000, stock: "재고 부족 3개", color: "bg-amber-50 text-amber-700" },
  { name: "운동복", category: "운동복", price: 15000, stock: "품절", color: "bg-rose-50 text-rose-700" }
];

function HandoffContractCard({ screen }: { screen: ScreenDefinition }) {
  const contract = getScreenContract(screen);
  return (
    <Card className="shadow-none">
      <CardHeader><CardTitle>개발 핸드오프 계약</CardTitle><CardDescription>이 화면을 실제 개발로 연결할 기준입니다.</CardDescription></CardHeader>
      <CardContent className="space-y-2 text-xs text-content-secondary">
        <div><b className="text-content">퍼블리싱 범위</b>: API 호출 없음 · 버튼은 dialog/toast/local state만 실행</div>
        <div><b className="text-content">개발 연결점</b>: {contract.apiContracts[0]?.key} · 실제 endpoint는 개발 단계에서 확정</div>
        <div><b className="text-content">상태</b>: {contract.stateMatrix.slice(0, 5).join(" · ")}</div>
        <div><b className="text-content">액션</b>: {contract.actionContracts.slice(0, 4).map((action) => action.label).join(" / ") || "조회 전용"}</div>
      </CardContent>
    </Card>
  );
}

function DialogDock({ screen, openDialog }: { screen: ScreenDefinition; openDialog: (id: string) => void }) {
  const linkedDialogs = screen.dialogs.map((id) => dialogById.get(id)).filter(Boolean) as DialogDefinition[];
  if (!linkedDialogs.length) return null;
  return (
    <Card className="shadow-none">
      <CardHeader><CardTitle>문서 연결 DLG</CardTitle><CardDescription>이 화면에서 열리는 모든 다이얼로그입니다.</CardDescription></CardHeader>
      <CardContent className="grid gap-2">
        {linkedDialogs.map((dialog) => (
          <Button key={dialog.id} data-dialog-id={dialog.id} variant="outline" className="min-w-0 justify-between gap-2" onClick={() => openDialog(dialog.id)}><span className="shrink-0">{dialog.id}</span><span className="min-w-0 truncate text-right">{dialog.title}</span></Button>
        ))}
      </CardContent>
    </Card>
  );
}

function DeliveryHeader({ screen, role, branch, titleSuffix }: { screen: ScreenDefinition; role: RoleId; branch: string; titleSuffix?: string }) {
  const roleInfo = roleById.get(role)!;
  const status = getScreenContract(screen).handoffStatus;
  const sourceLabel = getScreenSourceLabel(screen);
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2"><Badge variant="info">{screen.id}</Badge><Badge variant="outline">{screen.feature}</Badge><Badge variant={status === "production-ready" ? "success" : status === "template-ready" ? "info" : "warning"}>{status}</Badge><Badge variant={sourceLabel === "V1+V2" ? "success" : sourceLabel === "V2" ? "secondary" : "info"}>{sourceLabel}</Badge>{screen.policyPending && <Badge variant="warning">정책 확인 필요</Badge>}<Badge variant="secondary" className="font-mono text-[10px]">{screen.source}</Badge></div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight">{screen.title}{titleSuffix ? ` · ${titleSuffix}` : ""}</h1>
          <p className="mt-2 max-w-5xl text-sm leading-6 text-content-secondary">{screen.purpose}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
            <Badge variant="success">2026-05-28 반영</Badge>
            <Badge variant="info">DLG 컴포넌트화</Badge>
            <Badge variant="outline">API 호출 없는 퍼블리싱</Badge>
            <Button asChild variant="link" size="sm" className="h-auto px-0 py-0 text-xs"><Link href="/dialogs">DLG 갤러리 보기</Link></Button>
          </div>
        </div>
        <div className="min-w-72 rounded-xl border bg-surface-secondary p-3 text-sm">
          <div className="flex items-center gap-2 font-semibold"><UserRound className="size-4" /> {roleInfo.label}</div>
          <div className="mt-1 text-content-secondary"><Building2 className="mr-1 inline size-4" /> {branch} · {roleInfo.branchScope}</div>
          <p className="mt-2 text-xs leading-5 text-content-tertiary">{screen.roleNotes[role] ?? roleInfo.description}</p>
        </div>
      </div>
    </section>
  );
}

function NotificationCenterScreen({ screen, role, branch, notify }: SpecializedScreenProps) {
  const [readAll, setReadAll] = useState(false);
  const canDeleteAll = ["HQ_ADMIN", "OWNER", "MANAGER"].includes(role);
  const notifications = [
    { type: "만료 step", text: "박서연 회원권 D-3 · 재등록 상담 필요", time: "방금", target: "/members" },
    { type: "결제", text: "김민준 PT 20회 결제 완료", time: "12분 전", target: "/sales" },
    { type: "수업", text: "정하준 홀딩 기간 중 예약 충돌", time: "38분 전", target: "/class-reservations" },
    { type: "보안", text: "강남점 Staff 계정 2FA 재인증", time: "오늘 09:10", target: "/settings/permissions" }
  ];
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="운영 알림 패널" />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <Card className="shadow-none">
          <CardHeader><CardTitle>상단 알림 아이콘 클릭 후 열리는 알림 센터</CardTitle><CardDescription>문서 기준: 문맥 바로가기, 읽음 처리, 권한별 삭제 액션을 포함합니다.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {["회원 목록", "메시지 발송", "전자계약", "출석 관리"].map((item) => <Button key={item} variant="outline" onClick={() => notify(`${item} 바로가기 mock 이동`, "info")}>{item}</Button>)}
            </div>
            <div className="divide-y rounded-xl border">
              {notifications.map((item) => <button key={item.text} type="button" className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-surface-secondary" onClick={() => notify(`${item.type} 알림 읽음 처리 + ${item.target} 이동 mock`, "info")}><span><Badge variant={readAll ? "secondary" : "warning"}>{readAll ? "읽음" : "미읽음"}</Badge><span className="ml-3 font-medium">{item.text}</span></span><span className="text-xs text-content-tertiary">{item.time}</span></button>)}
            </div>
          </CardContent>
        </Card>
        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none"><CardHeader><CardTitle>관리 액션</CardTitle></CardHeader><CardContent className="space-y-2"><Button className="w-full" onClick={() => { setReadAll(true); notify("전체 읽음 처리되었습니다."); }}>전체 읽음</Button><Button className="w-full" variant={canDeleteAll ? "destructive" : "outline"} onClick={() => notify(canDeleteAll ? "전체 삭제 mock 완료" : "현재 역할은 전체 삭제 권한이 없습니다.", canDeleteAll ? "success" : "warning")}>전체 삭제</Button><Button className="w-full" variant="outline" onClick={() => notify("알림 설정 화면 이동 mock", "info")}>알림 설정</Button></CardContent></Card>
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function DialogGalleryScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const [domain, setDomain] = useState<"D01" | "D02" | "D03">("D02");
  const visibleDialogs = dialogs.filter((dialog) => dialog.domain === domain);
  const statusCount = {
    total: visibleDialogs.length,
    policy: visibleDialogs.filter((dialog) => dialog.policyPending).length,
    blocked: visibleDialogs.filter((dialog) => !hasPermission(role, dialog.requiredPermission)).length
  };

  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="컴포넌트 검수 갤러리" />
      <div className="grid grid-cols-4 gap-3">
        <Card className="shadow-none"><CardHeader><CardDescription>현재 그룹</CardDescription><CardTitle>{domain}</CardTitle></CardHeader><CardContent><p className="text-xs text-content-tertiary">docs4 V1 기준</p></CardContent></Card>
        <Card className="shadow-none"><CardHeader><CardDescription>DLG 컴포넌트</CardDescription><CardTitle>{statusCount.total}개</CardTitle></CardHeader><CardContent><p className="text-xs text-content-tertiary">DialogShell 패턴</p></CardContent></Card>
        <Card className="shadow-none"><CardHeader><CardDescription>정책 확인</CardDescription><CardTitle>{statusCount.policy}개</CardTitle></CardHeader><CardContent><p className="text-xs text-content-tertiary">산식/외부연동 보류 표시</p></CardContent></Card>
        <Card className="shadow-none"><CardHeader><CardDescription>역할 차단</CardDescription><CardTitle>{statusCount.blocked}개</CardTitle></CardHeader><CardContent><p className="text-xs text-content-tertiary">{roleById.get(role)?.label} 기준</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-5">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>DLG 컴포넌트 목록</CardTitle>
            <CardDescription>문자열 팝업이 아니라 실제 모달 UI, 필드, 권한, 정책 상태, 버튼 mock 동작을 가진 컴포넌트입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(["D01", "D02", "D03"] as const).map((item) => <Button key={item} variant={domain === item ? "default" : "outline"} onClick={() => setDomain(item)}>{item} {item === "D01" ? "공통" : item === "D02" ? "회원관리" : "매출관리"}</Button>)}
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {visibleDialogs.map((dialog) => {
                const kind = getDialogKind(dialog);
                const tone = dialogTone[kind];
                const allowed = hasPermission(role, dialog.requiredPermission);
                return (
                  <button key={dialog.id} data-dialog-id={dialog.id} type="button" className="rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300" onClick={() => { openDialog(dialog.id); notify(`${dialog.id} 컴포넌트 열림`, "info"); }}>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={tone.badge}>{dialog.id}</Badge>
                      <Badge variant="outline">{tone.label}</Badge>
                      {dialog.policyPending && <Badge variant="warning">정책 확인</Badge>}
                      {!allowed && <Badge variant="secondary">권한 차단</Badge>}
                    </div>
                    <div className="mt-3 font-bold text-content">{dialog.title}</div>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-content-tertiary">{dialog.purpose}</p>
                    <div className="mt-3 rounded-lg bg-surface-secondary px-3 py-2 text-[11px] text-content-tertiary">{dialog.components.slice(0, 3).join(" · ")}</div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none">
            <CardHeader><CardTitle>개발 인수 기준</CardTitle><CardDescription>프론트 개발자가 이어받을 때의 기준입니다.</CardDescription></CardHeader>
            <CardContent className="space-y-3 text-sm text-content-secondary">
              {["모든 DLG는 id/source/권한/정책 상태를 가진다", "버튼은 실제 API 없이 toast/local state로만 동작한다", "정책 미확정은 임의 확정하지 않고 배지와 안내문으로 남긴다", "개발 단계에서는 각 버튼 handler만 service layer에 연결한다"].map((item) => <div key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 text-emerald-600" /><span>{item}</span></div>)}
            </CardContent>
          </Card>
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function MemberListScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const [focus, setFocus] = useState("전체");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState(memberDirectoryRows[0]);
  const rows = memberDirectoryRows.filter((row) => `${row.name} ${row.phone} ${row.pass} ${row.status}`.includes(query));
  const toggleSelected = (no: string) => setSelected((current) => current.includes(no) ? current.filter((item) => item !== no) : [...current, no]);
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="회원 원장 운영" />
      <div className="grid grid-cols-4 gap-3">
        {screen.metrics.map((metric) => <button key={metric.label} type="button" className="text-left" onClick={() => { setFocus(metric.label); notify(`${metric.label} 지표 필터 mock 적용`, "info"); }}><Card className={cn("h-full shadow-none", focus === metric.label && "ring-2 ring-blue-400")}><CardHeader><CardDescription>{metric.label}</CardDescription><CardTitle className="text-2xl">{metric.value}</CardTitle></CardHeader><CardContent><p className="text-xs text-content-tertiary">{metric.hint}</p></CardContent></Card></button>)}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-5">
        <div className="space-y-5">
          <Card className="shadow-none"><CardHeader><CardTitle>운영 포커스 바</CardTitle><CardDescription>지금 바로 봐야 할 회원군을 문서 기준으로 분리했습니다.</CardDescription></CardHeader><CardContent className="grid grid-cols-3 gap-3">{["재등록 집중 보기", "30일 미방문", "관심회원 보기"].map((item) => <button key={item} className={cn("rounded-xl border p-4 text-left hover:bg-surface-secondary", focus === item && "border-blue-400 bg-blue-50")} onClick={() => { setFocus(item); notify(`${item} 저장뷰 적용`, "info"); }}><div className="font-semibold">{item}</div><div className="mt-1 text-xs text-content-tertiary">HQ-09/세그먼트 기준 mock</div></button>)}</CardContent></Card>
          <Card className="shadow-none"><CardHeader><CardTitle>회원 목록 / 저장 뷰 / 상태 필터</CardTitle><CardDescription>선택 시 하단 일괄 작업 바와 우측 상세 패널이 함께 반응합니다.</CardDescription></CardHeader><CardContent className="space-y-4"><Tabs defaultValue="회원 목록" onValueChange={(value) => notify(`${value} 운영 보기 전환`, "info")}><TabsList>{["회원 목록", "회원권 목록", "수강권 목록", "락커 목록", "운동복 목록"].map((tab) => <TabsTrigger key={tab} value={tab}>{tab}</TabsTrigger>)}</TabsList><TabsContent value="회원 목록"><div className="flex flex-wrap gap-2 py-3">{["상담내역", "상담예약", "재등록대상", "고객관리"].map((tab) => <Button key={tab} variant="outline" size="sm" onClick={() => notify(`${tab} 저장뷰 적용`, "info")}>{tab}</Button>)}</div><div className="flex flex-wrap gap-2">{["전체", "활성", "만료", "예정", "임박", "홀딩", "미등록", "탈퇴"].map((status) => <Button key={status} aria-label={status} variant={focus === status ? "default" : "outline"} size="sm" onClick={() => { setFocus(status); notify(`${status} 필터 chip mock 적용`, "info"); }}>{status}<Badge variant="secondary">{status === "전체" ? rows.length : memberDirectoryRows.filter((row) => row.status === status).length}</Badge></Button>)}</div><div className="mt-3 flex flex-wrap items-center gap-2"><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="이름·연락처·상품명 통합 검색" className="max-w-sm" /><Button variant="outline" onClick={() => { setQuery(""); setSelected([]); notify("필터와 선택 행을 초기화했습니다.", "info"); }}>전체 해제</Button><Button variant="outline" onClick={() => notify(`${selected.length}개 행으로 일괄 작업 bar mock 표시`, "info")}>선택 작업</Button><Button asChild><Link href="/members/new">회원 추가</Link></Button></div><div className="mt-3 overflow-hidden rounded-xl border"><Table><TableHeader><TableRow>{["선택", "No", "상태", "회원명", "성별", "생년월일", "나이", "연락처", "보유 이용권", "소속 지점", "마지막 방문일", "등록일", "OPEN"].map((column) => <TableHead key={column}>{column}</TableHead>)}</TableRow></TableHeader><TableBody>{rows.map((row) => <TableRow key={row.no}><TableCell><Button size="sm" variant={selected.includes(row.no) ? "default" : "outline"} onClick={() => toggleSelected(row.no)}>{selected.includes(row.no) ? "선택됨" : "선택"}</Button></TableCell><TableCell>{row.no}</TableCell><TableCell>{statusAwareValue(row.status)}</TableCell><TableCell className="font-semibold">{row.name}</TableCell><TableCell>{row.gender}</TableCell><TableCell>{row.birth}</TableCell><TableCell>{row.age}</TableCell><TableCell>{row.phone}</TableCell><TableCell>{row.pass}</TableCell><TableCell>{row.branch}</TableCell><TableCell>{row.visit}</TableCell><TableCell>{row.registered}</TableCell><TableCell><Button size="sm" variant="ghost" onClick={() => { setDetail(row); notify(`${row.name} 우측 상세 패널 열림`, "info"); }}>상세</Button></TableCell></TableRow>)}</TableBody></Table></div><div className="mt-3 flex items-center justify-between rounded-xl border bg-surface-secondary px-4 py-3 text-sm"><span>1-{rows.length} of {rows.length} · 선택 {selected.length}</span><div className="flex gap-2"><Button variant="outline" size="sm" disabled>이전</Button><Button variant="outline" size="sm">1</Button><Button variant="outline" size="sm" disabled>다음</Button></div></div></TabsContent></Tabs></CardContent></Card>
          {selected.length > 0 && <Card className="sticky bottom-4 z-10 border-blue-200 bg-blue-50 shadow-lg"><CardContent className="flex items-center justify-between pt-5"><b>{selected.length}명 선택됨</b><div className="flex flex-wrap gap-2"><Button data-dialog-id="DLG-M001" onClick={() => openDialog("DLG-M001")}>상태 변경</Button><Button onClick={() => notify("메시지 발송 화면 연결 mock", "info")}>메시지 전송</Button><Button data-dialog-id="DLG-M022" onClick={() => openDialog("DLG-M022")}>출석 처리</Button><Button variant="outline" onClick={() => notify("관심회원 등록 mock 완료")}>관심회원 등록</Button><Button data-dialog-id="DLG-M005" variant={hasPermission(role, "dangerMember") ? "destructive" : "outline"} onClick={() => hasPermission(role, "dangerMember") ? openDialog("DLG-M005") : notify("일괄 탈퇴는 Owner 이상 권한이 필요합니다.", "warning")}>일괄 탈퇴</Button><Button data-dialog-id="DLG-M023" variant="outline" onClick={() => selected.length === 1 ? openDialog("DLG-M023") : notify("지점이관은 회원 1명 선택 시에만 진행합니다.", "warning")}>지점이관</Button></div></CardContent></Card>}
        </div>
        <aside className="min-w-0 space-y-5"><Card className="shadow-none"><CardHeader><CardTitle>액션 큐</CardTitle><CardDescription>{selected.length ? `${selected.length}명 선택됨` : "회원을 선택하면 큐가 활성화됩니다."}</CardDescription></CardHeader><CardContent className="space-y-2"><Button data-dialog-id="DLG-M001" className="w-full" onClick={() => openDialog("DLG-M001")}>상태 변경</Button><Button className="w-full" variant="outline" onClick={() => notify("선택 회원 메시지 발송 mock", "info")}>메시지 발송</Button><Button data-dialog-id="DLG-M022" className="w-full" variant="outline" onClick={() => openDialog("DLG-M022")}>수동 출석</Button><Button data-dialog-id="DLG-M005" className="w-full" variant="outline" onClick={() => openDialog("DLG-M005")}>탈퇴/복구 확인</Button><Button data-dialog-id="DLG-M023" className="w-full" variant="outline" onClick={() => openDialog("DLG-M023")}>이관 확인</Button></CardContent></Card><Card className="shadow-none"><CardHeader><CardTitle>우측 상세 팝업 패널</CardTitle><CardDescription>출석시 상세 팝업 ON 상태 mock</CardDescription></CardHeader><CardContent className="space-y-3 text-sm"><div className="flex items-center gap-3"><div className="grid size-12 place-items-center rounded-full bg-blue-100 font-bold text-blue-700">{detail.name[0]}</div><div><div className="font-bold">{detail.name}</div><div className="text-xs text-content-tertiary">{detail.phone} · {detail.branch}</div></div></div><Separator /><div className="grid grid-cols-2 gap-2 text-xs"><InfoCell label="상담 담당" value={detail.owner} /><InfoCell label="문의 유형" value="방문(WI)" /><InfoCell label="가입경로" value={detail.source} /><InfoCell label="운동목적" value={detail.purpose} /></div><div className="grid grid-cols-2 gap-2"><Button size="sm" onClick={() => notify(`${detail.name} 출석 체크 mock 완료`)}>출석 체크</Button><Button size="sm" variant="outline" onClick={() => notify(`${detail.name} 상품 구매 연결 mock`, "info")}>상품 구매</Button><Button size="sm" variant="outline" onClick={() => notify(`${detail.name} 메시지 작성 mock`, "info")}>메시지</Button><Button size="sm" variant="outline" asChild><Link href="/members/detail">더보기</Link></Button></div></CardContent></Card><DialogDock screen={screen} openDialog={openDialog} /><HandoffContractCard screen={screen} /></aside>
      </div>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border bg-white p-2"><div className="text-content-tertiary">{label}</div><div className="mt-1 font-semibold text-content">{value}</div></div>;
}

function MemberRegistrationScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [memberType, setMemberType] = useState("일반");
  const canNext = name.trim().length > 1 && phone.trim().length >= 8;
  return (
    <div className="space-y-5"><DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="2단계 회원 등록" /><div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5"><Card className="shadow-none"><CardHeader><CardTitle>Step {step} / 2</CardTitle><CardDescription>결제 완료 후 회원 등록이 확정됩니다.</CardDescription></CardHeader><CardContent className="space-y-5"><div className="grid grid-cols-2 gap-2 text-sm"><div className={cn("rounded-lg border p-3", step === 1 && "border-blue-400 bg-blue-50")}>1. 기본 인적 사항</div><div className={cn("rounded-lg border p-3", step === 2 && "border-blue-400 bg-blue-50")}>2. 추가 정보 및 결제 진입</div></div>{step === 1 ? <div className="grid grid-cols-2 gap-4"><div className="space-y-1"><Label>이름 *</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" />{name && name.length < 2 && <p className="text-xs text-rose-600">이름은 2자 이상 입력합니다.</p>}</div><div className="space-y-1"><Label>성별 *</Label><div className="grid grid-cols-2 gap-2"><Button variant="outline" onClick={() => notify("남성 선택", "info")}>남성</Button><Button variant="outline" onClick={() => notify("여성 선택", "info")}>여성</Button></div></div><div className="space-y-1"><Label>연락처 *</Label><div className="flex gap-2"><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" /><Button data-dialog-id="DLG-M006" variant="outline" onClick={() => openDialog("DLG-M006")}>중복 확인</Button></div></div><div className="space-y-1"><Label>회원구분 *</Label><Select value={memberType} onValueChange={setMemberType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["일반", "기명법인", "무기명법인"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>{memberType !== "일반" && <div className="col-span-2 space-y-1"><Label>법인 회사명</Label><Input placeholder="법인 회사명" /></div>}<div className="col-span-2 grid grid-cols-3 gap-3"><Input placeholder="소속지점" defaultValue={branch} /><Input placeholder="담당 FC" defaultValue="이FC" /><Input placeholder="운동 목적" defaultValue="체중 감량" /></div></div> : <div className="space-y-4"><div className="grid grid-cols-2 gap-4"><Input placeholder="별칭/닉네임" /><Input placeholder="이메일" /><div className="flex gap-2"><Input placeholder="주소" /><Button data-dialog-id="DLG-M027" variant="outline" onClick={() => openDialog("DLG-M027")}>주소 검색</Button></div><Input placeholder="상세 주소" /></div><Textarea placeholder="메모 최대 500자" /><div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">결제 완료 후 회원 등록이 확정됩니다. 결제 취소 시 작성 내용은 임시 저장 상태로 돌아갑니다.</div></div>}<div className="flex justify-between border-t pt-4"><div className="flex gap-2"><Button data-dialog-id="DLG-M007" variant="outline" onClick={() => openDialog("DLG-M007")}>취소</Button><Button data-dialog-id="DLG-M008" variant="outline" onClick={() => openDialog("DLG-M008")}>초기화</Button></div>{step === 1 ? <Button disabled={!canNext} onClick={() => canNext ? setStep(2) : notify("필수 항목과 중복 확인이 필요합니다.", "warning")}>다음</Button> : <div className="flex gap-2"><Button variant="outline" onClick={() => setStep(1)}>이전</Button><Button asChild><Link href="/sales/payment">결제 진행</Link></Button></div>}</div></CardContent></Card><aside className="min-w-0 space-y-5"><Card className="shadow-none"><CardHeader><CardTitle>귀속 정책 안내</CardTitle></CardHeader><CardContent className="text-sm leading-6 text-content-secondary">회원 등록값은 기본값입니다. 실제 결제 시 결제지점, 이용지점, 매출 귀속 지점, 정산 지점, 인센티브 귀속자를 다시 확인합니다.</CardContent></Card><DialogDock screen={screen} openDialog={openDialog} /><HandoffContractCard screen={screen} /></aside></div></div>
  );
}

function MemberDetailScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const member = memberDirectoryRows[0];
  return <div className="space-y-5"><DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="360도 회원 상세" /><div className="grid grid-cols-[360px_minmax(0,1fr)] gap-5"><Card className="shadow-none"><CardHeader><CardTitle>{member.name}</CardTitle><CardDescription>{member.phone} · {member.branch}</CardDescription></CardHeader><CardContent className="space-y-3"><div className="grid size-24 place-items-center rounded-full bg-blue-100 text-3xl font-bold text-blue-700">김</div><InfoCell label="상태" value={member.status} /><InfoCell label="보유 이용권" value={member.pass} /><InfoCell label="최근 방문" value={member.visit} /><div className="grid grid-cols-2 gap-2"><Button onClick={() => notify("출석 체크 mock 완료")}>출석 체크</Button><Button data-dialog-id="DLG-M009" variant="outline" onClick={() => openDialog("DLG-M009")}>메모 추가</Button><Button data-dialog-id="DLG-M011" variant="outline" onClick={() => openDialog("DLG-M011")}>상담 등록</Button><Button data-dialog-id="DLG-M013" variant="outline" onClick={() => openDialog("DLG-M013")}>환불 처리</Button></div></CardContent></Card><div className="space-y-5"><Card className="shadow-none"><CardHeader><CardTitle>회원 타임라인</CardTitle><CardDescription>상담·결제·출석·체성분 이력을 한 화면에서 확인합니다.</CardDescription></CardHeader><CardContent className="grid grid-cols-4 gap-3">{["상담 12건", "결제 6건", "출석 41회", "체성분 8회"].map((item) => <div key={item} className="rounded-xl border bg-surface-secondary p-4 font-semibold">{item}</div>)}</CardContent></Card><Card className="shadow-none"><CardHeader><CardTitle>연결 업무</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2">{["DLG-M015", "DLG-M017", "DLG-M018", "DLG-M019", "DLG-M020", "DLG-M024", "DLG-M026"].map((id) => <Button key={id} data-dialog-id={id} variant="outline" onClick={() => openDialog(id)}>{dialogById.get(id)?.title ?? id}</Button>)}</CardContent></Card><DialogDock screen={screen} openDialog={openDialog} /><HandoffContractCard screen={screen} /></div></div></div>;
}

function MemberEditScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("김민준");
  const [phone, setPhone] = useState("010-1234-5678");
  const [memberType, setMemberType] = useState("일반");
  const [memo, setMemo] = useState("재등록 의향 있음");
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="2단계 회원 수정 폼" />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Step {step} / 2 · {step === 1 ? "기본 인적 + 관리 정보" : "추가 연락 + 기타 설정"}</CardTitle>
            <CardDescription>등록 화면(SCR-M002)과 동일 구조. 기존 데이터가 자동으로 채워진 상태에서 시작합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className={cn("rounded-lg border p-3", step === 1 && "border-blue-400 bg-blue-50")}>1. 기본 인적 / 관리 정보</div>
              <div className={cn("rounded-lg border p-3", step === 2 && "border-blue-400 bg-blue-50")}>2. 추가 연락 / 기타 설정</div>
            </div>
            {step === 1 ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><Label>이름 *</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div className="space-y-1"><Label>연락처 * (변경 시 재중복확인)</Label><div className="flex gap-2"><Input value={phone} onChange={(e) => setPhone(e.target.value)} /><Button data-dialog-id="DLG-M006" variant="outline" onClick={() => openDialog("DLG-M006")}>중복 확인</Button></div></div>
                <div className="space-y-1"><Label>회원구분 *</Label><Select value={memberType} onValueChange={setMemberType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["일반", "기명법인", "무기명법인"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-1"><Label>생년월일 *</Label><Input defaultValue="1991-04-18" /></div>
                <div className="space-y-1"><Label>키 (cm)</Label><Input defaultValue="178" /></div>
                <div className="space-y-1"><Label>성별 *</Label><Input defaultValue="남" /></div>
                <div className="col-span-2 space-y-1"><Label>소속지점 / 기본 이용지점 / 담당 FC / 담당 트레이너</Label><div className="grid grid-cols-4 gap-2"><Input defaultValue="강남점" /><Input defaultValue="강남점" /><Input defaultValue="이FC" /><Input defaultValue="박트레이너" /></div></div>
                <div className="col-span-2 space-y-1"><Label>문의 유형 / 가입경로 / 운동 목적</Label><div className="grid grid-cols-3 gap-2"><Input defaultValue="방문(WI)" /><Input defaultValue="회원소개" /><Input defaultValue="체중 감량" /></div></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="별칭/닉네임" defaultValue="민준" />
                <Input placeholder="이메일" defaultValue="minjun@example.com" />
                <div className="flex gap-2"><Input placeholder="주소" defaultValue="서울 강남구" /><Button data-dialog-id="DLG-M027" variant="outline" onClick={() => openDialog("DLG-M027")}>주소 검색</Button></div>
                <Input placeholder="상세 주소" />
                <Input placeholder="회사명" />
                <Input placeholder="출석번호" defaultValue="10291" />
                <div className="col-span-2 space-y-1">
                  <Label>메모 (최대 500자, 주민번호 패턴 자동 차단)</Label>
                  <Textarea value={memo} onChange={(e) => setMemo(e.target.value)} maxLength={500} />
                  <p className="text-xs text-content-tertiary">{memo.length} / 500</p>
                </div>
                <label className="col-span-2 flex items-center gap-2 rounded-lg border bg-surface-secondary p-3 text-sm"><input type="checkbox" defaultChecked /> 광고성 정보 수신 동의 (동의 철회는 회원 본인 앱에서만 가능)</label>
              </div>
            )}
            <div className="flex justify-between border-t pt-4">
              <div className="flex gap-2">
                <Button data-dialog-id="DLG-M007" variant="outline" onClick={() => openDialog("DLG-M007")}>취소(이탈 확인)</Button>
                <Button data-dialog-id="DLG-M008" variant="outline" onClick={() => openDialog("DLG-M008")}>초기화</Button>
              </div>
              {step === 1 ? (
                <Button onClick={() => setStep(2)}>다음</Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)}>이전</Button>
                  <Button onClick={() => notify("회원 정보가 수정되었습니다. 회원 상세로 이동합니다.")}>저장</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none"><CardHeader><CardTitle>변경 감지 / 동시 편집</CardTitle></CardHeader><CardContent className="space-y-2 text-xs text-content-secondary"><div>동시 편집 충돌(409): 새로고침 후 재시도</div><div>네트워크 끊김: localStorage 임시 저장 + 자동 재시도 1회</div><div>이미지 5MB 초과·EXIF GPS 자동 제거</div><div>광고 동의 철회는 회원 본인 앱에서만</div></CardContent></Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function MemberTransferScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const member = memberDirectoryRows[0];
  const [targetBranch, setTargetBranch] = useState("서초점");
  const [reason, setReason] = useState("");
  const rebindRows = [
    { 필드: "소속지점", "현재 값": member.branch, "이관 후 값": targetBranch, 필수: "Y" },
    { 필드: "기본 이용지점", "현재 값": member.branch, "이관 후 값": targetBranch, 필수: "Y" },
    { 필드: "기본 매출 귀속 지점", "현재 값": member.branch, "이관 후 값": targetBranch, 필수: "Y" },
    { 필드: "정산 지점 기본값", "현재 값": member.branch, "이관 후 값": targetBranch, 필수: "Y" },
    { 필드: "담당 상담자(FC)", "현재 값": member.owner, "이관 후 값": "김FC", 필수: "Y" },
    { 필드: "담당 트레이너", "현재 값": "박트레이너", "이관 후 값": "정트레이너", 필수: "Y" },
    { 필드: "인센티브 귀속자", "현재 값": member.owner, "이관 후 값": "김FC", 필수: "Y" }
  ];
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="지점 이관 + 귀속 재배정" />
      <div className="grid grid-cols-4 gap-3">
        {screen.metrics.map((m) => <Card key={m.label} className="shadow-none"><CardHeader><CardDescription>{m.label}</CardDescription><CardTitle className="text-xl">{m.value}</CardTitle></CardHeader><CardContent><p className="text-xs text-content-tertiary">{m.hint}</p></CardContent></Card>)}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-5">
        <div className="space-y-5">
          <Card className="shadow-none">
            <CardHeader><CardTitle>이관 대상 회원</CardTitle><CardDescription>본사 통합 모드에서도 이관 원 지점은 회원 row의 실제 branchId를 기준으로 확정합니다.</CardDescription></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-sm">
              <InfoCell label="회원" value={`${member.name} · ${member.phone}`} />
              <InfoCell label="현재 소속" value={member.branch} />
              <InfoCell label="현재 이용권" value={member.pass} />
              <InfoCell label="기본 매출 귀속" value={member.branch} />
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader><CardTitle>유지 / 변경 항목</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3"><b>이관 후 유지</b><div className="mt-1 text-content-secondary">이용권 잔여일·잔여 횟수 · 결제 이력 · 출석 이력 · 상담 메모</div></div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3"><b>이관 후 변경(재배정 필요)</b><div className="mt-1 text-content-secondary">소속·이용·담당 FC·담당 트레이너·매출 귀속·정산·인센티브</div></div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader><CardTitle>이관 대상 지점 선택 + 귀속 재배정 표</CardTitle><CardDescription>현재 소속 지점은 선택 불가. 법인/홈오피스/주말/통합 회원권은 정산 지점 정책 추가 점검 필요.</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">{["서초점", "잠실점"].map((b) => <Button key={b} variant={targetBranch === b ? "default" : "outline"} onClick={() => { setTargetBranch(b); notify(`이관 대상 지점: ${b}`, "info"); }}>{b}</Button>)}</div>
              <div className="overflow-hidden rounded-xl border">
                <Table>
                  <TableHeader><TableRow>{screen.tableColumns.map((c) => <TableHead key={c}>{c}</TableHead>)}</TableRow></TableHeader>
                  <TableBody>{rebindRows.map((row) => <TableRow key={row.필드}><TableCell className="font-medium">{row.필드}</TableCell><TableCell>{row["현재 값"]}</TableCell><TableCell><Badge variant="info">{row["이관 후 값"]}</Badge></TableCell><TableCell>{row.필수}</TableCell></TableRow>)}</TableBody>
                </Table>
              </div>
              <Textarea placeholder="이관 사유 (선택, 10자 미만 시 경고)" value={reason} onChange={(e) => setReason(e.target.value)} />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => notify("이관 취소 mock", "info")}>취소</Button>
                <Button data-dialog-id="DLG-M023" onClick={() => openDialog("DLG-M023")}>이관 확인</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none"><CardHeader><CardTitle>차단 / 경고 조건</CardTitle></CardHeader><CardContent className="space-y-2 text-xs"><div className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-700">미납금 존재 → block, 정산 후 재진입</div><div className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-700">락커 보유 → block, 회수 후 재진입</div><div className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-amber-800">홀딩 중 → 이관 시 자동 해제</div><div className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-amber-800">PT 잔여 → 유형별 처리 안내</div><div className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-800">지점 한정 쿠폰 → N건 소멸 예정</div></CardContent></Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function BodyCompositionScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const [tab, setTab] = useState<"기록" | "추이">("기록");
  const [toggles, setToggles] = useState({ 체중: true, 골격근량: true, 체지방률: true });
  const rows = [
    { 날짜: "2026-05-28", 체중: "68.4kg", 골격근량: "29.8kg", 체지방률: "21.4%", BMI: "22.8", 기초대사량: "1,520kcal", 체수분: "42.6L", action: "수정 (본인 24h)" },
    { 날짜: "2026-05-21", 체중: "69.1kg", 골격근량: "29.4kg", 체지방률: "22.3%", BMI: "23.0", 기초대사량: "1,510kcal", 체수분: "42.1L", action: "-" },
    { 날짜: "2026-05-14", 체중: "69.8kg", 골격근량: "29.1kg", 체지방률: "22.9%", BMI: "23.3", 기초대사량: "1,495kcal", 체수분: "41.8L", action: "-" }
  ];
  const hasGraph = Object.values(toggles).some(Boolean) && rows.length >= 2;
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="체성분 추이 분석" />
      <div className="grid grid-cols-4 gap-3">
        {screen.metrics.map((m, i) => {
          const trend = ["-1.2kg ▼", "+0.4kg ▲", "-1.5% ▼", "정상"][i] ?? "";
          return <Card key={m.label} className="shadow-none"><CardHeader><CardDescription>{m.label}</CardDescription><CardTitle className="text-xl">{m.value}</CardTitle></CardHeader><CardContent><p className={cn("text-xs", trend.includes("▼") && m.label !== "골격근량" && "text-emerald-600", trend.includes("▲") && m.label === "골격근량" && "text-emerald-600", trend.includes("▼") && m.label === "골격근량" && "text-rose-600", trend.includes("▲") && m.label !== "골격근량" && m.label !== "BMI" && "text-rose-600")}>{trend}</p></CardContent></Card>;
        })}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-5">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>회원 선택 · {tab === "기록" ? "측정 기록" : "추이 분석"}</CardTitle>
            <CardDescription>회원 상세(SCR-M004) 체성분 탭에서 진입하면 회원 자동 선택. D11 SCR-I006과 route 공유.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Select defaultValue={memberDirectoryRows[0].name}><SelectTrigger className="max-w-xs"><SelectValue /></SelectTrigger><SelectContent>{memberDirectoryRows.map((m) => <SelectItem key={m.no} value={m.name}>{m.name} · {m.branch}</SelectItem>)}</SelectContent></Select>
              <div className="ml-auto flex gap-2">
                {(["기록", "추이"] as const).map((t) => <Button key={t} variant={tab === t ? "default" : "outline"} size="sm" onClick={() => setTab(t)}>{t === "기록" ? "측정 기록" : "추이 분석"}</Button>)}
                <Button data-dialog-id="DLG-M015" size="sm" onClick={() => openDialog("DLG-M015")}>측정 추가</Button>
              </div>
            </div>
            {tab === "추이" ? (
              <div>
                <div className="mb-3 flex gap-2 text-xs">
                  {(["체중", "골격근량", "체지방률"] as const).map((k) => <Button key={k} size="sm" variant={toggles[k] ? "default" : "outline"} onClick={() => setToggles((s) => ({ ...s, [k]: !s[k] }))}>{k}</Button>)}
                </div>
                {hasGraph ? (
                  <div className="rounded-xl border bg-surface-secondary p-4">
                    <p className="mb-2 text-xs font-semibold text-content-secondary">최근 3회 측정 시각화 (mock SVG)</p>
                    <svg viewBox="0 0 320 120" className="w-full">
                      {toggles.체중 && <polyline points="20,40 160,55 300,70" stroke="#f97316" strokeWidth="2" fill="none" />}
                      {toggles.골격근량 && <polyline points="20,80 160,75 300,72" stroke="#10b981" strokeWidth="2" fill="none" />}
                      {toggles.체지방률 && <polyline points="20,50 160,65 300,80" stroke="#f59e0b" strokeWidth="2" fill="none" />}
                      {["05-14", "05-21", "05-28"].map((d, i) => <text key={d} x={20 + i * 140} y="115" fontSize="9" fill="#64748b">{d}</text>)}
                    </svg>
                  </div>
                ) : (
                  <div className="rounded-xl border bg-surface-secondary p-8 text-center text-sm text-content-tertiary">{rows.length < 2 ? "2건부터 추이 그래프가 표시됩니다." : "지표를 1개 이상 선택해주세요."}</div>
                )}
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border">
                <Table>
                  <TableHeader><TableRow>{screen.tableColumns.map((c) => <TableHead key={c}>{c}</TableHead>)}</TableRow></TableHeader>
                  <TableBody>{rows.map((row) => <TableRow key={row.날짜}><TableCell>{row.날짜}</TableCell><TableCell>{row.체중}</TableCell><TableCell>{row.골격근량}</TableCell><TableCell>{row.체지방률}</TableCell><TableCell>{row.BMI}</TableCell><TableCell>{row.기초대사량}</TableCell><TableCell>{row.체수분}</TableCell><TableCell>{row.action === "-" ? "-" : <Button size="sm" variant="outline" data-dialog-id="DLG-M016" onClick={() => openDialog("DLG-M016")}>{row.action}</Button>}</TableCell></TableRow>)}</TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none"><CardHeader><CardTitle>액션 / 권한</CardTitle></CardHeader><CardContent className="space-y-2"><Button data-dialog-id="DLG-M015" className="w-full" onClick={() => openDialog("DLG-M015")}>측정 추가</Button><Button data-dialog-id="DLG-M017" variant="outline" className="w-full" onClick={() => openDialog("DLG-M017")}>목표 설정</Button><Button data-dialog-id="DLG-M016" variant="outline" className="w-full" onClick={() => openDialog("DLG-M016")}>동일 일자 덮어쓰기</Button><Button variant="outline" className="w-full" onClick={() => notify("CSV 내보내기 mock (V2 권한자만)", "info")}>CSV 내보내기</Button></CardContent></Card>
          <Card className="shadow-none"><CardHeader><CardTitle>예외 안내</CardTitle></CardHeader><CardContent className="space-y-1 text-xs text-content-secondary"><div>키 미등록 시 BMI 미계산</div><div>성별/나이 미등록 시 BMR 미계산</div><div>FC/트레이너 본인 등록 24h 내 수정만</div><div>InBody 매칭 실패 → 수동 매칭 큐</div></CardContent></Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function MemberMergeScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const [primary, setPrimary] = useState<string>("");
  const [secondary, setSecondary] = useState<string>("");
  const candidates = memberDirectoryRows.slice(0, 3);
  const compareRows = [
    { 항목: "이름", "주 계정": "김민준", "부 계정": "김민준A", 채택: "주 계정" },
    { 항목: "연락처", "주 계정": "010-1234-5678", "부 계정": "010-9876-5432", 채택: "주 계정" },
    { 항목: "프로필 사진", "주 계정": "최신 (2026-05)", "부 계정": "구형 (2025-08)", 채택: "주 계정" },
    { 항목: "이용권", "주 계정": "PT 20회 잔여 8", "부 계정": "회원권 3개월", 채택: "합산 이전" },
    { 항목: "등록일", "주 계정": "2026-01-12", "부 계정": "2025-08-04", 채택: "주 계정" },
    { 항목: "최근 방문일", "주 계정": "오늘 09:20", "부 계정": "2025-12-30", 채택: "주 계정" }
  ];
  const bothSelected = primary && secondary && primary !== secondary;
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="중복 회원 병합 (위험 액션)" />
      <div className="grid grid-cols-4 gap-3">
        {screen.metrics.map((m) => <Card key={m.label} className="shadow-none"><CardHeader><CardDescription>{m.label}</CardDescription><CardTitle className="text-xl">{m.value}</CardTitle></CardHeader><CardContent><p className="text-xs text-content-tertiary">{m.hint}</p></CardContent></Card>)}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-5">
        <div className="space-y-5">
          <Card className="shadow-none">
            <CardHeader><CardTitle>중복 회원 검색 + 주/부 지정</CardTitle><CardDescription>이름·연락처·생년월일로 중복 의심 회원 검색. 동일 회원은 선택 불가.</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2"><Input placeholder="이름" defaultValue="김민준" /><Input placeholder="연락처" /><Input placeholder="생년월일" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="mb-2 text-xs font-bold text-content-secondary">주 계정 (남길 계정)</p>
                  <div className="space-y-2">{candidates.map((c) => <button key={`p-${c.no}`} type="button" className={cn("w-full rounded-lg border p-3 text-left text-sm", primary === c.no && "border-blue-500 bg-blue-50")} onClick={() => setPrimary(c.no)}><b>{c.name}</b> · {c.phone}<div className="text-xs text-content-tertiary">{c.branch} · {c.pass}</div></button>)}</div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-bold text-content-secondary">부 계정 (병합 후 비활성)</p>
                  <div className="space-y-2">{candidates.map((c) => <button key={`s-${c.no}`} type="button" disabled={primary === c.no} className={cn("w-full rounded-lg border p-3 text-left text-sm disabled:opacity-45", secondary === c.no && "border-rose-500 bg-rose-50")} onClick={() => setSecondary(c.no)}><b>{c.name}</b> · {c.phone}<div className="text-xs text-content-tertiary">{c.branch} · {c.pass}</div></button>)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader><CardTitle>병합 전 정보 비교 + 채택 선택</CardTitle><CardDescription>출석·결제·상담·체성분 이력은 모두 주 계정으로 이전됩니다.</CardDescription></CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-xl border">
                <Table>
                  <TableHeader><TableRow>{screen.tableColumns.map((c) => <TableHead key={c}>{c}</TableHead>)}</TableRow></TableHeader>
                  <TableBody>{compareRows.map((row) => <TableRow key={row.항목}><TableCell className="font-medium">{row.항목}</TableCell><TableCell>{row["주 계정"]}</TableCell><TableCell>{row["부 계정"]}</TableCell><TableCell><Badge variant="info">{row.채택}</Badge></TableCell></TableRow>)}</TableBody>
                </Table>
              </div>
              <div className="mt-4 flex justify-end">
                <Button data-dialog-id="DLG-M028" variant="destructive" disabled={!bothSelected} onClick={() => bothSelected ? openDialog("DLG-M028") : notify("주/부 계정 두 개 모두 선택해주세요.", "warning")}>회원 병합 확인 (위험)</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none"><CardHeader><CardTitle>병합 후 처리</CardTitle></CardHeader><CardContent className="space-y-2 text-xs text-content-secondary"><div>부 계정은 즉시 삭제가 아닌 비활성 전환</div><div>90일 경과 시 PII 마스킹 자동 적용</div><div>병합 5분 경과 후 취소 불가</div><div>가족 그룹 대표가 부 계정인 경우 그룹 해체</div><div>등급 즉시 재계산, 세그먼트 D+1 갱신</div></CardContent></Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function FamilyMembersScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const groups = [
    { 이름: "김씨 가족", 대표: "김민준", 구성원: 3, 활성: 2, "최근 결제": "2026-05-28" },
    { 이름: "박씨 가족", 대표: "박서연", 구성원: 4, 활성: 3, "최근 결제": "2026-05-20" },
    { 이름: "정씨 가족", 대표: "정하준", 구성원: 2, 활성: 1, "최근 결제": "2026-04-15" }
  ];
  const [activeGroup, setActiveGroup] = useState(groups[0]);
  const members = [
    { 이름: "김민준(대표)", 관계: "본인", "이용권 상태": "활성·PT 20회", "최근 방문일": "오늘 09:20" },
    { 이름: "김지우", 관계: "자녀", "이용권 상태": "활성·키즈권", "최근 방문일": "2026-05-26" },
    { 이름: "박서연", 관계: "배우자", "이용권 상태": "임박·D-3", "최근 방문일": "2026-05-21" }
  ];
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="가족 단위 운영" />
      <div className="grid grid-cols-4 gap-3">
        {screen.metrics.map((m) => <Card key={m.label} className="shadow-none"><CardHeader><CardDescription>{m.label}</CardDescription><CardTitle className="text-xl">{m.value}</CardTitle></CardHeader><CardContent><p className="text-xs text-content-tertiary">{m.hint}</p></CardContent></Card>)}
      </div>
      <div className="grid grid-cols-[320px_minmax(0,1fr)] gap-5">
        <Card className="shadow-none">
          <CardHeader><CardTitle>가족 그룹</CardTitle><CardDescription>대표 회원 기준 카드 목록</CardDescription></CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" onClick={() => notify("새 그룹 만들기 모달 mock", "info")}>+ 새 그룹 만들기</Button>
            {groups.map((g) => (
              <button key={g.이름} type="button" className={cn("w-full rounded-xl border p-3 text-left", activeGroup.이름 === g.이름 && "border-blue-500 bg-blue-50")} onClick={() => setActiveGroup(g)}>
                <div className="flex items-center justify-between"><b>{g.이름}</b><Badge variant="secondary">{g.구성원}명</Badge></div>
                <div className="mt-1 text-xs text-content-tertiary">대표 {g.대표} · 활성 {g.활성}명</div>
                <div className="mt-1 text-xs text-content-tertiary">최근 결제 {g["최근 결제"]}</div>
              </button>
            ))}
          </CardContent>
        </Card>
        <div className="space-y-5">
          <Card className="shadow-none">
            <CardHeader><CardTitle>{activeGroup.이름} · 구성원</CardTitle><CardDescription>그룹 정원 10명 한도. 무기명 법인은 가입 불가.</CardDescription></CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-xl border">
                <Table>
                  <TableHeader><TableRow>{screen.tableColumns.map((c) => <TableHead key={c}>{c}</TableHead>)}</TableRow></TableHeader>
                  <TableBody>{members.map((row) => <TableRow key={row.이름}><TableCell className="font-semibold">{row.이름}</TableCell><TableCell>{row.관계}</TableCell><TableCell>{statusAwareValue(row["이용권 상태"].split("·")[0].trim())} {row["이용권 상태"].split("·")[1]}</TableCell><TableCell>{row["최근 방문일"]}</TableCell></TableRow>)}</TableBody>
                </Table>
              </div>
              <div className="mt-3 flex gap-2">
                <Button data-dialog-id="DLG-M029" onClick={() => openDialog("DLG-M029")}>가족 연결 (구성원 추가)</Button>
                <Button variant="outline" onClick={() => notify("구성원 제거 mock", "info")}>구성원 제거</Button>
                <Button variant="destructive" onClick={() => notify("그룹 삭제는 권한자만 가능", "warning")}>그룹 삭제</Button>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader><CardTitle>가족 단위 요약</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-3 gap-3 text-sm">
              <InfoCell label="가족 전체 이용권" value="활성 2 · 임박 1" />
              <InfoCell label="활성 회원" value="2명" />
              <InfoCell label="총 마일리지" value="3,400 (합산 정책 ON)" />
            </CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </div>
      </div>
    </div>
  );
}

function MemberSegmentsScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const autoSegments = [
    { 세그먼트: "신규(자동)", "조건 설명": "첫 정상 결제 +30일 이내", "현재 회원 수": "52", "마지막 업데이트": "오늘 04:00", "자동 갱신 주기": "매일/이벤트" },
    { 세그먼트: "이탈위험(자동)", "조건 설명": "활성+30일 무방문(2h 중복 1회)", "현재 회원 수": "86", "마지막 업데이트": "오늘 04:00", "자동 갱신 주기": "매일/이벤트" },
    { 세그먼트: "만료임박(자동)", "조건 설명": "HQ-09 회원 이용권 만료 step", "현재 회원 수": "184", "마지막 업데이트": "오늘 04:00", "자동 갱신 주기": "매일/이벤트" },
    { 세그먼트: "활발(자동)", "조건 설명": "최근 30일 방문 8회 이상", "현재 회원 수": "112", "마지막 업데이트": "오늘 04:00", "자동 갱신 주기": "매일/이벤트" },
    { 세그먼트: "관심필요(자동)", "조건 설명": "최근 90일 평가/상담 없음", "현재 회원 수": "73", "마지막 업데이트": "오늘 04:00", "자동 갱신 주기": "매일/이벤트" },
    { 세그먼트: "만료후미등록(자동)", "조건 설명": "마지막 만료 +60일, 재등록 없음", "현재 회원 수": "48", "마지막 업데이트": "오늘 04:00", "자동 갱신 주기": "매일/이벤트" },
    { 세그먼트: "충성(보조)", "조건 설명": "누적 12개월+ 골드 이상", "현재 회원 수": "42", "마지막 업데이트": "오늘 04:00", "자동 갱신 주기": "매일" }
  ];
  const [tab, setTab] = useState<"자동" | "사용자" | "빌더">("자동");
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="자동 7종 + 사용자 세그먼트" />
      <div className="grid grid-cols-4 gap-3">
        {screen.metrics.map((m) => <Card key={m.label} className="shadow-none"><CardHeader><CardDescription>{m.label}</CardDescription><CardTitle className="text-xl">{m.value}</CardTitle></CardHeader><CardContent><p className="text-xs text-content-tertiary">{m.hint}</p></CardContent></Card>)}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-5">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>세그먼트 목록</CardTitle>
            <CardDescription>자동 7종은 시스템 정의로 수정/삭제 버튼이 hidden. 매일 04:00 재계산 + 이벤트 실시간.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              {(["자동", "사용자", "빌더"] as const).map((t) => <Button key={t} variant={tab === t ? "default" : "outline"} size="sm" onClick={() => setTab(t)}>{t === "자동" ? "자동 7종" : t === "사용자" ? "사용자 정의" : "조건 빌더"}</Button>)}
              <Button size="sm" className="ml-auto" onClick={() => notify("새 세그먼트 만들기 mock", "info")}>+ 새 세그먼트</Button>
            </div>
            {tab === "빌더" ? (
              <div className="space-y-3 rounded-xl border bg-surface-secondary p-4">
                <p className="text-sm font-semibold">조건 빌더 (AND/OR, 최대 3단계 중첩)</p>
                {screen.filters.map((f) => <div key={f} className="rounded-lg bg-white p-3 text-xs text-content-secondary">• {f}</div>)}
                <div className="flex gap-2"><Button size="sm" onClick={() => notify("미리보기 결과: 86명, 샘플 명단 표시 mock", "info")}>미리보기</Button><Button size="sm" variant="outline">자동 갱신 주기 설정</Button><Button size="sm" variant="outline">저장</Button></div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border">
                <Table>
                  <TableHeader><TableRow>{["세그먼트", "조건 설명", "현재 회원 수", "마지막 업데이트", "자동 갱신 주기", "액션"].map((c) => <TableHead key={c}>{c}</TableHead>)}</TableRow></TableHeader>
                  <TableBody>{(tab === "자동" ? autoSegments : []).map((row) => <TableRow key={row.세그먼트}><TableCell className="font-semibold">{row.세그먼트}</TableCell><TableCell className="text-xs text-content-secondary">{row["조건 설명"]}</TableCell><TableCell><Badge variant="info">{row["현재 회원 수"]}</Badge></TableCell><TableCell className="text-xs">{row["마지막 업데이트"]}</TableCell><TableCell className="text-xs">{row["자동 갱신 주기"]}</TableCell><TableCell><div className="flex gap-1"><Button size="sm" variant="outline" onClick={() => notify(`${row.세그먼트} 회원 보기 모달 mock`, "info")}>보기</Button><Button size="sm" data-dialog-id="DLG-M009" variant="outline" onClick={() => openDialog("DLG-M009")}>메모</Button></div></TableCell></TableRow>)}</TableBody>
                </Table>
                {tab === "사용자" && <div className="grid place-items-center p-10 text-sm text-content-tertiary">사용자 정의 세그먼트가 없습니다. + 새 세그먼트 만들기로 시작하세요.</div>}
              </div>
            )}
          </CardContent>
        </Card>
        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none"><CardHeader><CardTitle>액션 연결</CardTitle></CardHeader><CardContent className="space-y-2"><Button className="w-full" onClick={() => notify("SCR-071 메시지 발송 화면으로 이동 mock (광고 동의 자동 필터)", "info")}>메시지 발송 (SCR-071)</Button><Button variant="outline" className="w-full" onClick={() => notify("SCR-073 쿠폰 발급 화면으로 이동 mock", "info")}>쿠폰 발급 (SCR-073)</Button><Button variant="outline" className="w-full" onClick={() => notify("이용권 혜택 적용 mock", "info")}>이용권 혜택 적용</Button><Button data-dialog-id="DLG-M009" variant="outline" className="w-full" onClick={() => openDialog("DLG-M009")}>운영 메모 추가</Button></CardContent></Card>
          <Card className="shadow-none"><CardHeader><CardTitle>자동 라벨 우선순위</CardTitle></CardHeader><CardContent className="space-y-1 text-xs text-content-secondary"><div>이탈위험 &gt; 만료임박 &gt; 신규 &gt; 활발 &gt; 관심필요 &gt; 만료후미등록</div><div>충성은 보조 라벨 (기본 라벨과 중복 표시 가능)</div><div>FC는 메시지 발송만 가능, 샘플 명단 PII 마스킹</div></CardContent></Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function SalesOverviewScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const [preset, setPreset] = useState("이번 달");
  const [query, setQuery] = useState("");
  const rows = salesLedgerRows.filter((row) => `${row.buyer} ${row.product} ${row.status}`.includes(query));
  return <div className="space-y-5"><DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="매출 운영 코크핏" /><div className="grid grid-cols-4 gap-3">{[{ label: "순 매출", value: "18,420,000원" }, { label: "카드 결제", value: "12,800,000원" }, { label: "현금 결제", value: "4,500,000원" }, { label: "미수금", value: "1,120,000원" }].map((metric) => <Card key={metric.label} className="shadow-none"><CardHeader><CardDescription>{metric.label}</CardDescription><CardTitle className="text-2xl">{metric.value}</CardTitle></CardHeader></Card>)}</div><div className="grid grid-cols-[minmax(0,1fr)_340px] gap-5"><div className="space-y-5"><Card className="shadow-none"><CardHeader><CardTitle>운영 코크핏</CardTitle><CardDescription>미수·환불·재등록·고할인 거래를 first fold에 배치합니다.</CardDescription></CardHeader><CardContent className="grid grid-cols-4 gap-3">{["미수 추적", "환불 검토", "재등록 성과", "고할인 거래"].map((item) => <button key={item} className="rounded-xl border p-4 text-left hover:bg-surface-secondary" onClick={() => notify(`${item} 필터 적용`, "info")}><div className="font-semibold">{item}</div><div className="mt-1 text-xs text-content-tertiary">처리 우선순위 mock</div></button>)}</CardContent></Card><Card className="shadow-none"><CardHeader><CardTitle>매출 현황 테이블</CardTitle><CardDescription>기간 프리셋, 통합 검색, 하단 요약 바 7종을 포함합니다.</CardDescription></CardHeader><CardContent className="space-y-3"><div className="flex flex-wrap gap-2">{["오늘", "이번 주", "이번 달"].map((item) => <Button key={item} variant={preset === item ? "default" : "outline"} onClick={() => { setPreset(item); notify(`${item} 기간 설정`, "info"); }}>{item}</Button>)}<Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="구매자 이름 또는 상품명" className="max-w-xs" /><Button asChild><Link href="/sales/pos">신규 결제(POS)</Link></Button><Button variant="outline" onClick={() => notify("엑셀 다운로드 mock", "info")}>엑셀</Button></div><div className="overflow-hidden rounded-xl border"><Table><TableHeader><TableRow>{["매출번호", "회원", "상품", "총액", "할인", "수납", "상태", "수단", "담당", "경로", "일시"].map((col) => <TableHead key={col}>{col}</TableHead>)}</TableRow></TableHeader><TableBody>{rows.map((row) => <TableRow key={row.id} onClick={() => openDialog("DLG-S001")} className="cursor-pointer"><TableCell>{row.id}</TableCell><TableCell className="font-semibold">{row.buyer}</TableCell><TableCell>{row.product}</TableCell><TableCell>{row.gross}</TableCell><TableCell>{row.discount}</TableCell><TableCell>{row.paid}</TableCell><TableCell>{statusAwareValue(row.status)}</TableCell><TableCell>{row.method}</TableCell><TableCell>{row.owner}</TableCell><TableCell>{row.route}</TableCell><TableCell>{row.date}</TableCell></TableRow>)}</TableBody></Table></div><div className="grid grid-cols-7 gap-2 rounded-xl border border-primary/20 bg-gradient-to-r from-primary via-primary to-[#ff907f] p-3 text-white shadow-[0_16px_32px_rgba(255,127,110,0.18)]">{["총매출 19.5M", "순매출 18.4M", "현금 4.5M", "카드 12.8M", "환불 620K", "미납 1.12M", "할인 530K"].map((item) => <div key={item} className="text-center text-xs font-semibold">{item}</div>)}</div></CardContent></Card></div><aside className="min-w-0 space-y-5"><Card className="shadow-none"><CardHeader><CardTitle>처리 큐</CardTitle></CardHeader><CardContent className="space-y-2">{salesLedgerRows.slice(0, 3).map((row) => <div key={row.id} className="rounded-lg border p-3 text-sm"><b>{row.buyer}</b> · {row.product}<div className="mt-2 flex gap-2"><Button size="sm" data-dialog-id="DLG-S001" onClick={() => openDialog("DLG-S001")}>거래 보기</Button><Button size="sm" variant="outline" asChild><Link href="/members/detail">회원 보기</Link></Button></div></div>)}<Button data-dialog-id="DLG-S005" variant="outline" className="w-full" onClick={() => openDialog("DLG-S005")}>메모 편집</Button><Button data-dialog-id="DLG-S012" variant="outline" className="w-full" onClick={() => openDialog("DLG-S012")}>목표 설정</Button></CardContent></Card><DialogDock screen={screen} openDialog={openDialog} /><DialogDock screen={screen} openDialog={openDialog} /><HandoffContractCard screen={screen} /></aside></div></div>;
}

function PosSalesScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const [cart, setCart] = useState(posProducts.slice(0, 2));
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  return <div className="space-y-5"><DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="현장 판매 POS" /><div className="grid grid-cols-[minmax(0,1fr)_380px] gap-5"><Card className="shadow-none"><CardHeader><CardTitle>상품 선택</CardTitle><CardDescription>재고/품절/안전재고 상태를 클릭 차단까지 표현합니다.</CardDescription></CardHeader><CardContent className="grid grid-cols-2 gap-3">{posProducts.map((product) => <button key={product.name} disabled={product.stock === "품절"} className="rounded-xl border p-4 text-left disabled:opacity-45" onClick={() => { setCart((current) => [...current, product]); notify(`${product.name} 장바구니 추가`, "info"); }}><Badge className={product.color}>{product.category}</Badge><div className="mt-3 text-lg font-bold">{product.name}</div><div className="mt-1 text-sm text-content-tertiary">{product.price.toLocaleString()}원</div><div className="mt-3 text-xs">{product.stock}</div></button>)}</CardContent></Card><aside className="min-w-0 space-y-5"><Card className="shadow-none"><CardHeader><CardTitle>장바구니 / 결제</CardTitle><CardDescription>회원 검색 후 외부 POS 완료 건을 CRM에 기록합니다.</CardDescription></CardHeader><CardContent className="space-y-3"><Button data-dialog-id="DLG-S002" variant="outline" className="w-full" onClick={() => openDialog("DLG-S002")}>구매자 검색</Button><div className="space-y-2">{cart.map((item, index) => <div key={`${item.name}-${index}`} className="flex items-center justify-between rounded-lg border p-2 text-sm"><span>{item.name}</span><span>{item.price.toLocaleString()}원</span></div>)}</div><div className="rounded-2xl bg-gradient-to-br from-primary via-primary to-[#ff907f] p-4 text-white shadow-[0_16px_32px_rgba(255,127,110,0.22)]"><div className="text-sm text-white/85">최종 결제금액</div><div className="text-2xl font-bold">{total.toLocaleString()}원</div></div><Button data-dialog-id="DLG-S003" className="w-full" onClick={() => openDialog("DLG-S003")}>결제 확인</Button><Button data-dialog-id="DLG-S004" variant="outline" className="w-full" onClick={() => openDialog("DLG-S004")}>중복 결제 경고 보기</Button></CardContent></Card><DialogDock screen={screen} openDialog={openDialog} /><DialogDock screen={screen} openDialog={openDialog} /><HandoffContractCard screen={screen} /></aside></div></div>;
}

function PaymentProcessingScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const [receipt, setReceipt] = useState(false);
  const [done, setDone] = useState(false);
  return <div className="space-y-5"><DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="결제 등록 플로우" />{done ? <Card className="shadow-none"><CardContent className="grid place-items-center py-16 text-center"><CheckCircle2 className="size-16 text-emerald-600" /><h2 className="mt-4 text-2xl font-bold">결제 등록 완료</h2><p className="mt-2 text-sm text-content-secondary">결제완료 상태와 회원권/수강권 구매 완료가 함께 반영되는 mock 완료 화면입니다.</p><div className="mt-6 flex gap-2"><Button onClick={() => notify("영수증 파일 보기 mock", "info")}>영수증 파일 보기</Button><Button variant="outline" onClick={() => notify("문자 발송 mock", "info")}>문자 발송</Button><Button variant="outline" onClick={() => setDone(false)}>계속 판매하기</Button><Button asChild><Link href="/sales">매출 현황</Link></Button></div></CardContent></Card> : <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-5"><Card className="shadow-none"><CardHeader><CardTitle>구매자 · 상품 · 수납 · 완료</CardTitle><CardDescription>현장 전액 등록, 잔액 등록, 계약금 등록을 분리합니다.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="grid grid-cols-3 gap-3">{["현장 전액 등록", "잔액 등록", "계약금 등록"].map((item) => <button key={item} className="rounded-xl border p-4 text-left hover:bg-surface-secondary" onClick={() => notify(`${item} 유형 선택`, "info")}><b>{item}</b><p className="mt-1 text-xs text-content-tertiary">외부 POS/현금 수납 완료 후 CRM 기록</p></button>)}</div><div className="grid grid-cols-2 gap-4"><Input placeholder="회원 검색" defaultValue="김민준" /><Input placeholder="상품" defaultValue="PT 20회" /><Input placeholder="수납 금액" defaultValue="1,150,000" /><Input placeholder="결제 수단" defaultValue="카드" /></div><div className="rounded-xl border p-4"><div className="flex items-center justify-between"><div><b>영수증 파일</b><p className="text-xs text-content-tertiary">이미지 또는 PDF만 첨부 가능</p></div><Button variant={receipt ? "default" : "outline"} onClick={() => { setReceipt(true); notify("영수증 첨부 mock 완료"); }}>{receipt ? "첨부 완료" : "파일 첨부"}</Button></div>{!receipt && <p className="mt-2 text-xs text-rose-600">영수증 파일을 첨부해주세요.</p>}</div><div className="flex justify-between"><Button variant="outline" onClick={() => notify("결제 상태 초기화", "info")}>초기화</Button><Button data-dialog-id="DLG-S003" disabled={!receipt} onClick={() => receipt ? setDone(true) : notify("영수증 파일을 첨부해주세요.", "warning")}>결제 등록</Button></div></CardContent></Card><aside className="min-w-0 space-y-5"><Card className="shadow-none"><CardHeader><CardTitle>예외/연결 DLG</CardTitle></CardHeader><CardContent className="space-y-2"><Button data-dialog-id="DLG-S002" className="w-full" variant="outline" onClick={() => openDialog("DLG-S002")}>구매자 검색</Button><Button data-dialog-id="DLG-S004" className="w-full" variant="outline" onClick={() => openDialog("DLG-S004")}>중복 결제 경고</Button><Button data-dialog-id="DLG-S009" className="w-full" variant="outline" onClick={() => openDialog("DLG-S009")}>할부 등록</Button></CardContent></Card><DialogDock screen={screen} openDialog={openDialog} /><HandoffContractCard screen={screen} /></aside></div>}</div>;
}


function SalesAnalyticsScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const [topTab, setTopTab] = useState<"전체 통계" | "직군별" | "담당자별">("전체 통계");
  const [subTab, setSubTab] = useState<"상품별" | "상품타입별" | "결제수단별" | "종목별" | "개월별" | "GX종목별" | "법인권">("상품별");
  const [preset, setPreset] = useState("이번 달");
  const [compare, setCompare] = useState(true);
  const subTabs = ["상품별", "상품타입별", "결제수단별", "종목별", "개월별", "GX종목별", "법인권"] as const;
  const productData = [
    { name: "PT 20회권", count: 74, sales: 8900, ratio: 39 },
    { name: "회원권 3개월", count: 112, sales: 6200, ratio: 27 },
    { name: "GX 요가", count: 46, sales: 2100, ratio: 9 },
    { name: "골프 시뮬레이터", count: 32, sales: 1800, ratio: 8 },
    { name: "락커", count: 158, sales: 940, ratio: 4 }
  ];
  const gxBreakdown = [
    { name: "요가", count: 46, ratio: 38 }, { name: "필라테스", count: 32, ratio: 27 }, { name: "스피닝", count: 18, ratio: 15 }, { name: "줌바", count: 14, ratio: 12 }, { name: "GX 기타", count: 10, ratio: 8 }
  ];
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="다관점 매출 분석 (V2 채택)" />
      <div className="grid grid-cols-4 gap-3">
        {screen.metrics.map((m) => <Card key={m.label} className="shadow-none"><CardHeader><CardDescription>{m.label}</CardDescription><CardTitle className="text-xl">{m.value}</CardTitle></CardHeader><CardContent><p className="text-xs text-content-tertiary">{m.hint}</p></CardContent></Card>)}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-5">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>최상위 탭 + 하위 탭</CardTitle>
            <CardDescription>3 최상위 / 7 하위 탭. 전월 대비 토글, GX 5종 세부, 골프프로별, 법인권 별도 분석.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(["전체 통계", "직군별", "담당자별"] as const).map((t) => <Button key={t} variant={topTab === t ? "default" : "outline"} onClick={() => setTopTab(t)}>{t}</Button>)}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {["이번 달", "지난 달", "최근 3개월", "최근 6개월", "올해"].map((p) => <Button key={p} size="sm" variant={preset === p ? "default" : "outline"} onClick={() => { setPreset(p); notify(`${p} 기간 적용`, "info"); }}>{p}</Button>)}
              <Input placeholder="시작일" defaultValue="2026-05-01" className="max-w-[120px]" />
              <Input placeholder="종료일" defaultValue="2026-05-31" className="max-w-[120px]" />
              <Button size="sm" onClick={() => notify("기간 조회 mock", "info")}>조회</Button>
              <label className="ml-auto flex items-center gap-2 text-xs"><input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} /> 전월 대비 토글</label>
            </div>
            {topTab === "전체 통계" && (
              <div className="flex flex-wrap gap-1">
                {subTabs.map((t) => <Button key={t} size="sm" variant={subTab === t ? "secondary" : "ghost"} onClick={() => setSubTab(t)}>{t}</Button>)}
              </div>
            )}
            <div className="rounded-xl border bg-surface-secondary p-4">
              <p className="mb-2 text-xs font-semibold text-content-secondary">{topTab} · {topTab === "전체 통계" ? subTab : "-"} 차트 (mock 가로 막대)</p>
              {topTab === "전체 통계" && subTab === "GX종목별" ? (
                <div className="space-y-2">{gxBreakdown.map((g) => <div key={g.name} className="flex items-center gap-2 text-xs"><span className="w-20 truncate font-medium">{g.name}</span><div className="h-3 flex-1 overflow-hidden rounded bg-white"><div className="h-full bg-violet-400" style={{ width: `${g.ratio * 2.5}%` }} /></div><span className="w-16 text-right text-content-tertiary">{g.count}건</span><span className="w-12 text-right font-semibold">{g.ratio}%</span></div>)}</div>
              ) : (
                <div className="space-y-2">{productData.map((p) => <div key={p.name} className="flex items-center gap-2 text-xs"><span className="w-24 truncate font-medium">{p.name}</span><div className="h-3 flex-1 overflow-hidden rounded bg-white"><div className="h-full bg-sky-400" style={{ width: `${Math.min(p.ratio * 2.5, 100)}%` }} /></div><span className="w-16 text-right text-content-tertiary">{p.sales}만원</span><span className="w-12 text-right font-semibold">{p.ratio}%</span></div>)}</div>
              )}
              {compare && <div className="mt-3 flex items-center gap-2 rounded-lg bg-white p-2 text-xs"><Badge variant="success">전월 대비 +12.4%</Badge><span className="text-content-tertiary">전월 동기 매출: 16,380,000원</span></div>}
            </div>
            <div className="overflow-hidden rounded-xl border">
              <Table>
                <TableHeader><TableRow>{topTab === "담당자별" ? screen.tableColumns : screen.tableColumns.slice(0, 4).map((c) => c)}{topTab === "담당자별" ? null : <></>}{(topTab === "담당자별" ? [] : []).map((c) => <TableHead key={c}>{c}</TableHead>)}{(topTab === "담당자별" ? screen.tableColumns : screen.tableColumns.slice(0, 4)).map((c) => <TableHead key={c}>{c}</TableHead>)}</TableRow></TableHeader>
                <TableBody>{screen.rows.map((row) => <TableRow key={row["분석 항목명"]}>{(topTab === "담당자별" ? screen.tableColumns : screen.tableColumns.slice(0, 4)).map((c) => <TableCell key={c}>{row[c]}</TableCell>)}</TableRow>)}</TableBody>
              </Table>
            </div>
            <div className="rounded-lg border bg-amber-50 p-3 text-xs text-amber-900"><b>골프프로별 매출</b> (담당자별 탭): `[매출종합]` `골프매출` 탭의 `등록강사` 기준으로 프로별 합계와 비중을 표시 (V2)</div>
          </CardContent>
        </Card>
        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none"><CardHeader><CardTitle>액션</CardTitle></CardHeader><CardContent className="space-y-2"><Button data-dialog-id="DLG-S012" className="w-full" onClick={() => openDialog("DLG-S012")}>목표 매출 설정</Button><Button variant="outline" className="w-full" onClick={() => notify("CSV 내보내기 mock", "info")}>CSV 내보내기</Button></CardContent></Card>
          <Card className="shadow-none"><CardHeader><CardTitle>V2 신규 분석축</CardTitle></CardHeader><CardContent className="space-y-1 text-xs text-content-secondary"><div>• 직군별 / 담당자별 매출</div><div>• GX 5종 세부 (요가/필라테스/스피닝/줌바/GX 기타)</div><div>• 법인권 (B2B) 별도 분석</div><div>• 골프프로별 매출 (등록강사 기준)</div><div>• 신규/재등록/기타 매출 분리</div></CardContent></Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function DeferredRevenueScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const [period, setPeriod] = useState({ from: "2026-05-01", to: "2026-05-31" });
  const [bucket, setBucket] = useState<"전체" | "1" | "3" | "6" | "12" | "기타">("전체");
  const onBucketChange = (b: typeof bucket) => { setBucket(b); notify(`${b === "전체" || b === "기타" ? b : `${b}개월`} 버킷 적용`, "info"); };
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="기간권 인식 추적" />
      <div className="grid grid-cols-4 gap-3">
        {screen.metrics.map((m, i) => <Card key={m.label} className={cn("shadow-none", i === 1 && "border-emerald-200 bg-emerald-50/50", i === 2 && "border-blue-200 bg-blue-50/50")}><CardHeader><CardDescription>{m.label}</CardDescription><CardTitle className={cn("text-xl", i === 1 && "text-emerald-700", i === 2 && "text-blue-700 font-bold")}>{m.value}</CardTitle></CardHeader><CardContent><p className="text-xs text-content-tertiary">{m.hint}</p></CardContent></Card>)}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>선수익금 계약 목록 (8컬럼)</CardTitle>
            <CardDescription>5버킷(1/3/6/12개월/기타) + 진행률 프로그레스. durationMonths가 있으면 상품명·외부 시트·수기 분류보다 우선.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Label className="text-xs">시작일</Label><Input value={period.from} onChange={(e) => setPeriod({ ...period, from: e.target.value })} className="max-w-[140px]" />
              <Label className="text-xs">종료일</Label><Input value={period.to} onChange={(e) => setPeriod({ ...period, to: e.target.value })} className="max-w-[140px]" />
              <div className="ml-auto flex gap-1">{(["전체", "1", "3", "6", "12", "기타"] as const).map((b) => <Button key={b} size="sm" variant={bucket === b ? "default" : "outline"} onClick={() => onBucketChange(b)}>{b === "전체" || b === "기타" ? b : `${b}개월`}</Button>)}</div>
            </div>
            <div className="overflow-hidden rounded-xl border">
              <Table>
                <TableHeader><TableRow>{screen.tableColumns.map((c) => <TableHead key={c}>{c}</TableHead>)}</TableRow></TableHeader>
                <TableBody>{screen.rows.map((row, idx) => {
                  const pct = parseInt(row.진행률 || "0", 10);
                  return <TableRow key={`${row.회원명}-${idx}`} className="cursor-pointer" onClick={() => openDialog("DLG-S001")}>
                    <TableCell className="font-semibold">{row.회원명}</TableCell><TableCell>{row.상품명}</TableCell><TableCell>{row.총액}</TableCell>
                    <TableCell className="font-semibold text-emerald-700">{row["인식 완료"]}</TableCell>
                    <TableCell className="font-bold text-blue-700">{row.잔여}</TableCell>
                    <TableCell>{row.시작일}</TableCell><TableCell>{row.종료일}</TableCell>
                    <TableCell><div className="flex items-center gap-2"><div className="h-2 w-24 overflow-hidden rounded bg-line"><div className={cn("h-full", pct >= 80 ? "bg-rose-500" : pct >= 50 ? "bg-orange-400" : "bg-emerald-400")} style={{ width: `${pct}%` }} /></div><span className="text-xs font-semibold">{pct}%</span></div></TableCell>
                  </TableRow>;
                })}</TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none"><CardHeader><CardTitle>정책 / 산식 안내</CardTitle></CardHeader><CardContent className="space-y-2 text-xs text-amber-900"><div className="rounded-lg border border-amber-200 bg-amber-50 p-3"><b>정책 확인 필요</b><div className="mt-1 text-amber-800">자동 산식 미확정. 일별 인식 배치 03:00 크론, 인식 정확도 검증 매월 1일 04:00.</div></div><div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-blue-900"><b>버킷 규칙</b><div className="mt-1">기타 = 2/4/5/9개월, 기간 직접 입력, 무기한, 종료일 미정 등 1/3/6/12에 안 들어가는 모든 기간</div></div></CardContent></Card>
          <Card className="shadow-none"><CardHeader><CardTitle>액션</CardTitle></CardHeader><CardContent className="space-y-2"><Button data-dialog-id="DLG-S001" variant="outline" className="w-full" onClick={() => openDialog("DLG-S001")}>원 매출 상세</Button></CardContent></Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function RefundManagementScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const [tab, setTab] = useState<"내역" | "담당자별">("내역");
  const [period, setPeriod] = useState("이번 달");
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="환불 통계 + 담당자별 책임" />
      <div className="grid grid-cols-4 gap-3">
        {screen.metrics.map((m) => <Card key={m.label} className="shadow-none"><CardHeader><CardDescription>{m.label}</CardDescription><CardTitle className="text-xl">{m.value}</CardTitle></CardHeader><CardContent><p className="text-xs text-content-tertiary">{m.hint}</p></CardContent></Card>)}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>환불 내역 (19컬럼)</CardTitle>
            <CardDescription>환불금액 빨강 강조, 상태 배지(완료/처리중/거절). 환불 자동 산식 미확정 — 수기 입력값 표시.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              {(["내역", "담당자별"] as const).map((t) => <Button key={t} size="sm" variant={tab === t ? "default" : "outline"} onClick={() => setTab(t)}>{t === "내역" ? "환불 내역 (목록)" : "원판매 담당자별 환불 책임"}</Button>)}
              <div className="ml-auto flex gap-1">{["이번 달", "지난 달", "최근 3개월"].map((p) => <Button key={p} size="sm" variant={period === p ? "default" : "outline"} onClick={() => { setPeriod(p); notify(`${p} 기간 적용`, "info"); }}>{p}</Button>)}</div>
              <Button size="sm" variant="outline" onClick={() => notify("엑셀 내보내기 mock", "info")}>엑셀</Button>
            </div>
            {tab === "내역" ? (
              <div className="overflow-auto rounded-xl border">
                <Table>
                  <TableHeader><TableRow>{screen.tableColumns.map((c) => <TableHead key={c} className="whitespace-nowrap">{c}</TableHead>)}</TableRow></TableHeader>
                  <TableBody>{screen.rows.map((row) => <TableRow key={row.No} className="cursor-pointer" onClick={() => openDialog("DLG-S006")}>
                    {screen.tableColumns.map((c) => <TableCell key={c} className={cn("whitespace-nowrap text-xs", c === "환불금액" && "font-bold text-rose-600", c === "상태" && "font-medium")}>{c === "상태" ? <Badge variant={row[c] === "완료" ? "success" : row[c] === "승인대기" ? "warning" : "destructive"}>{row[c]}</Badge> : row[c]}</TableCell>)}
                  </TableRow>)}</TableBody>
                </Table>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border">
                <Table>
                  <TableHeader><TableRow>{["원판매 담당자", "환불 건수", "환불 금액", "위약금 합계", "원매출 대비 환불률"].map((c) => <TableHead key={c}>{c}</TableHead>)}</TableRow></TableHeader>
                  <TableBody>
                    <TableRow><TableCell className="font-semibold">이FC</TableCell><TableCell>6</TableCell><TableCell className="font-bold text-rose-600">240,000원</TableCell><TableCell>40,000원</TableCell><TableCell><Badge variant="warning">3.2%</Badge></TableCell></TableRow>
                    <TableRow><TableCell className="font-semibold">박트레이너</TableCell><TableCell>3</TableCell><TableCell className="font-bold text-rose-600">90,000원</TableCell><TableCell>15,000원</TableCell><TableCell><Badge variant="info">1.4%</Badge></TableCell></TableRow>
                    <TableRow><TableCell className="font-semibold">최매니저</TableCell><TableCell>9</TableCell><TableCell className="font-bold text-rose-600">290,000원</TableCell><TableCell>27,000원</TableCell><TableCell><Badge variant="destructive">5.8%</Badge></TableCell></TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none border-amber-200 bg-amber-50/40"><CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="size-4" /> 정책 확인 필요</CardTitle></CardHeader><CardContent className="space-y-2 text-xs text-amber-900"><div>환불 자동 계산 산식 미확정 (정책 수기 100%)</div><div>환불 승인 권한: Owner = 완료 처리, Manager/FC = 승인 요청만</div><div>위약금 면제 토글은 Owner만</div><div>지점 환불률 5% 초과 시 본사 알림</div></CardContent></Card>
          <Card className="shadow-none"><CardHeader><CardTitle>액션</CardTitle></CardHeader><CardContent className="space-y-2"><Button data-dialog-id="DLG-S015" className="w-full" onClick={() => openDialog("DLG-S015")}>환불 요청</Button><Button data-dialog-id="DLG-S013" variant="outline" className="w-full" onClick={() => openDialog("DLG-S013")}>환불 처리 (정책)</Button><Button data-dialog-id="DLG-S006" variant="outline" className="w-full" onClick={() => openDialog("DLG-S006")}>환불 상세</Button></CardContent></Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function ReceivablesScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const [tab, setTab] = useState<"전체" | "미결제" | "일부결제" | "연체" | "완료">("전체");
  const [query, setQuery] = useState("");
  const filtered = screen.rows.filter((r) => tab === "전체" || r.상태 === tab).filter((r) => !query || r.회원명.includes(query));
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="미수금 추적 (V2: 결제링크 제외)" />
      <div className="grid grid-cols-4 gap-3">
        {screen.metrics.map((m, i) => <Card key={m.label} className={cn("shadow-none", i === 2 && "border-amber-300 bg-amber-50/40")}><CardHeader><CardDescription>{m.label}</CardDescription><CardTitle className="text-xl">{m.value}</CardTitle></CardHeader><CardContent><p className="text-xs text-content-tertiary">{m.hint}</p></CardContent></Card>)}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>미수금 목록 (11컬럼)</CardTitle>
            <CardDescription>발생 유형 3종: 계약금 잔액 / 수기 분할 / 정기 할부 미납. 결제링크 발송만 된 건은 본 화면 제외.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {(["전체", "미결제", "일부결제", "연체", "완료"] as const).map((t) => <Button key={t} size="sm" variant={tab === t ? "default" : "outline"} onClick={() => setTab(t)}>{t}<Badge variant="secondary">{t === "전체" ? screen.rows.length : screen.rows.filter((r) => r.상태 === t).length}</Badge></Button>)}
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="회원명 검색" className="ml-auto max-w-xs" />
              <Button size="sm" variant="outline" onClick={() => notify("엑셀 내보내기 mock", "info")}>엑셀</Button>
            </div>
            <div className="overflow-auto rounded-xl border">
              <Table>
                <TableHeader><TableRow>{screen.tableColumns.map((c) => <TableHead key={c} className="whitespace-nowrap">{c}</TableHead>)}</TableRow></TableHeader>
                <TableBody>{filtered.map((row) => <TableRow key={row.No}>
                  {screen.tableColumns.map((c) => <TableCell key={c} className={cn("whitespace-nowrap text-xs", c === "미수금액" && "font-bold text-rose-600", c === "결제 기한" && row.상태 === "연체" && "font-bold text-rose-600")}>
                    {c === "상태" ? <Badge variant={row[c] === "완료" ? "success" : row[c] === "연체" ? "destructive" : row[c] === "일부결제" ? "warning" : "outline"}>{row[c]}</Badge>
                      : c === "액션" ? <div className="flex gap-1"><Button size="sm" data-dialog-id="DLG-S008" onClick={() => openDialog("DLG-S008")}>납입</Button><Button size="sm" variant="outline" data-dialog-id="DLG-S005" onClick={() => openDialog("DLG-S005")}>메모</Button></div>
                      : row[c]}
                  </TableCell>)}
                </TableRow>)}</TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none"><CardHeader><CardTitle>상태 전환 규칙</CardTitle></CardHeader><CardContent className="space-y-1 text-xs text-content-secondary"><div>미결제 → 일부결제 / 완료</div><div>일부결제 → 완료</div><div>연체 → 일부결제 / 완료</div><div className="text-rose-600">완료 → 변경 불가</div></CardContent></Card>
          <Card className="shadow-none"><CardHeader><CardTitle>액션</CardTitle></CardHeader><CardContent className="space-y-2"><Button data-dialog-id="DLG-S008" className="w-full" onClick={() => openDialog("DLG-S008")}>납입 처리</Button><Button data-dialog-id="DLG-S005" variant="outline" className="w-full" onClick={() => openDialog("DLG-S005")}>메모 편집</Button></CardContent></Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function InstallmentsScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const [tab, setTab] = useState<"전체" | "진행중" | "완납" | "미납">("전체");
  const [origin, setOrigin] = useState<"전체" | "현장 결제 연계" | "미수금 전환" | "직접 등록">("전체");
  const onOriginChange = (o: typeof origin) => { setOrigin(o); notify(`계약 출처 필터: ${o}`, "info"); };
  const filtered = screen.rows.filter((r) => tab === "전체" || r.상태 === tab).filter((r) => origin === "전체" || r["계약 출처"] === origin);
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="정기 분납 계약 + 회차별 추적" />
      <div className="grid grid-cols-4 gap-3">
        {screen.metrics.map((m, i) => <Card key={m.label} className={cn("shadow-none", i === 3 && "border-rose-200 bg-rose-50/30")}><CardHeader><CardDescription>{m.label}</CardDescription><CardTitle className={cn("text-xl", i === 3 && "text-rose-700")}>{m.value}</CardTitle></CardHeader><CardContent><p className="text-xs text-content-tertiary">{m.hint}</p></CardContent></Card>)}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>할부 계약 목록 (11컬럼)</CardTitle>
            <CardDescription>계약 출처 3종: 현장 결제 연계 / 미수금 전환 / 직접 등록. 정기 분납 계획 전용 (계약금 잔액은 SCR-S008 우선).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {(["전체", "진행중", "완납", "미납"] as const).map((t) => <Button key={t} size="sm" variant={tab === t ? "default" : "outline"} onClick={() => setTab(t)}>{t}<Badge variant="secondary">{t === "전체" ? screen.rows.length : screen.rows.filter((r) => r.상태 === t).length}</Badge></Button>)}
              <div className="ml-auto flex flex-wrap gap-1">{(["전체", "현장 결제 연계", "미수금 전환", "직접 등록"] as const).map((o) => <Button key={o} size="sm" variant={origin === o ? "secondary" : "ghost"} onClick={() => onOriginChange(o)}>{o}</Button>)}</div>
            </div>
            <div className="overflow-auto rounded-xl border">
              <Table>
                <TableHeader><TableRow>{screen.tableColumns.map((c) => <TableHead key={c} className="whitespace-nowrap">{c}</TableHead>)}</TableRow></TableHeader>
                <TableBody>{filtered.map((row, idx) => <TableRow key={`${row.회원명}-${idx}`} className="cursor-pointer" onClick={() => openDialog("DLG-S007")}>
                  {screen.tableColumns.map((c) => <TableCell key={c} className={cn("whitespace-nowrap text-xs", c === "잔여 금액" && row.상태 !== "완납" && "font-bold text-rose-600", c === "다음 납입일" && row.상태 === "미납" && "font-bold text-rose-600")}>
                    {c === "상태" ? <Badge variant={row[c] === "완납" ? "success" : row[c] === "미납" ? "destructive" : "info"}>{row[c]}</Badge> : row[c]}
                  </TableCell>)}
                </TableRow>)}</TableBody>
              </Table>
            </div>
            <div className="rounded-lg border bg-surface-secondary p-3 text-xs text-content-secondary">
              <b>회차별 펼침 (mock)</b>: 계약 행 클릭 시 1회·2회·3회 등 회차별 예정일·납입 완료일·금액·상태 상세 확인. 미납 회차에 경고 색상/아이콘 표시.
            </div>
          </CardContent>
        </Card>
        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none"><CardHeader><CardTitle>액션</CardTitle></CardHeader><CardContent className="space-y-2"><Button data-dialog-id="DLG-S007" className="w-full" onClick={() => openDialog("DLG-S007")}>할부 상세</Button><Button data-dialog-id="DLG-S008" variant="outline" className="w-full" onClick={() => openDialog("DLG-S008")}>납입 처리</Button><Button data-dialog-id="DLG-S009" variant="outline" className="w-full" onClick={() => openDialog("DLG-S009")}>+ 할부 등록</Button></CardContent></Card>
          <Card className="shadow-none"><CardHeader><CardTitle>예외 / 한도</CardTitle></CardHeader><CardContent className="space-y-1 text-xs text-content-secondary"><div>최대 24회 한도</div><div>회차당 최소 10,000원</div><div>시작일은 오늘 이후만</div><div>환불 진행 중 납입처리 차단</div><div>말일 자동 보정 (1/31 → 2/28)</div></CardContent></Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function TaxInvoiceScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const [tab, setTab] = useState<"발행" | "이력">("이력");
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="법인 세금계산서 (외부 연동 확인 필요)" />
      <div className="grid grid-cols-4 gap-3">
        {screen.metrics.map((m, i) => <Card key={m.label} className={cn("shadow-none", i === 3 && "border-rose-300 bg-rose-50/40")}><CardHeader><CardDescription>{m.label}</CardDescription><CardTitle className={cn("text-xl", i === 3 && "text-rose-700")}>{m.value}</CardTitle></CardHeader><CardContent><p className="text-xs text-content-tertiary">{m.hint}</p></CardContent></Card>)}
      </div>
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
        <div className="flex items-center gap-2 font-bold"><AlertTriangle className="size-4" /> 외부 연동 확인 필요 (external-pending)</div>
        <p className="mt-1 text-xs text-rose-800">공급 품목 자동 채움 + PDF 자동 생성 + 이메일 전송 + 홈택스 발행 연동은 정책 확정 전 mock 상태. CFO 월별 보고서·발행 한도(일별 1,000건)·사업자 위/휴/폐업 검증은 외부 연동 완료 후 활성화.</p>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>{tab === "이력" ? "발행 이력 (7컬럼)" : "발행 폼"}</CardTitle>
            <CardDescription>{tab === "이력" ? "상태 배지: 발행 완료 / 전송 완료 / 오류 / 취소 발행. 사업자번호 마스킹." : "공급 품목 자동 채움 5행 (상품명·수량·VAT 제외 단가·금액·과세 구분)"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              {(["발행", "이력"] as const).map((t) => <Button key={t} size="sm" variant={tab === t ? "default" : "outline"} onClick={() => setTab(t)}>{t === "발행" ? "발행 (대상 + 폼)" : "발행 이력"}</Button>)}
            </div>
            {tab === "이력" ? (
              <div className="overflow-hidden rounded-xl border">
                <Table>
                  <TableHeader><TableRow>{screen.tableColumns.map((c) => <TableHead key={c}>{c}</TableHead>)}</TableRow></TableHeader>
                  <TableBody>{screen.rows.map((row, idx) => <TableRow key={`${row.발행일}-${idx}`} className="cursor-pointer" onClick={() => openDialog("DLG-S010")}>
                    {screen.tableColumns.map((c) => <TableCell key={c} className="text-xs">{c === "상태" ? <Badge variant={row[c] === "발행 완료" || row[c] === "전송 완료" ? "success" : row[c] === "오류" ? "destructive" : "warning"}>{row[c]}</Badge> : row[c]}</TableCell>)}
                  </TableRow>)}</TableBody>
                </Table>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><Label>사업자번호 *</Label><Input placeholder="123-45-67890" /></div>
                  <div className="space-y-1"><Label>상호 *</Label><Input placeholder="판도헬스 법인" /></div>
                  <div className="space-y-1"><Label>대표자</Label><Input /></div>
                  <div className="space-y-1"><Label>이메일 *</Label><Input type="email" /></div>
                  <div className="space-y-1"><Label>업태</Label><Input /></div>
                  <div className="space-y-1"><Label>종목</Label><Input /></div>
                </div>
                <div className="rounded-lg border bg-surface-secondary p-3 text-xs">
                  <b className="text-content-secondary">공급 품목 자동 채움 (V1 docs4 명시)</b>
                  <ul className="mt-1 space-y-0.5 text-content-secondary"><li>• 상품명: 발행 대상 결제 건의 상품명</li><li>• 수량: 결제 상품 수량 (회원권·수강권·락커는 1)</li><li>• 단가: 품목별 최종 판매금액 ÷ 수량 (VAT 제외)</li><li>• 금액: 단가 × 수량 (품목별 공급가액)</li><li>• 과세 구분: 상품 과세/면세 설정 또는 원결제 세액 기준</li></ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none"><CardHeader><CardTitle>액션</CardTitle></CardHeader><CardContent className="space-y-2"><Button data-dialog-id="DLG-S010" className="w-full" onClick={() => openDialog("DLG-S010")}>세금계산서 상세</Button><Button data-dialog-id="DLG-S011" variant="outline" className="w-full" onClick={() => openDialog("DLG-S011")}>세금계산서 발행 (정책)</Button><Button variant="outline" className="w-full" onClick={() => notify("이메일 재전송 mock", "info")}>이메일 전송</Button><Button variant="outline" className="w-full" onClick={() => notify("엑셀 내보내기 mock (30,000건+ 백그라운드)", "info")}>엑셀 내보내기</Button></CardContent></Card>
          <Card className="shadow-none"><CardHeader><CardTitle>발행 후 처리</CardTitle></CardHeader><CardContent className="space-y-1 text-xs text-content-secondary"><div>발행 후 수정 불가 → 마이너스 발행으로</div><div>5년 경과 데이터 익명화 (사업자 정보는 보존)</div><div>PDF 자동 생성 + 이메일 첨부</div><div>일별 1,000건 발행 한도 검증</div></CardContent></Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function CancelRefundScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [type, setType] = useState<"전체 취소" | "부분 환불">("부분 환불");
  const [refundAmount, setRefundAmount] = useState("800,000");
  const onTypeChange = (t: typeof type) => { setType(t); notify(`처리 유형: ${t}`, "info"); };
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="환불 수기 입력 + 승인 분기" />
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <div className="flex items-center gap-2 font-bold"><AlertTriangle className="size-4" /> 정책 확인 필요 (policy-pending)</div>
        <p className="mt-1 text-xs text-amber-800">환불 자동 계산 산식 미확정. 모든 차감/위약금/최종 환불액은 운영자 수기 입력. manager/fc는 승인 요청만 가능, Owner만 완료 처리.</p>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {screen.metrics.map((m) => <Card key={m.label} className="shadow-none"><CardHeader><CardDescription>{m.label}</CardDescription><CardTitle className="text-xl">{m.value}</CardTitle></CardHeader><CardContent><p className="text-xs text-content-tertiary">{m.hint}</p></CardContent></Card>)}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Step {step} / 5 · {step === 1 ? "결제 건 검색" : step === 2 ? "환불 수기 입력" : "귀속 영향 + 승인"}</CardTitle>
            <CardDescription>결제 검색 → 결제 내역 확인 → 환불 수기 입력 → 귀속 영향 요약 → 승인 상태 + 처리 이력</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-1">{([1, 2, 3] as const).map((s) => <Button key={s} size="sm" variant={step === s ? "default" : "outline"} onClick={() => setStep(s)}>Step {s}</Button>)}</div>
            {step === 1 && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2"><Input placeholder="회원명 검색" defaultValue="김민준" /><Input placeholder="상품명" /><Input placeholder="결제일" /></div>
                <div className="overflow-hidden rounded-xl border">
                  <Table>
                    <TableHeader><TableRow>{["선택", "결제 ID", "회원", "상품", "결제금액", "결제수단", "결제일"].map((c) => <TableHead key={c}>{c}</TableHead>)}</TableRow></TableHeader>
                    <TableBody><TableRow className="bg-blue-50"><TableCell><Badge variant="info">선택됨</Badge></TableCell><TableCell>S-260428-009</TableCell><TableCell>김민준</TableCell><TableCell>PT 20회권</TableCell><TableCell>1,200,000원</TableCell><TableCell>카드</TableCell><TableCell>2026-04-28</TableCell></TableRow></TableBody>
                  </Table>
                </div>
                <div className="flex justify-end"><Button onClick={() => setStep(2)}>다음 (수기 입력으로)</Button></div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-3">
                <div className="flex gap-2">{(["전체 취소", "부분 환불"] as const).map((t) => <Button key={t} variant={type === t ? "default" : "outline"} onClick={() => onTypeChange(t)}>{t}</Button>)}</div>
                <div className="overflow-hidden rounded-xl border">
                  <Table>
                    <TableHeader><TableRow>{screen.tableColumns.map((c) => <TableHead key={c}>{c}</TableHead>)}</TableRow></TableHeader>
                    <TableBody>{screen.rows.map((row, idx) => <TableRow key={`${row.항목}-${idx}`}>
                      <TableCell className="font-semibold">{row.항목}</TableCell>
                      <TableCell>{row.항목 === "최종 환불액" ? <Input value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} className="max-w-[140px]" /> : row.금액}</TableCell>
                      <TableCell className="text-xs">{row.입력자}</TableCell>
                      <TableCell><Badge variant={row.정책 === "읽기 전용" ? "outline" : row.정책 === "운영 판단" ? "warning" : "secondary"}>{row.정책}</Badge></TableCell>
                      <TableCell><Badge variant={row.상태 === "승인대기" ? "warning" : "outline"}>{row.상태}</Badge></TableCell>
                    </TableRow>)}</TableBody>
                  </Table>
                </div>
                <Textarea placeholder="조정 사유 / 환불 사유 (단순 변심 / 결제 오류 / 회원 요청 / 중복 결제 / 서비스 불만)" />
                <div className="flex justify-between"><Button variant="outline" onClick={() => setStep(1)}>이전</Button><Button onClick={() => setStep(3)}>다음 (귀속 영향)</Button></div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <InfoCell label="결제지점" value="강남점" />
                  <InfoCell label="이용지점" value="강남점" />
                  <InfoCell label="매출 귀속 지점" value="강남점 (수기)" />
                  <InfoCell label="정산 지점" value="강남점 (수기)" />
                  <InfoCell label="인센티브 귀속자" value="이FC (수기)" />
                  <InfoCell label="매출 차감액" value={`${refundAmount}원`} />
                </div>
                <div className="rounded-lg border bg-amber-50 p-3 text-xs text-amber-900"><b>승인 상태 입력</b>: manager/fc → 승인대기 / Owner → 처리 완료</div>
                <div className="flex justify-between"><Button variant="outline" onClick={() => setStep(2)}>이전</Button><div className="flex gap-2">
                  <Button data-dialog-id="DLG-S015" variant="secondary" onClick={() => openDialog("DLG-S015")}>승인 요청 (manager/fc)</Button>
                  <Button data-dialog-id="DLG-S013" variant="destructive" onClick={() => openDialog("DLG-S013")}>처리 완료 (Owner)</Button>
                </div></div>
              </div>
            )}
          </CardContent>
        </Card>
        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none"><CardHeader><CardTitle>액션</CardTitle></CardHeader><CardContent className="space-y-2"><Button data-dialog-id="DLG-S015" className="w-full" onClick={() => openDialog("DLG-S015")}>환불 요청</Button><Button data-dialog-id="DLG-S013" variant="outline" className="w-full" onClick={() => openDialog("DLG-S013")}>환불 처리 (정책)</Button><Button data-dialog-id="DLG-S014" variant="outline" className="w-full" onClick={() => openDialog("DLG-S014")}>처리 결과 보기</Button></CardContent></Card>
          <Card className="shadow-none"><CardHeader><CardTitle>처리 이력 (mock)</CardTitle></CardHeader><CardContent className="space-y-2 text-xs text-content-secondary"><div className="rounded-lg border p-2"><b>2026-05-15</b> · 김민준 부분 환불 600,000원 · 처리자 이FC · 완료</div><div className="rounded-lg border p-2"><b>2026-04-22</b> · 박서연 전체 취소 250,000원 · 처리자 최매니저 · 승인대기</div></CardContent></Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

type DomainPublishingConfig = {
  eyebrow: string;
  title: string;
  hero: string;
  lanes: string[];
  boardTitle: string;
  boardColumns: string[];
  queueTitle: string;
  primaryCta: string;
  secondaryCta: string;
  accent: string;
};

const domainPublishing: Record<string, DomainPublishingConfig> = {
  D04: { eyebrow: "수업 운영", title: "캘린더·예약·출석 운영 보드", hero: "강사·회원·룸 리소스를 시간축으로 겹쳐 보고 예약 요청과 노쇼/페널티까지 한 번에 처리합니다.", lanes: ["오전 PT", "GX/그룹", "골프", "대기/변경 요청"], boardTitle: "오늘 수업 타임라인", boardColumns: ["시간", "수업/강사", "예약", "상태", "운영 액션"], queueTitle: "예약·변경 요청 큐", primaryCta: "수업 등록", secondaryCta: "일괄 변경", accent: "blue" },
  D05: { eyebrow: "상품 운영", title: "상품·가격·할인 정책 콘솔", hero: "상품 마스터와 지점 배포, 가격 이력, 복합 할인 정책을 분리해 운영 실수와 정책 누락을 줄입니다.", lanes: ["판매중", "배포 대기", "가격 변경", "할인 정책"], boardTitle: "상품 마스터", boardColumns: ["상품", "유형", "가격", "배포", "상태"], queueTitle: "정책 검토 큐", primaryCta: "상품 등록", secondaryCta: "전 지점 배포", accent: "emerald" },
  D06: { eyebrow: "시설 운영", title: "락커·고장·배정 현황 맵", hero: "개별/일괄 배정, 회수, 고장 토글을 현장 직원이 바로 처리할 수 있게 시설 상태를 격자로 보여줍니다.", lanes: ["사용중", "빈 락커", "만료 임박", "고장"], boardTitle: "락커 맵", boardColumns: ["구역", "락커", "배정 회원", "만료", "상태"], queueTitle: "시설 처리 큐", primaryCta: "개별 배정", secondaryCta: "일괄 배정", accent: "amber" },
  D07: { eyebrow: "직원 운영", title: "직원·근태·급여 운영 워크스페이스", hero: "직원 계정, 권한, 근태, 급여를 한 화면에서 연결해 퇴사/잠금/급여 예외를 추적합니다.", lanes: ["재직", "근태 예외", "급여 검토", "퇴사 처리"], boardTitle: "직원 운영 테이블", boardColumns: ["직원", "역할", "근태", "계정", "처리"], queueTitle: "인사 예외 큐", primaryCta: "직원 등록", secondaryCta: "급여 명세", accent: "violet" },
  D08: { eyebrow: "마케팅", title: "리드·메시지·쿠폰·캠페인 센터", hero: "리드 상태, 메시지 발송, 자동 알림, 쿠폰/마일리지, 캠페인을 타겟 세그먼트 중심으로 운영합니다.", lanes: ["신규 리드", "발송 대기", "자동 알림", "캠페인 성과"], boardTitle: "타겟/캠페인 목록", boardColumns: ["대상", "채널", "세그먼트", "예약", "성과"], queueTitle: "발송/승인 큐", primaryCta: "메시지 작성", secondaryCta: "쿠폰 발급", accent: "pink" },
  D09: { eyebrow: "설정", title: "센터 정책·권한·자동화 설정", hero: "본사 정책과 지점 적용 범위를 분리하고 권한/키오스크/IoT/백업 같은 위험 설정을 감사 가능하게 관리합니다.", lanes: ["센터 기본", "권한", "키오스크/IoT", "백업"], boardTitle: "설정 항목", boardColumns: ["설정", "적용 범위", "최근 변경", "위험도", "상태"], queueTitle: "정책 변경 큐", primaryCta: "설정 저장", secondaryCta: "변경 로그", accent: "slate" },
  D10: { eyebrow: "본사 운영", title: "지점 성과·KPI·감사 로그 대시보드", hero: "전 지점 성과, KPI, 자동화 정책, 오늘의 할 일, 리포트 생성을 본사 관점에서 검토합니다.", lanes: ["KPI", "지점 성과", "감사 로그", "리포트"], boardTitle: "본사 운영 지표", boardColumns: ["지점/지표", "실적", "전월 대비", "리스크", "액션"], queueTitle: "본사 검토 큐", primaryCta: "리포트 생성", secondaryCta: "정책 배포", accent: "indigo" },
  D11: { eyebrow: "통합 운영", title: "출석·락커·건강 연동 통합 관제", hero: "지점별 출석, 락커, 체성분, 건강 연동 요약을 한 화면에서 관제하고 예외를 빠르게 처리합니다.", lanes: ["출석", "옷 락커", "고정 락커", "건강 연동"], boardTitle: "통합 운영 현황", boardColumns: ["영역", "대상", "상태", "마지막 동기화", "처리"], queueTitle: "통합 예외 큐", primaryCta: "예외 처리", secondaryCta: "동기화", accent: "cyan" }
};

const accentClasses: Record<string, { panel: string; chip: string; ring: string }> = {
  blue: { panel: "from-blue-600 to-slate-900", chip: "bg-blue-50 text-blue-700 border-blue-200", ring: "border-blue-300 bg-blue-50" },
  emerald: { panel: "from-emerald-600 to-slate-900", chip: "bg-emerald-50 text-emerald-700 border-emerald-200", ring: "border-emerald-300 bg-emerald-50" },
  amber: { panel: "from-amber-500 to-slate-900", chip: "bg-amber-50 text-amber-700 border-amber-200", ring: "border-amber-300 bg-amber-50" },
  violet: { panel: "from-violet-600 to-slate-900", chip: "bg-violet-50 text-violet-700 border-violet-200", ring: "border-violet-300 bg-violet-50" },
  pink: { panel: "from-pink-600 to-slate-900", chip: "bg-pink-50 text-pink-700 border-pink-200", ring: "border-pink-300 bg-pink-50" },
  slate: { panel: "from-slate-700 to-slate-950", chip: "bg-surface-secondary text-content-secondary border-slate-200", ring: "border-slate-300 bg-surface-secondary" },
  indigo: { panel: "from-indigo-600 to-slate-900", chip: "bg-indigo-50 text-indigo-700 border-indigo-200", ring: "border-indigo-300 bg-indigo-50" },
  cyan: { panel: "from-cyan-600 to-slate-900", chip: "bg-cyan-50 text-cyan-700 border-cyan-200", ring: "border-cyan-300 bg-cyan-50" }
};

function DomainOperationsScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const config = domainPublishing[screen.domain] ?? domainPublishing.D09;
  const accent = accentClasses[config.accent] ?? accentClasses.slate;
  const [activeLane, setActiveLane] = useState(config.lanes[0]);
  const [query, setQuery] = useState("");
  const rows = screen.rows.length ? screen.rows : [{ 항목: screen.title, 상태: screen.policyPending ? "확인 필요" : "정상", 담당: roleById.get(role)?.label ?? "운영자", 일정: "오늘" }];
  const filteredRows = rows.filter((row) => Object.values(row).join(" ").includes(query));
  const columns = screen.tableColumns.length ? screen.tableColumns : Object.keys(rows[0] ?? {}).slice(0, 5);
  const visibleColumns = columns.slice(0, Math.max(4, Math.min(columns.length, 6)));
  const primaryDialog = screen.dialogs[0];
  const secondaryDialog = screen.dialogs[1] ?? primaryDialog;
  return (
    <div className="space-y-5">
      <section className={cn("overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white shadow-sm", accent.panel)}>
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2"><Badge className="border-white/20 bg-white/10 text-white">{screen.id}</Badge><Badge className="border-white/20 bg-white/10 text-white">{config.eyebrow}</Badge><Badge className="border-white/20 bg-white/10 text-white">{screen.feature}</Badge></div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight">{screen.title}</h1>
            <p className="mt-3 text-sm leading-6 text-white/80">{config.hero}</p>
            <p className="mt-2 text-xs leading-5 text-white/65">문서 목적: {screen.purpose}</p>
          </div>
          <div className="min-w-72 rounded-xl border border-white/15 bg-white/10 p-3 text-sm backdrop-blur">
            <div className="font-semibold">{roleById.get(role)?.label} · {branch}</div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-white/75"><span>Mock state</span><span>API excluded</span><span>권한 표시</span><span>DLG 연결</span></div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-4 gap-3">
        {screen.metrics.slice(0, 4).map((metric) => <button key={metric.label} type="button" className="text-left" onClick={() => { setActiveLane(metric.label); notify(`${metric.label} 지표 기준으로 보드 필터 적용`, "info"); }}><Card className={cn("h-full shadow-none", activeLane === metric.label && accent.ring)}><CardHeader><CardDescription>{metric.label}</CardDescription><CardTitle className="text-xl">{metric.value}</CardTitle></CardHeader><CardContent><p className="text-xs text-content-tertiary">{metric.hint}</p></CardContent></Card></button>)}
        {!screen.metrics.length && config.lanes.map((lane, index) => <Card key={lane} className="shadow-none"><CardHeader><CardDescription>{lane}</CardDescription><CardTitle className="text-xl">{index + 3}</CardTitle></CardHeader></Card>)}
      </section>

      <section className="grid grid-cols-[minmax(0,1fr)_340px] gap-5">
        <div className="space-y-5">
          <Card className="shadow-none">
            <CardHeader><CardTitle>{config.title}</CardTitle><CardDescription>도메인 문서의 실제 운영 동선을 반영한 전용 퍼블리싱 섹션입니다.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                {config.lanes.map((lane) => <button key={lane} type="button" className={cn("rounded-xl border p-4 text-left transition hover:-translate-y-0.5 hover:bg-surface-secondary", activeLane === lane && accent.ring)} onClick={() => { setActiveLane(lane); notify(`${lane} 운영 lane 선택`, "info"); }}><div className="font-semibold">{lane}</div><div className="mt-1 text-xs text-content-tertiary">{screen.title} 문맥 필터</div></button>)}
              </div>
              <div className="flex flex-wrap gap-2">
                {screen.filters.slice(0, 7).map((filter) => <Button key={filter} variant="outline" size="sm" onClick={() => notify(`${filter} 필터 적용`, "info")}>{filter}</Button>)}
                {role === "HQ_ADMIN" && <Badge className={accent.chip}>전 지점 통합</Badge>}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader><CardTitle>{config.boardTitle}</CardTitle><CardDescription>검색·탭·상태 배지·행 액션이 모두 mock feedback을 제공합니다.</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap items-center gap-2"><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`${screen.title} 통합 검색`} className="max-w-sm" /><Button variant="outline" onClick={() => { setQuery(""); notify("검색/필터 초기화", "info"); }}>전체 해제</Button><Button data-dialog-id={primaryDialog} onClick={() => primaryDialog ? openDialog(primaryDialog) : notify(`${config.primaryCta} mock 실행`)}>{config.primaryCta}</Button><Button data-dialog-id={secondaryDialog} variant="outline" onClick={() => secondaryDialog ? openDialog(secondaryDialog) : notify(`${config.secondaryCta} mock 실행`, "info")}>{config.secondaryCta}</Button></div>
              <div className="overflow-hidden rounded-xl border"><Table><TableHeader><TableRow>{visibleColumns.map((column) => <TableHead key={column}>{column}</TableHead>)}<TableHead>운영 상태</TableHead><TableHead>행 액션</TableHead></TableRow></TableHeader><TableBody>{filteredRows.slice(0, 8).map((row, index) => <TableRow key={index}>{visibleColumns.map((column) => <TableCell key={column}>{statusAwareValue(String(row[column] ?? row[Object.keys(row)[0]] ?? "-"))}</TableCell>)}<TableCell>{statusAwareValue(String(row.상태 ?? row.status ?? (screen.policyPending ? "확인 필요" : "정상")))}</TableCell><TableCell><Button size="sm" variant="ghost" onClick={() => notify(`${screen.id} ${index + 1}번 행 상세 패널 mock`, "info")}>상세</Button></TableCell></TableRow>)}</TableBody></Table></div>
              <div className="flex items-center justify-between rounded-xl border bg-surface-secondary px-4 py-3 text-xs text-content-tertiary"><span>{filteredRows.length ? `1-${Math.min(8, filteredRows.length)} of ${filteredRows.length}` : "검색 결과 없음"} · active lane {activeLane}</span><span>페이지네이션 · 스켈레톤 · empty/error 상태 연결 대상</span></div>
            </CardContent>
          </Card>
        </div>

        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none"><CardHeader><CardTitle>{config.queueTitle}</CardTitle><CardDescription>운영자가 지금 처리해야 할 항목</CardDescription></CardHeader><CardContent className="space-y-2">{config.lanes.map((lane, index) => <div key={lane} className="rounded-lg border p-3 text-sm"><div className="flex items-center justify-between"><b>{lane}</b><Badge variant={index === 0 ? "warning" : "secondary"}>{index + 1}건</Badge></div><p className="mt-1 text-xs text-content-tertiary">{screen.title} · {lane} 예외/처리 대상</p><div className="mt-2 flex gap-2"><Button size="sm" onClick={() => notify(`${lane} 처리 시작`, "info")}>처리</Button><Button size="sm" variant="outline" onClick={() => notify(`${lane} 담당자 배정 mock`, "info")}>배정</Button></div></div>)}</CardContent></Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
          <Card className="shadow-none"><CardHeader><CardTitle>프론트 상태 명세</CardTitle></CardHeader><CardContent className="space-y-2 text-sm text-content-secondary"><CheckLine label="loading skeleton 영역 확보" /><CheckLine label="empty/search none 메시지" /><CheckLine label="permission/policy badge" /><CheckLine label="row action + modal 연결" />{screen.policyPending && <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800"><AlertTriangle className="mr-2 inline size-4" />정책 확인 필요 항목은 실제 계산/연동 없이 UI 상태만 표시합니다.</div>}</CardContent></Card>
        </aside>
      </section>
    </div>
  );
}

function DataPanel({ screen, notify }: { screen: ScreenDefinition; notify: (message: string, tone?: "success" | "warning" | "info") => void }) {
  const [query, setQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const filteredRows = screen.rows.filter((row) => Object.values(row).join(" ").toLowerCase().includes(query.toLowerCase()));
  const visibleRows = filteredRows.slice((page - 1) * 5, page * 5);

  if (!screen.tableColumns.length) return <div className="rounded-lg border bg-surface-secondary p-5 text-sm text-content-secondary">테이블 없는 화면입니다. 이 화면의 주요 액션은 우측 DLG 또는 상단 액션 큐에서 mock 동작합니다.</div>;
  return (
    <div className="rounded-lg border">
      <div className="flex flex-wrap items-center gap-2 border-b bg-surface-secondary p-3">
        <Search className="size-4 text-content-tertiary" />
        <Input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="이름·연락처·상품명 통합 검색" className="max-w-sm bg-white" />
        <Button variant="outline" size="sm" onClick={() => { setQuery(""); setSelectedRows([]); setPage(1); notify("필터와 선택 행을 초기화했습니다.", "info"); }}>전체 해제</Button>
        <Button variant="outline" size="sm" onClick={() => notify(`${selectedRows.length}개 행으로 일괄 작업 bar mock 표시`, "info")}>선택 작업</Button>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>선택</TableHead>{screen.tableColumns.map((column) => <TableHead key={column}>{column}</TableHead>)}<TableHead>행 액션</TableHead></TableRow></TableHeader>
        <TableBody>{visibleRows.map((row, index) => {
          const absoluteIndex = (page - 1) * 5 + index;
          const selected = selectedRows.includes(absoluteIndex);
          return <TableRow key={absoluteIndex} data-state={selected ? "selected" : undefined}><TableCell><Button type="button" variant={selected ? "default" : "outline"} size="sm" onClick={() => setSelectedRows((current) => current.includes(absoluteIndex) ? current.filter((item) => item !== absoluteIndex) : [...current, absoluteIndex])}>{selected ? "선택됨" : "선택"}</Button></TableCell>{screen.tableColumns.map((column) => <TableCell key={column}>{statusAwareValue(row[column] ?? "-")}</TableCell>)}<TableCell><Button type="button" variant="ghost" size="sm" onClick={() => notify(`${screen.id} ${absoluteIndex + 1}번 행 상세 mock`, "info")}>상세</Button></TableCell></TableRow>;
        })}</TableBody>
      </Table>
      <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-content-tertiary">
        <span>{filteredRows.length ? `${(page - 1) * 5 + 1}-${Math.min(page * 5, filteredRows.length)} of ${filteredRows.length}` : "검색 결과 없음"} · 선택 {selectedRows.length}</span>
        <div className="flex items-center gap-2"><Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>이전</Button><span>{page}</span><Button variant="outline" size="sm" disabled={page * 5 >= filteredRows.length} onClick={() => setPage((value) => value + 1)}>다음</Button></div>
      </div>
    </div>
  );
}

function statusAwareValue(value: string) {
  if (["활성", "결제완료", "사용", "정상", "완료", "발행 완료", "인식중"].includes(value)) return <Badge variant="success">{value}</Badge>;
  if (["임박", "미수", "환불요청", "승인대기", "보류", "확인 필요", "부분납", "정책"].includes(value)) return <Badge variant="warning">{value}</Badge>;
  if (["홀딩", "할부"].includes(value)) return <Badge variant="info">{value}</Badge>;
  if (["만료", "탈퇴", "오류"].includes(value)) return <Badge variant="destructive">{value}</Badge>;
  return value;
}

type DialogKind = "session" | "destructive" | "payment" | "search" | "bulk" | "status" | "form";

type RuntimeDialogProps = { dialogId: string | null; role: RoleId; onClose: () => void; notify: Notify };

type DialogBodyProps = {
  dialog: DialogDefinition;
  kind: DialogKind;
  role: RoleId;
  allowed: boolean;
  dirty: boolean;
  setDirty: (dirty: boolean) => void;
  onClose: () => void;
  notify: Notify;
  contract: NonNullable<ReturnType<typeof getDialogContract>>;
};

const dialogTone: Record<DialogKind, { badge: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"; panel: string; icon: string; label: string }> = {
  session: { badge: "info", panel: "border-blue-200 bg-blue-50 text-blue-900", icon: "세션", label: "세션 복구" },
  destructive: { badge: "destructive", panel: "border-rose-200 bg-rose-50 text-rose-900", icon: "위험", label: "위험 확인" },
  payment: { badge: "warning", panel: "border-amber-200 bg-amber-50 text-amber-900", icon: "정산", label: "결제/정산" },
  search: { badge: "info", panel: "border-sky-200 bg-sky-50 text-sky-900", icon: "검색", label: "검색 선택" },
  bulk: { badge: "warning", panel: "border-violet-200 bg-violet-50 text-violet-900", icon: "일괄", label: "대량 처리" },
  status: { badge: "success", panel: "border-emerald-200 bg-emerald-50 text-emerald-900", icon: "상태", label: "상태/설정" },
  form: { badge: "secondary", panel: "border-slate-200 bg-surface-secondary text-content", icon: "입력", label: "입력 폼" }
};

function getDialogKind(dialog: DialogDefinition): DialogKind {
  const text = `${dialog.id} ${dialog.title} ${dialog.purpose} ${dialog.components.join(" ")}`;
  if (dialog.id === "DLG-000" || /세션/.test(text)) return "session";
  if (dialog.destructive || /삭제|탈퇴|병합|작업 취소|초기화|취소 확인|퇴사|회수/.test(dialog.title)) return "destructive";
  if (/검색|중복 안내|선택 목록|주소/.test(text)) return "search";
  if (/일괄|대량|배포|전체 반복|일정 이후|여러|다중/.test(text)) return "bulk";
  if (/결제|매출|환불|납입|할부|세금|정산|수납|미수|영수증|쿠폰|선수익|목표 매출/.test(text)) return "payment";
  if (/상태|권한|설정|변경|홀딩|해제|이관|등급|정책|토글|승인|등록|수정|추가|처리|확인/.test(text)) return "status";
  return "form";
}

function RuntimeDialog({ dialogId, role, onClose, notify }: RuntimeDialogProps) {
  const dialog = dialogId ? dialogById.get(dialogId) : undefined;
  const allowed = dialog ? hasPermission(role, dialog.requiredPermission) : true;
  const contract = dialog ? getDialogContract(dialog) : null;
  const kind = dialog ? getDialogKind(dialog) : "form";
  const tone = dialogTone[kind];
  const [dirty, setDirty] = useState(false);


  const closeDialog = () => {
    if (dirty) notify("입력 변경사항을 저장하지 않고 닫았습니다.", "warning");
    setDirty(false);
    onClose();
  };

  const confirmDialog = () => {
    if (!dialog) return;
    if (!allowed) {
      notify(`${dialog.id} ${dialog.title}: 현재 역할 권한으로는 확인 처리할 수 없습니다.`, "warning");
      return;
    }
    notify(`${dialog.id} ${dialog.title} mock 처리 완료`, dialog.policyPending ? "warning" : "success");
    setDirty(false);
    onClose();
  };

  return (
    <Dialog open={Boolean(dialog)} onOpenChange={(open) => !open && closeDialog()}>
      {dialog && contract && (
        <DialogContent data-testid="runtime-dialog" className="max-w-[920px] p-0">
          <div className={cn("rounded-t-lg border-b px-6 py-5", tone.panel)}>
            <DialogHeader className="gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={dialog.destructive ? "destructive" : tone.badge}>{dialog.id}</Badge>
                <Badge variant="outline" className="bg-white/70">{dialog.source}</Badge>
                <Badge variant="secondary">{tone.label}</Badge>
                {dialog.policyPending && <Badge variant="warning">정책 확인 필요</Badge>}
                {!allowed && <Badge variant="warning">권한 차단</Badge>}
              </div>
              <div className="flex items-start gap-4">
                <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/80 text-sm font-black shadow-sm">{tone.icon}</div>
                <div className="min-w-0">
                  <DialogTitle className="text-2xl leading-tight">{dialog.title}</DialogTitle>
                  <DialogDescription className="mt-2 leading-6 text-current/75">{dialog.purpose}</DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="space-y-4 px-6 pb-6">
            <DialogMetaPanel dialog={dialog} role={role} allowed={allowed} contract={contract} kind={kind} />
            {!allowed && <PermissionBlockedMessage dialog={dialog} />}
            <DialogWorkflowBody dialog={dialog} kind={kind} role={role} allowed={allowed} dirty={dirty} setDirty={setDirty} onClose={onClose} notify={notify} contract={contract} />
            <DialogContractPanel contract={contract} dirty={dirty} />
            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>닫기</Button>
              <Button variant={dialog.destructive || kind === "destructive" ? "destructive" : "default"} data-blocked={!allowed} onClick={confirmDialog}>{dialog.policyPending ? "정책 확인 상태로 저장" : kind === "session" ? "재로그인 mock" : kind === "destructive" ? "위험 확인" : "확인"}</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}

function DialogMetaPanel({ dialog, role, allowed, contract, kind }: { dialog: DialogDefinition; role: RoleId; allowed: boolean; contract: NonNullable<ReturnType<typeof getDialogContract>>; kind: DialogKind }) {
  const roleInfo = roleById.get(role)!;
  return (
    <div className="grid gap-3 pt-4 md:grid-cols-4">
      <div className="rounded-xl border bg-white p-3"><div className="text-xs font-semibold text-content-tertiary">문서 기준</div><div className="mt-1 text-sm font-medium text-content">{dialog.source.replace("share/", "")}</div></div>
      <div className="rounded-xl border bg-white p-3"><div className="text-xs font-semibold text-content-tertiary">역할/권한</div><div className="mt-1 text-sm font-medium text-content">{roleInfo.label} · {allowed ? "가능" : "차단"}</div></div>
      <div className="rounded-xl border bg-white p-3"><div className="text-xs font-semibold text-content-tertiary">처리 유형</div><div className="mt-1 text-sm font-medium text-content">{dialogTone[kind].label} · {contract.handoffStatus}</div></div>
      <div className="rounded-xl border bg-white p-3"><div className="text-xs font-semibold text-content-tertiary">Mock 범위</div><div className="mt-1 text-sm font-medium text-content">API 호출 없음 · toast/local state</div></div>
    </div>
  );
}

function PermissionBlockedMessage({ dialog }: { dialog: DialogDefinition }) {
  return <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"><Lock className="mr-2 inline size-4" />현재 역할에는 <b>{dialog.requiredPermission}</b> 처리 권한이 없습니다. 검수용으로 입력과 상태는 보이지만 확인 버튼은 권한 차단 toast만 표시합니다.</div>;
}

function DialogWorkflowBody(props: DialogBodyProps) {
  if (props.kind === "session") return <SessionDialogBody {...props} />;
  if (props.kind === "destructive") return <DestructiveDialogBody {...props} />;
  if (props.kind === "payment") return <PaymentDialogBody {...props} />;
  if (props.kind === "search") return <SearchDialogBody {...props} />;
  if (props.kind === "bulk") return <BulkDialogBody {...props} />;
  if (props.kind === "status") return <StatusDialogBody {...props} />;
  return <FormDialogBody {...props} />;
}

function SessionDialogBody({ setDirty, notify }: DialogBodyProps) {
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_300px]">
      <div className="rounded-2xl border bg-white p-5">
        <div className="flex items-center gap-3"><Lock className="size-5 text-blue-600" /><h3 className="font-semibold">세션 복구 플로우</h3></div>
        <p className="mt-2 text-sm leading-6 text-content-secondary">현재 위치를 저장한 뒤 재로그인 화면으로 이동하고, 인증 완료 후 마지막 업무 화면으로 복귀하는 D01 공통 다이얼로그입니다.</p>
        <div className="mt-4 grid gap-2 text-sm">
          <div className="flex justify-between rounded-lg bg-surface-secondary px-3 py-2"><span className="text-content-tertiary">만료 사유</span><b>30분 이상 미활동</b></div>
          <div className="flex justify-between rounded-lg bg-surface-secondary px-3 py-2"><span className="text-content-tertiary">복귀 URL</span><b>/members 또는 직전 화면</b></div>
          <div className="flex justify-between rounded-lg bg-surface-secondary px-3 py-2"><span className="text-content-tertiary">보안 정책</span><b>토큰 폐기 + 재인증</b></div>
        </div>
      </div>
      <div className="space-y-3 rounded-2xl border bg-surface-secondary p-4">
        <Label>재로그인 메모</Label>
        <Textarea defaultValue="세션 만료 후 원래 화면으로 돌아갑니다." onChange={() => setDirty(true)} />
        <Button className="w-full" onClick={() => notify("재로그인 화면 이동 mock", "info")}>재로그인 화면으로 이동</Button>
      </div>
    </div>
  );
}

function DestructiveDialogBody({ dialog, setDirty }: DialogBodyProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-900">
        <div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 size-5" /><div><h3 className="font-semibold">복구가 어렵거나 운영 이력이 바뀌는 위험 액션입니다.</h3><p className="mt-1 text-sm leading-6">삭제/탈퇴/병합/취소성 DLG는 대상, 영향 범위, 감사 로그 사유를 분리해서 확인하도록 퍼블리싱했습니다.</p></div></div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {dialog.components.slice(0, 3).map((component, index) => <div key={component} className="rounded-xl border bg-white p-3"><div className="text-xs font-semibold text-content-tertiary">확인 {index + 1}</div><div className="mt-1 font-medium">{component}</div><p className="mt-2 text-xs leading-5 text-content-tertiary">mock 대상: {index === 0 ? "김민준 / S-260528-001" : index === 1 ? "연결 이력·미수·예약 영향" : "권한자 재확인 필요"}</p></div>)}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2"><Label>처리 사유 / 감사 로그</Label><Textarea defaultValue={`${dialog.title} 사유를 남깁니다.`} onChange={() => setDirty(true)} /></div>
        <div className="space-y-2"><Label>확인 문구</Label><Input defaultValue={dialog.id} onChange={() => setDirty(true)} /><p className="text-xs text-content-tertiary">실개발 시 service 호출 전 확인 문구 검증을 권장합니다.</p></div>
      </div>
    </div>
  );
}

function PaymentDialogBody({ dialog, setDirty, contract }: DialogBodyProps) {
  const totalLabel = /환불/.test(dialog.title) ? "환불 예정액" : /세금/.test(dialog.title) ? "공급가액" : /할부|납입|미수/.test(dialog.title) ? "잔여/납입액" : "최종 결제액";
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        {[{ label: "원거래", value: "S-260528-001" }, { label: totalLabel, value: /환불/.test(dialog.title) ? "120,000원" : "1,200,000원" }, { label: "외부 연동", value: dialog.policyPending ? "정책 확인" : "mock" }, { label: "승인 상태", value: dialog.requiredPermission ? "권한 필요" : "조회" }].map((item) => <div key={item.label} className="rounded-xl border bg-white p-3"><div className="text-xs font-semibold text-content-tertiary">{item.label}</div><div className="mt-1 text-lg font-bold text-content">{item.value}</div></div>)}
      </div>
      <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border bg-white p-4">
          <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">정산 입력</h3><Badge variant={dialog.policyPending ? "warning" : "success"}>{contract.handoffStatus}</Badge></div>
          <DialogDynamicFields contract={contract} setDirty={setDirty} maxFields={4} />
        </div>
        <div className="rounded-2xl border bg-amber-50 p-4 text-sm text-amber-900">
          <h3 className="font-semibold">개발 인수 포인트</h3>
          <ul className="mt-3 space-y-2 leading-5">
            <li>· 실제 카드/PG/세금계산서/환불 처리는 호출하지 않습니다.</li>
            <li>· 버튼은 contract key 기준으로 개발 service layer에 연결할 수 있게 표시합니다.</li>
            <li>· 정책 미확정 산식은 수기 입력/확인 필요 배지로 남깁니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function SearchDialogBody({ dialog, setDirty, notify, contract }: DialogBodyProps) {
  return (
    <div className="grid gap-4 md:grid-cols-[320px_1fr]">
      <div className="space-y-3 rounded-2xl border bg-white p-4">
        <Label>{dialog.components[0] ?? "검색어"}</Label>
        <div className="relative"><Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-content-tertiary" /><Input className="pl-9" defaultValue="김민준 / 010" onChange={() => setDirty(true)} /></div>
        <DialogDynamicFields contract={contract} setDirty={setDirty} maxFields={2} skipFirst />
        <Button className="w-full" variant="secondary" onClick={() => notify(`${dialog.title} 검색 mock 실행`, "info")}>검색 mock</Button>
      </div>
      <div className="rounded-2xl border bg-surface-secondary p-4">
        <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">검색 결과</h3><Badge variant="info">3건</Badge></div>
        <div className="space-y-2">
          {["김민준 · 010-1234-5678 · 강남점", "김민준(가족) · 010-0000-1111 · 서초점", "비회원 현장 결제 · 연락처 미확정"].map((item) => <button key={item} type="button" onClick={() => { setDirty(true); notify(`${item} 선택 mock`, "info"); }} className="flex w-full items-center justify-between rounded-xl border bg-white p-3 text-left text-sm hover:border-blue-300"><span>{item}</span><Badge variant="outline">선택</Badge></button>)}
        </div>
      </div>
    </div>
  );
}

function BulkDialogBody({ dialog, setDirty, contract }: DialogBodyProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        {[{ label: "대상", value: "128건" }, { label: "처리 가능", value: "116건" }, { label: "충돌/제외", value: "12건" }, { label: "실행 방식", value: "mock" }].map((item) => <div key={item.label} className="rounded-xl border bg-white p-3"><div className="text-xs font-semibold text-content-tertiary">{item.label}</div><div className="mt-1 text-lg font-bold">{item.value}</div></div>)}
      </div>
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-2xl border bg-white p-4">
          <h3 className="font-semibold">일괄 처리 미리보기</h3>
          <Table className="mt-3"><TableHeader><TableRow><TableHead>대상</TableHead><TableHead>변경 전</TableHead><TableHead>변경 후</TableHead><TableHead>상태</TableHead></TableRow></TableHeader><TableBody>{["강남점", "서초점", "잠실점"].map((branch, index) => <TableRow key={branch}><TableCell>{branch}</TableCell><TableCell>기존 설정</TableCell><TableCell>{dialog.title}</TableCell><TableCell><Badge variant={index === 2 ? "warning" : "success"}>{index === 2 ? "충돌 확인" : "가능"}</Badge></TableCell></TableRow>)}</TableBody></Table>
        </div>
        <div className="space-y-3 rounded-2xl border bg-violet-50 p-4">
          <h3 className="font-semibold text-violet-900">실행 전 체크</h3>
          {contract.fields.slice(0, 4).map((field) => <label key={field.name} className="flex items-center gap-2 rounded-lg bg-white/70 p-2 text-sm"><input type="checkbox" onChange={() => setDirty(true)} /> {field.label} 확인</label>)}
          <Textarea defaultValue="일괄 처리 사유" onChange={() => setDirty(true)} />
        </div>
      </div>
    </div>
  );
}

function StatusDialogBody({ dialog, setDirty, contract }: DialogBodyProps) {
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_300px]">
      <div className="rounded-2xl border bg-white p-4">
        <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">상태 전환 / 운영 입력</h3><Badge variant="success">필수값 표시</Badge></div>
        <DialogDynamicFields contract={contract} setDirty={setDirty} />
      </div>
      <div className="rounded-2xl border bg-emerald-50 p-4 text-sm text-emerald-900">
        <h3 className="font-semibold">처리 후 화면 반영</h3>
        <div className="mt-3 space-y-2">
          {["목록 상태 배지 변경", "상세 이력 타임라인 추가", "권한/정책 toast 표시", "감사 로그 payload 준비"].map((item) => <div key={item} className="flex items-center gap-2 rounded-lg bg-white/70 p-2"><CheckCircle2 className="size-4" />{item}</div>)}
        </div>
        <div className="mt-3 rounded-lg bg-white/70 p-2 text-xs leading-5">{dialog.purpose}</div>
      </div>
    </div>
  );
}

function FormDialogBody({ setDirty, contract }: DialogBodyProps) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">입력 항목</h3><Badge variant="secondary">문서 컴포넌트 기반</Badge></div>
      <DialogDynamicFields contract={contract} setDirty={setDirty} />
    </div>
  );
}

function DialogDynamicFields({ contract, setDirty, maxFields, skipFirst = false }: { contract: NonNullable<ReturnType<typeof getDialogContract>>; setDirty: (dirty: boolean) => void; maxFields?: number; skipFirst?: boolean }) {
  const fields = contract.fields.slice(skipFirst ? 1 : 0, maxFields ? (skipFirst ? maxFields + 1 : maxFields) : undefined);
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {fields.map((field, index) => (
        <div key={field.name} className={cn("space-y-1", field.type === "textarea" && "sm:col-span-2")}>
          <Label className="flex items-center gap-2">{field.label}{field.required && <Badge variant="outline">필수</Badge>}</Label>
          {field.type === "textarea" ? (
            <Textarea defaultValue={`${field.label} mock 입력`} onChange={() => setDirty(true)} />
          ) : field.type === "select" ? (
            <Select defaultValue="option-a" onValueChange={() => setDirty(true)}><SelectTrigger className="w-full bg-white"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="option-a">기본 상태</SelectItem><SelectItem value="option-b">변경 상태</SelectItem><SelectItem value="option-c">정책 확인 필요</SelectItem></SelectContent></Select>
          ) : field.type === "checkbox" ? (
            <label className="flex h-10 items-center gap-2 rounded-md border bg-white px-3 text-sm"><input type="checkbox" onChange={() => setDirty(true)} /> {field.validation}</label>
          ) : (
            <Input type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"} defaultValue={field.type === "date" ? "2026-05-28" : field.type === "number" ? `${(index + 1) * 10}` : `${field.label} mock`} onChange={() => setDirty(true)} />
          )}
          <p className="text-xs text-content-tertiary">{field.validation}</p>
        </div>
      ))}
    </div>
  );
}

function DialogContractPanel({ contract, dirty }: { contract: NonNullable<ReturnType<typeof getDialogContract>>; dirty: boolean }) {
  return (
    <div className="rounded-xl border bg-surface-secondary p-3 text-xs leading-5 text-content-secondary">
      실제 저장·삭제·승인·발송·결제·환불·외부연동은 수행하지 않습니다. 버튼 클릭 시 로컬 toast 또는 화면 상태만 mock 변경합니다.<br />
      Contract key: <code>{contract.submitContract.key}</code> · 실제 API 호출 없음 · 상태 {dirty ? "dirty" : "pristine"} · 오류상태 {contract.submitContract.errorStates.join(" / ")}
    </div>
  );
}

function RoleSelect({ role, setRole, compact = false }: { role: RoleId; setRole: (role: RoleId) => void; compact?: boolean }) {
  return <Select value={role} onValueChange={(value) => setRole(value as RoleId)}><SelectTrigger className={compact ? "w-40 bg-white" : "w-full"}><SelectValue /></SelectTrigger><SelectContent>{roles.map((item) => <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>)}</SelectContent></Select>;
}

function BranchSelect({ branch, setBranch, compact = false }: { branch: string; setBranch: (branch: string) => void; compact?: boolean }) {
  return <Select value={branch} onValueChange={setBranch}><SelectTrigger className={compact ? "w-32 bg-white" : "w-full"}><SelectValue /></SelectTrigger><SelectContent>{branches.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>;
}

function CheckLine({ label }: { label: string }) {
  return <div className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600" />{label}</div>;
}

function Toast({ toast }: { toast: ToastState }) {
  if (!toast) return null;
  return <div className={cn("fixed right-5 bottom-5 z-50 rounded-xl border px-4 py-3 text-sm shadow-lg", toast.tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-800", toast.tone === "warning" && "border-amber-200 bg-amber-50 text-amber-800", toast.tone === "info" && "border-blue-200 bg-blue-50 text-blue-800")}><ClipboardCheck className="mr-2 inline size-4" />{toast.message}</div>;
}

// ===== D04~D11 specialized 화면 컴포넌트 (admin-pando 시각 패턴 차용) =====

function FrontStateNote({ screen }: { screen: ScreenDefinition }) {
  const config = domainPublishing[screen.domain] ?? domainPublishing.D09;
  return (
    <Card className="shadow-none">
      <CardHeader><CardTitle>프론트 상태 명세</CardTitle><CardDescription><span>{config.title}</span></CardDescription></CardHeader>
      <CardContent className="space-y-2 text-sm text-content-secondary">
        <CheckLine label="loading skeleton 영역 확보" />
        <CheckLine label="empty/search none 메시지" />
        <CheckLine label="permission/policy badge" />
        <CheckLine label="row action + modal 연결" />
        {screen.policyPending && <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800"><AlertTriangle className="mr-2 inline size-4" />정책 확인 필요 항목은 실제 계산/연동 없이 UI 상태만 표시합니다.</div>}
      </CardContent>
    </Card>
  );
}

function MetricGrid({ metrics, onSelect, active }: { metrics: ScreenDefinition["metrics"]; onSelect?: (label: string) => void; active?: string | null }) {
  return (
    <section className="grid grid-cols-4 gap-3">
      {metrics.slice(0, 4).map((metric) => (
        <button key={metric.label} type="button" onClick={() => onSelect?.(metric.label)} className="text-left">
          <Card className={cn("h-full shadow-none", active === metric.label && "ring-2 ring-blue-300")}>
            <CardHeader className="pb-2"><CardDescription>{metric.label}</CardDescription><CardTitle className="text-xl">{metric.value}</CardTitle></CardHeader>
            <CardContent><p className="text-xs text-content-tertiary">{metric.hint}</p></CardContent>
          </Card>
        </button>
      ))}
    </section>
  );
}

function FilterChips({ filters, notify }: { filters: string[]; notify: Notify }) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button key={filter} type="button" variant="outline" size="sm" onClick={() => notify(`${filter} chip 적용`, "info")}>{filter}</Button>
      ))}
    </div>
  );
}

function PrimaryActionRow({ screen, role, openDialog, notify }: { screen: ScreenDefinition; role: RoleId; openDialog: (id: string) => void; notify: Notify }) {
  const roleInfo = roleById.get(role)!;
  return (
    <div className="flex flex-wrap gap-2">
      {screen.primaryActions.map((action) => {
        const allowed = hasPermission(role, action.permission);
        return (
          <Button key={action.label} data-dialog-id={action.dialogId} variant={action.danger ? "destructive" : allowed ? "default" : "outline"} data-blocked={!allowed} size="sm" onClick={() => {
            if (!allowed) { notify(`${action.label}: ${roleInfo.label} 권한으로는 실행할 수 없습니다.`, "warning"); return; }
            if (action.dialogId) openDialog(action.dialogId); else notify(`${action.label} mock 실행 완료`);
          }}>
            {!allowed && <Lock className="size-3.5" />} {action.label}
          </Button>
        );
      })}
    </div>
  );
}

// ---- D04 수업관리 ----

function ClassCalendarScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  // admin-pando calendar 시각 차용: 월/주/일 뷰, 시간 슬롯 격자, 강사 색상 라벨
  const [view, setView] = useState<"월" | "주" | "일" | "목록">("주");
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const hours = ["07:00", "10:00", "11:00", "14:00", "19:00"];
  const slotData: Record<string, { 수업: string; 강사: string; tone: string }[]> = {
    "07:00": [{ 수업: "요가 모닝", 강사: "정GX", tone: "bg-emerald-100 text-emerald-800 border-emerald-300" }],
    "10:00": [{ 수업: "PT 김민준", 강사: "박트레이너", tone: "bg-blue-100 text-blue-800 border-blue-300" }],
    "11:00": [{ 수업: "필라테스 그룹", 강사: "정GX", tone: "bg-violet-100 text-violet-800 border-violet-300" }],
    "14:00": [{ 수업: "골프 레슨", 강사: "김프로", tone: "bg-amber-100 text-amber-800 border-amber-300" }],
    "19:00": [{ 수업: "스피닝", 강사: "박GX", tone: "bg-rose-100 text-rose-800 border-rose-300" }]
  };
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="수업 캘린더 보드" />
      <MetricGrid metrics={screen.metrics} onSelect={(label) => { setSelectedMetric(label); notify(`${label} 지표 기준으로 캘린더 필터 적용`, "info"); }} active={selectedMetric} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between"><CardTitle>{view} 캘린더</CardTitle>
                <div className="flex gap-1">{(["월", "주", "일", "목록"] as const).map((v) => <Button key={v} size="sm" variant={view === v ? "default" : "outline"} onClick={() => setView(v)}>{v} 뷰</Button>)}</div>
              </div>
              <CardDescription>강사 색상 라벨·예약 카드·드래그 mock — 실제 일정 충돌 검증은 개발 단계에서 연결합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <FilterChips filters={screen.filters} notify={notify} />
              <div className="overflow-hidden rounded-xl border">
                <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))] bg-surface-secondary text-xs font-semibold text-content-secondary">
                  <div className="border-b border-r p-2">시간</div>
                  {["월", "화", "수", "목", "금", "토", "일"].map((d) => <div key={d} className="border-b p-2 text-center">{d}</div>)}
                </div>
                {hours.map((hour) => (
                  <div key={hour} className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))] border-b last:border-b-0">
                    <div className="border-r bg-surface-secondary p-2 text-xs font-semibold text-content-tertiary">{hour}</div>
                    {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                      const block = slotData[hour]?.[0];
                      const show = block && dayIndex < 5;
                      return (
                        <div key={dayIndex} className="min-h-16 border-r p-1 last:border-r-0">
                          {show && (
                            <button type="button" className={cn("w-full rounded border px-2 py-1 text-left text-[11px] font-medium", block.tone)} onClick={() => openDialog("DLG-C002")}>
                              <div>{block.수업}</div><div className="opacity-75">{block.강사}</div>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader><CardTitle>오늘 수업 타임라인</CardTitle><CardDescription>docs4 rows 기반 mock</CardDescription></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow>{screen.tableColumns.map((c) => <TableHead key={c}>{c}</TableHead>)}</TableRow></TableHeader>
                <TableBody>{screen.rows.map((row, index) => <TableRow key={index}>{screen.tableColumns.map((c) => <TableCell key={c}>{statusAwareValue(String(row[c] ?? "-"))}</TableCell>)}</TableRow>)}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>오늘 강사 라벨</CardTitle><CardDescription>색상 구분 mock</CardDescription></CardHeader>
            <CardContent className="space-y-2">
              {[
                { 강사: "박트레이너", role: "PT", color: "bg-blue-500" },
                { 강사: "정GX", role: "GX 요가/필라테스", color: "bg-violet-500" },
                { 강사: "김프로", role: "골프", color: "bg-amber-500" },
                { 강사: "박GX", role: "스피닝", color: "bg-rose-500" }
              ].map((item) => (
                <div key={item.강사} className="flex items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm">
                  <div className="flex items-center gap-2"><span className={cn("size-3 rounded-full", item.color)} /><b>{item.강사}</b></div>
                  <span className="text-xs text-content-tertiary">{item.role}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader><CardTitle>운영 액션</CardTitle></CardHeader>
            <CardContent className="space-y-2"><PrimaryActionRow screen={screen} role={role} openDialog={openDialog} notify={notify} /></CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
          <FrontStateNote screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function LessonManagementScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const [tab, setTab] = useState(screen.tabs[0] ?? "전체");
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="목록 기반 정밀 수업 관리" />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>수업 목록</CardTitle><CardDescription>캘린더 뷰의 보조 - 출석 처리·서명 누락·노쇼 정정 중심.</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <Tabs value={tab} onValueChange={(v) => { setTab(v); notify(`${v} 탭`, "info"); }}>
                <TabsList>{screen.tabs.map((t) => <TabsTrigger key={t} value={t}>{t}</TabsTrigger>)}</TabsList>
              </Tabs>
              <FilterChips filters={screen.filters} notify={notify} />
              <Table>
                <TableHeader><TableRow>{screen.tableColumns.map((c) => <TableHead key={c}>{c}</TableHead>)}<TableHead>행 액션</TableHead></TableRow></TableHeader>
                <TableBody>{screen.rows.map((row, index) => (
                  <TableRow key={index}>{screen.tableColumns.map((c) => <TableCell key={c}>{statusAwareValue(String(row[c] ?? "-"))}</TableCell>)}
                    <TableCell><Button size="sm" variant="ghost" onClick={() => openDialog("DLG-C005")}>기록 상세</Button></TableCell>
                  </TableRow>
                ))}</TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader><CardTitle>주요 액션</CardTitle></CardHeader>
            <CardContent><PrimaryActionRow screen={screen} role={role} openDialog={openDialog} notify={notify} /></CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function GroupClassStatusScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="주간·월간 예약/출석 보드" />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>그룹 수업 잔여/출석</CardTitle><CardDescription>정원 대비 잔여 자리 시각 바</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <FilterChips filters={screen.filters} notify={notify} />
              <div className="grid grid-cols-1 gap-2">
                {screen.rows.map((row, idx) => {
                  const pct = Number(String(row["출석률(%)"] ?? "0").replace("%", "")) || 0;
                  return (
                    <div key={idx} className="rounded-xl border bg-white p-3">
                      <div className="flex items-center justify-between text-sm">
                        <div><b>{row["수업명"]}</b> <span className="text-xs text-content-tertiary">{row["유형"]} · {row["강사"]} · {row["요일·시간"]}</span></div>
                        <div className="text-xs">{statusAwareValue(String(row["잔여 바"] ?? "-"))}</div>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-xs text-content-secondary">
                        <span>예약 {row["예약 수"]}/{row["정원"]}</span><span>잔여 {row["잔여 자리"]}</span><span>노쇼 {row["노쇼 수"]}</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded bg-surface-tertiary">
                        <div className="h-full bg-blue-500" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="mt-1 text-right text-xs text-content-tertiary">출석률 {pct}%</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>처리 액션</CardTitle></CardHeader>
            <CardContent className="space-y-2"><PrimaryActionRow screen={screen} role={role} openDialog={openDialog} notify={notify} /></CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function ExerciseProgramsScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  // V2 강조: 자동 추천 미지원 표시
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="V2 신규 · 트레이너 수동 운영" />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>프로그램 카드 그리드</CardTitle><CardDescription>동작 순서 드래그&드롭·회원 배정 mock</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <FilterChips filters={screen.filters} notify={notify} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {screen.rows.map((row, idx) => (
                  <div key={idx} className="rounded-xl border bg-white p-3">
                    <div className="flex items-center justify-between"><b className="text-sm">{row["프로그램명"]}</b>{statusAwareValue(String(row["활성"] ?? "-"))}</div>
                    <div className="mt-1 text-xs text-content-tertiary">{row["담당 트레이너"]} · 동작 {row["동작 수"]}</div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded bg-surface-secondary p-2"><div className="text-content-tertiary">배정 회원</div><div className="font-semibold">{row["배정 회원 수"]}</div></div>
                      <div className="rounded bg-surface-secondary p-2"><div className="text-content-tertiary">최종 수정</div><div className="font-semibold">{row["마지막 수정일"]}</div></div>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => notify(`${row["프로그램명"]} 동작 순서 편집 mock`, "info")}>동작 편집</Button>
                      <Button size="sm" variant="outline" onClick={() => notify(`${row["프로그램명"]} 회원 배정 mock`, "info")}>회원 배정</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>V2 정책 안내</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs text-content-secondary">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800"><AlertTriangle className="mr-2 inline size-4" />v1 자동 추천·자동 생성 미지원. 수동 등록·수정·배정만 mock 처리.</div>
              <PrimaryActionRow screen={screen} role={role} openDialog={openDialog} notify={notify} />
            </CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function LessonAttendanceScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  // admin-pando attendance 시각 차용: 실시간 출입 로그 + 인증 미리보기
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="출석/완료/서명 처리 보드" />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>수업별 출석/완료 현황</CardTitle><CardDescription>출석 처리·노쇼 정정·서명 요청 Push mock</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <FilterChips filters={screen.filters} notify={notify} />
              <Table>
                <TableHeader><TableRow>{screen.tableColumns.map((c) => <TableHead key={c}>{c}</TableHead>)}<TableHead>처리</TableHead></TableRow></TableHeader>
                <TableBody>{screen.rows.map((row, idx) => (
                  <TableRow key={idx}>{screen.tableColumns.map((c) => <TableCell key={c}>{statusAwareValue(String(row[c] ?? "-"))}</TableCell>)}
                    <TableCell><Button size="sm" variant="outline" onClick={() => notify(`${row["수업명"]} 출석 처리 mock`, "info")}>처리</Button></TableCell>
                  </TableRow>
                ))}</TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader><CardTitle>인증 채널 (참고)</CardTitle><CardDescription>QR은 입/출입 확인 — 수업 출석 인증 아님 (분쟁 대응 참고값)</CardDescription></CardHeader>
            <CardContent className="grid grid-cols-3 gap-2 text-xs">
              {[{ label: "키오스크 QR", icon: "QR" }, { label: "얼굴 인식", icon: "FR" }, { label: "수동 입력", icon: "Ma" }].map((item) => (
                <div key={item.label} className="rounded-xl border bg-surface-secondary p-3 text-center"><div className="mx-auto grid size-12 place-items-center rounded-xl bg-white font-bold">{item.icon}</div><div className="mt-1 font-medium">{item.label}</div><div className="text-content-tertiary">mock 미리보기</div></div>
              ))}
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>실시간 출입 로그</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs">
              {[
                { 시간: "10:24", 회원: "김민준", 결과: "출석", tone: "success" },
                { 시간: "11:02", 회원: "박서연", 결과: "출석", tone: "success" },
                { 시간: "11:05", 회원: "오지우", 결과: "노쇼", tone: "destructive" }
              ].map((log, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg border bg-white px-2 py-1.5">
                  <span><b>{log.시간}</b> {log.회원}</span><Badge variant={log.tone as "success" | "destructive"}>{log.결과}</Badge>
                </div>
              ))}
              <PrimaryActionRow screen={screen} role={role} openDialog={openDialog} notify={notify} />
            </CardContent>
          </Card>
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function ReservationListScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="예약 원장 (예약 1건 단위)" />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <Card className="shadow-none">
          <CardHeader><CardTitle>예약 원장</CardTitle><CardDescription>회원 문의·예약 취소·출석/노쇼 처리 현황</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            <FilterChips filters={screen.filters} notify={notify} />
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow>{screen.tableColumns.slice(0, 8).map((c) => <TableHead key={c}>{c}</TableHead>)}<TableHead>액션</TableHead></TableRow></TableHeader>
                <TableBody>{screen.rows.map((row, idx) => (
                  <TableRow key={idx}>{screen.tableColumns.slice(0, 8).map((c) => <TableCell key={c}>{statusAwareValue(String(row[c] ?? "-"))}</TableCell>)}
                    <TableCell><Button size="sm" variant="ghost" onClick={() => notify(`${row["수업명"]} 회원 상세 mock`, "info")}>상세</Button></TableCell>
                  </TableRow>
                ))}</TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <aside className="space-y-4">
          <Card className="shadow-none"><CardHeader><CardTitle>예약 처리</CardTitle></CardHeader><CardContent><PrimaryActionRow screen={screen} role={role} openDialog={openDialog} notify={notify} /></CardContent></Card>
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

// ---- D05 상품관리 ----

function ProductManagementScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  // admin-pando products 시각 차용: 분류 탭 + 상품 카드 그리드
  const [category, setCategory] = useState("전체");
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="상품 마스터 콘솔" />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>상품 목록</CardTitle><CardDescription>1단계 대분류 → 2단계 GX 세부 → 상품명 검색</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {["전체", "회원권", "수강권", "락커", "운동복", "일반"].map((c) => (
                  <Button key={c} size="sm" variant={category === c ? "default" : "outline"} onClick={() => { setCategory(c); notify(`${c} 분류 적용`, "info"); }}>{c}</Button>
                ))}
              </div>
              <FilterChips filters={screen.filters} notify={notify} />
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead>상품명</TableHead><TableHead>대분류</TableHead><TableHead>이용 지점</TableHead><TableHead>현금가</TableHead><TableHead>카드가</TableHead><TableHead>기간/횟수</TableHead><TableHead>옵션</TableHead><TableHead>판매</TableHead><TableHead>상태</TableHead></TableRow></TableHeader>
                  <TableBody>{screen.rows.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell><b>{row["상품명(유형·패키지·운영정책 배지)"]}</b></TableCell>
                      <TableCell>{row["대분류"]}</TableCell>
                      <TableCell className="text-xs">{row["이용 가능 지점"]}</TableCell>
                      <TableCell>{row["현금가"]}</TableCell>
                      <TableCell>{row["카드가"]}</TableCell>
                      <TableCell className="text-xs">{row["기간"]} / {row["횟수"]}</TableCell>
                      <TableCell className="text-xs">{[row["홀딩"], row["양도"], row["포인트"]].filter((x) => x === "Y").length}개 ON</TableCell>
                      <TableCell>{row["판매"]}</TableCell>
                      <TableCell>{statusAwareValue(String(row["상태"] ?? "-"))}</TableCell>
                    </TableRow>
                  ))}</TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none"><CardHeader><CardTitle>운영 액션</CardTitle></CardHeader><CardContent className="space-y-2"><PrimaryActionRow screen={screen} role={role} openDialog={openDialog} notify={notify} /></CardContent></Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
          <FrontStateNote screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function DiscountSettingsScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="할인 정책 콘솔" />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <Card className="shadow-none">
          <CardHeader><CardTitle>할인 정책 목록</CardTitle><CardDescription>정률/정액·최소 계약 기간·한도·적용 상품·기간</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            <FilterChips filters={screen.filters} notify={notify} />
            <Table>
              <TableHeader><TableRow>{screen.tableColumns.map((c) => <TableHead key={c}>{c}</TableHead>)}</TableRow></TableHeader>
              <TableBody>{screen.rows.map((row, idx) => (
                <TableRow key={idx}>{screen.tableColumns.map((c) => <TableCell key={c}>{statusAwareValue(String(row[c] ?? "-"))}</TableCell>)}</TableRow>
              ))}</TableBody>
            </Table>
          </CardContent>
        </Card>
        <aside className="space-y-4">
          <Card className="shadow-none"><CardHeader><CardTitle>할인 액션</CardTitle></CardHeader><CardContent><PrimaryActionRow screen={screen} role={role} openDialog={openDialog} notify={notify} /></CardContent></Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function ProductCatalogScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  // V2 강조: 카드 카탈로그 미리보기
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="V2 신규 · 회원 상담용 카탈로그" />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>카탈로그 카드</CardTitle><CardDescription>1단계 대분류 + GX 2단계 세부종목 배지 · 활성 상품만 자동 노출</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">{screen.tabs.map((t) => <Button key={t} size="sm" variant="outline" onClick={() => notify(`${t} 카탈로그 mock`, "info")}>{t}</Button>)}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {screen.rows.map((row, idx) => (
                  <div key={idx} className="rounded-xl border bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between"><Badge variant="info" className="text-xs">{row["대분류 색상"]}</Badge><Badge variant="secondary" className="text-xs">{row["GX 세부종목 배지"]}</Badge></div>
                    <h3 className="mt-2 text-lg font-bold">{row["상품명"]}</h3>
                    <p className="mt-1 text-sm text-content-secondary">{row["주요 혜택 요약"]}</p>
                    <div className="mt-3 flex items-baseline justify-between">
                      <div className="text-2xl font-bold text-blue-600">{row["가격(시즌 특가 시 취소선)"]}</div>
                      <div className="text-xs text-content-tertiary">{row["기간/횟수"]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none"><CardHeader><CardTitle>카탈로그 액션</CardTitle></CardHeader><CardContent><PrimaryActionRow screen={screen} role={role} openDialog={openDialog} notify={notify} /></CardContent></Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

// ---- D06 시설관리 ----

function LockerManagementScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const [view, setView] = useState<"박스" | "리스트">("박스");
  // 락커 박스 맵 mock
  const lockerBoxes = Array.from({ length: 24 }).map((_, i) => {
    const num = `A-${100 + i}`;
    const states = ["사용중", "사용중", "사용중", "빈", "만료 임박", "사용중", "빈", "고장", "사용중"];
    const state = states[i % states.length];
    return { 락커: num, 상태: state };
  });
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="박스 뷰/리스트 뷰 · 일괄 배정" />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between"><CardTitle>락커 맵</CardTitle>
                <div className="flex gap-1">{(["박스", "리스트"] as const).map((v) => <Button key={v} size="sm" variant={view === v ? "default" : "outline"} onClick={() => setView(v)}>{v} 뷰</Button>)}</div>
              </div>
              <CardDescription>구역별 · 색상으로 상태 식별</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <FilterChips filters={screen.filters} notify={notify} />
              {view === "박스" ? (
                <div className="grid grid-cols-6 md:grid-cols-8 gap-2">
                  {lockerBoxes.map((box) => {
                    const tone = box.상태 === "사용중" ? "border-blue-300 bg-blue-50 text-blue-700"
                      : box.상태 === "빈" ? "border-slate-200 bg-surface-secondary text-content-tertiary"
                      : box.상태 === "만료 임박" ? "border-amber-300 bg-amber-50 text-amber-700"
                      : "border-rose-200 bg-rose-50 text-rose-700 opacity-70";
                    return (
                      <button key={box.락커} type="button" onClick={() => notify(`${box.락커} 상세 mock`, "info")} className={cn("aspect-square rounded-lg border p-2 text-center text-xs font-semibold transition hover:-translate-y-0.5", tone)}>
                        <div>{box.락커}</div><div className="mt-1 text-[10px] opacity-75">{box.상태}</div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <Table>
                  <TableHeader><TableRow>{screen.tableColumns.slice(0, 7).map((c) => <TableHead key={c}>{c}</TableHead>)}<TableHead>액션</TableHead></TableRow></TableHeader>
                  <TableBody>{screen.rows.map((row, idx) => (
                    <TableRow key={idx}>{screen.tableColumns.slice(0, 7).map((c) => <TableCell key={c}>{statusAwareValue(String(row[c] ?? "-"))}</TableCell>)}
                      <TableCell className="text-xs">{row["액션"]}</TableCell>
                    </TableRow>
                  ))}</TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>락커 처리</CardTitle><CardDescription>배정·이동·회수·고장</CardDescription></CardHeader>
            <CardContent className="space-y-2"><PrimaryActionRow screen={screen} role={role} openDialog={openDialog} notify={notify} /></CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader><CardTitle>색상 범례</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs">
              {[{ name: "사용중", tone: "bg-blue-50 border-blue-300 text-blue-700" }, { name: "빈", tone: "bg-surface-secondary border-slate-200 text-content-tertiary" }, { name: "만료 임박", tone: "bg-amber-50 border-amber-300 text-amber-700" }, { name: "고장", tone: "bg-rose-50 border-rose-200 text-rose-700" }].map((item) => (
                <div key={item.name} className="flex items-center gap-2"><span className={cn("inline-block size-4 rounded border", item.tone)} /> <span>{item.name}</span></div>
              ))}
            </CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
          <FrontStateNote screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function LockerAssignmentScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  // V2 신규: 일일/개인/골프 사물함 탭
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="V2 신규 · 실시간 사물함 그리드" />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>유형 탭 + 그리드</CardTitle><CardDescription>회원 검색 → 빈 사물함 즉시 배정</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">{screen.tabs.map((t) => <Button key={t} size="sm" variant="outline" onClick={() => notify(`${t} mock`, "info")}>{t}</Button>)}</div>
              <FilterChips filters={screen.filters} notify={notify} />
              <Table>
                <TableHeader><TableRow>{screen.tableColumns.map((c) => <TableHead key={c}>{c}</TableHead>)}</TableRow></TableHeader>
                <TableBody>{screen.rows.map((row, idx) => (
                  <TableRow key={idx}>{screen.tableColumns.map((c) => <TableCell key={c}>{statusAwareValue(String(row[c] ?? "-"))}</TableCell>)}</TableRow>
                ))}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none"><CardHeader><CardTitle>배정 액션</CardTitle></CardHeader><CardContent><PrimaryActionRow screen={screen} role={role} openDialog={openDialog} notify={notify} /></CardContent></Card>
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function ExerciseRoomScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="V2 신규 · 운동룸 카드 보드" />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>운동룸 현황</CardTitle><CardDescription>유형별 운영 상태·시간대별 예약 슬롯</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <FilterChips filters={screen.filters} notify={notify} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {screen.rows.map((row, idx) => (
                  <div key={idx} className="rounded-xl border bg-white p-3">
                    <div className="flex items-center justify-between"><b>{row["룸명"]}</b>{statusAwareValue(String(row["운영 상태"] ?? "-"))}</div>
                    <div className="mt-1 text-xs text-content-tertiary">{row["유형"]} · 정원 {row["수용 인원"]} · 게이트 {row["게이트"]}</div>
                    <div className="mt-2 rounded bg-surface-secondary p-2 text-xs">{row["오늘 시간대별 예약 슬롯"]}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none"><CardHeader><CardTitle>룸 액션</CardTitle></CardHeader><CardContent><PrimaryActionRow screen={screen} role={role} openDialog={openDialog} notify={notify} /></CardContent></Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

// ---- D07 직원관리 ----

function StaffListScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  // admin-pando staff 시각 차용
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="재직·휴직·퇴사 합산" />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>직원 원장</CardTitle><CardDescription>직무 배지·재직 상태 배지·메모 미리보기</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">{screen.tabs.map((t) => <Button key={t} size="sm" variant="outline" onClick={() => notify(`${t} 탭`, "info")}>{t}</Button>)}</div>
              <FilterChips filters={screen.filters} notify={notify} />
              <Table>
                <TableHeader><TableRow><TableHead>#</TableHead><TableHead>직원</TableHead><TableHead>소속</TableHead><TableHead>직무</TableHead><TableHead>연락처</TableHead><TableHead>입사일</TableHead><TableHead>상태</TableHead><TableHead>메모</TableHead></TableRow></TableHeader>
                <TableBody>{screen.rows.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row["번호"]}</TableCell>
                    <TableCell className="font-semibold">{row["직원명"]}</TableCell>
                    <TableCell className="text-xs">{row["소속 지점"]}</TableCell>
                    <TableCell><Badge variant="outline">{row["직무 배지"]}</Badge></TableCell>
                    <TableCell className="text-xs">{row["연락처"]}</TableCell>
                    <TableCell className="text-xs">{row["입사일"]}</TableCell>
                    <TableCell>{statusAwareValue(String(row["재직 상태 배지"] ?? "-"))}</TableCell>
                    <TableCell className="text-xs text-content-tertiary">{row["메모(manager+ 30자 미리보기)"]}</TableCell>
                  </TableRow>
                ))}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none"><CardHeader><CardTitle>인사 액션</CardTitle></CardHeader><CardContent><PrimaryActionRow screen={screen} role={role} openDialog={openDialog} notify={notify} /></CardContent></Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
          <FrontStateNote screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function StaffAttendanceScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  // 근태 통계 카드 + 출근 캘린더 mock
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="키오스크·IoT·수동 보정 통합" />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>근태 기록</CardTitle><CardDescription>월 단위 · 날짜 범위 · 월별 집계 요약</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <FilterChips filters={screen.filters} notify={notify} />
              <Table>
                <TableHeader><TableRow>{screen.tableColumns.map((c) => <TableHead key={c}>{c}</TableHead>)}</TableRow></TableHeader>
                <TableBody>{screen.rows.map((row, idx) => (
                  <TableRow key={idx}>{screen.tableColumns.map((c) => <TableCell key={c}>{statusAwareValue(String(row[c] ?? "-"))}</TableCell>)}</TableRow>
                ))}</TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader><CardTitle>이번 주 출근 캘린더 (참고)</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {["월", "화", "수", "목", "금", "토", "일"].map((d) => <div key={d} className="rounded bg-surface-secondary p-2 font-semibold">{d}</div>)}
                {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                  const tone = day <= 4 ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : day === 5 ? "bg-amber-50 border-amber-200 text-amber-700"
                    : "bg-surface-secondary border-slate-200 text-content-tertiary";
                  return <div key={day} className={cn("aspect-square rounded border p-2", tone)}><div className="font-bold">D{day}</div><div className="mt-1 text-[10px]">{day <= 4 ? "정상" : day === 5 ? "지각" : "주말"}</div></div>;
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none"><CardHeader><CardTitle>근태 액션</CardTitle></CardHeader><CardContent className="space-y-2"><PrimaryActionRow screen={screen} role={role} openDialog={openDialog} notify={notify} /></CardContent></Card>
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function PayrollManagementScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  // admin-pando payroll 시각 차용: 직급별 정책 + 확정 워크플로
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="당월 미확정 → 확정 → 명세서" />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>급여 테이블</CardTitle><CardDescription>기본급 · 수당 · 공제 · 수수료 · 실지급액 · 확정 상태</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">{screen.tabs.map((t) => <Button key={t} size="sm" variant="outline" onClick={() => notify(`${t} 탭`, "info")}>{t}</Button>)}</div>
              <FilterChips filters={screen.filters} notify={notify} />
              <Table>
                <TableHeader><TableRow>{screen.tableColumns.map((c) => <TableHead key={c}>{c}</TableHead>)}</TableRow></TableHeader>
                <TableBody>{screen.rows.map((row, idx) => (
                  <TableRow key={idx}>{screen.tableColumns.map((c) => <TableCell key={c}>{statusAwareValue(String(row[c] ?? "-"))}</TableCell>)}</TableRow>
                ))}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>급여 액션</CardTitle><CardDescription>편집 → 확정 → 명세서</CardDescription></CardHeader>
            <CardContent className="space-y-2"><PrimaryActionRow screen={screen} role={role} openDialog={openDialog} notify={notify} /></CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader><CardTitle>직급별 정책 (참고)</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs">
              {[{ 직군: "FC", 방식: "정률 + 매출커미션" }, { 직군: "PT", 방식: "건별 + 수업료" }, { 직군: "GX", 방식: "시급 + 수업료" }, { 직군: "공통", 방식: "고정급" }].map((p) => (
                <div key={p.직군} className="flex items-center justify-between rounded-lg border bg-white px-2 py-1.5"><b>{p.직군}</b><span className="text-content-tertiary">{p.방식}</span></div>
              ))}
            </CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

// ---- D08 마케팅 ----

function LeadManagementScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  // admin-pando (marketing)/leads 시각 차용: 칸반 뷰 + 목록 뷰 전환
  const [viewMode, setViewMode] = useState<"칸반" | "목록">("칸반");
  const stages = ["신규", "연락완료", "상담예정", "방문완료", "등록완료", "보류"];
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="잠재 고객 상담 단계 추적" />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between"><CardTitle>리드 관리 ({viewMode} 뷰)</CardTitle>
                <div className="flex gap-1">{(["칸반", "목록"] as const).map((v) => <Button key={v} size="sm" variant={viewMode === v ? "default" : "outline"} onClick={() => setViewMode(v)}>{v}</Button>)}</div>
              </div>
              <CardDescription>상담 단계 7종 · 문의 유형 · 가입경로 추적</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <FilterChips filters={screen.filters} notify={notify} />
              {viewMode === "칸반" ? (
                <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
                  {stages.map((stage, sidx) => (
                    <div key={stage} className="rounded-lg border bg-surface-secondary p-2">
                      <div className="mb-2 flex items-center justify-between text-xs font-semibold"><span>{stage}</span><Badge variant="secondary">{[28, 32, 18, 12, 62, 16][sidx]}</Badge></div>
                      <div className="space-y-2">
                        {screen.rows.filter((_, i) => i % stages.length === sidx % screen.rows.length).slice(0, 1).map((row, idx) => (
                          <div key={idx} className="rounded border bg-white p-2 text-xs">
                            <div className="font-semibold">{row["이름"]}</div>
                            <div className="text-content-tertiary">{row["문의 유형"]}</div>
                            <div className="mt-1 text-[10px] text-content-tertiary">{row["담당 FC"]}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader><TableRow>{screen.tableColumns.map((c) => <TableHead key={c}>{c}</TableHead>)}</TableRow></TableHeader>
                  <TableBody>{screen.rows.map((row, idx) => (
                    <TableRow key={idx}>{screen.tableColumns.map((c) => <TableCell key={c}>{statusAwareValue(String(row[c] ?? "-"))}</TableCell>)}</TableRow>
                  ))}</TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none"><CardHeader><CardTitle>리드 액션</CardTitle></CardHeader><CardContent><PrimaryActionRow screen={screen} role={role} openDialog={openDialog} notify={notify} /></CardContent></Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
          <FrontStateNote screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function MessageDispatchScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="Push · 카카오톡 · SMS 통합" />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>발송 이력</CardTitle><CardDescription>채널별 성공/실패</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <FilterChips filters={screen.filters} notify={notify} />
              <Table>
                <TableHeader><TableRow>{screen.tableColumns.map((c) => <TableHead key={c}>{c}</TableHead>)}</TableRow></TableHeader>
                <TableBody>{screen.rows.map((row, idx) => (
                  <TableRow key={idx}>{screen.tableColumns.map((c) => <TableCell key={c}>{statusAwareValue(String(row[c] ?? "-"))}</TableCell>)}</TableRow>
                ))}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none"><CardHeader><CardTitle>발송 액션</CardTitle></CardHeader><CardContent><PrimaryActionRow screen={screen} role={role} openDialog={openDialog} notify={notify} /></CardContent></Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function CouponManagementScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="할인 쿠폰 발급/사용률 통계" />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>쿠폰 목록</CardTitle><CardDescription>발급/사용 비율 · 사용률 막대</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <FilterChips filters={screen.filters} notify={notify} />
              <div className="grid gap-2">
                {screen.rows.map((row, idx) => {
                  const usage = Number(String(row["사용률"] ?? "0").replace("%", "")) || 0;
                  return (
                    <div key={idx} className="rounded-xl border bg-white p-3">
                      <div className="flex items-center justify-between text-sm">
                        <div><b>{row["쿠폰명"]}</b> <span className="text-xs text-content-tertiary">{row["할인 유형"]} · {row["할인 금액/할인율"]}</span></div>
                        {statusAwareValue(String(row["상태"] ?? "-"))}
                      </div>
                      <div className="mt-1 text-xs text-content-tertiary">유효: {row["유효 기간"]}</div>
                      <div className="mt-2 flex items-center gap-3 text-xs">
                        <span>발급 {row["발급 수"]}</span><span>사용 {row["사용 수"]}</span><span className="font-bold text-blue-700">{usage}%</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded bg-surface-tertiary"><div className="h-full bg-emerald-500" style={{ width: `${usage}%` }} /></div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none"><CardHeader><CardTitle>쿠폰 액션</CardTitle></CardHeader><CardContent><PrimaryActionRow screen={screen} role={role} openDialog={openDialog} notify={notify} /></CardContent></Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function ReferralProgramScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="V2 신규 · 추천 이벤트" />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>리퍼럴 이벤트</CardTitle><CardDescription>추천인·피추천인 혜택 · 기간 · 그레이스</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <FilterChips filters={screen.filters} notify={notify} />
              <Table>
                <TableHeader><TableRow>{screen.tableColumns.map((c) => <TableHead key={c}>{c}</TableHead>)}</TableRow></TableHeader>
                <TableBody>{screen.rows.map((row, idx) => (
                  <TableRow key={idx}>{screen.tableColumns.map((c) => <TableCell key={c}>{statusAwareValue(String(row[c] ?? "-"))}</TableCell>)}</TableRow>
                ))}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none"><CardHeader><CardTitle>리퍼럴 액션</CardTitle></CardHeader><CardContent><PrimaryActionRow screen={screen} role={role} openDialog={openDialog} notify={notify} /></CardContent></Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

// ---- D09 설정 ----

function NoticesScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  // V2 신규: 공지사항
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="V2 신규 · 게시 대상/기간" />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>공지 목록</CardTitle><CardDescription>전체/게시 중/예정/종료</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">{screen.tabs.map((t) => <Button key={t} size="sm" variant="outline" onClick={() => notify(`${t} 탭`, "info")}>{t}</Button>)}</div>
              <FilterChips filters={screen.filters} notify={notify} />
              <Table>
                <TableHeader><TableRow>{screen.tableColumns.map((c) => <TableHead key={c}>{c}</TableHead>)}</TableRow></TableHeader>
                <TableBody>{screen.rows.map((row, idx) => (
                  <TableRow key={idx}>{screen.tableColumns.map((c) => <TableCell key={c}>{statusAwareValue(String(row[c] ?? "-"))}</TableCell>)}</TableRow>
                ))}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none"><CardHeader><CardTitle>공지 액션</CardTitle></CardHeader><CardContent><PrimaryActionRow screen={screen} role={role} openDialog={openDialog} notify={notify} /></CardContent></Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

// ---- D10 본사관리 ----

function BranchDashboardScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  // V2 신규: admin-pando (dashboard)/page.tsx 시각 차용
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="V2 신규 · 지점 운영 메인" />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>최근 활동 (감사 로그)</CardTitle><CardDescription>발생 시각 · 작업자 · 작업 유형 · 대상</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <Tabs defaultValue={screen.tabs[0]}>
                <TabsList>{screen.tabs.map((t) => <TabsTrigger key={t} value={t}>{t}</TabsTrigger>)}</TabsList>
              </Tabs>
              <FilterChips filters={screen.filters} notify={notify} />
              <Table>
                <TableHeader><TableRow>{screen.tableColumns.map((c) => <TableHead key={c}>{c}</TableHead>)}</TableRow></TableHeader>
                <TableBody>{screen.rows.map((row, idx) => (
                  <TableRow key={idx}>{screen.tableColumns.map((c) => <TableCell key={c}>{statusAwareValue(String(row[c] ?? "-"))}</TableCell>)}</TableRow>
                ))}</TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader><CardTitle>주의 대상 위젯 (참고)</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[{ name: "만료 step", count: 24, tone: "bg-amber-50 border-amber-200 text-amber-700" }, { name: "생일", count: 8, tone: "bg-pink-50 border-pink-200 text-pink-700" }, { name: "미수금", count: 12, tone: "bg-rose-50 border-rose-200 text-rose-700" }, { name: "홀딩", count: 6, tone: "bg-violet-50 border-violet-200 text-violet-700" }].map((item) => (
                  <div key={item.name} className={cn("rounded-xl border p-3", item.tone)}><div className="font-bold">{item.count}</div><div className="text-[11px]">{item.name}</div></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none"><CardHeader><CardTitle>대시보드 액션</CardTitle></CardHeader><CardContent><PrimaryActionRow screen={screen} role={role} openDialog={openDialog} notify={notify} /></CardContent></Card>
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function KpiDashboardScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  // admin-pando kpi 시각 차용: 24종 KPI 카드 + 차트 영역 (SVG 막대)
  const kpiCards = [
    { label: "매출 달성률", value: "82%", target: 100, color: "bg-blue-500" },
    { label: "신규 회원 달성률", value: "68%", target: 100, color: "bg-emerald-500" },
    { label: "출석률 달성률", value: "91%", target: 100, color: "bg-violet-500" },
    { label: "유지율 달성률", value: "76%", target: 100, color: "bg-amber-500" },
    { label: "재등록률", value: "62%", target: 80, color: "bg-rose-500" },
    { label: "GX 가입률", value: "54%", target: 70, color: "bg-cyan-500" },
    { label: "OT 1차 완료", value: "84%", target: 95, color: "bg-pink-500" },
    { label: "OT 2차 완료", value: "62%", target: 80, color: "bg-indigo-500" }
  ];
  const branchBars = [
    { 지점: "강남점", 매출: 92, 회원: 78, 출석: 88 },
    { 지점: "서초점", 매출: 76, 회원: 82, 출석: 91 },
    { 지점: "잠실점", 매출: 64, 회원: 58, 출석: 72 }
  ];
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="24종 KPI · 목표 대비 실적" />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>KPI 카드 (24종 중 8종 미리보기)</CardTitle><CardDescription>달성률 비교 막대 · 목표 대비 실적</CardDescription></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {kpiCards.map((kpi) => {
                  const pct = Number(kpi.value.replace("%", ""));
                  return (
                    <div key={kpi.label} className="rounded-xl border bg-white p-3">
                      <div className="text-xs text-content-tertiary">{kpi.label}</div>
                      <div className="mt-1 text-2xl font-bold">{kpi.value}</div>
                      <div className="mt-2 h-2 overflow-hidden rounded bg-surface-tertiary"><div className={cn("h-full", kpi.color)} style={{ width: `${pct}%` }} /></div>
                      <div className="mt-1 text-[10px] text-content-tertiary">목표 {kpi.target}%</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader><CardTitle>지점별 비교 차트 (SVG)</CardTitle><CardDescription>매출 · 회원 · 출석 달성률</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {branchBars.map((b) => (
                  <div key={b.지점} className="rounded-lg border bg-white p-3">
                    <div className="mb-2 font-semibold text-sm">{b.지점}</div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center gap-2"><span className="w-12 text-content-tertiary">매출</span><div className="h-3 flex-1 overflow-hidden rounded bg-surface-tertiary"><div className="h-full bg-blue-500" style={{ width: `${b.매출}%` }} /></div><span className="w-10 text-right font-semibold">{b.매출}%</span></div>
                      <div className="flex items-center gap-2"><span className="w-12 text-content-tertiary">회원</span><div className="h-3 flex-1 overflow-hidden rounded bg-surface-tertiary"><div className="h-full bg-emerald-500" style={{ width: `${b.회원}%` }} /></div><span className="w-10 text-right font-semibold">{b.회원}%</span></div>
                      <div className="flex items-center gap-2"><span className="w-12 text-content-tertiary">출석</span><div className="h-3 flex-1 overflow-hidden rounded bg-surface-tertiary"><div className="h-full bg-violet-500" style={{ width: `${b.출석}%` }} /></div><span className="w-10 text-right font-semibold">{b.출석}%</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>KPI 액션</CardTitle></CardHeader>
            <CardContent className="space-y-2"><PrimaryActionRow screen={screen} role={role} openDialog={openDialog} notify={notify} /></CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader><CardTitle>탭 (5종)</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs">
              {screen.tabs.map((t) => (
                <div key={t} className="flex items-center justify-between rounded-lg border bg-white px-2 py-1.5"><b>{t}</b><Badge variant="secondary">{["8", "6", "4", "4", "2"][screen.tabs.indexOf(t)] ?? "—"}개</Badge></div>
              ))}
            </CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function NpsSurveyScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  // V2 신규: NPS 점수 분포 시각화
  const distribution = { 추천자: 58, 중립: 28, 비추천: 14 };
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="V2 신규 · NPS 분석" />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>응답 분포</CardTitle><CardDescription>추천자(9-10) · 중립(7-8) · 비추천(0-6)</CardDescription></CardHeader>
            <CardContent>
              <div className="flex h-8 overflow-hidden rounded-lg border">
                <div className="grid place-items-center text-xs font-bold text-white bg-emerald-500" style={{ width: `${distribution.추천자}%` }}>{distribution.추천자}%</div>
                <div className="grid place-items-center text-xs font-bold text-white bg-amber-500" style={{ width: `${distribution.중립}%` }}>{distribution.중립}%</div>
                <div className="grid place-items-center text-xs font-bold text-white bg-rose-500" style={{ width: `${distribution.비추천}%` }}>{distribution.비추천}%</div>
              </div>
              <div className="mt-2 flex justify-between text-xs text-content-tertiary">
                <span>추천자 (Promoters)</span><span>중립 (Passives)</span><span>비추천 (Detractors)</span>
              </div>
              <div className="mt-4 rounded-xl border bg-surface-secondary p-3 text-sm">
                <div className="text-content-tertiary text-xs">NPS Score</div>
                <div className="mt-1 text-3xl font-bold text-blue-700">+{distribution.추천자 - distribution.비추천}</div>
                <div className="text-xs text-content-tertiary">추천자 % − 비추천 %</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader><CardTitle>응답 목록</CardTitle></CardHeader>
            <CardContent>
              <FilterChips filters={screen.filters} notify={notify} />
              <Table className="mt-3">
                <TableHeader><TableRow><TableHead>응답일</TableHead><TableHead>점수</TableHead><TableHead>분류</TableHead><TableHead>회원</TableHead><TableHead>자유 의견</TableHead></TableRow></TableHeader>
                <TableBody>
                  {[
                    { 응답일: "오늘", 점수: "10", 분류: "추천자", 회원: "김민준", 의견: "트레이너 친절·시설 청결" },
                    { 응답일: "어제", 점수: "7", 분류: "중립", 회원: "박서연", 의견: "GX 시간 다양해지면 좋겠음" },
                    { 응답일: "2일 전", 점수: "4", 분류: "비추천", 회원: "오지우", 의견: "락커 부족 + 대기 시간 길음" }
                  ].map((r, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{r.응답일}</TableCell>
                      <TableCell><b>{r.점수}</b></TableCell>
                      <TableCell>{statusAwareValue(r.분류)}</TableCell>
                      <TableCell>{r.회원}</TableCell>
                      <TableCell className="text-xs">{r.의견}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none"><CardHeader><CardTitle>NPS 액션</CardTitle></CardHeader><CardContent><PrimaryActionRow screen={screen} role={role} openDialog={openDialog} notify={notify} /></CardContent></Card>
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

// ---- D11 통합운영 ----

function UnifiedAttendanceScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="회원·직원 출석 통합 콘솔" />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>출석 테이블</CardTitle><CardDescription>키오스크 QR · 얼굴 인식 · 앱 QR · 수동 통합</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <Tabs defaultValue={screen.tabs[0]}>
                <TabsList>{screen.tabs.map((t) => <TabsTrigger key={t} value={t}>{t}</TabsTrigger>)}</TabsList>
              </Tabs>
              <FilterChips filters={screen.filters} notify={notify} />
              <Table>
                <TableHeader><TableRow>{screen.tableColumns.map((c) => <TableHead key={c}>{c}</TableHead>)}</TableRow></TableHeader>
                <TableBody>{screen.rows.length ? screen.rows.map((row, idx) => (
                  <TableRow key={idx}>{screen.tableColumns.map((c) => <TableCell key={c}>{statusAwareValue(String(row[c] ?? "-"))}</TableCell>)}</TableRow>
                )) : <TableRow><TableCell colSpan={screen.tableColumns.length} className="text-center text-xs text-content-tertiary">출석 이벤트가 없습니다 (mock empty state)</TableCell></TableRow>}</TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader><CardTitle>채널 별 실시간 카드</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {[{ name: "앱 QR", count: 42, tone: "bg-blue-50 border-blue-200 text-blue-700" }, { name: "키오스크 QR", count: 28, tone: "bg-emerald-50 border-emerald-200 text-emerald-700" }, { name: "얼굴 인식", count: 18, tone: "bg-violet-50 border-violet-200 text-violet-700" }, { name: "수동", count: 3, tone: "bg-amber-50 border-amber-200 text-amber-700" }].map((item) => (
                  <div key={item.name} className={cn("rounded-xl border p-3 text-center", item.tone)}><div className="text-2xl font-bold">{item.count}</div><div className="text-xs">{item.name}</div></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none"><CardHeader><CardTitle>출석 액션</CardTitle></CardHeader><CardContent><PrimaryActionRow screen={screen} role={role} openDialog={openDialog} notify={notify} /></CardContent></Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
          <FrontStateNote screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function ClothingLockerScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  // 옷 락커 그리드 mock
  const lockers = Array.from({ length: 30 }).map((_, i) => {
    const num = String(i + 1).padStart(3, "0");
    const states = ["빈", "사용 중", "사용 중", "사용 중", "만료 임박", "빈", "점검 중"];
    return { 락커: num, 상태: states[i % states.length] };
  });
  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="출석 연동 옷 락커 실시간" />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>락커 그리드</CardTitle><CardDescription>당일용 옷 락커 · 50건 초과 chunked 일괄 처리 (V2)</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <FilterChips filters={screen.filters} notify={notify} />
              <div className="grid grid-cols-6 md:grid-cols-10 gap-1.5">
                {lockers.map((box) => {
                  const tone = box.상태 === "사용 중" ? "border-blue-300 bg-blue-50 text-blue-700"
                    : box.상태 === "빈" ? "border-slate-200 bg-white text-content-tertiary"
                    : box.상태 === "만료 임박" ? "border-amber-300 bg-amber-50 text-amber-700"
                    : "border-rose-200 bg-rose-50 text-rose-700";
                  return (
                    <button key={box.락커} type="button" onClick={() => openDialog("DLG-I002")} className={cn("aspect-square rounded border p-1 text-center text-[10px] font-semibold transition hover:-translate-y-0.5", tone)}>
                      <div>{box.락커}</div><div className="text-[9px] opacity-75">{box.상태[0]}</div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle>미배정 회원 패널</CardTitle><CardDescription>출석 완료 · 락커 미배정</CardDescription></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {[
                { 회원: "김민준", 출석: "10:24", 상품: "PT 20회" },
                { 회원: "박서연", 출석: "11:02", 상품: "회원권 3개월" },
                { 회원: "정하준", 출석: "11:05", 상품: "GX 요가" }
              ].map((m, idx) => (
                <div key={idx} className="rounded-lg border bg-white p-2">
                  <div className="flex items-center justify-between"><b>{m.회원}</b><Badge variant="warning">미배정</Badge></div>
                  <div className="mt-1 text-xs text-content-tertiary">{m.출석} · {m.상품}</div>
                  <Button size="sm" className="mt-2 w-full" onClick={() => openDialog("DLG-I002")}>배정</Button>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="shadow-none"><CardHeader><CardTitle>락커 액션</CardTitle></CardHeader><CardContent><PrimaryActionRow screen={screen} role={role} openDialog={openDialog} notify={notify} /></CardContent></Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

export const implementedDialogIds = dialogs.map((dialog) => dialog.id);
export const implementedScreenIds = screens.map((screen) => screen.id);
