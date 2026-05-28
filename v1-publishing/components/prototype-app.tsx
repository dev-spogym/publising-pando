"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { AlertTriangle, Bell, Building2, CheckCircle2, ChevronRight, ClipboardCheck, Lock, LogOut, Menu, Search, ShieldCheck, UserRound } from "lucide-react";
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
import { branches, dialogById, dialogs, hasPermission, menuGroups, roleById, roles, screens, type DialogDefinition, type RoleId, type ScreenDefinition } from "@/app/data/registry";
import { getDialogContract, getScreenContract } from "@/app/data/contracts";
import { cn } from "@/app/lib/utils";

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
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <div className="grid min-h-screen grid-cols-[280px_1fr]">
        <Sidebar currentRoute={screen.route} role={role} />
        <div className="min-w-0">
          <Topbar role={role} branch={branch} setRole={setRole} setBranch={setBranch} openDialog={openDialog} notify={notify} />
          <main className="p-6">
            <AdminScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />
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
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_35%),linear-gradient(135deg,#0f172a,#1e3a8a)] p-8 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl grid-cols-[1fr_460px] items-center gap-10">
        <section>
          <Badge variant="info" className="border-blue-300 bg-white/10 text-blue-50">SCR-100 · AUTH-01</Badge>
          <h1 className="mt-5 text-5xl font-bold tracking-tight">Pando CRM Admin V1</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-50/85">직원 1명 = 로그인 계정 1개 원칙을 반영한 정적 프로토타입입니다. 역할을 선택하면 동일 화면도 권한·액션·지점 범위가 다르게 표시됩니다.</p>
          <div className="mt-8 grid max-w-3xl grid-cols-3 gap-3">
            {["API 없음", "Mock 데이터", "Next + shadcn/ui"].map((item) => <div key={item} className="rounded-xl border border-white/15 bg-white/10 p-4 text-sm font-semibold">{item}</div>)}
          </div>
        </section>
        <Card className="border-white/20 bg-white text-slate-950 shadow-2xl">
          <CardHeader>
            <CardTitle>직원 로그인</CardTitle>
            <CardDescription>검수용으로 역할과 지점을 선택한 뒤 진입합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>지점 선택</Label><BranchSelect branch={branch} setBranch={setBranch} /></div>
            <div className="space-y-2"><Label>역할 선택</Label><RoleSelect role={role} setRole={setRole} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>로그인 ID</Label><Input defaultValue="owner.gangnam" /></div>
              <div className="space-y-2"><Label>비밀번호</Label><Input type="password" defaultValue="password" /></div>
            </div>
            <div className="rounded-lg border bg-slate-50 p-3 text-sm text-slate-600"><b className="text-slate-950">{roleInfo.label}</b> · {roleInfo.branchScope}<br />{roleInfo.description}</div>
            <Button className="w-full" size="lg" onClick={() => { notify("mock 로그인 완료: 회원 목록으로 이동합니다."); router.push("/members"); }}>로그인</Button>
            <Button data-dialog-id="DLG-000" variant="outline" className="w-full" onClick={() => openDialog("DLG-000")}>DLG-000 세션 만료 모달 보기</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Sidebar({ currentRoute, role }: { currentRoute: string; role: RoleId }) {
  const roleInfo = roleById.get(role)!;
  return (
    <aside className="sticky top-0 h-screen overflow-y-auto border-r bg-slate-950 px-4 py-5 text-white no-scrollbar">
      <div className="flex items-center gap-3 px-2">
        <div className="grid size-10 place-items-center rounded-xl bg-blue-500 font-bold">P</div>
        <div><div className="font-bold">Pando Admin</div><div className="text-xs text-slate-400">docs4/V1 D01~D11</div></div>
      </div>
      <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-300">
        <div className="flex items-center gap-2 font-semibold text-white"><ShieldCheck className="size-4" /> {roleInfo.label}</div>
        <p className="mt-2 leading-5">{roleInfo.description}</p>
      </div>
      <nav className="mt-6 space-y-6">
        {menuGroups.map((group) => (
          <div key={group.label}>
            <div className="px-2 text-xs font-bold uppercase tracking-wider text-slate-500">{group.label}</div>
            <div className="mt-2 space-y-1">
              {group.items.map((item) => (
                <Link key={item.id} href={item.route} className={cn("flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white", currentRoute === item.route && "bg-blue-500 text-white")}>
                  <span className="truncate">{item.title}</span><span className="text-[10px] opacity-70">{item.id.replace("SCR-", "")}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

function Topbar({ role, branch, setRole, setBranch, openDialog, notify }: { role: RoleId; branch: string; setRole: (role: RoleId) => void; setBranch: (branch: string) => void; openDialog: (id: string) => void; notify: (message: string, tone?: "success" | "warning" | "info") => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white/95 px-6 backdrop-blur">
      <div className="flex items-center gap-3 text-sm text-slate-600"><Menu className="size-5" /><span>V1 정적 Admin 프로토타입</span><ChevronRight className="size-4" /><b className="text-slate-950">API/DB/외부연동 없음</b></div>
      <div className="flex items-center gap-2">
        <BranchSelect branch={branch} setBranch={setBranch} compact />
        <RoleSelect role={role} setRole={setRole} compact />
        <Button variant="outline" size="sm" onClick={() => openDialog("DLG-000")}><Lock className="size-4" /> 세션</Button>
        <Button variant="outline" size="sm" onClick={() => notify("알림 14건을 확인했습니다.", "info")} asChild><Link href="/notifications"><Bell className="size-4" /> 알림 <Badge variant="destructive">14</Badge></Link></Button>
        <Button variant="ghost" size="sm" asChild><Link href="/login"><LogOut className="size-4" /> 로그아웃</Link></Button>
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
  if (screen.id === "SCR-M001") return <MemberListScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-M002") return <MemberRegistrationScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-M004") return <MemberDetailScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-S001") return <SalesOverviewScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-S002") return <PosSalesScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;
  if (screen.id === "SCR-S003") return <PaymentProcessingScreen screen={screen} role={role} branch={branch} openDialog={openDialog} notify={notify} />;

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2"><Badge variant="info">{screen.id}</Badge><Badge variant="outline">{screen.feature}</Badge>{screen.policyPending && <Badge variant="warning">정책 확인 필요</Badge>}<Badge variant="secondary">{screen.source}</Badge><Badge variant={contract.handoffStatus === "production-ready" ? "success" : contract.handoffStatus === "template-ready" ? "info" : "warning"}>{contract.handoffStatus}</Badge></div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight">{screen.title}</h1>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{screen.purpose}</p>
          </div>
          <div className="min-w-72 rounded-xl border bg-slate-50 p-3 text-sm">
            <div className="flex items-center gap-2 font-semibold"><UserRound className="size-4" /> {roleInfo.label}</div>
            <div className="mt-1 text-slate-600"><Building2 className="mr-1 inline size-4" /> {branch} · {roleInfo.branchScope}</div>
            <p className="mt-2 text-xs leading-5 text-slate-500">{screen.roleNotes[role] ?? roleInfo.description}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-4 gap-3">
        {screen.metrics.map((metric) => (
          <button key={metric.label} type="button" onClick={() => { setSelectedMetric(metric.label); notify(`${metric.label} 지표 필터 mock 적용`, "info"); }} className={cn("text-left transition hover:-translate-y-0.5", selectedMetric === metric.label && "ring-2 ring-blue-400 rounded-xl")}><Card className="h-full shadow-none"><CardHeader className="pb-2"><CardDescription>{metric.label}</CardDescription><CardTitle className="text-xl">{metric.value}</CardTitle></CardHeader><CardContent><p className="text-xs text-slate-500">{metric.hint}</p></CardContent></Card></button>
        ))}
        {screen.metrics.length === 0 && <Card className="col-span-4"><CardContent className="pt-5 text-sm text-slate-600">로그인 화면은 별도 폼 중심으로 구성됩니다.</CardContent></Card>}
      </section>

      <section className="grid grid-cols-[1fr_320px] gap-5">
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
        <aside className="space-y-5">
          <Card className="shadow-none">
            <CardHeader><CardTitle>연결 DLG</CardTitle><CardDescription>화면에서 열리는 모달/다이얼로그</CardDescription></CardHeader>
            <CardContent className="space-y-2">
              {screenDialogs.map((dialog) => {
                const allowed = hasPermission(role, dialog.requiredPermission);
                return <Button key={dialog.id} data-dialog-id={dialog.id} variant="outline" className="w-full justify-between" onClick={() => openDialog(dialog.id)}><span>{dialog.id}</span><span className="truncate">{dialog.title}</span>{!allowed && <Lock className="size-3" />}</Button>;
              })}
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader><CardTitle>개발 핸드오프 계약</CardTitle><CardDescription>개발사가 API/상태관리를 연결할 때 쓰는 mock contract입니다.</CardDescription></CardHeader>
            <CardContent className="space-y-3 text-xs text-slate-600">
              <div><b className="text-slate-950">API</b>: <code>{contract.apiContracts[0]?.method} {contract.apiContracts[0]?.endpoint}</code></div>
              <div><b className="text-slate-950">상태</b>: {contract.stateMatrix.slice(0, 4).join(" · ")}</div>
              <div><b className="text-slate-950">액션 ID</b>: {contract.actionContracts.slice(0, 3).map((action) => action.actionId).join(" / ") || "none"}</div>
              <div className="rounded-lg bg-slate-50 p-2">모든 버튼은 mock toast, modal open, role-blocked feedback 중 하나를 실행합니다.</div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader><CardTitle>범위 검증</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600">
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
      <CardContent className="space-y-2 text-xs text-slate-600">
        <div><b className="text-slate-950">API</b>: <code>{contract.apiContracts[0]?.method} {contract.apiContracts[0]?.endpoint}</code></div>
        <div><b className="text-slate-950">상태</b>: {contract.stateMatrix.slice(0, 5).join(" · ")}</div>
        <div><b className="text-slate-950">액션</b>: {contract.actionContracts.slice(0, 4).map((action) => action.actionId).join(" / ") || "조회 전용"}</div>
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
          <Button key={dialog.id} data-dialog-id={dialog.id} variant="outline" className="justify-between" onClick={() => openDialog(dialog.id)}><span>{dialog.id}</span><span className="truncate">{dialog.title}</span></Button>
        ))}
      </CardContent>
    </Card>
  );
}

function DeliveryHeader({ screen, role, branch, titleSuffix }: { screen: ScreenDefinition; role: RoleId; branch: string; titleSuffix?: string }) {
  const roleInfo = roleById.get(role)!;
  const status = getScreenContract(screen).handoffStatus;
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2"><Badge variant="info">{screen.id}</Badge><Badge variant="outline">{screen.feature}</Badge><Badge variant={status === "production-ready" ? "success" : status === "template-ready" ? "info" : "warning"}>{status}</Badge><Badge variant="secondary">{screen.source}</Badge></div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight">{screen.title}{titleSuffix ? ` · ${titleSuffix}` : ""}</h1>
          <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-600">{screen.purpose}</p>
        </div>
        <div className="min-w-72 rounded-xl border bg-slate-50 p-3 text-sm">
          <div className="flex items-center gap-2 font-semibold"><UserRound className="size-4" /> {roleInfo.label}</div>
          <div className="mt-1 text-slate-600"><Building2 className="mr-1 inline size-4" /> {branch} · {roleInfo.branchScope}</div>
          <p className="mt-2 text-xs leading-5 text-slate-500">{screen.roleNotes[role] ?? roleInfo.description}</p>
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
      <div className="grid grid-cols-[1fr_320px] gap-5">
        <Card className="shadow-none">
          <CardHeader><CardTitle>상단 알림 아이콘 클릭 후 열리는 알림 센터</CardTitle><CardDescription>문서 기준: 문맥 바로가기, 읽음 처리, 권한별 삭제 액션을 포함합니다.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {["회원 목록", "메시지 발송", "전자계약", "출석 관리"].map((item) => <Button key={item} variant="outline" onClick={() => notify(`${item} 바로가기 mock 이동`, "info")}>{item}</Button>)}
            </div>
            <div className="divide-y rounded-xl border">
              {notifications.map((item) => <button key={item.text} type="button" className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-50" onClick={() => notify(`${item.type} 알림 읽음 처리 + ${item.target} 이동 mock`, "info")}><span><Badge variant={readAll ? "secondary" : "warning"}>{readAll ? "읽음" : "미읽음"}</Badge><span className="ml-3 font-medium">{item.text}</span></span><span className="text-xs text-slate-500">{item.time}</span></button>)}
            </div>
          </CardContent>
        </Card>
        <aside className="space-y-5">
          <Card className="shadow-none"><CardHeader><CardTitle>관리 액션</CardTitle></CardHeader><CardContent className="space-y-2"><Button className="w-full" onClick={() => { setReadAll(true); notify("전체 읽음 처리되었습니다."); }}>전체 읽음</Button><Button className="w-full" variant={canDeleteAll ? "destructive" : "outline"} onClick={() => notify(canDeleteAll ? "전체 삭제 mock 완료" : "현재 역할은 전체 삭제 권한이 없습니다.", canDeleteAll ? "success" : "warning")}>전체 삭제</Button><Button className="w-full" variant="outline" onClick={() => notify("알림 설정 화면 이동 mock", "info")}>알림 설정</Button></CardContent></Card>
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
        {screen.metrics.map((metric) => <button key={metric.label} type="button" className="text-left" onClick={() => { setFocus(metric.label); notify(`${metric.label} 지표 필터 mock 적용`, "info"); }}><Card className={cn("h-full shadow-none", focus === metric.label && "ring-2 ring-blue-400")}><CardHeader><CardDescription>{metric.label}</CardDescription><CardTitle className="text-2xl">{metric.value}</CardTitle></CardHeader><CardContent><p className="text-xs text-slate-500">{metric.hint}</p></CardContent></Card></button>)}
      </div>
      <div className="grid grid-cols-[1fr_360px] gap-5">
        <div className="space-y-5">
          <Card className="shadow-none"><CardHeader><CardTitle>운영 포커스 바</CardTitle><CardDescription>지금 바로 봐야 할 회원군을 문서 기준으로 분리했습니다.</CardDescription></CardHeader><CardContent className="grid grid-cols-3 gap-3">{["재등록 집중 보기", "30일 미방문", "관심회원 보기"].map((item) => <button key={item} className={cn("rounded-xl border p-4 text-left hover:bg-slate-50", focus === item && "border-blue-400 bg-blue-50")} onClick={() => { setFocus(item); notify(`${item} 저장뷰 적용`, "info"); }}><div className="font-semibold">{item}</div><div className="mt-1 text-xs text-slate-500">HQ-09/세그먼트 기준 mock</div></button>)}</CardContent></Card>
          <Card className="shadow-none"><CardHeader><CardTitle>회원 목록 / 저장 뷰 / 상태 필터</CardTitle><CardDescription>선택 시 하단 일괄 작업 바와 우측 상세 패널이 함께 반응합니다.</CardDescription></CardHeader><CardContent className="space-y-4"><Tabs defaultValue="회원 목록" onValueChange={(value) => notify(`${value} 운영 보기 전환`, "info")}><TabsList>{["회원 목록", "회원권 목록", "수강권 목록", "락커 목록", "운동복 목록"].map((tab) => <TabsTrigger key={tab} value={tab}>{tab}</TabsTrigger>)}</TabsList><TabsContent value="회원 목록"><div className="flex flex-wrap gap-2 py-3">{["상담내역", "상담예약", "재등록대상", "고객관리"].map((tab) => <Button key={tab} variant="outline" size="sm" onClick={() => notify(`${tab} 저장뷰 적용`, "info")}>{tab}</Button>)}</div><div className="flex flex-wrap gap-2">{["전체", "활성", "만료", "예정", "임박", "홀딩", "미등록", "탈퇴"].map((status) => <Button key={status} aria-label={status} variant={focus === status ? "default" : "outline"} size="sm" onClick={() => { setFocus(status); notify(`${status} 필터 chip mock 적용`, "info"); }}>{status}<Badge variant="secondary">{status === "전체" ? rows.length : memberDirectoryRows.filter((row) => row.status === status).length}</Badge></Button>)}</div><div className="mt-3 flex flex-wrap items-center gap-2"><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="이름·연락처·상품명 통합 검색" className="max-w-sm" /><Button variant="outline" onClick={() => { setQuery(""); setSelected([]); notify("필터와 선택 행을 초기화했습니다.", "info"); }}>전체 해제</Button><Button variant="outline" onClick={() => notify(`${selected.length}개 행으로 일괄 작업 bar mock 표시`, "info")}>선택 작업</Button><Button asChild><Link href="/members/new">회원 추가</Link></Button></div><div className="mt-3 overflow-hidden rounded-xl border"><Table><TableHeader><TableRow>{["선택", "No", "상태", "회원명", "성별", "생년월일", "나이", "연락처", "보유 이용권", "소속 지점", "마지막 방문일", "등록일", "OPEN"].map((column) => <TableHead key={column}>{column}</TableHead>)}</TableRow></TableHeader><TableBody>{rows.map((row) => <TableRow key={row.no}><TableCell><Button size="sm" variant={selected.includes(row.no) ? "default" : "outline"} onClick={() => toggleSelected(row.no)}>{selected.includes(row.no) ? "선택됨" : "선택"}</Button></TableCell><TableCell>{row.no}</TableCell><TableCell>{statusAwareValue(row.status)}</TableCell><TableCell className="font-semibold">{row.name}</TableCell><TableCell>{row.gender}</TableCell><TableCell>{row.birth}</TableCell><TableCell>{row.age}</TableCell><TableCell>{row.phone}</TableCell><TableCell>{row.pass}</TableCell><TableCell>{row.branch}</TableCell><TableCell>{row.visit}</TableCell><TableCell>{row.registered}</TableCell><TableCell><Button size="sm" variant="ghost" onClick={() => { setDetail(row); notify(`${row.name} 우측 상세 패널 열림`, "info"); }}>상세</Button></TableCell></TableRow>)}</TableBody></Table></div><div className="mt-3 flex items-center justify-between rounded-xl border bg-slate-50 px-4 py-3 text-sm"><span>1-{rows.length} of {rows.length} · 선택 {selected.length}</span><div className="flex gap-2"><Button variant="outline" size="sm" disabled>이전</Button><Button variant="outline" size="sm">1</Button><Button variant="outline" size="sm" disabled>다음</Button></div></div></TabsContent></Tabs></CardContent></Card>
          {selected.length > 0 && <Card className="sticky bottom-4 z-10 border-blue-200 bg-blue-50 shadow-lg"><CardContent className="flex items-center justify-between pt-5"><b>{selected.length}명 선택됨</b><div className="flex flex-wrap gap-2"><Button data-dialog-id="DLG-M001" onClick={() => openDialog("DLG-M001")}>상태 변경</Button><Button onClick={() => notify("메시지 발송 화면 연결 mock", "info")}>메시지 전송</Button><Button data-dialog-id="DLG-M022" onClick={() => openDialog("DLG-M022")}>출석 처리</Button><Button variant="outline" onClick={() => notify("관심회원 등록 mock 완료")}>관심회원 등록</Button><Button data-dialog-id="DLG-M005" variant={hasPermission(role, "dangerMember") ? "destructive" : "outline"} onClick={() => hasPermission(role, "dangerMember") ? openDialog("DLG-M005") : notify("일괄 탈퇴는 Owner 이상 권한이 필요합니다.", "warning")}>일괄 탈퇴</Button><Button data-dialog-id="DLG-M023" variant="outline" onClick={() => selected.length === 1 ? openDialog("DLG-M023") : notify("지점이관은 회원 1명 선택 시에만 진행합니다.", "warning")}>지점이관</Button></div></CardContent></Card>}
        </div>
        <aside className="space-y-5"><Card className="shadow-none"><CardHeader><CardTitle>액션 큐</CardTitle><CardDescription>{selected.length ? `${selected.length}명 선택됨` : "회원을 선택하면 큐가 활성화됩니다."}</CardDescription></CardHeader><CardContent className="space-y-2"><Button data-dialog-id="DLG-M001" className="w-full" onClick={() => openDialog("DLG-M001")}>상태 변경</Button><Button className="w-full" variant="outline" onClick={() => notify("선택 회원 메시지 발송 mock", "info")}>메시지 발송</Button><Button data-dialog-id="DLG-M022" className="w-full" variant="outline" onClick={() => openDialog("DLG-M022")}>수동 출석</Button><Button data-dialog-id="DLG-M005" className="w-full" variant="outline" onClick={() => openDialog("DLG-M005")}>탈퇴/복구 확인</Button><Button data-dialog-id="DLG-M023" className="w-full" variant="outline" onClick={() => openDialog("DLG-M023")}>이관 확인</Button></CardContent></Card><Card className="shadow-none"><CardHeader><CardTitle>우측 상세 팝업 패널</CardTitle><CardDescription>출석시 상세 팝업 ON 상태 mock</CardDescription></CardHeader><CardContent className="space-y-3 text-sm"><div className="flex items-center gap-3"><div className="grid size-12 place-items-center rounded-full bg-blue-100 font-bold text-blue-700">{detail.name[0]}</div><div><div className="font-bold">{detail.name}</div><div className="text-xs text-slate-500">{detail.phone} · {detail.branch}</div></div></div><Separator /><div className="grid grid-cols-2 gap-2 text-xs"><InfoCell label="상담 담당" value={detail.owner} /><InfoCell label="문의 유형" value="방문(WI)" /><InfoCell label="가입경로" value={detail.source} /><InfoCell label="운동목적" value={detail.purpose} /></div><div className="grid grid-cols-2 gap-2"><Button size="sm" onClick={() => notify(`${detail.name} 출석 체크 mock 완료`)}>출석 체크</Button><Button size="sm" variant="outline" onClick={() => notify(`${detail.name} 상품 구매 연결 mock`, "info")}>상품 구매</Button><Button size="sm" variant="outline" onClick={() => notify(`${detail.name} 메시지 작성 mock`, "info")}>메시지</Button><Button size="sm" variant="outline" asChild><Link href="/members/detail">더보기</Link></Button></div></CardContent></Card><DialogDock screen={screen} openDialog={openDialog} /><HandoffContractCard screen={screen} /></aside>
      </div>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border bg-white p-2"><div className="text-slate-500">{label}</div><div className="mt-1 font-semibold text-slate-950">{value}</div></div>;
}

function MemberRegistrationScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [memberType, setMemberType] = useState("일반");
  const canNext = name.trim().length > 1 && phone.trim().length >= 8;
  return (
    <div className="space-y-5"><DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="2단계 회원 등록" /><div className="grid grid-cols-[1fr_320px] gap-5"><Card className="shadow-none"><CardHeader><CardTitle>Step {step} / 2</CardTitle><CardDescription>결제 완료 후 회원 등록이 확정됩니다.</CardDescription></CardHeader><CardContent className="space-y-5"><div className="grid grid-cols-2 gap-2 text-sm"><div className={cn("rounded-lg border p-3", step === 1 && "border-blue-400 bg-blue-50")}>1. 기본 인적 사항</div><div className={cn("rounded-lg border p-3", step === 2 && "border-blue-400 bg-blue-50")}>2. 추가 정보 및 결제 진입</div></div>{step === 1 ? <div className="grid grid-cols-2 gap-4"><div className="space-y-1"><Label>이름 *</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" />{name && name.length < 2 && <p className="text-xs text-rose-600">이름은 2자 이상 입력합니다.</p>}</div><div className="space-y-1"><Label>성별 *</Label><div className="grid grid-cols-2 gap-2"><Button variant="outline" onClick={() => notify("남성 선택", "info")}>남성</Button><Button variant="outline" onClick={() => notify("여성 선택", "info")}>여성</Button></div></div><div className="space-y-1"><Label>연락처 *</Label><div className="flex gap-2"><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" /><Button data-dialog-id="DLG-M006" variant="outline" onClick={() => openDialog("DLG-M006")}>중복 확인</Button></div></div><div className="space-y-1"><Label>회원구분 *</Label><Select value={memberType} onValueChange={setMemberType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["일반", "기명법인", "무기명법인"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>{memberType !== "일반" && <div className="col-span-2 space-y-1"><Label>법인 회사명</Label><Input placeholder="법인 회사명" /></div>}<div className="col-span-2 grid grid-cols-3 gap-3"><Input placeholder="소속지점" defaultValue={branch} /><Input placeholder="담당 FC" defaultValue="이FC" /><Input placeholder="운동 목적" defaultValue="체중 감량" /></div></div> : <div className="space-y-4"><div className="grid grid-cols-2 gap-4"><Input placeholder="별칭/닉네임" /><Input placeholder="이메일" /><div className="flex gap-2"><Input placeholder="주소" /><Button data-dialog-id="DLG-M027" variant="outline" onClick={() => openDialog("DLG-M027")}>주소 검색</Button></div><Input placeholder="상세 주소" /></div><Textarea placeholder="메모 최대 500자" /><div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">결제 완료 후 회원 등록이 확정됩니다. 결제 취소 시 작성 내용은 임시 저장 상태로 돌아갑니다.</div></div>}<div className="flex justify-between border-t pt-4"><div className="flex gap-2"><Button data-dialog-id="DLG-M007" variant="outline" onClick={() => openDialog("DLG-M007")}>취소</Button><Button data-dialog-id="DLG-M008" variant="outline" onClick={() => openDialog("DLG-M008")}>초기화</Button></div>{step === 1 ? <Button disabled={!canNext} onClick={() => canNext ? setStep(2) : notify("필수 항목과 중복 확인이 필요합니다.", "warning")}>다음</Button> : <div className="flex gap-2"><Button variant="outline" onClick={() => setStep(1)}>이전</Button><Button asChild><Link href="/sales/payment">결제 진행</Link></Button></div>}</div></CardContent></Card><aside className="space-y-5"><Card className="shadow-none"><CardHeader><CardTitle>귀속 정책 안내</CardTitle></CardHeader><CardContent className="text-sm leading-6 text-slate-600">회원 등록값은 기본값입니다. 실제 결제 시 결제지점, 이용지점, 매출 귀속 지점, 정산 지점, 인센티브 귀속자를 다시 확인합니다.</CardContent></Card><DialogDock screen={screen} openDialog={openDialog} /><HandoffContractCard screen={screen} /></aside></div></div>
  );
}

function MemberDetailScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const member = memberDirectoryRows[0];
  return <div className="space-y-5"><DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="360도 회원 상세" /><div className="grid grid-cols-[360px_1fr] gap-5"><Card className="shadow-none"><CardHeader><CardTitle>{member.name}</CardTitle><CardDescription>{member.phone} · {member.branch}</CardDescription></CardHeader><CardContent className="space-y-3"><div className="grid size-24 place-items-center rounded-full bg-blue-100 text-3xl font-bold text-blue-700">김</div><InfoCell label="상태" value={member.status} /><InfoCell label="보유 이용권" value={member.pass} /><InfoCell label="최근 방문" value={member.visit} /><div className="grid grid-cols-2 gap-2"><Button onClick={() => notify("출석 체크 mock 완료")}>출석 체크</Button><Button data-dialog-id="DLG-M009" variant="outline" onClick={() => openDialog("DLG-M009")}>메모 추가</Button><Button data-dialog-id="DLG-M011" variant="outline" onClick={() => openDialog("DLG-M011")}>상담 등록</Button><Button data-dialog-id="DLG-M013" variant="outline" onClick={() => openDialog("DLG-M013")}>환불 처리</Button></div></CardContent></Card><div className="space-y-5"><Card className="shadow-none"><CardHeader><CardTitle>회원 타임라인</CardTitle><CardDescription>상담·결제·출석·체성분 이력을 한 화면에서 확인합니다.</CardDescription></CardHeader><CardContent className="grid grid-cols-4 gap-3">{["상담 12건", "결제 6건", "출석 41회", "체성분 8회"].map((item) => <div key={item} className="rounded-xl border bg-slate-50 p-4 font-semibold">{item}</div>)}</CardContent></Card><Card className="shadow-none"><CardHeader><CardTitle>연결 업무</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2">{["DLG-M015", "DLG-M017", "DLG-M018", "DLG-M019", "DLG-M020", "DLG-M024", "DLG-M026"].map((id) => <Button key={id} data-dialog-id={id} variant="outline" onClick={() => openDialog(id)}>{dialogById.get(id)?.title ?? id}</Button>)}</CardContent></Card><DialogDock screen={screen} openDialog={openDialog} /><HandoffContractCard screen={screen} /></div></div></div>;
}

function SalesOverviewScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const [preset, setPreset] = useState("이번 달");
  const [query, setQuery] = useState("");
  const rows = salesLedgerRows.filter((row) => `${row.buyer} ${row.product} ${row.status}`.includes(query));
  return <div className="space-y-5"><DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="매출 운영 코크핏" /><div className="grid grid-cols-4 gap-3">{[{ label: "순 매출", value: "18,420,000원" }, { label: "카드 결제", value: "12,800,000원" }, { label: "현금 결제", value: "4,500,000원" }, { label: "미수금", value: "1,120,000원" }].map((metric) => <Card key={metric.label} className="shadow-none"><CardHeader><CardDescription>{metric.label}</CardDescription><CardTitle className="text-2xl">{metric.value}</CardTitle></CardHeader></Card>)}</div><div className="grid grid-cols-[1fr_340px] gap-5"><div className="space-y-5"><Card className="shadow-none"><CardHeader><CardTitle>운영 코크핏</CardTitle><CardDescription>미수·환불·재등록·고할인 거래를 first fold에 배치합니다.</CardDescription></CardHeader><CardContent className="grid grid-cols-4 gap-3">{["미수 추적", "환불 검토", "재등록 성과", "고할인 거래"].map((item) => <button key={item} className="rounded-xl border p-4 text-left hover:bg-slate-50" onClick={() => notify(`${item} 필터 적용`, "info")}><div className="font-semibold">{item}</div><div className="mt-1 text-xs text-slate-500">처리 우선순위 mock</div></button>)}</CardContent></Card><Card className="shadow-none"><CardHeader><CardTitle>매출 현황 테이블</CardTitle><CardDescription>기간 프리셋, 통합 검색, 하단 요약 바 7종을 포함합니다.</CardDescription></CardHeader><CardContent className="space-y-3"><div className="flex flex-wrap gap-2">{["오늘", "이번 주", "이번 달"].map((item) => <Button key={item} variant={preset === item ? "default" : "outline"} onClick={() => { setPreset(item); notify(`${item} 기간 설정`, "info"); }}>{item}</Button>)}<Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="구매자 이름 또는 상품명" className="max-w-xs" /><Button asChild><Link href="/sales/pos">신규 결제(POS)</Link></Button><Button variant="outline" onClick={() => notify("엑셀 다운로드 mock", "info")}>엑셀</Button></div><div className="overflow-hidden rounded-xl border"><Table><TableHeader><TableRow>{["매출번호", "회원", "상품", "총액", "할인", "수납", "상태", "수단", "담당", "경로", "일시"].map((col) => <TableHead key={col}>{col}</TableHead>)}</TableRow></TableHeader><TableBody>{rows.map((row) => <TableRow key={row.id} onClick={() => openDialog("DLG-S001")} className="cursor-pointer"><TableCell>{row.id}</TableCell><TableCell className="font-semibold">{row.buyer}</TableCell><TableCell>{row.product}</TableCell><TableCell>{row.gross}</TableCell><TableCell>{row.discount}</TableCell><TableCell>{row.paid}</TableCell><TableCell>{statusAwareValue(row.status)}</TableCell><TableCell>{row.method}</TableCell><TableCell>{row.owner}</TableCell><TableCell>{row.route}</TableCell><TableCell>{row.date}</TableCell></TableRow>)}</TableBody></Table></div><div className="grid grid-cols-7 gap-2 rounded-xl border bg-slate-950 p-3 text-white">{["총매출 19.5M", "순매출 18.4M", "현금 4.5M", "카드 12.8M", "환불 620K", "미납 1.12M", "할인 530K"].map((item) => <div key={item} className="text-center text-xs font-semibold">{item}</div>)}</div></CardContent></Card></div><aside className="space-y-5"><Card className="shadow-none"><CardHeader><CardTitle>처리 큐</CardTitle></CardHeader><CardContent className="space-y-2">{salesLedgerRows.slice(0, 3).map((row) => <div key={row.id} className="rounded-lg border p-3 text-sm"><b>{row.buyer}</b> · {row.product}<div className="mt-2 flex gap-2"><Button size="sm" data-dialog-id="DLG-S001" onClick={() => openDialog("DLG-S001")}>거래 보기</Button><Button size="sm" variant="outline" asChild><Link href="/members/detail">회원 보기</Link></Button></div></div>)}<Button data-dialog-id="DLG-S005" variant="outline" className="w-full" onClick={() => openDialog("DLG-S005")}>메모 편집</Button><Button data-dialog-id="DLG-S012" variant="outline" className="w-full" onClick={() => openDialog("DLG-S012")}>목표 설정</Button></CardContent></Card><DialogDock screen={screen} openDialog={openDialog} /><DialogDock screen={screen} openDialog={openDialog} /><HandoffContractCard screen={screen} /></aside></div></div>;
}

function PosSalesScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const [cart, setCart] = useState(posProducts.slice(0, 2));
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  return <div className="space-y-5"><DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="현장 판매 POS" /><div className="grid grid-cols-[1fr_380px] gap-5"><Card className="shadow-none"><CardHeader><CardTitle>상품 선택</CardTitle><CardDescription>재고/품절/안전재고 상태를 클릭 차단까지 표현합니다.</CardDescription></CardHeader><CardContent className="grid grid-cols-2 gap-3">{posProducts.map((product) => <button key={product.name} disabled={product.stock === "품절"} className="rounded-xl border p-4 text-left disabled:opacity-45" onClick={() => { setCart((current) => [...current, product]); notify(`${product.name} 장바구니 추가`, "info"); }}><Badge className={product.color}>{product.category}</Badge><div className="mt-3 text-lg font-bold">{product.name}</div><div className="mt-1 text-sm text-slate-500">{product.price.toLocaleString()}원</div><div className="mt-3 text-xs">{product.stock}</div></button>)}</CardContent></Card><aside className="space-y-5"><Card className="shadow-none"><CardHeader><CardTitle>장바구니 / 결제</CardTitle><CardDescription>회원 검색 후 외부 POS 완료 건을 CRM에 기록합니다.</CardDescription></CardHeader><CardContent className="space-y-3"><Button data-dialog-id="DLG-S002" variant="outline" className="w-full" onClick={() => openDialog("DLG-S002")}>구매자 검색</Button><div className="space-y-2">{cart.map((item, index) => <div key={`${item.name}-${index}`} className="flex items-center justify-between rounded-lg border p-2 text-sm"><span>{item.name}</span><span>{item.price.toLocaleString()}원</span></div>)}</div><div className="rounded-xl bg-slate-950 p-4 text-white"><div className="text-sm text-slate-300">최종 결제금액</div><div className="text-2xl font-bold">{total.toLocaleString()}원</div></div><Button data-dialog-id="DLG-S003" className="w-full" onClick={() => openDialog("DLG-S003")}>결제 확인</Button><Button data-dialog-id="DLG-S004" variant="outline" className="w-full" onClick={() => openDialog("DLG-S004")}>중복 결제 경고 보기</Button></CardContent></Card><DialogDock screen={screen} openDialog={openDialog} /><DialogDock screen={screen} openDialog={openDialog} /><HandoffContractCard screen={screen} /></aside></div></div>;
}

function PaymentProcessingScreen({ screen, role, branch, openDialog, notify }: SpecializedScreenProps) {
  const [receipt, setReceipt] = useState(false);
  const [done, setDone] = useState(false);
  return <div className="space-y-5"><DeliveryHeader screen={screen} role={role} branch={branch} titleSuffix="결제 등록 플로우" />{done ? <Card className="shadow-none"><CardContent className="grid place-items-center py-16 text-center"><CheckCircle2 className="size-16 text-emerald-600" /><h2 className="mt-4 text-2xl font-bold">결제 등록 완료</h2><p className="mt-2 text-sm text-slate-600">결제완료 상태와 회원권/수강권 구매 완료가 함께 반영되는 mock 완료 화면입니다.</p><div className="mt-6 flex gap-2"><Button onClick={() => notify("영수증 파일 보기 mock", "info")}>영수증 파일 보기</Button><Button variant="outline" onClick={() => notify("문자 발송 mock", "info")}>문자 발송</Button><Button variant="outline" onClick={() => setDone(false)}>계속 판매하기</Button><Button asChild><Link href="/sales">매출 현황</Link></Button></div></CardContent></Card> : <div className="grid grid-cols-[1fr_360px] gap-5"><Card className="shadow-none"><CardHeader><CardTitle>구매자 · 상품 · 수납 · 완료</CardTitle><CardDescription>현장 전액 등록, 잔액 등록, 계약금 등록을 분리합니다.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="grid grid-cols-3 gap-3">{["현장 전액 등록", "잔액 등록", "계약금 등록"].map((item) => <button key={item} className="rounded-xl border p-4 text-left hover:bg-slate-50" onClick={() => notify(`${item} 유형 선택`, "info")}><b>{item}</b><p className="mt-1 text-xs text-slate-500">외부 POS/현금 수납 완료 후 CRM 기록</p></button>)}</div><div className="grid grid-cols-2 gap-4"><Input placeholder="회원 검색" defaultValue="김민준" /><Input placeholder="상품" defaultValue="PT 20회" /><Input placeholder="수납 금액" defaultValue="1,150,000" /><Input placeholder="결제 수단" defaultValue="카드" /></div><div className="rounded-xl border p-4"><div className="flex items-center justify-between"><div><b>영수증 파일</b><p className="text-xs text-slate-500">이미지 또는 PDF만 첨부 가능</p></div><Button variant={receipt ? "default" : "outline"} onClick={() => { setReceipt(true); notify("영수증 첨부 mock 완료"); }}>{receipt ? "첨부 완료" : "파일 첨부"}</Button></div>{!receipt && <p className="mt-2 text-xs text-rose-600">영수증 파일을 첨부해주세요.</p>}</div><div className="flex justify-between"><Button variant="outline" onClick={() => notify("결제 상태 초기화", "info")}>초기화</Button><Button data-dialog-id="DLG-S003" disabled={!receipt} onClick={() => receipt ? setDone(true) : notify("영수증 파일을 첨부해주세요.", "warning")}>결제 등록</Button></div></CardContent></Card><aside className="space-y-5"><Card className="shadow-none"><CardHeader><CardTitle>예외/연결 DLG</CardTitle></CardHeader><CardContent className="space-y-2"><Button data-dialog-id="DLG-S002" className="w-full" variant="outline" onClick={() => openDialog("DLG-S002")}>구매자 검색</Button><Button data-dialog-id="DLG-S004" className="w-full" variant="outline" onClick={() => openDialog("DLG-S004")}>중복 결제 경고</Button><Button data-dialog-id="DLG-S009" className="w-full" variant="outline" onClick={() => openDialog("DLG-S009")}>할부 등록</Button></CardContent></Card><DialogDock screen={screen} openDialog={openDialog} /><HandoffContractCard screen={screen} /></aside></div>}</div>;
}

function DataPanel({ screen, notify }: { screen: ScreenDefinition; notify: (message: string, tone?: "success" | "warning" | "info") => void }) {
  const [query, setQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const filteredRows = screen.rows.filter((row) => Object.values(row).join(" ").toLowerCase().includes(query.toLowerCase()));
  const visibleRows = filteredRows.slice((page - 1) * 5, page * 5);

  if (!screen.tableColumns.length) return <div className="rounded-lg border bg-slate-50 p-5 text-sm text-slate-600">테이블 없는 화면입니다. 이 화면의 주요 액션은 우측 DLG 또는 상단 액션 큐에서 mock 동작합니다.</div>;
  return (
    <div className="rounded-lg border">
      <div className="flex flex-wrap items-center gap-2 border-b bg-slate-50 p-3">
        <Search className="size-4 text-slate-400" />
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
      <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-slate-500">
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

function RuntimeDialog({ dialogId, role, onClose, notify }: { dialogId: string | null; role: RoleId; onClose: () => void; notify: (message: string, tone?: "success" | "warning" | "info") => void }) {
  const dialog = dialogId ? dialogById.get(dialogId) : undefined;
  const allowed = dialog ? hasPermission(role, dialog.requiredPermission) : true;
  const contract = dialog ? getDialogContract(dialog) : null;
  const [dirty, setDirty] = useState(false);
  return (
    <Dialog open={Boolean(dialog)} onOpenChange={(open) => !open && onClose()}>
      {dialog && <DialogContent data-testid="runtime-dialog">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2"><Badge variant={dialog.destructive ? "destructive" : "info"}>{dialog.id}</Badge><Badge variant="outline">{dialog.source}</Badge>{dialog.policyPending && <Badge variant="warning">정책 확인 필요</Badge>}</div>
          <DialogTitle>{dialog.title}</DialogTitle>
          <DialogDescription>{dialog.purpose}</DialogDescription>
        </DialogHeader>
        {!allowed && <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"><Lock className="mr-2 inline size-4" />현재 역할에는 처리 권한이 없습니다. 검수용으로 입력 필드는 보이지만 확인 버튼은 권한 차단 toast를 표시합니다.</div>}
        <div className="grid gap-3 sm:grid-cols-2">
          {dialog.components.map((component, index) => <div key={component} className="space-y-1"><Label>{component}</Label>{index % 3 === 2 ? <Textarea defaultValue={`${component} mock 입력`} onChange={() => setDirty(true)} /> : <Input defaultValue={`${component} mock`} onChange={() => setDirty(true)} />}</div>)}
        </div>
        <Separator />
        <div className="rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">
          실제 저장·삭제·승인·발송·결제·환불·외부연동은 수행하지 않습니다. 버튼 클릭 시 로컬 toast 또는 화면 상태만 mock 변경합니다.<br />
          Contract: <code>{contract?.submitContract.method} {contract?.submitContract.endpoint}</code> · 상태 {dirty ? "dirty" : "pristine"}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { if (dirty) notify("입력 변경사항을 저장하지 않고 닫았습니다.", "warning"); setDirty(false); onClose(); }}>닫기</Button>
          <Button variant={dialog.destructive ? "destructive" : "default"} data-blocked={!allowed} onClick={() => { if (!allowed) { notify(`${dialog.id} ${dialog.title}: 현재 역할 권한으로는 확인 처리할 수 없습니다.`, "warning"); return; } notify(`${dialog.id} ${dialog.title} mock 처리 완료`, dialog.policyPending ? "warning" : "success"); setDirty(false); onClose(); }}>{dialog.policyPending ? "정책 확인 상태로 저장" : "확인"}</Button>
        </DialogFooter>
      </DialogContent>}
    </Dialog>
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

export const implementedDialogIds = dialogs.map((dialog) => dialog.id);
export const implementedScreenIds = screens.map((screen) => screen.id);
