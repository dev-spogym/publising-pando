"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

export function PrototypeApp({ initialRoute }: { initialRoute: string }) {
  const pathname = usePathname();
  const route = pathname === "/" ? initialRoute : pathname.replace(/\/$/, "") || "/login";
  const screen = screens.find((item) => item.route === route) ?? screens[0];
  const [role, setRole] = useState<RoleId>(() => {
    if (typeof window === "undefined") return defaultRole;
    const savedRole = window.localStorage.getItem("pando-role") as RoleId | null;
    return savedRole && roleById.has(savedRole) ? savedRole : defaultRole;
  });
  const [branch, setBranch] = useState(() => {
    if (typeof window === "undefined") return branches[0];
    return window.localStorage.getItem("pando-branch") ?? branches[0];
  });
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);


  useEffect(() => {
    window.localStorage.setItem("pando-role", role);
    window.localStorage.setItem("pando-branch", branch);
  }, [role, branch]);

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
