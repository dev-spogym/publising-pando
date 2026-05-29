"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  AlertTriangle,
  ArrowRightLeft,
  Bell,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  CreditCard,
  Dumbbell,
  Edit,
  FileText,
  History,
  Home,
  Lock,
  LogOut,
  Menu,
  MessageSquare,
  MoreVertical,
  Pin,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Star,
  TrendingUp,
  UserMinus,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  branches,
  dialogById,
  dialogs,
  getDialogPrimarySource,
  getDialogSecondarySource,
  getScreenPrimarySource,
  getScreenSecondarySource,
  getScreenSourceLabel,
  hasPermission,
  roleById,
  roles,
  screens,
  type DialogDefinition,
  type DomainId,
  type RoleId,
  type ScreenDefinition,
} from "@/app/data/registry";
import { getDialogContract, getScreenContract } from "@/app/data/contracts";
import { cn } from "@/app/lib/utils";
import { PublishingReviewToggle } from "@/components/publishing/publishing-review-toggle";
import { AdminSlidePanel } from "@/components/admin-slide-panel";

const defaultRole: RoleId = "OWNER";

type ToastTone = "success" | "warning" | "info";
type ToastState = { message: string; tone: ToastTone } | null;
type MockActionPanelState = {
  message: string;
  tone: ToastTone;
  screenId: string;
  screenTitle: string;
  route: string;
  branch: string;
  roleLabel: string;
  source: string;
  dialogIds: string[];
  timestamp: string;
} | null;
type Notify = (message: string, tone?: ToastTone) => void;

// 운영 버튼은 실제 프론트 UX처럼 route/패널/DLG/local state로만 반응한다.
// 퍼블리싱 설명 패널은 "문서/계약" 안에만 격리한다.
const actionLikeToastPatterns: string[] = [];

function shouldOpenMockActionPanel(message: string, tone: ToastTone) {
  if (tone === "warning") return false;
  return actionLikeToastPatterns.some((pattern) => message.includes(pattern));
}

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
  return savedBranch && branches.includes(savedBranch)
    ? savedBranch
    : branches[0];
}

export function PrototypeApp({ initialRoute }: { initialRoute: string }) {
  const pathname = usePathname();
  const route =
    pathname === "/" ? initialRoute : pathname.replace(/\/$/, "") || "/login";
  const screen = screens.find((item) => item.route === route) ?? screens[0];
  const role = useSyncExternalStore(
    subscribePreferences,
    getRoleSnapshot,
    () => defaultRole,
  );
  const branch = useSyncExternalStore(
    subscribePreferences,
    getBranchSnapshot,
    () => branches[0],
  );
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [mockActionPanel, setMockActionPanel] =
    useState<MockActionPanelState>(null);
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
  const notify = (message: string, tone: ToastTone = "success") => {
    setToast({ message, tone });
    if (screen.id !== "SCR-100" && shouldOpenMockActionPanel(message, tone)) {
      setMockActionPanel({
        message,
        tone,
        screenId: screen.id,
        screenTitle: screen.title,
        route: screen.route,
        branch,
        roleLabel: roleById.get(role)?.label ?? role,
        source: screen.source,
        dialogIds: screen.dialogs,
        timestamp: new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      });
    }
  };

  if (screen.id === "SCR-100") {
    return (
      <>
        <LoginScreen
          role={role}
          branch={branch}
          setRole={setRole}
          setBranch={setBranch}
          openDialog={openDialog}
          notify={notify}
        />
        <RuntimeDialog
          dialogId={activeDialog}
          role={role}
          onClose={() => setActiveDialog(null)}
          notify={notify}
        />
        <Toast toast={toast} />
      </>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-hidden p-3 lg:p-4 text-content">
      <div className="app-shell-frame flex h-[calc(100dvh-1.5rem)] w-full overflow-hidden rounded-[28px] lg:h-[calc(100dvh-2rem)]">
        <Sidebar currentRoute={screen.route} role={role} />
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <Topbar
            screen={screen}
            role={role}
            branch={branch}
            setRole={setRole}
            setBranch={setBranch}
            openDialog={openDialog}
            notify={notify}
          />
          <main className="flex-1 overflow-auto px-3 pb-6 pt-4 sm:px-6">
            <div className="mx-auto max-w-[1480px]">
              <AdminScreen
                screen={screen}
                role={role}
                branch={branch}
                openDialog={openDialog}
                notify={notify}
              />
              <ScreenSupportDrawer
                screen={screen}
                role={role}
                openDialog={openDialog}
              />
            </div>
          </main>
        </div>
      </div>
      <RuntimeDialog
        dialogId={activeDialog}
        role={role}
        onClose={() => setActiveDialog(null)}
        notify={notify}
      />
      <MockActionPanel
        panel={mockActionPanel}
        onClose={() => setMockActionPanel(null)}
        onOpenDialog={openDialog}
      />
      <Toast toast={toast} />
    </div>
  );
}

function LoginScreen({
  role,
  branch,
  setRole,
  setBranch,
  openDialog,
  notify,
}: {
  role: RoleId;
  branch: string;
  setRole: (role: RoleId) => void;
  setBranch: (branch: string) => void;
  openDialog: (id: string) => void;
  notify: (message: string, tone?: "success" | "warning" | "info") => void;
}) {
  const router = useRouter();
  const roleInfo = roleById.get(role)!;
  const [loginId, setLoginId] = useState("owner.gangnam");
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [step, setStep] = useState<
    "credential" | "twoFactor" | "passwordChange"
  >("credential");
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
    notify(
      `mock 로그인 완료: ${remember ? "로그인 유지" : "세션 로그인"}로 회원 목록 이동`,
    );
    router.push("/members");
  };
  return (
    <main className="min-h-screen overflow-hidden p-8 text-content">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl grid-cols-[minmax(0,1fr)_480px] items-center gap-12">
        <section>
          <Badge
            variant="info"
            className="border-primary/30 bg-primary-light text-primary"
          >
            SCR-100 · AUTH-01 · 직원 1명 = 계정 1개
          </Badge>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary to-accent text-white text-[20px] font-black shadow-[0_16px_32px_rgba(15,23,42,0.08)]">
              P
            </div>
            <div>
              <h1 className="text-5xl font-black tracking-tight text-content">
                Pando CRM Admin V1
              </h1>
              <p className="mt-1 text-[13px] font-semibold text-content-tertiary">
                Publishing Workspace · FitGenie 톤
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-[17px] leading-8 text-content-secondary">
            운영자가 매일 쓰는 고밀도 Admin 퍼블리싱입니다. 역할·지점·보안
            상태에 따라 진입 후 보이는 메뉴와 액션이 달라집니다.
          </p>
          <div className="mt-8 grid max-w-3xl grid-cols-3 gap-3">
            {["Next + shadcn", "docs4/V1 기준", "API 없는 mock"].map((item) => (
              <div
                key={item}
                className="app-panel rounded-2xl p-4 text-[13px] font-semibold text-content"
              >
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8 grid max-w-3xl grid-cols-2 gap-3 text-[13px] text-content-secondary">
            {[
              "5회 실패 잠금 30분",
              "2FA 추가 인증",
              "첫 로그인 PW 변경",
              "세션 만료 후 복귀",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" />
                {item}
              </div>
            ))}
          </div>
        </section>
        <Card className="admin-surface bg-white text-content shadow-[0_32px_80px_rgba(15,23,42,0.1)]">
          <CardHeader>
            <CardTitle className="text-2xl">직원 로그인</CardTitle>
            <CardDescription>
              문서의 지점 선택, 보안 상태, 2FA, 임시 비밀번호 플로우를 mock으로
              확인합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>지점 선택</Label>
                <BranchSelect branch={branch} setBranch={setBranch} />
              </div>
              <div className="space-y-2">
                <Label>역할 선택</Label>
                <RoleSelect role={role} setRole={setRole} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>로그인 ID</Label>
              <Input
                value={loginId}
                onChange={(event) => setLoginId(event.target.value)}
                placeholder="owner.gangnam"
              />
              {loginId && !loginId.includes(".") && (
                <p className="text-xs text-rose-600">
                  직원 로그인 ID 형식 예: owner.gangnam
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>비밀번호</Label>
              <div className="flex gap-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? "숨김" : "표시"}
                </Button>
              </div>
              {password && password.length < 6 && (
                <p className="text-xs text-rose-600">
                  비밀번호는 6자 이상이어야 합니다.
                </p>
              )}
            </div>
            <label className="flex items-center gap-2 rounded-lg border bg-surface-secondary p-3 text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />{" "}
              로그인 상태 유지{" "}
              <span className="ml-auto text-xs text-content-tertiary">
                refresh token mock
              </span>
            </label>
            {step === "twoFactor" && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
                <Label>2단계 인증 코드</Label>
                <Input
                  className="mt-2 bg-white"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  placeholder="123456"
                />
                <p className="mt-2 text-xs text-blue-700">
                  코드 만료/불일치 상태는 toast로 확인합니다.
                </p>
              </div>
            )}
            {step === "passwordChange" && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                첫 로그인 임시 비밀번호 상태입니다. 후속 구현 시 비밀번호 변경
                화면을 먼저 통과해야 합니다.
              </div>
            )}
            <div className="rounded-lg border bg-surface-secondary p-3 text-sm text-content-secondary">
              <b className="text-content">{roleInfo.label}</b> ·{" "}
              {roleInfo.branchScope}
              <br />
              {roleInfo.description}
            </div>
            <Button className="w-full" size="lg" onClick={submitLogin}>
              로그인
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => notify("비밀번호 재설정 메일 발송 mock", "info")}
              >
                비밀번호 재설정
              </Button>
              <Button
                data-dialog-id="DLG-000"
                variant="outline"
                onClick={() => openDialog("DLG-000")}
              >
                세션 만료 보기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

type SidebarMode = "ops" | "sitemap";

type SidebarLinkItem = { id: string; label: string };
type SidebarGroup = {
  id: string;
  label: string;
  icon: typeof Home;
  items: SidebarLinkItem[];
};

const sidebarModeStorageKey = "pando-publishing-sidebar-mode";

function Sidebar({
  currentRoute,
  role,
}: {
  currentRoute: string;
  role: RoleId;
}) {
  const roleInfo = roleById.get(role)!;
  const [sidebarQuery, setSidebarQuery] = useState("");
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>(() => {
    if (typeof window === "undefined") return "ops";
    const saved = window.localStorage.getItem(sidebarModeStorageKey);
    return saved === "sitemap" ? "sitemap" : "ops";
  });

  const screenById = (id: string) => screens.find((screen) => screen.id === id);
  const activeScreen = screens.find((screen) => screen.route === currentRoute);

  const hqMenu: SidebarLinkItem[] = [
    { id: "SCR-101", label: "통합 대시보드" },
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

  const dashboardGroup: SidebarLinkItem[] = [
    { id: "SCR-090", label: "지점 대시보드" },
    { id: "SCR-098", label: "오늘의 할 일" },
    { id: "SCR-095", label: "KPI 센터" },
  ];

  const operationalGroups: SidebarGroup[] = [
    {
      id: "dashboard",
      label: "대시보드",
      icon: Home,
      items: dashboardGroup,
    },
    {
      id: "members",
      label: "회원",
      icon: UserRound,
      items: [
        { id: "SCR-M001", label: "회원 목록" },
        { id: "SCR-M002", label: "회원 등록" },
        { id: "SCR-M004", label: "회원 상세" },
        { id: "SCR-M003", label: "회원 수정" },
        { id: "SCR-M006", label: "체성분 관리" },
        { id: "SCR-M009", label: "등급 관리" },
        { id: "SCR-I001", label: "출석 관리" },
        { id: "SCR-075", label: "전자계약" },
      ],
    },
    {
      id: "classes",
      label: "수업/캘린더",
      icon: Calendar,
      items: [
        { id: "SCR-C001", label: "캘린더" },
        { id: "SCR-C016", label: "예약 목록" },
        { id: "SCR-C009", label: "일정 요청" },
        { id: "SCR-C002", label: "수업 관리" },
        { id: "SCR-C007", label: "횟수 관리" },
        { id: "SCR-C008", label: "페널티 관리" },
        { id: "SCR-C011", label: "유효 수업 목록" },
        { id: "SCR-C004", label: "수업 템플릿" },
        { id: "SCR-C003", label: "시간표 등록" },
        { id: "SCR-C005", label: "수업 현황" },
        { id: "SCR-C006", label: "강사 현황" },
        { id: "SCR-C012", label: "대기열 관리" },
        { id: "SCR-C013", label: "수업 평가" },
        { id: "SCR-C014", label: "수업 출석" },
        { id: "SCR-C015", label: "수업 녹화" },
      ],
    },
    {
      id: "sales",
      label: "매출",
      icon: TrendingUp,
      items: [
        { id: "SCR-S001", label: "매출 현황" },
        { id: "SCR-S004", label: "매출 통계" },
        { id: "SCR-S005", label: "통계 관리" },
        { id: "SCR-095", label: "KPI 대시보드" },
        { id: "SCR-096", label: "온보딩 현황" },
        { id: "SCR-S006", label: "선수익금" },
        { id: "SCR-S002", label: "POS 결제" },
        { id: "SCR-S003", label: "결제 처리" },
        { id: "SCR-S007", label: "환불 관리" },
        { id: "SCR-S008", label: "미수금 관리" },
        { id: "SCR-S009", label: "할부결제" },
        { id: "SCR-S010", label: "세금계산서" },
        { id: "SCR-S011", label: "매출 예측" },
        { id: "SCR-S012", label: "부분 환불" },
      ],
    },
    {
      id: "products",
      label: "상품",
      icon: ShoppingCart,
      items: [
        { id: "SCR-P001", label: "상품 관리" },
        { id: "SCR-P005", label: "상품 카탈로그" },
        { id: "SCR-P006", label: "상품 비교" },
        { id: "SCR-P007", label: "재고 관리" },
        { id: "SCR-P008", label: "시즌 가격" },
        { id: "SCR-P004", label: "할인 설정" },
      ],
    },
    {
      id: "facility",
      label: "시설",
      icon: Building2,
      items: [
        { id: "SCR-050", label: "락커 관리" },
        { id: "SCR-051", label: "사물함 관리" },
        { id: "SCR-052", label: "밴드/카드" },
        { id: "SCR-053", label: "운동룸" },
        { id: "SCR-054", label: "골프 타석" },
        { id: "SCR-I004", label: "옷 보관함" },
        { id: "SCR-056", label: "장비 점검" },
        { id: "SCR-057", label: "소모품 재고" },
        { id: "SCR-058", label: "청소 스케줄" },
        { id: "SCR-059", label: "공간 자산 관리" },
      ],
    },
    {
      id: "staff",
      label: "직원/급여",
      icon: ShieldCheck,
      items: [
        { id: "SCR-060", label: "직원 목록" },
        { id: "SCR-061", label: "직원 등록/수정" },
        { id: "SCR-063", label: "직원 근태" },
        { id: "SCR-064", label: "급여 관리" },
        { id: "SCR-065", label: "급여 명세서" },
      ],
    },
    {
      id: "marketing",
      label: "영업/마케팅",
      icon: MessageSquare,
      items: [
        { id: "SCR-070", label: "리드 관리" },
        { id: "SCR-071", label: "메시지 발송" },
        { id: "SCR-072", label: "자동 알림" },
        { id: "SCR-073", label: "쿠폰 관리" },
        { id: "SCR-076", label: "캠페인 관리" },
        { id: "SCR-077", label: "리퍼럴 프로그램" },
        { id: "SCR-078", label: "SMS/카카오" },
        { id: "SCR-079", label: "A/B 테스트" },
        { id: "SCR-074", label: "마일리지" },
      ],
    },
    {
      id: "settings",
      label: "설정",
      icon: Settings,
      items: [
        { id: "SCR-080", label: "센터 설정" },
        { id: "SCR-081", label: "권한 설정" },
        { id: "SCR-082", label: "키오스크" },
        { id: "SCR-082A", label: "키오스크 IoT" },
        { id: "SCR-083", label: "출입문/IoT" },
        { id: "SCR-080A", label: "자동화 적용" },
        { id: "SCR-086", label: "출석 설정" },
        { id: "SCR-087", label: "커스텀 역할" },
        { id: "SCR-088", label: "다국어 설정" },
        { id: "SCR-089", label: "백업/복원" },
        { id: "SCR-085", label: "공지사항" },
      ],
    },
  ];

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

  const activeOperationalGroup =
    operationalGroups.find((group) =>
      group.items.some((item) => screenById(item.id)?.route === currentRoute),
    )?.id ?? "members";
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set([activeOperationalGroup]),
  );

  useEffect(() => {
    window.localStorage.setItem(sidebarModeStorageKey, sidebarMode);
  }, [sidebarMode]);

  const matchesQuery = (label: string, id?: string) =>
    !sidebarQuery ||
    label.toLowerCase().includes(sidebarQuery.toLowerCase()) ||
    id?.toLowerCase().includes(sidebarQuery.toLowerCase());

  const setMode = (mode: SidebarMode) => {
    setSidebarMode(mode);
    if (mode === "ops") setOpenGroups(new Set([activeOperationalGroup]));
  };

  const toggleGroup = (id: string) => {
    setOpenGroups((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderItem = (item: SidebarLinkItem) => {
    const screen = screenById(item.id);
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
            : "text-content-secondary hover:bg-white/70 hover:text-content",
        )}
      >
        <span className="truncate">{item.label}</span>
        <span
          className={cn(
            "text-[9px] font-bold tracking-tight",
            isActive ? "text-primary/80" : "text-content-tertiary",
          )}
        >
          {item.id.replace("SCR-", "")}
        </span>
      </Link>
    );
  };

  const renderOperationalGroup = (group: SidebarGroup) => {
    const visibleItems = group.items.filter((item) =>
      matchesQuery(item.label, item.id),
    );
    if (visibleItems.length === 0) return null;
    const isOpen =
      openGroups.has(group.id) ||
      group.id === activeOperationalGroup ||
      Boolean(sidebarQuery);
    const isActive = group.id === activeOperationalGroup;
    const Icon = group.icon;
    return (
      <div key={group.id} className="mb-px">
        <button
          type="button"
          className={cn(
            "group flex h-[40px] w-full items-center gap-[10px] rounded-xl px-[12px] text-[13px] font-semibold transition-all",
            isActive
              ? "bg-gradient-to-r from-primary-light via-primary-light to-white text-primary shadow-sm"
              : "text-content-secondary hover:bg-white/70 hover:text-content",
          )}
          onClick={() => toggleGroup(group.id)}
          aria-expanded={isOpen}
        >
          <Icon
            className={cn(
              "shrink-0",
              isActive
                ? "text-primary"
                : "text-content-tertiary group-hover:text-content-secondary",
            )}
            size={17}
            strokeWidth={isActive ? 2 : 1.5}
            aria-hidden="true"
          />
          <span className="flex-1 truncate text-left">{group.label}</span>
          <ChevronRight
            className={cn(
              "size-3.5 text-content-tertiary transition-transform",
              isOpen && "rotate-90",
            )}
          />
        </button>
        {isOpen && (
          <div className="ml-[20px] mt-1 space-y-1 border-l border-line/80 py-1 pl-[14px]">
            {visibleItems.map(renderItem)}
          </div>
        )}
      </div>
    );
  };

  const userFlows = [
    {
      label: "상담→등록→결제",
      startId: "SCR-070",
      steps: ["리드", "회원 등록", "결제 처리"],
    },
    {
      label: "회원상세→계약→환불",
      startId: "SCR-M004",
      steps: ["상세", "계약", "환불"],
    },
    {
      label: "상품 목록→상세 패널",
      startId: "SCR-P001",
      steps: ["상품", "상세", "수정"],
    },
    {
      label: "예약→출석→횟수 차감",
      startId: "SCR-C016",
      steps: ["예약", "출석", "차감"],
    },
  ];

  return (
    <aside className="hidden h-full w-[268px] shrink-0 flex-col border-r border-line/80 bg-white/68 backdrop-blur-xl no-scrollbar lg:flex">
      <div className="flex h-[72px] shrink-0 items-center border-b border-line/80 px-4">
        <div className="flex items-center gap-2.5">
          <Link
            href={
              role === "HQ_ADMIN"
                ? (screenById("SCR-101")?.route ?? "/")
                : (screenById("SCR-090")?.route ?? "/")
            }
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary to-accent text-[13px] font-black text-white shadow-[0_16px_32px_rgba(15,23,42,0.08)]"
          >
            FG
          </Link>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[13.5px] font-black tracking-tight text-content">
              FitGenie CRM
            </span>
            <span className="text-[10.5px] font-medium text-content-tertiary">
              Publishing Workspace
            </span>
          </div>
        </div>
      </div>

      <div className="border-b border-line/60 px-3 pb-2 pt-3">
        <div className="mb-2 grid grid-cols-2 rounded-xl border border-line/70 bg-surface-secondary p-1 text-[11px] font-black">
          <button
            type="button"
            data-testid="sidebar-mode-ops"
            onClick={() => setMode("ops")}
            className={cn(
              "rounded-lg px-2 py-1.5 transition",
              sidebarMode === "ops"
                ? "bg-white text-primary shadow-sm"
                : "text-content-tertiary hover:text-content",
            )}
          >
            운영 메뉴
          </button>
          <button
            type="button"
            data-testid="sidebar-mode-sitemap"
            onClick={() => setMode("sitemap")}
            className={cn(
              "rounded-lg px-2 py-1.5 transition",
              sidebarMode === "sitemap"
                ? "bg-white text-primary shadow-sm"
                : "text-content-tertiary hover:text-content",
            )}
          >
            사이트맵
          </button>
        </div>
        <div className="relative mb-2">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-content-tertiary"
            size={12}
          />
          <input
            type="text"
            value={sidebarQuery}
            onChange={(e) => setSidebarQuery(e.target.value)}
            placeholder={
              sidebarMode === "ops" ? "운영 메뉴 검색..." : "전체 문서 검색..."
            }
            className="h-8 w-full rounded-lg border border-line/80 bg-white/80 pl-7 pr-2 text-[12px] text-content placeholder:text-content-tertiary outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>
        <div className="rounded-xl bg-surface-secondary px-3 py-2 text-[11px] leading-4 text-content-tertiary">
          {sidebarMode === "ops"
            ? "admin-pando 운영 IA 기준. 지점 기준은 상단 전역 선택에서만 변경됩니다."
            : "docs4 V1/V2 전체 화면 검수용입니다. 지점 기준은 상단 전역 선택에서만 변경됩니다."}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 scrollbar-hide">
        {sidebarMode === "ops" ? (
          <>
            {role === "HQ_ADMIN" && (
              <div className="mb-3">
                <p className="px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-content-tertiary">
                  본부 관리
                </p>
                <div className="space-y-px">
                  {hqMenu
                    .filter((item) => matchesQuery(item.label, item.id))
                    .map(renderItem)}
                </div>
                <div className="mt-2 border-b border-line" />
              </div>
            )}

            <div className="mb-3 rounded-2xl border border-primary/15 bg-primary-light/25 p-2.5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-[11px] font-black text-content">
                  운영 플로우
                </p>
                <Badge className="border-primary/20 bg-white text-[9px] text-primary">
                  user-flow
                </Badge>
              </div>
              <div className="space-y-1.5">
                {userFlows.map((flow) => {
                  const start = screenById(flow.startId);
                  if (!start) return null;
                  return (
                    <Link
                      key={flow.label}
                      href={start.route}
                      className="block rounded-xl border border-line/70 bg-white/80 px-2.5 py-2 text-[11px] transition hover:border-primary/30 hover:bg-white"
                    >
                      <div className="flex items-center justify-between gap-2 font-bold text-content">
                        <span className="truncate">{flow.label}</span>
                        <ChevronRight className="size-3 text-primary" />
                      </div>
                      <div className="mt-1 truncate text-[10px] text-content-tertiary">
                        {flow.steps.join(" → ")}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {operationalGroups.map(renderOperationalGroup)}
          </>
        ) : (
          <>
            <div className="mb-3">
              <p className="px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-content-tertiary">
                본부 관리
              </p>
              <div className="space-y-px">
                {hqMenu
                  .filter((item) => matchesQuery(item.label, item.id))
                  .map(renderItem)}
              </div>
            </div>
            <div className="mb-3">
              <p className="px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-content-tertiary">
                대시보드
              </p>
              <div className="space-y-px">
                {dashboardGroup
                  .filter((item) => matchesQuery(item.label, item.id))
                  .map(renderItem)}
              </div>
            </div>
            {domainOrder.map((dom) => {
              const items = screens
                .filter((screen) => screen.domain === dom.id)
                .filter(
                  (screen) => !hqMenu.some((item) => item.id === screen.id),
                )
                .filter(
                  (screen) =>
                    !dashboardGroup.some((item) => item.id === screen.id),
                )
                .filter((screen) => matchesQuery(screen.title, screen.id));
              if (items.length === 0) return null;
              return (
                <div key={dom.id} className="mb-3">
                  <p className="px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-content-tertiary">
                    {dom.label}
                  </p>
                  <div className="space-y-px">
                    {items.map((screen) =>
                      renderItem({ id: screen.id, label: screen.title }),
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </nav>

      <div className="shrink-0 border-t border-line/80 p-2.5">
        <div className="flex items-center gap-2.5 rounded-xl bg-primary-light/40 p-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary text-white">
            <ShieldCheck size={14} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <Badge
                variant="info"
                className="border-primary/30 bg-white/80 px-1 py-0 text-[9px]"
              >
                {role === "HQ_ADMIN" ? "본사" : "지점"}
              </Badge>
              <p className="truncate text-[12px] font-bold text-content">
                {roleInfo.label}
              </p>
            </div>
            <p className="mt-px truncate text-[10.5px] text-content-tertiary">
              {activeScreen?.title ?? "운영 화면"} · {roleInfo.branchScope}
            </p>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <Link
            href="/login"
            className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-[11px] font-medium text-content-secondary transition-colors hover:bg-white/80 hover:text-content"
          >
            <LogOut size={12} /> 로그아웃
          </Link>
          <Link
            href="/notifications"
            className="relative flex h-8 w-8 items-center justify-center rounded-lg text-content-secondary transition-colors hover:bg-white/80"
          >
            <Bell size={13} />
            <span className="absolute right-0.5 top-0.5 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-primary px-0.5 text-[8.5px] font-black text-white">
              14
            </span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

function Topbar({
  screen,
  role,
  branch,
  setRole,
  setBranch,
  openDialog,
  notify,
}: {
  screen: ScreenDefinition;
  role: RoleId;
  branch: string;
  setRole: (role: RoleId) => void;
  setBranch: (branch: string) => void;
  openDialog: (id: string) => void;
  notify: (message: string, tone?: "success" | "warning" | "info") => void;
}) {
  const [quickSearch, setQuickSearch] = useState("");
  return (
    <header className="relative z-30 flex h-[72px] shrink-0 items-center justify-between border-b border-line/80 bg-white/72 px-6 backdrop-blur-xl">
      {/* Left — 메뉴 + 지점 + 브래드크럼 */}
      <div className="flex min-w-0 items-center gap-3">
        <button className="flex h-9 w-9 items-center justify-center rounded-xl text-content-secondary transition-colors hover:bg-white/75 hover:text-content">
          <Menu size={18} />
        </button>
        <div
          data-testid="global-branch-selector"
          className="app-control flex h-10 items-center gap-2 rounded-2xl px-3"
        >
          <Building2 className="size-4 text-primary" />
          <BranchSelect branch={branch} setBranch={setBranch} compact />
        </div>
        <div className="hidden lg:flex min-w-0 items-center gap-2 text-[12px] text-content-secondary">
          <Badge
            variant="outline"
            className="border-line/80 bg-white/80 text-content-secondary"
          >
            {screen.domain}
          </Badge>
          <Badge
            variant="info"
            className="border-primary/30 bg-primary-light text-primary"
          >
            {screen.id}
          </Badge>
          <ChevronRight className="size-3.5 text-content-tertiary" />
          <div className="min-w-0">
            <div className="truncate text-[13px] font-bold text-content">
              {screen.title}
            </div>
            <div className="truncate text-[11px] text-content-tertiary">
              {screen.route} · mock only
            </div>
          </div>
        </div>
      </div>

      {/* Center — 검색 */}
      <div className="mx-6 hidden flex-1 max-w-[420px] xl:block">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary"
            size={16}
          />
          <input
            className="app-control h-10 w-full rounded-2xl pl-10 pr-3 text-[13px] text-content placeholder:text-content-tertiary outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
            type="text"
            placeholder="화면·문서 빠른 검색..."
            value={quickSearch}
            onChange={(event) => setQuickSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter")
                notify(
                  `${quickSearch || screen.title} 화면/문서 검색 mock`,
                  "info",
                );
            }}
          />
        </div>
      </div>

      {/* Right — 액션 */}
      <div className="flex items-center gap-1.5">
        <RoleSelect role={role} setRole={setRole} compact />
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-content-secondary hover:bg-white/75 hover:text-content"
        >
          <Link href="/dialogs">
            <MessageSquare className="size-4" /> DLG
          </Link>
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
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
            14
          </span>
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

function AdminScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: {
  screen: ScreenDefinition;
  role: RoleId;
  branch: string;
  openDialog: (id: string) => void;
  notify: (message: string, tone?: "success" | "warning" | "info") => void;
}) {
  const roleInfo = roleById.get(role)!;
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  if (screen.id === "SCR-104")
    return (
      <NotificationCenterScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-DLG")
    return (
      <DialogGalleryScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-M001")
    return (
      <MemberListScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-M002")
    return (
      <MemberRegistrationScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-M003")
    return (
      <MemberEditScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-M004")
    return (
      <MemberDetailScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-M005")
    return (
      <MemberTransferScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-M006")
    return (
      <BodyCompositionScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-M007")
    return (
      <MemberMergeScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-M008")
    return (
      <FamilyMembersScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-M010")
    return (
      <MemberSegmentsScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-S001")
    return (
      <SalesOverviewScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-S002")
    return (
      <PosSalesScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-S003")
    return (
      <PaymentProcessingScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-S004")
    return (
      <SalesAnalyticsScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-S006")
    return (
      <DeferredRevenueScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-S007")
    return (
      <RefundManagementScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-S008")
    return (
      <ReceivablesScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-S009")
    return (
      <InstallmentsScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-S010")
    return (
      <TaxInvoiceScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-S012")
    return (
      <CancelRefundScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (["SCR-S005", "SCR-S011"].includes(screen.id))
    return (
      <SalesOperationsScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  // D04 수업관리 specialized
  if (screen.id === "SCR-C001")
    return (
      <ClassCalendarScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-C002")
    return (
      <LessonManagementScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (
    [
      "SCR-C003",
      "SCR-C004",
      "SCR-C006",
      "SCR-C007",
      "SCR-C008",
      "SCR-C009",
      "SCR-C011",
      "SCR-C012",
      "SCR-C013",
      "SCR-C015",
    ].includes(screen.id)
  )
    return (
      <ClassOperationsScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-C005")
    return (
      <GroupClassStatusScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-C010")
    return (
      <ExerciseProgramsScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-C014")
    return (
      <LessonAttendanceScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-C016")
    return (
      <ReservationListScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  // D05 상품관리 specialized
  if (screen.id === "SCR-P001")
    return (
      <ProductManagementScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-P002")
    return (
      <ProductRegistrationScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-P003")
    return (
      <ProductDetailPanelScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-P004")
    return (
      <DiscountSettingsScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-P005")
    return (
      <ProductCatalogScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  // D06 시설관리 specialized
  if (screen.id === "SCR-050")
    return (
      <LockerManagementScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-051")
    return (
      <LockerAssignmentScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-053")
    return (
      <ExerciseRoomScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  // D07 직원관리 specialized
  if (screen.id === "SCR-060")
    return (
      <StaffListScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-062")
    return (
      <StaffResignationScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-063")
    return (
      <StaffAttendanceScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-064")
    return (
      <PayrollManagementScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  // D08 마케팅 specialized
  if (screen.id === "SCR-070")
    return (
      <LeadManagementScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-071")
    return (
      <MessageDispatchScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-073")
    return (
      <CouponManagementScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-077")
    return (
      <ReferralProgramScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-085")
    return (
      <NoticesScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  // D10 본사관리 specialized
  if (screen.id === "SCR-090")
    return (
      <BranchDashboardScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-094")
    return (
      <KpiDashboardScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-H1005")
    return (
      <NpsSurveyScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  // D11 통합운영 specialized
  if (screen.id === "SCR-I001")
    return (
      <UnifiedAttendanceScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (screen.id === "SCR-I004")
    return (
      <ClothingLockerScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );
  if (
    ["D04", "D05", "D06", "D07", "D08", "D09", "D10", "D11"].includes(
      screen.domain,
    )
  )
    return (
      <DomainOperationsScreen
        screen={screen}
        role={role}
        branch={branch}
        openDialog={openDialog}
        notify={notify}
      />
    );

  return (
    <div className="space-y-5">
      <DeliveryHeader screen={screen} role={role} branch={branch} />

      <section className="grid grid-cols-4 gap-3">
        {screen.metrics.map((metric, idx) => {
          const tones = [
            "from-rose-50 to-rose-100/40 border-rose-200/60",
            "from-amber-50 to-amber-100/40 border-amber-200/60",
            "from-sky-50 to-sky-100/40 border-sky-200/60",
            "from-emerald-50 to-emerald-100/40 border-emerald-200/60",
          ];
          return (
            <button
              key={metric.label}
              type="button"
              onClick={() => {
                setSelectedMetric(metric.label);
                notify(`${metric.label} 지표 필터 mock 적용`, "info");
              }}
              className={cn(
                "rounded-2xl border bg-gradient-to-br p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md",
                tones[idx % 4],
                selectedMetric === metric.label && "ring-2 ring-sky-400",
              )}
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                {metric.label}
              </p>
              <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900">
                {metric.value}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">{metric.hint}</p>
            </button>
          );
        })}
        {screen.metrics.length === 0 && (
          <Card className="col-span-4">
            <CardContent className="pt-5 text-sm text-content-secondary">
              로그인 화면은 별도 폼 중심으로 구성됩니다.
            </CardContent>
          </Card>
        )}
      </section>

      <section className="grid gap-5">
        <div className="space-y-5">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>필터 / 탭 / 액션</CardTitle>
              <CardDescription>
                문서의 정보 밀도 높은 Admin UI 원칙에 맞춰 칩, 탭, 테이블
                중심으로 구성했습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {screen.filters.map((filter) => (
                  <Button
                    key={filter}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      notify(`${filter} 필터 chip mock 적용`, "info")
                    }
                  >
                    {filter}
                  </Button>
                ))}
                {role === "HQ_ADMIN" && (
                  <Badge variant="info">전 지점 필터</Badge>
                )}
              </div>
              <Tabs
                defaultValue={screen.tabs[0] ?? "기본"}
                onValueChange={(value) =>
                  notify(`${value} 탭으로 전환`, "info")
                }
              >
                <TabsList className="max-w-full overflow-x-auto no-scrollbar">
                  {screen.tabs.slice(0, 8).map((tab) => (
                    <TabsTrigger key={tab} value={tab}>
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {(screen.tabs.length ? screen.tabs.slice(0, 1) : ["기본"]).map(
                  (tab) => (
                    <TabsContent key={tab} value={tab}>
                      <DataPanel screen={screen} />
                    </TabsContent>
                  ),
                )}
              </Tabs>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>권한별 액션 큐</CardTitle>
              <CardDescription>
                불가 액션은 숨기지 않고 검수 가능하도록 권한 필요 상태와 차단
                toast를 표시합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {screen.primaryActions.map((action) => {
                const allowed = hasPermission(role, action.permission);
                return (
                  <Button
                    key={action.label}
                    data-dialog-id={action.dialogId}
                    variant={
                      action.danger
                        ? "destructive"
                        : allowed
                          ? "default"
                          : "outline"
                    }
                    data-blocked={!allowed}
                    title={
                      !allowed ? `${action.permission} 권한 필요` : undefined
                    }
                    onClick={() => {
                      if (!allowed) {
                        notify(
                          `${action.label}: ${roleInfo.label} 권한으로는 실행할 수 없습니다.`,
                          "warning",
                        );
                        return;
                      }
                      if (action.dialogId) {
                        openDialog(action.dialogId);
                      } else {
                        notify(`${action.label} mock 처리 완료`);
                      }
                    }}
                  >
                    {!allowed && <Lock className="size-4" />}
                    {action.label}
                    {action.policyPending && (
                      <Badge variant="warning">정책</Badge>
                    )}
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

type SpecializedScreenProps = {
  screen: ScreenDefinition;
  role: RoleId;
  branch: string;
  openDialog: (id: string) => void;
  notify: Notify;
};

const memberDirectoryRows = [
  {
    no: "10291",
    statusKey: "ACTIVE",
    status: "활성",
    name: "김민준",
    gender: "남",
    birth: "1991-04-18",
    age: "35",
    phone: "010-1234-5678",
    pass: "PT 20회 · 8회 잔여",
    expiry: "2026-06-28",
    branch: "강남점",
    visit: "오늘 09:20",
    lastVisitDays: 0,
    registered: "2026-01-12",
    owner: "이FC",
    source: "회원소개",
    sourceKey: "referral",
    memberType: "general",
    favorite: true,
    segment: "VIP 재등록",
    messagePlan: "PT 잔여 8회 리텐션",
    nextAction: "오늘 운동 후 재등록 상담",
    purpose: "체중 감량",
  },
  {
    no: "10254",
    statusKey: "IMMINENT",
    status: "임박",
    name: "박서연",
    gender: "여",
    birth: "1994-10-03",
    age: "32",
    phone: "010-2222-8899",
    pass: "회원권 3개월 · D-3",
    expiry: "2026-06-01",
    branch: "강남점",
    visit: "2026-05-12",
    lastVisitDays: 17,
    registered: "2025-11-02",
    owner: "최매니저",
    source: "인스타",
    sourceKey: "instagram",
    memberType: "general",
    favorite: true,
    segment: "재등록 D-3",
    messagePlan: "만료 임박 쿠폰 안내",
    nextAction: "재등록 상담 예약",
    purpose: "재등록 상담",
  },
  {
    no: "10187",
    statusKey: "HOLDING",
    status: "홀딩",
    name: "정하준",
    gender: "남",
    birth: "1988-02-09",
    age: "38",
    phone: "010-7755-4300",
    pass: "수강권 홀딩 · 12일",
    expiry: "2026-07-04",
    branch: "서초점",
    visit: "2026-04-19",
    lastVisitDays: 40,
    registered: "2025-09-21",
    owner: "박트레이너",
    source: "블로그",
    sourceKey: "blog",
    memberType: "corp",
    favorite: false,
    segment: "홀딩 복귀",
    messagePlan: "복귀 예정일 확인",
    nextAction: "홀딩 해제/연장 확인",
    purpose: "재활",
  },
  {
    no: "10044",
    statusKey: "EXPIRED",
    status: "만료",
    name: "오지우",
    gender: "여",
    birth: "1998-07-22",
    age: "28",
    phone: "010-9080-1122",
    pass: "회원권 만료 · 미수 80,000",
    expiry: "2026-04-30",
    branch: "잠실점",
    visit: "2026-03-30",
    lastVisitDays: 60,
    registered: "2025-05-10",
    owner: "이FC",
    source: "당근",
    sourceKey: "daangn",
    memberType: "general",
    favorite: true,
    segment: "이탈 위험",
    messagePlan: "미수/재방문 안내",
    nextAction: "미수 확인 후 재등록 콜",
    purpose: "이탈 위험",
  },
  {
    no: "10308",
    statusKey: "SCHEDULED",
    status: "예정",
    name: "한유나",
    gender: "여",
    birth: "1996-12-11",
    age: "30",
    phone: "010-3310-8820",
    pass: "헬스 6개월 · 시작 예정",
    expiry: "2026-12-02",
    branch: "강남점",
    visit: "미방문",
    lastVisitDays: 999,
    registered: "2026-05-28",
    owner: "김FC",
    source: "지역카페",
    sourceKey: "cafe",
    memberType: "general",
    favorite: false,
    segment: "신규 온보딩",
    messagePlan: "첫 방문 안내",
    nextAction: "OT 예약 확정",
    purpose: "자세 교정",
  },
  {
    no: "10277",
    statusKey: "ACTIVE",
    status: "활성",
    name: "문도윤",
    gender: "남",
    birth: "1984-08-05",
    age: "42",
    phone: "010-6400-2211",
    pass: "법인 PT 30회 · 18회 잔여",
    expiry: "2026-09-14",
    branch: "강남점",
    visit: "2026-05-24",
    lastVisitDays: 5,
    registered: "2025-12-18",
    owner: "윤매니저",
    source: "현수막",
    sourceKey: "banner",
    memberType: "corp",
    favorite: false,
    segment: "법인 VIP",
    messagePlan: "법인 담당자 월간 리포트",
    nextAction: "법인 정산 담당자 확인",
    purpose: "체력 관리",
  },
  {
    no: "10012",
    statusKey: "WITHDRAWN",
    status: "탈퇴",
    name: "서가온",
    gender: "여",
    birth: "1990-01-21",
    age: "36",
    phone: "010-7788-4301",
    pass: "탈퇴 완료 · 개인정보 보관",
    expiry: "2026-02-10",
    branch: "강남점",
    visit: "2026-01-20",
    lastVisitDays: 130,
    registered: "2024-08-02",
    owner: "최매니저",
    source: "간판",
    sourceKey: "signboard",
    memberType: "general",
    favorite: false,
    segment: "탈퇴 보관",
    messagePlan: "발송 금지",
    nextAction: "보관기간 확인",
    purpose: "탈퇴",
  },
  {
    no: "09988",
    statusKey: "INACTIVE",
    status: "미등록",
    name: "권시우",
    gender: "남",
    birth: "2000-05-30",
    age: "26",
    phone: "010-4501-9900",
    pass: "상담 후 결제 대기",
    expiry: "미정",
    branch: "서초점",
    visit: "2026-05-27",
    lastVisitDays: 2,
    registered: "2026-05-27",
    owner: "이FC",
    source: "전단지",
    sourceKey: "flyer",
    memberType: "general",
    favorite: true,
    segment: "결제 대기",
    messagePlan: "결제 링크 리마인드",
    nextAction: "상품구매 화면 연결",
    purpose: "벌크업",
  },
  {
    no: "10321",
    statusKey: "ACTIVE",
    status: "활성",
    name: "장하린",
    gender: "여",
    birth: "1993-09-14",
    age: "33",
    phone: "010-7133-2209",
    pass: "GX 프리패스 · 42일 잔여",
    expiry: "2026-07-10",
    branch: "잠실점",
    visit: "2026-05-26",
    lastVisitDays: 3,
    registered: "2025-10-12",
    owner: "김FC",
    source: "기타",
    sourceKey: "etc",
    memberType: "anon",
    favorite: false,
    segment: "GX 활성",
    messagePlan: "GX 주간 예약 안내",
    nextAction: "예약 누락 여부 확인",
    purpose: "유지",
  },
];

type MemberDirectoryRow = (typeof memberDirectoryRows)[number];
type MemberActionPanel = {
  kind: "message" | "bulk-message" | "favorite" | "export" | "daily-focus";
  title: string;
  member?: MemberDirectoryRow;
  rows: MemberDirectoryRow[];
  body: string;
} | null;

const salesLedgerRows = [
  {
    id: "S-260528-001",
    buyer: "김민준",
    product: "PT 20회",
    gross: "1,200,000",
    discount: "50,000",
    paid: "1,150,000",
    status: "결제완료",
    method: "카드",
    owner: "이FC",
    route: "POS",
    date: "오늘 09:42",
  },
  {
    id: "S-260528-002",
    buyer: "박서연",
    product: "회원권 3개월",
    gross: "450,000",
    discount: "0",
    paid: "330,000",
    status: "미수",
    method: "현금",
    owner: "최매니저",
    route: "수기",
    date: "오늘 11:20",
  },
  {
    id: "S-260527-003",
    buyer: "정하준",
    product: "락커 1개월",
    gross: "30,000",
    discount: "0",
    paid: "30,000",
    status: "환불요청",
    method: "계좌",
    owner: "박트레이너",
    route: "링크",
    date: "어제 17:03",
  },
  {
    id: "S-260526-004",
    buyer: "오지우",
    product: "할부 회원권",
    gross: "900,000",
    discount: "90,000",
    paid: "300,000",
    status: "할부",
    method: "복합",
    owner: "이FC",
    route: "POS",
    date: "05-26 14:10",
  },
];

function HandoffContractCard(props: { screen: ScreenDefinition }) {
  void props;
  // 운영 화면 본문에는 문서/핸드오프 설명을 노출하지 않습니다.
  // 전역 `ScreenSupportDrawer` 사이드바에서 닫고 열 수 있게 제공합니다.
  return null;
}

function DialogDock(props: {
  screen: ScreenDefinition;
  openDialog: (id: string) => void;
}) {
  void props;
  // 운영 화면 본문에는 DLG 목록 카드를 노출하지 않습니다.
  // 전역 `ScreenSupportDrawer` 사이드바에서 확인/실행합니다.
  return null;
}

const supportNotesByScreen: Partial<
  Record<string, { title: string; items: string[] }>
> = {
  "SCR-M003": {
    title: "변경 감지 / 동시 편집",
    items: [
      "동시 편집 충돌(409): 새로고침 후 재시도",
      "네트워크 끊김: localStorage 임시 저장 + 자동 재시도 1회",
      "이미지 5MB 초과·EXIF GPS 자동 제거",
      "광고 동의 철회는 회원 본인 앱에서만",
    ],
  },
};

type SourceCardSource = NonNullable<ReturnType<typeof getScreenPrimarySource>>;

function SourceMiniCard({
  label,
  source,
}: {
  label: string;
  source?: SourceCardSource;
}) {
  if (!source) return null;
  return (
    <div className="rounded-xl border border-line bg-surface-secondary/60 p-3">
      <div className="flex items-center justify-between gap-2">
        <Badge
          variant={
            source.status === "policy-pending"
              ? "warning"
              : source.status === "external-pending"
                ? "destructive"
                : "info"
          }
        >
          {label}
        </Badge>
        <span className="text-[11px] font-semibold text-content-tertiary">
          {source.kind}
        </span>
      </div>
      <div className="mt-2 text-sm font-black text-content">
        {source.id} · {source.label}
      </div>
      <code className="mt-1 block break-all rounded-lg bg-white px-2 py-1 text-[11px] leading-5 text-rose-700">
        {source.source}
      </code>
      {source.referenceSource && (
        <p className="mt-2 text-[11px] leading-5 text-content-tertiary">
          참조: {source.referenceVersion} · {source.referenceSource}
        </p>
      )}
    </div>
  );
}

function SupportListSection({
  title,
  items,
  empty = "문서/레지스트리 항목 없음",
}: {
  title: string;
  items: string[];
  empty?: string;
}) {
  return (
    <section className="mt-4 rounded-2xl border border-line bg-white p-4 shadow-sm">
      <h3 className="text-base font-black text-content">{title}</h3>
      <div className="mt-3 grid gap-2">
        {items.length ? (
          items.slice(0, 12).map((item) => (
            <div
              key={item}
              className="rounded-xl border border-line bg-surface-secondary/60 px-3 py-2 text-sm leading-6 text-content-secondary"
            >
              {item}
            </div>
          ))
        ) : (
          <div className="rounded-xl bg-surface-secondary p-3 text-sm text-content-secondary">
            {empty}
          </div>
        )}
      </div>
    </section>
  );
}

function SupportMatrixSection({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ label: string; value: string }>;
}) {
  return (
    <section className="mt-4 rounded-2xl border border-line bg-white p-4 shadow-sm">
      <h3 className="text-base font-black text-content">{title}</h3>
      <div className="mt-3 divide-y divide-line rounded-xl border border-line">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[112px_minmax(0,1fr)] gap-3 px-3 py-2 text-sm"
          >
            <span className="font-semibold text-content-tertiary">
              {row.label}
            </span>
            <span className="min-w-0 break-words text-content-secondary">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ScreenSupportDrawer({
  screen,
  role,
  openDialog,
}: {
  screen: ScreenDefinition;
  role: RoleId;
  openDialog: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const contract = getScreenContract(screen);
  const linkedDialogs = screen.dialogs
    .map((id) => dialogById.get(id))
    .filter(Boolean) as DialogDefinition[];
  const supportId = `screen-support-${screen.id}`;
  const supportNotes = supportNotesByScreen[screen.id];
  const primarySource = getScreenPrimarySource(screen);
  const secondarySource = getScreenSecondarySource(screen);
  const roleRows = roles.map((item) => ({
    label: item.label,
    value: screen.roleNotes[item.id] ?? item.description,
  }));
  const actionRows = contract.actionContracts.map((action) => ({
    label: action.label,
    value: `${action.mockBehavior} · ${action.blockedReason}${action.auditRequired ? " · audit log 필요" : ""}`,
  }));
  const dialogBlueprints = linkedDialogs.map((dialog) => {
    const v1 = getDialogPrimarySource(dialog);
    const v2 = getDialogSecondarySource(dialog);
    return `${dialog.id} ${dialog.title}: ${dialog.purpose}${v1 ? ` · ${v1.source}` : ""}${v2 ? ` · V2 ${v2.source}` : ""}`;
  });

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (screen.id === "SCR-100") return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-5 top-[104px] z-40 rounded-full border border-line bg-white px-3 py-2 text-[12px] font-bold text-content shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
        aria-controls={supportId}
        aria-expanded={open}
      >
        문서/계약
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[9998]"
          data-testid="screen-support-drawer"
        >
          <button
            className="absolute inset-0 cursor-default bg-black/25 backdrop-blur-[1px]"
            aria-label="문서 사이드바 닫기"
            onClick={() => setOpen(false)}
          />
          <aside
            id={supportId}
            role="dialog"
            aria-modal="true"
            aria-label="문서/계약 사이드바"
            className="absolute right-0 top-0 flex h-full w-[min(520px,92vw)] flex-col border-l border-line bg-white shadow-2xl animate-in slide-in-from-right duration-300"
          >
            <header className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-6 py-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-primary">
                  Publishing support
                </p>
                <h2 className="mt-1 text-[18px] font-black text-content">
                  {screen.id} 문서/계약
                </h2>
                <p className="mt-1 text-xs text-content-tertiary">
                  운영 화면을 방해하지 않도록 설명/DLG/핸드오프는 이
                  사이드바에서만 확인합니다.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
                aria-label="닫기"
              >
                <X size={16} />
              </Button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto bg-surface-secondary/40 px-6 py-5">
              <section className="rounded-2xl border border-line bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline">
                    {getScreenSourceLabel(screen)}
                  </Badge>
                  <Badge
                    variant={
                      contract.handoffStatus === "production-ready"
                        ? "success"
                        : contract.handoffStatus === "template-ready"
                          ? "info"
                          : "warning"
                    }
                  >
                    {contract.handoffStatus}
                  </Badge>
                  {screen.policyPending && (
                    <Badge variant="warning">정책 확인 필요</Badge>
                  )}
                </div>
                <h3 className="mt-3 text-base font-bold text-content">
                  {screen.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-content-secondary">
                  {screen.purpose}
                </p>
              </section>

              <section className="mt-4 rounded-2xl border border-line bg-white p-4 shadow-sm">
                <h3 className="text-base font-black text-content">
                  docs4 V1/V2 출처
                </h3>
                <p className="mt-1 text-xs text-content-tertiary">
                  퍼블리싱 구현은 V1 확정 범위를 우선하고, V2는 정책/보강 참조로
                  표시합니다.
                </p>
                <div className="mt-3 grid gap-3">
                  <SourceMiniCard label="Primary" source={primarySource} />
                  <SourceMiniCard label="Reference" source={secondarySource} />
                  {!primarySource && !secondarySource && (
                    <code className="block break-all rounded-xl bg-surface-secondary px-3 py-2 text-[12px] leading-5 text-rose-700">
                      {screen.source}
                    </code>
                  )}
                </div>
              </section>

              <SupportMatrixSection
                title="화면 구현 기준"
                rows={[
                  { label: "기능코드", value: screen.feature },
                  { label: "라우트", value: screen.route },
                  {
                    label: "탭",
                    value: screen.tabs.length
                      ? screen.tabs.join(" · ")
                      : "단일 화면",
                  },
                  {
                    label: "핵심 지표",
                    value:
                      screen.metrics
                        .map(
                          (metric) =>
                            `${metric.label}=${metric.value}(${metric.hint})`,
                        )
                        .join(" · ") || "없음",
                  },
                  {
                    label: "필터",
                    value: screen.filters.join(" · ") || "없음",
                  },
                  {
                    label: "테이블",
                    value: screen.tableColumns.join(" · ") || "카드/폼 중심",
                  },
                ]}
              />

              <SupportListSection
                title="문서 기준 액션 계약"
                items={actionRows.map((row) => `${row.label}: ${row.value}`)}
                empty="조회 전용 화면입니다."
              />

              <SupportMatrixSection
                title="역할별 표시/권한 메모"
                rows={roleRows}
              />

              <section className="mt-4 rounded-2xl border border-line bg-white p-4 shadow-sm">
                <h3 className="text-base font-black text-content">
                  문서 연결 DLG
                </h3>
                <p className="mt-1 text-xs text-content-tertiary">
                  이 화면에서 열리는 모든 다이얼로그입니다.
                </p>
                <div className="mt-3 grid gap-2">
                  {linkedDialogs.length ? (
                    linkedDialogs.map((dialog) => {
                      const allowed = hasPermission(
                        role,
                        dialog.requiredPermission,
                      );
                      return (
                        <Button
                          key={dialog.id}
                          data-dialog-id={dialog.id}
                          variant="outline"
                          className="min-w-0 justify-between gap-2"
                          onClick={() => openDialog(dialog.id)}
                        >
                          <span className="shrink-0 font-mono text-[12px]">
                            {dialog.id}
                          </span>
                          <span className="min-w-0 truncate text-right">
                            {dialog.title}
                          </span>
                          {!allowed && <Lock className="size-3 shrink-0" />}
                        </Button>
                      );
                    })
                  ) : (
                    <div className="rounded-xl bg-surface-secondary p-3 text-sm text-content-secondary">
                      연결된 DLG가 없습니다.
                    </div>
                  )}
                </div>
              </section>

              <SupportListSection
                title="DLG별 목적/근거"
                items={dialogBlueprints}
                empty="연결된 다이얼로그가 없는 조회 화면입니다."
              />

              <section className="mt-4 rounded-2xl border border-line bg-white p-4 shadow-sm">
                <h3 className="text-base font-black text-content">
                  퍼블리싱 인수 기준
                </h3>
                <div className="mt-3 space-y-2 text-sm leading-6 text-content-secondary">
                  <div>
                    <b className="text-content">퍼블리싱 범위</b>: API 호출 없음
                    · 버튼은 dialog/toast/local state만 실행
                  </div>
                  <div>
                    <b className="text-content">후속 연결 참고</b>:{" "}
                    <code>{contract.apiContracts[0]?.key ?? "미정"}</code>
                  </div>
                  <div>
                    <b className="text-content">상태</b>:{" "}
                    {contract.stateMatrix.slice(0, 5).join(" · ") ||
                      "기본/empty/loading"}
                  </div>
                  <div>
                    <b className="text-content">액션</b>:{" "}
                    {contract.actionContracts
                      .slice(0, 4)
                      .map((action) => action.label)
                      .join(" / ") || "조회 전용"}
                  </div>
                </div>
              </section>

              {supportNotes && (
                <section className="mt-4 rounded-2xl border border-line bg-white p-4 shadow-sm">
                  <h3 className="text-base font-black text-content">
                    {supportNotes.title}
                  </h3>
                  <div className="mt-3 space-y-2 text-sm leading-6 text-content-secondary">
                    {supportNotes.items.map((item) => (
                      <div key={item}>{item}</div>
                    ))}
                  </div>
                </section>
              )}

              <section className="mt-4 rounded-2xl border border-line bg-white p-4 shadow-sm">
                <h3 className="text-base font-black text-content">검수 기준</h3>
                <div className="mt-3 space-y-2 text-sm text-content-secondary">
                  <CheckLine label="API 호출 없이 mock/local state로만 동작" />
                  <CheckLine label="운영 화면 본문에는 기획 설명 카드 미노출" />
                  <CheckLine label="필요 시 이 사이드바를 닫고 다시 열 수 있음" />
                  <CheckLine label="DLG 버튼은 실제 모달 open 또는 mock toast로 연결" />
                </div>
              </section>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function DeliveryHeader({
  screen,
  role,
  branch,
  titleSuffix,
}: {
  screen: ScreenDefinition;
  role: RoleId;
  branch: string;
  titleSuffix?: string;
}) {
  const roleInfo = roleById.get(role)!;
  const status = getScreenContract(screen).handoffStatus;
  const sourceLabel = getScreenSourceLabel(screen);
  return (
    <section className="relative overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div
        className="h-1.5 bg-gradient-to-r from-rose-300 via-amber-200 to-sky-300"
        aria-hidden
      />
      <div className="flex flex-wrap items-start justify-between gap-5 p-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="rounded-full bg-slate-900 px-2.5 py-0.5 font-semibold text-white">
              Screen Publishing
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono font-semibold text-slate-600">
              {sourceLabel}
            </span>
            <span className="rounded-full bg-sky-50 px-2 py-0.5 font-mono font-semibold text-sky-700">
              {screen.id}
            </span>
            <span className="text-slate-500">{screen.feature}</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {screen.title}
            {titleSuffix ? (
              <span className="ml-2 text-xl font-semibold text-slate-500">
                · {titleSuffix}
              </span>
            ) : null}
          </h1>
          <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-600">
            {screen.purpose}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-1.5 text-[11px]">
            <Badge
              variant={
                status === "production-ready"
                  ? "success"
                  : status === "template-ready"
                    ? "info"
                    : "warning"
              }
            >
              {status}
            </Badge>
            {screen.policyPending && (
              <Badge variant="warning">정책 확인 필요</Badge>
            )}
            <Badge variant="outline">DLG 컴포넌트화</Badge>
            <Badge variant="outline">API 호출 없음</Badge>
            <Button
              asChild
              variant="link"
              size="sm"
              className="h-auto px-1 py-0 text-[11px] text-sky-700"
            >
              <Link href="/dialogs">DLG 갤러리 →</Link>
            </Button>
          </div>
        </div>
        <div className="min-w-64 rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-sm">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <UserRound className="size-4" /> {roleInfo.label}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-slate-600">
            <Building2 className="size-3.5" /> {branch} · {roleInfo.branchScope}
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            {screen.roleNotes[role] ?? roleInfo.description}
          </p>
        </div>
      </div>
    </section>
  );
}

function NotificationCenterScreen({
  screen,
  role,
  branch,
  notify,
}: SpecializedScreenProps) {
  const [readAll, setReadAll] = useState(false);
  const canDeleteAll = ["HQ_ADMIN", "OWNER", "MANAGER"].includes(role);
  const notifications = [
    {
      type: "만료 step",
      text: "박서연 회원권 D-3 · 재등록 상담 필요",
      time: "방금",
      target: "/members",
    },
    {
      type: "결제",
      text: "김민준 PT 20회 결제 완료",
      time: "12분 전",
      target: "/sales",
    },
    {
      type: "수업",
      text: "정하준 홀딩 기간 중 예약 충돌",
      time: "38분 전",
      target: "/class-reservations",
    },
    {
      type: "보안",
      text: "강남점 Staff 계정 2FA 재인증",
      time: "오늘 09:10",
      target: "/settings/permissions",
    },
  ];
  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="운영 알림 패널"
      />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>상단 알림 아이콘 클릭 후 열리는 알림 센터</CardTitle>
            <CardDescription>
              문서 기준: 문맥 바로가기, 읽음 처리, 권한별 삭제 액션을
              포함합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {["회원 목록", "메시지 발송", "전자계약", "출석 관리"].map(
                (item) => (
                  <Button
                    key={item}
                    variant="outline"
                    onClick={() => notify(`${item} 바로가기 mock 이동`, "info")}
                  >
                    {item}
                  </Button>
                ),
              )}
            </div>
            <div className="divide-y rounded-xl border">
              {notifications.map((item) => (
                <button
                  key={item.text}
                  type="button"
                  className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-surface-secondary"
                  onClick={() =>
                    notify(
                      `${item.type} 알림 읽음 처리 + ${item.target} 이동 mock`,
                      "info",
                    )
                  }
                >
                  <span>
                    <Badge variant={readAll ? "secondary" : "warning"}>
                      {readAll ? "읽음" : "미읽음"}
                    </Badge>
                    <span className="ml-3 font-medium">{item.text}</span>
                  </span>
                  <span className="text-xs text-content-tertiary">
                    {item.time}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>관리 액션</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                onClick={() => {
                  setReadAll(true);
                  notify("전체 읽음 처리되었습니다.");
                }}
              >
                전체 읽음
              </Button>
              <Button
                className="w-full"
                variant={canDeleteAll ? "destructive" : "outline"}
                onClick={() =>
                  notify(
                    canDeleteAll
                      ? "전체 삭제 mock 완료"
                      : "현재 역할은 전체 삭제 권한이 없습니다.",
                    canDeleteAll ? "success" : "warning",
                  )
                }
              >
                전체 삭제
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => notify("알림 설정 화면 이동 mock", "info")}
              >
                알림 설정
              </Button>
            </CardContent>
          </Card>
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function DialogGalleryScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  const [domain, setDomain] = useState<"D01" | "D02" | "D03">("D02");
  const visibleDialogs = dialogs.filter((dialog) => dialog.domain === domain);
  const statusCount = {
    total: visibleDialogs.length,
    policy: visibleDialogs.filter((dialog) => dialog.policyPending).length,
    blocked: visibleDialogs.filter(
      (dialog) => !hasPermission(role, dialog.requiredPermission),
    ).length,
  };

  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="컴포넌트 검수 갤러리"
      />
      <div className="grid grid-cols-4 gap-3">
        <Card className="shadow-none">
          <CardHeader>
            <CardDescription>현재 그룹</CardDescription>
            <CardTitle>{domain}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-content-tertiary">docs4 V1 기준</p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader>
            <CardDescription>DLG 컴포넌트</CardDescription>
            <CardTitle>{statusCount.total}개</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-content-tertiary">DialogShell 패턴</p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader>
            <CardDescription>정책 확인</CardDescription>
            <CardTitle>{statusCount.policy}개</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-content-tertiary">
              산식/외부연동 보류 표시
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader>
            <CardDescription>역할 차단</CardDescription>
            <CardTitle>{statusCount.blocked}개</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-content-tertiary">
              {roleById.get(role)?.label} 기준
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-5">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>DLG 컴포넌트 목록</CardTitle>
            <CardDescription>
              문자열 팝업이 아니라 실제 모달 UI, 필드, 권한, 정책 상태, 버튼
              mock 동작을 가진 컴포넌트입니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(["D01", "D02", "D03"] as const).map((item) => (
                <Button
                  key={item}
                  variant={domain === item ? "default" : "outline"}
                  onClick={() => setDomain(item)}
                >
                  {item}{" "}
                  {item === "D01"
                    ? "공통"
                    : item === "D02"
                      ? "회원관리"
                      : "매출관리"}
                </Button>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {visibleDialogs.map((dialog) => {
                const kind = getDialogKind(dialog);
                const tone = dialogTone[kind];
                const allowed = hasPermission(role, dialog.requiredPermission);
                return (
                  <button
                    key={dialog.id}
                    data-dialog-id={dialog.id}
                    type="button"
                    className="rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300"
                    onClick={() => {
                      openDialog(dialog.id);
                      notify(`${dialog.id} 컴포넌트 열림`, "info");
                    }}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={tone.badge}>{dialog.id}</Badge>
                      <Badge variant="outline">{tone.label}</Badge>
                      {dialog.policyPending && (
                        <Badge variant="warning">정책 확인</Badge>
                      )}
                      {!allowed && <Badge variant="secondary">권한 차단</Badge>}
                    </div>
                    <div className="mt-3 font-bold text-content">
                      {dialog.title}
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-content-tertiary">
                      {dialog.purpose}
                    </p>
                    <div className="mt-3 rounded-lg bg-surface-secondary px-3 py-2 text-[11px] text-content-tertiary">
                      {dialog.components.slice(0, 3).join(" · ")}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>퍼블리싱 인수 기준</CardTitle>
              <CardDescription>
                계약 범위 안에서 납품/검수할 퍼블리싱 기준입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-content-secondary">
              {[
                "모든 DLG는 id/source/권한/정책 상태를 가진다",
                "버튼은 실제 API 없이 toast/local state로만 동작한다",
                "정책 미확정은 임의 확정하지 않고 배지와 안내문으로 남긴다",
                "퍼블리싱은 handler 연결 지점만 표시하고 실제 service/API는 구현하지 않는다",
              ].map((item) => (
                <div key={item} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 text-emerald-600" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function MemberListScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  // admin-pando members/page.tsx 구조 1:1 이식
  const [activeMainTab, setActiveMainTab] = useState<
    "members" | "product" | "pass" | "locker" | "clothes"
  >("members");
  const [activeStatusTab, setActiveStatusTab] = useState("all");
  const [activeSavedView, setActiveSavedView] = useState(
    "consultation-history",
  );
  const [searchValue, setSearchValue] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detail, setDetail] = useState(memberDirectoryRows[0]);
  const [hideExpired, setHideExpired] = useState(false);
  const [onlyFavorite, setOnlyFavorite] = useState(false);
  const [daysNoVisit, setDaysNoVisit] = useState("0");
  const [memberType, setMemberType] = useState("all");
  const [referralSource, setReferralSource] = useState("all");
  const [detailPanelEnabled, setDetailPanelEnabled] = useState(true);
  const [actionPanel, setActionPanel] = useState<MemberActionPanel>(null);
  const [favoriteOverrides, setFavoriteOverrides] = useState<
    Record<string, boolean>
  >({});
  const [lastFlow, setLastFlow] = useState("목록 조회 · 회원 선택 대기");

  const isFavorite = (row: MemberDirectoryRow) =>
    favoriteOverrides[row.no] ?? row.favorite;
  const enrichedRows = memberDirectoryRows.map((row) => ({
    ...row,
    favorite: isFavorite(row),
  }));

  // docs4 V1 SCR-M001 명시 운영 보기 탭 5개 (회원목록/회원권/수강권/락커/운동복)
  const MAIN_TABS = [
    { key: "members" as const, label: "회원 목록" },
    { key: "product" as const, label: "회원권 목록" },
    { key: "pass" as const, label: "수강권 목록" },
    { key: "locker" as const, label: "락커 목록" },
    { key: "clothes" as const, label: "운동복 목록" },
  ];

  // docs4 V1 명시 저장 뷰 탭 4개 (상담내역/상담예약/재등록대상/고객관리)
  const SAVED_VIEW_TABS = [
    { key: "consultation-history", label: "상담내역", count: 12 },
    { key: "consultation-scheduled", label: "상담예약", count: 5 },
    { key: "renewal-target", label: "재등록대상", count: 184 },
    { key: "legacy-customers", label: "고객관리", count: 96 },
  ];

  // docs4 V1 SCR-M001 명시 상태 필터 탭 8개 (전체/활성/만료/예정/임박/홀딩/미등록/탈퇴)
  const STATUS_TABS = [
    { key: "all", label: "전체", count: enrichedRows.length },
    {
      key: "ACTIVE",
      label: "활성",
      count: enrichedRows.filter((row) => row.statusKey === "ACTIVE").length,
    },
    {
      key: "EXPIRED",
      label: "만료",
      count: enrichedRows.filter((row) => row.statusKey === "EXPIRED").length,
    },
    {
      key: "SCHEDULED",
      label: "예정",
      count: enrichedRows.filter((row) => row.statusKey === "SCHEDULED").length,
    },
    {
      key: "IMMINENT",
      label: "임박",
      count: enrichedRows.filter((row) => row.statusKey === "IMMINENT").length,
    },
    {
      key: "HOLDING",
      label: "홀딩",
      count: enrichedRows.filter((row) => row.statusKey === "HOLDING").length,
    },
    {
      key: "INACTIVE",
      label: "미등록",
      count: enrichedRows.filter((row) => row.statusKey === "INACTIVE").length,
    },
    {
      key: "WITHDRAWN",
      label: "탈퇴",
      count: enrichedRows.filter((row) => row.statusKey === "WITHDRAWN").length,
    },
  ];

  const rows = enrichedRows.filter((row) => {
    const q = searchValue.trim();
    const matchedSearch =
      q.length === 0 ||
      `${row.name} ${row.phone} ${row.pass} ${row.status} ${row.segment} ${row.source}`.includes(
        q,
      );
    const matchedStatus =
      activeStatusTab === "all" || row.statusKey === activeStatusTab;
    const matchedFavorite = !onlyFavorite || row.favorite;
    const matchedNoVisit =
      daysNoVisit === "0" || row.lastVisitDays > Number(daysNoVisit);
    const matchedMemberType =
      memberType === "all" || row.memberType === memberType;
    const matchedSource =
      referralSource === "all" || row.sourceKey === referralSource;
    const matchedExpired = !hideExpired || row.statusKey !== "EXPIRED";
    const matchedSavedView =
      activeSavedView === "consultation-history" ||
      (activeSavedView === "consultation-scheduled" &&
        ["IMMINENT", "INACTIVE", "SCHEDULED"].includes(row.statusKey)) ||
      (activeSavedView === "renewal-target" &&
        ["IMMINENT", "EXPIRED"].includes(row.statusKey)) ||
      (activeSavedView === "legacy-customers" &&
        ["HOLDING", "WITHDRAWN"].includes(row.statusKey));
    return (
      matchedSearch &&
      matchedStatus &&
      matchedFavorite &&
      matchedNoVisit &&
      matchedMemberType &&
      matchedSource &&
      matchedExpired &&
      matchedSavedView
    );
  });
  const filtered = rows;
  const selectedRows = filtered.filter((row) => selected.has(row.no));
  const openMemberAction = (
    kind: NonNullable<MemberActionPanel>["kind"],
    title: string,
    body: string,
    targetRows: MemberDirectoryRow[] = selectedRows.length
      ? selectedRows
      : detail
        ? [detail]
        : [],
    member?: MemberDirectoryRow,
  ) => {
    setActionPanel({ kind, title, body, rows: targetRows, member });
    setLastFlow(title);
  };
  const toggleSelected = (no: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(no)) next.delete(no);
      else next.add(no);
      return next;
    });

  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="회원 목록 (admin-pando 구조)"
      />

      {/* PageHeader — admin-pando 1:1 */}
      <div className="flex items-end justify-between border-b border-line/60 pb-4">
        <div>
          <h1 className="text-[24px] font-black tracking-tight text-content">
            회원 관리
          </h1>
          <p className="mt-1 text-[13px] text-content-secondary">
            활성·만료·홀딩·이탈 회원을 통합 조회하고 일괄 처리합니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              openMemberAction(
                "export",
                "회원 목록 Excel 다운로드 준비",
                "현재 필터·저장뷰·선택 상태를 기준으로 내보내기 요청 payload를 구성합니다. 실제 파일 생성/API 호출은 개발사 연결 영역입니다.",
                filtered,
              )
            }
          >
            Excel 다운로드
          </Button>
          <Button asChild size="sm">
            <Link href="/members/new">+ 회원 등록</Link>
          </Button>
        </div>
      </div>

      {/* Daily Focus + Action Queue — admin-pando 1:1 */}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.95fr)]">
        <section className="rounded-2xl border border-line bg-surface p-5 shadow-card">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-content-tertiary">
              Daily Focus
            </p>
            <h2 className="mt-1 text-[18px] font-bold text-content">
              오늘 회원 운영 집중
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-content-secondary">
              재등록·이탈위험·관심회원을 한 번에 점검합니다.
            </p>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-3">
            <button
              className="rounded-xl border border-amber-300/50 bg-amber-50 p-3 text-left transition-colors hover:bg-amber-100"
              onClick={() => {
                setActiveSavedView("renewal-target");
                setActiveStatusTab("IMMINENT");
                setDaysNoVisit("0");
                setOnlyFavorite(false);
                setLastFlow("재등록 집중 보기 · 임박/만료 회원 필터");
              }}
            >
              <p className="text-[12px] font-semibold text-amber-800">
                재등록 집중 보기
              </p>
              <p className="mt-0.5 text-[22px] font-bold tabular-nums text-content">
                92명
              </p>
              <p className="mt-0.5 text-[12px] text-content-secondary">
                30일 이내 만료 임박
              </p>
            </button>
            <button
              className="rounded-xl border border-rose-300/50 bg-rose-50 p-3 text-left transition-colors hover:bg-rose-100"
              onClick={() => {
                setActiveSavedView("consultation-history");
                setActiveStatusTab("all");
                setDaysNoVisit("14");
                setOnlyFavorite(false);
                setLastFlow("이탈 위험 보기 · 14일 이상 미방문 필터");
              }}
            >
              <p className="text-[12px] font-semibold text-rose-800">
                이탈 위험 보기
              </p>
              <p className="mt-0.5 text-[22px] font-bold tabular-nums text-content">
                38명
              </p>
              <p className="mt-0.5 text-[12px] text-content-secondary">
                14일 이상 미방문 회원
              </p>
            </button>
            <button
              className="rounded-xl border border-sky-300/50 bg-sky-50 p-3 text-left transition-colors hover:bg-sky-100"
              onClick={() => {
                setActiveSavedView("consultation-history");
                setActiveStatusTab("all");
                setOnlyFavorite(true);
                setLastFlow("관심회원 보기 · favorite 필터");
              }}
            >
              <p className="text-[12px] font-semibold text-sky-800">
                관심회원 보기
              </p>
              <p className="mt-0.5 text-[22px] font-bold tabular-nums text-content">
                24명
              </p>
              <p className="mt-0.5 text-[12px] text-content-secondary">
                후속 관리 우선 대상
              </p>
            </button>
          </div>
        </section>

        <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
          <p className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-content-tertiary">
            Action Queue
          </p>
          <div className="grid gap-2">
            <Button
              variant="default"
              size="sm"
              className="justify-start"
              onClick={() =>
                openMemberAction(
                  "bulk-message",
                  "선택 회원 메시지 발송",
                  selectedRows.length
                    ? "선택된 회원을 수신자로 고정해 메시지 작성 화면으로 넘기는 전 단계입니다."
                    : "선택 회원이 없으면 현재 상세 패널 회원 1명을 기본 수신자로 사용합니다.",
                )
              }
            >
              <MessageSquare size={13} /> 선택 회원 메시지 발송
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="justify-start"
              onClick={() => {
                setLastFlow("선택 회원 상태 변경 · DLG-M001");
                openDialog("DLG-M001");
              }}
            >
              <ChevronRight size={13} /> 선택 회원 상태 변경
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="justify-start"
              onClick={() => {
                setLastFlow("선택 회원 수동 출석 · DLG-M022");
                openDialog("DLG-M022");
              }}
            >
              <CheckCircle2 size={13} /> 선택 회원 수동 출석
            </Button>
            <div className="rounded-xl bg-surface-secondary/70 px-3 py-2 text-[12px] text-content-secondary">
              {selected.size > 0
                ? `${selected.size}명 선택됨`
                : "회원을 선택하면 액션 큐에서 메시지·상태변경·출석을 실행할 수 있습니다."}
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-[12px] text-blue-800">
              최근 흐름: <b>{lastFlow}</b>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 탭 — admin-pando TabNav 1:1 */}
      <div className="flex gap-6 border-b border-line">
        {MAIN_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveMainTab(tab.key)}
            className={cn(
              "relative pb-2.5 text-[13px] font-medium transition-colors",
              activeMainTab === tab.key
                ? "text-primary"
                : "text-content-secondary hover:text-content",
            )}
          >
            {tab.label}
            {activeMainTab === tab.key && (
              <div className="absolute -bottom-px left-0 right-0 h-0.5 rounded-t-full bg-primary" />
            )}
          </button>
        ))}
      </div>

      {activeMainTab === "members" && (
        <div className="space-y-3">
          {/* 저장뷰 칩 + 출석시 상세 팝업 토글 — admin-pando 1:1 */}
          <div className="flex flex-col gap-2 rounded-2xl border border-line bg-surface px-5 py-3 shadow-card lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {SAVED_VIEW_TABS.map((tab) => (
                <button
                  key={tab.key}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors",
                    activeSavedView === tab.key
                      ? "bg-primary text-white"
                      : "bg-surface-secondary text-content-secondary hover:text-content",
                  )}
                  onClick={() => setActiveSavedView(tab.key)}
                >
                  {tab.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-px text-[10px] font-bold tabular-nums",
                      activeSavedView === tab.key
                        ? "bg-white/20 text-white"
                        : "bg-white text-content-secondary",
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 self-start rounded-full bg-surface-secondary px-3 py-1.5 text-[12px] font-medium text-content-secondary lg:self-auto">
              <input
                type="checkbox"
                className="h-4 w-4 rounded accent-primary"
                checked={detailPanelEnabled}
                onChange={(e) => setDetailPanelEnabled(e.target.checked)}
              />
              출석시 상세 팝업
            </label>
          </div>

          <div
            className={cn(
              "grid gap-4",
              detailPanelEnabled
                ? "xl:grid-cols-[minmax(0,1fr)_340px]"
                : "grid-cols-1",
            )}
          >
            <div className="overflow-hidden rounded-xl border border-line bg-surface">
              {/* 상태 필터 탭 — admin-pando 1:1 */}
              <div className="border-b border-line px-5 pt-3">
                <div className="relative">
                  <div className="flex gap-6 overflow-x-auto scrollbar-hide">
                    {STATUS_TABS.map((tab) => (
                      <button
                        key={tab.key}
                        className={cn(
                          "relative flex items-center gap-1.5 whitespace-nowrap pb-2.5 text-[13px] font-medium transition-colors",
                          activeStatusTab === tab.key
                            ? "text-primary"
                            : "text-content-secondary hover:text-content",
                        )}
                        onClick={() => {
                          setActiveStatusTab(tab.key);
                          setLastFlow(`${tab.label} 상태 필터 적용`);
                        }}
                      >
                        {tab.label}
                        <span
                          className={cn(
                            "rounded-full px-1.5 py-px text-[10px] font-semibold tabular-nums",
                            activeStatusTab === tab.key
                              ? "bg-primary text-white"
                              : "bg-surface-tertiary text-content-secondary",
                          )}
                        >
                          {tab.count}
                        </span>
                        {activeStatusTab === tab.key && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 검색/필터 — admin-pando 1:1 */}
              <div className="border-b border-line p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative max-w-md flex-1">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary"
                      size={14}
                    />
                    <Input
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="회원명, 연락처 검색..."
                      className="pl-8 h-9"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchValue("");
                      setSelected(new Set());
                      setActiveStatusTab("all");
                      setActiveSavedView("consultation-history");
                      setHideExpired(false);
                      setOnlyFavorite(false);
                      setDaysNoVisit("0");
                      setMemberType("all");
                      setReferralSource("all");
                      setLastFlow("필터 초기화");
                    }}
                  >
                    초기화
                  </Button>
                </div>

                {/* 추가 필터 행 — admin-pando 1:1 */}
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <label className="flex cursor-pointer items-center gap-1.5 select-none">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded accent-primary"
                      checked={onlyFavorite}
                      onChange={(e) => setOnlyFavorite(e.target.checked)}
                    />
                    <span className="flex items-center gap-1 text-[13px] text-content-secondary">
                      <span className="text-yellow-400">★</span> 관심회원만
                    </span>
                  </label>
                  <div className="h-4 w-px bg-line" />

                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] text-content-secondary">
                      미방문
                    </span>
                    <Select value={daysNoVisit} onValueChange={setDaysNoVisit}>
                      <SelectTrigger className="h-8 w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">전체</SelectItem>
                        <SelectItem value="7">7일 초과</SelectItem>
                        <SelectItem value="14">14일 초과</SelectItem>
                        <SelectItem value="30">30일 초과</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="h-4 w-px bg-line" />

                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] text-content-secondary">
                      회원구분
                    </span>
                    <Select value={memberType} onValueChange={setMemberType}>
                      <SelectTrigger className="h-8 w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="general">일반</SelectItem>
                        <SelectItem value="corp">기명법인</SelectItem>
                        <SelectItem value="anon">무기명법인</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="h-4 w-px bg-line" />

                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] text-content-secondary">
                      가입경로
                    </span>
                    {/* docs4 V1 SCR-M001 명시 9종: 간판/블로그/인스타/당근/지역카페/현수막/전단지/회원소개/기타 */}
                    <Select
                      value={referralSource}
                      onValueChange={setReferralSource}
                    >
                      <SelectTrigger className="h-8 w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="signboard">간판</SelectItem>
                        <SelectItem value="blog">블로그</SelectItem>
                        <SelectItem value="instagram">인스타</SelectItem>
                        <SelectItem value="daangn">당근</SelectItem>
                        <SelectItem value="cafe">지역카페</SelectItem>
                        <SelectItem value="banner">현수막</SelectItem>
                        <SelectItem value="flyer">전단지</SelectItem>
                        <SelectItem value="referral">회원소개</SelectItem>
                        <SelectItem value="etc">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="h-4 w-px bg-line" />

                  <label className="flex cursor-pointer items-center gap-1.5 select-none">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded accent-primary"
                      checked={hideExpired}
                      onChange={(e) => setHideExpired(e.target.checked)}
                    />
                    <span className="text-[13px] text-content-secondary">
                      만료 숨기기
                    </span>
                  </label>
                </div>
              </div>

              {/* Bulk 액션 바 — admin-pando 1:1 */}
              {selected.size > 0 && (
                <div className="flex items-center justify-between bg-primary px-5 py-2 text-white">
                  <div className="flex items-center gap-4">
                    <span className="text-[13px] font-semibold">
                      {selected.size}명 선택됨
                    </span>
                    <div className="h-3 w-px bg-white/20" />
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/90 hover:bg-white/10 hover:text-white"
                        onClick={() => {
                          setLastFlow("일괄 상태 변경 · DLG-M001");
                          openDialog("DLG-M001");
                        }}
                      >
                        상태 변경
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/90 hover:bg-white/10 hover:text-white"
                        onClick={() =>
                          openMemberAction(
                            "bulk-message",
                            "일괄 메시지 전송",
                            "선택 회원을 수신자 그룹으로 묶어 메시지 화면에 넘기는 전 단계입니다.",
                          )
                        }
                      >
                        전송하기
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/90 hover:bg-white/10 hover:text-white"
                        onClick={() => {
                          setLastFlow("일괄 수동 출석 · DLG-M022");
                          openDialog("DLG-M022");
                        }}
                      >
                        출석 처리
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/90 hover:bg-white/10 hover:text-white"
                        onClick={() => {
                          setFavoriteOverrides((current) => {
                            const next = { ...current };
                            selectedRows.forEach((row) => {
                              next[row.no] = true;
                            });
                            return next;
                          });
                          openMemberAction(
                            "favorite",
                            "관심회원 일괄 등록",
                            "선택된 회원을 관심회원으로 표시하고 관심회원 필터에서 바로 확인할 수 있습니다.",
                          );
                        }}
                      >
                        관심회원
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/90 hover:bg-white/10 hover:text-white"
                        asChild={selected.size === 1}
                        onClick={() => {
                          if (selected.size !== 1) {
                            notify(
                              "지점이관은 1명 선택 시에만 가능합니다.",
                              "warning",
                            );
                            return;
                          }
                          setLastFlow("단일 회원 지점이관 전용 화면 이동");
                        }}
                      >
                        {selected.size === 1 ? (
                          <Link
                            href={`/members/transfer?memberId=${selectedRows[0]?.no ?? detail.no}`}
                          >
                            지점이관
                          </Link>
                        ) : (
                          "지점이관"
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/70 hover:text-white"
                    onClick={() => setSelected(new Set())}
                  >
                    선택 취소
                  </Button>
                </div>
              )}

              {/* 테이블 — admin-pando 1:1 */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded accent-primary"
                          checked={
                            selected.size === filtered.length &&
                            filtered.length > 0
                          }
                          onChange={(e) =>
                            setSelected(
                              e.target.checked
                                ? new Set(filtered.map((r) => r.no))
                                : new Set(),
                            )
                          }
                        />
                      </TableHead>
                      <TableHead className="w-10">★</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>세그먼트</TableHead>
                      <TableHead>회원명</TableHead>
                      <TableHead>소속 지점</TableHead>
                      <TableHead>성별</TableHead>
                      <TableHead>생년월일</TableHead>
                      <TableHead>연락처</TableHead>
                      <TableHead>이용권</TableHead>
                      <TableHead>만료일</TableHead>
                      <TableHead>등록일</TableHead>
                      <TableHead>이관</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((row) => (
                      <TableRow
                        key={row.no}
                        className={cn(
                          "cursor-pointer",
                          selected.has(row.no) && "bg-primary-light/30",
                        )}
                        onClick={() => {
                          setDetail(row);
                          setDetailPanelEnabled(true);
                          setLastFlow(`${row.name} Quick Member View 열림`);
                        }}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded accent-primary"
                            checked={selected.has(row.no)}
                            onChange={() => toggleSelected(row.no)}
                          />
                        </TableCell>
                        <TableCell>
                          <button
                            className="text-content-tertiary hover:text-yellow-400 text-[16px]"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFavoriteOverrides((current) => ({
                                ...current,
                                [row.no]: !row.favorite,
                              }));
                              setLastFlow(`${row.name} 관심회원 토글`);
                            }}
                          >
                            {row.favorite ? "★" : "☆"}
                          </button>
                        </TableCell>
                        <TableCell>{statusAwareValue(row.status)}</TableCell>
                        <TableCell>
                          <span className="inline-block rounded bg-blue-100 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                            {row.segment}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {row.name}
                        </TableCell>
                        <TableCell className="text-[12px] text-content-secondary">
                          {row.branch}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.gender}
                        </TableCell>
                        <TableCell className="tabular-nums">
                          {row.birth}
                        </TableCell>
                        <TableCell className="tabular-nums">
                          {row.phone}
                        </TableCell>
                        <TableCell>{row.pass}</TableCell>
                        <TableCell className="tabular-nums">
                          {row.expiry}
                        </TableCell>
                        <TableCell className="tabular-nums">
                          {row.registered}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link href={`/members/transfer?memberId=${row.no}`}>
                              이관
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* 페이지네이션 */}
              <div className="flex items-center justify-between border-t border-line px-5 py-3">
                <span className="text-[12px] text-content-secondary">
                  1-{filtered.length} of {filtered.length}
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    이전
                  </Button>
                  <Button variant="outline" size="sm">
                    1
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    다음
                  </Button>
                </div>
              </div>
            </div>

            {/* 우측 상세 패널 — admin-pando 1:1 */}
            {detailPanelEnabled && (
              <aside className="rounded-2xl border border-line bg-surface p-5 shadow-card sticky top-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.14em] text-content-tertiary">
                      Quick Member View
                    </p>
                    <h3 className="mt-0.5 text-[18px] font-bold text-content">
                      {detail.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-1.5">
                      {statusAwareValue(detail.status)}
                      <span className="inline-block rounded bg-blue-100 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                        {detail.segment}
                      </span>
                    </div>
                  </div>
                  <button
                    className="text-[12px] font-medium text-content-secondary hover:text-content"
                    onClick={() => {
                      setDetailPanelEnabled(false);
                      setLastFlow("Quick Member View 닫힘");
                    }}
                  >
                    닫기
                  </button>
                </div>

                <div className="mt-3 space-y-2 rounded-2xl bg-surface-secondary p-3 text-[13px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-content-secondary">연락처</span>
                    <span className="font-semibold text-content tabular-nums">
                      {detail.phone}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-content-secondary">소속 지점</span>
                    <span className="font-semibold text-content">
                      {detail.branch}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-content-secondary">최근 방문</span>
                    <span className="font-semibold text-content">
                      {detail.visit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-content-secondary">이용권</span>
                    <span className="font-semibold text-content">
                      {detail.pass}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-content-secondary">담당 FC</span>
                    <span className="font-semibold text-content">
                      {detail.owner}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-content-secondary">가입경로</span>
                    <span className="font-semibold text-content">
                      {detail.source}
                    </span>
                  </div>
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">
                    <p className="text-[11px] font-black">다음 운영 액션</p>
                    <p className="mt-1 text-[12px] leading-5">
                      {detail.nextAction}
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid gap-2">
                  <Button size="sm" asChild>
                    <Link href={`/members/detail?memberId=${detail.no}`}>
                      상세 보기
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/sales/payment?memberId=${detail.no}`}>
                      상품구매
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/message?memberId=${detail.no}`}>메시지</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/body-composition?memberId=${detail.no}`}>
                      체성분
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/members/transfer?memberId=${detail.no}`}>
                      지점이관
                    </Link>
                  </Button>
                </div>
              </aside>
            )}
          </div>
        </div>
      )}

      {activeMainTab === "product" && (
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>보유상품별 회원</CardTitle>
            <CardDescription>
              회원권/PT/GX/락커 등 보유 상품 기준 분류
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { type: "회원권", count: 1024 },
              { type: "수강권(PT)", count: 482 },
              { type: "수강권(GX)", count: 386 },
              { type: "락커", count: 218 },
              { type: "운동복", count: 96 },
            ].map((g) => (
              <div
                key={g.type}
                className="rounded-xl border border-line bg-surface p-3"
              >
                <span className="text-[12px] font-semibold text-content-secondary">
                  {g.type}
                </span>
                <p className="mt-1 text-[22px] font-bold tabular-nums text-content">
                  {g.count}
                  <span className="ml-1 text-[13px] font-normal text-content-secondary">
                    명
                  </span>
                </p>
                <span className="text-[11px] text-content-tertiary">
                  활성 {Math.floor(g.count * 0.78)}명
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {activeMainTab === "pass" && (
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>이용권 목록</CardTitle>
            <CardDescription>
              유효 이용권 기준 회원 목록 (docs4 V1)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>회원명</TableHead>
                    <TableHead>소속 지점</TableHead>
                    <TableHead>이용권</TableHead>
                    <TableHead>시작일</TableHead>
                    <TableHead>만료일</TableHead>
                    <TableHead>D-Day</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memberDirectoryRows.map((row) => (
                    <TableRow key={row.no}>
                      <TableCell className="font-semibold">
                        {row.name}
                      </TableCell>
                      <TableCell>{row.branch}</TableCell>
                      <TableCell>{row.pass}</TableCell>
                      <TableCell className="tabular-nums">
                        {row.registered}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {row.visit}
                      </TableCell>
                      <TableCell>
                        <Badge variant="warning">D-3</Badge>
                      </TableCell>
                      <TableCell>{statusAwareValue(row.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeMainTab === "locker" && (
        <OperationalTable
          title="락커 이용 회원"
          description="회원관리 탭 안에서 락커 보유 회원을 바로 확인하고 상세/이관/연장 흐름으로 이어갑니다."
          columns={["회원명", "락커", "만료일", "상태", "다음 액션"]}
          rows={[
            ["김민준", "A-12", "2026-06-18", "정상", "연장 안내"],
            ["박서연", "B-03", "2026-06-01", "임박", "재등록 상담"],
            ["문도윤", "법인-07", "2026-09-14", "정상", "법인 정산 확인"],
          ]}
          action={
            <Button size="sm" onClick={() => openDialog("DLG-M018")}>
              락커 연장 등록
            </Button>
          }
        />
      )}

      {activeMainTab === "clothes" && (
        <OperationalTable
          title="운동복 이용 회원"
          description="운동복 대여/반납 상태를 회원 맥락에서 확인하는 운영 뷰입니다."
          columns={["회원명", "상품", "반납 상태", "마지막 처리", "액션"]}
          rows={[
            ["장하린", "운동복 월정액", "정상", "2026-05-26", "이용내역"],
            ["오지우", "운동복 1개월", "연체", "2026-03-30", "미수 안내"],
            ["김민준", "운동복 3개월", "정상", "오늘 09:20", "연장 안내"],
          ]}
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                openMemberAction(
                  "daily-focus",
                  "운동복 미수/연체 점검",
                  "운동복 상태는 회원 상세·결제·메시지로 이어지는 보조 운영 큐입니다.",
                  enrichedRows.filter((row) => row.statusKey !== "WITHDRAWN"),
                )
              }
            >
              연체 점검
            </Button>
          }
        />
      )}

      <AdminSlidePanel
        open={Boolean(actionPanel)}
        onClose={() => setActionPanel(null)}
        eyebrow="SCR-M001 LOCAL FLOW"
        title={actionPanel?.title ?? "회원관리 액션"}
        size="md"
        testId="member-action-panel"
        footer={
          actionPanel ? (
            <>
              <Button variant="outline" onClick={() => setActionPanel(null)}>
                닫기
              </Button>
              {["message", "bulk-message"].includes(actionPanel.kind) ? (
                <Button asChild>
                  <Link
                    href={`/message?memberIds=${actionPanel.rows
                      .map((row) => row.no)
                      .join(",")}`}
                  >
                    메시지 작성으로 이동
                  </Link>
                </Button>
              ) : (
                <Button onClick={() => setActionPanel(null)}>상태 확인</Button>
              )}
            </>
          ) : null
        }
      >
        {actionPanel ? (
          <div className="space-y-4">
            <Card className="shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">운영 액션 결과</CardTitle>
                <CardDescription>{actionPanel.body}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 text-xs">
                {[
                  ["현재 지점", branch],
                  ["담당 역할", roleById.get(role)?.label ?? role],
                  ["선택 회원", `${actionPanel.rows.length}명`],
                  [
                    "연결 정책",
                    "API 호출 없음 · local state/route/dialog만 표시",
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-xl border border-line bg-white px-3 py-2"
                  >
                    <span className="font-bold text-content-tertiary">
                      {label}
                    </span>
                    <span className="font-semibold text-content">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">대상 회원</CardTitle>
                <CardDescription>
                  구현사 연동 시 memberIds preselect payload로 넘길 목록입니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {actionPanel.rows.slice(0, 8).map((row) => (
                  <div
                    key={row.no}
                    className="rounded-xl border border-line bg-white p-3 text-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <b>{row.name}</b>
                      {statusAwareValue(row.status)}
                    </div>
                    <p className="mt-1 text-xs text-content-secondary">
                      {row.phone} · {row.pass} · {row.nextAction}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </AdminSlidePanel>

      {/* 검수용 핸드오프 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <HandoffContractCard screen={screen} />
        <DialogDock screen={screen} openDialog={openDialog} />
      </div>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white p-2">
      <div className="text-content-tertiary">{label}</div>
      <div className="mt-1 font-semibold text-content">{value}</div>
    </div>
  );
}

function MemberRegistrationScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("여성");
  const [memberType, setMemberType] = useState("일반");
  const [phoneChecked, setPhoneChecked] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const canNext =
    name.trim().length > 1 && phone.trim().length >= 8 && phoneChecked;
  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="2단계 회원 등록"
      />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Step {step} / 2</CardTitle>
            <CardDescription>
              결제 완료 후 회원 등록이 확정됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-2 text-sm xl:grid-cols-4">
              {[
                ["1", "기본 인적 사항", step === 1],
                ["2", "전화번호 중복 확인", phoneChecked],
                ["3", "추가 정보", step === 2],
                ["4", "결제 진입", step === 2 && draftSaved],
              ].map(([no, label, active]) => (
                <div
                  key={String(no)}
                  className={cn(
                    "rounded-lg border p-3",
                    active && "border-blue-400 bg-blue-50",
                  )}
                >
                  {no}. {label}
                </div>
              ))}
            </div>
            {step === 1 ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>이름 *</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="홍길동"
                  />
                  {name && name.length < 2 && (
                    <p className="text-xs text-rose-600">
                      이름은 2자 이상 입력합니다.
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>성별 *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setGender("남성")}
                      className={gender === "남성" ? "border-primary" : ""}
                    >
                      남성
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setGender("여성")}
                      className={gender === "여성" ? "border-primary" : ""}
                    >
                      여성
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>연락처 *</Label>
                  <div className="flex gap-2">
                    <Input
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setPhoneChecked(false);
                      }}
                      placeholder="010-0000-0000"
                    />
                    <Button
                      data-dialog-id="DLG-M006"
                      variant="outline"
                      onClick={() => {
                        setPhoneChecked(true);
                        openDialog("DLG-M006");
                      }}
                    >
                      중복 확인
                    </Button>
                  </div>
                  {phone && (
                    <p
                      className={cn(
                        "text-xs",
                        phoneChecked ? "text-emerald-600" : "text-amber-600",
                      )}
                    >
                      {phoneChecked
                        ? "DLG-M006 중복 확인 완료 · 다음 단계 가능"
                        : "전화번호 변경 시 중복 확인이 다시 필요합니다."}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>회원구분 *</Label>
                  <Select value={memberType} onValueChange={setMemberType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["일반", "기명법인", "무기명법인"].map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {memberType !== "일반" && (
                  <div className="col-span-2 space-y-1">
                    <Label>법인 회사명</Label>
                    <Input placeholder="법인 회사명" />
                  </div>
                )}
                <div className="col-span-2 grid grid-cols-3 gap-3">
                  <Input placeholder="소속지점" defaultValue={branch} />
                  <Input placeholder="담당 FC" defaultValue="이FC" />
                  <Input placeholder="운동 목적" defaultValue="체중 감량" />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="별칭/닉네임" />
                  <Input placeholder="이메일" />
                  <div className="flex gap-2">
                    <Input placeholder="주소" />
                    <Button
                      data-dialog-id="DLG-M027"
                      variant="outline"
                      onClick={() => openDialog("DLG-M027")}
                    >
                      주소 검색
                    </Button>
                  </div>
                  <Input placeholder="상세 주소" />
                </div>
                <Textarea placeholder="메모 최대 500자" />
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                  결제 완료 후 회원 등록이 확정됩니다. 결제 취소 시 작성 내용은
                  임시 저장 상태로 돌아갑니다.
                </div>
              </div>
            )}
            <div className="flex justify-between border-t pt-4">
              <div className="flex gap-2">
                <Button
                  data-dialog-id="DLG-M007"
                  variant="outline"
                  onClick={() => openDialog("DLG-M007")}
                >
                  취소
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDraftSaved(true);
                    notify("회원 등록 임시저장 완료", "success");
                  }}
                >
                  임시 저장
                </Button>
                <Button
                  data-dialog-id="DLG-M008"
                  variant="outline"
                  onClick={() => {
                    setDraftSaved(false);
                    openDialog("DLG-M008");
                  }}
                >
                  초기화
                </Button>
              </div>
              {step === 1 ? (
                <Button
                  disabled={!canNext}
                  onClick={() =>
                    canNext
                      ? setStep(2)
                      : notify("필수 항목과 중복 확인이 필요합니다.", "warning")
                  }
                >
                  다음
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    이전
                  </Button>
                  <Button asChild>
                    <Link href="/sales/payment">결제 진행</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>귀속 정책 안내</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-content-secondary">
              회원 등록값은 기본값입니다. 실제 결제 시 결제지점, 이용지점, 매출
              귀속 지점, 정산 지점, 인센티브 귀속자를 다시 확인합니다.
            </CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function MemberDetailScreen({
  screen,
  role,
  branch,
  openDialog,
}: SpecializedScreenProps) {
  const router = useRouter();
  const member = memberDirectoryRows[0];
  const [favorite, setFavorite] = useState(true);
  const [tab, setTab] = useState("info");
  const canOperate = ["HQ_ADMIN", "OWNER", "MANAGER", "STAFF"].includes(role);
  const statusVariant =
    member.status === "활성"
      ? "success"
      : member.status === "임박"
        ? "warning"
        : member.status === "만료"
          ? "destructive"
          : "secondary";
  const quickMetrics = [
    {
      label: "미수금",
      value: "0원",
      tone: "text-rose-600",
      meta: "정산 필요 없음",
    },
    {
      label: "마일리지",
      value: "12,500P",
      tone: "text-sky-700",
      meta: "최근 지급 +2,000P",
    },
    {
      label: "계약",
      value: "2건",
      tone: "text-primary",
      meta: "PT + 헬스 회원권",
    },
    {
      label: "락커",
      value: "A-12",
      tone: "text-slate-900",
      meta: "2026-06-18 만료",
    },
  ];
  const cockpitAlerts = [
    {
      title: "장기 미방문",
      body: "34일째 방문 이력이 없습니다. 이탈 위험 대상으로 후속 연락이 필요합니다.",
      tone: "info",
    },
    {
      title: "만료 알림 예정",
      body: "D+11 경과 상태입니다. 상품구매/재등록 안내를 바로 연결해야 합니다.",
      tone: "danger",
    },
  ];
  const recentSignals = [
    { label: "마지막 방문", value: "2026-04-24", meta: "34일 전" },
    { label: "최근 30일 결제", value: "0원", meta: "최근 결제 없음" },
    { label: "활성 계약", value: "2건", meta: "2건 중 활성" },
  ];
  const tabs = [
    { value: "info", label: "회원정보", icon: UserRound },
    { value: "tickets", label: "이용권", icon: CreditCard, count: 2 },
    { value: "attendance", label: "출석 이력", icon: History },
    { value: "payment", label: "결제 이력", icon: ShoppingCart },
    { value: "paymentDetail", label: "결제내역", icon: CreditCard },
    { value: "reservation", label: "예약내역", icon: Calendar },
    { value: "history", label: "상세내역", icon: FileText },
    { value: "body", label: "체성분", icon: TrendingUp },
    { value: "memo", label: "상담·메모", icon: MessageSquare },
    { value: "lesson", label: "레슨", icon: Dumbbell },
    { value: "bodyInfo", label: "신체정보", icon: UserRound },
    { value: "evaluation", label: "종합평가", icon: Star },
    { value: "consultation", label: "상담이력", icon: ClipboardCheck },
    { value: "exerciseProgram", label: "운동프로그램", icon: Dumbbell },
    { value: "exerciseLog", label: "운동이력", icon: Zap },
  ];
  const infoRows = [
    ["휴대전화", member.phone],
    ["생년월일", `${member.birth} (${member.gender})`],
    ["이메일", "minji@example.com"],
    ["키", "165cm"],
    ["회원번호", member.no],
    ["가입일", member.registered],
    ["회원권 기간", "2026-04-01 ~ 2026-05-18"],
  ];
  const operationRows = [
    ["마일리지", "12,500P"],
    ["상담 담당자", member.owner],
    ["방문경로", "네이버검색"],
    ["운동목적", member.purpose],
    ["광고성 수신", "동의"],
    ["마지막 방문", "2026-04-24"],
  ];
  const tickets = [
    {
      product: "PT 20회",
      status: "사용중",
      period: "2026-04-01 ~ 2026-05-18",
      remain: "8회 잔여",
      owner: "이FC",
      meta: "계약일 2026-03-18",
    },
    {
      product: "헬스 3개월",
      status: "만료임박",
      period: "2026-03-18 ~ 2026-06-17",
      remain: "D-20",
      owner: "홍FC",
      meta: "락커 A-12 연결",
    },
  ];
  const paymentRows = [
    {
      date: "2026-03-18",
      product: "PT 20회",
      amount: "1,150,000원",
      method: "카드",
      state: "결제완료",
    },
    {
      date: "2026-03-18",
      product: "헬스 3개월",
      amount: "450,000원",
      method: "현금",
      state: "결제완료",
    },
    {
      date: "2026-04-02",
      product: "락커 1개월",
      amount: "30,000원",
      method: "계좌",
      state: "결제완료",
    },
  ];
  const reservations = [
    { date: "2026-05-30 19:00", title: "PT 1:1 · 김트레이너", state: "예약" },
    { date: "2026-06-01 20:00", title: "그룹 필라테스", state: "대기" },
  ];
  const timeline = [
    {
      time: "2026-05-28 10:20",
      title: "리텐션 메시지 발송",
      body: "D+11 만료 회원 재등록 안내 템플릿 발송",
    },
    {
      time: "2026-04-24 09:13",
      title: "출석 체크",
      body: "강남점 키오스크 입장",
    },
    {
      time: "2026-04-12 17:10",
      title: "상담 기록",
      body: "운동 빈도 높음 · 재등록 가능성 높음",
    },
  ];
  const bodyRows = [
    { date: "2026-05-20", weight: "54.8kg", muscle: "22.1kg", pbf: "23.4%" },
    { date: "2026-04-18", weight: "55.6kg", muscle: "21.8kg", pbf: "24.2%" },
    { date: "2026-03-21", weight: "56.3kg", muscle: "21.4kg", pbf: "25.0%" },
  ];

  return (
    <div className="space-y-5" data-testid="member-detail-screen">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="프로필 헤더 · 운영 코크핏 · 15개 탭"
      />

      <section
        className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm"
        data-testid="member-detail-cockpit"
      >
        <div className="flex flex-wrap items-center gap-4 border-b border-line bg-white px-6 py-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/members">회원 목록</Link>
          </Button>
          <span className="text-content-tertiary">/</span>
          <span className="mr-auto text-sm font-bold text-content">
            김민지 회원 상세
          </span>
          {quickMetrics.map((metric) => (
            <div
              key={metric.label}
              className="hidden min-w-[76px] rounded-xl border border-line bg-surface-secondary/70 px-3 py-2 text-center md:block"
            >
              <div className="text-[10px] font-semibold text-content-tertiary">
                {metric.label}
              </div>
              <div
                className={cn(
                  "mt-0.5 text-[13px] font-black tabular-nums",
                  metric.tone,
                )}
              >
                {metric.value}
              </div>
            </div>
          ))}
          <div className="flex w-full flex-wrap items-center gap-2 xl:w-auto xl:justify-end">
            <Button
              size="sm"
              className="bg-primary text-white hover:bg-primary/90"
              disabled={!canOperate}
              onClick={() => openDialog("DLG-M022")}
            >
              <CheckCircle2 className="size-3.5" />
              수동출석
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/members/edit?memberId=${member.no}`}>
                <Edit className="size-3.5" />
                수정
              </Link>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                router.push(`/sales/payment?memberId=${member.no}`)
              }
            >
              <ShoppingCart className="size-3.5" />
              상품구매
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/message?memberId=${member.no}`)}
            >
              <MessageSquare className="size-3.5" />
              메시지
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openDialog("DLG-M021")}
            >
              <Star className="size-3.5" />
              마일리지 조정
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openDialog("DLG-M025")}
            >
              <Dumbbell className="size-3.5" />
              운동 프로그램 배정
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openDialog("DLG-M023")}
            >
              <ArrowRightLeft className="size-3.5" />
              지점이관
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => openDialog("DLG-M005")}
            >
              <UserMinus className="size-3.5" />
              탈퇴
            </Button>
          </div>
        </div>

        <div className="grid gap-4 bg-surface-secondary/60 px-6 py-4 xl:grid-cols-[1.25fr_0.85fr_0.95fr]">
          <Card className="shadow-none">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-content-tertiary">
                    Operation Cockpit
                  </p>
                  <h2 className="text-[16px] font-black text-content">
                    지금 바로 처리할 운영 이슈
                  </h2>
                </div>
                <Badge variant="warning">조치 필요</Badge>
              </div>
              <div className="space-y-2">
                {cockpitAlerts.map((alert) => (
                  <div
                    key={alert.title}
                    className={cn(
                      "rounded-xl border px-4 py-3",
                      alert.tone === "danger"
                        ? "border-rose-200 bg-rose-50"
                        : "border-sky-200 bg-sky-50",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        className={cn(
                          "mt-0.5 size-4",
                          alert.tone === "danger"
                            ? "text-rose-600"
                            : "text-sky-600",
                        )}
                      />
                      <div>
                        <p className="text-sm font-bold text-content">
                          {alert.title}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-content-secondary">
                          {alert.body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardContent className="p-4">
              <p className="mb-3 text-[11px] font-black uppercase tracking-[0.14em] text-content-tertiary">
                Next Actions
              </p>
              <div className="grid gap-2">
                <Button
                  asChild
                  className="justify-start bg-primary text-white hover:bg-primary/90"
                >
                  <Link
                    href={`/message?memberId=${member.no}&template=retention`}
                  >
                    <MessageSquare className="size-3.5" />
                    리텐션 메시지 발송
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link
                    href={`/sales/payment?memberId=${member.no}&mode=recommend`}
                  >
                    <ShoppingCart className="size-3.5" />
                    추가 상품 제안
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => openDialog("DLG-M003")}
                >
                  <Clock className="size-3.5" />
                  홀딩 처리
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardContent className="p-4">
              <p className="mb-3 text-[11px] font-black uppercase tracking-[0.14em] text-content-tertiary">
                Recent Signals
              </p>
              <div className="space-y-2">
                {recentSignals.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-xl bg-surface-secondary/80 px-3 py-3"
                  >
                    <div>
                      <p className="text-xs font-bold text-content">
                        {item.label}
                      </p>
                      <p className="text-[11px] text-content-tertiary">
                        {item.meta}
                      </p>
                    </div>
                    <span className="text-xs font-black text-content tabular-nums">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={tab}
          onValueChange={setTab}
          className="border-t border-line bg-white"
        >
          <div className="overflow-x-auto border-b border-line px-2 py-2">
            <TabsList className="inline-flex h-auto min-w-max justify-start gap-1 bg-transparent p-0">
              {tabs.map((item) => {
                const Icon = item.icon;
                return (
                  <TabsTrigger
                    key={item.value}
                    value={item.value}
                    className="gap-1.5 rounded-xl px-3 py-2 text-xs data-[state=active]:bg-primary-light data-[state=active]:text-primary data-[state=active]:shadow-sm"
                  >
                    <Icon className="size-3.5" />
                    {item.label}
                    {item.count ? (
                      <Badge
                        variant="secondary"
                        className="ml-0.5 px-1.5 py-0 text-[10px]"
                      >
                        {item.count}
                      </Badge>
                    ) : null}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <div className="bg-surface-secondary/20 p-6">
            <TabsContent value="info" className="mt-0">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <Card className="shadow-none border-t-4 border-t-primary">
                  <CardHeader className="flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle>기본 정보</CardTitle>
                      <CardDescription>
                        프로필 · 연락처 · 계약 기간
                      </CardDescription>
                    </div>
                    <button
                      type="button"
                      aria-label="관심회원"
                      onClick={() => setFavorite((v) => !v)}
                      className={cn(
                        "rounded-full border p-2",
                        favorite
                          ? "border-primary bg-primary-light text-primary"
                          : "border-line text-content-tertiary",
                      )}
                    >
                      <Star
                        className="size-4"
                        fill={favorite ? "currentColor" : "none"}
                      />
                    </button>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-5 flex items-center gap-4">
                      <div className="grid size-16 place-items-center rounded-full bg-blue-100 text-2xl font-black text-blue-700">
                        김
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-black text-content">
                            김민지
                          </h3>
                          <Badge variant="warning">🏅 브론즈</Badge>
                          <Badge variant={statusVariant}>정상 이용중</Badge>
                          <Badge variant="destructive">D+11</Badge>
                        </div>
                        <p className="mt-1 text-sm text-content-secondary">
                          여 · 010-1111-2222 · minji@example.com
                        </p>
                      </div>
                    </div>
                    <div className="divide-y divide-line rounded-xl border border-line">
                      {infoRows.map(([label, value]) => (
                        <div
                          key={label}
                          className="flex items-center justify-between px-4 py-3 text-sm"
                        >
                          <span className="text-content-secondary">
                            {label}
                          </span>
                          <b className="text-content tabular-nums">{value}</b>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-none border-t-4 border-t-accent">
                  <CardHeader>
                    <CardTitle>운영 정보</CardTitle>
                    <CardDescription>
                      관리자에게 필요한 귀속·마케팅·메모 정보
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
                    <div className="divide-y divide-line rounded-xl border border-line">
                      {operationRows.map(([label, value]) => (
                        <div
                          key={label}
                          className="flex items-center justify-between px-4 py-3 text-sm"
                        >
                          <span className="text-content-secondary">
                            {label}
                          </span>
                          <b className="text-content tabular-nums">{value}</b>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                        <b>특이사항</b>
                        <br />
                        운동 빈도 높음
                      </div>
                      <div className="rounded-xl border border-line bg-surface-secondary p-4 text-sm leading-6 text-content-secondary">
                        <b className="text-content">메모</b>
                        <br />
                        재등록 가능성 높음. 저녁 시간대 상담 선호.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tickets" className="mt-0 space-y-3">
              {tickets.map((ticket) => (
                <Card key={ticket.product} className="shadow-none">
                  <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-content">
                          {ticket.product}
                        </h3>
                        <Badge
                          variant={
                            ticket.status === "사용중" ? "success" : "warning"
                          }
                        >
                          {ticket.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-content-secondary">
                        {ticket.period} · {ticket.owner} · {ticket.meta}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <b className="text-primary">{ticket.remain}</b>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDialog("DLG-M018")}
                      >
                        연장 등록
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDialog("DLG-M019")}
                      >
                        <MoreVertical className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="attendance" className="mt-0">
              <OperationalTable
                title="최근 출석 내역"
                columns={["일시", "지점", "방식", "결과"]}
                rows={[
                  ["2026-04-24 09:13", "강남점", "키오스크", "정상"],
                  ["2026-04-21 18:45", "강남점", "수동출석", "정상"],
                  ["2026-04-18 19:03", "강남점", "키오스크", "정상"],
                ]}
              />
            </TabsContent>
            <TabsContent value="payment" className="mt-0">
              <OperationalTable
                title="결제 이력"
                columns={["결제일", "상품명", "금액", "방법", "상태"]}
                rows={paymentRows.map((row) => [
                  row.date,
                  row.product,
                  row.amount,
                  row.method,
                  row.state,
                ])}
              />
            </TabsContent>
            <TabsContent value="paymentDetail" className="mt-0">
              <OperationalTable
                title="결제내역 상세"
                description="내부 승인번호 기준으로 수납행·영수증·인보이스 액션을 묶어 표시합니다."
                columns={[
                  "승인번호",
                  "수납수단",
                  "승인/입금 정보",
                  "표시상태",
                  "액션",
                ]}
                rows={[
                  ["CRM-260318-001", "카드", "VAN 8432-2211", "완료", "영수증"],
                  [
                    "CRM-260318-001",
                    "현금",
                    "현금영수증 처리",
                    "완료",
                    "인보이스",
                  ],
                  [
                    "LINK-260528-003",
                    "결제링크",
                    "발송됨",
                    "미결제",
                    "환불 숨김",
                  ],
                ]}
              />
            </TabsContent>
            <TabsContent value="reservation" className="mt-0">
              <OperationalTable
                title="예약내역"
                columns={["예약일시", "수업", "상태"]}
                rows={reservations.map((row) => [
                  row.date,
                  row.title,
                  row.state,
                ])}
              />
            </TabsContent>
            <TabsContent value="history" className="mt-0">
              <TimelineList title="상세내역 타임라인" items={timeline} />
            </TabsContent>
            <TabsContent value="body" className="mt-0">
              <OperationalTable
                title="체성분 기록"
                columns={["측정일", "체중", "골격근량", "체지방률"]}
                rows={bodyRows.map((row) => [
                  row.date,
                  row.weight,
                  row.muscle,
                  row.pbf,
                ])}
                action={
                  <Button size="sm" onClick={() => openDialog("DLG-M015")}>
                    측정 추가
                  </Button>
                }
              />
            </TabsContent>
            <TabsContent value="memo" className="mt-0">
              <TimelineList
                title="상담·메모"
                items={[
                  {
                    time: "2026-05-28",
                    title: "재등록 상담",
                    body: "6월 첫째 주 전화 상담 예정",
                  },
                  {
                    time: "2026-04-12",
                    title: "운동 목적 확인",
                    body: "체지방 감량 + 하체 근력 강화",
                  },
                ]}
                action={
                  <Button size="sm" onClick={() => openDialog("DLG-M009")}>
                    메모 추가
                  </Button>
                }
              />
            </TabsContent>
            <TabsContent value="lesson" className="mt-0">
              <OperationalTable
                title="레슨"
                columns={["일시", "트레이너", "프로그램", "서명"]}
                rows={[
                  ["2026-05-30 19:00", "김트레이너", "하체/코어", "대기"],
                  ["2026-04-21 18:30", "김트레이너", "상체", "완료"],
                ]}
              />
            </TabsContent>
            <TabsContent value="bodyInfo" className="mt-0">
              <InfoBoard
                title="신체정보"
                items={[
                  "혈압 118/78",
                  "기초대사량 1280kcal",
                  "운동 제한 없음",
                  "목표 체중 52kg",
                ]}
              />
            </TabsContent>
            <TabsContent value="evaluation" className="mt-0">
              <InfoBoard
                title="종합평가"
                items={[
                  "근력: 보통",
                  "유연성: 개선 필요",
                  "체지방: 안정",
                  "다음 평가: 2026-06-20",
                ]}
                action={
                  <Button size="sm" onClick={() => openDialog("DLG-M024")}>
                    종합 평가 등록
                  </Button>
                }
              />
            </TabsContent>
            <TabsContent value="consultation" className="mt-0">
              <TimelineList
                title="상담이력"
                items={[
                  {
                    time: "2026-05-28",
                    title: "전화 상담",
                    body: "재등록 할인 문의",
                  },
                  {
                    time: "2026-04-12",
                    title: "방문 상담",
                    body: "운동 루틴 조정",
                  },
                ]}
                action={
                  <Button size="sm" onClick={() => openDialog("DLG-M011")}>
                    상담 등록
                  </Button>
                }
              />
            </TabsContent>
            <TabsContent value="exerciseProgram" className="mt-0">
              <InfoBoard
                title="운동프로그램"
                items={[
                  "체지방 감량 8주",
                  "주 3회 루틴",
                  "담당 김트레이너",
                  "진행률 45%",
                ]}
                action={
                  <Button size="sm" onClick={() => openDialog("DLG-M025")}>
                    프로그램 배정
                  </Button>
                }
              />
            </TabsContent>
            <TabsContent value="exerciseLog" className="mt-0">
              <OperationalTable
                title="운동이력"
                columns={["일시", "운동", "강도", "메모"]}
                rows={[
                  ["2026-05-24", "스쿼트/런지", "중", "무릎 통증 없음"],
                  ["2026-05-21", "상체 머신", "상", "중량 +5kg"],
                ]}
                action={
                  <Button size="sm" onClick={() => openDialog("DLG-M026")}>
                    운동 이력 등록
                  </Button>
                }
              />
            </TabsContent>
          </div>
        </Tabs>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>회원 상태 관리</CardTitle>
            <CardDescription>
              홀딩 자동 해제, 만료 배치, 세그먼트 재계산과 연결되는 운영
              액션입니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => openDialog("DLG-M003")}>
              <Clock className="size-4" />
              홀딩 처리
            </Button>
            <Button variant="outline" onClick={() => openDialog("DLG-M004")}>
              <CheckCircle2 className="size-4" />
              홀딩 해제
            </Button>
            <Button variant="outline" onClick={() => openDialog("DLG-M001")}>
              <ShieldCheck className="size-4" />
              상태 변경
            </Button>
            <Button
              variant="destructive"
              onClick={() => openDialog("DLG-M002")}
            >
              회원 삭제
            </Button>
          </CardContent>
        </Card>
        <Card className="shadow-none border-rose-200 bg-rose-50/70">
          <CardHeader>
            <CardTitle className="text-rose-700">위험 구역</CardTitle>
            <CardDescription>
              권한자만 노출되는 소프트 삭제/탈퇴 처리 영역
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-rose-700">
            <p>
              삭제·탈퇴는 되돌릴 수 없고, 90일 경과 시 PII 마스킹 배치 대상이
              됩니다.
            </p>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => openDialog("DLG-M002")}
            >
              회원 삭제 확인
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function OperationalTable({
  title,
  description,
  columns,
  rows,
  action,
}: {
  title: string;
  description?: string;
  columns: string[];
  rows: string[][];
  action?: React.ReactNode;
}) {
  return (
    <Card className="shadow-none">
      <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && (
            <CardDescription className="mt-1">{description}</CardDescription>
          )}
        </div>
        {action}
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-xl border border-line bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow key={`${title}-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <TableCell
                      key={`${title}-${rowIndex}-${cellIndex}`}
                      className={
                        cellIndex === 0
                          ? "font-semibold tabular-nums"
                          : undefined
                      }
                    >
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function TimelineList({
  title,
  items,
  action,
}: {
  title: string;
  items: Array<{ time: string; title: string; body: string }>;
  action?: React.ReactNode;
}) {
  return (
    <Card className="shadow-none">
      <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
        <CardTitle>{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div
            key={`${item.time}-${item.title}`}
            className="rounded-xl border border-line bg-white p-4"
          >
            <div className="text-[11px] font-semibold text-content-tertiary">
              {item.time}
            </div>
            <div className="mt-1 font-bold text-content">{item.title}</div>
            <p className="mt-1 text-sm text-content-secondary">{item.body}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function InfoBoard({
  title,
  items,
  action,
}: {
  title: string;
  items: string[];
  action?: React.ReactNode;
}) {
  return (
    <Card className="shadow-none">
      <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
        <CardTitle>{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-xl border border-line bg-white p-4 text-sm font-semibold text-content"
          >
            {item}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function MemberEditScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("김민준");
  const [phone, setPhone] = useState("010-1234-5678");
  const [memberType, setMemberType] = useState("일반");
  const [memo, setMemo] = useState("재등록 의향 있음");
  const [phoneChecked, setPhoneChecked] = useState(true);
  const [addressChecked, setAddressChecked] = useState(true);
  const [saveResult, setSaveResult] = useState("");
  const [conflictMode, setConflictMode] = useState(false);
  const editValidation = {
    name: name.trim().length >= 2,
    phone: /^010-\d{4}-\d{4}$/.test(phone),
    phoneChecked,
    addressChecked,
    memoSafe: !/\d{6}-\d{7}/.test(memo),
  };
  const canMoveNext =
    editValidation.name && editValidation.phone && editValidation.phoneChecked;
  const canSave =
    canMoveNext && editValidation.addressChecked && editValidation.memoSafe;
  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="2단계 회원 수정 폼"
      />
      <div className="grid gap-5">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>
              Step {step} / 2 ·{" "}
              {step === 1 ? "기본 인적 + 관리 정보" : "추가 연락 + 기타 설정"}
            </CardTitle>
            <CardDescription>
              등록 화면(SCR-M002)과 동일 구조. 기존 데이터가 자동으로 채워진
              상태에서 시작합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div
                className={cn(
                  "rounded-lg border p-3",
                  step === 1 && "border-blue-400 bg-blue-50",
                )}
              >
                1. 기본 인적 / 관리 정보
              </div>
              <div
                className={cn(
                  "rounded-lg border p-3",
                  step === 2 && "border-blue-400 bg-blue-50",
                )}
              >
                2. 추가 연락 / 기타 설정
              </div>
            </div>
            {step === 1 ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>이름 *</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>연락처 * (변경 시 재중복확인)</Label>
                  <div className="flex gap-2">
                    <Input
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setPhoneChecked(false);
                      }}
                    />
                    <Button
                      data-dialog-id="DLG-M006"
                      variant="outline"
                      onClick={() => {
                        setPhoneChecked(true);
                        openDialog("DLG-M006");
                      }}
                    >
                      중복 확인
                    </Button>
                  </div>
                  <p
                    className={cn(
                      "text-xs",
                      editValidation.phone && phoneChecked
                        ? "text-emerald-600"
                        : "text-rose-600",
                    )}
                  >
                    {editValidation.phone
                      ? phoneChecked
                        ? "전화번호 형식·중복 확인 완료"
                        : "연락처 변경 후 DLG-M006 중복 확인 필요"
                      : "010-0000-0000 형식으로 입력"}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label>회원구분 *</Label>
                  <Select value={memberType} onValueChange={setMemberType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["일반", "기명법인", "무기명법인"].map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>생년월일 *</Label>
                  <Input defaultValue="1991-04-18" />
                </div>
                <div className="space-y-1">
                  <Label>키 (cm)</Label>
                  <Input defaultValue="178" />
                </div>
                <div className="space-y-1">
                  <Label>성별 *</Label>
                  <Input defaultValue="남" />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label>
                    소속지점 / 기본 이용지점 / 담당 FC / 담당 트레이너
                  </Label>
                  <div className="grid grid-cols-4 gap-2">
                    <Input defaultValue="강남점" />
                    <Input defaultValue="강남점" />
                    <Input defaultValue="이FC" />
                    <Input defaultValue="박트레이너" />
                  </div>
                </div>
                <div className="col-span-2 space-y-1">
                  <Label>문의 유형 / 가입경로 / 운동 목적</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input defaultValue="방문(WI)" />
                    <Input defaultValue="회원소개" />
                    <Input defaultValue="체중 감량" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="별칭/닉네임" defaultValue="민준" />
                <Input placeholder="이메일" defaultValue="minjun@example.com" />
                <div className="flex gap-2">
                  <Input placeholder="주소" defaultValue="서울 강남구" />
                  <Button
                    data-dialog-id="DLG-M027"
                    variant="outline"
                    onClick={() => {
                      setAddressChecked(true);
                      openDialog("DLG-M027");
                    }}
                  >
                    주소 검색
                  </Button>
                </div>
                <Input placeholder="상세 주소" />
                <Input placeholder="회사명" />
                <Input placeholder="출석번호" defaultValue="10291" />
                <div className="col-span-2 space-y-1">
                  <Label>메모 (최대 500자, 주민번호 패턴 자동 차단)</Label>
                  <Textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    maxLength={500}
                  />
                  <p className="text-xs text-content-tertiary">
                    {memo.length} / 500
                  </p>
                  {!editValidation.memoSafe && (
                    <p className="text-xs text-rose-600">
                      주민번호 패턴은 저장할 수 없습니다.
                    </p>
                  )}
                </div>
                <label className="col-span-2 flex items-center gap-2 rounded-lg border bg-surface-secondary p-3 text-sm">
                  <input type="checkbox" defaultChecked /> 광고성 정보 수신 동의
                  (동의 철회는 회원 본인 앱에서만 가능)
                </label>
              </div>
            )}
            <div className="flex justify-between border-t pt-4">
              <div className="flex gap-2">
                <Button
                  data-dialog-id="DLG-M007"
                  variant="outline"
                  onClick={() => openDialog("DLG-M007")}
                >
                  취소(이탈 확인)
                </Button>
                <Button
                  data-dialog-id="DLG-M008"
                  variant="outline"
                  onClick={() => openDialog("DLG-M008")}
                >
                  초기화
                </Button>
              </div>
              {step === 1 ? (
                <Button
                  disabled={!canMoveNext}
                  onClick={() => {
                    if (!canMoveNext) {
                      notify(
                        "필수값/전화번호 중복 확인이 필요합니다.",
                        "warning",
                      );
                      return;
                    }
                    setStep(2);
                  }}
                >
                  다음
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    이전
                  </Button>
                  <Button
                    disabled={!canSave}
                    onClick={() => {
                      if (!canSave) {
                        notify(
                          "주소/메모/중복확인 검증을 완료해주세요.",
                          "warning",
                        );
                        return;
                      }
                      if (conflictMode) {
                        setSaveResult(
                          "409 동시편집 감지 · 최신본 새로고침 후 다시 저장 필요",
                        );
                        return;
                      }
                      setSaveResult(
                        "회원 정보 수정 완료 · 감사로그 ADM-260529-004 기록 · 회원 상세 반영 대기",
                      );
                      notify(
                        "회원 정보가 수정되었습니다. 회원 상세로 이동합니다.",
                      );
                    }}
                  >
                    저장
                  </Button>
                </div>
              )}
            </div>
            <div className="grid gap-3 rounded-xl border border-line bg-surface-secondary p-4 text-sm md:grid-cols-2">
              <div>
                <b className="text-content">검증 게이트</b>
                <div className="mt-2 space-y-1 text-xs text-content-secondary">
                  <div>
                    이름 2자 이상: {editValidation.name ? "OK" : "필요"}
                  </div>
                  <div>
                    전화번호 형식: {editValidation.phone ? "OK" : "필요"}
                  </div>
                  <div>
                    중복 확인:{" "}
                    {editValidation.phoneChecked ? "OK" : "DLG-M006 필요"}
                  </div>
                  <div>
                    주소 검색:{" "}
                    {editValidation.addressChecked ? "OK" : "DLG-M027 필요"}
                  </div>
                  <div>
                    개인정보 패턴 차단:{" "}
                    {editValidation.memoSafe ? "OK" : "차단"}
                  </div>
                </div>
              </div>
              <div>
                <b className="text-content">동시편집/저장 결과</b>
                <label className="mt-2 flex items-center gap-2 text-xs text-content-secondary">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-primary"
                    checked={conflictMode}
                    onChange={(e) => setConflictMode(e.target.checked)}
                  />
                  저장 충돌(409) 시뮬레이션
                </label>
                {saveResult && (
                  <div className="mt-2 rounded-lg border bg-white p-2 text-xs text-content-secondary">
                    {saveResult}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MemberTransferScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  const member = memberDirectoryRows[0];
  const [targetBranch, setTargetBranch] = useState("서초점");
  const [reason, setReason] = useState("");
  const [acknowledged, setAcknowledged] = useState<Record<string, boolean>>({
    unpaid: false,
    locker: false,
    holding: false,
    pt: false,
    coupon: false,
  });
  const [transferResult, setTransferResult] = useState("");
  const blockers = [
    {
      key: "unpaid",
      tone: "danger",
      title: "미납금 80,000원",
      body: "이관 전 미수금 정산 또는 본사 예외 승인이 필요합니다.",
      required: true,
    },
    {
      key: "locker",
      tone: "danger",
      title: "락커 A-12 보유",
      body: "락커 회수/이전 등록 후 이관 가능합니다.",
      required: true,
    },
    {
      key: "holding",
      tone: "warning",
      title: "홀딩 이력 존재",
      body: "이관 시 홀딩 잔여일 재계산 안내가 자동 노출됩니다.",
      required: false,
    },
    {
      key: "pt",
      tone: "warning",
      title: "PT 잔여 8회",
      body: "트레이너 재배정과 인센티브 귀속자를 함께 확인합니다.",
      required: false,
    },
    {
      key: "coupon",
      tone: "info",
      title: "지점 한정 쿠폰 2건",
      body: "타 지점 이관 시 쿠폰 소멸 예정 안내가 필요합니다.",
      required: false,
    },
  ];
  const unresolvedRequired = blockers.filter(
    (item) => item.required && !acknowledged[item.key],
  );
  const canTransfer =
    reason.trim().length >= 10 && unresolvedRequired.length === 0;
  const rebindRows = [
    {
      필드: "소속지점",
      "현재 값": member.branch,
      "이관 후 값": targetBranch,
      필수: "Y",
    },
    {
      필드: "기본 이용지점",
      "현재 값": member.branch,
      "이관 후 값": targetBranch,
      필수: "Y",
    },
    {
      필드: "기본 매출 귀속 지점",
      "현재 값": member.branch,
      "이관 후 값": targetBranch,
      필수: "Y",
    },
    {
      필드: "정산 지점 기본값",
      "현재 값": member.branch,
      "이관 후 값": targetBranch,
      필수: "Y",
    },
    {
      필드: "담당 상담자(FC)",
      "현재 값": member.owner,
      "이관 후 값": "김FC",
      필수: "Y",
    },
    {
      필드: "담당 트레이너",
      "현재 값": "박트레이너",
      "이관 후 값": "정트레이너",
      필수: "Y",
    },
    {
      필드: "인센티브 귀속자",
      "현재 값": member.owner,
      "이관 후 값": "김FC",
      필수: "Y",
    },
  ];
  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="지점 이관 + 귀속 재배정"
      />
      <div className="grid grid-cols-4 gap-3">
        {screen.metrics.map((m) => (
          <Card key={m.label} className="shadow-none">
            <CardHeader>
              <CardDescription>{m.label}</CardDescription>
              <CardTitle className="text-xl">{m.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-content-tertiary">{m.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-5">
        <div className="space-y-5">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>이관 대상 회원</CardTitle>
              <CardDescription>
                본사 통합 모드에서도 이관 원 지점은 회원 row의 실제 branchId를
                기준으로 확정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-sm">
              <InfoCell
                label="회원"
                value={`${member.name} · ${member.phone}`}
              />
              <InfoCell label="현재 소속" value={member.branch} />
              <InfoCell label="현재 이용권" value={member.pass} />
              <InfoCell label="기본 매출 귀속" value={member.branch} />
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>유지 / 변경 항목</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <b>이관 후 유지</b>
                <div className="mt-1 text-content-secondary">
                  이용권 잔여일·잔여 횟수 · 결제 이력 · 출석 이력 · 상담 메모
                </div>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <b>이관 후 변경(재배정 필요)</b>
                <div className="mt-1 text-content-secondary">
                  소속·이용·담당 FC·담당 트레이너·매출 귀속·정산·인센티브
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>이관 대상 지점 선택 + 귀속 재배정 표</CardTitle>
              <CardDescription>
                현재 소속 지점은 선택 불가. 법인/홈오피스/주말/통합 회원권은
                정산 지점 정책 추가 점검 필요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                {branches
                  .filter((b) => b !== member.branch)
                  .slice(0, 5)
                  .map((b) => (
                    <Button
                      key={b}
                      variant={targetBranch === b ? "default" : "outline"}
                      onClick={() => {
                        setTargetBranch(b);
                        notify(`이관 대상 지점: ${b}`, "info");
                      }}
                    >
                      {b}
                    </Button>
                  ))}
              </div>
              <div className="overflow-hidden rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {screen.tableColumns.map((c) => (
                        <TableHead key={c}>{c}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rebindRows.map((row) => (
                      <TableRow key={row.필드}>
                        <TableCell className="font-medium">
                          {row.필드}
                        </TableCell>
                        <TableCell>{row["현재 값"]}</TableCell>
                        <TableCell>
                          <Badge variant="info">{row["이관 후 값"]}</Badge>
                        </TableCell>
                        <TableCell>{row.필수}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Textarea
                placeholder="이관 사유 (선택, 10자 미만 시 경고)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <div className="grid gap-2 rounded-xl border border-line bg-surface-secondary p-3 text-xs">
                <div className="font-bold text-content">이관 전 검증 상태</div>
                <div
                  className={
                    reason.trim().length >= 10
                      ? "text-emerald-700"
                      : "text-rose-700"
                  }
                >
                  사유 10자 이상:{" "}
                  {reason.trim().length >= 10
                    ? "충족"
                    : `${reason.trim().length}/10`}
                </div>
                <div
                  className={
                    unresolvedRequired.length === 0
                      ? "text-emerald-700"
                      : "text-rose-700"
                  }
                >
                  필수 차단 해소:{" "}
                  {unresolvedRequired.length === 0
                    ? "완료"
                    : `${unresolvedRequired.length}건 남음`}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => notify("이관 취소 mock", "info")}
                >
                  취소
                </Button>
                <Button
                  data-dialog-id="DLG-M023"
                  disabled={!canTransfer}
                  onClick={() => {
                    setTransferResult(
                      `${member.name} → ${targetBranch} 이관 검증 완료 · DLG-M023 최종 확인 대기`,
                    );
                    openDialog("DLG-M023");
                  }}
                >
                  이관 확인
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>차단 / 경고 조건</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {blockers.map((item) => (
                <label
                  key={item.key}
                  className={cn(
                    "block rounded-lg border p-2",
                    item.tone === "danger" &&
                      "border-rose-200 bg-rose-50 text-rose-700",
                    item.tone === "warning" &&
                      "border-amber-200 bg-amber-50 text-amber-800",
                    item.tone === "info" &&
                      "border-blue-200 bg-blue-50 text-blue-800",
                  )}
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 accent-primary"
                      checked={acknowledged[item.key]}
                      onChange={(e) =>
                        setAcknowledged((current) => ({
                          ...current,
                          [item.key]: e.target.checked,
                        }))
                      }
                    />
                    <span>
                      <b>{item.title}</b>
                      {item.required && " · 필수 해소"}
                      <br />
                      {item.body}
                    </span>
                  </div>
                </label>
              ))}
              {transferResult && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-700">
                  {transferResult}
                </div>
              )}
            </CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function BodyCompositionScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  const [tab, setTab] = useState<"기록" | "추이">("기록");
  const [toggles, setToggles] = useState({
    체중: true,
    골격근량: true,
    체지방률: true,
  });
  const [selectedMember, setSelectedMember] = useState(
    memberDirectoryRows[0].name,
  );
  const [bodyActionPanel, setBodyActionPanel] = useState<
    null | "csv" | "manual-match" | "goal"
  >(null);
  const [rows, setRows] = useState([
    {
      날짜: "2026-05-28",
      체중: "68.4kg",
      골격근량: "29.8kg",
      체지방률: "21.4%",
      BMI: "22.8",
      기초대사량: "1,520kcal",
      체수분: "42.6L",
      action: "수정 (본인 24h)",
    },
    {
      날짜: "2026-05-21",
      체중: "69.1kg",
      골격근량: "29.4kg",
      체지방률: "22.3%",
      BMI: "23.0",
      기초대사량: "1,510kcal",
      체수분: "42.1L",
      action: "-",
    },
    {
      날짜: "2026-05-14",
      체중: "69.8kg",
      골격근량: "29.1kg",
      체지방률: "22.9%",
      BMI: "23.3",
      기초대사량: "1,495kcal",
      체수분: "41.8L",
      action: "-",
    },
  ]);
  const hasGraph = Object.values(toggles).some(Boolean) && rows.length >= 2;
  const activeMember =
    memberDirectoryRows.find((member) => member.name === selectedMember) ??
    memberDirectoryRows[0];
  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="체성분 추이 분석"
      />
      <div className="grid grid-cols-4 gap-3">
        {screen.metrics.map((m, i) => {
          const trend = ["-1.2kg ▼", "+0.4kg ▲", "-1.5% ▼", "정상"][i] ?? "";
          return (
            <Card key={m.label} className="shadow-none">
              <CardHeader>
                <CardDescription>{m.label}</CardDescription>
                <CardTitle className="text-xl">{m.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={cn(
                    "text-xs",
                    trend.includes("▼") &&
                      m.label !== "골격근량" &&
                      "text-emerald-600",
                    trend.includes("▲") &&
                      m.label === "골격근량" &&
                      "text-emerald-600",
                    trend.includes("▼") &&
                      m.label === "골격근량" &&
                      "text-rose-600",
                    trend.includes("▲") &&
                      m.label !== "골격근량" &&
                      m.label !== "BMI" &&
                      "text-rose-600",
                  )}
                >
                  {trend}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-5">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>
              회원 선택 · {tab === "기록" ? "측정 기록" : "추이 분석"}
            </CardTitle>
            <CardDescription>
              회원 상세(SCR-M004) 체성분 탭에서 진입하면 회원 자동 선택. D11
              SCR-I006과 route 공유.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger className="max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {memberDirectoryRows.map((m) => (
                    <SelectItem key={m.no} value={m.name}>
                      {m.name} · {m.branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="ml-auto flex gap-2">
                {(["기록", "추이"] as const).map((t) => (
                  <Button
                    key={t}
                    variant={tab === t ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTab(t)}
                  >
                    {t === "기록" ? "측정 기록" : "추이 분석"}
                  </Button>
                ))}
                <Button
                  data-dialog-id="DLG-M015"
                  size="sm"
                  onClick={() => openDialog("DLG-M015")}
                >
                  측정 추가
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setRows((current) => [
                      {
                        날짜: "2026-05-29",
                        체중: "67.9kg",
                        골격근량: "30.1kg",
                        체지방률: "20.8%",
                        BMI: "22.5",
                        기초대사량: "1,536kcal",
                        체수분: "43.0L",
                        action: "수정 (본인 24h)",
                      },
                      ...current,
                    ]);
                  }}
                >
                  수동 측정 반영
                </Button>
              </div>
            </div>
            {tab === "추이" ? (
              <div>
                <div className="mb-3 flex gap-2 text-xs">
                  {(["체중", "골격근량", "체지방률"] as const).map((k) => (
                    <Button
                      key={k}
                      size="sm"
                      variant={toggles[k] ? "default" : "outline"}
                      onClick={() => setToggles((s) => ({ ...s, [k]: !s[k] }))}
                    >
                      {k}
                    </Button>
                  ))}
                </div>
                {hasGraph ? (
                  <div className="rounded-xl border bg-surface-secondary p-4">
                    <p className="mb-2 text-xs font-semibold text-content-secondary">
                      최근 3회 측정 시각화 (mock SVG)
                    </p>
                    <svg viewBox="0 0 320 120" className="w-full">
                      {toggles.체중 && (
                        <polyline
                          points="20,40 160,55 300,70"
                          stroke="#f97316"
                          strokeWidth="2"
                          fill="none"
                        />
                      )}
                      {toggles.골격근량 && (
                        <polyline
                          points="20,80 160,75 300,72"
                          stroke="#10b981"
                          strokeWidth="2"
                          fill="none"
                        />
                      )}
                      {toggles.체지방률 && (
                        <polyline
                          points="20,50 160,65 300,80"
                          stroke="#f59e0b"
                          strokeWidth="2"
                          fill="none"
                        />
                      )}
                      {["05-14", "05-21", "05-28"].map((d, i) => (
                        <text
                          key={d}
                          x={20 + i * 140}
                          y="115"
                          fontSize="9"
                          fill="#64748b"
                        >
                          {d}
                        </text>
                      ))}
                    </svg>
                  </div>
                ) : (
                  <div className="rounded-xl border bg-surface-secondary p-8 text-center text-sm text-content-tertiary">
                    {rows.length < 2
                      ? "2건부터 추이 그래프가 표시됩니다."
                      : "지표를 1개 이상 선택해주세요."}
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {screen.tableColumns.map((c) => (
                        <TableHead key={c}>{c}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.날짜}>
                        <TableCell>{row.날짜}</TableCell>
                        <TableCell>{row.체중}</TableCell>
                        <TableCell>{row.골격근량}</TableCell>
                        <TableCell>{row.체지방률}</TableCell>
                        <TableCell>{row.BMI}</TableCell>
                        <TableCell>{row.기초대사량}</TableCell>
                        <TableCell>{row.체수분}</TableCell>
                        <TableCell>
                          {row.action === "-" ? (
                            "-"
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              data-dialog-id="DLG-M016"
                              onClick={() => openDialog("DLG-M016")}
                            >
                              {row.action}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>액션 / 권한</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                data-dialog-id="DLG-M015"
                className="w-full"
                onClick={() => openDialog("DLG-M015")}
              >
                측정 추가
              </Button>
              <Button
                data-dialog-id="DLG-M017"
                variant="outline"
                className="w-full"
                onClick={() => openDialog("DLG-M017")}
              >
                목표 설정
              </Button>
              <Button
                data-dialog-id="DLG-M016"
                variant="outline"
                className="w-full"
                onClick={() => openDialog("DLG-M016")}
              >
                동일 일자 덮어쓰기
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setBodyActionPanel("csv")}
              >
                CSV 내보내기
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setBodyActionPanel("manual-match")}
              >
                InBody 수동 매칭 큐
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>선택 회원 요약</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-content-secondary">
              <div className="rounded-lg border bg-white p-2">
                {activeMember.name} · {activeMember.phone}
              </div>
              <div className="rounded-lg border bg-white p-2">
                목표: 체지방률 19% 이하 · 골격근량 30kg 이상
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-700">
                최근 변화: 체중 -0.5kg, 골격근량 +0.3kg
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>예외 안내</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-xs text-content-secondary">
              <div>키 미등록 시 BMI 미계산</div>
              <div>성별/나이 미등록 시 BMR 미계산</div>
              <div>FC/트레이너 본인 등록 24h 내 수정만</div>
              <div>InBody 매칭 실패 → 수동 매칭 큐</div>
            </CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
      <AdminSlidePanel
        open={Boolean(bodyActionPanel)}
        onClose={() => setBodyActionPanel(null)}
        eyebrow="SCR-M006 BODY FLOW"
        title={
          bodyActionPanel === "csv"
            ? "체성분 CSV 내보내기"
            : bodyActionPanel === "manual-match"
              ? "InBody 수동 매칭 큐"
              : "목표 설정"
        }
        testId="body-composition-action-panel"
        footer={
          <>
            <Button variant="outline" onClick={() => setBodyActionPanel(null)}>
              닫기
            </Button>
            <Button
              onClick={() => {
                notify(
                  bodyActionPanel === "csv"
                    ? "CSV 내보내기 요청 완료"
                    : "수동 매칭 상태 반영",
                  "success",
                );
                setBodyActionPanel(null);
              }}
            >
              상태 반영
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-sm">
          <InfoCell
            label="회원"
            value={`${activeMember.name} · ${activeMember.no}`}
          />
          <InfoCell label="측정 이력" value={`${rows.length}건`} />
          <InfoCell
            label="구현 연결"
            value={
              bodyActionPanel === "csv"
                ? "GET /body-composition/export?memberId="
                : "POST /inbody/manual-match"
            }
          />
          <div className="rounded-xl border border-line bg-white p-4 text-content-secondary">
            {bodyActionPanel === "csv"
              ? "현재 선택 회원, 기간, 표시 지표 토글을 내보내기 payload로 넘깁니다. 파일 생성은 퍼블리싱 범위 밖입니다."
              : "장비에서 넘어온 미매칭 측정값을 회원/측정일 기준으로 수동 연결하는 운영 큐입니다."}
          </div>
        </div>
      </AdminSlidePanel>
    </div>
  );
}

function MemberMergeScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  const [primary, setPrimary] = useState<string>("");
  const [secondary, setSecondary] = useState<string>("");
  const [fieldPolicy, setFieldPolicy] = useState<Record<string, string>>({
    이름: "주 계정",
    연락처: "주 계정",
    "프로필 사진": "최신값",
    이용권: "합산 이전",
    등록일: "최초 등록일",
    "최근 방문일": "최신값",
  });
  const [mergeResult, setMergeResult] = useState("");
  const [rollbackStatus, setRollbackStatus] =
    useState("병합 전 · 롤백 타이머 대기");
  const candidates = memberDirectoryRows.slice(0, 3);
  const compareRows = [
    {
      항목: "이름",
      "주 계정": "김민준",
      "부 계정": "김민준A",
      채택: fieldPolicy.이름,
    },
    {
      항목: "연락처",
      "주 계정": "010-1234-5678",
      "부 계정": "010-9876-5432",
      채택: fieldPolicy.연락처,
    },
    {
      항목: "프로필 사진",
      "주 계정": "최신 (2026-05)",
      "부 계정": "구형 (2025-08)",
      채택: fieldPolicy["프로필 사진"],
    },
    {
      항목: "이용권",
      "주 계정": "PT 20회 잔여 8",
      "부 계정": "회원권 3개월",
      채택: fieldPolicy.이용권,
    },
    {
      항목: "등록일",
      "주 계정": "2026-01-12",
      "부 계정": "2025-08-04",
      채택: fieldPolicy.등록일,
    },
    {
      항목: "최근 방문일",
      "주 계정": "오늘 09:20",
      "부 계정": "2025-12-30",
      채택: fieldPolicy["최근 방문일"],
    },
  ];
  const bothSelected = primary && secondary && primary !== secondary;
  const conflictResolved = compareRows.every((row) => Boolean(row.채택));
  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="중복 회원 병합 (위험 액션)"
      />
      <div className="grid grid-cols-4 gap-3">
        {screen.metrics.map((m) => (
          <Card key={m.label} className="shadow-none">
            <CardHeader>
              <CardDescription>{m.label}</CardDescription>
              <CardTitle className="text-xl">{m.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-content-tertiary">{m.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-5">
        <div className="space-y-5">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>중복 회원 검색 + 주/부 지정</CardTitle>
              <CardDescription>
                이름·연락처·생년월일로 중복 의심 회원 검색. 동일 회원은 선택
                불가.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <Input placeholder="이름" defaultValue="김민준" />
                <Input placeholder="연락처" />
                <Input placeholder="생년월일" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="mb-2 text-xs font-bold text-content-secondary">
                    주 계정 (남길 계정)
                  </p>
                  <div className="space-y-2">
                    {candidates.map((c) => (
                      <button
                        key={`p-${c.no}`}
                        type="button"
                        className={cn(
                          "w-full rounded-lg border p-3 text-left text-sm",
                          primary === c.no && "border-blue-500 bg-blue-50",
                        )}
                        onClick={() => setPrimary(c.no)}
                      >
                        <b>{c.name}</b> · {c.phone}
                        <div className="text-xs text-content-tertiary">
                          {c.branch} · {c.pass}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-bold text-content-secondary">
                    부 계정 (병합 후 비활성)
                  </p>
                  <div className="space-y-2">
                    {candidates.map((c) => (
                      <button
                        key={`s-${c.no}`}
                        type="button"
                        disabled={primary === c.no}
                        className={cn(
                          "w-full rounded-lg border p-3 text-left text-sm disabled:opacity-45",
                          secondary === c.no && "border-rose-500 bg-rose-50",
                        )}
                        onClick={() => setSecondary(c.no)}
                      >
                        <b>{c.name}</b> · {c.phone}
                        <div className="text-xs text-content-tertiary">
                          {c.branch} · {c.pass}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>병합 전 정보 비교 + 채택 선택</CardTitle>
              <CardDescription>
                출석·결제·상담·체성분 이력은 모두 주 계정으로 이전됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {screen.tableColumns.map((c) => (
                        <TableHead key={c}>{c}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {compareRows.map((row) => (
                      <TableRow key={row.항목}>
                        <TableCell className="font-medium">
                          {row.항목}
                        </TableCell>
                        <TableCell>{row["주 계정"]}</TableCell>
                        <TableCell>{row["부 계정"]}</TableCell>
                        <TableCell>
                          <Select
                            value={row.채택}
                            onValueChange={(value) =>
                              setFieldPolicy((current) => ({
                                ...current,
                                [row.항목]: value,
                              }))
                            }
                          >
                            <SelectTrigger className="h-8 w-36">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "주 계정",
                                "부 계정",
                                "최신값",
                                "최초 등록일",
                                "합산 이전",
                                "수동 검토",
                              ].map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  data-dialog-id="DLG-M028"
                  variant="destructive"
                  disabled={!bothSelected || !conflictResolved}
                  onClick={() => {
                    if (!bothSelected) {
                      notify("주/부 계정 두 개 모두 선택해주세요.", "warning");
                      return;
                    }
                    if (!conflictResolved) {
                      notify(
                        "필드별 채택 정책을 모두 결정해주세요.",
                        "warning",
                      );
                      return;
                    }
                    setMergeResult(
                      "병합 검증 완료 · 부 계정 비활성 전환 · 5분 롤백 가능",
                    );
                    setRollbackStatus("04:59 남음 · 롤백 가능");
                    openDialog("DLG-M028");
                  }}
                >
                  회원 병합 확인 (위험)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>병합 후 처리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-content-secondary">
              <div>부 계정은 즉시 삭제가 아닌 비활성 전환</div>
              <div>90일 경과 시 PII 마스킹 자동 적용</div>
              <div>병합 5분 경과 후 취소 불가</div>
              <div>가족 그룹 대표가 부 계정인 경우 그룹 해체</div>
              <div>등급 즉시 재계산, 세그먼트 D+1 갱신</div>
              {mergeResult && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-700">
                  {mergeResult}
                </div>
              )}
              <div className="rounded-lg border border-line bg-white p-2">
                롤백 상태: {rollbackStatus}
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={!mergeResult || rollbackStatus.includes("만료")}
                onClick={() => {
                  setRollbackStatus("롤백 요청 접수 · DLG-M028 감사로그 연결");
                  notify("병합 롤백 요청 접수", "info");
                }}
              >
                병합 롤백 요청
              </Button>
            </CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function FamilyMembersScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  const initialFamilyGroups = [
    {
      이름: "김씨 가족",
      대표: "김민준",
      구성원: 3,
      활성: 2,
      "최근 결제": "2026-05-28",
      상태: "정상",
    },
    {
      이름: "박씨 가족",
      대표: "박서연",
      구성원: 4,
      활성: 3,
      "최근 결제": "2026-05-20",
      상태: "정원주의",
    },
    {
      이름: "정씨 가족",
      대표: "정하준",
      구성원: 2,
      활성: 1,
      "최근 결제": "2026-04-15",
      상태: "정산잠금",
    },
  ];
  const [groups, setGroups] = useState(initialFamilyGroups);
  const [activeGroup, setActiveGroup] = useState(groups[0]);
  const [familyResult, setFamilyResult] = useState("");
  const [pendingInvite, setPendingInvite] = useState("한유나");
  const members = [
    {
      이름: "김민준(대표)",
      관계: "본인",
      "이용권 상태": "활성·PT 20회",
      "최근 방문일": "오늘 09:20",
    },
    {
      이름: "김지우",
      관계: "자녀",
      "이용권 상태": "활성·키즈권",
      "최근 방문일": "2026-05-26",
    },
    {
      이름: "박서연",
      관계: "배우자",
      "이용권 상태": "임박·D-3",
      "최근 방문일": "2026-05-21",
    },
  ];
  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="가족 단위 운영"
      />
      <div className="grid grid-cols-4 gap-3">
        {screen.metrics.map((m) => (
          <Card key={m.label} className="shadow-none">
            <CardHeader>
              <CardDescription>{m.label}</CardDescription>
              <CardTitle className="text-xl">{m.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-content-tertiary">{m.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-[320px_minmax(0,1fr)] gap-5">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>가족 그룹</CardTitle>
            <CardDescription>대표 회원 기준 카드 목록</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full"
              onClick={() => {
                const newGroup = {
                  이름: "신규 가족 그룹",
                  대표: "한유나",
                  구성원: 1,
                  활성: 1,
                  "최근 결제": "없음",
                  상태: "초안",
                };
                setGroups((current) => [newGroup, ...current]);
                setActiveGroup(newGroup);
                setFamilyResult(
                  "새 그룹 초안 생성 · 대표 회원/약관 동의 확인 필요",
                );
              }}
            >
              + 새 그룹 만들기
            </Button>
            {groups.map((g) => (
              <button
                key={g.이름}
                type="button"
                className={cn(
                  "w-full rounded-xl border p-3 text-left",
                  activeGroup.이름 === g.이름 && "border-blue-500 bg-blue-50",
                )}
                onClick={() => setActiveGroup(g)}
              >
                <div className="flex items-center justify-between">
                  <b>{g.이름}</b>
                  <Badge variant="secondary">{g.구성원}명</Badge>
                </div>
                <div className="mt-1 text-xs text-content-tertiary">
                  대표 {g.대표} · 활성 {g.활성}명
                </div>
                <div className="mt-1 text-xs text-content-tertiary">
                  최근 결제 {g["최근 결제"]}
                </div>
                <div className="mt-1 text-xs font-semibold text-content-secondary">
                  상태 {g.상태}
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
        <div className="space-y-5">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>{activeGroup.이름} · 구성원</CardTitle>
              <CardDescription>
                그룹 정원 10명 한도. 무기명 법인은 가입 불가.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {screen.tableColumns.map((c) => (
                        <TableHead key={c}>{c}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((row) => (
                      <TableRow key={row.이름}>
                        <TableCell className="font-semibold">
                          {row.이름}
                        </TableCell>
                        <TableCell>{row.관계}</TableCell>
                        <TableCell>
                          {statusAwareValue(
                            row["이용권 상태"].split("·")[0].trim(),
                          )}{" "}
                          {row["이용권 상태"].split("·")[1]}
                        </TableCell>
                        <TableCell>{row["최근 방문일"]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-3 flex gap-2">
                <Select value={pendingInvite} onValueChange={setPendingInvite}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {memberDirectoryRows
                      .filter((member) => !member.name.includes("김민준"))
                      .map((member) => (
                        <SelectItem key={member.no} value={member.name}>
                          {member.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  data-dialog-id="DLG-M029"
                  onClick={() => {
                    if (activeGroup.구성원 >= 10) {
                      setFamilyResult("정원 10명 초과로 가족 연결 차단");
                      return;
                    }
                    setFamilyResult(
                      `${pendingInvite} 가족 연결 검증 완료 · DLG-M029 확인 대기`,
                    );
                    openDialog("DLG-M029");
                  }}
                >
                  가족 연결 (구성원 추가)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFamilyResult(
                      `${activeGroup.이름} 구성원 제거 사유 입력 대기 · 대표/정산잠금이면 차단`,
                    );
                    openDialog("DLG-M029");
                  }}
                >
                  구성원 제거
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (activeGroup.구성원 > 0) {
                      setFamilyResult(
                        "그룹 삭제 차단 · 구성원/포인트/약관 동의 상태 먼저 정리 필요",
                      );
                      notify(
                        "구성원이 있는 그룹은 바로 삭제할 수 없습니다.",
                        "warning",
                      );
                      return;
                    }
                    setFamilyResult("그룹 삭제 대기 · 복구 불가 확인 필요");
                  }}
                >
                  그룹 삭제
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>가족 단위 요약</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-3 text-sm">
              <InfoCell label="가족 전체 이용권" value="활성 2 · 임박 1" />
              <InfoCell label="활성 회원" value="2명" />
              <InfoCell label="총 마일리지" value="3,400 (합산 정책 ON)" />
              <div className="col-span-3 rounded-xl border border-line bg-surface-secondary p-3 text-xs text-content-secondary">
                {familyResult ||
                  "가족 연결/제거/삭제 액션을 누르면 정원·중복·잠금·약관 정책 결과가 여기에 표시됩니다."}
              </div>
            </CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </div>
      </div>
    </div>
  );
}

function MemberSegmentsScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  type SegmentRow = {
    세그먼트: string;
    "조건 설명": string;
    "현재 회원 수": string;
    "마지막 업데이트": string;
    "자동 갱신 주기": string;
    상태: string;
  };
  type PreviewRow = {
    회원: string;
    상태: string;
    조건근거: string;
    최근방문: string;
    동의: string;
  };

  const autoSegments: SegmentRow[] = [
    {
      세그먼트: "신규(자동)",
      "조건 설명": "첫 정상 결제 +30일 이내",
      "현재 회원 수": "52",
      "마지막 업데이트": "오늘 04:00",
      "자동 갱신 주기": "매일/이벤트",
      상태: "자동 잠금",
    },
    {
      세그먼트: "이탈위험(자동)",
      "조건 설명": "활성+30일 무방문(2h 중복 1회)",
      "현재 회원 수": "86",
      "마지막 업데이트": "오늘 04:00",
      "자동 갱신 주기": "매일/이벤트",
      상태: "자동 잠금",
    },
    {
      세그먼트: "만료임박(자동)",
      "조건 설명": "HQ-09 회원 이용권 만료 step",
      "현재 회원 수": "184",
      "마지막 업데이트": "오늘 04:00",
      "자동 갱신 주기": "매일/이벤트",
      상태: "자동 잠금",
    },
    {
      세그먼트: "활발(자동)",
      "조건 설명": "최근 30일 방문 8회 이상",
      "현재 회원 수": "112",
      "마지막 업데이트": "오늘 04:00",
      "자동 갱신 주기": "매일/이벤트",
      상태: "자동 잠금",
    },
    {
      세그먼트: "관심필요(자동)",
      "조건 설명": "최근 90일 평가/상담 없음",
      "현재 회원 수": "73",
      "마지막 업데이트": "오늘 04:00",
      "자동 갱신 주기": "매일/이벤트",
      상태: "자동 잠금",
    },
    {
      세그먼트: "만료후미등록(자동)",
      "조건 설명": "마지막 만료 +60일, 재등록 없음",
      "현재 회원 수": "48",
      "마지막 업데이트": "오늘 04:00",
      "자동 갱신 주기": "매일/이벤트",
      상태: "자동 잠금",
    },
    {
      세그먼트: "충성(보조)",
      "조건 설명": "누적 12개월+ 골드 이상",
      "현재 회원 수": "42",
      "마지막 업데이트": "오늘 04:00",
      "자동 갱신 주기": "매일",
      상태: "보조 라벨",
    },
  ];
  const [tab, setTab] = useState<"자동" | "사용자" | "빌더">("자동");
  const [userSegments, setUserSegments] = useState<SegmentRow[]>([
    {
      세그먼트: "재등록 캠페인 대상",
      "조건 설명": "만료 45일 이내 + 광고 동의 + 최근 상담 없음",
      "현재 회원 수": "31",
      "마지막 업데이트": "오늘 10:12",
      "자동 갱신 주기": "수동/매주 월",
      상태: "운영중",
    },
    {
      세그먼트: "PT 업셀 우선",
      "조건 설명": "헬스 이용권 활성 + PT 구매 이력 없음 + 방문 6회+",
      "현재 회원 수": "24",
      "마지막 업데이트": "어제 18:20",
      "자동 갱신 주기": "매일 04:00",
      상태: "검수 완료",
    },
  ]);
  const [builderName, setBuilderName] = useState("5월 이탈 회복 캠페인");
  const [conditionMode, setConditionMode] = useState("AND");
  const [refreshCycle, setRefreshCycle] = useState("매일 04:00");
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<SegmentRow | null>(
    autoSegments[1],
  );
  const [segmentResult, setSegmentResult] = useState(
    "세그먼트를 선택하거나 조건 빌더 미리보기를 실행하면 대상·동의·중복 정책 결과가 여기에 표시됩니다.",
  );
  const [syncState, setSyncState] = useState(
    "마지막 캐시 재계산: 오늘 04:00 · 이벤트 동기화 정상",
  );
  const visibleSegments = tab === "자동" ? autoSegments : userSegments;
  const canSaveBuilder =
    builderName.trim().length >= 4 && previewRows.length > 0;

  const runPreview = () => {
    const rows: PreviewRow[] = [
      {
        회원: "박서연 / 010-23**-91**",
        상태: "만료 18일 경과",
        조건근거: "무방문 31일 · 광고 SMS 동의",
        최근방문: "2026-04-28",
        동의: "SMS 가능",
      },
      {
        회원: "이도현 / 010-77**-34**",
        상태: "활성+이탈위험",
        조건근거: "결제 정상 · 무방문 36일",
        최근방문: "2026-04-22",
        동의: "카카오만 가능",
      },
      {
        회원: "최민지 / 010-88**-10**",
        상태: "상담필요",
        조건근거: "상담 없음 92일 · 락커 만료 임박",
        최근방문: "2026-05-01",
        동의: "광고 제외",
      },
    ];
    setPreviewRows(rows);
    setSelectedSegment({
      세그먼트: builderName || "새 세그먼트",
      "조건 설명": `${conditionMode} 조건 · ${screen.filters.slice(0, 3).join(" · ")}`,
      "현재 회원 수": "86",
      "마지막 업데이트": "미리보기 방금",
      "자동 갱신 주기": refreshCycle,
      상태: "저장 전 미리보기",
    });
    setSegmentResult(
      "미리보기 완료 · 대상 86명 · 광고 제외 11명 자동 차단 · 중복 라벨 7명 우선순위 적용 · 샘플 명단 PII 마스킹",
    );
    setSyncState("미리보기 캐시 생성: 방금 · 저장 전 실제 발송/쿠폰 연결 없음");
  };

  const saveBuilder = () => {
    const next: SegmentRow = {
      세그먼트: builderName,
      "조건 설명": `${conditionMode} 조건 · ${screen.filters.slice(0, 3).join(" · ")}`,
      "현재 회원 수": "86",
      "마지막 업데이트": "방금 저장",
      "자동 갱신 주기": refreshCycle,
      상태: "검수 대기",
    };
    setUserSegments((prev) => [
      next,
      ...prev.filter((s) => s.세그먼트 !== next.세그먼트),
    ]);
    setSelectedSegment(next);
    setSegmentResult(
      `${next.세그먼트} 저장 완료 · 사용자 정의 탭 반영 · 수정/삭제는 DLG-M010 확인 후 가능`,
    );
    setTab("사용자");
    notify(
      "사용자 정의 세그먼트가 mock/local state에 저장되었습니다.",
      "success",
    );
  };

  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="자동 7종 + 사용자 세그먼트"
      />
      <div className="grid grid-cols-4 gap-3">
        {screen.metrics.map((m) => (
          <Card key={m.label} className="shadow-none">
            <CardHeader>
              <CardDescription>{m.label}</CardDescription>
              <CardTitle className="text-xl">{m.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-content-tertiary">{m.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-5">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>세그먼트 목록</CardTitle>
            <CardDescription>
              자동 7종은 시스템 정의라 수정/삭제가 hidden이고, 사용자 정의는
              mock/local state로 생성·미리보기·저장 흐름을 완성합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              {(["자동", "사용자", "빌더"] as const).map((t) => (
                <Button
                  key={t}
                  variant={tab === t ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTab(t)}
                >
                  {t === "자동"
                    ? "자동 7종"
                    : t === "사용자"
                      ? `사용자 정의 ${userSegments.length}`
                      : "조건 빌더"}
                </Button>
              ))}
              <Button
                size="sm"
                className="ml-auto"
                onClick={() => {
                  setTab("빌더");
                  setBuilderName("5월 이탈 회복 캠페인");
                  setPreviewRows([]);
                  setSegmentResult(
                    "새 세그먼트 작성 시작 · 조건 선택 후 미리보기를 먼저 실행해야 저장 가능합니다.",
                  );
                }}
              >
                + 새 세그먼트
              </Button>
            </div>
            {tab === "빌더" ? (
              <div className="space-y-4 rounded-xl border bg-surface-secondary p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>세그먼트명</Label>
                    <Input
                      value={builderName}
                      onChange={(event) => setBuilderName(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>조건 결합</Label>
                    <Select
                      value={conditionMode}
                      onValueChange={setConditionMode}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">AND · 모두 만족</SelectItem>
                        <SelectItem value="OR">OR · 하나 이상</SelectItem>
                        <SelectItem value="NESTED">
                          중첩 · 최대 3단계
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>자동 갱신 주기</Label>
                    <Select
                      value={refreshCycle}
                      onValueChange={setRefreshCycle}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="매일 04:00">매일 04:00</SelectItem>
                        <SelectItem value="매주 월 04:00">
                          매주 월 04:00
                        </SelectItem>
                        <SelectItem value="수동 갱신">수동 갱신</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>운영 메모</Label>
                    <Input
                      placeholder="캠페인 목적 / 제외 조건"
                      defaultValue="발송 전 광고동의 재검증"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {screen.filters.map((f) => (
                    <label
                      key={f}
                      className="flex items-center gap-2 rounded-lg bg-white p-3 text-xs text-content-secondary"
                    >
                      <input
                        type="checkbox"
                        defaultChecked={
                          f.includes("방문") || f.includes("이용권")
                        }
                      />
                      <span>{f}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={runPreview}>
                    미리보기
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setSyncState(
                        "캐시 새로고침 요청됨 · 2h 중복 방지 큐 대기",
                      )
                    }
                  >
                    캐시 새로고침
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!canSaveBuilder}
                    onClick={saveBuilder}
                  >
                    저장
                  </Button>
                </div>
                {previewRows.length > 0 && (
                  <div className="overflow-hidden rounded-xl border bg-white">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {["회원", "상태", "조건근거", "최근방문", "동의"].map(
                            (c) => (
                              <TableHead key={c}>{c}</TableHead>
                            ),
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewRows.map((row) => (
                          <TableRow key={row.회원}>
                            <TableCell className="font-semibold">
                              {row.회원}
                            </TableCell>
                            <TableCell>{row.상태}</TableCell>
                            <TableCell className="text-xs text-content-secondary">
                              {row.조건근거}
                            </TableCell>
                            <TableCell className="text-xs">
                              {row.최근방문}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  row.동의.includes("제외")
                                    ? "warning"
                                    : "success"
                                }
                              >
                                {row.동의}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {[
                        "세그먼트",
                        "조건 설명",
                        "현재 회원 수",
                        "마지막 업데이트",
                        "자동 갱신 주기",
                        "상태",
                        "액션",
                      ].map((c) => (
                        <TableHead key={c}>{c}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleSegments.map((row) => (
                      <TableRow key={row.세그먼트}>
                        <TableCell className="font-semibold">
                          {row.세그먼트}
                        </TableCell>
                        <TableCell className="text-xs text-content-secondary">
                          {row["조건 설명"]}
                        </TableCell>
                        <TableCell>
                          <Badge variant="info">{row["현재 회원 수"]}</Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {row["마지막 업데이트"]}
                        </TableCell>
                        <TableCell className="text-xs">
                          {row["자동 갱신 주기"]}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              row.상태.includes("잠금")
                                ? "secondary"
                                : "success"
                            }
                          >
                            {row.상태}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedSegment(row);
                                setSegmentResult(
                                  `${row.세그먼트} 대상 ${row["현재 회원 수"]}명 조회 · 샘플 PII 마스킹 · 광고 미동의 자동 제외`,
                                );
                              }}
                            >
                              보기
                            </Button>
                            {tab === "사용자" && (
                              <Button
                                size="sm"
                                variant="outline"
                                data-dialog-id="DLG-M010"
                                onClick={() => openDialog("DLG-M010")}
                              >
                                삭제
                              </Button>
                            )}
                            <Button
                              size="sm"
                              data-dialog-id="DLG-M009"
                              variant="outline"
                              onClick={() => openDialog("DLG-M009")}
                            >
                              메모
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {tab === "사용자" && userSegments.length === 0 && (
                  <div className="grid place-items-center p-10 text-sm text-content-tertiary">
                    사용자 정의 세그먼트가 없습니다. + 새 세그먼트 만들기로
                    시작하세요.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>선택 세그먼트 운영 패널</CardTitle>
              <CardDescription>
                설명은 사이드에서 고정 노출하고, 버튼은 실제 라우트/다이얼로그로
                연결합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoCell
                label="선택"
                value={selectedSegment?.세그먼트 || "미선택"}
              />
              <InfoCell
                label="대상"
                value={
                  selectedSegment?.["현재 회원 수"]
                    ? `${selectedSegment["현재 회원 수"]}명`
                    : "-"
                }
              />
              <InfoCell
                label="조건"
                value={selectedSegment?.["조건 설명"] || "-"}
              />
              <div className="rounded-xl border border-line bg-surface-secondary p-3 text-xs text-content-secondary">
                {segmentResult}
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800">
                {syncState}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>액션 연결</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link
                  href={`/message?segment=${encodeURIComponent(selectedSegment?.세그먼트 || "")}`}
                >
                  메시지 발송 (SCR-071)
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link
                  href={`/message/coupon?segment=${encodeURIComponent(selectedSegment?.세그먼트 || "")}`}
                >
                  쿠폰 발급 (SCR-073)
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  setSegmentResult(
                    "이용권 혜택 적용 준비 · 활성권/만료권/가족권 중복 정책 검토 필요",
                  )
                }
              >
                이용권 혜택 적용
              </Button>
              <Button
                data-dialog-id="DLG-M009"
                variant="outline"
                className="w-full"
                onClick={() => openDialog("DLG-M009")}
              >
                운영 메모 추가
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>자동 라벨 우선순위</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-content-secondary">
              <div>
                이탈위험 &gt; 만료임박 &gt; 신규 &gt; 활발 &gt; 관심필요 &gt;
                만료후미등록
              </div>
              <div>충성은 보조 라벨 (기본 라벨과 중복 표시 가능)</div>
              <div>FC는 메시지 발송만 가능, 샘플 명단 PII 마스킹</div>
              <div>저장/삭제는 실제 API 없이 local state와 DLG-M010만 수행</div>
            </CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function SalesOverviewScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  // admin-pando sales/page.tsx 구조 1:1 이식
  const [preset, setPreset] = useState("이번 달");
  const [activeTab, setActiveTab] = useState<
    "TAB-001" | "TAB-002" | "TAB-006" | "TAB-007"
  >("TAB-001");
  const [searchValue, setSearchValue] = useState("");
  const [periodUnit, setPeriodUnit] = useState<"일" | "주" | "월">("일");
  const [roundFilter, setRoundFilter] = useState("");
  const rows = salesLedgerRows.filter((row) =>
    `${row.buyer} ${row.product} ${row.status}`.includes(searchValue),
  );

  const PRESETS = [
    "오늘",
    "이번 주",
    "이번 달",
    "지난 달",
    "최근 3개월",
    "올해",
  ];
  const ROUND_TYPES = ["신규", "재등록", "휴면복귀", "기타"];

  const tabs = [
    { key: "TAB-001" as const, label: "전체 거래" },
    { key: "TAB-002" as const, label: "기간별 집계" },
    { key: "TAB-006" as const, label: "환불 내역" },
    { key: "TAB-007" as const, label: "미수 내역" },
  ];

  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="매출 운영 (admin-pando 구조)"
      />

      {/* PageHeader — admin-pando 1:1 */}
      <div className="flex items-end justify-between border-b border-line/60 pb-4">
        <div>
          <h1 className="text-[24px] font-black tracking-tight text-content">
            매출 관리
          </h1>
          <p className="mt-1 text-[13px] text-content-secondary">
            결제·환불·미수·할부 거래를 통합 추적하고 운영 코크핏에서 우선
            처리합니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => notify("엑셀 다운로드 mock", "info")}
          >
            Excel
          </Button>
          <Button asChild size="sm">
            <Link href="/sales/pos">+ 신규 결제(POS)</Link>
          </Button>
        </div>
      </div>

      {/* 운영 코크핏 + 처리 큐 — admin-pando 1:1 */}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.95fr)]">
        <section className="rounded-2xl border border-line bg-surface p-5 shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-content-tertiary">
                Sales Cockpit
              </p>
              <h2 className="mt-1 text-[20px] font-bold text-content">
                운영 코크핏
              </h2>
              <p className="mt-1 text-[13px] leading-relaxed text-content-secondary">
                미수 추적, 환불 검토, 재등록 성과를 한 화면에서 우선순위대로
                확인하고 바로 처리합니다.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/sales/pos">POS 열기</Link>
            </Button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <button
              className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-left transition-colors hover:bg-rose-100/80"
              onClick={() => setActiveTab("TAB-007")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-content">
                      미수 추적
                    </p>
                    <p className="text-[11px] text-content-tertiary">
                      당장 회수 필요한 거래
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-content-tertiary" />
              </div>
              <p className="mt-3 text-[24px] font-bold tabular-nums text-rose-600">
                1,120,000원
              </p>
              <p className="mt-1 text-[12px] text-content-secondary">
                3건 미수 거래가 남아 있습니다.
              </p>
            </button>
            <button
              className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left transition-colors hover:bg-amber-100/80"
              onClick={() => setActiveTab("TAB-006")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-content">
                      환불 검토
                    </p>
                    <p className="text-[11px] text-content-tertiary">
                      금액 영향이 큰 환불 건
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-content-tertiary" />
              </div>
              <p className="mt-3 text-[24px] font-bold tabular-nums text-amber-700">
                620,000원
              </p>
              <p className="mt-1 text-[12px] text-content-secondary">
                9건 환불 내역을 점검해야 합니다.
              </p>
            </button>
            <button
              className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-left transition-colors hover:bg-emerald-100/80"
              onClick={() => {
                setActiveTab("TAB-001");
                setRoundFilter("재등록");
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-content">
                      재등록 성과
                    </p>
                    <p className="text-[11px] text-content-tertiary">
                      잔존 매출 회복 흐름
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-content-tertiary" />
              </div>
              <p className="mt-3 text-[24px] font-bold tabular-nums text-emerald-700">
                5,400,000원
              </p>
              <p className="mt-1 text-[12px] text-content-secondary">
                14건 재등록·휴면복귀 거래가 잡혀 있습니다.
              </p>
            </button>
            <button
              className="rounded-2xl border border-violet-200 bg-violet-50 p-4 text-left transition-colors hover:bg-violet-100/80"
              onClick={() => setActiveTab("TAB-001")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-content">
                      고할인 거래
                    </p>
                    <p className="text-[11px] text-content-tertiary">
                      마진 점검 대상
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-content-tertiary" />
              </div>
              <p className="mt-3 text-[24px] font-bold tabular-nums text-violet-700">
                8건
              </p>
              <p className="mt-1 text-[12px] text-content-secondary">
                5만원 이상 할인 거래를 따로 확인할 수 있습니다.
              </p>
            </button>
          </div>
        </section>

        <aside className="rounded-2xl border border-line bg-surface p-5 shadow-card">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-content-tertiary">
              Action Queue
            </p>
            <h2 className="mt-1 text-[18px] font-bold text-content">처리 큐</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-content-secondary">
              미수, 환불, 재등록 거래를 영향도 기준으로 모아 둡니다.
            </p>
          </div>
          <div className="mt-4 space-y-2">
            {salesLedgerRows.slice(0, 3).map((row) => (
              <div
                key={row.id}
                className="rounded-2xl border border-line bg-white/70 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[13px] font-semibold text-content">
                      {row.buyer}
                    </p>
                    <p className="mt-0.5 text-[12px] text-content-secondary">
                      {row.product}
                    </p>
                  </div>
                  <Badge
                    variant={
                      row.status === "미수"
                        ? "warning"
                        : row.status === "환불요청"
                          ? "destructive"
                          : "success"
                    }
                  >
                    {row.status}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 text-[12px] text-content-secondary">
                  <span>
                    {row.date} · {row.owner}
                  </span>
                  <span className="font-semibold tabular-nums text-content">
                    {row.paid}원
                  </span>
                </div>
                <div className="mt-3 flex gap-1">
                  <Button size="sm" onClick={() => openDialog("DLG-S001")}>
                    거래 보기
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/members/detail">회원 보기</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* 필터 영역 — admin-pando 1:1 */}
      <div className="space-y-3">
        {/* 기간 프리셋 */}
        <div className="flex flex-wrap items-center gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => {
                setPreset(p);
                notify(`${p} 기간 적용`, "info");
              }}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-[13px] font-semibold transition-all",
                preset === p
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-surface text-content-secondary border-line hover:border-primary hover:text-primary",
              )}
            >
              {p}
            </button>
          ))}
        </div>

        {/* 검색 + 필터 행 */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative max-w-md flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary"
              size={14}
            />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="구매자 또는 상품명 검색..."
              className="pl-8 h-9"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-32 h-9">
              <SelectValue placeholder="유형" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 유형</SelectItem>
              <SelectItem value="new">신규</SelectItem>
              <SelectItem value="renewal">재등록</SelectItem>
              <SelectItem value="refund">환불</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-32 h-9">
              <SelectValue placeholder="상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 상태</SelectItem>
              <SelectItem value="paid">결제완료</SelectItem>
              <SelectItem value="unpaid">미수</SelectItem>
              <SelectItem value="refunded">환불</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchValue("");
              setRoundFilter("");
              notify("필터 초기화", "info");
            }}
          >
            초기화
          </Button>
        </div>
      </div>

      {/* round 유형 필터 — admin-pando 1:1 */}
      {activeTab === "TAB-001" && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[12px] font-semibold text-content-secondary">
            매출유형:
          </span>
          <button
            onClick={() => setRoundFilter("")}
            className={cn(
              "rounded-lg border px-2.5 py-1 text-[12px] font-semibold transition-all",
              roundFilter === ""
                ? "bg-primary text-white border-primary"
                : "bg-surface text-content-secondary border-line hover:border-primary hover:text-primary",
            )}
          >
            전체
          </button>
          {ROUND_TYPES.map((r) => (
            <button
              key={r}
              onClick={() => setRoundFilter((prev) => (prev === r ? "" : r))}
              className={cn(
                "rounded-lg border px-2.5 py-1 text-[12px] font-semibold transition-all",
                roundFilter === r
                  ? "bg-primary text-white border-primary"
                  : "bg-surface text-content-secondary border-line hover:border-primary hover:text-primary",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      )}

      {/* 탭 + 테이블 — admin-pando 1:1 */}
      <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
        <div className="flex gap-6 border-b border-line px-5 pt-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "relative pb-2.5 text-[13px] font-medium transition-colors",
                activeTab === tab.key
                  ? "text-primary"
                  : "text-content-secondary hover:text-content",
              )}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute -bottom-px left-0 right-0 h-0.5 rounded-t-full bg-primary" />
              )}
            </button>
          ))}
        </div>

        {activeTab === "TAB-002" && (
          <div className="flex items-center gap-1.5 px-5 pt-3">
            {(["일", "주", "월"] as const).map((unit) => (
              <button
                key={unit}
                onClick={() => setPeriodUnit(unit)}
                className={cn(
                  "rounded-lg border px-3 py-1 text-[13px] font-semibold transition-all",
                  periodUnit === unit
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-surface text-content-secondary border-line hover:border-primary hover:text-primary",
                )}
              >
                {unit}별
              </button>
            ))}
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  "매출번호",
                  "회원",
                  "상품",
                  "총액",
                  "할인",
                  "수납",
                  "상태",
                  "수단",
                  "담당",
                  "경로",
                  "일시",
                ].map((col) => (
                  <TableHead key={col}>{col}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => openDialog("DLG-S001")}
                >
                  <TableCell className="text-[12px] tabular-nums">
                    {row.id}
                  </TableCell>
                  <TableCell className="font-semibold">{row.buyer}</TableCell>
                  <TableCell>{row.product}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {row.gross}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-content-secondary">
                    {row.discount}
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {row.paid}
                  </TableCell>
                  <TableCell>{statusAwareValue(row.status)}</TableCell>
                  <TableCell className="text-[12px]">{row.method}</TableCell>
                  <TableCell className="text-[12px]">{row.owner}</TableCell>
                  <TableCell className="text-[12px]">{row.route}</TableCell>
                  <TableCell className="text-[12px] text-content-secondary">
                    {row.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 하단 요약 바 7종 — admin-pando 1:1 */}
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-xl border border-line bg-surface p-5 shadow-card">
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-[11px] text-content-tertiary">총 매출액</p>
            <p className="text-[18px] font-bold tabular-nums text-primary">
              19,500,000원
            </p>
          </div>
          <div>
            <p className="text-[11px] text-content-tertiary">
              순 매출액 <span className="text-[10px]">(환불 차감)</span>
            </p>
            <p className="text-[18px] font-bold tabular-nums text-accent">
              18,420,000원
            </p>
          </div>
          <div className="hidden sm:block h-10 w-px bg-line" />
          <div>
            <p className="text-[11px] text-content-tertiary">현금 합계</p>
            <p className="text-[18px] font-bold tabular-nums text-content">
              4,500,000원
            </p>
          </div>
          <div>
            <p className="text-[11px] text-content-tertiary">카드 합계</p>
            <p className="text-[18px] font-bold tabular-nums text-content">
              12,800,000원
            </p>
          </div>
          <div>
            <p className="text-[11px] text-content-tertiary">포인트 합계</p>
            <p className="text-[18px] font-bold tabular-nums text-content">
              530,000원
            </p>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="text-right">
            <p className="text-[11px] text-content-tertiary">환불 금액</p>
            <p className="text-[15px] font-semibold tabular-nums text-rose-600">
              -620,000원
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-content-tertiary">미납 금액</p>
            <p className="text-[15px] font-semibold tabular-nums text-amber-700">
              1,120,000원
            </p>
          </div>
        </div>
      </div>

      {/* 검수용 핸드오프 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <HandoffContractCard screen={screen} />
        <DialogDock screen={screen} openDialog={openDialog} />
      </div>
    </div>
  );
}

function PosSalesScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  // admin-pando /pos/page.tsx 구조 1:1 이식
  // 카테고리 탭 (이용권/PT/GX/기타) + 상품 그리드 + 우측 장바구니
  // docs4 V1 D03-매출관리 / D05-상품관리 컨텐츠 반영
  const categoryTabs = [
    { key: "이용권", label: "이용권", color: "bg-blue-100 text-blue-700" },
    { key: "PT", label: "PT", color: "bg-emerald-100 text-emerald-700" },
    { key: "GX", label: "GX", color: "bg-violet-100 text-violet-700" },
    { key: "기타", label: "기타", color: "bg-amber-100 text-amber-700" },
  ];

  // docs4 V1/V2 상품 타입 배지 정책 (회원권/수강권/대여권/일반)
  const productTypeBadge: Record<string, { label: string; className: string }> =
    {
      MEMBERSHIP: { label: "회원권", className: "bg-blue-100 text-blue-700" },
      LESSON: { label: "수강권", className: "bg-emerald-100 text-emerald-700" },
      RENTAL: { label: "대여권", className: "bg-amber-100 text-amber-700" },
      GENERAL: { label: "일반", className: "bg-slate-100 text-slate-700" },
    };

  type PosProduct = {
    id: number;
    name: string;
    category: "이용권" | "PT" | "GX" | "기타";
    productType: keyof typeof productTypeBadge;
    cashPrice: number;
    cardPrice: number;
    period: string;
    count: string;
    stock: number | null;
  };

  const productsAll: PosProduct[] = [
    {
      id: 1,
      name: "회원권 3개월",
      category: "이용권",
      productType: "MEMBERSHIP",
      cashPrice: 450000,
      cardPrice: 480000,
      period: "90일",
      count: "-",
      stock: null,
    },
    {
      id: 2,
      name: "회원권 6개월",
      category: "이용권",
      productType: "MEMBERSHIP",
      cashPrice: 780000,
      cardPrice: 820000,
      period: "180일",
      count: "-",
      stock: null,
    },
    {
      id: 3,
      name: "회원권 12개월",
      category: "이용권",
      productType: "MEMBERSHIP",
      cashPrice: 1400000,
      cardPrice: 1480000,
      period: "365일",
      count: "-",
      stock: null,
    },
    {
      id: 4,
      name: "락커 1개월",
      category: "이용권",
      productType: "RENTAL",
      cashPrice: 30000,
      cardPrice: 33000,
      period: "30일",
      count: "-",
      stock: 12,
    },
    {
      id: 5,
      name: "PT 10회권",
      category: "PT",
      productType: "LESSON",
      cashPrice: 650000,
      cardPrice: 680000,
      period: "60일",
      count: "10회",
      stock: null,
    },
    {
      id: 6,
      name: "PT 20회권",
      category: "PT",
      productType: "LESSON",
      cashPrice: 1200000,
      cardPrice: 1260000,
      period: "120일",
      count: "20회",
      stock: null,
    },
    {
      id: 7,
      name: "PT 30회권",
      category: "PT",
      productType: "LESSON",
      cashPrice: 1700000,
      cardPrice: 1780000,
      period: "150일",
      count: "30회",
      stock: null,
    },
    {
      id: 8,
      name: "GX 요가 8회",
      category: "GX",
      productType: "LESSON",
      cashPrice: 180000,
      cardPrice: 190000,
      period: "60일",
      count: "8회",
      stock: null,
    },
    {
      id: 9,
      name: "GX 필라테스 8회",
      category: "GX",
      productType: "LESSON",
      cashPrice: 220000,
      cardPrice: 230000,
      period: "60일",
      count: "8회",
      stock: null,
    },
    {
      id: 10,
      name: "운동복 대여 1개월",
      category: "기타",
      productType: "RENTAL",
      cashPrice: 20000,
      cardPrice: 22000,
      period: "30일",
      count: "-",
      stock: 0,
    },
    {
      id: 11,
      name: "프로틴 셰이크",
      category: "기타",
      productType: "GENERAL",
      cashPrice: 5000,
      cardPrice: 5500,
      period: "-",
      count: "1개",
      stock: 4,
    },
    {
      id: 12,
      name: "스포츠 음료",
      category: "기타",
      productType: "GENERAL",
      cashPrice: 2500,
      cardPrice: 2800,
      period: "-",
      count: "1병",
      stock: 18,
    },
  ];

  const [activeCategory, setActiveCategory] = useState<
    "이용권" | "PT" | "GX" | "기타"
  >("이용권");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<
    Array<
      PosProduct & {
        cartId: string;
        priceType: "cash" | "card";
        quantity: number;
      }
    >
  >([]);
  const [cartSeq, setCartSeq] = useState(0);
  const [buyer, setBuyer] = useState<{ name: string; phone: string } | null>(
    null,
  );

  const filteredProducts = productsAll
    .filter((p) => p.category === activeCategory)
    .filter((p) => !searchQuery || p.name.includes(searchQuery));

  const addToCart = (product: PosProduct) => {
    if (product.stock === 0) {
      notify(`${product.name}은(는) 품절 상태입니다.`, "warning");
      return;
    }
    const nextSeq = cartSeq + 1;
    setCartSeq(nextSeq);
    const cartId = `${product.id}-${nextSeq}`;
    setCart((current) => [
      ...current,
      { ...product, cartId, priceType: "cash", quantity: 1 },
    ]);
    notify(`${product.name} 장바구니 추가`, "info");
  };

  const removeFromCart = (cartId: string) => {
    setCart((current) => current.filter((item) => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart((current) =>
      current.map((item) =>
        item.cartId === cartId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const togglePriceType = (cartId: string) => {
    setCart((current) =>
      current.map((item) =>
        item.cartId === cartId
          ? { ...item, priceType: item.priceType === "cash" ? "card" : "cash" }
          : item,
      ),
    );
  };

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      (item.priceType === "cash" ? item.cashPrice : item.cardPrice) *
        item.quantity,
    0,
  );
  const cashTotal = cart
    .filter((i) => i.priceType === "cash")
    .reduce((s, i) => s + i.cashPrice * i.quantity, 0);
  const cardTotal = cart
    .filter((i) => i.priceType === "card")
    .reduce((s, i) => s + i.cardPrice * i.quantity, 0);

  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="현장 판매 POS · 외부 결제 완료 → CRM 기록"
      />
      <div className="grid grid-cols-[minmax(0,1fr)_400px] gap-5">
        {/* 좌측: 카테고리 + 검색 + 상품 그리드 */}
        <div className="space-y-3">
          <Card className="shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>상품 선택</CardTitle>
                <CardDescription className="text-xs">
                  재고 0 = 품절 클릭 차단 · 5개 이하 = 안전재고 경고
                </CardDescription>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary"
                  />
                  <Input
                    placeholder="상품명 검색"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
              </div>
              <div className="mt-2 flex gap-1 border-b border-line">
                {categoryTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() =>
                      setActiveCategory(tab.key as typeof activeCategory)
                    }
                    className={cn(
                      "px-4 py-2 text-sm font-semibold border-b-2 transition-colors",
                      activeCategory === tab.key
                        ? "border-primary text-primary"
                        : "border-transparent text-content-secondary hover:text-content",
                    )}
                  >
                    {tab.label}
                    <span
                      className={cn(
                        "ml-1.5 rounded-full px-1.5 py-0.5 text-[10px]",
                        tab.color,
                      )}
                    >
                      {productsAll.filter((p) => p.category === tab.key).length}
                    </span>
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredProducts.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-sm text-content-tertiary">
                    {searchQuery ? "검색 결과 없음" : "해당 카테고리 상품 없음"}
                  </div>
                ) : (
                  filteredProducts.map((product) => {
                    const isOut = product.stock === 0;
                    const isLow =
                      product.stock !== null &&
                      product.stock > 0 &&
                      product.stock <= 5;
                    const typeBadge = productTypeBadge[product.productType];
                    return (
                      <button
                        key={product.id}
                        disabled={isOut}
                        onClick={() => addToCart(product)}
                        className={cn(
                          "group relative flex flex-col rounded-xl border p-3 text-left transition-all",
                          isOut
                            ? "border-line opacity-50 cursor-not-allowed grayscale"
                            : "border-line hover:border-primary hover:shadow-md cursor-pointer",
                        )}
                      >
                        <div className="mb-2 flex items-center gap-1 flex-wrap">
                          <span
                            className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full",
                              typeBadge.className,
                            )}
                          >
                            {typeBadge.label}
                          </span>
                          {isOut && (
                            <Badge
                              variant="destructive"
                              className="text-[10px]"
                            >
                              품절
                            </Badge>
                          )}
                          {isLow && (
                            <Badge variant="warning" className="text-[10px]">
                              재고 부족 ({product.stock}개)
                            </Badge>
                          )}
                          {!isOut && !isLow && product.stock !== null && (
                            <Badge variant="success" className="text-[10px]">
                              재고 {product.stock}개
                            </Badge>
                          )}
                        </div>
                        <h4 className="text-sm font-semibold text-content line-clamp-1">
                          {product.name}
                        </h4>
                        <div className="mt-1 flex flex-col gap-0.5 text-[11px] text-content-tertiary">
                          <div className="flex items-center gap-1">
                            <Calendar size={11} /> 기간: {product.period}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={11} /> 횟수: {product.count}
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-line">
                          <div className="flex justify-between items-baseline">
                            <span className="text-[10px] text-content-tertiary">
                              현금가
                            </span>
                            <span className="text-sm font-bold text-primary tabular-nums">
                              {product.cashPrice.toLocaleString()}원
                            </span>
                          </div>
                          <div className="flex justify-between items-baseline mt-0.5">
                            <span className="text-[10px] text-content-tertiary">
                              카드가
                            </span>
                            <span className="text-xs font-medium text-content-secondary tabular-nums">
                              {product.cardPrice.toLocaleString()}원
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 우측: 장바구니 + 결제 */}
        <aside className="min-w-0 space-y-4">
          {/* 구매자 카드 */}
          <Card className="shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <UserRound size={14} /> 구매자
                </CardTitle>
                <Button
                  data-dialog-id="DLG-S002"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    openDialog("DLG-S002");
                    setBuyer({ name: "김민준", phone: "010-1234-5678" });
                  }}
                >
                  {buyer ? "변경" : "검색"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {buyer ? (
                <div className="rounded-lg bg-surface-secondary p-3">
                  <div className="font-semibold text-sm">{buyer.name}</div>
                  <div className="text-xs text-content-tertiary mt-0.5">
                    {buyer.phone}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-line p-3 text-center text-xs text-content-tertiary">
                  구매자를 검색하거나 비회원으로 진행하세요
                </div>
              )}
            </CardContent>
          </Card>

          {/* 장바구니 */}
          <Card className="shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <ShoppingCart size={14} /> 장바구니 ({cart.length})
                </CardTitle>
                {cart.length > 0 && (
                  <Button size="sm" variant="ghost" onClick={() => setCart([])}>
                    전체 비우기
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {cart.length === 0 ? (
                <div className="py-8 text-center text-xs text-content-tertiary">
                  좌측 상품을 선택해 추가하세요
                </div>
              ) : (
                <div className="space-y-2 max-h-[280px] overflow-y-auto">
                  {cart.map((item) => {
                    const itemPrice =
                      item.priceType === "cash"
                        ? item.cashPrice
                        : item.cardPrice;
                    return (
                      <div
                        key={item.cartId}
                        className="rounded-lg border bg-white p-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-xs truncate">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-content-tertiary">
                              {productTypeBadge[item.productType].label} ·{" "}
                              {item.period}
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.cartId)}
                            className="text-content-tertiary hover:text-rose-600"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <div className="mt-1.5 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateQuantity(item.cartId, -1)}
                              className="size-5 rounded border text-xs"
                            >
                              −
                            </button>
                            <span className="w-7 text-center text-xs font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.cartId, 1)}
                              className="size-5 rounded border text-xs"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => togglePriceType(item.cartId)}
                            className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded font-semibold",
                              item.priceType === "cash"
                                ? "bg-primary-light text-primary"
                                : "bg-accent-light text-accent",
                            )}
                          >
                            {item.priceType === "cash" ? "현금" : "카드"}
                          </button>
                          <span className="text-sm font-bold tabular-nums">
                            {(itemPrice * item.quantity).toLocaleString()}원
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 결제 */}
          <Card className="shadow-none border-primary/20">
            <CardContent className="p-3 space-y-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-content-tertiary">현금 결제</span>
                  <span className="font-semibold tabular-nums">
                    {cashTotal.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-tertiary">카드 결제</span>
                  <span className="font-semibold tabular-nums">
                    {cardTotal.toLocaleString()}원
                  </span>
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-primary via-primary to-[#ff907f] p-3 text-white shadow-[0_16px_32px_rgba(255,127,110,0.22)]">
                <div className="text-xs text-white/85">최종 결제금액</div>
                <div className="text-2xl font-bold tabular-nums">
                  {subtotal.toLocaleString()}원
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  data-dialog-id="DLG-S003"
                  className="w-full"
                  disabled={cart.length === 0}
                  onClick={() => openDialog("DLG-S003")}
                >
                  <CreditCard size={14} className="mr-1.5" /> 결제 확인
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    data-dialog-id="DLG-S004"
                    size="sm"
                    variant="outline"
                    onClick={() => openDialog("DLG-S004")}
                  >
                    중복 결제 경고
                  </Button>
                  <Button
                    data-dialog-id="DLG-S009"
                    size="sm"
                    variant="outline"
                    onClick={() => openDialog("DLG-S009")}
                  >
                    할부 등록
                  </Button>
                </div>
              </div>
              <p className="text-[10px] text-content-tertiary text-center">
                외부 POS/현금 수납 완료 후 CRM에 기록됩니다
              </p>
            </CardContent>
          </Card>

          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function PaymentProcessingScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  // admin-pando payment 패턴 + 운영자 UX
  // 결제 유형 3종 (현장 전액/잔액/계약금) + 영수증 첨부 검증 + 결제 완료 화면 + 회원 검색 + 권한 차등
  type PaymentType = "full" | "remaining" | "deposit";
  type PaymentMethod = "card" | "cash" | "transfer" | "mixed";
  type ReceiptStatus = "none" | "attaching" | "attached" | "rejected";

  const typeMeta: Record<
    PaymentType,
    { label: string; description: string; color: string }
  > = {
    full: {
      label: "현장 전액 등록",
      description: "외부 POS/현금 수납 완료 후 CRM 기록",
      color: "bg-emerald-50 border-emerald-200",
    },
    remaining: {
      label: "잔액 등록",
      description: "기존 결제 잔액 추가 수납",
      color: "bg-blue-50 border-blue-200",
    },
    deposit: {
      label: "계약금 등록",
      description: "정식 결제 전 계약금 선납 기록",
      color: "bg-amber-50 border-amber-200",
    },
  };

  const methodMeta: Record<
    PaymentMethod,
    { label: string; icon: typeof CreditCard }
  > = {
    card: { label: "카드", icon: CreditCard },
    cash: { label: "현금", icon: AlertTriangle },
    transfer: { label: "계좌이체", icon: Building2 },
    mixed: { label: "복합", icon: ClipboardCheck },
  };

  const [paymentType, setPaymentType] = useState<PaymentType>("full");
  const [memberQuery, setMemberQuery] = useState("김민준");
  const [memberPhone] = useState("010-1234-5678");
  const [product, setProduct] = useState("PT 20회권");
  const [amountInput, setAmountInput] = useState("1150000");
  const [originalAmount] = useState(1200000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [receiptStatus, setReceiptStatus] = useState<ReceiptStatus>("none");
  const [receiptFileName, setReceiptFileName] = useState("");
  const [done, setDone] = useState(false);
  const [submittedSnapshot, setSubmittedSnapshot] = useState<{
    member: string;
    phone: string;
    product: string;
    amount: string;
    method: PaymentMethod;
    type: PaymentType;
    receipt: string;
    timestamp: string;
  } | null>(null);

  const amountNum = Number(amountInput.replace(/[^0-9]/g, "")) || 0;
  const amountFmt = amountNum.toLocaleString("ko-KR");
  const isOverPaying =
    paymentType === "remaining" && amountNum > originalAmount;
  const isUnderPaying =
    paymentType === "full" && amountNum < originalAmount * 0.5;

  const canCreatePayment = hasPermission(role, "salesWrite");

  const attachReceipt = () => {
    if (receiptStatus === "attaching") return;
    setReceiptStatus("attaching");
    notify("영수증 파일 첨부 중...", "info");
    window.setTimeout(() => {
      const fakeName = `receipt_${Date.now().toString().slice(-6)}.pdf`;
      setReceiptFileName(fakeName);
      setReceiptStatus("attached");
      notify("영수증 첨부 완료 (1.2MB)", "success");
    }, 800);
  };

  const removeReceipt = () => {
    setReceiptStatus("none");
    setReceiptFileName("");
    notify("영수증 파일 제거", "info");
  };

  const resetForm = () => {
    setPaymentType("full");
    setMemberQuery("");
    setProduct("");
    setAmountInput("");
    setPaymentMethod("card");
    setReceiptStatus("none");
    setReceiptFileName("");
    notify("결제 입력 초기화", "info");
  };

  const submitPayment = () => {
    if (!canCreatePayment) {
      notify("결제 등록 권한이 없습니다 (salesWrite 필요)", "warning");
      return;
    }
    if (!memberQuery.trim()) {
      notify("구매자를 검색해주세요.", "warning");
      return;
    }
    if (!product.trim()) {
      notify("상품을 선택해주세요.", "warning");
      return;
    }
    if (amountNum <= 0) {
      notify("결제 금액을 입력해주세요.", "warning");
      return;
    }
    if (receiptStatus !== "attached") {
      notify("영수증 파일을 첨부해주세요.", "warning");
      return;
    }
    setSubmittedSnapshot({
      member: memberQuery,
      phone: memberPhone,
      product,
      amount: amountFmt,
      method: paymentMethod,
      type: paymentType,
      receipt: receiptFileName,
      timestamp: new Date().toTimeString().slice(0, 8),
    });
    setDone(true);
    notify("결제 등록 완료 — 매출/회원 상세 자동 반영");
  };

  if (done && submittedSnapshot) {
    return (
      <div className="space-y-5">
        <DeliveryHeader
          screen={screen}
          role={role}
          branch={branch}
          titleSuffix="결제 등록 완료"
        />
        <Card className="shadow-none">
          <CardContent className="grid place-items-center py-16 text-center">
            <div className="size-20 rounded-full bg-emerald-100 grid place-items-center">
              <CheckCircle2 className="size-12 text-emerald-600" />
            </div>
            <h2 className="mt-4 text-2xl font-bold">결제 등록 완료</h2>
            <p className="mt-2 text-sm text-content-secondary">
              결제완료 상태 + 회원권/수강권 구매 완료가 함께 반영되었습니다.
            </p>

            {/* 결제 요약 카드 */}
            <div className="mt-6 w-full max-w-md rounded-2xl border bg-surface-secondary p-5 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-content-tertiary">구매자</span>
                  <span className="font-semibold">
                    {submittedSnapshot.member}{" "}
                    <span className="text-xs text-content-tertiary">
                      ({submittedSnapshot.phone})
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-tertiary">상품</span>
                  <span className="font-semibold">
                    {submittedSnapshot.product}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-tertiary">결제 유형</span>
                  <span className="font-semibold">
                    {typeMeta[submittedSnapshot.type].label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-tertiary">결제 수단</span>
                  <span className="font-semibold">
                    {methodMeta[submittedSnapshot.method].label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-tertiary">영수증</span>
                  <span className="font-mono text-xs text-emerald-700">
                    {submittedSnapshot.receipt}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-tertiary">처리 시각</span>
                  <span className="font-mono text-xs">
                    {submittedSnapshot.timestamp}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t flex justify-between items-baseline">
                <span className="text-sm font-bold">결제 금액</span>
                <span className="text-2xl font-bold text-primary tabular-nums">
                  {submittedSnapshot.amount}원
                </span>
              </div>
            </div>

            {/* 후속 액션 */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              <Button onClick={() => notify("영수증 파일 보기 mock", "info")}>
                <ClipboardCheck size={14} className="mr-1.5" /> 영수증 파일 보기
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  notify(
                    `${submittedSnapshot.member} 결제 완료 안내 SMS 발송`,
                    "info",
                  )
                }
              >
                <MessageSquare size={14} className="mr-1.5" /> 결제 완료 SMS
                발송
              </Button>
              <Button
                variant="outline"
                asChild
              >
                <Link href="/members/detail?from=SCR-S001">회원 상세</Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setDone(false);
                  resetForm();
                }}
              >
                계속 판매하기
              </Button>
              <Button asChild>
                <Link href="/sales">매출 현황</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="결제 등록 플로우 · 영수증 필수"
      />

      <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>구매자 · 상품 · 수납 · 완료</CardTitle>
              <CardDescription>
                현장 전액 등록, 잔액 등록, 계약금 등록 3가지 유형을 분리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Step 1: 결제 유형 */}
              <div>
                <Label className="text-xs font-bold mb-2 block flex items-center gap-1.5">
                  <span className="size-5 rounded-full bg-primary text-white grid place-items-center text-[10px] font-bold">
                    1
                  </span>
                  결제 유형 선택 *
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {(Object.keys(typeMeta) as PaymentType[]).map((t) => {
                    const meta = typeMeta[t];
                    return (
                      <button
                        key={t}
                        onClick={() => {
                          setPaymentType(t);
                          notify(`${meta.label} 선택`, "info");
                        }}
                        className={cn(
                          "rounded-xl border-2 p-3 text-left transition-all",
                          paymentType === t
                            ? cn(
                                meta.color,
                                "ring-2 ring-primary border-primary",
                              )
                            : "border-line bg-white hover:border-primary/50",
                        )}
                      >
                        <b className="text-sm">{meta.label}</b>
                        <p className="mt-1 text-[10px] text-content-tertiary">
                          {meta.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: 구매자 / 상품 */}
              <div>
                <Label className="text-xs font-bold mb-2 block flex items-center gap-1.5">
                  <span className="size-5 rounded-full bg-primary text-white grid place-items-center text-[10px] font-bold">
                    2
                  </span>
                  구매자 · 상품 *
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[10px] text-content-tertiary mb-1 block">
                      구매자 *
                    </Label>
                    <div className="flex gap-1">
                      <div className="relative flex-1">
                        <UserRound
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary"
                        />
                        <Input
                          value={memberQuery}
                          onChange={(e) => setMemberQuery(e.target.value)}
                          className="pl-9"
                          placeholder="회원 검색"
                        />
                      </div>
                      <Button
                        data-dialog-id="DLG-S002"
                        size="sm"
                        variant="outline"
                        onClick={() => openDialog("DLG-S002")}
                      >
                        검색
                      </Button>
                    </div>
                    {memberQuery && (
                      <p className="mt-1 text-[10px] text-content-tertiary">
                        {memberPhone}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-[10px] text-content-tertiary mb-1 block">
                      상품 *
                    </Label>
                    <Input
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      placeholder="상품명"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: 금액 / 결제 수단 */}
              <div>
                <Label className="text-xs font-bold mb-2 block flex items-center gap-1.5">
                  <span className="size-5 rounded-full bg-primary text-white grid place-items-center text-[10px] font-bold">
                    3
                  </span>
                  결제 금액 · 수단 *
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[10px] text-content-tertiary mb-1 block">
                      수납 금액 (원) *
                    </Label>
                    <Input
                      value={amountInput}
                      onChange={(e) =>
                        setAmountInput(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      placeholder="1,150,000"
                      className={cn(
                        (isOverPaying || isUnderPaying) &&
                          "border-amber-400 bg-amber-50",
                      )}
                    />
                    {amountNum > 0 && (
                      <p className="mt-1 text-[10px] text-content-secondary">
                        {amountFmt}원
                      </p>
                    )}
                    {isOverPaying && (
                      <p className="mt-1 text-[10px] text-amber-700">
                        ⚠️ 원 금액({originalAmount.toLocaleString()}원) 초과 —
                        잔액 등록은 추가 금액만 입력
                      </p>
                    )}
                    {isUnderPaying && (
                      <p className="mt-1 text-[10px] text-amber-700">
                        ⚠️ 전액 등록인데 50% 미만 — 계약금 등록으로 변경 권장
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-[10px] text-content-tertiary mb-1 block">
                      결제 수단 *
                    </Label>
                    <div className="grid grid-cols-4 gap-1">
                      {(Object.keys(methodMeta) as PaymentMethod[]).map((m) => {
                        const M = methodMeta[m].icon;
                        return (
                          <Button
                            key={m}
                            size="sm"
                            variant={
                              paymentMethod === m ? "default" : "outline"
                            }
                            onClick={() => setPaymentMethod(m)}
                            className="px-2"
                          >
                            <M size={12} className="mr-0.5" />{" "}
                            {methodMeta[m].label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: 영수증 첨부 */}
              <div>
                <Label className="text-xs font-bold mb-2 block flex items-center gap-1.5">
                  <span className="size-5 rounded-full bg-primary text-white grid place-items-center text-[10px] font-bold">
                    4
                  </span>
                  영수증 첨부 * (필수)
                </Label>
                <div
                  className={cn(
                    "rounded-xl border-2 p-4",
                    receiptStatus === "attached"
                      ? "border-emerald-200 bg-emerald-50"
                      : receiptStatus === "rejected"
                        ? "border-rose-200 bg-rose-50"
                        : receiptStatus === "attaching"
                          ? "border-blue-200 bg-blue-50"
                          : "border-dashed border-line bg-surface-secondary",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {receiptStatus === "attached" ? (
                        <div className="size-9 rounded-lg bg-emerald-100 grid place-items-center">
                          <CheckCircle2
                            size={18}
                            className="text-emerald-600"
                          />
                        </div>
                      ) : receiptStatus === "attaching" ? (
                        <div className="size-9 rounded-lg bg-blue-100 grid place-items-center animate-pulse">
                          <Clock size={18} className="text-blue-600" />
                        </div>
                      ) : (
                        <div className="size-9 rounded-lg bg-surface-tertiary grid place-items-center">
                          <ClipboardCheck
                            size={18}
                            className="text-content-tertiary"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <b className="text-sm">
                          {receiptStatus === "attached"
                            ? "첨부 완료"
                            : receiptStatus === "attaching"
                              ? "업로드 중..."
                              : "영수증 파일"}
                        </b>
                        <p className="text-[11px] text-content-tertiary truncate">
                          {receiptStatus === "attached"
                            ? receiptFileName
                            : "이미지(JPG/PNG) 또는 PDF만 첨부 가능 · 최대 5MB"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {receiptStatus === "attached" ? (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              notify("영수증 미리보기 mock", "info")
                            }
                          >
                            미리보기
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={removeReceipt}
                          >
                            <X size={12} className="mr-1" />
                            제거
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          onClick={attachReceipt}
                          disabled={receiptStatus === "attaching"}
                        >
                          {receiptStatus === "attaching"
                            ? "업로드 중..."
                            : "파일 첨부"}
                        </Button>
                      )}
                    </div>
                  </div>
                  {receiptStatus === "none" && (
                    <p className="mt-2 text-[10px] text-rose-600 font-semibold">
                      ⚠️ 영수증 파일을 첨부해야 결제 등록이 가능합니다.
                    </p>
                  )}
                </div>
              </div>

              {/* 최종 버튼 */}
              <div className="flex justify-between items-center pt-2 border-t">
                <Button variant="outline" onClick={resetForm}>
                  초기화
                </Button>
                <div className="flex items-center gap-3">
                  {amountNum > 0 && (
                    <div className="text-right">
                      <p className="text-[10px] text-content-tertiary">
                        최종 결제 금액
                      </p>
                      <p className="text-lg font-bold tabular-nums text-primary">
                        {amountFmt}원
                      </p>
                    </div>
                  )}
                  <Button
                    data-dialog-id="DLG-S003"
                    disabled={receiptStatus !== "attached" || !canCreatePayment}
                    onClick={submitPayment}
                  >
                    <CreditCard size={14} className="mr-1.5" /> 결제 등록
                  </Button>
                </div>
              </div>
              {!canCreatePayment && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs">
                  <AlertTriangle
                    size={14}
                    className="inline text-amber-600 mr-1.5"
                  />
                  <b>권한 안내:</b> 결제 등록은 salesWrite 권한 필요 (
                  {roleById.get(role)?.label} → 매니저+/FC/Owner)
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>예외/연결 DLG</CardTitle>
              <CardDescription>결제 보조 액션</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                data-dialog-id="DLG-S002"
                className="w-full"
                variant="outline"
                onClick={() => openDialog("DLG-S002")}
              >
                구매자 검색
              </Button>
              <Button
                data-dialog-id="DLG-S004"
                className="w-full"
                variant="outline"
                onClick={() => openDialog("DLG-S004")}
              >
                중복 결제 경고
              </Button>
              <Button
                data-dialog-id="DLG-S009"
                className="w-full"
                variant="outline"
                onClick={() => openDialog("DLG-S009")}
              >
                할부 등록
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>결제 유형 정책</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-xs">
              {(Object.keys(typeMeta) as PaymentType[]).map((t) => (
                <div key={t} className="rounded-lg border bg-white px-2 py-1.5">
                  <b>{typeMeta[t].label}</b>
                  <p className="text-content-tertiary text-[10px] mt-0.5">
                    {typeMeta[t].description}
                  </p>
                </div>
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

function SalesAnalyticsScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  const [topTab, setTopTab] = useState<"전체 통계" | "직군별" | "담당자별">(
    "전체 통계",
  );
  const [subTab, setSubTab] = useState<
    | "상품별"
    | "상품타입별"
    | "결제수단별"
    | "종목별"
    | "개월별"
    | "GX종목별"
    | "법인권"
  >("상품별");
  const [preset, setPreset] = useState("이번 달");
  const [compare, setCompare] = useState(true);
  const subTabs = [
    "상품별",
    "상품타입별",
    "결제수단별",
    "종목별",
    "개월별",
    "GX종목별",
    "법인권",
  ] as const;
  const productData = [
    { name: "PT 20회권", count: 74, sales: 8900, ratio: 39 },
    { name: "회원권 3개월", count: 112, sales: 6200, ratio: 27 },
    { name: "GX 요가", count: 46, sales: 2100, ratio: 9 },
    { name: "골프 시뮬레이터", count: 32, sales: 1800, ratio: 8 },
    { name: "락커", count: 158, sales: 940, ratio: 4 },
  ];
  const gxBreakdown = [
    { name: "요가", count: 46, ratio: 38 },
    { name: "필라테스", count: 32, ratio: 27 },
    { name: "스피닝", count: 18, ratio: 15 },
    { name: "줌바", count: 14, ratio: 12 },
    { name: "GX 기타", count: 10, ratio: 8 },
  ];
  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="다관점 매출 분석 (V2 채택)"
      />
      <div className="grid grid-cols-4 gap-3">
        {screen.metrics.map((m) => (
          <Card key={m.label} className="shadow-none">
            <CardHeader>
              <CardDescription>{m.label}</CardDescription>
              <CardTitle className="text-xl">{m.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-content-tertiary">{m.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-5">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>최상위 탭 + 하위 탭</CardTitle>
            <CardDescription>
              3 최상위 / 7 하위 탭. 전월 대비 토글, GX 5종 세부, 골프프로별,
              법인권 별도 분석.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(["전체 통계", "직군별", "담당자별"] as const).map((t) => (
                <Button
                  key={t}
                  variant={topTab === t ? "default" : "outline"}
                  onClick={() => setTopTab(t)}
                >
                  {t}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {["이번 달", "지난 달", "최근 3개월", "최근 6개월", "올해"].map(
                (p) => (
                  <Button
                    key={p}
                    size="sm"
                    variant={preset === p ? "default" : "outline"}
                    onClick={() => {
                      setPreset(p);
                      notify(`${p} 기간 적용`, "info");
                    }}
                  >
                    {p}
                  </Button>
                ),
              )}
              <Input
                placeholder="시작일"
                defaultValue="2026-05-01"
                className="max-w-[120px]"
              />
              <Input
                placeholder="종료일"
                defaultValue="2026-05-31"
                className="max-w-[120px]"
              />
              <Button
                size="sm"
                onClick={() => notify("기간 조회 mock", "info")}
              >
                조회
              </Button>
              <label className="ml-auto flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={compare}
                  onChange={(e) => setCompare(e.target.checked)}
                />{" "}
                전월 대비 토글
              </label>
            </div>
            {topTab === "전체 통계" && (
              <div className="flex flex-wrap gap-1">
                {subTabs.map((t) => (
                  <Button
                    key={t}
                    size="sm"
                    variant={subTab === t ? "secondary" : "ghost"}
                    onClick={() => setSubTab(t)}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            )}
            <div className="rounded-xl border bg-surface-secondary p-4">
              <p className="mb-2 text-xs font-semibold text-content-secondary">
                {topTab} · {topTab === "전체 통계" ? subTab : "-"} 차트 (mock
                가로 막대)
              </p>
              {topTab === "전체 통계" && subTab === "GX종목별" ? (
                <div className="space-y-2">
                  {gxBreakdown.map((g) => (
                    <div
                      key={g.name}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span className="w-20 truncate font-medium">
                        {g.name}
                      </span>
                      <div className="h-3 flex-1 overflow-hidden rounded bg-white">
                        <div
                          className="h-full bg-violet-400"
                          style={{ width: `${g.ratio * 2.5}%` }}
                        />
                      </div>
                      <span className="w-16 text-right text-content-tertiary">
                        {g.count}건
                      </span>
                      <span className="w-12 text-right font-semibold">
                        {g.ratio}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {productData.map((p) => (
                    <div
                      key={p.name}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span className="w-24 truncate font-medium">
                        {p.name}
                      </span>
                      <div className="h-3 flex-1 overflow-hidden rounded bg-white">
                        <div
                          className="h-full bg-sky-400"
                          style={{ width: `${Math.min(p.ratio * 2.5, 100)}%` }}
                        />
                      </div>
                      <span className="w-16 text-right text-content-tertiary">
                        {p.sales}만원
                      </span>
                      <span className="w-12 text-right font-semibold">
                        {p.ratio}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {compare && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-white p-2 text-xs">
                  <Badge variant="success">전월 대비 +12.4%</Badge>
                  <span className="text-content-tertiary">
                    전월 동기 매출: 16,380,000원
                  </span>
                </div>
              )}
            </div>
            <div className="overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {(topTab === "담당자별"
                      ? screen.tableColumns
                      : screen.tableColumns.slice(0, 4)
                    ).map((c) => (
                      <TableHead key={c}>{c}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {screen.rows.map((row) => (
                    <TableRow key={row["분석 항목명"]}>
                      {(topTab === "담당자별"
                        ? screen.tableColumns
                        : screen.tableColumns.slice(0, 4)
                      ).map((c) => (
                        <TableCell key={c}>{row[c]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="rounded-lg border bg-amber-50 p-3 text-xs text-amber-900">
              <b>골프프로별 매출</b> (담당자별 탭): `[매출종합]` `골프매출` 탭의
              `등록강사` 기준으로 프로별 합계와 비중을 표시 (V2)
            </div>
          </CardContent>
        </Card>
        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>액션</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                data-dialog-id="DLG-S012"
                className="w-full"
                onClick={() => openDialog("DLG-S012")}
              >
                목표 매출 설정
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => notify("CSV 내보내기 mock", "info")}
              >
                CSV 내보내기
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>V2 신규 분석축</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-xs text-content-secondary">
              <div>• 직군별 / 담당자별 매출</div>
              <div>• GX 5종 세부 (요가/필라테스/스피닝/줌바/GX 기타)</div>
              <div>• 법인권 (B2B) 별도 분석</div>
              <div>• 골프프로별 매출 (등록강사 기준)</div>
              <div>• 신규/재등록/기타 매출 분리</div>
            </CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function DeferredRevenueScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  const [period, setPeriod] = useState({
    from: "2026-05-01",
    to: "2026-05-31",
  });
  const [bucket, setBucket] = useState<
    "전체" | "1" | "3" | "6" | "12" | "기타"
  >("전체");
  const onBucketChange = (b: typeof bucket) => {
    setBucket(b);
    notify(
      `${b === "전체" || b === "기타" ? b : `${b}개월`} 버킷 적용`,
      "info",
    );
  };
  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="기간권 인식 추적"
      />
      <div className="grid grid-cols-4 gap-3">
        {screen.metrics.map((m, i) => (
          <Card
            key={m.label}
            className={cn(
              "shadow-none",
              i === 1 && "border-emerald-200 bg-emerald-50/50",
              i === 2 && "border-blue-200 bg-blue-50/50",
            )}
          >
            <CardHeader>
              <CardDescription>{m.label}</CardDescription>
              <CardTitle
                className={cn(
                  "text-xl",
                  i === 1 && "text-emerald-700",
                  i === 2 && "text-blue-700 font-bold",
                )}
              >
                {m.value}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-content-tertiary">{m.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>선수익금 계약 목록 (8컬럼)</CardTitle>
            <CardDescription>
              5버킷(1/3/6/12개월/기타) + 진행률 프로그레스. durationMonths가
              있으면 상품명·외부 시트·수기 분류보다 우선.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Label className="text-xs">시작일</Label>
              <Input
                value={period.from}
                onChange={(e) => setPeriod({ ...period, from: e.target.value })}
                className="max-w-[140px]"
              />
              <Label className="text-xs">종료일</Label>
              <Input
                value={period.to}
                onChange={(e) => setPeriod({ ...period, to: e.target.value })}
                className="max-w-[140px]"
              />
              <div className="ml-auto flex gap-1">
                {(["전체", "1", "3", "6", "12", "기타"] as const).map((b) => (
                  <Button
                    key={b}
                    size="sm"
                    variant={bucket === b ? "default" : "outline"}
                    onClick={() => onBucketChange(b)}
                  >
                    {b === "전체" || b === "기타" ? b : `${b}개월`}
                  </Button>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {screen.tableColumns.map((c) => (
                      <TableHead key={c}>{c}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {screen.rows.map((row, idx) => {
                    const pct = parseInt(row.진행률 || "0", 10);
                    return (
                      <TableRow
                        key={`${row.회원명}-${idx}`}
                        className="cursor-pointer"
                        onClick={() => openDialog("DLG-S001")}
                      >
                        <TableCell className="font-semibold">
                          {row.회원명}
                        </TableCell>
                        <TableCell>{row.상품명}</TableCell>
                        <TableCell>{row.총액}</TableCell>
                        <TableCell className="font-semibold text-emerald-700">
                          {row["인식 완료"]}
                        </TableCell>
                        <TableCell className="font-bold text-blue-700">
                          {row.잔여}
                        </TableCell>
                        <TableCell>{row.시작일}</TableCell>
                        <TableCell>{row.종료일}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 overflow-hidden rounded bg-line">
                              <div
                                className={cn(
                                  "h-full",
                                  pct >= 80
                                    ? "bg-rose-500"
                                    : pct >= 50
                                      ? "bg-orange-400"
                                      : "bg-emerald-400",
                                )}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold">
                              {pct}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>정책 / 산식 안내</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-amber-900">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <b>정책 확인 필요</b>
                <div className="mt-1 text-amber-800">
                  자동 산식 미확정. 일별 인식 배치 03:00 크론, 인식 정확도 검증
                  매월 1일 04:00.
                </div>
              </div>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-blue-900">
                <b>버킷 규칙</b>
                <div className="mt-1">
                  기타 = 2/4/5/9개월, 기간 직접 입력, 무기한, 종료일 미정 등
                  1/3/6/12에 안 들어가는 모든 기간
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>액션</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                data-dialog-id="DLG-S001"
                variant="outline"
                className="w-full"
                onClick={() => openDialog("DLG-S001")}
              >
                원 매출 상세
              </Button>
            </CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function RefundManagementScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  const [tab, setTab] = useState<"내역" | "담당자별">("내역");
  const [period, setPeriod] = useState("이번 달");
  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="환불 통계 + 담당자별 책임"
      />
      <div className="grid grid-cols-4 gap-3">
        {screen.metrics.map((m) => (
          <Card key={m.label} className="shadow-none">
            <CardHeader>
              <CardDescription>{m.label}</CardDescription>
              <CardTitle className="text-xl">{m.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-content-tertiary">{m.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>환불 내역 (19컬럼)</CardTitle>
            <CardDescription>
              환불금액 빨강 강조, 상태 배지(완료/처리중/거절). 환불 자동 산식
              미확정 — 수기 입력값 표시.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              {(["내역", "담당자별"] as const).map((t) => (
                <Button
                  key={t}
                  size="sm"
                  variant={tab === t ? "default" : "outline"}
                  onClick={() => setTab(t)}
                >
                  {t === "내역"
                    ? "환불 내역 (목록)"
                    : "원판매 담당자별 환불 책임"}
                </Button>
              ))}
              <div className="ml-auto flex gap-1">
                {["이번 달", "지난 달", "최근 3개월"].map((p) => (
                  <Button
                    key={p}
                    size="sm"
                    variant={period === p ? "default" : "outline"}
                    onClick={() => {
                      setPeriod(p);
                      notify(`${p} 기간 적용`, "info");
                    }}
                  >
                    {p}
                  </Button>
                ))}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => notify("엑셀 내보내기 mock", "info")}
              >
                엑셀
              </Button>
            </div>
            {tab === "내역" ? (
              <div className="overflow-auto rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {screen.tableColumns.map((c) => (
                        <TableHead key={c} className="whitespace-nowrap">
                          {c}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {screen.rows.map((row) => (
                      <TableRow
                        key={row.No}
                        className="cursor-pointer"
                        onClick={() => openDialog("DLG-S006")}
                      >
                        {screen.tableColumns.map((c) => (
                          <TableCell
                            key={c}
                            className={cn(
                              "whitespace-nowrap text-xs",
                              c === "환불금액" && "font-bold text-rose-600",
                              c === "상태" && "font-medium",
                            )}
                          >
                            {c === "상태" ? (
                              <Badge
                                variant={
                                  row[c] === "완료"
                                    ? "success"
                                    : row[c] === "승인대기"
                                      ? "warning"
                                      : "destructive"
                                }
                              >
                                {row[c]}
                              </Badge>
                            ) : (
                              row[c]
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {[
                        "원판매 담당자",
                        "환불 건수",
                        "환불 금액",
                        "위약금 합계",
                        "원매출 대비 환불률",
                      ].map((c) => (
                        <TableHead key={c}>{c}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-semibold">이FC</TableCell>
                      <TableCell>6</TableCell>
                      <TableCell className="font-bold text-rose-600">
                        240,000원
                      </TableCell>
                      <TableCell>40,000원</TableCell>
                      <TableCell>
                        <Badge variant="warning">3.2%</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">
                        박트레이너
                      </TableCell>
                      <TableCell>3</TableCell>
                      <TableCell className="font-bold text-rose-600">
                        90,000원
                      </TableCell>
                      <TableCell>15,000원</TableCell>
                      <TableCell>
                        <Badge variant="info">1.4%</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">최매니저</TableCell>
                      <TableCell>9</TableCell>
                      <TableCell className="font-bold text-rose-600">
                        290,000원
                      </TableCell>
                      <TableCell>27,000원</TableCell>
                      <TableCell>
                        <Badge variant="destructive">5.8%</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none border-amber-200 bg-amber-50/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="size-4" /> 정책 확인 필요
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-amber-900">
              <div>환불 자동 계산 산식 미확정 (정책 수기 100%)</div>
              <div>
                환불 승인 권한: Owner = 완료 처리, Manager/FC = 승인 요청만
              </div>
              <div>위약금 면제 토글은 Owner만</div>
              <div>지점 환불률 5% 초과 시 본사 알림</div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>액션</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                data-dialog-id="DLG-S015"
                className="w-full"
                onClick={() => openDialog("DLG-S015")}
              >
                환불 요청
              </Button>
              <Button
                data-dialog-id="DLG-S013"
                variant="outline"
                className="w-full"
                onClick={() => openDialog("DLG-S013")}
              >
                환불 처리 (정책)
              </Button>
              <Button
                data-dialog-id="DLG-S006"
                variant="outline"
                className="w-full"
                onClick={() => openDialog("DLG-S006")}
              >
                환불 상세
              </Button>
            </CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function ReceivablesScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  const [tab, setTab] = useState<
    "전체" | "미결제" | "일부결제" | "연체" | "완료"
  >("전체");
  const [query, setQuery] = useState("");
  const filtered = screen.rows
    .filter((r) => tab === "전체" || r.상태 === tab)
    .filter((r) => !query || r.회원명.includes(query));
  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="미수금 추적 (V2: 결제링크 제외)"
      />
      <div className="grid grid-cols-4 gap-3">
        {screen.metrics.map((m, i) => (
          <Card
            key={m.label}
            className={cn(
              "shadow-none",
              i === 2 && "border-amber-300 bg-amber-50/40",
            )}
          >
            <CardHeader>
              <CardDescription>{m.label}</CardDescription>
              <CardTitle className="text-xl">{m.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-content-tertiary">{m.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>미수금 목록 (11컬럼)</CardTitle>
            <CardDescription>
              발생 유형 3종: 계약금 잔액 / 수기 분할 / 정기 할부 미납. 결제링크
              발송만 된 건은 본 화면 제외.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {(["전체", "미결제", "일부결제", "연체", "완료"] as const).map(
                (t) => (
                  <Button
                    key={t}
                    size="sm"
                    variant={tab === t ? "default" : "outline"}
                    onClick={() => setTab(t)}
                  >
                    {t}
                    <Badge variant="secondary">
                      {t === "전체"
                        ? screen.rows.length
                        : screen.rows.filter((r) => r.상태 === t).length}
                    </Badge>
                  </Button>
                ),
              )}
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="회원명 검색"
                className="ml-auto max-w-xs"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => notify("엑셀 내보내기 mock", "info")}
              >
                엑셀
              </Button>
            </div>
            <div className="overflow-auto rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {screen.tableColumns.map((c) => (
                      <TableHead key={c} className="whitespace-nowrap">
                        {c}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((row) => (
                    <TableRow key={row.No}>
                      {screen.tableColumns.map((c) => (
                        <TableCell
                          key={c}
                          className={cn(
                            "whitespace-nowrap text-xs",
                            c === "미수금액" && "font-bold text-rose-600",
                            c === "결제 기한" &&
                              row.상태 === "연체" &&
                              "font-bold text-rose-600",
                          )}
                        >
                          {c === "상태" ? (
                            <Badge
                              variant={
                                row[c] === "완료"
                                  ? "success"
                                  : row[c] === "연체"
                                    ? "destructive"
                                    : row[c] === "일부결제"
                                      ? "warning"
                                      : "outline"
                              }
                            >
                              {row[c]}
                            </Badge>
                          ) : c === "액션" ? (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                data-dialog-id="DLG-S008"
                                onClick={() => openDialog("DLG-S008")}
                              >
                                납입
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                data-dialog-id="DLG-S005"
                                onClick={() => openDialog("DLG-S005")}
                              >
                                메모
                              </Button>
                            </div>
                          ) : (
                            row[c]
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>상태 전환 규칙</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-xs text-content-secondary">
              <div>미결제 → 일부결제 / 완료</div>
              <div>일부결제 → 완료</div>
              <div>연체 → 일부결제 / 완료</div>
              <div className="text-rose-600">완료 → 변경 불가</div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>액션</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                data-dialog-id="DLG-S008"
                className="w-full"
                onClick={() => openDialog("DLG-S008")}
              >
                납입 처리
              </Button>
              <Button
                data-dialog-id="DLG-S005"
                variant="outline"
                className="w-full"
                onClick={() => openDialog("DLG-S005")}
              >
                메모 편집
              </Button>
            </CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function InstallmentsScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  const [tab, setTab] = useState<"전체" | "진행중" | "완납" | "미납">("전체");
  const [origin, setOrigin] = useState<
    "전체" | "현장 결제 연계" | "미수금 전환" | "직접 등록"
  >("전체");
  const onOriginChange = (o: typeof origin) => {
    setOrigin(o);
    notify(`계약 출처 필터: ${o}`, "info");
  };
  const filtered = screen.rows
    .filter((r) => tab === "전체" || r.상태 === tab)
    .filter((r) => origin === "전체" || r["계약 출처"] === origin);
  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="정기 분납 계약 + 회차별 추적"
      />
      <div className="grid grid-cols-4 gap-3">
        {screen.metrics.map((m, i) => (
          <Card
            key={m.label}
            className={cn(
              "shadow-none",
              i === 3 && "border-rose-200 bg-rose-50/30",
            )}
          >
            <CardHeader>
              <CardDescription>{m.label}</CardDescription>
              <CardTitle className={cn("text-xl", i === 3 && "text-rose-700")}>
                {m.value}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-content-tertiary">{m.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>할부 계약 목록 (11컬럼)</CardTitle>
            <CardDescription>
              계약 출처 3종: 현장 결제 연계 / 미수금 전환 / 직접 등록. 정기 분납
              계획 전용 (계약금 잔액은 SCR-S008 우선).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {(["전체", "진행중", "완납", "미납"] as const).map((t) => (
                <Button
                  key={t}
                  size="sm"
                  variant={tab === t ? "default" : "outline"}
                  onClick={() => setTab(t)}
                >
                  {t}
                  <Badge variant="secondary">
                    {t === "전체"
                      ? screen.rows.length
                      : screen.rows.filter((r) => r.상태 === t).length}
                  </Badge>
                </Button>
              ))}
              <div className="ml-auto flex flex-wrap gap-1">
                {(
                  [
                    "전체",
                    "현장 결제 연계",
                    "미수금 전환",
                    "직접 등록",
                  ] as const
                ).map((o) => (
                  <Button
                    key={o}
                    size="sm"
                    variant={origin === o ? "secondary" : "ghost"}
                    onClick={() => onOriginChange(o)}
                  >
                    {o}
                  </Button>
                ))}
              </div>
            </div>
            <div className="overflow-auto rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {screen.tableColumns.map((c) => (
                      <TableHead key={c} className="whitespace-nowrap">
                        {c}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((row, idx) => (
                    <TableRow
                      key={`${row.회원명}-${idx}`}
                      className="cursor-pointer"
                      onClick={() => openDialog("DLG-S007")}
                    >
                      {screen.tableColumns.map((c) => (
                        <TableCell
                          key={c}
                          className={cn(
                            "whitespace-nowrap text-xs",
                            c === "잔여 금액" &&
                              row.상태 !== "완납" &&
                              "font-bold text-rose-600",
                            c === "다음 납입일" &&
                              row.상태 === "미납" &&
                              "font-bold text-rose-600",
                          )}
                        >
                          {c === "상태" ? (
                            <Badge
                              variant={
                                row[c] === "완납"
                                  ? "success"
                                  : row[c] === "미납"
                                    ? "destructive"
                                    : "info"
                              }
                            >
                              {row[c]}
                            </Badge>
                          ) : (
                            row[c]
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="rounded-lg border bg-surface-secondary p-3 text-xs text-content-secondary">
              <b>회차별 펼침 (mock)</b>: 계약 행 클릭 시 1회·2회·3회 등 회차별
              예정일·납입 완료일·금액·상태 상세 확인. 미납 회차에 경고
              색상/아이콘 표시.
            </div>
          </CardContent>
        </Card>
        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>액션</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                data-dialog-id="DLG-S007"
                className="w-full"
                onClick={() => openDialog("DLG-S007")}
              >
                할부 상세
              </Button>
              <Button
                data-dialog-id="DLG-S008"
                variant="outline"
                className="w-full"
                onClick={() => openDialog("DLG-S008")}
              >
                납입 처리
              </Button>
              <Button
                data-dialog-id="DLG-S009"
                variant="outline"
                className="w-full"
                onClick={() => openDialog("DLG-S009")}
              >
                + 할부 등록
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>예외 / 한도</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-xs text-content-secondary">
              <div>최대 24회 한도</div>
              <div>회차당 최소 10,000원</div>
              <div>시작일은 오늘 이후만</div>
              <div>환불 진행 중 납입처리 차단</div>
              <div>말일 자동 보정 (1/31 → 2/28)</div>
            </CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function TaxInvoiceScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  const [tab, setTab] = useState<"발행" | "이력">("이력");
  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="법인 세금계산서 (외부 연동 확인 필요)"
      />
      <div className="grid grid-cols-4 gap-3">
        {screen.metrics.map((m, i) => (
          <Card
            key={m.label}
            className={cn(
              "shadow-none",
              i === 3 && "border-rose-300 bg-rose-50/40",
            )}
          >
            <CardHeader>
              <CardDescription>{m.label}</CardDescription>
              <CardTitle className={cn("text-xl", i === 3 && "text-rose-700")}>
                {m.value}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-content-tertiary">{m.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
        <div className="flex items-center gap-2 font-bold">
          <AlertTriangle className="size-4" /> 외부 연동 확인 필요
          (external-pending)
        </div>
        <p className="mt-1 text-xs text-rose-800">
          공급 품목 자동 채움 + PDF 자동 생성 + 이메일 전송 + 홈택스 발행 연동은
          정책 확정 전 mock 상태. CFO 월별 보고서·발행 한도(일별 1,000건)·사업자
          위/휴/폐업 검증은 외부 연동 완료 후 활성화.
        </p>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>
              {tab === "이력" ? "발행 이력 (7컬럼)" : "발행 폼"}
            </CardTitle>
            <CardDescription>
              {tab === "이력"
                ? "상태 배지: 발행 완료 / 전송 완료 / 오류 / 취소 발행. 사업자번호 마스킹."
                : "공급 품목 자동 채움 5행 (상품명·수량·VAT 제외 단가·금액·과세 구분)"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              {(["발행", "이력"] as const).map((t) => (
                <Button
                  key={t}
                  size="sm"
                  variant={tab === t ? "default" : "outline"}
                  onClick={() => setTab(t)}
                >
                  {t === "발행" ? "발행 (대상 + 폼)" : "발행 이력"}
                </Button>
              ))}
            </div>
            {tab === "이력" ? (
              <div className="overflow-hidden rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {screen.tableColumns.map((c) => (
                        <TableHead key={c}>{c}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {screen.rows.map((row, idx) => (
                      <TableRow
                        key={`${row.발행일}-${idx}`}
                        className="cursor-pointer"
                        onClick={() => openDialog("DLG-S010")}
                      >
                        {screen.tableColumns.map((c) => (
                          <TableCell key={c} className="text-xs">
                            {c === "상태" ? (
                              <Badge
                                variant={
                                  row[c] === "발행 완료" ||
                                  row[c] === "전송 완료"
                                    ? "success"
                                    : row[c] === "오류"
                                      ? "destructive"
                                      : "warning"
                                }
                              >
                                {row[c]}
                              </Badge>
                            ) : (
                              row[c]
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>사업자번호 *</Label>
                    <Input placeholder="123-45-67890" />
                  </div>
                  <div className="space-y-1">
                    <Label>상호 *</Label>
                    <Input placeholder="판도헬스 법인" />
                  </div>
                  <div className="space-y-1">
                    <Label>대표자</Label>
                    <Input />
                  </div>
                  <div className="space-y-1">
                    <Label>이메일 *</Label>
                    <Input type="email" />
                  </div>
                  <div className="space-y-1">
                    <Label>업태</Label>
                    <Input />
                  </div>
                  <div className="space-y-1">
                    <Label>종목</Label>
                    <Input />
                  </div>
                </div>
                <div className="rounded-lg border bg-surface-secondary p-3 text-xs">
                  <b className="text-content-secondary">
                    공급 품목 자동 채움 (V1 docs4 명시)
                  </b>
                  <ul className="mt-1 space-y-0.5 text-content-secondary">
                    <li>• 상품명: 발행 대상 결제 건의 상품명</li>
                    <li>• 수량: 결제 상품 수량 (회원권·수강권·락커는 1)</li>
                    <li>• 단가: 품목별 최종 판매금액 ÷ 수량 (VAT 제외)</li>
                    <li>• 금액: 단가 × 수량 (품목별 공급가액)</li>
                    <li>
                      • 과세 구분: 상품 과세/면세 설정 또는 원결제 세액 기준
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>액션</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                data-dialog-id="DLG-S010"
                className="w-full"
                onClick={() => openDialog("DLG-S010")}
              >
                세금계산서 상세
              </Button>
              <Button
                data-dialog-id="DLG-S011"
                variant="outline"
                className="w-full"
                onClick={() => openDialog("DLG-S011")}
              >
                세금계산서 발행 (정책)
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => notify("이메일 재전송 mock", "info")}
              >
                이메일 전송
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  notify("엑셀 내보내기 mock (30,000건+ 백그라운드)", "info")
                }
              >
                엑셀 내보내기
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>발행 후 처리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-xs text-content-secondary">
              <div>발행 후 수정 불가 → 마이너스 발행으로</div>
              <div>5년 경과 데이터 익명화 (사업자 정보는 보존)</div>
              <div>PDF 자동 생성 + 이메일 첨부</div>
              <div>일별 1,000건 발행 한도 검증</div>
            </CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function CancelRefundScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [type, setType] = useState<"전체 취소" | "부분 환불">("부분 환불");
  const [refundAmount, setRefundAmount] = useState("800,000");
  const onTypeChange = (t: typeof type) => {
    setType(t);
    notify(`처리 유형: ${t}`, "info");
  };
  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="환불 수기 입력 + 승인 분기"
      />
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <div className="flex items-center gap-2 font-bold">
          <AlertTriangle className="size-4" /> 정책 확인 필요 (policy-pending)
        </div>
        <p className="mt-1 text-xs text-amber-800">
          환불 자동 계산 산식 미확정. 모든 차감/위약금/최종 환불액은 운영자 수기
          입력. manager/fc는 승인 요청만 가능, Owner만 완료 처리.
        </p>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {screen.metrics.map((m) => (
          <Card key={m.label} className="shadow-none">
            <CardHeader>
              <CardDescription>{m.label}</CardDescription>
              <CardTitle className="text-xl">{m.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-content-tertiary">{m.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>
              Step {step} / 5 ·{" "}
              {step === 1
                ? "결제 건 검색"
                : step === 2
                  ? "환불 수기 입력"
                  : "귀속 영향 + 승인"}
            </CardTitle>
            <CardDescription>
              결제 검색 → 결제 내역 확인 → 환불 수기 입력 → 귀속 영향 요약 →
              승인 상태 + 처리 이력
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-1">
              {([1, 2, 3] as const).map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={step === s ? "default" : "outline"}
                  onClick={() => setStep(s)}
                >
                  Step {s}
                </Button>
              ))}
            </div>
            {step === 1 && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <Input placeholder="회원명 검색" defaultValue="김민준" />
                  <Input placeholder="상품명" />
                  <Input placeholder="결제일" />
                </div>
                <div className="overflow-hidden rounded-xl border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {[
                          "선택",
                          "결제 ID",
                          "회원",
                          "상품",
                          "결제금액",
                          "결제수단",
                          "결제일",
                        ].map((c) => (
                          <TableHead key={c}>{c}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="bg-blue-50">
                        <TableCell>
                          <Badge variant="info">선택됨</Badge>
                        </TableCell>
                        <TableCell>S-260428-009</TableCell>
                        <TableCell>김민준</TableCell>
                        <TableCell>PT 20회권</TableCell>
                        <TableCell>1,200,000원</TableCell>
                        <TableCell>카드</TableCell>
                        <TableCell>2026-04-28</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setStep(2)}>
                    다음 (수기 입력으로)
                  </Button>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  {(["전체 취소", "부분 환불"] as const).map((t) => (
                    <Button
                      key={t}
                      variant={type === t ? "default" : "outline"}
                      onClick={() => onTypeChange(t)}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
                <div className="overflow-hidden rounded-xl border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {screen.tableColumns.map((c) => (
                          <TableHead key={c}>{c}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {screen.rows.map((row, idx) => (
                        <TableRow key={`${row.항목}-${idx}`}>
                          <TableCell className="font-semibold">
                            {row.항목}
                          </TableCell>
                          <TableCell>
                            {row.항목 === "최종 환불액" ? (
                              <Input
                                value={refundAmount}
                                onChange={(e) =>
                                  setRefundAmount(e.target.value)
                                }
                                className="max-w-[140px]"
                              />
                            ) : (
                              row.금액
                            )}
                          </TableCell>
                          <TableCell className="text-xs">
                            {row.입력자}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                row.정책 === "읽기 전용"
                                  ? "outline"
                                  : row.정책 === "운영 판단"
                                    ? "warning"
                                    : "secondary"
                              }
                            >
                              {row.정책}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                row.상태 === "승인대기" ? "warning" : "outline"
                              }
                            >
                              {row.상태}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Textarea placeholder="조정 사유 / 환불 사유 (단순 변심 / 결제 오류 / 회원 요청 / 중복 결제 / 서비스 불만)" />
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    이전
                  </Button>
                  <Button onClick={() => setStep(3)}>다음 (귀속 영향)</Button>
                </div>
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
                <div className="rounded-lg border bg-amber-50 p-3 text-xs text-amber-900">
                  <b>승인 상태 입력</b>: manager/fc → 승인대기 / Owner → 처리
                  완료
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    이전
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      data-dialog-id="DLG-S015"
                      variant="secondary"
                      onClick={() => openDialog("DLG-S015")}
                    >
                      승인 요청 (manager/fc)
                    </Button>
                    <Button
                      data-dialog-id="DLG-S013"
                      variant="destructive"
                      onClick={() => openDialog("DLG-S013")}
                    >
                      처리 완료 (Owner)
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>액션</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                data-dialog-id="DLG-S015"
                className="w-full"
                onClick={() => openDialog("DLG-S015")}
              >
                환불 요청
              </Button>
              <Button
                data-dialog-id="DLG-S013"
                variant="outline"
                className="w-full"
                onClick={() => openDialog("DLG-S013")}
              >
                환불 처리 (정책)
              </Button>
              <Button
                data-dialog-id="DLG-S014"
                variant="outline"
                className="w-full"
                onClick={() => openDialog("DLG-S014")}
              >
                처리 결과 보기
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>처리 이력 (mock)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-content-secondary">
              <div className="rounded-lg border p-2">
                <b>2026-05-15</b> · 김민준 부분 환불 600,000원 · 처리자 이FC ·
                완료
              </div>
              <div className="rounded-lg border p-2">
                <b>2026-04-22</b> · 박서연 전체 취소 250,000원 · 처리자 최매니저
                · 승인대기
              </div>
            </CardContent>
          </Card>
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
  D04: {
    eyebrow: "수업 운영",
    title: "캘린더·예약·출석 운영 보드",
    hero: "강사·회원·룸 리소스를 시간축으로 겹쳐 보고 예약 요청과 노쇼/페널티까지 한 번에 처리합니다.",
    lanes: ["오전 PT", "GX/그룹", "골프", "대기/변경 요청"],
    boardTitle: "오늘 수업 타임라인",
    boardColumns: ["시간", "수업/강사", "예약", "상태", "운영 액션"],
    queueTitle: "예약·변경 요청 큐",
    primaryCta: "수업 등록",
    secondaryCta: "일괄 변경",
    accent: "blue",
  },
  D05: {
    eyebrow: "상품 운영",
    title: "상품·가격·할인 정책 콘솔",
    hero: "상품 마스터와 지점 배포, 가격 이력, 복합 할인 정책을 분리해 운영 실수와 정책 누락을 줄입니다.",
    lanes: ["판매중", "배포 대기", "가격 변경", "할인 정책"],
    boardTitle: "상품 마스터",
    boardColumns: ["상품", "유형", "가격", "배포", "상태"],
    queueTitle: "정책 검토 큐",
    primaryCta: "상품 등록",
    secondaryCta: "전 지점 배포",
    accent: "emerald",
  },
  D06: {
    eyebrow: "시설 운영",
    title: "락커·고장·배정 현황 맵",
    hero: "개별/일괄 배정, 회수, 고장 토글을 현장 직원이 바로 처리할 수 있게 시설 상태를 격자로 보여줍니다.",
    lanes: ["사용중", "빈 락커", "만료 임박", "고장"],
    boardTitle: "락커 맵",
    boardColumns: ["구역", "락커", "배정 회원", "만료", "상태"],
    queueTitle: "시설 처리 큐",
    primaryCta: "개별 배정",
    secondaryCta: "일괄 배정",
    accent: "amber",
  },
  D07: {
    eyebrow: "직원 운영",
    title: "직원·근태·급여 운영 워크스페이스",
    hero: "직원 계정, 권한, 근태, 급여를 한 화면에서 연결해 퇴사/잠금/급여 예외를 추적합니다.",
    lanes: ["재직", "근태 예외", "급여 검토", "퇴사 처리"],
    boardTitle: "직원 운영 테이블",
    boardColumns: ["직원", "역할", "근태", "계정", "처리"],
    queueTitle: "인사 예외 큐",
    primaryCta: "직원 등록",
    secondaryCta: "급여 명세",
    accent: "violet",
  },
  D08: {
    eyebrow: "마케팅",
    title: "리드·메시지·쿠폰·캠페인 센터",
    hero: "리드 상태, 메시지 발송, 자동 알림, 쿠폰/마일리지, 캠페인을 타겟 세그먼트 중심으로 운영합니다.",
    lanes: ["신규 리드", "발송 대기", "자동 알림", "캠페인 성과"],
    boardTitle: "타겟/캠페인 목록",
    boardColumns: ["대상", "채널", "세그먼트", "예약", "성과"],
    queueTitle: "발송/승인 큐",
    primaryCta: "메시지 작성",
    secondaryCta: "쿠폰 발급",
    accent: "pink",
  },
  D09: {
    eyebrow: "설정",
    title: "센터 정책·권한·자동화 설정",
    hero: "본사 정책과 지점 적용 범위를 분리하고 권한/키오스크/IoT/백업 같은 위험 설정을 감사 가능하게 관리합니다.",
    lanes: ["센터 기본", "권한", "키오스크/IoT", "백업"],
    boardTitle: "설정 항목",
    boardColumns: ["설정", "적용 범위", "최근 변경", "위험도", "상태"],
    queueTitle: "정책 변경 큐",
    primaryCta: "설정 저장",
    secondaryCta: "변경 로그",
    accent: "slate",
  },
  D10: {
    eyebrow: "본사 운영",
    title: "지점 성과·KPI·감사 로그 대시보드",
    hero: "전 지점 성과, KPI, 자동화 정책, 오늘의 할 일, 리포트 생성을 본사 관점에서 검토합니다.",
    lanes: ["KPI", "지점 성과", "감사 로그", "리포트"],
    boardTitle: "본사 운영 지표",
    boardColumns: ["지점/지표", "실적", "전월 대비", "리스크", "액션"],
    queueTitle: "본사 검토 큐",
    primaryCta: "리포트 생성",
    secondaryCta: "정책 배포",
    accent: "indigo",
  },
  D11: {
    eyebrow: "통합 운영",
    title: "출석·락커·건강 연동 통합 관제",
    hero: "지점별 출석, 락커, 체성분, 건강 연동 요약을 한 화면에서 관제하고 예외를 빠르게 처리합니다.",
    lanes: ["출석", "옷 락커", "고정 락커", "건강 연동"],
    boardTitle: "통합 운영 현황",
    boardColumns: ["영역", "대상", "상태", "마지막 동기화", "처리"],
    queueTitle: "통합 예외 큐",
    primaryCta: "예외 처리",
    secondaryCta: "동기화",
    accent: "cyan",
  },
};

const accentClasses: Record<
  string,
  { panel: string; chip: string; ring: string }
> = {
  blue: {
    panel: "from-blue-600 to-slate-900",
    chip: "bg-blue-50 text-blue-700 border-blue-200",
    ring: "border-blue-300 bg-blue-50",
  },
  emerald: {
    panel: "from-emerald-600 to-slate-900",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
    ring: "border-emerald-300 bg-emerald-50",
  },
  amber: {
    panel: "from-amber-500 to-slate-900",
    chip: "bg-amber-50 text-amber-700 border-amber-200",
    ring: "border-amber-300 bg-amber-50",
  },
  violet: {
    panel: "from-violet-600 to-slate-900",
    chip: "bg-violet-50 text-violet-700 border-violet-200",
    ring: "border-violet-300 bg-violet-50",
  },
  pink: {
    panel: "from-pink-600 to-slate-900",
    chip: "bg-pink-50 text-pink-700 border-pink-200",
    ring: "border-pink-300 bg-pink-50",
  },
  slate: {
    panel: "from-slate-700 to-slate-950",
    chip: "bg-surface-secondary text-content-secondary border-slate-200",
    ring: "border-slate-300 bg-surface-secondary",
  },
  indigo: {
    panel: "from-indigo-600 to-slate-900",
    chip: "bg-indigo-50 text-indigo-700 border-indigo-200",
    ring: "border-indigo-300 bg-indigo-50",
  },
  cyan: {
    panel: "from-cyan-600 to-slate-900",
    chip: "bg-cyan-50 text-cyan-700 border-cyan-200",
    ring: "border-cyan-300 bg-cyan-50",
  },
};

type OperationalQueueItem = {
  id: string;
  title: string;
  target: string;
  reason: string;
  deadline: string;
  owner: string;
  cta: string;
  dialogId?: string;
  tone: "danger" | "warning" | "info" | "success";
};

function buildOperationalQueueItems(
  screen: ScreenDefinition,
  config: DomainPublishingConfig,
): OperationalQueueItem[] {
  const dialog = screen.dialogs[0];
  const baseOwner =
    screen.domain === "D10"
      ? "본사 운영"
      : screen.domain === "D07"
        ? "센터장/매니저"
        : "지점 운영";
  const byDomain: Partial<Record<DomainId, OperationalQueueItem[]>> = {
    D04: [
      {
        id: `${screen.id}-reservation`,
        title: "예약 변경 요청",
        target: "오늘 19:00 PT 1:1",
        reason: "강사 일정 충돌 · 회원 확정 대기",
        deadline: "오늘 16:00",
        owner: "프론트/FC",
        cta: "예약 조정",
        dialogId: dialog,
        tone: "warning",
      },
      {
        id: `${screen.id}-noshow`,
        title: "노쇼/페널티 확인",
        target: "김민준 · GX 수업",
        reason: "노쇼 2회 누적, 페널티 부과 전 확인",
        deadline: "당일 마감",
        owner: "매니저",
        cta: "페널티 검토",
        dialogId: screen.dialogs[1] ?? dialog,
        tone: "danger",
      },
    ],
    D05: [
      {
        id: `${screen.id}-price`,
        title: "가격 변경 승인 대기",
        target: "PT 20회 · 강남점",
        reason: "지점 가격이 본사 기준과 다름",
        deadline: "배포 전",
        owner: "상품 관리자",
        cta: "변경 검토",
        dialogId: dialog,
        tone: "warning",
      },
      {
        id: `${screen.id}-deploy`,
        title: "지점 배포 누락",
        target: "헬스 3개월 · 2개 지점",
        reason: "판매중 상품이 일부 지점에 미배포",
        deadline: "오늘",
        owner: "본사/Owner",
        cta: "배포 처리",
        dialogId: screen.dialogs[1] ?? dialog,
        tone: "info",
      },
    ],
    D06: [
      {
        id: `${screen.id}-locker-expire`,
        title: "만료 락커 회수",
        target: "A구역 12번 · 김민지",
        reason: "만료 후 7일 경과, 자동 해제 전 현장 확인",
        deadline: "오늘",
        owner: "시설 담당",
        cta: "회수 처리",
        dialogId: dialog,
        tone: "warning",
      },
      {
        id: `${screen.id}-fault`,
        title: "고장 신고 처리",
        target: "샤워실 2번 락커",
        reason: "회원 앱 신고 2건 누적",
        deadline: "24시간 내",
        owner: "운영 매니저",
        cta: "상태 변경",
        dialogId: screen.dialogs[1] ?? dialog,
        tone: "danger",
      },
    ],
    D07: [
      {
        id: `${screen.id}-attendance`,
        title: "근태 수동 보정",
        target: "박트레이너 · 05-28 출근 누락",
        reason: "급여 산정 전 변경 사유 필수",
        deadline: "급여 확정 전",
        owner: "매니저",
        cta: "보정 입력",
        dialogId: dialog,
        tone: "warning",
      },
      {
        id: `${screen.id}-payroll`,
        title: "급여 확정 전 검토",
        target: "정GX · 수당/공제 편집",
        reason: "당월 미확정 급여, 자동 계산값과 수기 항목 차이",
        deadline: "월말",
        owner: "Owner",
        cta: "급여 검토",
        dialogId: screen.dialogs[1] ?? dialog,
        tone: "info",
      },
    ],
    D08: [
      {
        id: `${screen.id}-lead`,
        title: "상담 예정 리드 후속",
        target: "강민지 · 방문완료",
        reason: "등록 전환 D+1, 담당자 콜백 필요",
        deadline: "오늘 18:00",
        owner: "FC",
        cta: "상담 기록",
        dialogId: dialog,
        tone: "warning",
      },
      {
        id: `${screen.id}-message`,
        title: "예약 메시지 검수",
        target: "만료 D-7 세그먼트",
        reason: "발송 전 수신 동의/템플릿 확인",
        deadline: "발송 30분 전",
        owner: "마케팅 담당",
        cta: "발송 검수",
        dialogId: screen.dialogs[1] ?? dialog,
        tone: "info",
      },
    ],
    D09: [
      {
        id: `${screen.id}-policy`,
        title: "권한 변경 승인",
        target: "매니저 역할 정책",
        reason: "위험 권한 변경은 감사 로그 사유 필요",
        deadline: "적용 전",
        owner: "Owner",
        cta: "권한 검토",
        dialogId: dialog,
        tone: "danger",
      },
      {
        id: `${screen.id}-kiosk`,
        title: "키오스크 설정 동기화",
        target: "강남점 KIOSK-02",
        reason: "센터 정책과 단말 설정 불일치",
        deadline: "오늘",
        owner: "설정 관리자",
        cta: "동기화",
        dialogId: screen.dialogs[1] ?? dialog,
        tone: "warning",
      },
    ],
    D10: [
      {
        id: `${screen.id}-kpi`,
        title: "KPI 예외 검토",
        target: "강남점 매출 전월대비 -12%",
        reason: "커스텀 대시보드 지표 임계값 초과",
        deadline: "오늘 리포트 전",
        owner: "본사 운영",
        cta: "KPI 상세",
        dialogId: dialog,
        tone: "danger",
      },
      {
        id: `${screen.id}-branch`,
        title: "지점 성과 보정",
        target: "서초점 출석 집계",
        reason: "IoT 출석 지연으로 성과 리포트 보정 필요",
        deadline: "주간 리포트 전",
        owner: "데이터 담당",
        cta: "보정 검토",
        dialogId: screen.dialogs[1] ?? dialog,
        tone: "warning",
      },
      {
        id: `${screen.id}-audit`,
        title: "감사 로그 확인",
        target: "환불 승인 3건",
        reason: "위험 액션 연속 발생 · 승인자/사유 확인",
        deadline: "24시간 내",
        owner: "본사 감사",
        cta: "로그 보기",
        dialogId: screen.dialogs[2] ?? dialog,
        tone: "info",
      },
    ],
    D11: [
      {
        id: `${screen.id}-sync`,
        title: "통합 동기화 실패",
        target: "건강 연동 · 체성분 4건",
        reason: "회원 상세 건강 요약 반영 전 재시도 필요",
        deadline: "오늘",
        owner: "통합 운영",
        cta: "재동기화",
        dialogId: dialog,
        tone: "warning",
      },
      {
        id: `${screen.id}-attendance`,
        title: "출석 예외 처리",
        target: "만료 회원 입장 실패",
        reason: "재결제 안내 및 회원 상세 이동 필요",
        deadline: "즉시",
        owner: "프론트",
        cta: "회원 확인",
        dialogId: screen.dialogs[1] ?? dialog,
        tone: "danger",
      },
    ],
  };
  return (
    byDomain[screen.domain] ??
    config.lanes.slice(0, 3).map((lane, index) => ({
      id: `${screen.id}-${index}`,
      title: `${lane} 처리 대상`,
      target: screen.title,
      reason: `${screen.source} 기준 운영 확인 필요`,
      deadline: index === 0 ? "오늘" : "이번 주",
      owner: baseOwner,
      cta: index === 0 ? config.primaryCta : config.secondaryCta,
      dialogId: index === 0 ? dialog : (screen.dialogs[1] ?? dialog),
      tone: index === 0 ? "warning" : "info",
    }))
  );
}

const denseMockBranches = [
  {
    name: "강남점",
    code: "GN-001",
    address: "서울 강남구 테헤란로 152",
    phone: "02-555-0901",
  },
  {
    name: "광화문 본점",
    code: "HQ-000",
    address: "서울 종로구 세종대로 178",
    phone: "02-730-0900",
  },
  {
    name: "서초점",
    code: "SC-002",
    address: "서울 서초구 강남대로 369",
    phone: "02-3477-0902",
  },
  {
    name: "잠실점",
    code: "JS-003",
    address: "서울 송파구 올림픽로 240",
    phone: "02-423-0903",
  },
  {
    name: "판교점",
    code: "PG-004",
    address: "경기 성남시 분당구 판교역로 166",
    phone: "031-8016-0904",
  },
  {
    name: "여의도점",
    code: "YD-005",
    address: "서울 영등포구 국제금융로 10",
    phone: "02-785-0905",
  },
  {
    name: "마포점",
    code: "MP-006",
    address: "서울 마포구 월드컵북로 21",
    phone: "02-332-0906",
  },
  {
    name: "송도점",
    code: "SD-007",
    address: "인천 연수구 송도과학로 32",
    phone: "032-831-0907",
  },
  {
    name: "부산 센텀점",
    code: "BS-008",
    address: "부산 해운대구 센텀남대로 35",
    phone: "051-742-0908",
  },
  {
    name: "대구 수성점",
    code: "DG-009",
    address: "대구 수성구 달구벌대로 2435",
    phone: "053-756-0909",
  },
];

const denseMockMembers = [
  "김민준",
  "박서연",
  "정하준",
  "오지우",
  "한서윤",
  "최가온",
  "윤하린",
  "강도윤",
];
const denseMockOwners = [
  "최민아 Owner",
  "이도현 매니저",
  "박지훈 FC",
  "김서연 트레이너",
  "정유진 본사",
];
const denseMockProducts = [
  "PT 20회",
  "회원권 3개월",
  "락커 1개월",
  "운동복 월정액",
  "그룹수업 패키지",
];
const denseMockStatuses = [
  "정상",
  "운영 중",
  "확인 필요",
  "승인대기",
  "보류",
  "완료",
  "점검",
  "오픈 예정",
];

function isSparseMockValue(value: unknown) {
  const text = String(value ?? "").trim();
  return (
    !text || text === "—" || text === "-" || text === "…" || text.includes("…")
  );
}

function mockCellValue(
  column: string,
  screen: ScreenDefinition,
  index: number,
  branch: string,
) {
  const branchInfo = denseMockBranches[index % denseMockBranches.length];
  const member = denseMockMembers[index % denseMockMembers.length];
  const owner = denseMockOwners[index % denseMockOwners.length];
  const product = denseMockProducts[index % denseMockProducts.length];
  const status = denseMockStatuses[index % denseMockStatuses.length];
  const amount = [120000, 300000, 450000, 780000, 1250000, 0, 89000, 220000][
    index % 8
  ];

  if (/지점명|센터명/.test(column)) return branchInfo.name;
  if (/지점 코드|코드/.test(column)) return branchInfo.code;
  if (/주소/.test(column)) return branchInfo.address;
  if (/연락처|전화|휴대폰/.test(column)) return branchInfo.phone;
  if (/회원 수|회원수/.test(column))
    return String([842, 1126, 615, 538, 412, 356, 284, 128][index % 8]);
  if (/직원 수|직원수/.test(column))
    return String([18, 24, 14, 12, 10, 9, 8, 6][index % 8]);
  if (/운영 상태/.test(column))
    return ["운영 중", "운영 중", "운영 중", "점검", "오픈 예정", "임시휴업"][
      index % 6
    ];
  if (/등록일|신청일|생성일|일자|날짜|기간/.test(column))
    return `2026-05-${String(29 - (index % 9)).padStart(2, "0")}`;
  if (/시간|시각/.test(column))
    return `${String(9 + (index % 9)).padStart(2, "0")}:30`;
  if (/상태|분류/.test(column)) return status;
  if (/담당|승인자|처리자|직원|매니저|Owner|owner/.test(column)) return owner;
  if (/회원명|회원|이름|대상자/.test(column)) return member;
  if (/상품|이용권|수강권|프로그램/.test(column)) return product;
  if (/수업|클래스|룸/.test(column))
    return ["모닝 PT", "저녁 그룹필라테스", "체형 교정", "하체 루틴"][
      index % 4
    ];
  if (/금액|매출|결제|미수|정산|환불|단가/.test(column))
    return `${amount.toLocaleString()}원`;
  if (/수량|횟수|회차|잔여|건수/.test(column)) return String((index + 1) * 3);
  if (/권한|역할/.test(column))
    return roleById.get(defaultRole)?.label ?? "Owner";
  if (/지점/.test(column)) return branchInfo.name;
  if (/액션|바로가기|처리/.test(column))
    return (
      screen.primaryActions.map((action) => action.label).join(" / ") ||
      "상세 / 수정"
    );
  if (/메모|사유|내용|설명/.test(column))
    return `${screen.title} 운영 기준 ${index + 1}번 mock 기록`;
  if (/출처|문서/.test(column)) return getScreenSourceLabel(screen);
  if (/브랜치|귀속/.test(column)) return branchInfo.name;
  return `${branch === "본사 통합" ? branchInfo.name : branch} ${screen.title} ${index + 1}`;
}

function buildDenseMockRows(
  screen: ScreenDefinition,
  branch: string,
  targetCount = 8,
) {
  const columns = screen.tableColumns.length
    ? screen.tableColumns
    : ["항목", "상태", "담당", "일정", "액션"];
  const baseRows: Record<string, string>[] = screen.rows.length
    ? screen.rows
    : Array.from({ length: targetCount }, () => ({}));

  const normalizedRows = baseRows.map((row, index) =>
    columns.reduce<Record<string, string>>((acc, column) => {
      const current = row[column];
      acc[column] = isSparseMockValue(current)
        ? mockCellValue(column, screen, index, branch)
        : String(current);
      return acc;
    }, {}),
  );

  while (normalizedRows.length < targetCount) {
    const index = normalizedRows.length;
    normalizedRows.push(
      columns.reduce<Record<string, string>>((acc, column) => {
        acc[column] = mockCellValue(column, screen, index, branch);
        return acc;
      }, {}),
    );
  }

  return normalizedRows;
}

function buildDenseMockMetrics(
  screen: ScreenDefinition,
  rows: Record<string, string>[],
) {
  const fallbackMetrics = [
    { label: "전체", value: String(rows.length), hint: "표시 가능한 mock row" },
    { label: "정상", value: "6", hint: "운영 가능 상태" },
    { label: "확인 필요", value: "2", hint: "검수/승인 필요" },
    { label: "오늘 처리", value: "4", hint: "운영 큐 연결" },
  ];
  const metrics = screen.metrics.length ? screen.metrics : fallbackMetrics;
  return metrics.map((metric, index) => ({
    ...metric,
    value: isSparseMockValue(metric.value)
      ? [String(rows.length), "6", "1", "1"][index % 4]
      : metric.value,
  }));
}

function DomainOperationsScreen({
  screen,
  role,
  branch,
  openDialog,
}: SpecializedScreenProps) {
  const config = domainPublishing[screen.domain] ?? domainPublishing.D09;
  const accent = accentClasses[config.accent] ?? accentClasses.slate;
  const [activeLane, setActiveLane] = useState(config.lanes[0]);
  const [query, setQuery] = useState("");
  const rows = buildDenseMockRows(
    screen,
    branch,
    screen.id === "SCR-092" ? 10 : 8,
  );
  const denseMetrics = buildDenseMockMetrics(screen, rows);
  const filteredRows = rows.filter((row) =>
    Object.values(row).join(" ").includes(query),
  );
  const columns = screen.tableColumns.length
    ? screen.tableColumns
    : Object.keys(rows[0] ?? {}).slice(0, 5);
  const visibleColumns = columns.slice(
    0,
    Math.max(4, Math.min(columns.length, 6)),
  );
  const primaryDialog = screen.dialogs[0];
  const secondaryDialog = screen.dialogs[1] ?? primaryDialog;
  const visibleRowLimit = screen.id === "SCR-092" ? 10 : 8;
  const queueItems = buildOperationalQueueItems(screen, config);
  const [selectedQueue, setSelectedQueue] =
    useState<OperationalQueueItem | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [queueAssignments, setQueueAssignments] = useState<
    Record<string, string>
  >({});
  const [selectedRow, setSelectedRow] = useState<{
    title: string;
    rows: Record<string, string>;
    source: "metric" | "lane" | "filter" | "table" | "action" | "queue";
  } | null>(null);
  const openStatePanel = (
    title: string,
    rowsForPanel: Record<string, string>,
    source: "metric" | "lane" | "filter" | "table" | "action" | "queue",
  ) => setSelectedRow({ title, rows: rowsForPanel, source });
  const toggleFilter = (filter: string) => {
    setActiveFilters((current) =>
      current.includes(filter)
        ? current.filter((item) => item !== filter)
        : [...current, filter],
    );
    openStatePanel(
      `${filter} 필터`,
      {
        "선택 lane": activeLane,
        "필터 상태": activeFilters.includes(filter) ? "해제됨" : "적용됨",
        "연결 보드": config.boardTitle,
        "검수 기준": "버튼 클릭 즉시 선택 chip/상태바/테이블 컨텍스트가 변경됨",
      },
      "filter",
    );
  };
  const openActionPanel = (label: string, tone = "일반") =>
    openStatePanel(
      label,
      {
        "액션 유형": tone,
        "선택 lane": activeLane,
        "적용 필터": activeFilters.length ? activeFilters.join(" · ") : "없음",
        "처리 방식": "퍼블리싱 mock/local state 패널로 연결",
        "구현 연결점": `${screen.id}.action.${label}`,
      },
      "action",
    );
  const openTableRowPanel = (row: Record<string, string>, index: number) =>
    openStatePanel(
      String(
        row[visibleColumns[0]] ??
          row[Object.keys(row)[0]] ??
          `${screen.title} ${index + 1}`,
      ),
      {
        ...row,
        "선택 lane": activeLane,
        "적용 필터": activeFilters.length
          ? activeFilters.join(" · ")
          : "없음",
        "구현 연결점": `${screen.id}.row.${index + 1}`,
      },
      "table",
    );
  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix={config.eyebrow}
      />

      <section className="grid grid-cols-4 gap-3">
        {denseMetrics.slice(0, 4).map((metric, idx) => {
          const tones = [
            "from-rose-50 to-rose-100/40 border-rose-200/60",
            "from-amber-50 to-amber-100/40 border-amber-200/60",
            "from-sky-50 to-sky-100/40 border-sky-200/60",
            "from-emerald-50 to-emerald-100/40 border-emerald-200/60",
          ];
          return (
            <button
              key={metric.label}
              type="button"
              className={cn(
                "rounded-2xl border bg-gradient-to-br p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md",
                tones[idx % 4],
                activeLane === metric.label && "ring-2 ring-sky-400",
              )}
              onClick={() => {
                setActiveLane(metric.label);
                openStatePanel(
                  `${metric.label} 지표`,
                  {
                    값: metric.value,
                    설명: metric.hint,
                    "선택 lane": metric.label,
                    "연결 보드": config.boardTitle,
                  },
                  "metric",
                );
              }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                {metric.label}
              </p>
              <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900">
                {metric.value}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">{metric.hint}</p>
            </button>
          );
        })}
      </section>

      <section className="grid grid-cols-[minmax(0,1fr)_340px] gap-5">
        <div className="space-y-5">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>{config.title}</CardTitle>
              <CardDescription>
                도메인 문서의 실제 운영 동선을 반영한 전용 퍼블리싱 섹션입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                {config.lanes.map((lane) => (
                  <button
                    key={lane}
                    type="button"
                    className={cn(
                      "rounded-xl border p-4 text-left transition hover:-translate-y-0.5 hover:bg-surface-secondary",
                      activeLane === lane && accent.ring,
                    )}
                    onClick={() => {
                      setActiveLane(lane);
                      openStatePanel(
                        `${lane} 운영 lane`,
                        {
                          "선택 lane": lane,
                          "연결 보드": config.boardTitle,
                          "표시 row": `${filteredRows.length}건`,
                          "구현 연결점": `${screen.id}.lane.${lane}`,
                        },
                        "lane",
                      );
                    }}
                  >
                    <div className="font-semibold">{lane}</div>
                    <div className="mt-1 text-xs text-content-tertiary">
                      {screen.title} 문맥 필터
                    </div>
                  </button>
                ))}
              </div>
              <div
                data-testid={`${screen.id.toLowerCase()}-active-state`}
                className="rounded-xl border border-dashed border-primary/30 bg-primary-light/25 px-3 py-2 text-xs text-content-secondary"
              >
                <b className="text-content">선택 lane:</b> {activeLane}
                <span className="mx-2 text-content-tertiary">·</span>
                <b className="text-content">적용 필터:</b>{" "}
                {activeFilters.length ? activeFilters.join(" · ") : "없음"}
              </div>
              <div className="flex flex-wrap gap-2">
                {screen.filters.slice(0, 7).map((filter) => {
                  const selected = activeFilters.includes(filter);
                  return (
                    <Button
                      key={filter}
                      variant={selected ? "default" : "outline"}
                      size="sm"
                      aria-pressed={selected}
                      onClick={() => toggleFilter(filter)}
                    >
                      {selected ? "✓ " : ""}
                      {filter}
                    </Button>
                  );
                })}
                {role === "HQ_ADMIN" && (
                  <Badge className={accent.chip}>전 지점 통합</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>{config.boardTitle}</CardTitle>
              <CardDescription>
                리스트 행 자체를 누르면 우측 상세 패널이 열리고, 버튼은 보조
                액션만 담당합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={`${screen.title} 통합 검색`}
                  className="max-w-sm"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery("");
                    setActiveFilters([]);
                    setActiveLane(config.lanes[0]);
                    setSelectedRow(null);
                  }}
                >
                  전체 해제
                </Button>
                <Button
                  data-dialog-id={primaryDialog}
                  onClick={() =>
                    primaryDialog
                      ? openDialog(primaryDialog)
                      : openActionPanel(config.primaryCta, "primary")
                  }
                >
                  {config.primaryCta}
                </Button>
                <Button
                  data-dialog-id={secondaryDialog}
                  variant="outline"
                  onClick={() =>
                    secondaryDialog
                      ? openDialog(secondaryDialog)
                      : openActionPanel(config.secondaryCta, "secondary")
                  }
                >
                  {config.secondaryCta}
                </Button>
              </div>
              <div className="overflow-hidden rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {visibleColumns.map((column) => (
                        <TableHead key={column}>{column}</TableHead>
                      ))}
                      <TableHead>운영 상태</TableHead>
                      <TableHead>상세 패널</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRows
                      .slice(0, visibleRowLimit)
                      .map((row, index) => (
                        <TableRow
                          key={index}
                          tabIndex={0}
                          className="cursor-pointer transition hover:bg-surface-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          onClick={() => openTableRowPanel(row, index)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              openTableRowPanel(row, index);
                            }
                          }}
                        >
                          {visibleColumns.map((column) => (
                            <TableCell key={column}>
                              {statusAwareValue(
                                String(
                                  row[column] ??
                                    row[Object.keys(row)[0]] ??
                                    "-",
                                ),
                              )}
                            </TableCell>
                          ))}
                          <TableCell>
                            {statusAwareValue(
                              String(
                                row.상태 ??
                                  row.status ??
                                  (screen.policyPending ? "확인 필요" : "정상"),
                              ),
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">행 클릭</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between rounded-xl border bg-surface-secondary px-4 py-3 text-xs text-content-tertiary">
                <span>
                  {filteredRows.length
                    ? `1-${Math.min(visibleRowLimit, filteredRows.length)} of ${filteredRows.length}`
                    : "검색 결과 없음"}{" "}
                  · 선택 lane {activeLane}
                  {activeFilters.length
                    ? ` · 필터 ${activeFilters.length}개 적용`
                    : ""}
                </span>
                <span>
                  페이지네이션 · 스켈레톤 · empty/error 상태 연결 대상
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="min-w-0 space-y-5">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>{config.queueTitle}</CardTitle>
              <CardDescription>
                문서 기준 처리 사유·대상·담당·마감이 있는 운영 큐입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {queueItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={cn(
                    "w-full rounded-xl border p-3 text-left text-sm transition hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
                    item.tone === "danger" && "border-rose-200 bg-rose-50",
                    item.tone === "warning" && "border-amber-200 bg-amber-50",
                    item.tone === "info" && "border-sky-200 bg-sky-50",
                    item.tone === "success" &&
                      "border-emerald-200 bg-emerald-50",
                  )}
                  onClick={() => setSelectedQueue(item)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-black text-content">{item.title}</p>
                      <p className="mt-1 text-xs font-semibold text-content-secondary">
                        {item.target}
                      </p>
                    </div>
                    <Badge
                      variant={
                        item.tone === "danger"
                          ? "destructive"
                          : item.tone === "warning"
                            ? "warning"
                            : item.tone === "success"
                              ? "success"
                              : "info"
                      }
                    >
                      {item.deadline}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-content-secondary">
                    {item.reason}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-2 text-[11px] font-semibold text-content-tertiary">
                    <span>담당 {item.owner}</span>
                    <span>
                      {queueAssignments[item.id] ?? "상세 패널 열기 →"}
                    </span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </section>

      <AdminSlidePanel
        open={Boolean(selectedQueue)}
        onClose={() => setSelectedQueue(null)}
        eyebrow={`${screen.id} ACTION QUEUE`}
        title={selectedQueue?.title ?? "운영 큐 상세"}
        size="md"
        testId={`${screen.id.toLowerCase()}-queue-detail-panel`}
        footer={
          selectedQueue ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setQueueAssignments((current) => ({
                    ...current,
                    [selectedQueue.id]: "담당 배정 완료",
                  }));
                  setSelectedQueue(null);
                  openStatePanel(
                    `${selectedQueue.title} 담당 배정`,
                    {
                      대상: selectedQueue.target,
                      담당: selectedQueue.owner,
                      상태: "담당 배정 완료",
                      마감: selectedQueue.deadline,
                    },
                    "queue",
                  );
                }}
              >
                담당자 배정
              </Button>
              <Button
                onClick={() => {
                  if (selectedQueue.dialogId) {
                    openDialog(selectedQueue.dialogId);
                    return;
                  }
                  setSelectedQueue(null);
                  openStatePanel(
                    selectedQueue.cta,
                    {
                      대상: selectedQueue.target,
                      사유: selectedQueue.reason,
                      "선택 lane": activeLane,
                      상태: "큐 CTA 실행 준비",
                    },
                    "queue",
                  );
                }}
              >
                {selectedQueue.cta}
              </Button>
            </>
          ) : undefined
        }
      >
        {selectedQueue && (
          <div className="space-y-4">
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>처리 근거</CardTitle>
                <CardDescription>
                  단순 알림이 아니라 운영자가 판단해야 하는 이유와 마감입니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="rounded-xl border bg-white p-3">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-content-tertiary">
                    대상
                  </p>
                  <p className="mt-1 font-semibold text-content">
                    {selectedQueue.target}
                  </p>
                </div>
                <div className="rounded-xl border bg-white p-3">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-content-tertiary">
                    사유
                  </p>
                  <p className="mt-1 leading-6 text-content-secondary">
                    {selectedQueue.reason}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border bg-white p-3">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-content-tertiary">
                      마감
                    </p>
                    <p className="mt-1 font-semibold text-content">
                      {selectedQueue.deadline}
                    </p>
                  </div>
                  <div className="rounded-xl border bg-white p-3">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-content-tertiary">
                      담당
                    </p>
                    <p className="mt-1 font-semibold text-content">
                      {selectedQueue.owner}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>docs4 근거 / 퍼블리싱 계약</CardTitle>
                <CardDescription>
                  큐 카드도 화면 문서와 동일한 출처·상태·권한 기준을 따릅니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-content-secondary">
                <div className="rounded-xl border bg-white p-3">
                  <p className="font-black text-content">
                    {getScreenSourceLabel(screen)}
                  </p>
                  <p className="mt-1 break-words text-xs">{screen.source}</p>
                </div>
                <ul className="space-y-2 text-xs leading-5">
                  <li>• API 호출 없음 · mock/local state만 실행</li>
                  <li>• 클릭 시 상세 사이드 패널 → 필요한 경우 DLG 연결</li>
                  <li>• 처리/배정/CTA는 사이드 패널 또는 dialog로 검수 가능</li>
                  <li>
                    • 권한 차단·empty/loading/error 상태는 화면 계약에 포함
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </AdminSlidePanel>

      <AdminSlidePanel
        open={Boolean(selectedRow)}
        onClose={() => setSelectedRow(null)}
        eyebrow={`${screen.id} ${selectedRow?.source.toUpperCase() ?? "DETAIL"}`}
        title={selectedRow?.title ?? "상세"}
        size="md"
        testId={`${screen.id.toLowerCase()}-row-detail-panel`}
        footer={
          selectedRow ? (
            <>
              <Button variant="outline" onClick={() => setSelectedRow(null)}>
                닫기
              </Button>
              {primaryDialog ? (
                <Button onClick={() => openDialog(primaryDialog)}>
                  관련 DLG 열기
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    openStatePanel(
                      `${selectedRow.title} 저장 검수`,
                      {
                        ...selectedRow.rows,
                        상태: "local state 저장 완료",
                        "저장 범위": "퍼블리싱 mock only",
                      },
                      "action",
                    )
                  }
                >
                  저장 상태 반영
                </Button>
              )}
            </>
          ) : undefined
        }
      >
        {selectedRow && (
          <div className="space-y-4">
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>상세 정보</CardTitle>
                <CardDescription>
                  클릭한 버튼/row가 이 패널의 local state로 연결됩니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {Object.entries(selectedRow.rows).map(([key, value]) => (
                  <div key={key} className="rounded-xl border bg-white p-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.12em] text-content-tertiary">
                      {key}
                    </p>
                    <p className="mt-1 break-words text-sm font-semibold text-content">
                      {statusAwareValue(value)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>퍼블리싱 인계</CardTitle>
                <CardDescription>
                  실제 API가 아니라 화면 연결·상태 변화·DLG 연결 기준을 명확히
                  보여줍니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs leading-5 text-content-secondary">
                <p>
                  <b className="text-content">문서:</b>{" "}
                  {getScreenSourceLabel(screen)}
                </p>
                <p>
                  <b className="text-content">범위:</b> API 호출 없음 ·
                  mock/local state · 사이드 패널/필터/테이블 연결만 구현
                </p>
                <p>
                  <b className="text-content">검수:</b> 클릭 → 화면 상태 변화 →
                  상세 패널 또는 DLG 연결까지 확인
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </AdminSlidePanel>
    </div>
  );
}

function DataPanel({ screen }: { screen: ScreenDefinition }) {
  const [query, setQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<{
    title: string;
    rows: Record<string, string>;
  } | null>(null);
  const filteredRows = screen.rows.filter((row) =>
    Object.values(row).join(" ").toLowerCase().includes(query.toLowerCase()),
  );
  const visibleRows = filteredRows.slice((page - 1) * 5, page * 5);
  const openDataRowDetail = (
    row: Record<string, string>,
    absoluteIndex: number,
    selected: boolean,
  ) =>
    setDetail({
      title: String(
        row[screen.tableColumns[0]] ?? `${screen.title} ${absoluteIndex + 1}`,
      ),
      rows: {
        ...row,
        "선택 상태": selected ? "선택됨" : "미선택",
        "구현 연결점": `${screen.id}.row.${absoluteIndex + 1}`,
      },
    });

  if (!screen.tableColumns.length)
    return (
      <div className="rounded-lg border bg-surface-secondary p-5 text-sm text-content-secondary">
        테이블 없는 화면입니다. 이 화면의 주요 액션은 우측 DLG 또는 상단 액션
        큐에서 mock 동작합니다.
      </div>
    );
  return (
    <div className="rounded-lg border">
      <div className="flex flex-wrap items-center gap-2 border-b bg-surface-secondary p-3">
        <Search className="size-4 text-content-tertiary" />
        <Input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          placeholder="이름·연락처·상품명 통합 검색"
          className="max-w-sm bg-white"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setQuery("");
            setSelectedRows([]);
            setPage(1);
            setDetail(null);
          }}
        >
          전체 해제
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setDetail({
              title: "선택 작업",
              rows: {
                "선택 행": `${selectedRows.length}개`,
                "작업 상태": selectedRows.length
                  ? "일괄 작업 bar 표시"
                  : "선택된 행 없음",
                "구현 연결점": `${screen.id}.bulkAction`,
              },
            })
          }
        >
          선택 작업
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>선택</TableHead>
            {screen.tableColumns.map((column) => (
              <TableHead key={column}>{column}</TableHead>
            ))}
            <TableHead>상세 패널</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleRows.map((row, index) => {
            const absoluteIndex = (page - 1) * 5 + index;
            const selected = selectedRows.includes(absoluteIndex);
            return (
              <TableRow
                key={absoluteIndex}
                data-state={selected ? "selected" : undefined}
                tabIndex={0}
                className="cursor-pointer transition hover:bg-surface-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => openDataRowDetail(row, absoluteIndex, selected)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openDataRowDetail(row, absoluteIndex, selected);
                  }
                }}
              >
                <TableCell onClick={(event) => event.stopPropagation()}>
                  <Button
                    type="button"
                    variant={selected ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setSelectedRows((current) =>
                        current.includes(absoluteIndex)
                          ? current.filter((item) => item !== absoluteIndex)
                          : [...current, absoluteIndex],
                      )
                    }
                  >
                    {selected ? "선택됨" : "선택"}
                  </Button>
                </TableCell>
                {screen.tableColumns.map((column) => (
                  <TableCell key={column}>
                    {statusAwareValue(row[column] ?? "-")}
                  </TableCell>
                ))}
                <TableCell>
                  <Badge variant="outline">행 클릭</Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-content-tertiary">
        <span>
          {filteredRows.length
            ? `${(page - 1) * 5 + 1}-${Math.min(page * 5, filteredRows.length)} of ${filteredRows.length}`
            : "검색 결과 없음"}{" "}
          · 선택 {selectedRows.length}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
          >
            이전
          </Button>
          <span>{page}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={page * 5 >= filteredRows.length}
            onClick={() => setPage((value) => value + 1)}
          >
            다음
          </Button>
        </div>
      </div>
      <AdminSlidePanel
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        eyebrow={`${screen.id} TABLE DETAIL`}
        title={detail?.title ?? "상세"}
        size="md"
        testId={`${screen.id.toLowerCase()}-data-detail-panel`}
        footer={
          detail ? (
            <>
              <Button variant="outline" onClick={() => setDetail(null)}>
                닫기
              </Button>
              <Button
                onClick={() =>
                  setDetail({
                    title: `${detail.title} 저장 검수`,
                    rows: {
                      ...detail.rows,
                      상태: "local state 저장 완료",
                    },
                  })
                }
              >
                저장 상태 반영
              </Button>
            </>
          ) : undefined
        }
      >
        {detail && (
          <div className="space-y-4">
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>테이블 상세</CardTitle>
                <CardDescription>
                  행 액션과 일괄 작업이 toast가 아니라 상세 패널 상태로
                  연결됩니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {Object.entries(detail.rows).map(([key, value]) => (
                  <div key={key} className="rounded-xl border bg-white p-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.12em] text-content-tertiary">
                      {key}
                    </p>
                    <p className="mt-1 break-words text-sm font-semibold text-content">
                      {statusAwareValue(value)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </AdminSlidePanel>
    </div>
  );
}

function statusAwareValue(value: string) {
  if (
    [
      "활성",
      "결제완료",
      "사용",
      "정상",
      "완료",
      "발행 완료",
      "인식중",
      "운영 중",
    ].includes(value)
  )
    return <Badge variant="success">{value}</Badge>;
  if (
    [
      "임박",
      "미수",
      "환불요청",
      "승인대기",
      "보류",
      "확인 필요",
      "부분납",
      "정책",
      "점검",
      "오픈 예정",
    ].includes(value)
  )
    return <Badge variant="warning">{value}</Badge>;
  if (["홀딩", "할부"].includes(value))
    return <Badge variant="info">{value}</Badge>;
  if (["만료", "탈퇴", "오류", "임시휴업"].includes(value))
    return <Badge variant="destructive">{value}</Badge>;
  return value;
}

type DialogKind =
  | "session"
  | "destructive"
  | "payment"
  | "search"
  | "bulk"
  | "status"
  | "form";

type RuntimeDialogProps = {
  dialogId: string | null;
  role: RoleId;
  onClose: () => void;
  notify: Notify;
};

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

const dialogTone: Record<
  DialogKind,
  {
    badge:
      | "default"
      | "secondary"
      | "destructive"
      | "outline"
      | "success"
      | "warning"
      | "info";
    panel: string;
    icon: string;
    label: string;
  }
> = {
  session: {
    badge: "info",
    panel: "border-blue-200 bg-blue-50 text-blue-900",
    icon: "세션",
    label: "세션 복구",
  },
  destructive: {
    badge: "destructive",
    panel: "border-rose-200 bg-rose-50 text-rose-900",
    icon: "위험",
    label: "위험 확인",
  },
  payment: {
    badge: "warning",
    panel: "border-amber-200 bg-amber-50 text-amber-900",
    icon: "정산",
    label: "결제/정산",
  },
  search: {
    badge: "info",
    panel: "border-sky-200 bg-sky-50 text-sky-900",
    icon: "검색",
    label: "검색 선택",
  },
  bulk: {
    badge: "warning",
    panel: "border-violet-200 bg-violet-50 text-violet-900",
    icon: "일괄",
    label: "대량 처리",
  },
  status: {
    badge: "success",
    panel: "border-emerald-200 bg-emerald-50 text-emerald-900",
    icon: "상태",
    label: "상태/설정",
  },
  form: {
    badge: "secondary",
    panel: "border-slate-200 bg-surface-secondary text-content",
    icon: "입력",
    label: "입력 폼",
  },
};

function getDialogKind(dialog: DialogDefinition): DialogKind {
  // ID + 타이틀 우선순위 분류: 타이틀이 정확한 의도. components 텍스트는 보조.
  // 잘못된 매칭 방지: "신규 지점 등록" DLG가 "주소 / 주소 검색" components 때문에 search로 잡히지 않도록 타이틀 우선.
  const id = dialog.id;
  const title = dialog.title;
  const compsText = dialog.components.join(" ");

  // 1. session: DLG-000 또는 타이틀에 "세션"
  if (id === "DLG-000" || /세션/.test(title)) return "session";

  // 2. destructive: destructive 플래그 또는 위험 키워드 (타이틀만)
  if (
    dialog.destructive ||
    /삭제|탈퇴|병합|작업 취소|초기화 확인|취소 확인|퇴사|회수|비활성화|중지/.test(
      title,
    )
  )
    return "destructive";

  // 3. search: 타이틀에 "검색"/"중복" 또는 components의 첫 라인이 검색 input일 때
  if (
    /검색|중복 안내|선택 목록/.test(title) ||
    /^주소 검색/.test(dialog.components[0] ?? "")
  )
    return "search";

  // 4. bulk: 타이틀에 "일괄"/"대량"/"전체"/"다중"
  if (/일괄|대량|전체 반복|다중|일정 이후/.test(title)) return "bulk";

  // 5. payment: 타이틀에 결제·환불·매출·할부 관련
  if (
    /결제|매출|환불|납입|할부|세금|정산|수납|미수|영수증|쿠폰|선수익|목표 매출|환급/.test(
      title,
    )
  )
    return "payment";

  // 6. status: 타이틀에 상태/처리/변경 관련
  if (/상태|권한|설정|변경|홀딩|해제|이관|등급|정책|토글|승인|처리/.test(title))
    return "status";

  // 7. form: 등록/추가/입력 등 신규 데이터 입력 = FormDialogBody (구조화된 컴포넌트 자동 렌더)
  if (/등록|추가|입력|작성|발급|생성|만들기|배정/.test(title)) return "form";

  // fallback: components 텍스트 보조 검사
  if (/검색|주소/.test(compsText) && !/등록|추가/.test(title)) return "search";
  return "form";
}

// 동사형 푸터 액션 라벨 — DLG ID 또는 kind 기반 명확한 의도
function getDialogActionLabel(
  dialog: DialogDefinition,
  kind: DialogKind,
): string {
  // ID 기반 정확한 매핑 우선
  const idMap: Record<string, string> = {
    "DLG-000": "재로그인",
    "DLG-M001": "상태 변경",
    "DLG-M002": "회원 삭제",
    "DLG-M003": "홀딩 등록",
    "DLG-M004": "홀딩 해제",
    "DLG-M005": "탈퇴 처리",
    "DLG-M006": "강제 등록",
    "DLG-M011": "상담 등록",
    "DLG-M013": "환불 처리",
    "DLG-M015": "측정 등록",
    "DLG-M022": "출석 등록",
    "DLG-M023": "이관 확인",
    "DLG-M027": "주소 선택",
    "DLG-M028": "병합 확정",
    "DLG-S001": "닫기",
    "DLG-S002": "구매자 선택",
    "DLG-S003": "결제 확정",
    "DLG-S004": "계속 진행",
    "DLG-S008": "납입 확정",
    "DLG-S012": "목표 저장",
    "DLG-S013": "환불 확정",
    "DLG-S015": "환불 요청 접수",
    "DLG-092-001": "지점 등록",
    "DLG-092-002": "운영 상태 변경",
  };
  if (idMap[dialog.id]) return idMap[dialog.id];

  // policy pending — 정책 확인 저장
  if (dialog.policyPending) return "정책 확인 저장";

  // kind 기반 fallback
  if (kind === "session") return "재로그인";
  if (kind === "destructive")
    return /삭제/.test(dialog.title)
      ? "삭제 확정"
      : /병합/.test(dialog.title)
        ? "병합 확정"
        : /비활성/.test(dialog.title)
          ? "비활성화 확정"
          : /퇴사/.test(dialog.title)
            ? "퇴사 처리"
            : "위험 액션 확정";
  if (kind === "search") return "선택 적용";
  if (kind === "bulk") return "일괄 실행";
  if (kind === "payment")
    return /환불/.test(dialog.title)
      ? "환불 확정"
      : /세금/.test(dialog.title)
        ? "발행"
        : "결제 확정";

  // form/status — 타이틀에서 동사 추출
  if (/등록/.test(dialog.title)) return "등록";
  if (/수정/.test(dialog.title)) return "저장";
  if (/추가/.test(dialog.title)) return "추가";
  if (/생성|만들기|발급/.test(dialog.title)) return "생성";
  if (/변경|이관/.test(dialog.title)) return "변경";
  return "확인";
}

function RuntimeDialog({
  dialogId,
  role,
  onClose,
  notify,
}: RuntimeDialogProps) {
  const dialog = dialogId ? dialogById.get(dialogId) : undefined;
  const allowed = dialog
    ? hasPermission(role, dialog.requiredPermission)
    : true;
  const contract = dialog ? getDialogContract(dialog) : null;
  const kind = dialog ? getDialogKind(dialog) : "form";
  const [dirty, setDirty] = useState(false);

  const closeDialog = () => {
    if (dirty) notify("입력 변경사항을 저장하지 않고 닫았습니다.", "warning");
    setDirty(false);
    onClose();
  };

  const confirmDialog = () => {
    if (!dialog) return;
    if (!allowed) {
      notify(
        `${dialog.id} ${dialog.title}: 현재 역할 권한으로는 처리할 수 없습니다.`,
        "warning",
      );
      return;
    }
    notify(
      `${dialog.title} mock 처리 완료`,
      dialog.policyPending ? "warning" : "success",
    );
    setDirty(false);
    onClose();
  };

  if (!dialog || !contract) {
    return (
      <Dialog open={false} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent />
      </Dialog>
    );
  }

  const actionLabel = getDialogActionLabel(dialog, kind);
  const isDestructive = dialog.destructive || kind === "destructive";
  const widthClass =
    kind === "search" || kind === "bulk" || dialog.id === "DLG-M028"
      ? "max-w-3xl"
      : "max-w-2xl";

  return (
    <Dialog
      open={Boolean(dialog)}
      onOpenChange={(open) => !open && closeDialog()}
    >
      <DialogContent
        data-testid="runtime-dialog"
        className={cn("p-0 overflow-hidden", widthClass)}
      >
        {/* 헤더: 컴팩트. ID 배지 + 타이틀 + source path 모노스페이스 + 닫기 X */}
        <DialogHeader className="px-6 pt-5 pb-4 border-b space-y-2 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant={isDestructive ? "destructive" : "info"}
              className="text-[10px] font-mono"
            >
              {dialog.id}
            </Badge>
            {dialog.policyPending && (
              <Badge variant="warning" className="text-[10px]">
                정책 확인 필요
              </Badge>
            )}
            {!allowed && (
              <Badge variant="warning" className="text-[10px]">
                <Lock className="size-2.5 mr-1" />
                권한 차단
              </Badge>
            )}
            <code className="ml-auto font-mono text-[10px] text-content-tertiary truncate max-w-[260px]">
              {dialog.source.replace("share/", "")}
            </code>
          </div>
          <DialogTitle className="text-xl leading-tight">
            {dialog.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-content-secondary leading-relaxed">
            {dialog.purpose}
          </DialogDescription>
        </DialogHeader>

        {/* 본문 */}
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {!allowed && <PermissionBlockedMessage dialog={dialog} />}
          <DialogWorkflowBody
            dialog={dialog}
            kind={kind}
            role={role}
            allowed={allowed}
            dirty={dirty}
            setDirty={setDirty}
            onClose={onClose}
            notify={notify}
            contract={contract}
          />
        </div>

        {/* 푸터: 동사형 액션 라벨 */}
        <DialogFooter className="px-6 py-4 border-t bg-surface-secondary/40">
          <Button variant="outline" onClick={closeDialog}>
            취소
          </Button>
          <Button
            variant={isDestructive ? "destructive" : "default"}
            data-blocked={!allowed}
            disabled={!allowed}
            onClick={confirmDialog}
          >
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PermissionBlockedMessage({ dialog }: { dialog: DialogDefinition }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
      <Lock className="mr-2 inline size-4" />
      현재 역할에는 <b>{dialog.requiredPermission}</b> 처리 권한이 없습니다.
      검수용으로 입력과 상태는 보이지만 확인 버튼은 권한 차단 toast만
      표시합니다.
    </div>
  );
}

function DialogWorkflowBody(props: DialogBodyProps) {
  const { dialog, kind } = props;

  // ID 기반 정확한 분기 (핵심 DLG 24)
  if (dialog.id === "DLG-000") return <SessionDialogBody {...props} />;
  if (dialog.id === "DLG-M001") return <MemberStatusChangeDialog {...props} />;
  if (dialog.id === "DLG-M002") return <MemberDeleteDialog {...props} />;
  if (dialog.id === "DLG-M003") return <HoldingRegisterDialog {...props} />;
  if (dialog.id === "DLG-M004") return <HoldingReleaseDialog {...props} />;
  if (dialog.id === "DLG-M005") return <MemberWithdrawDialog {...props} />;
  if (dialog.id === "DLG-M006") return <PhoneDuplicateDialog {...props} />;
  if (dialog.id === "DLG-M011")
    return <ConsultationRegisterDialog {...props} />;
  if (dialog.id === "DLG-M013") return <MemberRefundDialog {...props} />;
  if (dialog.id === "DLG-M015")
    return <BodyCompositionRegisterDialog {...props} />;
  if (dialog.id === "DLG-M022") return <ManualAttendanceDialog {...props} />;
  if (dialog.id === "DLG-M023") return <MemberTransferDialog {...props} />;
  if (dialog.id === "DLG-M027") return <AddressSearchDialog {...props} />;
  if (dialog.id === "DLG-M028") return <MemberMergeDialog {...props} />;
  if (dialog.id === "DLG-S001") return <SalesDetailDialog />;
  if (dialog.id === "DLG-S002") return <BuyerSearchDialog {...props} />;
  if (dialog.id === "DLG-S003") return <PaymentConfirmDialog />;
  if (dialog.id === "DLG-S004") return <DuplicatePaymentDialog />;
  if (dialog.id === "DLG-S008") return <PaymentReceiveDialog {...props} />;
  if (dialog.id === "DLG-S012") return <SalesTargetDialog {...props} />;
  if (dialog.id === "DLG-S013") return <SalesRefundDialog {...props} />;
  if (dialog.id === "DLG-S015") return <RefundRequestDialog {...props} />;
  if (dialog.id === "DLG-092-001") return <BranchCreateDialog {...props} />;
  if (dialog.id === "DLG-092-002") return <BranchDeactivateDialog {...props} />;

  // kind 기반 fallback (나머지 100+ DLG)
  if (kind === "session") return <SessionDialogBody {...props} />;
  if (kind === "destructive") return <DestructiveDialogBody {...props} />;
  if (kind === "payment") return <PaymentDialogBody {...props} />;
  if (kind === "search") return <SearchDialogBody {...props} />;
  if (kind === "bulk") return <BulkDialogBody {...props} />;
  if (kind === "status") return <StatusDialogBody {...props} />;
  return <ComponentDrivenForm {...props} />;
}

// 핵심 30 DLG 명시 분기 컴포넌트 ----------------------------------------------

// DLG-M001 회원 상태 변경
function MemberStatusChangeDialog({ setDirty }: DialogBodyProps) {
  const [newStatus, setNewStatus] = useState("");
  const [reason, setReason] = useState("");
  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-surface-secondary p-3 text-sm">
        <div className="text-xs text-content-tertiary mb-1">대상 회원</div>
        <div className="flex items-center gap-2">
          <b>김민준</b>
          <span className="text-xs text-content-tertiary">M0142 · 강남점</span>
          <Badge variant="success" className="text-[10px] ml-auto">
            현재: 활성
          </Badge>
        </div>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          변경할 상태 *
        </Label>
        <Select
          value={newStatus}
          onValueChange={(v) => {
            setNewStatus(v);
            setDirty(true);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="선택해주세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">활성</SelectItem>
            <SelectItem value="expired">만료</SelectItem>
            <SelectItem value="holding">홀딩</SelectItem>
            <SelectItem value="stopped">정지</SelectItem>
            <SelectItem value="withdrawn">탈퇴</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          사유 * (감사 로그 필수)
        </Label>
        <Textarea
          rows={3}
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setDirty(true);
          }}
          placeholder="예: 본인 요청 정지, 회비 미납 만료"
        />
      </div>
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
        <AlertTriangle size={13} className="inline mr-1.5 text-amber-600" />
        <b>예외처리:</b> 미수금 보유 회원의 탈퇴는 차단됩니다. 진행 예약이
        있으면 자동 취소됩니다.
      </div>
    </div>
  );
}

// DLG-M002 회원 삭제 (복구 불가)
function MemberDeleteDialog({ setDirty }: DialogBodyProps) {
  const [reason, setReason] = useState("");
  const [confirmText, setConfirmText] = useState("");
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-900">
        <div className="flex items-start gap-2">
          <AlertTriangle size={16} className="mt-0.5" />
          <div className="text-sm">
            <b>복구 불가 액션</b>
            <p className="mt-1 text-xs leading-5">
              회원 데이터가 영구 삭제됩니다. 결제·출석 이력은 보존되지만
              개인정보는 90일 후 자동 마스킹됩니다.
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-xl border bg-surface-secondary p-3">
        <div className="text-xs text-content-tertiary mb-1">삭제 대상</div>
        <div className="flex items-center gap-2">
          <b>김민준</b>
          <span className="text-xs text-content-tertiary">
            M0142 · 강남점 · 가입 2024-08-15
          </span>
        </div>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-2 block">
          차단 조건 확인
        </Label>
        <div className="space-y-1.5">
          {[
            { label: "미수금 없음", ok: true },
            { label: "진행 예약 없음", ok: true },
            { label: "환불 필요 없음", ok: true },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-2 text-xs">
              <CheckCircle2
                size={13}
                className={c.ok ? "text-emerald-600" : "text-rose-600"}
              />
              <span>{c.label}</span>
              <Badge
                variant={c.ok ? "success" : "destructive"}
                className="text-[10px] ml-auto"
              >
                {c.ok ? "OK" : "차단"}
              </Badge>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          삭제 사유 * (5자 이상)
        </Label>
        <Textarea
          rows={2}
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setDirty(true);
          }}
          placeholder="예: 본인 요청, 중복 계정 정리"
        />
        {reason.length > 0 && reason.length < 5 && (
          <p className="text-[10px] text-rose-600 mt-1">
            5자 이상 입력해주세요.
          </p>
        )}
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          확인 문구 입력 * &quot;삭제확인&quot;
        </Label>
        <Input
          value={confirmText}
          onChange={(e) => {
            setConfirmText(e.target.value);
            setDirty(true);
          }}
          placeholder="삭제확인"
          className={cn(
            confirmText &&
              confirmText !== "삭제확인" &&
              "border-rose-400 bg-rose-50",
            confirmText === "삭제확인" && "border-emerald-400 bg-emerald-50",
          )}
        />
      </div>
    </div>
  );
}

// DLG-M005 탈퇴 처리
function MemberWithdrawDialog({ setDirty }: DialogBodyProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-surface-secondary p-3 text-sm">
        <div className="text-xs text-content-tertiary mb-1">탈퇴 대상</div>
        <b>김민준 · M0142 · 강남점</b>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg border p-3">
          <div className="text-content-tertiary">잔여 이용권</div>
          <div className="font-bold mt-1">PT 8회 · 회원권 D-42</div>
        </div>
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
          <div className="text-rose-700">미수금</div>
          <div className="font-bold mt-1 text-rose-700">120,000원</div>
        </div>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          탈퇴 사유 *
        </Label>
        <Select onValueChange={() => setDirty(true)}>
          <SelectTrigger>
            <SelectValue placeholder="선택해주세요" />
          </SelectTrigger>
          <SelectContent>
            {["본인 요청", "이사", "건강 사유", "타지점 이관", "기타"].map(
              (r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">메모</Label>
        <Textarea
          rows={2}
          onChange={() => setDirty(true)}
          placeholder="잔여 환불 처리는 별도 진행"
        />
      </div>
    </div>
  );
}

// DLG-M006 전화번호 중복
function PhoneDuplicateDialog(_props: DialogBodyProps) {
  void _props;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900 text-sm">
        <AlertTriangle size={14} className="inline mr-1.5" />
        입력한 연락처로 등록된 기존 회원이 있습니다. 동일인 여부를 확인해주세요.
      </div>
      <div>
        <Label className="text-xs font-semibold mb-2 block">
          중복 회원 목록
        </Label>
        <div className="space-y-2">
          {[
            {
              name: "박서연",
              phone: "010-1234-5678",
              branch: "강남점",
              status: "활성",
              joined: "2024-03-12",
            },
            {
              name: "박서연(가족)",
              phone: "010-1234-5678",
              branch: "서초점",
              status: "탈퇴",
              joined: "2023-11-05",
            },
          ].map((m) => (
            <div
              key={m.joined}
              className="rounded-lg border bg-white p-3 flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-sm">
                  {m.name}{" "}
                  <span className="text-xs text-content-tertiary">
                    ({m.phone})
                  </span>
                </div>
                <div className="text-[10px] text-content-tertiary mt-0.5">
                  {m.branch} · 가입 {m.joined}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={m.status === "활성" ? "success" : "secondary"}
                  className="text-[10px]"
                >
                  {m.status}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                >
                  <Link href="/members/detail?from=DLG-M006">상세</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg border bg-surface-secondary p-3 text-xs text-content-secondary">
        <b>처리 옵션:</b> 기존 회원이라면 [취소] → 회원 상세 이동. 다른
        회원이라면 [강제 등록]으로 진행.
      </div>
    </div>
  );
}

// DLG-M013 회원 결제 환불
function MemberRefundDialog({ setDirty }: DialogBodyProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-lg border p-2.5">
          <div className="text-content-tertiary">원 결제</div>
          <div className="font-bold mt-1 font-mono">S-260520-018</div>
        </div>
        <div className="rounded-lg border p-2.5">
          <div className="text-content-tertiary">결제일</div>
          <div className="font-bold mt-1">2026-05-20</div>
        </div>
        <div className="rounded-lg border border-primary/30 bg-primary-light p-2.5">
          <div className="text-primary">결제 금액</div>
          <div className="font-bold mt-1 text-primary tabular-nums">
            1,200,000원
          </div>
        </div>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          환불 금액 (수기 입력) *
        </Label>
        <Input
          type="text"
          placeholder="700,000"
          onChange={() => setDirty(true)}
        />
        <p className="text-[10px] text-content-tertiary mt-1">
          사용 기간/회차 차감 후 잔액 — 자동 산식 미확정 (정책 보류)
        </p>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          위약금 (선택)
        </Label>
        <Input type="text" placeholder="0" onChange={() => setDirty(true)} />
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          환불 사유 *
        </Label>
        <Textarea
          rows={2}
          onChange={() => setDirty(true)}
          placeholder="중도 해지, 이사, 만족도 불만 등"
        />
      </div>
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
        <AlertTriangle size={13} className="inline mr-1.5" />
        <b>정책 확인 필요:</b> 실제 환불은 외부 PG 또는 현금 별도 처리. 본 DLG는
        CRM 기록만 진행합니다.
      </div>
    </div>
  );
}

// DLG-M022 수동 출석 등록
function ManualAttendanceDialog({ setDirty }: DialogBodyProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
        <AlertTriangle size={13} className="inline mr-1.5" />
        키오스크/얼굴 인식/앱 QR 실패 등 <b>예외 상황만</b> 사용. 감사 로그 영구
        기록됩니다.
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          회원 검색 *
        </Label>
        <Input placeholder="이름 또는 연락처" onChange={() => setDirty(true)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs font-semibold mb-1.5 block">
            출석 일시 *
          </Label>
          <Input
            type="datetime-local"
            defaultValue="2026-05-29T09:30"
            onChange={() => setDirty(true)}
          />
        </div>
        <div>
          <Label className="text-xs font-semibold mb-1.5 block">담당자</Label>
          <Input
            value="현재 로그인 직원 자동"
            disabled
            className="bg-surface-secondary"
          />
        </div>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          사유 * (5자 이상)
        </Label>
        <Textarea
          rows={2}
          onChange={() => setDirty(true)}
          placeholder="키오스크 QR 인식 불가, 앱 미설치 등"
        />
      </div>
    </div>
  );
}

// DLG-M023 이관 확인
function MemberTransferDialog({ setDirty }: DialogBodyProps) {
  const rows = [
    { 필드: "소속지점", 현재: "강남점", 이관: "서초점" },
    { 필드: "담당 FC", 현재: "이FC", 이관: "김FC" },
    { 필드: "담당 트레이너", 현재: "박트레이너", 이관: "정트레이너" },
    { 필드: "정산 지점", 현재: "강남점", 이관: "서초점" },
    { 필드: "인센티브 귀속자", 현재: "이FC", 이관: "김FC" },
  ];
  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-surface-secondary p-3">
        <div className="text-xs text-content-tertiary mb-1">이관 대상</div>
        <b>김민준 · M0142</b>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-2 block">
          재배정 표 (5필드)
        </Label>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>필드</TableHead>
                <TableHead>현재</TableHead>
                <TableHead className="text-right">이관 후</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.필드}>
                  <TableCell className="text-xs font-semibold">
                    {r.필드}
                  </TableCell>
                  <TableCell className="text-xs">{r.현재}</TableCell>
                  <TableCell className="text-xs text-right text-primary font-semibold">
                    {r.이관}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          이관 사유 *
        </Label>
        <Textarea
          rows={2}
          onChange={() => setDirty(true)}
          placeholder="회원 요청, 이사, 담당자 재배정 등"
        />
      </div>
    </div>
  );
}

// DLG-M027 주소 검색 (진짜 검색 DLG)
function AddressSearchDialog({ setDirty, notify }: DialogBodyProps) {
  const [query, setQuery] = useState("강남구 테헤란로");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const results = [
    {
      primary: "서울 강남구 테헤란로 152",
      secondary: "역삼동 강남파이낸스센터",
      postal: "06236",
    },
    {
      primary: "서울 강남구 테헤란로 211",
      secondary: "역삼동 한국타이어빌딩",
      postal: "06141",
    },
    {
      primary: "서울 강남구 테헤란로 305",
      secondary: "역삼동 BS타워",
      postal: "06151",
    },
  ].filter((r) =>
    query.length < 2
      ? true
      : r.primary.includes(query) || r.secondary.includes(query),
  );
  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          주소 검색 *
        </Label>
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary"
          />
          <Input
            className="pl-9"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setDirty(true);
              setSelectedIdx(null);
            }}
            placeholder="도로명, 지번 또는 건물명"
          />
        </div>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-2 block">
          검색 결과 ({results.length}건)
        </Label>
        <div className="space-y-2">
          {results.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-xs text-content-tertiary">
              검색 결과 없음
            </div>
          ) : (
            results.map((r, idx) => (
              <button
                key={r.postal}
                type="button"
                onClick={() => {
                  setSelectedIdx(idx);
                  setDirty(true);
                  notify(`${r.primary} 선택`, "info");
                }}
                className={cn(
                  "w-full rounded-lg border p-3 text-left transition",
                  selectedIdx === idx
                    ? "border-primary ring-2 ring-primary/20 bg-primary-light"
                    : "hover:border-primary/30",
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-sm">{r.primary}</div>
                    <div className="text-[10px] text-content-tertiary mt-0.5">
                      {r.secondary}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-content-tertiary">
                    {r.postal}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// DLG-M028 회원 병합
function MemberMergeDialog({ setDirty }: DialogBodyProps) {
  const compareRows = [
    { 항목: "이름", 주: "김민준", 부: "김민준", 채택: "주" },
    { 항목: "연락처", 주: "010-1234-5678", 부: "010-9876-5432", 채택: "주" },
    { 항목: "이용권", 주: "PT 20회", 부: "회원권 3개월", 채택: "합산" },
    { 항목: "마일리지", 주: "12,000원", 부: "5,000원", 채택: "합산 17,000원" },
  ];
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-900">
        <AlertTriangle size={14} className="inline mr-1.5" />
        <b>
          병합 후 부 계정은 비활성 처리됩니다 (즉시 삭제 아님). 5분 내 취소
          가능.
        </b>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg border-2 border-primary/40 bg-primary-light p-3">
          <div className="text-primary font-bold">주 계정 (유지)</div>
          <div className="mt-1 font-semibold">김민준 · M0142</div>
        </div>
        <div className="rounded-lg border p-3 bg-surface-secondary">
          <div className="text-content-tertiary font-bold">
            부 계정 (비활성)
          </div>
          <div className="mt-1 font-semibold">김민준 · M0287</div>
        </div>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-2 block">
          병합 항목 비교
        </Label>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>항목</TableHead>
                <TableHead>주 계정</TableHead>
                <TableHead>부 계정</TableHead>
                <TableHead className="text-right">채택</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {compareRows.map((r) => (
                <TableRow key={r.항목}>
                  <TableCell className="text-xs font-semibold">
                    {r.항목}
                  </TableCell>
                  <TableCell className="text-xs">{r.주}</TableCell>
                  <TableCell className="text-xs text-content-tertiary">
                    {r.부}
                  </TableCell>
                  <TableCell className="text-xs text-right text-primary font-semibold">
                    {r.채택}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          병합 확인 문구 입력 * &quot;병합확인&quot;
        </Label>
        <Input onChange={() => setDirty(true)} placeholder="병합확인" />
      </div>
    </div>
  );
}

// DLG-S001 매출 상세 (조회 전용)
function SalesDetailDialog() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border p-3">
          <div className="text-xs text-content-tertiary">매출 번호</div>
          <div className="font-bold mt-1 font-mono">S-260528-001</div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-xs text-content-tertiary">결제 일시</div>
          <div className="font-bold mt-1">2026-05-28 14:32</div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-xs text-content-tertiary">회원</div>
          <div className="font-bold mt-1">김민준 (M0142)</div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-xs text-content-tertiary">처리 직원</div>
          <div className="font-bold mt-1">최FC</div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-xs text-content-tertiary">상품</div>
          <div className="font-bold mt-1">PT 20회권</div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-xs text-content-tertiary">결제 수단</div>
          <div className="font-bold mt-1">카드 100%</div>
        </div>
        <div className="rounded-lg border-2 border-primary/30 bg-primary-light p-3 col-span-2">
          <div className="text-xs text-primary">결제 금액</div>
          <div className="text-2xl font-bold mt-1 text-primary tabular-nums">
            1,200,000원
          </div>
        </div>
      </div>
    </div>
  );
}

// DLG-S002 구매자 검색
function BuyerSearchDialog({ setDirty, notify }: DialogBodyProps) {
  const [query, setQuery] = useState("김민준");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const results = [
    {
      name: "김민준",
      phone: "010-1234-5678",
      branch: "강남점 활성",
      id: "M0142",
    },
    {
      name: "김민준(가족)",
      phone: "010-0000-1111",
      branch: "서초점 활성",
      id: "M0287",
    },
  ].filter((r) =>
    query.length < 1 ? true : r.name.includes(query) || r.phone.includes(query),
  );
  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          구매자 검색 *
        </Label>
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary"
          />
          <Input
            className="pl-9"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setDirty(true);
              setSelectedIdx(null);
            }}
            placeholder="이름·연락처·운동 ID"
          />
        </div>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-2 block">
          검색 결과 ({results.length}건)
        </Label>
        <div className="space-y-2">
          {results.map((r, idx) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setSelectedIdx(idx);
                setDirty(true);
                notify(`${r.name} 선택`, "info");
              }}
              className={cn(
                "w-full rounded-lg border p-3 text-left transition",
                selectedIdx === idx
                  ? "border-primary ring-2 ring-primary/20 bg-primary-light"
                  : "hover:border-primary/30",
              )}
            >
              <div className="font-semibold text-sm">
                {r.name}{" "}
                <span className="text-xs text-content-tertiary">
                  ({r.phone})
                </span>
              </div>
              <div className="text-[10px] text-content-tertiary mt-0.5">
                {r.branch} · {r.id}
              </div>
            </button>
          ))}
        </div>
        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={() => {
            setSelectedIdx(99);
            notify("비회원 현장 결제로 진행", "info");
          }}
        >
          비회원으로 진행
        </Button>
      </div>
    </div>
  );
}

// DLG-S003 결제 확인
function PaymentConfirmDialog() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-surface-secondary p-3">
        <div className="text-xs text-content-tertiary mb-1">구매자</div>
        <b>김민준</b>{" "}
        <span className="text-xs text-content-tertiary">M0142 · 강남점</span>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-2 block">상품 목록</Label>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between rounded-lg border bg-white p-2.5 text-sm">
            <div>
              <b>PT 20회권</b>{" "}
              <span className="text-xs text-content-tertiary">120일</span>
            </div>
            <span className="tabular-nums font-semibold">1,200,000원</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg border p-3">
          <div className="text-content-tertiary">결제 수단</div>
          <div className="font-bold mt-1">카드 100%</div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-content-tertiary">영수증</div>
          <div className="font-bold mt-1">첨부 완료</div>
        </div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-primary via-primary to-[#ff907f] p-3 text-white">
        <div className="text-xs text-white/85">최종 결제 금액</div>
        <div className="text-2xl font-bold tabular-nums">1,200,000원</div>
      </div>
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">
        <b>안내:</b> PG 승인·현금영수증은 외부 처리. 본 DLG는 CRM 매출 기록 +
        회원권 발급만 진행합니다.
      </div>
    </div>
  );
}

// DLG-S004 중복 결제 경고
function DuplicatePaymentDialog() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900">
        <AlertTriangle size={14} className="inline mr-1.5" />
        <b>동일 회원·동일 상품 단기간 중복 결제 감지</b>
      </div>
      <div className="rounded-lg border bg-surface-secondary p-3 text-sm">
        <div className="text-xs text-content-tertiary mb-1">
          기존 결제 (24시간 이내)
        </div>
        <div className="flex items-center justify-between">
          <div>
            <b>김민준 · PT 20회권</b>
            <div className="text-[10px] text-content-tertiary mt-0.5">
              2026-05-28 12:18 · 1,200,000원 · 결제완료
            </div>
          </div>
          <Badge variant="warning" className="text-[10px]">
            2시간 전
          </Badge>
        </div>
      </div>
      <div className="rounded-lg border bg-surface-secondary p-3 text-xs text-content-secondary">
        <b>옵션:</b> 다른 상품/패키지 확인 후 [취소] 또는 의도된 중복 결제라면
        [계속 진행].
      </div>
    </div>
  );
}

// DLG-S013 환불 처리
function SalesRefundDialog({ setDirty }: DialogBodyProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg border p-2.5">
          <div className="text-content-tertiary">원 매출</div>
          <div className="font-bold mt-1 font-mono">S-260520-018</div>
        </div>
        <div className="rounded-lg border border-primary/30 bg-primary-light p-2.5">
          <div className="text-primary">결제 금액</div>
          <div className="font-bold mt-1 text-primary tabular-nums">
            1,200,000원
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs font-semibold mb-1.5 block">
            환불 금액 *
          </Label>
          <Input placeholder="700,000" onChange={() => setDirty(true)} />
        </div>
        <div>
          <Label className="text-xs font-semibold mb-1.5 block">위약금</Label>
          <Input placeholder="50,000" onChange={() => setDirty(true)} />
        </div>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          환불 사유 *
        </Label>
        <Textarea
          rows={2}
          onChange={() => setDirty(true)}
          placeholder="중도 해지, 이사, 만족도 불만 등"
        />
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">승인 메모</Label>
        <Textarea
          rows={2}
          onChange={() => setDirty(true)}
          placeholder="Owner 검토 결과"
        />
      </div>
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
        <AlertTriangle size={13} className="inline mr-1.5" />
        환불 자동 산식 미확정 — 수기 입력 100%. 실제 환불은 외부 PG/현금 별도
        처리.
      </div>
    </div>
  );
}

// DLG-S015 환불 요청 접수
function RefundRequestDialog({ setDirty }: DialogBodyProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-surface-secondary p-3">
        <div className="text-xs text-content-tertiary mb-1">환불 대상</div>
        <b>김민준 · PT 20회권 · S-260520-018</b>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">요청자 *</Label>
        <Select onValueChange={() => setDirty(true)}>
          <SelectTrigger>
            <SelectValue placeholder="선택해주세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="member">회원 본인</SelectItem>
            <SelectItem value="staff">직원 (회원 위임)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          요청 사유 *
        </Label>
        <Textarea
          rows={3}
          onChange={() => setDirty(true)}
          placeholder="환불 요청 사유를 자세히 적어주세요"
        />
      </div>
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
        접수 후 Owner 승인이 필요합니다. 접수만으로는 환불 처리되지 않습니다.
      </div>
    </div>
  );
}

// DLG-M003 홀딩 등록
function HoldingRegisterDialog({ setDirty }: DialogBodyProps) {
  const [startDate, setStartDate] = useState("2026-05-29");
  const [endDate, setEndDate] = useState("2026-06-29");
  const [reason, setReason] = useState("");
  const days = (() => {
    if (!startDate || !endDate) return 0;
    const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
    return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
  })();
  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-surface-secondary p-3">
        <div className="text-xs text-content-tertiary mb-1">대상 회원</div>
        <b>김민준 · M0142</b>
        <span className="text-xs text-content-tertiary ml-2">
          PT 20회 · 잔여 D-42
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs font-semibold mb-1.5 block">
            홀딩 시작일 *
          </Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setDirty(true);
            }}
          />
        </div>
        <div>
          <Label className="text-xs font-semibold mb-1.5 block">
            홀딩 종료일 *
          </Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setDirty(true);
            }}
          />
        </div>
      </div>
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">
        <b>홀딩 기간:</b> {days}일 (이용권 종료일 자동 연장 — 만료일 D+{days})
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">사유 *</Label>
        <Textarea
          rows={2}
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setDirty(true);
          }}
          placeholder="부상, 출장, 여행, 건강 사유 등"
        />
      </div>
    </div>
  );
}

// DLG-M004 홀딩 해제
function HoldingReleaseDialog({ setDirty }: DialogBodyProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-surface-secondary p-3">
        <div className="text-xs text-content-tertiary mb-1">홀딩 중인 회원</div>
        <b>정하준 · M0341</b>
        <div className="text-[10px] text-content-tertiary mt-1">
          홀딩 기간: 2026.05.01 ~ 07.10 (남은 일수 42일)
        </div>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          해제 일자 *
        </Label>
        <Input
          type="date"
          defaultValue="2026-05-29"
          onChange={() => setDirty(true)}
        />
      </div>
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
        <CheckCircle2 size={13} className="inline mr-1.5" />
        <b>잔여 기간 재계산:</b> 해제 후 이용권 만료일이 -42일 단축됩니다 (사용
        가능 기간 정상화).
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          해제 사유 (선택)
        </Label>
        <Textarea
          rows={2}
          onChange={() => setDirty(true)}
          placeholder="회원 요청으로 조기 복귀"
        />
      </div>
    </div>
  );
}

// DLG-M011 상담 등록/수정
function ConsultationRegisterDialog({ setDirty }: DialogBodyProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-surface-secondary p-3">
        <div className="text-xs text-content-tertiary mb-1">대상 회원</div>
        <b>박서연 · M0287</b>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs font-semibold mb-1.5 block">상담일 *</Label>
          <Input
            type="datetime-local"
            defaultValue="2026-05-29T14:00"
            onChange={() => setDirty(true)}
          />
        </div>
        <div>
          <Label className="text-xs font-semibold mb-1.5 block">담당자 *</Label>
          <Select defaultValue="최FC" onValueChange={() => setDirty(true)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="최FC">최FC</SelectItem>
              <SelectItem value="정FC">정FC</SelectItem>
              <SelectItem value="한트레이너">한트레이너</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">상담 유형</Label>
        <Select defaultValue="renewal" onValueChange={() => setDirty(true)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="initial">신규 상담</SelectItem>
            <SelectItem value="renewal">재등록 상담</SelectItem>
            <SelectItem value="complaint">불만 처리</SelectItem>
            <SelectItem value="program">프로그램 변경</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          상담 내용 *
        </Label>
        <Textarea
          rows={4}
          onChange={() => setDirty(true)}
          placeholder="회원 의견·합의 사항·후속 액션을 자세히 기록"
        />
      </div>
    </div>
  );
}

// DLG-M015 체성분 등록
function BodyCompositionRegisterDialog({ setDirty }: DialogBodyProps) {
  const [weight, setWeight] = useState("68.4");
  const [muscle, setMuscle] = useState("29.8");
  const [fat, setFat] = useState("21.4");
  const [height, setHeight] = useState("172");
  const bmi = (() => {
    const w = Number(weight);
    const h = Number(height) / 100;
    if (!w || !h) return "-";
    return (w / (h * h)).toFixed(1);
  })();
  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-surface-secondary p-3">
        <div className="text-xs text-content-tertiary mb-1">대상 회원</div>
        <b>김민준 · M0142</b>
        <span className="text-xs text-content-tertiary ml-2">
          트레이너 한트레이너
        </span>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">측정일 *</Label>
        <Input
          type="date"
          defaultValue="2026-05-29"
          onChange={() => setDirty(true)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs font-semibold mb-1.5 block">
            체중 (kg) *
          </Label>
          <Input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value);
              setDirty(true);
            }}
          />
        </div>
        <div>
          <Label className="text-xs font-semibold mb-1.5 block">키 (cm)</Label>
          <Input
            type="number"
            value={height}
            onChange={(e) => {
              setHeight(e.target.value);
              setDirty(true);
            }}
          />
          <p className="text-[10px] text-content-tertiary mt-1">
            키 미등록 시 BMI 미계산
          </p>
        </div>
        <div>
          <Label className="text-xs font-semibold mb-1.5 block">
            골격근량 (kg) *
          </Label>
          <Input
            type="number"
            step="0.1"
            value={muscle}
            onChange={(e) => {
              setMuscle(e.target.value);
              setDirty(true);
            }}
          />
        </div>
        <div>
          <Label className="text-xs font-semibold mb-1.5 block">
            체지방률 (%) *
          </Label>
          <Input
            type="number"
            step="0.1"
            value={fat}
            onChange={(e) => {
              setFat(e.target.value);
              setDirty(true);
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-lg border-2 border-primary/30 bg-primary-light p-2 text-center">
          <div className="text-primary">BMI 자동</div>
          <div className="font-bold mt-1 text-primary tabular-nums">{bmi}</div>
        </div>
        <div className="rounded-lg border p-2 text-center">
          <div className="text-content-tertiary">기초대사량</div>
          <div className="font-bold mt-1 tabular-nums">1,520 kcal</div>
        </div>
        <div className="rounded-lg border p-2 text-center">
          <div className="text-content-tertiary">체수분</div>
          <div className="font-bold mt-1 tabular-nums">42.6 L</div>
        </div>
      </div>
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
        <AlertTriangle size={13} className="inline mr-1.5" />
        InBody 자동 수집은 별도. 동일 일자 기록 있으면 덮어쓰기 확인 (DLG-M016).
      </div>
    </div>
  );
}

// DLG-S008 납입 처리 (미수금·할부)
function PaymentReceiveDialog({ setDirty }: DialogBodyProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-surface-secondary p-3">
        <div className="text-xs text-content-tertiary mb-1">납입 대상</div>
        <b>박서연 · 회원권 3개월</b>
        <div className="text-[10px] text-content-tertiary mt-1">
          미수금 120,000원 · 12일 경과
        </div>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          실수령 금액 (원) *
        </Label>
        <Input
          type="number"
          placeholder="120000"
          onChange={() => setDirty(true)}
        />
        <p className="text-[10px] text-content-tertiary mt-1">
          미수금 전액 또는 부분 납입 가능
        </p>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          결제 수단 *
        </Label>
        <Select onValueChange={() => setDirty(true)}>
          <SelectTrigger>
            <SelectValue placeholder="선택해주세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">현금</SelectItem>
            <SelectItem value="card">카드</SelectItem>
            <SelectItem value="transfer">계좌이체</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          납입 일시 *
        </Label>
        <Input
          type="datetime-local"
          defaultValue="2026-05-29T10:00"
          onChange={() => setDirty(true)}
        />
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          메모 (감사 로그)
        </Label>
        <Textarea
          rows={2}
          onChange={() => setDirty(true)}
          placeholder="회원 직접 방문 납입"
        />
      </div>
    </div>
  );
}

// DLG-S012 목표 매출 설정
function SalesTargetDialog({ setDirty }: DialogBodyProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">
        <b>목표 매출:</b> 지점별 월/분기 매출 목표를 설정하고 KPI 대시보드에서
        달성률을 추적합니다.
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs font-semibold mb-1.5 block">기간 *</Label>
          <Select defaultValue="month" onValueChange={() => setDirty(true)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">월별</SelectItem>
              <SelectItem value="quarter">분기별</SelectItem>
              <SelectItem value="year">연간</SelectItem>
              <SelectItem value="custom">사용자 지정</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-semibold mb-1.5 block">
            기준 유형 *
          </Label>
          <Select defaultValue="branch" onValueChange={() => setDirty(true)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="branch">지점별 일괄</SelectItem>
              <SelectItem value="staff">담당자별</SelectItem>
              <SelectItem value="product">상품별</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          대상 지점 *
        </Label>
        <Select defaultValue="강남점" onValueChange={() => setDirty(true)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전 지점 일괄</SelectItem>
            <SelectItem value="강남점">강남점</SelectItem>
            <SelectItem value="서초점">서초점</SelectItem>
            <SelectItem value="잠실점">잠실점</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          목표 금액 (원) *
        </Label>
        <Input
          type="number"
          placeholder="22000000"
          onChange={() => setDirty(true)}
        />
        <p className="text-[10px] text-content-tertiary mt-1">
          전월 실적: 18,420,000원 · 전년 동기: 16,380,000원
        </p>
      </div>
      <div className="rounded-lg border bg-surface-secondary p-3 text-xs text-content-secondary">
        <b>적용 후:</b> KPI 대시보드 매출 달성률 자동 계산 + 본사 자동 리포트에
        반영
      </div>
    </div>
  );
}

// DLG-092-001 신규 지점 등록 (사용자가 본 잘못된 케이스 fix)
function BranchCreateDialog({ setDirty }: DialogBodyProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs font-semibold mb-1.5 block">지점명 *</Label>
          <Input placeholder="예: 강남2호점" onChange={() => setDirty(true)} />
        </div>
        <div>
          <Label className="text-xs font-semibold mb-1.5 block">
            지점 코드 *
          </Label>
          <Input
            placeholder="예: GN02 (자동 생성 가능)"
            onChange={() => setDirty(true)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs font-semibold mb-1.5 block">
            대표 연락처 *
          </Label>
          <Input placeholder="010-XXXX-XXXX" onChange={() => setDirty(true)} />
        </div>
        <div>
          <Label className="text-xs font-semibold mb-1.5 block">
            운영 시작일 *
          </Label>
          <Input type="date" onChange={() => setDirty(true)} />
        </div>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">주소 *</Label>
        <div className="flex gap-1">
          <Input
            placeholder="주소 검색"
            className="flex-1"
            onChange={() => setDirty(true)}
          />
          <Button variant="outline" size="sm">
            검색
          </Button>
        </div>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          초기 Owner(지점장) 지정 *
        </Label>
        <Select onValueChange={() => setDirty(true)}>
          <SelectTrigger>
            <SelectValue placeholder="기존 직원 선택 또는 신규 초대" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="invite">신규 초대 (이메일)</SelectItem>
            <SelectItem value="existing-1">이센터 (강남점)</SelectItem>
            <SelectItem value="existing-2">박매니저 (강남점)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          수용 가능 회원 수 (선택)
        </Label>
        <Input
          type="number"
          placeholder="3000"
          onChange={() => setDirty(true)}
        />
      </div>
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">
        <b>안내:</b> 등록 완료 후 본사 표준 정책 세트가 자동 적용됩니다. 온보딩
        절차 (시설/직원/상품 초기 데이터)가 시작됩니다.
      </div>
    </div>
  );
}

// DLG-092-002 지점 비활성화 확인
function BranchDeactivateDialog({ setDirty }: DialogBodyProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-900">
        <AlertTriangle size={14} className="inline mr-1.5" />
        <b>
          지점 운영 상태를 변경합니다. 회원 이용·예약·신규 가입·앱 노출·직원
          접근 모두 영향받습니다.
        </b>
      </div>
      <div className="rounded-xl border bg-surface-secondary p-3">
        <div className="text-xs text-content-tertiary mb-1">대상 지점</div>
        <b>강남점 · GN01</b>
        <div className="text-[10px] text-content-tertiary mt-0.5">
          현재 운영 중 · 활성 회원 2,614명 · 진행 예약 42건
        </div>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          변경 후 상태 *
        </Label>
        <Select onValueChange={() => setDirty(true)}>
          <SelectTrigger>
            <SelectValue placeholder="선택해주세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paused">임시휴업 (운영 일시 정지)</SelectItem>
            <SelectItem value="closed">폐점 (영구 종료)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          적용 예정일 *
        </Label>
        <Input type="date" onChange={() => setDirty(true)} />
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">
          변경 사유 * (필수)
        </Label>
        <Textarea
          rows={2}
          onChange={() => setDirty(true)}
          placeholder="시설 리모델링, 임대차 종료, 운영 결정 등"
        />
      </div>
      <div className="rounded-lg border p-3 text-xs space-y-1">
        <div className="font-semibold mb-1">영향 범위:</div>
        <div>• 신규 가입·결제·예약 자동 차단</div>
        <div>• 회원앱 지점 노출 비표시</div>
        <div>• 직원 계정 접근 제한</div>
        <div>• 진행 예약 42건 자동 환불 또는 타지점 이관 안내</div>
      </div>
    </div>
  );
}

// Generic component-driven form — dialog.components 배열을 자동 렌더
function ComponentDrivenForm({ dialog, setDirty }: DialogBodyProps) {
  // components 배열에서 input 필드 자동 추론 + 액션 라벨 분리
  const sections = dialog.components.filter(
    (c) => !/^취소|^닫기|^확인|^등록$|^저장$|^적용$|^삭제$|^발송$/.test(c),
  );
  return (
    <div className="space-y-3">
      {sections.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center text-xs text-content-tertiary">
          {dialog.purpose}
        </div>
      ) : (
        sections.map((comp) => {
          const isRequired = /필수/.test(comp);
          const isTextarea = /사유|메모|설명|내용|코멘트/.test(comp);
          const isSelect = /선택|상태|구분|유형|등급|채널/.test(comp);
          const isDate = /일자|날짜|기간|시작일|종료일|일시/.test(comp);
          const isNumber = /금액|수량|회차|개수|수용/.test(comp);
          const label = comp.replace(/\s*[(*][^)]*[)*]\s*/g, "").trim();

          return (
            <div key={comp}>
              <Label className="text-xs font-semibold mb-1.5 block">
                {label}
                {isRequired && <span className="text-rose-600 ml-1">*</span>}
              </Label>
              {isTextarea ? (
                <Textarea
                  rows={2}
                  placeholder={`${label} 입력`}
                  onChange={() => setDirty(true)}
                />
              ) : isSelect ? (
                <Select onValueChange={() => setDirty(true)}>
                  <SelectTrigger>
                    <SelectValue placeholder={`${label} 선택`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option-a">옵션 A</SelectItem>
                    <SelectItem value="option-b">옵션 B</SelectItem>
                    <SelectItem value="option-c">옵션 C</SelectItem>
                  </SelectContent>
                </Select>
              ) : isDate ? (
                <Input type="date" onChange={() => setDirty(true)} />
              ) : isNumber ? (
                <Input
                  type="number"
                  placeholder="0"
                  onChange={() => setDirty(true)}
                />
              ) : (
                <Input
                  placeholder={`${label} 입력`}
                  onChange={() => setDirty(true)}
                />
              )}
            </div>
          );
        })
      )}
      {dialog.policyPending && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          <AlertTriangle size={13} className="inline mr-1.5" />
          <b>정책 확인 필요:</b> 본 DLG는 외부 연동·산식·승인 정책이 확정되지
          않아 mock 처리만 진행합니다.
        </div>
      )}
    </div>
  );
}

function SessionDialogBody({ setDirty, notify }: DialogBodyProps) {
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_300px]">
      <div className="rounded-2xl border bg-white p-5">
        <div className="flex items-center gap-3">
          <Lock className="size-5 text-blue-600" />
          <h3 className="font-semibold">세션 복구 플로우</h3>
        </div>
        <p className="mt-2 text-sm leading-6 text-content-secondary">
          현재 위치를 저장한 뒤 재로그인 화면으로 이동하고, 인증 완료 후 마지막
          업무 화면으로 복귀하는 D01 공통 다이얼로그입니다.
        </p>
        <div className="mt-4 grid gap-2 text-sm">
          <div className="flex justify-between rounded-lg bg-surface-secondary px-3 py-2">
            <span className="text-content-tertiary">만료 사유</span>
            <b>30분 이상 미활동</b>
          </div>
          <div className="flex justify-between rounded-lg bg-surface-secondary px-3 py-2">
            <span className="text-content-tertiary">복귀 URL</span>
            <b>/members 또는 직전 화면</b>
          </div>
          <div className="flex justify-between rounded-lg bg-surface-secondary px-3 py-2">
            <span className="text-content-tertiary">보안 정책</span>
            <b>토큰 폐기 + 재인증</b>
          </div>
        </div>
      </div>
      <div className="space-y-3 rounded-2xl border bg-surface-secondary p-4">
        <Label>재로그인 메모</Label>
        <Textarea
          defaultValue="세션 만료 후 원래 화면으로 돌아갑니다."
          onChange={() => setDirty(true)}
        />
        <Button
          className="w-full"
          onClick={() => notify("재로그인 화면 이동 mock", "info")}
        >
          재로그인 화면으로 이동
        </Button>
      </div>
    </div>
  );
}

function DestructiveDialogBody({ dialog, setDirty }: DialogBodyProps) {
  // 위험 액션 DLG: 사유 입력 + 영향 요약 + 확인 문구 일치 검증 + 감사 로그 명시
  const [reason, setReason] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const expectedToken = dialog.id; // 확인 문구는 DLG-ID 입력 시 일치
  const isReasonValid = reason.trim().length >= 5;
  const isConfirmValid = confirmText.trim() === expectedToken;
  const blockReason = !isReasonValid || !isConfirmValid;

  return (
    <div className="space-y-4" data-destructive-body>
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-900">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 size-5" />
          <div>
            <h3 className="font-semibold">
              복구가 어렵거나 운영 이력이 바뀌는 위험 액션입니다.
            </h3>
            <p className="mt-1 text-sm leading-6">
              삭제·탈퇴·병합·취소성 DLG는 대상·영향 범위·감사 로그 사유·확인
              문구 4단계로 보호합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {dialog.components.slice(0, 3).map((component, index) => (
          <div key={component} className="rounded-xl border bg-white p-3">
            <div className="text-xs font-semibold text-content-tertiary">
              확인 {index + 1}
            </div>
            <div className="mt-1 font-medium">{component}</div>
            <p className="mt-2 text-xs leading-5 text-content-tertiary">
              mock 대상:{" "}
              {index === 0
                ? "김민준 / S-260528-001"
                : index === 1
                  ? "연결 이력·미수·예약 영향"
                  : "권한자 재확인 필요"}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            처리 사유 · 감사 로그{" "}
            <Badge
              variant={isReasonValid ? "success" : "warning"}
              className="text-[10px]"
            >
              필수 5자+
            </Badge>
          </Label>
          <Textarea
            value={reason}
            placeholder={`${dialog.title} 사유를 5자 이상 입력`}
            onChange={(e) => {
              setReason(e.target.value);
              setDirty(true);
            }}
          />
          <p className="text-xs text-content-tertiary">
            사유는 감사 로그에 영구 기록됩니다. {reason.length}/500자
            {!isReasonValid && reason.length > 0 && (
              <span className="ml-2 text-rose-600 font-semibold">
                ⚠️ 5자 이상 필요
              </span>
            )}
          </p>
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            확인 문구 · {expectedToken} 입력{" "}
            <Badge
              variant={isConfirmValid ? "success" : "destructive"}
              className="text-[10px]"
            >
              {isConfirmValid ? "일치" : "불일치"}
            </Badge>
          </Label>
          <Input
            value={confirmText}
            placeholder={`정확히 "${expectedToken}" 입력`}
            onChange={(e) => {
              setConfirmText(e.target.value);
              setDirty(true);
            }}
            className={cn(
              confirmText.length > 0 &&
                !isConfirmValid &&
                "border-rose-400 bg-rose-50",
              isConfirmValid && "border-emerald-400 bg-emerald-50",
            )}
          />
          <p className="text-xs text-content-tertiary">
            오타 방지를 위해 위험 액션은 확인 문구 일치 검증이 필요합니다.
            {confirmText.length > 0 && !isConfirmValid && (
              <span className="ml-2 text-rose-600 font-semibold">
                ⚠️ &quot;{expectedToken}&quot; 정확히 입력
              </span>
            )}
          </p>
        </div>
      </div>

      {/* 차단 상태 안내 */}
      {blockReason && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          <Lock className="mr-2 inline size-3.5" />
          <b>아직 확인 처리 불가:</b> 사유 5자 이상 + 확인 문구 일치가 모두
          충족돼야 합니다.
        </div>
      )}
    </div>
  );
}

function PaymentDialogBody({ dialog, setDirty, contract }: DialogBodyProps) {
  // 결제·환불·할부 DLG: 원거래 + 금액 + 외부 연동 + 승인 상태 + 동적 입력
  const isRefund = /환불/.test(dialog.title);
  const isTax = /세금/.test(dialog.title);
  const isInstallment = /할부|납입|미수/.test(dialog.title);
  const totalLabel = isRefund
    ? "환불 예정액"
    : isTax
      ? "공급가액"
      : isInstallment
        ? "잔여/납입액"
        : "최종 결제액";
  const amountValue = isRefund
    ? "120,000원"
    : isTax
      ? "1,090,909원"
      : isInstallment
        ? "200,000원"
        : "1,200,000원";
  const taxValue = isRefund ? "-12,000원" : isTax ? "109,091원" : null;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-3">
          <div className="text-xs font-semibold text-content-tertiary">
            원거래
          </div>
          <div className="mt-1 text-base font-bold font-mono">S-260528-001</div>
        </div>
        <div className="rounded-xl border-2 border-primary/30 bg-primary-light p-3">
          <div className="text-xs font-semibold text-primary">{totalLabel}</div>
          <div
            className={cn(
              "mt-1 text-lg font-bold tabular-nums",
              isRefund ? "text-rose-600" : "text-primary",
            )}
          >
            {amountValue}
          </div>
          {taxValue && (
            <div className="text-[10px] text-content-tertiary mt-0.5">
              VAT {taxValue}
            </div>
          )}
        </div>
        <div
          className={cn(
            "rounded-xl border p-3",
            dialog.policyPending ? "border-amber-200 bg-amber-50" : "bg-white",
          )}
        >
          <div className="text-xs font-semibold text-content-tertiary">
            외부 연동
          </div>
          <div
            className={cn(
              "mt-1 text-base font-bold",
              dialog.policyPending && "text-amber-800",
            )}
          >
            {dialog.policyPending ? "정책 확인" : "mock"}
          </div>
        </div>
        <div
          className={cn(
            "rounded-xl border p-3",
            dialog.requiredPermission
              ? "border-violet-200 bg-violet-50"
              : "bg-white",
          )}
        >
          <div className="text-xs font-semibold text-content-tertiary">
            승인 상태
          </div>
          <div
            className={cn(
              "mt-1 text-base font-bold",
              dialog.requiredPermission && "text-violet-800",
            )}
          >
            {dialog.requiredPermission ? "권한 필요" : "조회"}
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">정산 입력</h3>
            <Badge
              variant={dialog.policyPending ? "warning" : "success"}
              className="text-[10px]"
            >
              {contract.handoffStatus}
            </Badge>
          </div>
          <DialogDynamicFields
            contract={contract}
            setDirty={setDirty}
            maxFields={4}
          />
        </div>
        <div className="rounded-2xl border bg-amber-50 p-4 text-sm text-amber-900">
          <h3 className="font-semibold flex items-center gap-1.5">
            <AlertTriangle size={14} /> 퍼블리싱 인수 포인트
          </h3>
          <ul className="mt-3 space-y-2 text-xs leading-5">
            <li>· 실제 카드/PG/세금계산서/환불 처리는 호출하지 않습니다.</li>
            <li>
              · 버튼은 contract key 기준으로 mock 동작만 표시합니다. 실제
              service/API 연결은 퍼블리싱 범위 밖입니다.
            </li>
            <li>· 정책 미확정 산식은 수기 입력/확인 필요 배지로 남깁니다.</li>
            {isRefund && (
              <li>
                · 환불은 원 결제 수단 동일 채널로만 처리 (현금/카드 분리).
              </li>
            )}
            {isTax && (
              <li>
                · 세금계산서 발행은 외부 e-tax 연동 필수 (퍼블리싱 범위 밖).
              </li>
            )}
            {isInstallment && <li>· 할부 회차별 알림 자동 발송 (V2 정책).</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

function SearchDialogBody({
  dialog,
  setDirty,
  notify,
  contract,
}: DialogBodyProps) {
  // 검색 DLG: 검색어 입력 + 결과 목록 + 단일 선택 + 비회원 처리
  const isAddress = /주소/.test(dialog.title);
  const [query, setQuery] = useState(
    isAddress ? "강남구 테헤란로" : "김민준 / 010",
  );
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const results = isAddress
    ? [
        {
          primary: "서울 강남구 테헤란로 152",
          secondary: "역삼동 강남파이낸스센터",
          postal: "06236",
        },
        {
          primary: "서울 강남구 테헤란로 211",
          secondary: "역삼동 한국타이어빌딩",
          postal: "06141",
        },
        {
          primary: "서울 강남구 테헤란로 305",
          secondary: "역삼동 BS타워",
          postal: "06151",
        },
      ]
    : [
        {
          primary: "김민준 · 010-1234-5678",
          secondary: "강남점 활성 · PT 20회",
          postal: "M0142",
        },
        {
          primary: "김민준(가족) · 010-0000-1111",
          secondary: "서초점 활성 · 회원권 6개월",
          postal: "M0287",
        },
        {
          primary: "비회원 현장 결제",
          secondary: "연락처 미확정 · 1회용",
          postal: "guest",
        },
      ];

  const filtered = results.filter((r) =>
    query.length < 2
      ? true
      : r.primary.includes(query) || r.secondary.includes(query),
  );

  return (
    <div className="grid gap-4 md:grid-cols-[320px_1fr]">
      <div className="space-y-3 rounded-2xl border bg-white p-4">
        <Label>{dialog.components[0] ?? "검색어"}</Label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-content-tertiary" />
          <Input
            className="pl-9"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setDirty(true);
              setSelectedIdx(null);
            }}
            placeholder={isAddress ? "도로명 또는 지번" : "이름 또는 연락처"}
          />
        </div>
        <DialogDynamicFields
          contract={contract}
          setDirty={setDirty}
          maxFields={2}
          skipFirst
        />
        <Button
          className="w-full"
          variant="secondary"
          onClick={() =>
            notify(
              `${dialog.title} 검색 mock 실행 — ${filtered.length}건`,
              "info",
            )
          }
        >
          <Search size={14} className="mr-1.5" /> 검색 mock
        </Button>
        {!isAddress && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setSelectedIdx(2);
              notify("비회원 현장 결제로 선택", "info");
            }}
          >
            비회원으로 진행
          </Button>
        )}
      </div>
      <div className="rounded-2xl border bg-surface-secondary p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">검색 결과</h3>
          <Badge variant="info">{filtered.length}건</Badge>
        </div>
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-white p-6 text-center text-sm text-content-tertiary">
              검색 결과가 없습니다. 다른 검색어를 시도해주세요.
            </div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={item.postal}
                type="button"
                onClick={() => {
                  setSelectedIdx(idx);
                  setDirty(true);
                  notify(`${item.primary} 선택 mock`, "info");
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border bg-white p-3 text-left text-sm transition",
                  selectedIdx === idx
                    ? "border-primary ring-2 ring-primary/20 bg-primary-light"
                    : "hover:border-primary/30",
                )}
              >
                <div className="min-w-0">
                  <div className="font-semibold truncate">{item.primary}</div>
                  <div className="text-xs text-content-tertiary mt-0.5 truncate">
                    {item.secondary}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-[10px] text-content-tertiary">
                    {item.postal}
                  </span>
                  <Badge
                    variant={selectedIdx === idx ? "default" : "outline"}
                    className="text-[10px]"
                  >
                    {selectedIdx === idx ? "선택됨" : "선택"}
                  </Badge>
                </div>
              </button>
            ))
          )}
        </div>
        {selectedIdx !== null && (
          <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-900">
            <CheckCircle2 size={12} className="inline mr-1.5" />
            <b>{filtered[selectedIdx]?.primary}</b> 선택됨 — 확인 버튼 클릭 시
            호출 화면에 전달됩니다.
          </div>
        )}
      </div>
    </div>
  );
}

function BulkDialogBody({ dialog, setDirty, contract }: DialogBodyProps) {
  // 일괄 DLG: 대상 N + 처리 가능 N + 충돌/제외 N + 실행 전 체크 + 사유
  const [excludeShown, setExcludeShown] = useState(false);
  const totalCount = 128;
  const conflictCount = 12;
  const validCount = totalCount - conflictCount;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-3">
          <div className="text-xs font-semibold text-content-tertiary">
            대상 총계
          </div>
          <div className="mt-1 text-lg font-bold tabular-nums">
            {totalCount}건
          </div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
          <div className="text-xs font-semibold text-emerald-700">
            처리 가능
          </div>
          <div className="mt-1 text-lg font-bold text-emerald-700 tabular-nums">
            {validCount}건
          </div>
        </div>
        <button
          className={cn(
            "rounded-xl border p-3 text-left transition",
            excludeShown
              ? "border-amber-300 bg-amber-100"
              : "border-amber-200 bg-amber-50 hover:border-amber-300",
          )}
          onClick={() => setExcludeShown(!excludeShown)}
        >
          <div className="text-xs font-semibold text-amber-800">
            충돌·제외 {excludeShown ? "▼" : "▶"}
          </div>
          <div className="mt-1 text-lg font-bold text-amber-800 tabular-nums">
            {conflictCount}건
          </div>
        </button>
        <div className="rounded-xl border bg-white p-3">
          <div className="text-xs font-semibold text-content-tertiary">
            실행 방식
          </div>
          <div className="mt-1 text-lg font-bold">mock</div>
        </div>
      </div>

      {excludeShown && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs">
          <b className="text-amber-800">
            충돌·제외 {conflictCount}건 사유 (mock)
          </b>
          <ul className="mt-2 space-y-1 text-amber-900">
            <li>• 미수금 보유 회원 5건 — 잔액 정리 후 재시도</li>
            <li>• 이미 처리 완료 4건 — 중복 방지로 자동 제외</li>
            <li>• 권한 부족 3건 — 본사 승인 필요</li>
          </ul>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-2xl border bg-white p-4">
          <h3 className="font-semibold">일괄 처리 미리보기 (TOP 3 샘플)</h3>
          <Table className="mt-3">
            <TableHeader>
              <TableRow>
                <TableHead>대상</TableHead>
                <TableHead>변경 전</TableHead>
                <TableHead>변경 후</TableHead>
                <TableHead className="w-20 text-center">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {["강남점", "서초점", "잠실점"].map((branch, index) => (
                <TableRow key={branch}>
                  <TableCell className="text-xs">{branch}</TableCell>
                  <TableCell className="text-xs text-content-tertiary">
                    기존 설정
                  </TableCell>
                  <TableCell className="text-xs font-semibold">
                    {dialog.title}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={index === 2 ? "warning" : "success"}
                      className="text-[10px]"
                    >
                      {index === 2 ? "충돌 확인" : "가능"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="mt-3 text-[10px] text-content-tertiary">
            전체 {validCount}건 처리 가능 · 실행 후 비동기 진행 표시
          </p>
        </div>
        <div className="space-y-3 rounded-2xl border bg-violet-50 p-4">
          <h3 className="font-semibold text-violet-900">실행 전 체크</h3>
          {contract.fields.slice(0, 4).map((field) => (
            <label
              key={field.name}
              className="flex items-center gap-2 rounded-lg bg-white/70 p-2 text-sm"
            >
              <input type="checkbox" onChange={() => setDirty(true)} />{" "}
              {field.label} 확인
            </label>
          ))}
          <div>
            <Label className="text-xs">처리 사유 (감사 로그)</Label>
            <Textarea
              defaultValue="일괄 처리 사유"
              onChange={() => setDirty(true)}
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusDialogBody({ dialog, setDirty, contract }: DialogBodyProps) {
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_300px]">
      <div className="rounded-2xl border bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">상태 전환 / 운영 입력</h3>
          <Badge variant="success">필수값 표시</Badge>
        </div>
        <DialogDynamicFields contract={contract} setDirty={setDirty} />
      </div>
      <div className="rounded-2xl border bg-emerald-50 p-4 text-sm text-emerald-900">
        <h3 className="font-semibold">처리 후 화면 반영</h3>
        <div className="mt-3 space-y-2">
          {[
            "목록 상태 배지 변경",
            "상세 이력 타임라인 추가",
            "권한/정책 toast 표시",
            "감사 로그 payload 준비",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 rounded-lg bg-white/70 p-2"
            >
              <CheckCircle2 className="size-4" />
              {item}
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg bg-white/70 p-2 text-xs leading-5">
          {dialog.purpose}
        </div>
      </div>
    </div>
  );
}

function DialogDynamicFields({
  contract,
  setDirty,
  maxFields,
  skipFirst = false,
}: {
  contract: NonNullable<ReturnType<typeof getDialogContract>>;
  setDirty: (dirty: boolean) => void;
  maxFields?: number;
  skipFirst?: boolean;
}) {
  const fields = contract.fields.slice(
    skipFirst ? 1 : 0,
    maxFields ? (skipFirst ? maxFields + 1 : maxFields) : undefined,
  );
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {fields.map((field, index) => (
        <div
          key={field.name}
          className={cn(
            "space-y-1",
            field.type === "textarea" && "sm:col-span-2",
          )}
        >
          <Label className="flex items-center gap-2">
            {field.label}
            {field.required && <Badge variant="outline">필수</Badge>}
          </Label>
          {field.type === "textarea" ? (
            <Textarea
              defaultValue={`${field.label} mock 입력`}
              onChange={() => setDirty(true)}
            />
          ) : field.type === "select" ? (
            <Select
              defaultValue="option-a"
              onValueChange={() => setDirty(true)}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option-a">기본 상태</SelectItem>
                <SelectItem value="option-b">변경 상태</SelectItem>
                <SelectItem value="option-c">정책 확인 필요</SelectItem>
              </SelectContent>
            </Select>
          ) : field.type === "checkbox" ? (
            <label className="flex h-10 items-center gap-2 rounded-md border bg-white px-3 text-sm">
              <input type="checkbox" onChange={() => setDirty(true)} />{" "}
              {field.validation}
            </label>
          ) : (
            <Input
              type={
                field.type === "number"
                  ? "number"
                  : field.type === "date"
                    ? "date"
                    : "text"
              }
              defaultValue={
                field.type === "date"
                  ? "2026-05-28"
                  : field.type === "number"
                    ? `${(index + 1) * 10}`
                    : `${field.label} mock`
              }
              onChange={() => setDirty(true)}
            />
          )}
          <p className="text-xs text-content-tertiary">{field.validation}</p>
        </div>
      ))}
    </div>
  );
}

function RoleSelect({
  role,
  setRole,
  compact = false,
}: {
  role: RoleId;
  setRole: (role: RoleId) => void;
  compact?: boolean;
}) {
  return (
    <Select value={role} onValueChange={(value) => setRole(value as RoleId)}>
      <SelectTrigger className={compact ? "w-40 bg-white" : "w-full"}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {roles.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function BranchSelect({
  branch,
  setBranch,
  compact = false,
}: {
  branch: string;
  setBranch: (branch: string) => void;
  compact?: boolean;
}) {
  return (
    <Select value={branch} onValueChange={setBranch}>
      <SelectTrigger
        data-testid={compact ? "global-branch-trigger" : undefined}
        className={
          compact
            ? "h-8 w-32 border-0 bg-transparent px-0 py-0 shadow-none focus:ring-0 focus:ring-offset-0 data-[state=open]:bg-transparent"
            : "w-full"
        }
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {branches.map((item) => (
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function CheckLine({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className="size-4 text-emerald-600" />
      {label}
    </div>
  );
}

function MockActionPanel({
  panel,
  onClose,
  onOpenDialog,
}: {
  panel: MockActionPanelState;
  onClose: () => void;
  onOpenDialog: (id: string) => void;
}) {
  if (!panel) return null;
  const toneLabel =
    panel.tone === "success"
      ? "상태 반영"
      : panel.tone === "info"
        ? "화면 연결"
        : "검수 필요";
  const normalizedMessage = panel.message.replace(/\s*mock\s*/gi, " ").trim();
  const relatedDialog = panel.dialogIds
    .map((dialogId) => dialogById.get(dialogId))
    .find(Boolean);
  return (
    <AdminSlidePanel
      open
      onClose={onClose}
      eyebrow={`${panel.screenId} · ${toneLabel}`}
      title={normalizedMessage || panel.message}
      size="md"
      testId="mock-action-panel"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
          {relatedDialog ? (
            <Button
              onClick={() => {
                onClose();
                onOpenDialog(relatedDialog.id);
              }}
            >
              연결 DLG 보기
            </Button>
          ) : (
            <Button onClick={onClose}>상태 확인</Button>
          )}
        </>
      }
    >
      <div className="space-y-4">
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">화면 연결 결과</CardTitle>
            <CardDescription>
              toast 문구만 남기지 않고 현재 액션이 어느 화면·문서·local state로
              이어지는지 사이드패널에서 확인합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-xs">
            {[
              ["화면", `${panel.screenTitle} (${panel.screenId})`],
              ["라우트", panel.route],
              ["역할", panel.roleLabel],
              ["지점", panel.branch],
              ["문서", panel.source],
              ["시각", panel.timestamp],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-line bg-white p-3"
              >
                <p className="font-bold text-content-tertiary">{label}</p>
                <p className="mt-1 break-words font-semibold text-content">
                  {value}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">퍼블리싱 핸드오프</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-content-secondary">
            <p>
              실제 API 호출은 없고, 개발사가 연결해야 할 버튼·필터·상세·내보내기
              액션의 화면 반응을 mock/local state로 보여주는 기준입니다.
            </p>
            <div className="rounded-xl bg-primary-light/40 p-3 text-xs font-semibold text-primary">
              구현 연결점: {panel.screenId}.interaction.
              {normalizedMessage || panel.message}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminSlidePanel>
  );
}

function Toast({ toast }: { toast: ToastState }) {
  if (!toast) return null;
  return (
    <div
      className={cn(
        "fixed right-5 bottom-5 z-50 rounded-xl border px-4 py-3 text-sm shadow-lg",
        toast.tone === "success" &&
          "border-emerald-200 bg-emerald-50 text-emerald-800",
        toast.tone === "warning" &&
          "border-amber-200 bg-amber-50 text-amber-800",
        toast.tone === "info" && "border-blue-200 bg-blue-50 text-blue-800",
      )}
    >
      <ClipboardCheck className="mr-2 inline size-4" />
      {toast.message}
    </div>
  );
}

// ===== D04~D11 specialized 화면 컴포넌트 (admin-pando 시각 패턴 차용) =====

function FrontStateNote(props: { screen: ScreenDefinition }) {
  void props;
  return null;
}

function MetricGrid({
  metrics,
  onSelect,
  active,
}: {
  metrics: ScreenDefinition["metrics"];
  onSelect?: (label: string) => void;
  active?: string | null;
}) {
  return (
    <section className="grid grid-cols-4 gap-3">
      {metrics.slice(0, 4).map((metric) => (
        <button
          key={metric.label}
          type="button"
          onClick={() => onSelect?.(metric.label)}
          className="text-left"
        >
          <Card
            className={cn(
              "h-full shadow-none",
              active === metric.label && "ring-2 ring-blue-300",
            )}
          >
            <CardHeader className="pb-2">
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-xl">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-content-tertiary">{metric.hint}</p>
            </CardContent>
          </Card>
        </button>
      ))}
    </section>
  );
}

function FilterChips({
  filters,
  notify,
}: {
  filters: string[];
  notify: Notify;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter}
          type="button"
          variant="outline"
          size="sm"
          onClick={() => notify(`${filter} chip 적용`, "info")}
        >
          {filter}
        </Button>
      ))}
    </div>
  );
}

function PrimaryActionRow({
  screen,
  role,
  openDialog,
  notify,
}: {
  screen: ScreenDefinition;
  role: RoleId;
  openDialog: (id: string) => void;
  notify: Notify;
}) {
  const roleInfo = roleById.get(role)!;
  const router = useRouter();
  const routeForAction = (label: string) => {
    if (label.includes("회원 상세")) return "/members/detail";
    if (label.includes("수업 상세")) return "/lessons";
    if (label.includes("상품구매") || label.includes("결제"))
      return "/sales/payment";
    if (label.includes("체성분")) return "/body-composition";
    if (label.includes("메시지")) return "/message";
    return null;
  };
  return (
    <div className="flex flex-wrap gap-2">
      {screen.primaryActions.map((action) => {
        const allowed = hasPermission(role, action.permission);
        return (
          <Button
            key={action.label}
            data-dialog-id={action.dialogId}
            variant={
              action.danger ? "destructive" : allowed ? "default" : "outline"
            }
            data-blocked={!allowed}
            size="sm"
            className="h-auto min-h-8 min-w-0 max-w-full whitespace-normal py-2 text-left leading-snug"
            onClick={() => {
              if (!allowed) {
                notify(
                  `${action.label}: ${roleInfo.label} 권한으로는 실행할 수 없습니다.`,
                  "warning",
                );
                return;
              }
              if (action.dialogId) openDialog(action.dialogId);
              else {
                const route = routeForAction(action.label);
                if (route) {
                  router.push(`${route}?from=${screen.id}`);
                  return;
                }
                notify(`${action.label} 완료`, "success");
              }
            }}
          >
            {!allowed && <Lock className="size-3.5" />} {action.label}
          </Button>
        );
      })}
    </div>
  );
}


// ---- D03 매출관리 보강 ----

type SalesOperationConfig = {
  flow: string[];
  policy: string[];
  result: string;
  routes: { label: string; href: string }[];
  queue: { title: string; amount: string; status: string; action: string; dialogId?: string }[];
};

const salesOperationConfigs: Record<string, SalesOperationConfig> = {
  "SCR-S005": {
    flow: [
      "집계 항목과 실행 상태 확인",
      "오류/정책 보류 행 선택",
      "환불 차감·미수 회수·선수익 인식 기준 검토",
      "DLG-S012에서 목표/기준값을 조정",
      "집계 재실행은 mock/local state 결과로만 표시",
    ],
    policy: [
      "환불 차감 산식은 정책 확인 전 임의 확정 금지",
      "04:00 일별 집계 기준과 수동 재집계 결과를 분리",
      "지점별 귀속/정산/인센티브 기준은 매출 원장과 일치해야 함",
      "통계 기준 변경은 화면 결과와 감사 로그에 남김",
    ],
    result:
      "집계 성공 98.7% · 오류 3건 · 정책 보류 5건 · 목표 기준 DLG-S012 확인 필요",
    routes: [
      { label: "매출 통계", href: "/sales/stats" },
      { label: "매출 현황", href: "/sales" },
    ],
    queue: [
      { title: "환불 차감 산식", amount: "정책 보류 5건", status: "검토", action: "목표 기준 설정", dialogId: "DLG-S012" },
      { title: "미수 회수 집계", amount: "오류 2건", status: "오류", action: "재집계 mock" },
      { title: "선수익 월 배치", amount: "06:00 완료", status: "정상", action: "원장 이동" },
    ],
  },
  "SCR-S011": {
    flow: [
      "예측 기간과 목표 기준 선택",
      "매출/목표/달성률 행 확인",
      "낙관·기본·보수 시나리오 비교",
      "DLG-S012에서 월 목표 조정",
      "예측 산식은 mock으로 표시하고 확정값처럼 쓰지 않음",
    ],
    policy: [
      "예측 산식은 정책 보류이며 실제 정산 기준 아님",
      "목표 대비 달성률은 현재 필터의 결제완료 기준",
      "환불/미수/선수익 영향은 별도 화면 근거를 연결",
      "HQ는 전 지점, 지점 역할은 소속 지점 예측만 표시",
    ],
    result:
      "다음 달 예측 42,000,000원 · 목표 달성률 82% · DLG-S012 목표 조정 가능",
    routes: [
      { label: "목표/KPI", href: "/kpi" },
      { label: "매출 통계", href: "/sales/stats" },
    ],
    queue: [
      { title: "다음 달 보수 시나리오", amount: "38,000,000원", status: "주의", action: "목표 매출 설정", dialogId: "DLG-S012" },
      { title: "재등록 매출 민감도", amount: "+6.5%", status: "관찰", action: "통계 연결" },
      { title: "미수 회수 반영", amount: "1,120,000원", status: "분리", action: "미수 원장 이동" },
    ],
  },
};

function getSalesConfig(screen: ScreenDefinition): SalesOperationConfig {
  return (
    salesOperationConfigs[screen.id] ?? {
      flow: ["행 선택", "정책 확인", "DLG/액션 실행", "결과 상태 확인"],
      policy: ["mock/local state만 수행", "권한별 버튼 노출", "결과는 화면에 남김"],
      result: `${screen.title} mock 운영 결과 대기`,
      routes: [{ label: "매출 현황", href: "/sales" }],
      queue: [],
    }
  );
}

function SalesOperationsScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  const config = getSalesConfig(screen);
  const [tab, setTab] = useState(screen.tabs[0] ?? "전체");
  const [selectedRow, setSelectedRow] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [lastFilter, setLastFilter] = useState("없음");
  const [search, setSearch] = useState("");
  const [operationResult, setOperationResult] = useState(config.result);
  const [detailOpen, setDetailOpen] = useState(true);
  const selected = screen.rows[selectedRow] ?? screen.rows[0] ?? {};
  const allowed = ["HQ_ADMIN", "OWNER", "MANAGER", "FC", "STAFF"].includes(role);
  const visibleRows = screen.rows.filter((row) => {
    if (!search.trim()) return true;
    return Object.values(row).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase()),
    );
  });
  const selectedTitle =
    String(
      selected["집계 항목"] ??
        selected["월"] ??
        selected["분석 항목명"] ??
        selected["회원명"] ??
        screen.title,
    ) || screen.title;

  const applyFilter = (filter: string) => {
    setLastFilter(filter);
    setDetailOpen(true);
    setOperationResult(
      `${filter} 기준으로 ${screen.title} 결과를 local state에서 재정렬했습니다.`,
    );
  };

  const runAction = (label: string, dialogId?: string) => {
    if (!allowed) {
      notify(`${label}: 현재 역할로는 매출 처리를 실행할 수 없습니다.`, "warning");
      return;
    }
    setLastFilter(label);
    setDetailOpen(true);
    setOperationResult(
      `${label.replace(/\s*\([^)]*\)/g, "")} 준비 완료 · ${selectedTitle} · API 호출 없이 mock/local state만 갱신`,
    );
    if (dialogId) openDialog(dialogId);
    else notify(`${label} mock/local state 반영`, "info");
  };

  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="매출 운영 플로우 강화"
      />
      <MetricGrid
        metrics={screen.metrics}
        active={selectedMetric}
        onSelect={(label) => {
          setSelectedMetric(label);
          setOperationResult(`${label} 지표 기준으로 매출 운영 큐를 재검토합니다.`);
        }}
      />
      <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>{screen.title} 작업대</CardTitle>
              <CardDescription>{screen.purpose}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {screen.tabs.map((item) => (
                  <Button
                    key={item}
                    size="sm"
                    variant={tab === item ? "default" : "outline"}
                    onClick={() => {
                      setTab(item);
                      setOperationResult(`${item} 탭으로 매출 작업대를 전환했습니다.`);
                    }}
                  >
                    {item}
                  </Button>
                ))}
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="항목·회원·월 검색"
                  className="ml-auto h-9 w-56"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {screen.filters.map((filter) => (
                  <Button
                    key={filter}
                    type="button"
                    size="sm"
                    variant={lastFilter === filter ? "default" : "outline"}
                    onClick={() => applyFilter(filter)}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
              <div
                data-testid={`${screen.id.toLowerCase()}-active-state`}
                className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800"
              >
                선택 기준: {tab} · 적용 필터: {lastFilter} · 선택 항목: {selectedTitle}
              </div>
              <div className="grid gap-2 md:grid-cols-5">
                {config.flow.map((step, index) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() =>
                      setOperationResult(`Step ${index + 1}: ${step} 상태를 매출 패널에 반영했습니다.`)
                    }
                    className="rounded-xl border border-line bg-surface-secondary p-3 text-left text-xs text-content-secondary transition hover:border-primary hover:text-primary"
                  >
                    <b className="mb-1 block text-content">Step {index + 1}</b>
                    {step}
                  </button>
                ))}
              </div>
              <div className="overflow-x-auto rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {screen.tableColumns.map((c) => (
                        <TableHead key={c} className="whitespace-nowrap">
                          {c}
                        </TableHead>
                      ))}
                      <TableHead>운영 액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleRows.map((row, index) => (
                      <TableRow
                        key={index}
                        className={cn("cursor-pointer", selectedRow === index && "bg-emerald-50")}
                        onClick={() => {
                          setSelectedRow(index);
                          setDetailOpen(true);
                          setOperationResult(
                            `${String(row[screen.tableColumns[0]] ?? screen.title)} 행을 선택했습니다. 우측 정책과 결과를 확인하세요.`,
                          );
                        }}
                      >
                        {screen.tableColumns.map((c) => (
                          <TableCell key={c} className="whitespace-nowrap text-xs">
                            {statusAwareValue(String(row[c] ?? "-"))}
                          </TableCell>
                        ))}
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(event) => {
                              event.stopPropagation();
                              runAction(
                                screen.primaryActions[0]?.label ?? "상세 보기",
                                screen.primaryActions[0]?.dialogId,
                              );
                            }}
                          >
                            처리
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>단계별 액션</CardTitle>
              <CardDescription>
                버튼은 실제 API 없이 DLG/local state/route/side panel 상태로 동작합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {screen.primaryActions.map((action) => (
                <Button
                  key={action.label}
                  size="sm"
                  variant={action.danger ? "destructive" : action.dialogId ? "default" : "outline"}
                  data-dialog-id={action.dialogId}
                  onClick={() => runAction(action.label, action.dialogId)}
                >
                  {action.label}
                  {action.policyPending && <Badge variant="warning">정책</Badge>}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
        <aside className="min-w-0 space-y-4">
          {detailOpen && (
            <Card
              className="shadow-none"
              data-testid={`${screen.id.toLowerCase()}-row-detail-panel`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>선택 매출 운영 패널</CardTitle>
                    <CardDescription>정책·결과·연결 화면을 본문을 가리지 않고 확인합니다.</CardDescription>
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label="닫기"
                    onClick={() => setDetailOpen(false)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <InfoCell label="선택" value={selectedTitle} />
                <InfoCell label="화면" value={`${screen.id} · ${screen.title}`} />
                <InfoCell label="지점/역할" value={`${branch} · ${roleById.get(role)?.label ?? role}`} />
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
                  {operationResult}
                </div>
              </CardContent>
            </Card>
          )}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>검토 큐</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {config.queue.map((item) => (
                <div key={item.title} className="rounded-xl border border-line bg-white p-3 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <b>{item.title}</b>
                      <p className="mt-0.5 text-xs text-content-secondary">{item.amount}</p>
                    </div>
                    <Badge variant={item.status === "오류" ? "destructive" : item.status === "정상" ? "success" : "warning"}>
                      {item.status}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full"
                    data-dialog-id={item.dialogId}
                    onClick={() => runAction(item.action, item.dialogId)}
                  >
                    {item.action}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>정책 체크</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-content-secondary">
              {config.policy.map((item) => (
                <div key={item} className="flex gap-2 rounded-lg border border-line bg-white p-2">
                  <CheckCircle2 className="mt-0.5 size-3.5 text-emerald-600" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>연결 화면</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {config.routes.map((route) => (
                <Button key={route.href} asChild variant="outline" className="w-full">
                  <Link href={route.href}>{route.label}</Link>
                </Button>
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

// ---- D04 수업관리 ----

function ClassCalendarScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  // admin-pando calendar/page.tsx 구조 1:1 이식
  const [activeTab, setActiveTab] = useState<
    "schedule" | "lessons" | "counts" | "penalty" | "valid"
  >("schedule");
  const [view, setView] = useState<"월" | "주" | "일" | "목록">("월");
  const [instructor, setInstructor] = useState<string>("");
  const [lessonFilter, setLessonFilter] = useState<string>("");
  const [capacityFilter, setCapacityFilter] = useState<
    "전체" | "여유" | "마감"
  >("전체");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(29);

  // admin-pando 색상 매핑 (docs4 분류와 동일)
  const SCHEDULE_CATEGORIES = [
    "상담",
    "OT",
    "체성분",
    "방문",
    "수업",
    "PT",
    "기타",
  ];
  const SCHEDULE_COLORS: Record<string, string> = {
    방문: "#3B82F6",
    OT: "#10B981",
    상담: "#F59E0B",
    체성분: "#8B5CF6",
    수업: "#EF4444",
    PT: "#F97316",
    기타: "#6B7280",
  };

  const instructors = [
    { id: "1", name: "박트레이너", type: "PT", color: "#fb7185" },
    { id: "2", name: "정GX", type: "GX", color: "#a78bfa" },
    { id: "3", name: "김프로", type: "골프", color: "#38bdf8" },
    { id: "4", name: "박GX", type: "스피닝", color: "#fbbf24" },
    { id: "5", name: "최트레이너", type: "PT", color: "#34d399" },
  ];

  // 월간 캘린더 - 5월 2026 (목요일 시작)
  const calendarDays: {
    day: number;
    isCurrentMonth: boolean;
    events: {
      title: string;
      instructor: string;
      type: string;
      category: string;
      color: string;
    }[];
  }[] = [];
  // 이전 달
  for (let d = 26; d <= 30; d++)
    calendarDays.push({ day: d, isCurrentMonth: false, events: [] });
  // 이번 달
  for (let d = 1; d <= 31; d++) {
    const events: {
      title: string;
      instructor: string;
      type: string;
      category: string;
      color: string;
    }[] = [];
    if (d % 5 === 1)
      events.push({
        title: "요가 모닝",
        instructor: "정GX",
        type: "GX",
        category: "수업",
        color: SCHEDULE_COLORS["수업"],
      });
    if (d % 4 === 2)
      events.push({
        title: "PT 김민준",
        instructor: "박트레이너",
        type: "PT",
        category: "PT",
        color: SCHEDULE_COLORS["PT"],
      });
    if (d % 7 === 3)
      events.push({
        title: "OT 박서연",
        instructor: "최트레이너",
        type: "PT",
        category: "OT",
        color: SCHEDULE_COLORS["OT"],
      });
    if (d === 29)
      events.push({
        title: "필라테스 그룹",
        instructor: "정GX",
        type: "GX",
        category: "수업",
        color: SCHEDULE_COLORS["수업"],
      });
    calendarDays.push({ day: d, isCurrentMonth: true, events });
  }
  // 다음 달
  for (let d = 1; d <= 6; d++)
    calendarDays.push({ day: d, isCurrentMonth: false, events: [] });

  const tabs = [
    { key: "schedule", label: "일정표", count: null },
    { key: "lessons", label: "수업 관리", count: 760 },
    { key: "counts", label: "횟수 관리", count: null },
    { key: "penalty", label: "페널티 관리", count: 0 },
    { key: "valid", label: "유효 수업 목록", count: null },
  ] as const;

  const pendingCount = 5;
  const selectedDayEvents =
    calendarDays.find((d) => d.day === selectedDate && d.isCurrentMonth)
      ?.events || [];

  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="수업 캘린더 (admin-pando 구조)"
      />

      {/* PageHeader — admin-pando 1:1 */}
      <div className="flex items-end justify-between border-b border-line/60 pb-4">
        <div>
          <h1 className="text-[24px] font-black tracking-tight text-content">
            수업/캘린더
          </h1>
          <p className="mt-1 text-[13px] text-content-secondary">
            PT 및 그룹 수업 스케줄을 관리하고 회원의 예약 현황을 확인합니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => notify("스케줄 일괄 변경 mock", "info")}
          >
            스케줄 일괄 변경
          </Button>
          <Button size="sm" onClick={() => openDialog("DLG-C001")}>
            + 수업 등록
          </Button>
        </div>
      </div>

      {/* TabNav — admin-pando 1:1 (5 탭) */}
      <div className="flex gap-6 border-b border-line">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "relative flex items-center gap-1.5 pb-2.5 text-[13px] font-medium transition-colors",
              activeTab === tab.key
                ? "text-primary"
                : "text-content-secondary hover:text-content",
            )}
          >
            {tab.label}
            {tab.count !== null && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-px text-[10px] font-bold tabular-nums",
                  activeTab === tab.key
                    ? "bg-primary text-white"
                    : "bg-surface-tertiary text-content-secondary",
                )}
              >
                {tab.count}
              </span>
            )}
            {activeTab === tab.key && (
              <div className="absolute -bottom-px left-0 right-0 h-0.5 rounded-t-full bg-primary" />
            )}
          </button>
        ))}
      </div>

      {activeTab === "schedule" && (
        <div className="space-y-4">
          {/* 미승인 일정 배너 — admin-pando 1:1 */}
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <AlertTriangle size={15} className="shrink-0 text-amber-600" />
              <span className="text-[13px] font-semibold text-amber-700">
                미승인 일정 <span className="font-bold">{pendingCount}건</span>
                이 있습니다.
              </span>
              <Button
                size="sm"
                variant="outline"
                className="ml-auto border-amber-300 text-amber-700"
                onClick={() => openDialog("DLG-C003")}
              >
                승인 검토
              </Button>
            </div>
          )}

          {/* 필터 바 — admin-pando 1:1 */}
          <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-3 shadow-xs">
            {/* 1행: 강사/수업명/정원 */}
            <div className="flex flex-wrap items-center gap-3">
              <Select value={instructor} onValueChange={setInstructor}>
                <SelectTrigger className="w-40 h-9">
                  <SelectValue placeholder="전체 강사" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 강사</SelectItem>
                  {instructors.map((i) => (
                    <SelectItem key={i.id} value={i.id}>
                      {i.name} ({i.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={lessonFilter} onValueChange={setLessonFilter}>
                <SelectTrigger className="w-40 h-9">
                  <SelectValue placeholder="전체 수업" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 수업</SelectItem>
                  <SelectItem value="yoga">요가 모닝</SelectItem>
                  <SelectItem value="pilates">필라테스 그룹</SelectItem>
                  <SelectItem value="pt">PT 개인레슨</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1">
                {(["전체", "여유", "마감"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setCapacityFilter(opt)}
                    className={cn(
                      "h-9 rounded-lg border px-3 text-[12px] font-semibold transition-colors",
                      capacityFilter === opt
                        ? "bg-primary text-white border-primary"
                        : "bg-surface-secondary text-content-secondary border-line hover:border-primary hover:text-primary",
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 2행: 카테고리 칩 — admin-pando 색상 1:1 */}
            <div className="flex flex-wrap items-center gap-1.5 border-t border-line pt-2">
              <span className="text-[12px] font-semibold text-content-secondary mr-1">
                분류
              </span>
              <button
                type="button"
                onClick={() => setSelectedCategories([])}
                className={cn(
                  "h-7 rounded-full border px-2.5 text-[11px] font-semibold transition-colors",
                  selectedCategories.length === 0
                    ? "bg-primary text-white border-primary"
                    : "bg-surface-secondary text-content-secondary border-line hover:border-primary hover:text-primary",
                )}
              >
                전체
              </button>
              {SCHEDULE_CATEGORIES.map((cat) => {
                const color = SCHEDULE_COLORS[cat];
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() =>
                      setSelectedCategories((prev) =>
                        isSelected
                          ? prev.filter((c) => c !== cat)
                          : [...prev, cat],
                      )
                    }
                    className="h-7 rounded-full border px-2.5 text-[11px] font-semibold transition-all"
                    style={
                      isSelected
                        ? {
                            backgroundColor: color,
                            color: "#fff",
                            borderColor: color,
                          }
                        : {
                            backgroundColor: color + "15",
                            color,
                            borderColor: color + "40",
                          }
                    }
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* 3행: 범례 — 강사/유형/분류 — admin-pando 1:1 */}
            <div className="flex flex-wrap items-center gap-4 border-t border-line pt-2">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold text-content-secondary">
                  강사
                </span>
                {instructors.slice(0, 4).map((i) => (
                  <div key={i.id} className="flex items-center gap-1">
                    <div
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: i.color }}
                    />
                    <span className="text-[11px] text-content-secondary">
                      {i.name}
                    </span>
                  </div>
                ))}
              </div>
              <div className="h-4 w-px bg-line" />
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold text-content-secondary">
                  유형
                </span>
                {[
                  { label: "PT", color: "#3b82f6" },
                  { label: "GX", color: "#0ea5e9" },
                  { label: "개인레슨", color: "#22c55e" },
                ].map((t) => (
                  <div key={t.label} className="flex items-center gap-1">
                    <div
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: t.color }}
                    />
                    <span className="text-[11px] text-content-secondary">
                      {t.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="h-4 w-px bg-line" />
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[12px] font-semibold text-content-secondary">
                  분류
                </span>
                {Object.entries(SCHEDULE_COLORS).map(([cat, color]) => (
                  <div key={cat} className="flex items-center gap-1">
                    <div
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-[11px] text-content-secondary">
                      {cat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 캘린더 + 우측 패널 — admin-pando 1:1 */}
          <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-4 items-start">
            <div className="rounded-xl border border-line bg-surface p-4 shadow-card">
              {/* 캘린더 헤더 */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => notify("이전 달", "info")}
                  >
                    <ChevronRight className="rotate-180" size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => notify("오늘", "info")}
                  >
                    오늘
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => notify("다음 달", "info")}
                  >
                    <ChevronRight size={14} />
                  </Button>
                </div>
                <h3 className="text-[15px] font-bold text-content">
                  2026년 5월
                </h3>
                <div className="flex items-center gap-1">
                  {(["월", "주", "일", "목록"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={cn(
                        "h-8 rounded-lg border px-3 text-[12px] font-semibold transition-colors",
                        view === v
                          ? "bg-primary text-white border-primary"
                          : "bg-surface-secondary text-content-secondary border-line hover:border-primary",
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* 월 캘린더 그리드 — admin-pando dayGridMonth 1:1 */}
              <div className="overflow-hidden rounded-lg border border-line">
                <div className="grid grid-cols-7 bg-surface-secondary">
                  {["일", "월", "화", "수", "목", "금", "토"].map((d, idx) => (
                    <div
                      key={d}
                      className={cn(
                        "p-2 text-center text-[12px] font-semibold",
                        idx === 0
                          ? "text-rose-600"
                          : idx === 6
                            ? "text-blue-600"
                            : "text-content-secondary",
                      )}
                    >
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {calendarDays.map((cell, idx) => {
                    const isSelected =
                      cell.isCurrentMonth && cell.day === selectedDate;
                    const isToday = cell.isCurrentMonth && cell.day === 29;
                    const weekday = idx % 7;
                    return (
                      <button
                        key={`${cell.day}-${idx}`}
                        type="button"
                        onClick={() =>
                          cell.isCurrentMonth && setSelectedDate(cell.day)
                        }
                        className={cn(
                          "min-h-[96px] border-b border-r border-line p-1.5 text-left transition-colors hover:bg-primary-light/30",
                          !cell.isCurrentMonth &&
                            "bg-surface-tertiary/40 text-content-tertiary",
                          isSelected &&
                            "bg-primary-light/50 ring-2 ring-primary/50",
                        )}
                      >
                        <div
                          className={cn(
                            "inline-flex h-6 w-6 items-center justify-center text-[12px] font-bold",
                            isToday && "rounded-full bg-primary text-white",
                            !isToday &&
                              cell.isCurrentMonth &&
                              weekday === 0 &&
                              "text-rose-600",
                            !isToday &&
                              cell.isCurrentMonth &&
                              weekday === 6 &&
                              "text-blue-600",
                            !isToday &&
                              cell.isCurrentMonth &&
                              weekday !== 0 &&
                              weekday !== 6 &&
                              "text-content",
                          )}
                        >
                          {cell.day}
                        </div>
                        <div className="mt-1 space-y-0.5">
                          {cell.events.slice(0, 3).map((ev, eIdx) => (
                            <div
                              key={eIdx}
                              className="truncate rounded-sm border-l-2 px-1 py-0.5 text-[10px] font-medium"
                              style={{
                                borderLeftColor: ev.color,
                                backgroundColor: ev.color + "15",
                                color: ev.color,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                openDialog("DLG-C002");
                              }}
                            >
                              {ev.title}
                            </div>
                          ))}
                          {cell.events.length > 3 && (
                            <div className="text-[10px] font-semibold text-content-tertiary">
                              +{cell.events.length - 3} 더보기
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 우측 일자 상세 패널 — admin-pando 1:1 */}
            <aside className="rounded-xl border border-line bg-surface p-4 shadow-card sticky top-4">
              <div className="border-b border-line pb-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-content-tertiary">
                  Selected Date
                </p>
                <h3 className="mt-1 text-[18px] font-bold text-content">
                  5월 {selectedDate}일 금
                </h3>
                <p className="mt-0.5 text-[12px] text-content-secondary">
                  조회 일정 {selectedDayEvents.length}건
                </p>
              </div>
              {selectedDayEvents.length === 0 ? (
                <div className="py-8 text-center text-[12px] text-content-tertiary">
                  선택한 일자의 일정이 없습니다.
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  {selectedDayEvents.map((ev, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="w-full rounded-lg border border-line bg-white p-3 text-left transition-colors hover:border-primary/30"
                      onClick={() => openDialog("DLG-C002")}
                      style={{ borderLeftWidth: 3, borderLeftColor: ev.color }}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-[13px] font-bold text-content">
                          {ev.title}
                        </p>
                        <Badge
                          variant="outline"
                          style={{
                            color: ev.color,
                            borderColor: ev.color + "40",
                          }}
                        >
                          {ev.category}
                        </Badge>
                      </div>
                      <p className="mt-1 text-[11px] text-content-secondary">
                        {ev.instructor} · {ev.type}
                      </p>
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button size="sm" onClick={() => openDialog("DLG-C001")}>
                  + 일정 등록
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => notify("일자별 통계 mock", "info")}
                >
                  일별 통계
                </Button>
              </div>
            </aside>
          </div>
        </div>
      )}

      {activeTab === "lessons" && (
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>수업 관리 (목록)</CardTitle>
            <CardDescription>
              총 760건 — 수업/강사/정원/예약/출석 합
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FilterChips filters={screen.filters} notify={notify} />
            <div className="mt-3 overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {screen.tableColumns.map((c) => (
                      <TableHead key={c}>{c}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {screen.rows.map((row, idx) => (
                    <TableRow key={idx}>
                      {screen.tableColumns.map((c) => (
                        <TableCell key={c}>
                          {statusAwareValue(String(row[c] ?? "-"))}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "counts" && (
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>횟수 관리</CardTitle>
            <CardDescription>
              PT/GX 잔여 횟수, 이관, 환불 처리 (docs4 V1 SCR-C007)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/lesson-counts">횟수 관리 화면 이동</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === "penalty" && (
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>페널티 관리</CardTitle>
            <CardDescription>
              노쇼·취소 페널티 정책 mock (docs4 V1 SCR-C008)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/penalties">페널티 관리 화면 이동</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === "valid" && (
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>유효 수업 목록</CardTitle>
            <CardDescription>
              유효 회원권/수강권 기준 수업 (docs4 V1 SCR-C011)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/valid-lessons">유효 수업 목록 이동</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 검수용 핸드오프 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <HandoffContractCard screen={screen} />
        <DialogDock screen={screen} openDialog={openDialog} />
      </div>
    </div>
  );
}

type ClassOperationConfig = {
  flow: string[];
  policy: string[];
  result: string;
  routes: { label: string; href: string }[];
};

const classOperationConfigs: Record<string, ClassOperationConfig> = {
  "SCR-C003": {
    flow: [
      "기간/요일/시간을 먼저 고정",
      "템플릿·강사·장소 선택",
      "충돌 일정 미리보기",
      "DLG-C008에서 생성 범위 확정",
      "30분 이내 전체 취소/롤백 상태 노출",
    ],
    policy: [
      "최대 12개월·100건 초과 비동기 처리",
      "강사/룸 충돌 행은 생성 제외 선택 필요",
      "트레이너는 본인 일정만 일괄 등록",
      "공휴일·휴무일 제외 날짜는 생성 전 고정",
    ],
    result:
      "미리보기 84건 · 충돌 3건 · 제외 날짜 2일 · DLG-C008 확정 전 생성 없음",
    routes: [
      { label: "템플릿 관리", href: "/class-templates" },
      { label: "캘린더 확인", href: "/classes/c001" },
    ],
  },
  "SCR-C004": {
    flow: [
      "템플릿 목록에서 활성/비활성 확인",
      "DLG-C009로 등록/수정",
      "사용 일정 수가 0일 때만 삭제 허용",
      "시간표/개별 등록 선택 목록 반영",
    ],
    policy: [
      "사용 중 템플릿 삭제 차단",
      "비활성 템플릿은 신규 일정 선택 목록 hidden",
      "기본 정원/장소/시간은 일정 생성 시 자동 완성",
      "색상은 캘린더 분류와 충돌하지 않게 관리",
    ],
    result: "템플릿 선택 시 사용 일정·삭제 가능 여부·연결 화면을 우측에 표시",
    routes: [
      { label: "시간표 등록", href: "/class-schedule" },
      { label: "수업 캘린더", href: "/classes/c001" },
    ],
  },
  "SCR-C006": {
    flow: [
      "기간과 강사 역할 선택",
      "강사 행 클릭으로 담당 수업·OT 요약 확인",
      "DLG-C010에서 상세 근무/수업 목록 확인",
      "업무 편중 강사는 재배정 후보로 표시",
    ],
    policy: [
      "급여 정산 참고용 근무 시간과 수업 수 분리",
      "OT 1차/2차 완료율은 신규 회원 관리와 연결",
      "트레이너는 본인 상세 우선, 관리자는 전체 조회",
      "과배정·휴무 충돌은 캘린더 이동 전 경고",
    ],
    result: "박트레이너 24건 · 30시간 · OT 1차 6건 · 편중 주의",
    routes: [
      { label: "캘린더 재배정", href: "/classes/c001" },
      { label: "직원 근태", href: "/staff/attendance" },
    ],
  },
  "SCR-C007": {
    flow: [
      "회원/수업권 행 선택",
      "DLG-C013 차감 이력 확인",
      "DLG-C012 조정 유형·횟수·사유 입력",
      "조정 후 잔여 횟수와 감사 로그 결과 확인",
    ],
    policy: [
      "환불/오류 정정/보상은 사유 필수",
      "잔여 횟수 음수 차감 차단",
      "진행 중 환불건은 조정 전 확인 필요",
      "회원 이관 시 잔여 횟수 유지 여부 표시",
    ],
    result: "잔여 8/20 · 최근 차감 정상 · 수동 조정은 DLG-C012 사유 필요",
    routes: [
      { label: "예약 원장", href: "/class-reservations" },
      { label: "결제/환불", href: "/sales/refunds" },
    ],
  },
  "SCR-C008": {
    flow: [
      "노쇼/취소 페널티 행 선택",
      "DLG-C015 자동 정책 확인",
      "DLG-C014 수동 페널티 등록",
      "첫 노쇼 면제/HQ 정책 예외 반영",
    ],
    policy: [
      "늦은 취소는 페널티 대상 아님",
      "첫 노쇼 면제는 본사 HQ-09 정책 기준",
      "수동 부과는 대상 수업·회원·사유 필수",
      "정정 시 자동 페널티 해제 결과 표시",
    ],
    result: "자동 정책 ON · 첫 노쇼 면제 대상 1건 · 수동 부과 대기 2건",
    routes: [
      { label: "출석/완료", href: "/attendance/lesson-completion" },
      { label: "Today Tasks", href: "/today-tasks" },
    ],
  },
  "SCR-C009": {
    flow: [
      "회원 요청 유형/상태/SLA 필터",
      "요청 행 클릭으로 원 수업·희망 일정 확인",
      "수락/거절/대안 일정 제시",
      "DLG-C016에서 대안 일정 발송",
    ],
    policy: [
      "24시간 초과 요청은 SLA 빨강 배지",
      "담당 트레이너는 담당 수업 요청만 처리",
      "거절은 사유 필수, 대안 제시는 원 수업 보존",
      "취소 요청은 페널티/횟수 차감 영향 함께 표시",
    ],
    result: "미처리 12건 · SLA 초과 3건 · 대안 일정 제시 후 응답 대기",
    routes: [
      { label: "캘린더", href: "/classes/c001" },
      { label: "예약 목록", href: "/class-reservations" },
    ],
  },
  "SCR-C011": {
    flow: [
      "오늘/이번 주 유효 수업만 조회",
      "예약 회원 출석 상태 확인",
      "서명 누락은 DLG-C006 Push 요청",
      "기록 상세은 DLG-C005로 근거 확인",
    ],
    policy: [
      "만료/취소 수업은 목록 제외",
      "FC/Staff는 출석 보조만 가능",
      "PT 서명 누락은 완료 처리와 분리",
      "QR은 참고값이고 수업 출석 인증 아님",
    ],
    result: "오늘 18건 · 출석 미처리 4건 · 서명 누락 2건 · 노쇼 1건",
    routes: [
      { label: "출석/완료", href: "/attendance/lesson-completion" },
      { label: "수업 기록", href: "/lessons" },
    ],
  },
  "SCR-C012": {
    flow: [
      "만석 수업 선택",
      "대기 순번·이용권 유효성 확인",
      "자동 배정 동의자 우선 처리",
      "수동 배정/대기 취소/자리 알림 발송",
    ],
    policy: [
      "D10 자동 배정 정책 ON이면 동의자 자동 처리",
      "이용권 만료자는 자동 스킵",
      "순번 변경은 감사 로그 대상",
      "자리 발생 알림은 중복 발송 throttle 적용",
    ],
    result: "대기 32명 · 자동 배정 ON · 만료자 1명 스킵 · 수동 배정 후보 2명",
    routes: [
      { label: "자동화 정책", href: "/hq/automation-policies" },
      { label: "예약 목록", href: "/class-reservations" },
    ],
  },
  "SCR-C013": {
    flow: [
      "낮은 평점/기간/강사 필터",
      "후기 행 클릭으로 전문/처리 메모 확인",
      "불만 후기는 응답 캠페인/운영 메모 연결",
      "신고 N건 이상 자동 숨김 상태 표시",
    ],
    policy: [
      "트레이너는 본인 수업 피드백만 조회",
      "FC/Staff 접근 제한",
      "낮은 평점은 즉시 알림/Today Task 후보",
      "NPS 자동 집계는 D10 지표로 연결",
    ],
    result: "평균 4.6 · 낮은 평점 4건 · 응답률 62% · 불만 후속 처리 필요",
    routes: [
      { label: "메시지 발송", href: "/message" },
      { label: "NPS", href: "/nps" },
    ],
  },
  "SCR-C015": {
    flow: [
      "수업 녹화 행 선택",
      "파일 업로드/공유 대상/공개 기간 설정",
      "공유 중 삭제 시 회원 안내 상태 확인",
      "만료 자동 비공개·90일 후 삭제 정책 표시",
    ],
    policy: [
      "최대 5GB 업로드 mock, 실제 저장 없음",
      "회원별 워터마크와 공개 기간 필요",
      "기간 만료는 자동 비공개 후 삭제 대기",
      "트레이너는 본인 수업 파일만 관리",
    ],
    result: "공유 중 48개 · 기간 만료 8개 · 삭제 전 대상 회원 안내 필요",
    routes: [
      { label: "수업 기록", href: "/lessons" },
      { label: "회원 메시지", href: "/message" },
    ],
  },
};

function getClassConfig(screen: ScreenDefinition): ClassOperationConfig {
  return (
    classOperationConfigs[screen.id] ?? {
      flow: ["행 선택", "정책 확인", "DLG/액션 실행", "결과 상태 확인"],
      policy: [
        "권한별 버튼 노출",
        "mock/local state만 수행",
        "결과는 화면에 남김",
      ],
      result: `${screen.title} mock 운영 결과 대기`,
      routes: [{ label: "수업 캘린더", href: "/classes/c001" }],
    }
  );
}

function ClassOperationsScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  const config = getClassConfig(screen);
  const [tab, setTab] = useState(screen.tabs[0] ?? "전체");
  const [selectedRow, setSelectedRow] = useState(0);
  const [activeMetric, setActiveMetric] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [operationResult, setOperationResult] = useState(config.result);
  const [acknowledged, setAcknowledged] = useState(false);
  const [lastFilter, setLastFilter] = useState("없음");
  const [detailOpen, setDetailOpen] = useState(true);
  const selected = screen.rows[selectedRow] ?? screen.rows[0] ?? {};
  const allowed = [
    "HQ_ADMIN",
    "OWNER",
    "MANAGER",
    "TRAINER",
    "FC",
    "STAFF",
  ].includes(role);
  const visibleRows = screen.rows.filter((row) => {
    if (!search.trim()) return true;
    return Object.values(row).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase()),
    );
  });
  const selectedTitle =
    String(
      selected["수업명"] ??
        selected["회원명"] ??
        selected["강사명"] ??
        selected["프로그램명"] ??
        selected["파일 이름"] ??
        screen.title,
    ) || screen.title;

  const applyLocalFilter = (filter: string) => {
    setLastFilter(filter);
    setDetailOpen(true);
    setOperationResult(
      `${filter} 조건을 적용했습니다. ${selectedTitle} 기준으로 목록/패널이 local state에서 동기화됩니다.`,
    );
  };

  const runAction = (label: string, dialogId?: string) => {
    if (!allowed) {
      notify(`${label}: 현재 역할로는 처리할 수 없습니다.`, "warning");
      return;
    }
    if (dialogId) openDialog(dialogId);
    setLastFilter(label);
    setDetailOpen(true);
    setOperationResult(
      `${label.replace(/\s*\([^)]*\)/g, "")} 준비 완료 · ${selectedTitle} · ${acknowledged ? "정책 확인됨" : "정책 확인 필요"} · local state만 갱신`,
    );
    if (!dialogId) notify(`${label} mock/local state 반영`, "info");
  };

  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="수업 운영 플로우 강화"
      />
      <MetricGrid
        metrics={screen.metrics}
        active={activeMetric}
        onSelect={(label) => {
          setActiveMetric(label);
          setOperationResult(
            `${label} 지표 기준으로 ${screen.title} 목록을 재검토합니다.`,
          );
        }}
      />
      <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>{screen.title} 작업대</CardTitle>
              <CardDescription>{screen.purpose}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {screen.tabs.map((item) => (
                  <Button
                    key={item}
                    size="sm"
                    variant={tab === item ? "default" : "outline"}
                    onClick={() => {
                      setTab(item);
                      setOperationResult(
                        `${item} 탭 기준으로 상태를 전환했습니다.`,
                      );
                    }}
                  >
                    {item}
                  </Button>
                ))}
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="수업명·회원·강사 검색"
                  className="ml-auto h-9 w-56"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {screen.filters.map((filter) => (
                  <Button
                    key={filter}
                    type="button"
                    size="sm"
                    variant={lastFilter === filter ? "default" : "outline"}
                    onClick={() => applyLocalFilter(filter)}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
              <div
                data-testid={`${screen.id.toLowerCase()}-active-state`}
                className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs font-medium text-blue-800"
              >
                선택 lane: 오전 PT · 적용 필터: {lastFilter} · 선택 행: {selectedTitle}
              </div>
              <div className="grid gap-2 md:grid-cols-4">
                {config.flow.map((step, index) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() =>
                      setOperationResult(
                        `Step ${index + 1}: ${step} 상태를 화면에 반영했습니다.`,
                      )
                    }
                    className="rounded-xl border border-line bg-surface-secondary p-3 text-left text-xs text-content-secondary transition hover:border-primary hover:text-primary"
                  >
                    <b className="mb-1 block text-content">Step {index + 1}</b>
                    {step}
                  </button>
                ))}
              </div>
              <div className="overflow-x-auto rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {screen.tableColumns.map((c) => (
                        <TableHead key={c}>{c}</TableHead>
                      ))}
                      <TableHead>운영 액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleRows.map((row, index) => (
                      <TableRow
                        key={index}
                        className={cn(
                          "cursor-pointer",
                          selectedRow === index && "bg-blue-50",
                        )}
                        onClick={() => {
                          setSelectedRow(index);
                          setDetailOpen(true);
                          setOperationResult(
                            `${String(row[screen.tableColumns[0]] ?? screen.title)} 행을 선택했습니다. 우측 정책을 확인하세요.`,
                          );
                        }}
                      >
                        {screen.tableColumns.map((c) => (
                          <TableCell key={c}>
                            {statusAwareValue(String(row[c] ?? "-"))}
                          </TableCell>
                        ))}
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(event) => {
                              event.stopPropagation();
                              runAction(
                                screen.primaryActions[0]?.label ?? "상세 보기",
                                screen.primaryActions[0]?.dialogId,
                              );
                            }}
                          >
                            처리
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>단계별 액션</CardTitle>
              <CardDescription>
                버튼은 실제 API 없이 DLG/local state/route/side panel 상태로
                동작합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {screen.primaryActions.map((action) => (
                <Button
                  key={action.label}
                  size="sm"
                  variant={
                    action.danger
                      ? "destructive"
                      : action.dialogId
                        ? "default"
                        : "outline"
                  }
                  data-dialog-id={action.dialogId}
                  onClick={() => runAction(action.label, action.dialogId)}
                >
                  {action.label}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
        <aside className="min-w-0 space-y-4">
          {detailOpen && (
            <Card
              className="shadow-none"
              data-testid={`${screen.id.toLowerCase()}-row-detail-panel`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>선택 항목 운영 패널</CardTitle>
                    <CardDescription>
                      선택 행, 정책, 처리 결과를 한 곳에 남깁니다.
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label="닫기"
                    onClick={() => setDetailOpen(false)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <InfoCell label="선택" value={selectedTitle} />
                <InfoCell label="화면" value={`${screen.id} · ${screen.title}`} />
                <InfoCell
                  label="지점/역할"
                  value={`${branch} · ${roleById.get(role)?.label ?? role}`}
                />
                <label className="flex items-center gap-2 rounded-xl border border-line bg-surface-secondary p-3 text-xs text-content-secondary">
                  <input
                    type="checkbox"
                    checked={acknowledged}
                    onChange={(event) => setAcknowledged(event.target.checked)}
                  />
                  <span>권한·충돌·차감·알림 정책 확인</span>
                </label>
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800">
                  {operationResult}
                </div>
              </CardContent>
            </Card>
          )}
          {screen.id === "SCR-C006" && (
            <Card
              className="border-amber-200 bg-amber-50 shadow-none"
              data-testid="scr-c006-queue-detail-panel"
            >
              <CardHeader>
                <CardTitle>강사 일정 충돌 조정 큐</CardTitle>
                <CardDescription>
                  강사 휴무/과배정과 예약 변경 요청을 같은 패널에서 처리합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <InfoCell label="충돌 유형" value="강사 일정 충돌 · 같은 시간 PT/GX 중복" />
                <InfoCell label="대상" value={`${selectedTitle} · 예약 변경 요청 3건`} />
                <InfoCell label="처리 기준" value="회원 잔여권/대기열/강사 권한 확인 후 DLG-C010에서 조정" />
                <Button className="w-full" onClick={() => runAction("예약 조정", "DLG-C010")}>
                  예약 조정
                </Button>
              </CardContent>
            </Card>
          )}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>정책 체크</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-content-secondary">
              {config.policy.map((item) => (
                <div
                  key={item}
                  className="flex gap-2 rounded-lg border border-line bg-white p-2"
                >
                  <CheckCircle2 className="mt-0.5 size-3.5 text-emerald-600" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>연결 화면</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {config.routes.map((route) => (
                <Button
                  key={route.href}
                  asChild
                  variant="outline"
                  className="w-full"
                >
                  <Link href={route.href}>{route.label}</Link>
                </Button>
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

function LessonManagementScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  const [tab, setTab] = useState(screen.tabs[0] ?? "전체");
  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="목록 기반 정밀 수업 관리"
      />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>수업 목록</CardTitle>
              <CardDescription>
                캘린더 뷰의 보조 - 출석 처리·서명 누락·노쇼 정정 중심.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Tabs
                value={tab}
                onValueChange={(v) => {
                  setTab(v);
                  notify(`${v} 탭`, "info");
                }}
              >
                <TabsList>
                  {screen.tabs.map((t) => (
                    <TabsTrigger key={t} value={t}>
                      {t}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <FilterChips filters={screen.filters} notify={notify} />
              <Table>
                <TableHeader>
                  <TableRow>
                    {screen.tableColumns.map((c) => (
                      <TableHead key={c}>{c}</TableHead>
                    ))}
                    <TableHead>행 액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {screen.rows.map((row, index) => (
                    <TableRow key={index}>
                      {screen.tableColumns.map((c) => (
                        <TableCell key={c}>
                          {statusAwareValue(String(row[c] ?? "-"))}
                        </TableCell>
                      ))}
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openDialog("DLG-C005")}
                        >
                          기록 상세
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>주요 액션</CardTitle>
            </CardHeader>
            <CardContent>
              <PrimaryActionRow
                screen={screen}
                role={role}
                openDialog={openDialog}
                notify={notify}
              />
            </CardContent>
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

function GroupClassStatusScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="주간·월간 예약/출석 보드"
      />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>그룹 수업 잔여/출석</CardTitle>
              <CardDescription>정원 대비 잔여 자리 시각 바</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <FilterChips filters={screen.filters} notify={notify} />
              <div className="grid grid-cols-1 gap-2">
                {screen.rows.map((row, idx) => {
                  const pct =
                    Number(String(row["출석률(%)"] ?? "0").replace("%", "")) ||
                    0;
                  return (
                    <div key={idx} className="rounded-xl border bg-white p-3">
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <b>{row["수업명"]}</b>{" "}
                          <span className="text-xs text-content-tertiary">
                            {row["유형"]} · {row["강사"]} · {row["요일·시간"]}
                          </span>
                        </div>
                        <div className="text-xs">
                          {statusAwareValue(String(row["잔여 바"] ?? "-"))}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-xs text-content-secondary">
                        <span>
                          예약 {row["예약 수"]}/{row["정원"]}
                        </span>
                        <span>잔여 {row["잔여 자리"]}</span>
                        <span>노쇼 {row["노쇼 수"]}</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded bg-surface-tertiary">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="mt-1 text-right text-xs text-content-tertiary">
                        출석률 {pct}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>처리 액션</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <PrimaryActionRow
                screen={screen}
                role={role}
                openDialog={openDialog}
                notify={notify}
              />
            </CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function ExerciseProgramsScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  // V2 강조: 자동 추천 미지원 표시
  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="V2 신규 · 트레이너 수동 운영"
      />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>프로그램 카드 그리드</CardTitle>
              <CardDescription>
                동작 순서 드래그&드롭·회원 배정 mock
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <FilterChips filters={screen.filters} notify={notify} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {screen.rows.map((row, idx) => (
                  <div key={idx} className="rounded-xl border bg-white p-3">
                    <div className="flex items-center justify-between">
                      <b className="text-sm">{row["프로그램명"]}</b>
                      {statusAwareValue(String(row["활성"] ?? "-"))}
                    </div>
                    <div className="mt-1 text-xs text-content-tertiary">
                      {row["담당 트레이너"]} · 동작 {row["동작 수"]}
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded bg-surface-secondary p-2">
                        <div className="text-content-tertiary">배정 회원</div>
                        <div className="font-semibold">
                          {row["배정 회원 수"]}
                        </div>
                      </div>
                      <div className="rounded bg-surface-secondary p-2">
                        <div className="text-content-tertiary">최종 수정</div>
                        <div className="font-semibold">
                          {row["마지막 수정일"]}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          notify(
                            `${row["프로그램명"]} 동작 순서 편집 mock`,
                            "info",
                          )
                        }
                      >
                        동작 편집
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          notify(`${row["프로그램명"]} 회원 배정 mock`, "info")
                        }
                      >
                        회원 배정
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>V2 정책 안내</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-content-secondary">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800">
                <AlertTriangle className="mr-2 inline size-4" />
                v1 자동 추천·자동 생성 미지원. 수동 등록·수정·배정만 mock 처리.
              </div>
              <PrimaryActionRow
                screen={screen}
                role={role}
                openDialog={openDialog}
                notify={notify}
              />
            </CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function LessonAttendanceScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  // admin-pando attendance 시각 차용: 실시간 출입 로그 + 인증 미리보기
  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="출석/완료/서명 처리 보드"
      />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>수업별 출석/완료 현황</CardTitle>
              <CardDescription>
                출석 처리·노쇼 정정·서명 요청 Push mock
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <FilterChips filters={screen.filters} notify={notify} />
              <Table>
                <TableHeader>
                  <TableRow>
                    {screen.tableColumns.map((c) => (
                      <TableHead key={c}>{c}</TableHead>
                    ))}
                    <TableHead>처리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {screen.rows.map((row, idx) => (
                    <TableRow key={idx}>
                      {screen.tableColumns.map((c) => (
                        <TableCell key={c}>
                          {statusAwareValue(String(row[c] ?? "-"))}
                        </TableCell>
                      ))}
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            notify(`${row["수업명"]} 출석 처리 mock`, "info")
                          }
                        >
                          처리
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>인증 채널 (참고)</CardTitle>
              <CardDescription>
                QR은 입/출입 확인 — 수업 출석 인증 아님 (분쟁 대응 참고값)
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-2 text-xs">
              {[
                { label: "키오스크 QR", icon: "QR" },
                { label: "얼굴 인식", icon: "FR" },
                { label: "수동 입력", icon: "Ma" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border bg-surface-secondary p-3 text-center"
                >
                  <div className="mx-auto grid size-12 place-items-center rounded-xl bg-white font-bold">
                    {item.icon}
                  </div>
                  <div className="mt-1 font-medium">{item.label}</div>
                  <div className="text-content-tertiary">mock 미리보기</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>실시간 출입 로그</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {[
                {
                  시간: "10:24",
                  회원: "김민준",
                  결과: "출석",
                  tone: "success",
                },
                {
                  시간: "11:02",
                  회원: "박서연",
                  결과: "출석",
                  tone: "success",
                },
                {
                  시간: "11:05",
                  회원: "오지우",
                  결과: "노쇼",
                  tone: "destructive",
                },
              ].map((log, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border bg-white px-2 py-1.5"
                >
                  <span>
                    <b>{log.시간}</b> {log.회원}
                  </span>
                  <Badge variant={log.tone as "success" | "destructive"}>
                    {log.결과}
                  </Badge>
                </div>
              ))}
              <PrimaryActionRow
                screen={screen}
                role={role}
                openDialog={openDialog}
                notify={notify}
              />
            </CardContent>
          </Card>
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function ReservationListScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  const [selectedReservation, setSelectedReservation] = useState<
    Record<string, string> | null
  >(screen.rows[0] ?? null);
  const openReservationDetail = (row: Record<string, string>) => {
    setSelectedReservation(row);
  };
  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="예약 원장 (예약 1건 단위)"
      />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>예약 원장</CardTitle>
            <CardDescription>
              회원 문의·예약 취소·출석/노쇼 처리 현황
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <FilterChips filters={screen.filters} notify={notify} />
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {screen.tableColumns.slice(0, 8).map((c) => (
                      <TableHead key={c}>{c}</TableHead>
                    ))}
                    <TableHead>액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {screen.rows.map((row, idx) => (
                    <TableRow
                      key={idx}
                      tabIndex={0}
                      className={cn(
                        "cursor-pointer transition hover:bg-surface-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        selectedReservation === row && "bg-primary-light/20",
                      )}
                      onClick={() => openReservationDetail(row)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          openReservationDetail(row);
                        }
                      }}
                    >
                      {screen.tableColumns.slice(0, 8).map((c) => (
                        <TableCell key={c}>
                          {statusAwareValue(String(row[c] ?? "-"))}
                        </TableCell>
                      ))}
                      <TableCell>
                        <Badge variant="outline">행 클릭</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <aside className="space-y-4">
          {selectedReservation && (
            <Card className="shadow-none" data-testid="scr-c016-row-detail-panel">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>예약 상세 패널</CardTitle>
                    <CardDescription>
                      예약·회원·출석 처리 정보를 한 번에 확인합니다.
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label="닫기"
                    onClick={() => setSelectedReservation(null)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {screen.tableColumns.slice(0, 8).map((column) => (
                  <InfoCell
                    key={column}
                    label={column}
                    value={String(selectedReservation[column] ?? "-")}
                  />
                ))}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
                  후속 처리: 회원 상세 이동 · 출석 확정 · 예약 취소 · 변경
                  이력 확인
                </div>
              </CardContent>
            </Card>
          )}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>예약 처리</CardTitle>
            </CardHeader>
            <CardContent>
              <PrimaryActionRow
                screen={screen}
                role={role}
                openDialog={openDialog}
                notify={notify}
              />
            </CardContent>
          </Card>
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

// ---- D05 상품관리 ----

function ProductManagementScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  // admin-pando products/page.tsx 구조 1:1 이식 (사용자 명시 예시 화면)
  const [topTab, setTopTab] = useState<"products" | "categories">("products");
  const [statusTab, setStatusTab] = useState("all");
  const [classificationFilter, setClassificationFilter] = useState("전체");
  const [categoryFilter, setCategoryFilter] = useState("전체");
  const [searchValue, setSearchValue] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [isNewPanel, setIsNewPanel] = useState(false);
  const [panelDirty, setPanelDirty] = useState(false);
  const [confirmProductClose, setConfirmProductClose] = useState(false);

  // KPI 카드 — docs4 V1 SCR-P001 명시: 전체 상품 수 / 활성 상품 수 / 비활성 상품 수 (3개)
  // + 운영 보조 1개 (대분류 카테고리 5개 — 회원권/수강권/락커/운동복/일반)
  const kpiCards = [
    {
      label: "전체 상품 수",
      value: "31",
      stripe: "bg-primary",
      icon: <ClipboardCheck size={16} />,
    },
    {
      label: "활성 상품 수",
      value: "31",
      stripe: "bg-emerald-400",
      icon: <CheckCircle2 size={16} />,
    },
    {
      label: "비활성 상품 수",
      value: "0",
      stripe: "bg-content-tertiary",
      icon: <Lock size={16} />,
    },
    {
      label: "상품 마스터 카테고리",
      value: "5",
      stripe: "bg-amber-400",
      icon: <ChevronRight size={16} />,
    },
  ];

  // 상태 탭 — docs4 V1 SCR-P001 상품 대분류 6개 (전체/회원권/수강권/락커/운동복/일반)
  const statusTabs = [
    { key: "all", label: "전체", count: 31 },
    { key: "MEMBERSHIP", label: "회원권", count: 4 },
    { key: "LESSON_PASS", label: "수강권", count: 10 },
    { key: "LOCKER", label: "락커", count: 2 },
    { key: "WEAR", label: "운동복", count: 2 },
    { key: "GENERAL", label: "일반", count: 13 },
  ];

  // 2단계 세부 필터 — docs4 V1 명시 (수강권: PT/GX/골프/기타 수강권, GX: 요가/필라테스/스피닝/줌바/GX 기타)
  const classifications = [
    { name: "전체", count: 31 },
    { name: "PT", count: 5 },
    { name: "GX", count: 8 },
    { name: "골프 수강권", count: 1 },
    { name: "기타 수강권", count: 4 },
  ];

  // GX 세부종목 — docs4 V1 명시 8개
  const categories = ["전체", "요가", "필라테스", "스피닝", "줌바", "GX 기타"];

  // 상품 목록 (docs4 컬럼 + admin-pando 시각)
  const products =
    screen.rows.length > 0
      ? screen.rows
      : [
          {
            "상품명(유형·패키지·운영정책 배지)": "PT 20회권",
            대분류: "수강권",
            현금가: "1,200,000원",
            카드가: "1,200,000원",
            기간: "180일",
            횟수: "20회",
            상태: "사용",
            "이용 가능 지점": "전 지점",
            홀딩: "Y",
            양도: "N",
            포인트: "Y",
            판매: "현장",
          },
          {
            "상품명(유형·패키지·운영정책 배지)": "회원권 3개월",
            대분류: "회원권",
            현금가: "450,000원",
            카드가: "470,000원",
            기간: "90일",
            횟수: "무제한",
            상태: "사용",
            "이용 가능 지점": "강남점",
            홀딩: "Y",
            양도: "Y",
            포인트: "Y",
            판매: "현장",
          },
          {
            "상품명(유형·패키지·운영정책 배지)": "락커 1개월",
            대분류: "대여권",
            현금가: "30,000원",
            카드가: "30,000원",
            기간: "30일",
            횟수: "1구좌",
            상태: "사용",
            "이용 가능 지점": "강남점",
            홀딩: "N",
            양도: "N",
            포인트: "N",
            판매: "현장",
          },
        ];

  const selected = selectedProduct !== null ? products[selectedProduct] : null;
  const panelOpen = isNewPanel || selected !== null;
  const canEditProduct = hasPermission(role, "memberWrite");
  const panelProductName = isNewPanel
    ? "신규 상품"
    : String(selected?.["상품명(유형·패키지·운영정책 배지)"] ?? "상품");

  const discardProductPanel = () => {
    setPanelDirty(false);
    setConfirmProductClose(false);
    setSelectedProduct(null);
    setIsNewPanel(false);
  };

  const closeProductPanel = () => {
    if (panelDirty) {
      setConfirmProductClose(true);
      notify("변경값이 있어 DLG-P003 작업 취소 확인을 표시합니다.", "warning");
      return;
    }
    discardProductPanel();
  };

  const openNewProductPanel = () => {
    if (panelOpen && panelDirty) {
      setConfirmProductClose(true);
      notify(
        "작성 중인 변경값을 먼저 처리해야 신규 패널을 열 수 있습니다.",
        "warning",
      );
      return;
    }
    setSelectedProduct(null);
    setIsNewPanel(true);
    setPanelDirty(false);
  };

  const openExistingProductPanel = (idx: number) => {
    if (panelOpen && panelDirty && selectedProduct !== idx) {
      setConfirmProductClose(true);
      notify(
        "다른 상품으로 이동 전 변경값 폐기/유지 확인이 필요합니다.",
        "warning",
      );
      return;
    }
    setSelectedProduct(idx);
    setIsNewPanel(false);
    setPanelDirty(false);
  };

  const visibleProducts = products
    .map((row, idx) => ({ row, idx }))
    .filter(({ row }) => {
      const productName = String(
        row["상품명(유형·패키지·운영정책 배지)"] ?? "",
      );
      const primary = String(row["대분류"] ?? "");
      const searchText = Object.values(row).join(" ").toLowerCase();
      const matchesSearch =
        !searchValue.trim() ||
        searchText.includes(searchValue.trim().toLowerCase());
      const matchesStatus =
        statusTab === "all" ||
        (statusTab === "MEMBERSHIP" && primary.includes("회원권")) ||
        (statusTab === "LESSON_PASS" && primary.includes("수강권")) ||
        (statusTab === "LOCKER" && primary.includes("락커")) ||
        (statusTab === "WEAR" && primary.includes("운동복")) ||
        (statusTab === "GENERAL" && primary.includes("일반"));
      const matchesClassification =
        classificationFilter === "전체" ||
        productName.includes(classificationFilter) ||
        searchText.includes(classificationFilter.toLowerCase());
      const matchesCategory =
        categoryFilter === "전체" ||
        productName.includes(categoryFilter) ||
        searchText.includes(categoryFilter.toLowerCase());
      return (
        matchesSearch &&
        matchesStatus &&
        matchesClassification &&
        matchesCategory
      );
    });

  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="상품 관리 (admin-pando 구조)"
      />

      {/* PageHeader — admin-pando 1:1 */}
      <div className="flex items-end justify-between border-b border-line/60 pb-4">
        <div>
          <h1 className="text-[24px] font-black tracking-tight text-content">
            상품 관리
          </h1>
          <p className="mt-1 text-[13px] text-content-secondary">
            센터에서 판매하는 이용권, PT, GX 및 기타 상품을 관리합니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* 상품 목록 / 분류 관리 토글 — admin-pando 1:1 */}
          <div className="inline-flex rounded-lg border border-line bg-surface-secondary p-0.5">
            <button
              onClick={() => setTopTab("products")}
              className={cn(
                "h-8 px-3 rounded-md text-[12px] font-semibold transition-colors",
                topTab === "products"
                  ? "bg-white text-primary shadow-sm"
                  : "text-content-secondary",
              )}
            >
              상품 목록
            </button>
            <button
              onClick={() => setTopTab("categories")}
              className={cn(
                "h-8 px-3 rounded-md text-[12px] font-semibold transition-colors",
                topTab === "categories"
                  ? "bg-white text-primary shadow-sm"
                  : "text-content-secondary",
              )}
            >
              분류 관리
            </button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => notify("Excel 다운로드 mock", "info")}
          >
            Excel
          </Button>
          <Button
            size="sm"
            data-dialog-id="DLG-P001-상품등록모달"
            onClick={openNewProductPanel}
          >
            + 상품 등록
          </Button>
        </div>
      </div>

      {/* KPI 4 카드 — admin-pando 1:1 (컬러 stripe) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpiCards.map((stat) => (
          <div
            key={stat.label}
            className="relative overflow-hidden rounded-2xl border border-line bg-surface p-4 shadow-card"
          >
            <div className={cn("absolute inset-x-0 top-0 h-1", stat.stripe)} />
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-semibold text-content-secondary">
                {stat.label}
              </p>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-light text-primary">
                {stat.icon}
              </div>
            </div>
            <p className="mt-2 text-[28px] font-black tabular-nums text-content">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {topTab === "products" && (
        <>
          {/* 상태 탭 5개 — admin-pando 1:1 */}
          <div
            className="flex gap-6 overflow-x-auto border-b border-line"
            data-allow-horizontal-scroll="true"
          >
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusTab(tab.key)}
                className={cn(
                  "relative flex items-center gap-1.5 pb-2.5 text-[13px] font-medium transition-colors",
                  statusTab === tab.key
                    ? "text-primary"
                    : "text-content-secondary hover:text-content",
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-px text-[10px] font-bold tabular-nums",
                    statusTab === tab.key
                      ? "bg-primary text-white"
                      : "bg-surface-tertiary text-content-secondary",
                  )}
                >
                  {tab.count}
                </span>
                {statusTab === tab.key && (
                  <div className="absolute -bottom-px left-0 right-0 h-0.5 rounded-t-full bg-primary" />
                )}
              </button>
            ))}
          </div>

          {/* 분류 칩 7개 — admin-pando 1:1 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-semibold text-content-secondary mr-1">
              분류
            </span>
            {classifications.map((c) => (
              <button
                key={c.name}
                onClick={() => setClassificationFilter(c.name)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors",
                  classificationFilter === c.name
                    ? "bg-primary text-white border-primary"
                    : "bg-surface-secondary text-content-secondary border-line hover:border-primary hover:text-primary",
                )}
              >
                {c.name}
                <span
                  className={cn(
                    "rounded-full px-1 py-px text-[10px] font-bold",
                    classificationFilter === c.name
                      ? "bg-white/20 text-white"
                      : "bg-white text-content-secondary",
                  )}
                >
                  {c.count}
                </span>
              </button>
            ))}
          </div>

          {/* 카테고리 칩 8개 — admin-pando 1:1 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-semibold text-content-secondary mr-1">
              카테고리
            </span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors",
                  categoryFilter === c
                    ? "bg-content text-white border-content"
                    : "bg-surface-secondary text-content-secondary border-line hover:border-content hover:text-content",
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {/* 검색 input — admin-pando 1:1 */}
          <div className="relative max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary"
              size={14}
            />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="상품명 검색"
              className="pl-9"
            />
          </div>

          {/* 마스터-디테일 컨테이너 — admin-pando products/page.tsx UX 이식 */}
          <div className="h-[480px] overflow-hidden rounded-xl border border-line bg-surface shadow-card">
            <div className="flex h-full gap-0">
              {/* 좌측: 상품 목록. 패널이 열리면 admin-pando처럼 폭이 줄고 일부 운영 컬럼은 접힙니다. */}
              <div
                className={cn(
                  "flex h-full min-h-0 flex-col transition-all duration-300 ease-in-out",
                  panelOpen ? "w-[55%] border-r border-line" : "w-full",
                )}
              >
                <div className="flex items-center justify-between border-b border-line bg-surface-secondary px-4 py-2.5">
                  <span className="text-[12px] font-semibold text-content-secondary">
                    표시{" "}
                    <span className="font-bold text-content tabular-nums">
                      {visibleProducts.length}
                    </span>
                    개 / 샘플 {products.length}개 · 문서 기준 31개
                  </span>
                  <span className="text-[11px] text-content-tertiary">
                    행 클릭 → SCR-P003 우측 상세/수정 패널
                  </span>
                </div>
                <div className="flex-1 overflow-x-auto">
                  <Table
                    className={cn(
                      "w-full border-collapse",
                      panelOpen && "table-fixed",
                    )}
                  >
                    <TableHeader className="sticky top-0 z-10 bg-surface-secondary">
                      <TableRow>
                        <TableHead className="text-[10px]">상품명</TableHead>
                        <TableHead className="text-right text-[10px]">
                          현금가
                        </TableHead>
                        <TableHead className="text-right text-[10px]">
                          카드가
                        </TableHead>
                        <TableHead className="text-center text-[10px]">
                          기간
                        </TableHead>
                        <TableHead className="text-center text-[10px]">
                          횟수
                        </TableHead>
                        {!panelOpen &&
                          ["월", "화", "수", "목", "금", "토", "일"].map(
                            (day) => (
                              <TableHead
                                key={day}
                                className="w-6 px-0 text-center text-[10px]"
                              >
                                {day}
                              </TableHead>
                            ),
                          )}
                        {!panelOpen && (
                          <TableHead className="text-center text-[10px]">
                            시간
                          </TableHead>
                        )}
                        {!panelOpen &&
                          ["홀딩", "양도", "포인트"].map((col) => (
                            <TableHead
                              key={col}
                              className="px-1 text-center text-[10px]"
                            >
                              {col}
                            </TableHead>
                          ))}
                        {!panelOpen && (
                          <TableHead className="text-center text-[10px]">
                            판매
                          </TableHead>
                        )}
                        <TableHead className="text-center text-[10px]">
                          상태
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visibleProducts.map(({ row, idx }) => {
                        const isSelected =
                          selectedProduct === idx && !isNewPanel;
                        const dayText = String(row["요일"] ?? "전체");
                        const available = (day: string) =>
                          dayText === "전체" || dayText.includes(day);
                        return (
                          <TableRow
                            key={idx}
                            className={cn(
                              "group cursor-pointer border-l-2 transition-colors",
                              isSelected
                                ? "border-l-primary bg-primary/5"
                                : "border-l-transparent hover:bg-surface-secondary",
                            )}
                            onClick={() => openExistingProductPanel(idx)}
                          >
                            <TableCell className="py-1.5">
                              <div className="flex min-w-0 items-center gap-1">
                                <Badge
                                  variant="outline"
                                  className="bg-primary-light/40 border-primary/30 text-primary text-[9px]"
                                >
                                  {row["대분류"]}
                                </Badge>
                                {String(
                                  row["상품명(유형·패키지·운영정책 배지)"],
                                ).includes("패키지") && (
                                  <Badge
                                    variant="warning"
                                    className="text-[9px]"
                                  >
                                    패키지
                                  </Badge>
                                )}
                                <b
                                  className={cn(
                                    "truncate text-[12px]",
                                    isSelected
                                      ? "text-primary"
                                      : "text-content group-hover:text-primary",
                                  )}
                                >
                                  {row["상품명(유형·패키지·운영정책 배지)"]}
                                </b>
                              </div>
                              {panelOpen && (
                                <p className="mt-0.5 truncate text-[10px] text-content-tertiary">
                                  {row["대분류"]} · {row["이용 가능 지점"]}
                                </p>
                              )}
                            </TableCell>
                            <TableCell className="py-1.5 text-right text-[12px] font-semibold tabular-nums">
                              {row["현금가"]}
                            </TableCell>
                            <TableCell className="py-1.5 text-right text-[12px] text-content-secondary tabular-nums">
                              {row["카드가"]}
                            </TableCell>
                            <TableCell className="py-1.5 text-center text-[11px] text-content-secondary">
                              {row["기간"]}
                            </TableCell>
                            <TableCell className="py-1.5 text-center text-[11px] text-content-secondary">
                              {row["횟수"]}
                            </TableCell>
                            {!panelOpen &&
                              ["월", "화", "수", "목", "금", "토", "일"].map(
                                (day) => (
                                  <TableCell
                                    key={day}
                                    className="px-0 py-1.5 text-center"
                                  >
                                    <span
                                      className={cn(
                                        "text-[11px] font-bold",
                                        available(day)
                                          ? "text-green-500"
                                          : "text-red-400",
                                      )}
                                    >
                                      {available(day) ? "✓" : "✗"}
                                    </span>
                                  </TableCell>
                                ),
                              )}
                            {!panelOpen && (
                              <TableCell className="py-1.5 text-center text-[11px] text-content-secondary whitespace-nowrap">
                                {row["시간"] ?? "전체"}
                              </TableCell>
                            )}
                            {!panelOpen &&
                              ["홀딩", "양도", "포인트"].map((key) => (
                                <TableCell
                                  key={key}
                                  className="px-1 py-1.5 text-center"
                                >
                                  <span
                                    className={cn(
                                      "text-[11px] font-bold",
                                      row[key] === "Y"
                                        ? "text-green-500"
                                        : "text-red-400",
                                    )}
                                  >
                                    {row[key] === "Y" ? "✓" : "✗"}
                                  </span>
                                </TableCell>
                              ))}
                            {!panelOpen && (
                              <TableCell className="py-1.5 text-center text-[12px] text-content-secondary">
                                {row["판매"] ?? "0건"}
                              </TableCell>
                            )}
                            <TableCell className="py-1.5 text-center">
                              <Badge
                                variant={
                                  row["상태"] === "사용" ? "success" : "outline"
                                }
                              >
                                {row["상태"]}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* 우측: 상세/편집 패널. 신규 등록과 수정이 같은 패널 UI를 공유합니다. */}
              <div
                className={cn(
                  "h-full min-h-0 overflow-hidden bg-[#e7ebf1] transition-all duration-300 ease-in-out",
                  panelOpen ? "w-[45%] opacity-100" : "w-0 opacity-0",
                )}
              >
                {panelOpen && (
                  <div
                    className="flex h-full flex-col p-1.5 text-[11px]"
                    role="dialog"
                    aria-modal="false"
                    aria-label={
                      isNewPanel ? "상품 등록 모달" : "상품 상세/수정 패널"
                    }
                  >
                    <span className="sr-only">
                      {isNewPanel
                        ? "DLG-P001-상품등록모달 상품 등록 모달"
                        : "SCR-P003 상품 상세/수정 패널"}
                    </span>
                    <div className="mx-auto flex h-full w-full max-w-[980px] flex-col overflow-hidden rounded-sm border border-[#9ca7b6] bg-[#f4f4f4] shadow-sm">
                      <div className="flex items-center justify-between border-b border-[#9ca7b6] bg-[linear-gradient(180deg,#fdfefe_0%,#dfe6ef_100%)] px-2.5 py-1">
                        <div className="flex min-w-0 items-center gap-2">
                          <div className="text-[13px] font-bold">
                            {isNewPanel ? "상품등록" : "상품수정"}
                          </div>
                          {!isNewPanel && <Badge variant="success">활성</Badge>}
                          {panelDirty && (
                            <Badge variant="warning">미저장</Badge>
                          )}
                          <Badge
                            variant="outline"
                            className="hidden lg:inline-flex"
                          >
                            SCR-P003
                          </Badge>
                        </div>
                        <button
                          type="button"
                          onClick={closeProductPanel}
                          className="text-[#4b5563] hover:text-[#111]"
                          aria-label="닫기"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto bg-[#f4f4f4] p-1.5">
                        <div className="space-y-1">
                          <div className="rounded-sm border border-amber-300 bg-amber-50 px-2 py-1 text-[10px] text-amber-900">
                            docs4/V1 SCR-P003 + docs4/V2 PRD-EXT-01/02 기준:
                            신규 등록과 기존 수정은 동일 상품 패널 UI를
                            공유합니다. 실제 API 호출 없음.
                          </div>

                          <div className="flex items-center gap-2 border-b border-[#d7dbe2] bg-white px-1.5 py-1">
                            <div className="w-[62px] shrink-0 text-right font-semibold text-[#404040]">
                              상품구분
                            </div>
                            <div className="flex flex-1 flex-wrap items-center gap-3">
                              {["레슨", "이용", "락커", "판매"].map(
                                (option) => (
                                  <label
                                    key={option}
                                    className="flex items-center gap-1 text-[11px] font-medium text-[#30343b]"
                                  >
                                    <input
                                      type="radio"
                                      name="productPanelKind"
                                      defaultChecked={option === "레슨"}
                                      onChange={() => setPanelDirty(true)}
                                      className="h-3.5 w-3.5 accent-[#4f8fe6]"
                                    />
                                    {option}
                                  </label>
                                ),
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-right font-semibold text-[#404040]">
                                사용인원
                              </div>
                              <input
                                defaultValue="1"
                                onChange={() => setPanelDirty(true)}
                                className="h-6 w-[46px] border border-[#d0a400] bg-[#fff46b] px-1 text-center text-[11px]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5 rounded-sm border border-[#c8d7ee] bg-[#f8fbff] px-1.5 py-1">
                            <div className="flex items-center gap-2">
                              <div className="w-[62px] shrink-0 text-right font-semibold text-[#404040]">
                                1단계
                              </div>
                              <select
                                defaultValue="PT"
                                onChange={() => setPanelDirty(true)}
                                className="h-6 min-w-0 flex-1 border border-[#9ca7b6] bg-white px-1 text-[11px]"
                              >
                                <option>PT</option>
                                <option>GX</option>
                                <option>골프</option>
                                <option>기타 수강권</option>
                              </select>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-[62px] shrink-0 text-right font-semibold text-[#404040]">
                                2단계
                              </div>
                              <select
                                defaultValue="개인 PT"
                                onChange={() => setPanelDirty(true)}
                                className="h-6 min-w-0 flex-1 border border-[#9ca7b6] bg-white px-1 text-[11px]"
                              >
                                <option>개인 PT</option>
                                <option>요가</option>
                                <option>필라테스</option>
                                <option>스피닝</option>
                                <option>줌바</option>
                                <option>GX 기타</option>
                              </select>
                            </div>
                          </div>

                          {[
                            [
                              "상품그룹",
                              isNewPanel ? "상품그룹 선택" : "PT 패키지",
                            ],
                            ["상품명", isNewPanel ? "" : panelProductName],
                            [
                              "금액",
                              isNewPanel
                                ? ""
                                : String(selected?.["현금가"] ?? ""),
                            ],
                            [
                              "카드가",
                              isNewPanel
                                ? ""
                                : String(selected?.["카드가"] ?? ""),
                            ],
                            ["레슨시간", "50분"],
                            [
                              "유효기간",
                              isNewPanel
                                ? ""
                                : String(selected?.["기간"] ?? ""),
                            ],
                            [
                              "횟수",
                              isNewPanel
                                ? ""
                                : String(selected?.["횟수"] ?? ""),
                            ],
                            ["태그", "VIP, 재등록"],
                          ].map(([label, value]) => (
                            <div
                              key={label}
                              className="flex items-center gap-2 bg-white px-1.5 py-1"
                            >
                              <div className="w-[62px] shrink-0 text-right font-semibold text-[#404040]">
                                {label}
                              </div>
                              <input
                                defaultValue={value}
                                onChange={() => setPanelDirty(true)}
                                placeholder={
                                  label === "상품명"
                                    ? "상품명을 입력하세요"
                                    : undefined
                                }
                                className="h-6 min-w-0 flex-1 border border-[#9ca7b6] bg-white px-1.5 text-[11px]"
                              />
                            </div>
                          ))}

                          <div className="bg-white px-1.5 py-1">
                            <div className="mb-1 flex items-center gap-2">
                              <div className="w-[62px] shrink-0 text-right font-semibold text-[#404040]">
                                설명
                              </div>
                              <span className="text-[10px] text-[#6b7280]">
                                카탈로그/키오스크 노출 문구
                              </span>
                            </div>
                            <Textarea
                              defaultValue={
                                isNewPanel
                                  ? ""
                                  : "20회 PT 패키지 · 양도/홀딩 가능 · 포인트 적립"
                              }
                              onChange={() => setPanelDirty(true)}
                              className="min-h-[54px] rounded-none border-[#9ca7b6] bg-white text-[11px]"
                            />
                          </div>

                          <div className="bg-white px-1.5 py-1">
                            <div className="mb-1 flex items-center gap-2">
                              <div className="w-[62px] shrink-0 text-right font-semibold text-[#404040]">
                                요일/시간
                              </div>
                              <span className="text-[10px] text-[#6b7280]">
                                10분 단위 입력
                              </span>
                            </div>
                            <div className="ml-[70px] flex flex-wrap gap-1">
                              {["월", "화", "수", "목", "금", "토", "일"].map(
                                (day) => (
                                  <label
                                    key={day}
                                    className="flex h-7 min-w-7 cursor-pointer items-center justify-center rounded-sm border border-[#9ca7b6] bg-white px-2 text-[11px] font-semibold has-[:checked]:border-[#4f8fe6] has-[:checked]:bg-[#eaf2ff] has-[:checked]:text-[#2f69b1]"
                                  >
                                    <input
                                      type="checkbox"
                                      defaultChecked={
                                        !["토", "일"].includes(day)
                                      }
                                      onChange={() => setPanelDirty(true)}
                                      className="sr-only"
                                    />
                                    {day}
                                  </label>
                                ),
                              )}
                            </div>
                            <div className="ml-[70px] mt-1 grid grid-cols-2 gap-1.5">
                              <input
                                defaultValue="09:00"
                                onChange={() => setPanelDirty(true)}
                                className="h-6 border border-[#9ca7b6] bg-white px-1.5 text-[11px]"
                              />
                              <input
                                defaultValue="18:00"
                                onChange={() => setPanelDirty(true)}
                                className="h-6 border border-[#9ca7b6] bg-white px-1.5 text-[11px]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-1 bg-white p-1.5">
                            {[
                              "예약 가능",
                              "시설 이용",
                              "홀딩 가능",
                              "양도 가능",
                              "포인트 적립",
                              "회원 직접 휴회",
                              "키오스크 노출",
                              "활성 상태",
                            ].map((label, idx) => (
                              <label
                                key={label}
                                className="flex items-center justify-between border border-[#d7dbe2] bg-[#fafafa] px-2 py-1 text-[11px]"
                              >
                                <span>{label}</span>
                                <input
                                  type="checkbox"
                                  defaultChecked={idx !== 3 && idx !== 5}
                                  onChange={() => setPanelDirty(true)}
                                  className="h-3.5 w-3.5 accent-[#4f8fe6]"
                                />
                              </label>
                            ))}
                          </div>

                          <div className="grid grid-cols-3 gap-1.5 bg-white p-1.5">
                            <button
                              type="button"
                              className="rounded-sm border border-[#9ca7b6] bg-[#eef4ff] px-2 py-1 text-left"
                              onClick={() =>
                                openDialog("DLG-P014-가격이력조회")
                              }
                            >
                              <div className="text-[10px] text-[#52616f]">
                                가격 변경 이력
                              </div>
                              <b>5건</b>
                            </button>
                            <div className="rounded-sm border border-[#9ca7b6] bg-[#f8fbff] px-2 py-1">
                              <div className="text-[10px] text-[#52616f]">
                                판매 건수
                              </div>
                              <b>
                                {isNewPanel
                                  ? "0건"
                                  : String(selected?.["판매"] ?? "0건")}
                              </b>
                            </div>
                            <div className="rounded-sm border border-[#9ca7b6] bg-[#f8fbff] px-2 py-1">
                              <div className="text-[10px] text-[#52616f]">
                                패키지 구성
                              </div>
                              <b>2개</b>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-[#9ca7b6] bg-[linear-gradient(180deg,#fdfefe_0%,#dfe6ef_100%)] px-2.5 py-1.5">
                        <div className="text-[10px] text-[#4b5563]">
                          {canEditProduct ? "수정 가능" : "조회 전용"} ·{" "}
                          {panelProductName}
                        </div>
                        <div className="flex gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            data-dialog-id="DLG-P014-가격이력조회"
                            onClick={() => openDialog("DLG-P014-가격이력조회")}
                          >
                            가격 이력
                          </Button>
                          {!isNewPanel && (
                            <Button
                              variant="outline"
                              size="sm"
                              data-dialog-id="DLG-P006-비활성화안내"
                              onClick={() =>
                                openDialog("DLG-P006-비활성화안내")
                              }
                            >
                              비활성
                            </Button>
                          )}
                          {!isNewPanel && (
                            <Button
                              variant="destructive"
                              size="sm"
                              data-dialog-id="DLG-P005-상품삭제확인"
                              disabled={!canEditProduct}
                              onClick={() =>
                                openDialog(
                                  String(selected?.["판매"] ?? "0건") === "0건"
                                    ? "DLG-P005-상품삭제확인"
                                    : "DLG-P006-비활성화안내",
                                )
                              }
                            >
                              삭제
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={closeProductPanel}
                          >
                            취소
                          </Button>
                          <Button
                            size="sm"
                            disabled={!canEditProduct}
                            onClick={() => {
                              notify(
                                isNewPanel
                                  ? "상품이 등록되었습니다. (mock)"
                                  : "상품이 저장되었습니다. (mock)",
                                "success",
                              );
                              setPanelDirty(false);
                              setSelectedProduct(null);
                              setIsNewPanel(false);
                            }}
                          >
                            {isNewPanel ? "등록" : "저장"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {confirmProductClose && (
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4"
              onClick={() => setConfirmProductClose(false)}
            >
              <div
                className="w-full max-w-[420px] rounded-2xl border border-line bg-white shadow-2xl"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="작업 취소 확인"
              >
                <div className="border-b border-line px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="warning">DLG-P003</Badge>
                    <h3 className="text-base font-black text-content">
                      작업 취소 확인
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-content-secondary">
                    상품 등록/수정 중 입력한 변경 사항이 있습니다. 실제 운영
                    흐름처럼 여기서 계속 수정하거나 변경값을 폐기하고 패널을
                    닫습니다.
                  </p>
                </div>
                <div className="px-5 py-4 text-xs text-content-secondary">
                  <div className="rounded-xl bg-amber-50 p-3 text-amber-900">
                    저장하지 않은 상품명, 가격, 요일/시간, 노출 옵션은 모두
                    사라집니다.
                  </div>
                </div>
                <div className="flex justify-end gap-2 border-t border-line px-5 py-4">
                  <Button
                    variant="outline"
                    onClick={() => setConfirmProductClose(false)}
                  >
                    계속 수정
                  </Button>
                  <Button variant="destructive" onClick={discardProductPanel}>
                    변경 폐기
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {topTab === "categories" && (
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>분류 관리</CardTitle>
            <CardDescription>
              대분류·중분류·소분류 + 정렬·표시여부 관리
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {classifications.slice(1).map((c) => (
                <div
                  key={c.name}
                  className="rounded-xl border border-line bg-surface p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] font-semibold text-content">
                      {c.name}
                    </p>
                    <Badge variant="info">{c.count}</Badge>
                  </div>
                  <p className="mt-1 text-[11px] text-content-tertiary">
                    정렬 순서 · 표시 여부 · 색상 mock
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => notify(`${c.name} 수정`, "info")}
                    >
                      수정
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => notify(`${c.name} 삭제 확인`, "warning")}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 검수용 핸드오프 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <HandoffContractCard screen={screen} />
        <DialogDock screen={screen} openDialog={openDialog} />
      </div>
    </div>
  );
}

// SCR-P002 상품 등록 — 4단계 가이드 폼 + 좌측 카테고리 + 우측 입력
function ProductRegistrationScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  const [category, setCategory] = useState<
    "MEMBERSHIP" | "LESSON_PASS" | "LOCKER" | "WEAR" | "GENERAL"
  >("LESSON_PASS");
  const [productName, setProductName] = useState("");
  const [cashPrice, setCashPrice] = useState("");
  const [cardPrice, setCardPrice] = useState("");
  const [lessonType, setLessonType] = useState<"PT" | "GX" | "GOLF" | "ETC">(
    "PT",
  );
  const [gxSubType, setGxSubType] = useState("YOGA");
  const [capacity, setCapacity] = useState("1");
  const [validDays, setValidDays] = useState({
    mon: true,
    tue: true,
    wed: true,
    thu: true,
    fri: true,
    sat: false,
    sun: false,
  });
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [holdingAllowed, setHoldingAllowed] = useState(true);
  const [transferAllowed, setTransferAllowed] = useState(true);
  const [pointEnabled, setPointEnabled] = useState(false);
  const [active, setActive] = useState(true);
  const [dirty, setDirty] = useState(false);

  const categories = [
    {
      id: "MEMBERSHIP" as const,
      label: "회원권",
      icon: "🎟",
      color: "border-sky-300 bg-sky-50 text-sky-700",
    },
    {
      id: "LESSON_PASS" as const,
      label: "수강권",
      icon: "🎓",
      color: "border-violet-300 bg-violet-50 text-violet-700",
    },
    {
      id: "LOCKER" as const,
      label: "락커",
      icon: "🔒",
      color: "border-amber-300 bg-amber-50 text-amber-700",
    },
    {
      id: "WEAR" as const,
      label: "운동복",
      icon: "👕",
      color: "border-rose-300 bg-rose-50 text-rose-700",
    },
    {
      id: "GENERAL" as const,
      label: "일반",
      icon: "📦",
      color: "border-slate-300 bg-slate-50 text-slate-700",
    },
  ];

  const canSave =
    productName.trim().length > 0 && Number(cashPrice.replace(/,/g, "")) > 0;
  const allowed = hasPermission(role, "memberWrite");

  // 카드가 검증
  const cardPriceNumber = Number(cardPrice.replace(/,/g, "")) || 0;
  const cashPriceNumber = Number(cashPrice.replace(/,/g, "")) || 0;
  const cardPriceError =
    cardPrice && cardPriceNumber < cashPriceNumber
      ? "카드가는 현금가보다 작을 수 없습니다"
      : "";

  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="신규 상품 등록"
      />

      {/* 진행 상태 안내 */}
      <div className="flex items-center justify-between rounded-2xl border border-sky-200 bg-sky-50/40 px-5 py-3 text-sm">
        <div className="flex items-center gap-3">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-sky-600 text-white text-xs font-bold">
            1
          </span>
          <div>
            <div className="font-bold text-slate-900">신규 상품 등록</div>
            <div className="text-xs text-slate-600">
              상품 구분 → 기본 입력 → 이용 조건 → 옵션 순으로 입력합니다
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {dirty && <Badge variant="warning">미저장 변경 있음</Badge>}
          <Button
            variant="outline"
            size="sm"
            onClick={() => openDialog("DLG-P008-상품가져오기")}
          >
            상품 가져오기
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openDialog("DLG-P012-상품이미지업로드")}
          >
            이미지 업로드
          </Button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
        {/* 좌측: 카테고리 선택 */}
        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">1. 상품 구분</CardTitle>
              <CardDescription className="text-xs">
                상품 대분류 선택
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition-colors",
                    category === cat.id
                      ? cat.color + " font-semibold shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300",
                  )}
                  onClick={() => {
                    setCategory(cat.id);
                    setDirty(true);
                  }}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="flex-1">{cat.label}</span>
                  {category === cat.id && <CheckCircle2 className="size-4" />}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-none border-amber-200 bg-amber-50/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs flex items-center gap-1.5">
                <AlertTriangle className="size-3.5" /> 필수 입력 검증
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-[11px] text-amber-900">
              <div className={productName ? "text-emerald-700" : ""}>
                {productName ? "✓" : "○"} 상품명
              </div>
              <div className={cashPriceNumber > 0 ? "text-emerald-700" : ""}>
                {cashPriceNumber > 0 ? "✓" : "○"} 현금가 (0 초과)
              </div>
              <div
                className={
                  Object.values(validDays).some(Boolean)
                    ? "text-emerald-700"
                    : ""
                }
              >
                {Object.values(validDays).some(Boolean) ? "✓" : "○"} 요일 1개
                이상
              </div>
              {category === "LESSON_PASS" && (
                <div className={capacity ? "text-emerald-700" : ""}>
                  {capacity ? "✓" : "○"} 사용인원 (수강권 필수)
                </div>
              )}
            </CardContent>
          </Card>
        </aside>

        {/* 우측: 입력 폼 */}
        <div className="space-y-5">
          {/* 2. 기본 입력 */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-sm">2. 기본 입력</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label className="text-xs">상품명 *</Label>
                <Input
                  value={productName}
                  onChange={(e) => {
                    setProductName(e.target.value);
                    setDirty(true);
                  }}
                  placeholder="예) PT 20회권"
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  동일 지점 + 동일 상품그룹 내 중복 불가
                </p>
              </div>
              <div>
                <Label className="text-xs">현금가 *</Label>
                <Input
                  value={cashPrice}
                  onChange={(e) => {
                    setCashPrice(e.target.value);
                    setDirty(true);
                  }}
                  placeholder="1,200,000"
                />
              </div>
              <div>
                <Label className="text-xs">카드가</Label>
                <Input
                  value={cardPrice}
                  onChange={(e) => {
                    setCardPrice(e.target.value);
                    setDirty(true);
                  }}
                  placeholder="현금가와 동일 시 미입력"
                  className={cardPriceError ? "border-rose-400" : ""}
                />
                {cardPriceError && (
                  <p className="mt-1 text-[10px] text-rose-600">
                    {cardPriceError}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-xs">상품그룹</Label>
                <Select
                  defaultValue="default"
                  onValueChange={() => setDirty(true)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">기본 그룹</SelectItem>
                    <SelectItem value="vip">VIP 패키지</SelectItem>
                    <SelectItem value="new">신규 한정</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">태그</Label>
                <Input
                  placeholder="시즌특가, 추천 (쉼표 구분)"
                  onChange={() => setDirty(true)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 3. 수강권 세부 (LESSON_PASS만) */}
          {category === "LESSON_PASS" && (
            <Card className="shadow-none border-violet-200">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  🎓 3. 수강권 세부
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label className="text-xs">1단계: 수강권 종류</Label>
                  <Select
                    value={lessonType}
                    onValueChange={(v) => {
                      setLessonType(v as typeof lessonType);
                      setDirty(true);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PT">PT</SelectItem>
                      <SelectItem value="GX">GX (그룹)</SelectItem>
                      <SelectItem value="GOLF">골프</SelectItem>
                      <SelectItem value="ETC">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {lessonType === "GX" && (
                  <div>
                    <Label className="text-xs">2단계: GX 세부종목</Label>
                    <Select
                      value={gxSubType}
                      onValueChange={(v) => {
                        setGxSubType(v);
                        setDirty(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="YOGA">요가</SelectItem>
                        <SelectItem value="PILATES">필라테스</SelectItem>
                        <SelectItem value="SPINNING">스피닝</SelectItem>
                        <SelectItem value="ZUMBA">줌바</SelectItem>
                        <SelectItem value="ETC">GX 기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div>
                  <Label className="text-xs">사용인원 *</Label>
                  <Input
                    value={capacity}
                    onChange={(e) => {
                      setCapacity(e.target.value);
                      setDirty(true);
                    }}
                    placeholder="1"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* 4. 이용 조건 — 요일/시간 */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-sm">
                4. 이용 조건 (요일·시간)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">이용 가능 요일</Label>
                <div className="mt-2 flex gap-1.5">
                  {(
                    ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const
                  ).map((d, i) => (
                    <button
                      key={d}
                      type="button"
                      className={cn(
                        "h-10 w-10 rounded-lg border-2 text-sm font-semibold transition-colors",
                        validDays[d]
                          ? "border-sky-500 bg-sky-100 text-sky-700"
                          : "border-slate-200 bg-white text-slate-400 hover:border-slate-300",
                      )}
                      onClick={() => {
                        setValidDays({ ...validDays, [d]: !validDays[d] });
                        setDirty(true);
                      }}
                    >
                      {["월", "화", "수", "목", "금", "토", "일"][i]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">시작 시간</Label>
                  <Input
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                      setDirty(true);
                    }}
                    placeholder="09:00"
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    10분 단위 입력
                  </p>
                </div>
                <div>
                  <Label className="text-xs">종료 시간</Label>
                  <Input
                    value={endTime}
                    onChange={(e) => {
                      setEndTime(e.target.value);
                      setDirty(true);
                    }}
                    placeholder="18:00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5. 옵션 토글 */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-sm">5. 옵션</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {[
                {
                  label: "홀딩 가능",
                  value: holdingAllowed,
                  setter: setHoldingAllowed,
                },
                {
                  label: "양도 가능",
                  value: transferAllowed,
                  setter: setTransferAllowed,
                },
                {
                  label: "포인트 적립",
                  value: pointEnabled,
                  setter: setPointEnabled,
                },
                { label: "활성 상태", value: active, setter: setActive },
              ].map((opt) => (
                <label
                  key={opt.label}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm"
                >
                  <span className="font-medium text-slate-700">
                    {opt.label}
                  </span>
                  <input
                    type="checkbox"
                    checked={opt.value}
                    onChange={() => {
                      opt.setter(!opt.value);
                      setDirty(true);
                    }}
                    className="h-4 w-4 rounded accent-sky-600"
                  />
                </label>
              ))}
            </CardContent>
          </Card>

          {/* 액션 바 */}
          <div className="sticky bottom-0 flex items-center justify-between rounded-2xl border-2 border-slate-300 bg-white p-4 shadow-lg">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-mono">
                {categories.find((c) => c.id === category)?.label}
              </span>
              <span>·</span>
              <span>{productName || "(상품명 미입력)"}</span>
              <span>·</span>
              <span
                className={
                  cashPriceNumber > 0
                    ? "text-slate-900 font-bold"
                    : "text-rose-600"
                }
              >
                {cashPriceNumber > 0 ? `${cashPrice}원` : "가격 필수"}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                data-dialog-id="DLG-P003-작업취소확인"
                onClick={() =>
                  dirty
                    ? openDialog("DLG-P003-작업취소확인")
                    : notify("취소 mock", "info")
                }
              >
                취소
              </Button>
              <Button
                disabled={!canSave || !!cardPriceError || !allowed}
                onClick={() => {
                  if (!allowed) {
                    notify("권한이 없습니다", "warning");
                    return;
                  }
                  notify(`${productName} 상품 등록 완료 (mock)`, "success");
                  setDirty(false);
                }}
              >
                {allowed ? "등록" : "권한 필요"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 핸드오프 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <HandoffContractCard screen={screen} />
        <DialogDock screen={screen} openDialog={openDialog} />
      </div>
    </div>
  );
}

// SCR-P003 상품 상세/수정 패널 — 슬라이드 패널 시뮬레이션 + 기존 값 + 판매 이력
function ProductDetailPanelScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  const [activeTab, setActiveTab] = useState<
    "basic" | "lesson" | "usage" | "schedule" | "options" | "sales"
  >("basic");
  const [active, setActive] = useState(true);
  const [dirty, setDirty] = useState(false);

  const allowed = hasPermission(role, "memberWrite");
  const salesCount = 32;

  const tabs = [
    { id: "basic" as const, label: "기본 정보" },
    { id: "lesson" as const, label: "수강권 상세" },
    { id: "usage" as const, label: "이용 조건" },
    { id: "schedule" as const, label: "요일/시간" },
    { id: "options" as const, label: "옵션" },
    { id: "sales" as const, label: "판매/운영" },
  ];

  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="상품 수정 슬라이드 패널"
      />

      {/* 패널 헤더 — 슬라이드 패널 시뮬레이션 */}
      <div className="rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50/40 to-white p-5 shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-violet-100 text-2xl">
              🎓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  상품수정 · PT 20회권
                </h2>
                <Badge variant={active ? "success" : "secondary"}>
                  {active ? "활성" : "비활성"}
                </Badge>
                {dirty && <Badge variant="warning">미저장</Badge>}
              </div>
              <p className="mt-1 text-xs text-slate-600">
                수강권 · PT · 사용인원 1명 · 180일 / 20회 · 1,200,000원
              </p>
            </div>
          </div>
          <button
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            onClick={() =>
              dirty
                ? openDialog("DLG-P003-작업취소확인")
                : notify("패널 닫기 mock", "info")
            }
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-1 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              "relative px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "text-violet-700"
                : "text-slate-600 hover:text-slate-900",
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-violet-600" />
            )}
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          {activeTab === "basic" && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-sm">기본 정보</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-xs">상품명</Label>
                  <Input
                    defaultValue="PT 20회권"
                    onChange={() => setDirty(true)}
                  />
                </div>
                <div>
                  <Label className="text-xs">상품그룹</Label>
                  <Input
                    defaultValue="VIP 패키지"
                    onChange={() => setDirty(true)}
                  />
                </div>
                <div>
                  <Label className="text-xs">현금가</Label>
                  <Input
                    defaultValue="1,200,000"
                    onChange={() => setDirty(true)}
                  />
                </div>
                <div>
                  <Label className="text-xs">카드가</Label>
                  <Input
                    defaultValue="1,250,000"
                    onChange={() => setDirty(true)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-xs">설명</Label>
                  <Textarea
                    defaultValue="20회 PT 패키지 · 양도/홀딩 가능 · 포인트 적립"
                    onChange={() => setDirty(true)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "lesson" && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-sm">수강권 상세</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">1단계</Label>
                    <Input defaultValue="PT" disabled />
                  </div>
                  <div>
                    <Label className="text-xs">2단계</Label>
                    <Input defaultValue="-" disabled />
                  </div>
                  <div>
                    <Label className="text-xs">수업시간</Label>
                    <Input
                      defaultValue="50분"
                      onChange={() => setDirty(true)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">유효기간</Label>
                    <Input
                      defaultValue="180일"
                      onChange={() => setDirty(true)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">횟수</Label>
                    <Input
                      defaultValue="20회"
                      onChange={() => setDirty(true)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">수업구분</Label>
                    <Input defaultValue="개인" disabled />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "usage" && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-sm">이용 조건</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">이용구분</Label>
                    <Input defaultValue="횟수+기간" disabled />
                  </div>
                  <div>
                    <Label className="text-xs">기간</Label>
                    <Input
                      defaultValue="180일"
                      onChange={() => setDirty(true)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">횟수/포인트</Label>
                    <Input
                      defaultValue="20회"
                      onChange={() => setDirty(true)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">횟수 제한</Label>
                    <Input
                      defaultValue="일 1회"
                      onChange={() => setDirty(true)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "schedule" && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-sm">요일·시간</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-1.5">
                  {["월", "화", "수", "목", "금", "토", "일"].map((d) => (
                    <span
                      key={d}
                      className={cn(
                        "grid h-10 w-10 place-items-center rounded-lg border-2 text-sm font-semibold",
                        ["월", "화", "수", "목", "금"].includes(d)
                          ? "border-sky-500 bg-sky-100 text-sky-700"
                          : "border-slate-200 bg-white text-slate-400",
                      )}
                    >
                      {d}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">시작 시간</Label>
                    <Input
                      defaultValue="06:00"
                      onChange={() => setDirty(true)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">종료 시간</Label>
                    <Input
                      defaultValue="22:00"
                      onChange={() => setDirty(true)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "options" && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-sm">옵션</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {[
                  { label: "예약 가능", checked: true },
                  { label: "시설 이용", checked: true },
                  { label: "홀딩 가능", checked: true },
                  { label: "양도 가능", checked: true },
                  { label: "포인트 적립", checked: false },
                  { label: "휴회 가능", checked: true },
                  { label: "키오스크 노출", checked: true },
                  { label: "활성 상태", checked: active },
                ].map((opt) => (
                  <label
                    key={opt.label}
                    className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm"
                  >
                    <span className="font-medium text-slate-700">
                      {opt.label}
                    </span>
                    <input
                      type="checkbox"
                      defaultChecked={opt.checked}
                      onChange={() => {
                        if (opt.label === "활성 상태") setActive(!active);
                        setDirty(true);
                      }}
                      className="h-4 w-4 rounded accent-sky-600"
                    />
                  </label>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === "sales" && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-sm">판매·운영 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                    <div className="text-xs text-emerald-700">판매 건수</div>
                    <div className="mt-1 text-2xl font-bold text-emerald-900">
                      {salesCount}건
                    </div>
                  </div>
                  <div className="rounded-lg border border-sky-200 bg-sky-50 p-3">
                    <div className="text-xs text-sky-700">가격 변경 이력</div>
                    <div className="mt-1 text-2xl font-bold text-sky-900">
                      5건
                    </div>
                    <button
                      className="mt-1 text-[10px] font-semibold text-sky-700 hover:underline"
                      onClick={() => openDialog("DLG-P014-가격이력조회")}
                    >
                      전체 보기 →
                    </button>
                  </div>
                  <div className="rounded-lg border border-violet-200 bg-violet-50 p-3">
                    <div className="text-xs text-violet-700">패키지 구성</div>
                    <div className="mt-1 text-2xl font-bold text-violet-900">
                      2개
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                  <b>판매 이력 있음 (32건)</b>: 삭제 시 DLG-P006(비활성화
                  안내)로 전환됩니다. 즉시 삭제 불가.
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 우측: 액션 */}
        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-sm">패널 액션</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                disabled={!allowed}
                onClick={() => {
                  notify("저장 완료 (mock)", "success");
                  setDirty(false);
                }}
              >
                {allowed ? "저장" : "권한 필요"}
              </Button>
              <Button
                className="w-full"
                variant="outline"
                data-dialog-id="DLG-P014-가격이력조회"
                onClick={() => openDialog("DLG-P014-가격이력조회")}
              >
                가격 이력 전체 보기
              </Button>
              <Button
                className="w-full"
                variant="outline"
                data-dialog-id="DLG-P006-비활성화안내"
                onClick={() => openDialog("DLG-P006-비활성화안내")}
              >
                비활성화
              </Button>
              <Button
                className="w-full"
                variant="destructive"
                data-dialog-id="DLG-P005-상품삭제확인"
                disabled={!allowed}
                onClick={() =>
                  allowed
                    ? openDialog(
                        salesCount > 0
                          ? "DLG-P006-비활성화안내"
                          : "DLG-P005-상품삭제확인",
                      )
                    : notify("권한 필요", "warning")
                }
              >
                삭제
              </Button>
              <Button
                className="w-full"
                variant="ghost"
                onClick={() =>
                  dirty
                    ? openDialog("DLG-P003-작업취소확인")
                    : notify("취소 mock", "info")
                }
              >
                취소
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-none border-amber-200 bg-amber-50/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs flex items-center gap-1.5">
                <AlertTriangle className="size-3.5" /> 삭제 정책
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-[11px] text-amber-900">
              <div>판매 이력 0건 → DLG-P005 (즉시 삭제 확인)</div>
              <div>판매 이력 1건 이상 → DLG-P006 (비활성화 안내)</div>
              <div>본사 정의 상품 → 지점에서 수정/삭제 불가</div>
            </CardContent>
          </Card>

          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function DiscountSettingsScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="할인 정책 콘솔"
      />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>할인 정책 목록</CardTitle>
            <CardDescription>
              정률/정액·최소 계약 기간·한도·적용 상품·기간
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <FilterChips filters={screen.filters} notify={notify} />
            <Table>
              <TableHeader>
                <TableRow>
                  {screen.tableColumns.map((c) => (
                    <TableHead key={c}>{c}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {screen.rows.map((row, idx) => (
                  <TableRow key={idx}>
                    {screen.tableColumns.map((c) => (
                      <TableCell key={c}>
                        {statusAwareValue(String(row[c] ?? "-"))}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>할인 액션</CardTitle>
            </CardHeader>
            <CardContent>
              <PrimaryActionRow
                screen={screen}
                role={role}
                openDialog={openDialog}
                notify={notify}
              />
            </CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function ProductCatalogScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  // V2 강조: 카드 카탈로그 미리보기
  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="V2 신규 · 회원 상담용 카탈로그"
      />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>카탈로그 카드</CardTitle>
              <CardDescription>
                1단계 대분류 + GX 2단계 세부종목 배지 · 활성 상품만 자동 노출
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {screen.tabs.map((t) => (
                  <Button
                    key={t}
                    size="sm"
                    variant="outline"
                    onClick={() => notify(`${t} 카탈로그 mock`, "info")}
                  >
                    {t}
                  </Button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {screen.rows.map((row, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="info" className="text-xs">
                        {row["대분류 색상"]}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {row["GX 세부종목 배지"]}
                      </Badge>
                    </div>
                    <h3 className="mt-2 text-lg font-bold">{row["상품명"]}</h3>
                    <p className="mt-1 text-sm text-content-secondary">
                      {row["주요 혜택 요약"]}
                    </p>
                    <div className="mt-3 flex items-baseline justify-between">
                      <div className="text-2xl font-bold text-blue-600">
                        {row["가격(시즌 특가 시 취소선)"]}
                      </div>
                      <div className="text-xs text-content-tertiary">
                        {row["기간/횟수"]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>카탈로그 액션</CardTitle>
            </CardHeader>
            <CardContent>
              <PrimaryActionRow
                screen={screen}
                role={role}
                openDialog={openDialog}
                notify={notify}
              />
            </CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

// ---- D06 시설관리 ----

function LockerManagementScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  const [view, setView] = useState<"박스" | "리스트">("박스");
  // 락커 박스 맵 mock
  const lockerBoxes = Array.from({ length: 24 }).map((_, i) => {
    const num = `A-${100 + i}`;
    const states = [
      "사용중",
      "사용중",
      "사용중",
      "빈",
      "만료 임박",
      "사용중",
      "빈",
      "고장",
      "사용중",
    ];
    const state = states[i % states.length];
    return { 락커: num, 상태: state };
  });
  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="박스 뷰/리스트 뷰 · 일괄 배정"
      />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>락커 맵</CardTitle>
                <div className="flex gap-1">
                  {(["박스", "리스트"] as const).map((v) => (
                    <Button
                      key={v}
                      size="sm"
                      variant={view === v ? "default" : "outline"}
                      onClick={() => setView(v)}
                    >
                      {v} 뷰
                    </Button>
                  ))}
                </div>
              </div>
              <CardDescription>구역별 · 색상으로 상태 식별</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <FilterChips filters={screen.filters} notify={notify} />
              {view === "박스" ? (
                <div className="grid grid-cols-6 md:grid-cols-8 gap-2">
                  {lockerBoxes.map((box) => {
                    const tone =
                      box.상태 === "사용중"
                        ? "border-blue-300 bg-blue-50 text-blue-700"
                        : box.상태 === "빈"
                          ? "border-slate-200 bg-surface-secondary text-content-tertiary"
                          : box.상태 === "만료 임박"
                            ? "border-amber-300 bg-amber-50 text-amber-700"
                            : "border-rose-200 bg-rose-50 text-rose-700 opacity-70";
                    return (
                      <button
                        key={box.락커}
                        type="button"
                        onClick={() => notify(`${box.락커} 상세 mock`, "info")}
                        className={cn(
                          "aspect-square rounded-lg border p-2 text-center text-xs font-semibold transition hover:-translate-y-0.5",
                          tone,
                        )}
                      >
                        <div>{box.락커}</div>
                        <div className="mt-1 text-[10px] opacity-75">
                          {box.상태}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      {screen.tableColumns.slice(0, 7).map((c) => (
                        <TableHead key={c}>{c}</TableHead>
                      ))}
                      <TableHead>액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {screen.rows.map((row, idx) => (
                      <TableRow key={idx}>
                        {screen.tableColumns.slice(0, 7).map((c) => (
                          <TableCell key={c}>
                            {statusAwareValue(String(row[c] ?? "-"))}
                          </TableCell>
                        ))}
                        <TableCell className="text-xs">{row["액션"]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>락커 처리</CardTitle>
              <CardDescription>배정·이동·회수·고장</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <PrimaryActionRow
                screen={screen}
                role={role}
                openDialog={openDialog}
                notify={notify}
              />
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>색상 범례</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {[
                {
                  name: "사용중",
                  tone: "bg-blue-50 border-blue-300 text-blue-700",
                },
                {
                  name: "빈",
                  tone: "bg-surface-secondary border-slate-200 text-content-tertiary",
                },
                {
                  name: "만료 임박",
                  tone: "bg-amber-50 border-amber-300 text-amber-700",
                },
                {
                  name: "고장",
                  tone: "bg-rose-50 border-rose-200 text-rose-700",
                },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-block size-4 rounded border",
                      item.tone,
                    )}
                  />{" "}
                  <span>{item.name}</span>
                </div>
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

function LockerAssignmentScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  // V2 신규: 일일/개인/골프 사물함 탭
  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="V2 신규 · 실시간 사물함 그리드"
      />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>유형 탭 + 그리드</CardTitle>
              <CardDescription>회원 검색 → 빈 사물함 즉시 배정</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {screen.tabs.map((t) => (
                  <Button
                    key={t}
                    size="sm"
                    variant="outline"
                    onClick={() => notify(`${t} mock`, "info")}
                  >
                    {t}
                  </Button>
                ))}
              </div>
              <FilterChips filters={screen.filters} notify={notify} />
              <Table>
                <TableHeader>
                  <TableRow>
                    {screen.tableColumns.map((c) => (
                      <TableHead key={c}>{c}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {screen.rows.map((row, idx) => (
                    <TableRow key={idx}>
                      {screen.tableColumns.map((c) => (
                        <TableCell key={c}>
                          {statusAwareValue(String(row[c] ?? "-"))}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>배정 액션</CardTitle>
            </CardHeader>
            <CardContent>
              <PrimaryActionRow
                screen={screen}
                role={role}
                openDialog={openDialog}
                notify={notify}
              />
            </CardContent>
          </Card>
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function ExerciseRoomScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  // admin-pando exercise-rooms 패턴 + 운영자 UX: V2 신규
  // 룸 카드 그리드 + 시간대 슬롯 보드 + 운영/점검/고장 토글 + 게이트 매핑
  type RoomStatus = "operating" | "maintenance" | "broken" | "closed";
  type RoomType = "GX" | "PT" | "GOLF" | "PILATES" | "SPINNING" | "YOGA";
  type Room = {
    id: number;
    name: string;
    type: RoomType;
    capacity: number;
    gate: string;
    status: RoomStatus;
    todaySlots: { time: string; occupied: number; class?: string }[];
  };

  const typeMeta: Record<RoomType, { label: string; color: string }> = {
    GX: {
      label: "GX",
      color: "bg-violet-100 text-violet-700 border-violet-200",
    },
    PT: {
      label: "PT",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    GOLF: {
      label: "골프",
      color: "bg-amber-100 text-amber-700 border-amber-200",
    },
    PILATES: {
      label: "필라테스",
      color: "bg-pink-100 text-pink-700 border-pink-200",
    },
    SPINNING: {
      label: "스피닝",
      color: "bg-cyan-100 text-cyan-700 border-cyan-200",
    },
    YOGA: { label: "요가", color: "bg-blue-100 text-blue-700 border-blue-200" },
  };

  const statusMeta: Record<
    RoomStatus,
    {
      label: string;
      variant: "success" | "warning" | "destructive" | "secondary";
    }
  > = {
    operating: { label: "운영 중", variant: "success" },
    maintenance: { label: "점검 중", variant: "warning" },
    broken: { label: "고장", variant: "destructive" },
    closed: { label: "임시 폐쇄", variant: "secondary" },
  };

  const initialRooms: Room[] = [
    {
      id: 1,
      name: "A룸 (메인 GX)",
      type: "GX",
      capacity: 25,
      gate: "G-001",
      status: "operating",
      todaySlots: [
        { time: "07:00", occupied: 18, class: "모닝 요가" },
        { time: "10:00", occupied: 22, class: "줌바" },
        { time: "14:00", occupied: 0 },
        { time: "19:00", occupied: 25, class: "필라테스" },
      ],
    },
    {
      id: 2,
      name: "B룸 (PT 1)",
      type: "PT",
      capacity: 4,
      gate: "G-002",
      status: "operating",
      todaySlots: [
        { time: "08:00", occupied: 2, class: "한트레이너 1:1" },
        { time: "11:00", occupied: 4, class: "한트레이너 그룹" },
        { time: "15:00", occupied: 3, class: "윤트레이너 그룹" },
        { time: "20:00", occupied: 1, class: "한트레이너 1:1" },
      ],
    },
    {
      id: 3,
      name: "C룸 (PT 2)",
      type: "PT",
      capacity: 4,
      gate: "G-003",
      status: "maintenance",
      todaySlots: [{ time: "전일", occupied: 0 }],
    },
    {
      id: 4,
      name: "골프 시뮬레이터 1",
      type: "GOLF",
      capacity: 2,
      gate: "G-004",
      status: "operating",
      todaySlots: [
        { time: "09:00", occupied: 2, class: "정트레이너 레슨" },
        { time: "13:00", occupied: 1 },
        { time: "17:00", occupied: 2, class: "오프로 레슨" },
        { time: "20:00", occupied: 1 },
      ],
    },
    {
      id: 5,
      name: "골프 시뮬레이터 2",
      type: "GOLF",
      capacity: 2,
      gate: "G-005",
      status: "broken",
      todaySlots: [{ time: "수리 중", occupied: 0 }],
    },
    {
      id: 6,
      name: "스피닝 룸",
      type: "SPINNING",
      capacity: 16,
      gate: "G-006",
      status: "operating",
      todaySlots: [
        { time: "07:30", occupied: 14, class: "모닝 스피닝" },
        { time: "19:30", occupied: 16, class: "이브닝 스피닝" },
      ],
    },
    {
      id: 7,
      name: "필라테스 룸",
      type: "PILATES",
      capacity: 8,
      gate: "G-007",
      status: "operating",
      todaySlots: [
        { time: "09:30", occupied: 7, class: "기초 필라테스" },
        { time: "14:30", occupied: 8, class: "리포머 필라테스" },
        { time: "18:30", occupied: 5, class: "고급 필라테스" },
      ],
    },
    {
      id: 8,
      name: "요가 룸",
      type: "YOGA",
      capacity: 12,
      gate: "G-008",
      status: "closed",
      todaySlots: [{ time: "전일", occupied: 0 }],
    },
  ];

  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [filterType, setFilterType] = useState<RoomType | "">("");
  const [filterStatus, setFilterStatus] = useState<RoomStatus | "">("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const filtered = rooms.filter((r) => {
    const matchType = !filterType || r.type === filterType;
    const matchStatus = !filterStatus || r.status === filterStatus;
    return matchType && matchStatus;
  });

  const operatingCount = rooms.filter((r) => r.status === "operating").length;
  const maintenanceCount = rooms.filter(
    (r) => r.status === "maintenance",
  ).length;
  const brokenCount = rooms.filter((r) => r.status === "broken").length;
  const totalCapacity = rooms.reduce((s, r) => s + r.capacity, 0);
  const currentOccupied = rooms.reduce(
    (s, r) => s + r.todaySlots.reduce((ss, slot) => ss + slot.occupied, 0),
    0,
  );

  const canManage =
    role === "OWNER" || role === "HQ_ADMIN" || role === "MANAGER";

  const changeStatus = (roomId: number, newStatus: RoomStatus) => {
    setRooms((curr) =>
      curr.map((r) => (r.id === roomId ? { ...r, status: newStatus } : r)),
    );
    notify(
      `운영 상태 변경: ${statusMeta[newStatus].label}`,
      newStatus === "operating" ? "success" : "warning",
    );
  };

  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="V2 신규 · 운동룸 카드 보드 + 게이트 매핑"
      />

      {/* 통계 카드 4종 */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" /> 운영 중
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums text-emerald-600">
              {operatingCount}룸
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">
              전체 {rooms.length}룸 중
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <Clock size={14} className="text-amber-600" /> 점검 중
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums text-amber-600">
              {maintenanceCount}룸
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">일시 정지</p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-rose-600" /> 고장/폐쇄
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums text-rose-600">
              {brokenCount + rooms.filter((r) => r.status === "closed").length}
              룸
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">예약 차단</p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <UserRound size={14} className="text-blue-600" /> 오늘 이용자
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums text-blue-600">
              {currentOccupied}명
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">
              정원 합 {totalCapacity}명
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>운동룸 현황 ({filtered.length}룸)</CardTitle>
                <Button
                  size="sm"
                  disabled={!canManage}
                  onClick={() =>
                    canManage
                      ? notify("새 룸 등록 모달 mock", "info")
                      : notify("매니저 이상 권한 필요", "warning")
                  }
                >
                  + 룸 등록
                </Button>
              </div>
              <CardDescription>
                유형별 운영 상태 · 게이트 매핑 · 시간대별 예약 슬롯
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* 필터 */}
              <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
                <div>
                  <Label className="text-[10px] text-content-tertiary mb-1 block">
                    유형
                  </Label>
                  <Select
                    value={filterType}
                    onValueChange={(v) => setFilterType(v as RoomType | "")}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="전체 유형" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {(Object.keys(typeMeta) as RoomType[]).map((t) => (
                        <SelectItem key={t} value={t}>
                          {typeMeta[t].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[10px] text-content-tertiary mb-1 block">
                    운영 상태
                  </Label>
                  <Select
                    value={filterStatus}
                    onValueChange={(v) => setFilterStatus(v as RoomStatus | "")}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="전체 상태" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {(Object.keys(statusMeta) as RoomStatus[]).map((s) => (
                        <SelectItem key={s} value={s}>
                          {statusMeta[s].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setFilterType("");
                    setFilterStatus("");
                  }}
                >
                  초기화
                </Button>
              </div>

              {/* 룸 카드 그리드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filtered.map((room) => {
                  const typeCfg = typeMeta[room.type];
                  const statusCfg = statusMeta[room.status];
                  const isAvailable = room.status === "operating";
                  return (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={cn(
                        "rounded-xl border p-3 text-left transition-all",
                        isAvailable
                          ? "bg-white hover:border-primary hover:shadow-md"
                          : "bg-surface-secondary opacity-70",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={cn(
                            "inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border",
                            typeCfg.color,
                          )}
                        >
                          {typeCfg.label}
                        </span>
                        <Badge
                          variant={statusCfg.variant}
                          className="text-[10px]"
                        >
                          {statusCfg.label}
                        </Badge>
                      </div>
                      <h3 className="mt-2 font-semibold text-sm">
                        {room.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-content-tertiary">
                        <span>정원 {room.capacity}</span>
                        <span>·</span>
                        <span>게이트 {room.gate}</span>
                      </div>
                      <div className="mt-2 space-y-1">
                        {room.todaySlots.slice(0, 3).map((slot, sidx) => (
                          <div
                            key={sidx}
                            className="flex items-center justify-between text-[10px]"
                          >
                            <span className="font-mono text-content-tertiary">
                              {slot.time}
                            </span>
                            <div className="flex items-center gap-1">
                              <div className="h-1.5 w-12 overflow-hidden rounded-full bg-surface-tertiary">
                                <div
                                  className={cn(
                                    "h-full",
                                    slot.occupied === 0
                                      ? "bg-slate-300"
                                      : slot.occupied >= room.capacity
                                        ? "bg-rose-500"
                                        : slot.occupied >= room.capacity * 0.7
                                          ? "bg-amber-500"
                                          : "bg-emerald-500",
                                  )}
                                  style={{
                                    width: `${Math.min((slot.occupied / room.capacity) * 100, 100)}%`,
                                  }}
                                />
                              </div>
                              <span className="font-semibold tabular-nums w-12 text-right">
                                {slot.occupied}/{room.capacity}
                              </span>
                            </div>
                          </div>
                        ))}
                        {room.todaySlots.length > 3 && (
                          <p className="text-[10px] text-content-tertiary">
                            +{room.todaySlots.length - 3}개 슬롯
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              {filtered.length === 0 && (
                <div className="py-12 text-center text-sm text-content-tertiary">
                  조건에 맞는 룸이 없습니다.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>룸 액션</CardTitle>
              <CardDescription>운영 상태 변경·게이트 매핑</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                disabled={!canManage}
                onClick={() =>
                  canManage
                    ? notify("새 룸 등록 mock", "info")
                    : notify("매니저 이상 권한 필요", "warning")
                }
              >
                + 룸 등록
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => notify("게이트 매핑 화면 이동 mock", "info")}
              >
                게이트 매핑 관리
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => notify("운영 시간 정책 mock", "info")}
              >
                운영 시간 정책
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => notify("CSV 내보내기 mock", "info")}
              >
                CSV 내보내기
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>상태 색상 범례</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-xs">
              {(Object.keys(statusMeta) as RoomStatus[]).map((s) => (
                <div
                  key={s}
                  className="flex items-center justify-between gap-2 rounded-lg border bg-white px-2 py-1.5"
                >
                  <Badge
                    variant={statusMeta[s].variant}
                    className="text-[10px]"
                  >
                    {statusMeta[s].label}
                  </Badge>
                  <span className="text-content-tertiary text-[10px]">
                    {s === "operating" && "예약 가능"}
                    {s === "maintenance" && "일시 정지 (예약 차단)"}
                    {s === "broken" && "수리 필요 (예약 차단)"}
                    {s === "closed" && "임시 폐쇄"}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>

      {/* 룸 상세 모달 */}
      {selectedRoom && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedRoom(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl border w-full max-w-[560px] max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={cn(
                        "inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border",
                        typeMeta[selectedRoom.type].color,
                      )}
                    >
                      {typeMeta[selectedRoom.type].label}
                    </span>
                    <Badge
                      variant={statusMeta[selectedRoom.status].variant}
                      className="text-[10px]"
                    >
                      {statusMeta[selectedRoom.status].label}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold">{selectedRoom.name}</h3>
                  <p className="text-xs text-content-tertiary mt-1">
                    정원 {selectedRoom.capacity}명 · 게이트 {selectedRoom.gate}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRoom(null)}
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {/* 운영 상태 토글 */}
              <div>
                <Label className="text-xs font-semibold mb-2 block">
                  운영 상태 변경
                </Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(Object.keys(statusMeta) as RoomStatus[]).map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={
                        selectedRoom.status === s ? "default" : "outline"
                      }
                      disabled={!canManage}
                      onClick={() => {
                        changeStatus(selectedRoom.id, s);
                        setSelectedRoom({ ...selectedRoom, status: s });
                      }}
                    >
                      {statusMeta[s].label}
                    </Button>
                  ))}
                </div>
                {!canManage && (
                  <p className="text-[10px] text-amber-600 mt-1">
                    매니저 이상 권한 필요
                  </p>
                )}
              </div>

              {/* 시간대 슬롯 */}
              <div>
                <Label className="text-xs font-semibold mb-2 block">
                  오늘 시간대별 예약 슬롯
                </Label>
                <div className="space-y-1.5">
                  {selectedRoom.todaySlots.map((slot, sidx) => {
                    const ratio =
                      selectedRoom.capacity > 0
                        ? Math.min(
                            (slot.occupied / selectedRoom.capacity) * 100,
                            100,
                          )
                        : 0;
                    return (
                      <div
                        key={sidx}
                        className="rounded-lg border p-2.5 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-semibold w-16">
                            {slot.time}
                          </span>
                          {slot.class && (
                            <span className="text-xs text-content-tertiary">
                              {slot.class}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-20 overflow-hidden rounded-full bg-surface-tertiary">
                            <div
                              className={cn(
                                "h-full",
                                slot.occupied === 0
                                  ? "bg-slate-300"
                                  : slot.occupied >= selectedRoom.capacity
                                    ? "bg-rose-500"
                                    : slot.occupied >=
                                        selectedRoom.capacity * 0.7
                                      ? "bg-amber-500"
                                      : "bg-emerald-500",
                              )}
                              style={{ width: `${ratio}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold tabular-nums w-14 text-right">
                            {slot.occupied}/{selectedRoom.capacity}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  notify(`${selectedRoom.name} 예약 캘린더 이동`, "info");
                  setSelectedRoom(null);
                }}
              >
                예약 캘린더
              </Button>
              <Button onClick={() => setSelectedRoom(null)}>닫기</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- D07 직원관리 ----

function StaffListScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  // admin-pando /staff/page.tsx 구조 1:1 이식
  // 통계 카드 4종 + 검색/필터 + 직원 원장 + 직무 배지 + 재직 상태 배지
  // docs4 V1/V2 D07-직원관리 컨텐츠 반영
  type StaffRole = "primary" | "owner" | "manager" | "fc" | "trainer" | "staff";
  type StaffStatus = "active" | "leave" | "locked" | "resigned";

  const roleConfig: Record<StaffRole, { label: string; className: string }> = {
    primary: {
      label: "최고관리자",
      className: "bg-rose-100 text-rose-700 border-rose-300",
    },
    owner: {
      label: "센터장",
      className: "bg-orange-100 text-orange-700 border-orange-300",
    },
    manager: {
      label: "매니저",
      className: "bg-violet-100 text-violet-700 border-violet-300",
    },
    fc: { label: "FC", className: "bg-blue-100 text-blue-700 border-blue-300" },
    trainer: {
      label: "트레이너",
      className: "bg-emerald-100 text-emerald-700 border-emerald-300",
    },
    staff: {
      label: "스태프",
      className: "bg-slate-100 text-slate-700 border-slate-300",
    },
  };

  const statusConfig: Record<
    StaffStatus,
    {
      label: string;
      variant: "success" | "warning" | "destructive" | "secondary";
    }
  > = {
    active: { label: "재직", variant: "success" },
    leave: { label: "휴직", variant: "warning" },
    locked: { label: "잠금", variant: "warning" },
    resigned: { label: "퇴사", variant: "secondary" },
  };

  type StaffRow = {
    id: number;
    name: string;
    role: StaffRole;
    branchName: string;
    contact: string;
    email: string;
    joinDate: string;
    status: StaffStatus;
    memo: string;
  };

  const staffData: StaffRow[] = [
    {
      id: 1,
      name: "김본사",
      role: "primary",
      branchName: "본사 통합",
      contact: "010-0000-0001",
      email: "primary@pando.com",
      joinDate: "2023-01-02",
      status: "active",
      memo: "본사 최고 운영 책임자",
    },
    {
      id: 2,
      name: "이센터",
      role: "owner",
      branchName: "강남점",
      contact: "010-1111-0001",
      email: "owner.gangnam@pando.com",
      joinDate: "2023-03-10",
      status: "active",
      memo: "강남점 OPEN 책임자, 매출 책임 권한",
    },
    {
      id: 3,
      name: "박매니저",
      role: "manager",
      branchName: "강남점",
      contact: "010-2222-0001",
      email: "manager.gn@pando.com",
      joinDate: "2024-02-14",
      status: "active",
      memo: "회원 운영·POS 업무 담당",
    },
    {
      id: 4,
      name: "최FC",
      role: "fc",
      branchName: "강남점",
      contact: "010-3333-0001",
      email: "fc.gn1@pando.com",
      joinDate: "2024-08-01",
      status: "active",
      memo: "신규 회원 상담 전문",
    },
    {
      id: 5,
      name: "정FC",
      role: "fc",
      branchName: "강남점",
      contact: "010-3333-0002",
      email: "fc.gn2@pando.com",
      joinDate: "2025-01-15",
      status: "leave",
      memo: "5/15~6/15 육아 휴직",
    },
    {
      id: 6,
      name: "한트레이너",
      role: "trainer",
      branchName: "강남점",
      contact: "010-4444-0001",
      email: "tr.gn1@pando.com",
      joinDate: "2024-05-20",
      status: "active",
      memo: "PT 20회 · 골프 시뮬레이터 담당",
    },
    {
      id: 7,
      name: "윤트레이너",
      role: "trainer",
      branchName: "서초점",
      contact: "010-4444-0002",
      email: "tr.sc1@pando.com",
      joinDate: "2025-03-01",
      status: "active",
      memo: "GX 요가·필라테스 전담",
    },
    {
      id: 8,
      name: "장스태프",
      role: "staff",
      branchName: "서초점",
      contact: "010-5555-0001",
      email: "staff.sc1@pando.com",
      joinDate: "2025-09-12",
      status: "active",
      memo: "프론트·POS 보조",
    },
    {
      id: 9,
      name: "오트레이너",
      role: "trainer",
      branchName: "잠실점",
      contact: "010-4444-0003",
      email: "tr.js1@pando.com",
      joinDate: "2024-11-08",
      status: "active",
      memo: "PT + 골프프로 자격",
    },
    {
      id: 10,
      name: "임스태프",
      role: "staff",
      branchName: "잠실점",
      contact: "010-5555-0002",
      email: "staff.js1@pando.com",
      joinDate: "2024-04-22",
      status: "resigned",
      memo: "2026-04-30 퇴사",
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<StaffRole | "">("");
  const [filterStatus, setFilterStatus] = useState<StaffStatus | "">("");
  const [filterBranch, setFilterBranch] = useState<string>("");

  const filtered = staffData.filter((s) => {
    const matchSearch =
      !searchQuery ||
      s.name.includes(searchQuery) ||
      s.contact.includes(searchQuery) ||
      s.branchName.includes(searchQuery);
    const matchRole = !filterRole || s.role === filterRole;
    const matchStatus = !filterStatus || s.status === filterStatus;
    const matchBranch = !filterBranch || s.branchName === filterBranch;
    return matchSearch && matchRole && matchStatus && matchBranch;
  });

  const totalCount = staffData.length;
  const activeCount = staffData.filter((s) => s.status === "active").length;
  const leaveCount = staffData.filter((s) => s.status === "leave").length;
  const resignedCount = staffData.filter((s) => s.status === "resigned").length;

  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="재직·휴직·퇴사 · 직원 1명 = 계정 1개"
      />

      {/* 통계 카드 4종 (admin-pando StatCardGrid 패턴) */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <UserRound size={14} /> 전체 직원
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {totalCount}명
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">전 지점 합산</p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" /> 재직
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums text-emerald-600">
              {activeCount}명
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">활성 계정</p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <Clock size={14} className="text-amber-600" /> 휴직/잠금
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums text-amber-600">
              {leaveCount}명
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">일시 비활성</p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <LogOut size={14} className="text-slate-500" /> 퇴사
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums text-slate-600">
              {resignedCount}명
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">90일 후 PII 마스킹</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>직원 원장</CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => notify("엑셀 내보내기 mock", "info")}
                  >
                    내보내기
                  </Button>
                  <Button size="sm" onClick={() => openDialog("DLG-H001")}>
                    직원 등록
                  </Button>
                </div>
              </div>
              <CardDescription>
                총 {filtered.length}명 · 직무 배지 6종 · 재직 상태 4종
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* 검색 & 필터 */}
              <div className="grid grid-cols-[2fr_repeat(3,1fr)_auto] gap-2 items-end">
                <div>
                  <Label className="text-[10px] text-content-tertiary mb-1 block">
                    검색
                  </Label>
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary"
                    />
                    <Input
                      placeholder="이름·연락처·지점"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-[10px] text-content-tertiary mb-1 block">
                    직무
                  </Label>
                  <Select
                    value={filterRole}
                    onValueChange={(v) => setFilterRole(v as StaffRole | "")}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {(Object.keys(roleConfig) as StaffRole[]).map((r) => (
                        <SelectItem key={r} value={r}>
                          {roleConfig[r].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[10px] text-content-tertiary mb-1 block">
                    재직 상태
                  </Label>
                  <Select
                    value={filterStatus}
                    onValueChange={(v) =>
                      setFilterStatus(v as StaffStatus | "")
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {(Object.keys(statusConfig) as StaffStatus[]).map((s) => (
                        <SelectItem key={s} value={s}>
                          {statusConfig[s].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[10px] text-content-tertiary mb-1 block">
                    소속
                  </Label>
                  <Select value={filterBranch} onValueChange={setFilterBranch}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {branches.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterRole("");
                    setFilterStatus("");
                    setFilterBranch("");
                  }}
                >
                  초기화
                </Button>
              </div>

              {/* 직원 테이블 */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">No</TableHead>
                    <TableHead>직원</TableHead>
                    <TableHead>소속 지점</TableHead>
                    <TableHead>직무</TableHead>
                    <TableHead>연락처</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>입사일</TableHead>
                    <TableHead className="w-20 text-center">상태</TableHead>
                    <TableHead>메모</TableHead>
                    <TableHead className="w-24 text-center">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((s) => {
                    const roleCfg = roleConfig[s.role];
                    const statusCfg = statusConfig[s.status];
                    return (
                      <TableRow key={s.id}>
                        <TableCell className="text-center text-xs">
                          {s.id}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {s.name}
                        </TableCell>
                        <TableCell className="text-xs">
                          {s.branchName}
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border",
                              roleCfg.className,
                            )}
                          >
                            {roleCfg.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs tabular-nums">
                          {s.contact}
                        </TableCell>
                        <TableCell className="text-xs text-content-tertiary truncate max-w-[180px]">
                          {s.email}
                        </TableCell>
                        <TableCell className="text-xs tabular-nums">
                          {s.joinDate}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={statusCfg.variant}
                            className="text-[10px]"
                          >
                            {statusCfg.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-content-tertiary truncate max-w-[180px]">
                          {s.memo}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex gap-1 justify-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                notify(`${s.name} 정보 수정`, "info")
                              }
                            >
                              수정
                            </Button>
                            {s.status !== "resigned" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  notify(`${s.name} 퇴사 처리 확인`, "warning")
                                }
                              >
                                퇴사
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {filtered.length === 0 && (
                <div className="py-12 text-center text-sm text-content-tertiary">
                  조건에 맞는 직원이 없습니다.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>인사 액션</CardTitle>
              <CardDescription>등록·수정·퇴사·계정 잠금</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <PrimaryActionRow
                screen={screen}
                role={role}
                openDialog={openDialog}
                notify={notify}
              />
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>직무 정책 (참고)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-xs">
              {(Object.keys(roleConfig) as StaffRole[]).map((r) => (
                <div
                  key={r}
                  className="flex items-center justify-between gap-2 rounded-lg border bg-white px-2 py-1.5"
                >
                  <span
                    className={cn(
                      "inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border",
                      roleConfig[r].className,
                    )}
                  >
                    {roleConfig[r].label}
                  </span>
                  <span className="text-content-tertiary text-[10px]">
                    {r === "primary" && "본사 전 지점 · 위험 액션"}
                    {r === "owner" && "지점 전체 · 위험 액션"}
                    {r === "manager" && "지점 운영 · 회원/매출"}
                    {r === "fc" && "담당 회원 · 상담·등록"}
                    {r === "trainer" && "담당 회원 · PT·체성분"}
                    {r === "staff" && "조회·POS 보조"}
                  </span>
                </div>
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

// SCR-062 직원 퇴사 처리 — 4단계 마법사 (퇴사일·인계·스케줄·계정 비활성화)
function StaffResignationScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [resignDate, setResignDate] = useState("2026-06-30");
  const [immediate, setImmediate] = useState(false);
  const [reason, setReason] = useState<
    "VOLUNTARY" | "RECOMMENDED" | "CONTRACT_END" | "ETC"
  >("VOLUNTARY");
  const [reasonDetail, setReasonDetail] = useState("");
  const [handoffs, setHandoffs] = useState({
    members: "",
    lessons: "",
    contracts: "",
    ot: "",
  });
  const [confirmText, setConfirmText] = useState("");

  const allowedOwnerPlus = ["HQ_ADMIN", "OWNER"].includes(role);
  const targetEmployee = {
    name: "박트레이너",
    role: "트레이너",
    joinDate: "2024-03-15",
    tenure: "2년 2개월",
    members: 23,
    lessons: 18,
    contracts: 5,
    ot: 7,
  };

  const conflicts =
    step === 3
      ? [
          {
            type: "수업 충돌",
            item: "PT 수업 (6/15 14:00) - 인계자 미지정",
            severity: "block" as const,
          },
          {
            type: "개인 일정",
            item: "팀 회의 (6/28 10:00) - 자동 삭제 예정",
            severity: "warn" as const,
          },
        ]
      : [];
  const hasBlockingConflict = conflicts.some((c) => c.severity === "block");

  const stepValid = {
    1: resignDate.length > 0 && (reason !== "ETC" || reasonDetail.length > 0),
    2: Object.values(handoffs).every((v) => v.length > 0),
    3: !hasBlockingConflict,
    4: confirmText === "퇴사처리",
  };

  const goNext = () => {
    if (!stepValid[step]) {
      notify(`${step}단계: 필수 입력을 모두 완료하세요`, "warning");
      return;
    }
    if (step < 4) setStep((step + 1) as 1 | 2 | 3 | 4);
  };

  const reasonLabels = {
    VOLUNTARY: "자발 퇴사",
    RECOMMENDED: "권고 사직",
    CONTRACT_END: "계약 만료",
    ETC: "기타",
  };

  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="4단계 마법사"
      />

      {!allowedOwnerPlus && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <Lock className="mr-2 inline size-4" />
          <b>접근 권한 없음:</b> 직원 퇴사 처리는 Owner+ 권한만 실행 가능합니다.
          현재 역할로는 검수 목적 조회만 가능합니다.
        </div>
      )}

      {/* 대상 직원 카드 */}
      <Card className="shadow-none border-rose-200 bg-rose-50/30">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-rose-100 text-xl">
              👤
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  {targetEmployee.name}
                </h3>
                <Badge variant="outline">{targetEmployee.role}</Badge>
                <Badge variant="info">재직 중</Badge>
              </div>
              <p className="mt-1 text-xs text-slate-600">
                입사일 {targetEmployee.joinDate} · 재직 {targetEmployee.tenure}{" "}
                · 담당 회원 {targetEmployee.members}명
              </p>
            </div>
          </div>
          <div className="flex gap-4 text-center text-xs">
            <div>
              <div className="font-bold text-slate-900">
                {targetEmployee.members}
              </div>
              <div className="text-slate-500">회원</div>
            </div>
            <div>
              <div className="font-bold text-slate-900">
                {targetEmployee.lessons}
              </div>
              <div className="text-slate-500">수업</div>
            </div>
            <div>
              <div className="font-bold text-slate-900">
                {targetEmployee.contracts}
              </div>
              <div className="text-slate-500">계약</div>
            </div>
            <div>
              <div className="font-bold text-slate-900">
                {targetEmployee.ot}
              </div>
              <div className="text-slate-500">OT</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step indicator */}
      <div className="flex items-center justify-between gap-2 rounded-2xl border bg-white p-4">
        {[
          { n: 1, label: "퇴사일 설정", icon: "📅" },
          { n: 2, label: "인수인계", icon: "🤝" },
          { n: 3, label: "스케줄 정리", icon: "📋" },
          { n: 4, label: "계정 비활성화", icon: "🔒" },
        ].map((s, idx) => (
          <div key={s.n} className="flex flex-1 items-center gap-2">
            <button
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors",
                step === s.n
                  ? "bg-sky-100 text-sky-900 font-bold"
                  : step > s.n
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-50 text-slate-400",
              )}
              onClick={() => step >= s.n && setStep(s.n as 1 | 2 | 3 | 4)}
            >
              <span
                className={cn(
                  "grid h-7 w-7 place-items-center rounded-full text-xs font-bold",
                  step === s.n
                    ? "bg-sky-600 text-white"
                    : step > s.n
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-300 text-white",
                )}
              >
                {step > s.n ? "✓" : s.n}
              </span>
              <div className="text-xs">
                <div className="font-bold">{s.label}</div>
                <div className="text-[10px] opacity-75">{s.icon}</div>
              </div>
            </button>
            {idx < 3 && (
              <div
                className={cn(
                  "h-px flex-1",
                  step > s.n ? "bg-emerald-300" : "bg-slate-200",
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          {/* Step 1: 퇴사일 설정 */}
          {step === 1 && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-sm">
                  1단계: 퇴사일·사유 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">퇴사 예정일 *</Label>
                    <Input
                      type="date"
                      value={resignDate}
                      onChange={(e) => setResignDate(e.target.value)}
                      disabled={immediate}
                    />
                    <p className="mt-1 text-[10px] text-slate-500">
                      미래 퇴사 → 확정일까지 예약 상태
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs">즉시 퇴사 여부</Label>
                    <label className="mt-2 flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <input
                        type="checkbox"
                        checked={immediate}
                        onChange={(e) => setImmediate(e.target.checked)}
                        className="h-4 w-4 accent-rose-600"
                      />
                      <span className="text-sm">
                        즉시 계정 비활성·로그인 종료
                      </span>
                    </label>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">퇴사 사유 *</Label>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {(
                      Object.keys(reasonLabels) as Array<
                        keyof typeof reasonLabels
                      >
                    ).map((r) => (
                      <button
                        key={r}
                        className={cn(
                          "rounded-lg border-2 px-3 py-2 text-xs font-semibold transition-colors",
                          reason === r
                            ? "border-rose-500 bg-rose-50 text-rose-900"
                            : "border-slate-200 bg-white text-slate-600",
                        )}
                        onClick={() => setReason(r)}
                      >
                        {reasonLabels[r]}
                      </button>
                    ))}
                  </div>
                </div>
                {reason === "ETC" && (
                  <div>
                    <Label className="text-xs">기타 사유 상세 *</Label>
                    <Textarea
                      value={reasonDetail}
                      onChange={(e) => setReasonDetail(e.target.value)}
                      placeholder="기타 사유 상세 입력"
                      rows={2}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: 인수인계 */}
          {step === 2 && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-sm">
                  2단계: 미완료 업무 인계자 지정 *
                </CardTitle>
                <CardDescription className="text-xs">
                  시스템 자동 선택 없음. 운영자가 4종 모두 명시 지정 필요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    key: "members" as const,
                    label: "담당 회원",
                    count: targetEmployee.members,
                    icon: "👥",
                  },
                  {
                    key: "lessons" as const,
                    label: "예정 수업",
                    count: targetEmployee.lessons,
                    icon: "🎓",
                  },
                  {
                    key: "contracts" as const,
                    label: "진행 계약",
                    count: targetEmployee.contracts,
                    icon: "📄",
                  },
                  {
                    key: "ot" as const,
                    label: "OT 일정",
                    count: targetEmployee.ot,
                    icon: "💪",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="grid grid-cols-[60px_1fr_180px] items-center gap-3 rounded-lg border border-slate-200 p-3"
                  >
                    <div className="text-center">
                      <div className="text-2xl">{item.icon}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        {item.label}
                      </div>
                      <div className="text-xs text-slate-500">
                        {item.count}건 인계 필요
                      </div>
                    </div>
                    <Select
                      value={handoffs[item.key]}
                      onValueChange={(v) =>
                        setHandoffs({ ...handoffs, [item.key]: v })
                      }
                    >
                      <SelectTrigger
                        className={cn(!handoffs[item.key] && "border-rose-300")}
                      >
                        <SelectValue placeholder="인계자 선택 *" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="staff-1">정GX</SelectItem>
                        <SelectItem value="staff-2">최매니저</SelectItem>
                        <SelectItem value="staff-3">이FC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Step 3: 스케줄 정리 미리보기 */}
          {step === 3 && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-sm">
                  3단계: 스케줄 정리 미리보기
                </CardTitle>
                <CardDescription className="text-xs">
                  충돌 항목 있으면 처리 완료 차단
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {conflicts.map((c, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border p-3",
                      c.severity === "block"
                        ? "border-rose-300 bg-rose-50"
                        : "border-amber-300 bg-amber-50",
                    )}
                  >
                    <AlertTriangle
                      className={cn(
                        "mt-0.5 size-5 shrink-0",
                        c.severity === "block"
                          ? "text-rose-600"
                          : "text-amber-600",
                      )}
                    />
                    <div>
                      <div
                        className={cn(
                          "font-semibold",
                          c.severity === "block"
                            ? "text-rose-900"
                            : "text-amber-900",
                        )}
                      >
                        {c.severity === "block" ? "🚫 차단" : "⚠️ 경고"} -{" "}
                        {c.type}
                      </div>
                      <p className="mt-1 text-xs text-slate-700">{c.item}</p>
                      {c.severity === "block" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2"
                          onClick={() => setStep(2)}
                        >
                          2단계로 돌아가 인계자 지정
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {!hasBlockingConflict && (
                  <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-center text-emerald-900">
                    <CheckCircle2 className="mx-auto size-8 text-emerald-600" />
                    <p className="mt-2 font-semibold">
                      충돌 없음 - 4단계로 진행 가능
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 4: 계정 비활성화 확인 */}
          {step === 4 && (
            <Card className="shadow-none border-rose-300">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="size-4 text-rose-600" /> 4단계: 계정
                  비활성화 최종 확인
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 rounded-lg border border-rose-200 bg-rose-50/40 p-4 text-sm text-rose-900">
                  <div>
                    <b>퇴사 확정 시:</b>
                  </div>
                  <ul className="ml-4 list-disc space-y-1 text-xs">
                    <li>{targetEmployee.name}의 계정 즉시 비활성화</li>
                    <li>현재 로그인 세션 모두 종료 + 재로그인 차단</li>
                    <li>담당 회원/수업/계약/OT가 지정 인계자에게 이관</li>
                    <li>D-30 사전 알림 자동 발송 (인수인계 준비)</li>
                    <li>퇴사 취소 가능: 24시간 이내 (Owner+ 권한)</li>
                  </ul>
                </div>
                <div>
                  <Label className="text-xs font-semibold">확인 텍스트 *</Label>
                  <p className="mt-1 mb-2 text-[11px] text-slate-600">
                    아래에 정확히{" "}
                    <code className="rounded bg-rose-100 px-1.5 py-0.5 font-mono font-bold text-rose-700">
                      퇴사처리
                    </code>{" "}
                    입력
                  </p>
                  <Input
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="퇴사처리"
                    className={cn(
                      "font-mono",
                      confirmText &&
                        confirmText !== "퇴사처리" &&
                        "border-rose-400 text-rose-700",
                    )}
                  />
                  {confirmText && confirmText !== "퇴사처리" && (
                    <p className="mt-1 text-[11px] text-rose-600">
                      확인 텍스트가 일치하지 않습니다
                    </p>
                  )}
                  {confirmText === "퇴사처리" && (
                    <p className="mt-1 text-[11px] text-emerald-700">
                      ✓ 확인 완료 — 처리 완료 버튼 활성화
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 액션 바 */}
          <div className="flex items-center justify-between rounded-2xl border-2 border-slate-300 bg-white p-4 shadow-md">
            <Button variant="ghost" onClick={() => notify("취소 mock", "info")}>
              취소
            </Button>
            <div className="flex gap-2">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep((step - 1) as 1 | 2 | 3 | 4)}
                >
                  이전
                </Button>
              )}
              {step < 4 ? (
                <Button onClick={goNext} disabled={!stepValid[step]}>
                  {step}단계 완료 → 다음
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  data-dialog-id="DLG-060-002"
                  disabled={!stepValid[4] || !allowedOwnerPlus}
                  onClick={() => {
                    if (!allowedOwnerPlus) {
                      notify("Owner+ 권한 필요", "warning");
                      return;
                    }
                    openDialog("DLG-060-002");
                  }}
                >
                  처리 완료 (DLG-060-002)
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* 우측: 가이드 + 정책 */}
        <aside className="space-y-4">
          <Card className="shadow-none border-sky-200 bg-sky-50/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs flex items-center gap-1.5">
                📋 현재 단계 안내
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[11px] text-sky-900">
              {step === 1 && (
                <>
                  <div>• 퇴사 예정일은 미래/오늘/과거 선택 가능</div>
                  <div>• 즉시 퇴사 = 계정 즉시 잠금 (Owner+ 전용)</div>
                  <div>• 사유 4종: 자발/권고/계약만료/기타</div>
                </>
              )}
              {step === 2 && (
                <>
                  <div>• 회원·수업·계약·OT 4종 모두 지정 필수</div>
                  <div>• 시스템 자동 선택 없음</div>
                  <div>• 인계자가 알림 받음</div>
                </>
              )}
              {step === 3 && (
                <>
                  <div>• 충돌 항목 있으면 4단계 진입 차단</div>
                  <div>• 수업 자동 인계 결과 확인</div>
                  <div>• 개인 일정 자동 삭제</div>
                </>
              )}
              {step === 4 && (
                <>
                  <div>• 확인 텍스트 일치 필요</div>
                  <div>• 24시간 이내 퇴사 취소 가능</div>
                  <div>• Owner+ 권한만 실행</div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-none border-amber-200 bg-amber-50/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs">⚠ 권한 정책</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-[11px] text-amber-900">
              <div>
                <b>HQ_ADMIN/OWNER:</b> 전체 처리 가능
              </div>
              <div>
                <b>MANAGER/FC/TRAINER/STAFF:</b> 접근 불가
              </div>
              <div>본 마법사는 검수용 mock으로만 동작합니다.</div>
            </CardContent>
          </Card>

          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function StaffAttendanceScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  // 근태 통계 카드 + 출근 캘린더 mock
  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="키오스크·IoT·수동 보정 통합"
      />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>근태 기록</CardTitle>
              <CardDescription>
                월 단위 · 날짜 범위 · 월별 집계 요약
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <FilterChips filters={screen.filters} notify={notify} />
              <Table>
                <TableHeader>
                  <TableRow>
                    {screen.tableColumns.map((c) => (
                      <TableHead key={c}>{c}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {screen.rows.map((row, idx) => (
                    <TableRow key={idx}>
                      {screen.tableColumns.map((c) => (
                        <TableCell key={c}>
                          {statusAwareValue(String(row[c] ?? "-"))}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>이번 주 출근 캘린더 (참고)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {["월", "화", "수", "목", "금", "토", "일"].map((d) => (
                  <div
                    key={d}
                    className="rounded bg-surface-secondary p-2 font-semibold"
                  >
                    {d}
                  </div>
                ))}
                {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                  const tone =
                    day <= 4
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : day === 5
                        ? "bg-amber-50 border-amber-200 text-amber-700"
                        : "bg-surface-secondary border-slate-200 text-content-tertiary";
                  return (
                    <div
                      key={day}
                      className={cn("aspect-square rounded border p-2", tone)}
                    >
                      <div className="font-bold">D{day}</div>
                      <div className="mt-1 text-[10px]">
                        {day <= 4 ? "정상" : day === 5 ? "지각" : "주말"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>근태 액션</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <PrimaryActionRow
                screen={screen}
                role={role}
                openDialog={openDialog}
                notify={notify}
              />
            </CardContent>
          </Card>
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

function PayrollManagementScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  // admin-pando /payroll/page.tsx 구조 1:1 이식
  // 월 선택 + 확정 액션 + 통계 카드 4종 + 급여 테이블 + 합계/평균 행 + 명세서 발급 카드
  // docs4 V1/V2 D07-직원관리/급여관리 (SCR-062 UI-098~100) 컨텐츠 반영
  type PayrollStatus = "paid" | "pending" | "hold";
  type PayrollRow = {
    id: number;
    name: string;
    role: string;
    baseSalary: number;
    incentive: number;
    deduction: number;
    netPay: number;
    status: PayrollStatus;
  };

  function getRecentMonths() {
    const months: { value: string; label: string }[] = [];
    const now = new Date(2026, 4, 29); // 고정 mock 기준 (2026-05)
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
      months.push({ value, label });
    }
    return months;
  }

  const MONTHS = getRecentMonths();
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0].value);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<PayrollStatus | "">("");

  const initialPayroll: PayrollRow[] = [
    {
      id: 1,
      name: "이센터",
      role: "센터장",
      baseSalary: 5500000,
      incentive: 1800000,
      deduction: 642000,
      netPay: 6658000,
      status: "paid",
    },
    {
      id: 2,
      name: "박매니저",
      role: "매니저",
      baseSalary: 4200000,
      incentive: 920000,
      deduction: 458000,
      netPay: 4662000,
      status: "paid",
    },
    {
      id: 3,
      name: "최FC",
      role: "FC",
      baseSalary: 3200000,
      incentive: 1240000,
      deduction: 364000,
      netPay: 4076000,
      status: "pending",
    },
    {
      id: 4,
      name: "정FC",
      role: "FC",
      baseSalary: 1600000,
      incentive: 0,
      deduction: 152000,
      netPay: 1448000,
      status: "hold",
    },
    {
      id: 5,
      name: "한트레이너",
      role: "트레이너",
      baseSalary: 2800000,
      incentive: 2200000,
      deduction: 412000,
      netPay: 4588000,
      status: "paid",
    },
    {
      id: 6,
      name: "윤트레이너",
      role: "트레이너",
      baseSalary: 2800000,
      incentive: 1450000,
      deduction: 348000,
      netPay: 3902000,
      status: "pending",
    },
    {
      id: 7,
      name: "장스태프",
      role: "스태프",
      baseSalary: 2400000,
      incentive: 220000,
      deduction: 246000,
      netPay: 2374000,
      status: "paid",
    },
    {
      id: 8,
      name: "오트레이너",
      role: "트레이너",
      baseSalary: 2800000,
      incentive: 1820000,
      deduction: 384000,
      netPay: 4236000,
      status: "pending",
    },
  ];

  const [payrollData, setPayrollData] = useState<PayrollRow[]>(initialPayroll);

  const filtered = payrollData.filter((r) => {
    const matchSearch =
      !searchQuery ||
      r.name.includes(searchQuery) ||
      r.role.includes(searchQuery);
    const matchStatus = !filterStatus || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totals = filtered.reduce(
    (acc, r) => ({
      baseSalary: acc.baseSalary + r.baseSalary,
      incentive: acc.incentive + r.incentive,
      deduction: acc.deduction + r.deduction,
      netPay: acc.netPay + r.netPay,
    }),
    { baseSalary: 0, incentive: 0, deduction: 0, netPay: 0 },
  );

  const paidCount = filtered.filter((r) => r.status === "paid").length;
  const pendingCount = filtered.filter((r) => r.status === "pending").length;
  const holdCount = filtered.filter((r) => r.status === "hold").length;
  const fmt = (n: number) => n.toLocaleString("ko-KR");

  const statusConfig: Record<
    PayrollStatus,
    { label: string; variant: "success" | "warning" | "secondary" }
  > = {
    paid: { label: "지급완료", variant: "success" },
    pending: { label: "미지급", variant: "warning" },
    hold: { label: "보류", variant: "secondary" },
  };

  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="당월 미확정 → 확정 → 명세서 발급"
      />

      {/* 상단: 월 선택 + 액션 */}
      <Card className="shadow-none">
        <CardContent className="p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Label className="text-xs">대상 월</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-40 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                const unpaidCount = payrollData.filter(
                  (r) => r.status !== "paid",
                ).length;
                if (unpaidCount === 0) {
                  notify("이미 모든 급여가 확정되었습니다.", "info");
                  return;
                }
                setPayrollData((current) =>
                  current.map((r) =>
                    r.status !== "paid" ? { ...r, status: "paid" as const } : r,
                  ),
                );
                notify(`${unpaidCount}건 급여가 확정되었습니다.`);
              }}
            >
              <CheckCircle2 size={14} className="mr-1.5" /> 전체 급여 확정
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                notify(`${selectedMonth} 엑셀 내보내기 mock`, "info")
              }
            >
              내보내기
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 통계 카드 4종 */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <UserRound size={14} /> 총 지급 대상
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {filtered.length}명
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">
              {selectedMonth.replace("-", "년 ")}월
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              총 실지급액
            </CardDescription>
            <CardTitle className="text-xl tabular-nums text-primary">
              {fmt(totals.netPay)}원
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">
              평균{" "}
              {fmt(
                filtered.length
                  ? Math.round(totals.netPay / filtered.length)
                  : 0,
              )}
              원
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" /> 지급완료
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums text-emerald-600">
              {paidCount}명
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">확정 완료</p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <Clock size={14} className="text-amber-600" /> 미지급/보류
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums text-amber-600">
              {pendingCount + holdCount}명
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">
              미지급 {pendingCount} · 보류 {holdCount}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          {/* 검색 & 필터 */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>급여 테이블</CardTitle>
              <CardDescription>
                기본급 + 인센티브 - 공제 = 실지급액
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-[2fr_1fr_auto] gap-2 items-end">
                <div>
                  <Label className="text-[10px] text-content-tertiary mb-1 block">
                    검색
                  </Label>
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary"
                    />
                    <Input
                      placeholder="직원명·역할 검색"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-[10px] text-content-tertiary mb-1 block">
                    지급 상태
                  </Label>
                  <Select
                    value={filterStatus}
                    onValueChange={(v) =>
                      setFilterStatus(v as PayrollStatus | "")
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="paid">지급완료</SelectItem>
                      <SelectItem value="pending">미지급</SelectItem>
                      <SelectItem value="hold">보류</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterStatus("");
                  }}
                >
                  초기화
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>직원명</TableHead>
                    <TableHead className="w-24">역할</TableHead>
                    <TableHead className="text-right">기본급</TableHead>
                    <TableHead className="text-right">인센티브</TableHead>
                    <TableHead className="text-right">공제</TableHead>
                    <TableHead className="text-right">실지급액</TableHead>
                    <TableHead className="w-24 text-center">지급상태</TableHead>
                    <TableHead className="w-28 text-center">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => {
                    const statusCfg = statusConfig[r.status];
                    return (
                      <TableRow key={r.id}>
                        <TableCell className="font-semibold">
                          {r.name}
                        </TableCell>
                        <TableCell className="text-xs">{r.role}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {fmt(r.baseSalary)}원
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-emerald-600">
                          +{fmt(r.incentive)}원
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-rose-600">
                          -{fmt(r.deduction)}원
                        </TableCell>
                        <TableCell className="text-right tabular-nums font-bold text-primary">
                          {fmt(r.netPay)}원
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={statusCfg.variant}
                            className="text-[10px]"
                          >
                            {statusCfg.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex gap-1 justify-center">
                            {r.status !== "paid" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  notify(`${r.name} 급여 수정`, "info")
                                }
                              >
                                수정
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                notify(`${r.name} 명세서 PDF 다운로드`, "info")
                              }
                            >
                              명세서
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {filtered.length === 0 && (
                <div className="py-12 text-center text-sm text-content-tertiary">
                  조건에 맞는 급여 데이터가 없습니다.
                </div>
              )}
            </CardContent>
          </Card>

          {/* 합계/평균 행 (admin-pando UI-100 패턴) */}
          {filtered.length > 0 && (
            <Card className="shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <span className="text-sm font-bold">
                    합계 / 평균 ({filtered.length}명)
                  </span>
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="text-right">
                      <p className="text-[10px] text-content-tertiary">
                        기본급 합계
                      </p>
                      <p className="text-sm font-bold tabular-nums">
                        {fmt(totals.baseSalary)}원
                      </p>
                      <p className="text-[10px] text-content-tertiary">
                        평균{" "}
                        {fmt(Math.round(totals.baseSalary / filtered.length))}원
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-content-tertiary">
                        인센티브 합계
                      </p>
                      <p className="text-sm font-bold tabular-nums text-emerald-600">
                        {fmt(totals.incentive)}원
                      </p>
                      <p className="text-[10px] text-content-tertiary">
                        평균{" "}
                        {fmt(Math.round(totals.incentive / filtered.length))}원
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-content-tertiary">
                        공제 합계
                      </p>
                      <p className="text-sm font-bold tabular-nums text-rose-600">
                        {fmt(totals.deduction)}원
                      </p>
                      <p className="text-[10px] text-content-tertiary">
                        평균{" "}
                        {fmt(Math.round(totals.deduction / filtered.length))}원
                      </p>
                    </div>
                    <div className="text-right border-l border-line pl-6">
                      <p className="text-[10px] text-content-tertiary">
                        실지급액 합계
                      </p>
                      <p className="text-lg font-bold tabular-nums text-primary">
                        {fmt(totals.netPay)}원
                      </p>
                      <p className="text-[10px] text-content-tertiary">
                        평균 {fmt(Math.round(totals.netPay / filtered.length))}
                        원
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t text-[10px] text-content-tertiary">
                  <span className="font-semibold text-accent">계산식</span>{" "}
                  실지급액 = 기본급 + 인센티브 − 공제액 &nbsp;|&nbsp;{" "}
                  {fmt(totals.baseSalary)} + {fmt(totals.incentive)} −{" "}
                  {fmt(totals.deduction)} ={" "}
                  <span className="font-bold text-primary">
                    {fmt(totals.netPay)}원
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 명세서 발급 카드 */}
          <Card className="shadow-none bg-surface-secondary/40">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-primary-light rounded-full grid place-items-center text-primary">
                  <ClipboardCheck size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold">급여 명세서 발급</p>
                  <p className="text-xs text-content-tertiary">
                    직원별 급여 명세서를 조회하고 PDF로 다운로드
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => notify("명세서 페이지 이동 mock", "info")}
              >
                명세서 바로가기
              </Button>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>급여 액션</CardTitle>
              <CardDescription>편집 → 확정 → 명세서</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <PrimaryActionRow
                screen={screen}
                role={role}
                openDialog={openDialog}
                notify={notify}
              />
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>직급별 정책 (참고)</CardTitle>
              <CardDescription>V1+V2 정책 합집합</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1.5 text-xs">
              {[
                { 직군: "센터장", 방식: "고정급 + 매출커미션 5%" },
                { 직군: "매니저", 방식: "고정급 + 운영 보너스" },
                { 직군: "FC", 방식: "정률 + 매출커미션 8~12%" },
                { 직군: "PT 트레이너", 방식: "기본급 + PT 건당 30~45%" },
                { 직군: "GX 트레이너", 방식: "시급 + 수업료 60%" },
                { 직군: "스태프", 방식: "고정급" },
              ].map((p) => (
                <div
                  key={p.직군}
                  className="flex items-center justify-between rounded-lg border bg-white px-2 py-1.5"
                >
                  <b>{p.직군}</b>
                  <span className="text-content-tertiary text-[10px]">
                    {p.방식}
                  </span>
                </div>
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

function LeadManagementScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  // admin-pando (marketing)/leads 패턴 + 운영자 UX
  // 칸반/목록 뷰 + 단계 이동 + 신규 리드 등록 + 상담 메모 + 권한 차등
  type LeadStage =
    | "신규"
    | "연락완료"
    | "상담예정"
    | "방문완료"
    | "등록완료"
    | "보류";
  type Lead = {
    id: number;
    name: string;
    phone: string;
    inquiry: string;
    source: string;
    fc: string;
    stage: LeadStage;
    createdAt: string;
    memo: string;
  };

  const stages: LeadStage[] = [
    "신규",
    "연락완료",
    "상담예정",
    "방문완료",
    "등록완료",
    "보류",
  ];
  const stageColors: Record<LeadStage, string> = {
    신규: "bg-blue-100 text-blue-700 border-blue-200",
    연락완료: "bg-indigo-100 text-indigo-700 border-indigo-200",
    상담예정: "bg-violet-100 text-violet-700 border-violet-200",
    방문완료: "bg-emerald-100 text-emerald-700 border-emerald-200",
    등록완료: "bg-primary-light text-primary border-primary/30",
    보류: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const initialLeads: Lead[] = [
    {
      id: 1,
      name: "강민지",
      phone: "010-1111-1234",
      inquiry: "회원권 + PT",
      source: "지인 소개",
      fc: "최FC",
      stage: "신규",
      createdAt: "오늘",
      memo: "동료 추천, 평일 저녁 위주",
    },
    {
      id: 2,
      name: "이재훈",
      phone: "010-2222-2345",
      inquiry: "GX 요가",
      source: "인스타그램",
      fc: "최FC",
      stage: "신규",
      createdAt: "오늘",
      memo: "체험 1회 가능?",
    },
    {
      id: 3,
      name: "박지영",
      phone: "010-3333-3456",
      inquiry: "다이어트 PT",
      source: "검색 광고",
      fc: "정FC",
      stage: "연락완료",
      createdAt: "어제",
      memo: "2회 통화, 가격 비교 중",
    },
    {
      id: 4,
      name: "최서윤",
      phone: "010-4444-4567",
      inquiry: "회원권 3개월",
      source: "지점 방문",
      fc: "최FC",
      stage: "상담예정",
      createdAt: "어제",
      memo: "5/30 14:00 상담 예약",
    },
    {
      id: 5,
      name: "김도현",
      phone: "010-5555-5678",
      inquiry: "골프 시뮬레이터",
      source: "지인 소개",
      fc: "정FC",
      stage: "방문완료",
      createdAt: "2일 전",
      memo: "투어 완료, 회원권 검토 중",
    },
    {
      id: 6,
      name: "윤하늘",
      phone: "010-6666-6789",
      inquiry: "회원권 6개월",
      source: "전단지",
      fc: "최FC",
      stage: "등록완료",
      createdAt: "3일 전",
      memo: "6개월 + PT 10회 결제 완료",
    },
    {
      id: 7,
      name: "임채영",
      phone: "010-7777-7890",
      inquiry: "PT 단기",
      source: "검색 광고",
      fc: "정FC",
      stage: "보류",
      createdAt: "5일 전",
      memo: "예산 부족 — 7월 재상담",
    },
  ];

  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [viewMode, setViewMode] = useState<"칸반" | "목록">("칸반");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFC, setFilterFC] = useState<string>("");
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    phone: "",
    inquiry: "회원권",
    source: "지점 방문",
    fc: "최FC",
    memo: "",
  });
  const [detailLead, setDetailLead] = useState<Lead | null>(null);

  const filtered = leads.filter((l) => {
    const matchSearch =
      !searchQuery ||
      l.name.includes(searchQuery) ||
      l.phone.includes(searchQuery);
    const matchFC = !filterFC || l.fc === filterFC;
    return matchSearch && matchFC;
  });

  const stageCounts = stages.reduce(
    (acc, stage) => ({
      ...acc,
      [stage]: filtered.filter((l) => l.stage === stage).length,
    }),
    {} as Record<LeadStage, number>,
  );
  const conversionRate =
    leads.length > 0
      ? Math.round(
          (leads.filter((l) => l.stage === "등록완료").length / leads.length) *
            100,
        )
      : 0;

  const moveLeadStage = (leadId: number, newStage: LeadStage) => {
    setLeads((curr) =>
      curr.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l)),
    );
    notify(`상담 단계: ${newStage}로 이동`, "info");
  };

  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="잠재 고객 상담 단계 6종 추적"
      />

      {/* 상단 통계 */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <UserRound size={14} /> 전체 리드
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {leads.length}건
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">이번 달 누계</p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <Bell size={14} className="text-blue-600" /> 신규
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums text-blue-600">
              {stageCounts["신규"]}건
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">
              미연락 (당일 응대 필요)
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <ClipboardCheck size={14} className="text-violet-600" /> 상담예정
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums text-violet-600">
              {stageCounts["상담예정"]}건
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">예약 일정 확인</p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" /> 전환율
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums text-emerald-600">
              {conversionRate}%
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">
              등록 {stageCounts["등록완료"]} / 전체 {leads.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>리드 관리 ({viewMode} 뷰)</CardTitle>
                <div className="flex gap-2">
                  <div className="flex gap-1">
                    {(["칸반", "목록"] as const).map((v) => (
                      <Button
                        key={v}
                        size="sm"
                        variant={viewMode === v ? "default" : "outline"}
                        onClick={() => {
                          setViewMode(v);
                          notify(`${v} 뷰`, "info");
                        }}
                      >
                        {v}
                      </Button>
                    ))}
                  </div>
                  <Button size="sm" onClick={() => setShowCreate(true)}>
                    + 리드 등록
                  </Button>
                </div>
              </div>
              <CardDescription>
                {filtered.length}건 · 상담 단계 6종 · 문의 유형 · 가입경로 추적
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* 검색 */}
              <div className="grid grid-cols-[2fr_1fr_auto] gap-2 items-end">
                <div>
                  <Label className="text-[10px] text-content-tertiary mb-1 block">
                    통합 검색
                  </Label>
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary"
                    />
                    <Input
                      placeholder="이름·연락처"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-[10px] text-content-tertiary mb-1 block">
                    담당 FC
                  </Label>
                  <Select value={filterFC} onValueChange={setFilterFC}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="최FC">최FC</SelectItem>
                      <SelectItem value="정FC">정FC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterFC("");
                  }}
                >
                  초기화
                </Button>
              </div>

              {viewMode === "칸반" ? (
                <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
                  {stages.map((stage) => (
                    <div
                      key={stage}
                      className="rounded-xl border bg-surface-secondary p-2.5 min-h-[260px]"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span
                          className={cn(
                            "inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border",
                            stageColors[stage],
                          )}
                        >
                          {stage}
                        </span>
                        <Badge variant="secondary" className="text-[10px]">
                          {stageCounts[stage]}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {filtered
                          .filter((l) => l.stage === stage)
                          .map((lead) => (
                            <button
                              key={lead.id}
                              onClick={() => setDetailLead(lead)}
                              className="w-full rounded-lg border bg-white p-2 text-xs text-left hover:border-primary/40 hover:shadow-sm transition"
                            >
                              <div className="font-semibold text-content">
                                {lead.name}
                              </div>
                              <div className="text-[10px] text-content-tertiary mt-0.5">
                                {lead.inquiry}
                              </div>
                              <div className="mt-1 flex items-center justify-between text-[10px] text-content-tertiary">
                                <span>{lead.fc}</span>
                                <span>{lead.createdAt}</span>
                              </div>
                            </button>
                          ))}
                        {filtered.filter((l) => l.stage === stage).length ===
                          0 && (
                          <div className="text-[10px] text-center text-content-tertiary py-4">
                            -
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>이름</TableHead>
                      <TableHead>연락처</TableHead>
                      <TableHead>문의 유형</TableHead>
                      <TableHead>가입경로</TableHead>
                      <TableHead>담당 FC</TableHead>
                      <TableHead className="w-28 text-center">
                        상담 단계
                      </TableHead>
                      <TableHead>접수일</TableHead>
                      <TableHead className="w-20 text-center">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((l) => (
                      <TableRow
                        key={l.id}
                        className="cursor-pointer"
                        onClick={() => setDetailLead(l)}
                      >
                        <TableCell className="font-semibold">
                          {l.name}
                        </TableCell>
                        <TableCell className="text-xs tabular-nums">
                          {l.phone}
                        </TableCell>
                        <TableCell className="text-xs">{l.inquiry}</TableCell>
                        <TableCell className="text-xs text-content-tertiary">
                          {l.source}
                        </TableCell>
                        <TableCell className="text-xs">{l.fc}</TableCell>
                        <TableCell className="text-center">
                          <span
                            className={cn(
                              "inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border",
                              stageColors[l.stage],
                            )}
                          >
                            {l.stage}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-content-tertiary">
                          {l.createdAt}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDetailLead(l);
                            }}
                          >
                            상세
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {filtered.length === 0 && (
                <div className="py-12 text-center text-sm text-content-tertiary">
                  조건에 맞는 리드가 없습니다.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>리드 액션</CardTitle>
              <CardDescription>운영 빈도 매우 높음</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={() => setShowCreate(true)}>
                + 새 리드 등록
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => notify("일괄 SMS 발송 mock", "info")}
              >
                일괄 SMS 발송
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => notify("자동 follow-up mock", "info")}
              >
                자동 follow-up 정책
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => notify("CSV 내보내기 mock", "info")}
              >
                CSV 내보내기
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>가입경로별 (TOP 3)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-xs">
              {[
                { 경로: "지인 소개", 건수: 2 },
                { 경로: "검색 광고", 건수: 2 },
                { 경로: "지점 방문", 건수: 1 },
              ].map((p) => (
                <div
                  key={p.경로}
                  className="flex items-center justify-between rounded-lg border bg-white px-2 py-1.5"
                >
                  <b>{p.경로}</b>
                  <span className="text-content-tertiary">{p.건수}건</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
          <FrontStateNote screen={screen} />
        </aside>
      </div>

      {/* 리드 등록 모달 */}
      {showCreate && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowCreate(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl border w-full max-w-[480px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-base font-bold">새 리드 등록</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreate(false)}
              >
                <X size={16} />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">
                  이름 *
                </Label>
                <Input
                  placeholder="홍길동"
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, name: e.target.value })
                  }
                />
                {createForm.name && createForm.name.length < 2 && (
                  <p className="text-[10px] text-rose-600 mt-1">
                    이름은 2자 이상 입력해주세요.
                  </p>
                )}
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">
                  연락처 *
                </Label>
                <Input
                  placeholder="010-1234-5678"
                  value={createForm.phone}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, phone: e.target.value })
                  }
                />
                {createForm.phone &&
                  !/^010-\d{4}-\d{4}$/.test(createForm.phone) && (
                    <p className="text-[10px] text-rose-600 mt-1">
                      010-1234-5678 형식으로 입력해주세요.
                    </p>
                  )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold mb-1.5 block">
                    문의 유형
                  </Label>
                  <Select
                    value={createForm.inquiry}
                    onValueChange={(v) =>
                      setCreateForm({ ...createForm, inquiry: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "회원권",
                        "PT",
                        "GX 요가",
                        "GX 필라테스",
                        "골프 시뮬레이터",
                        "다이어트 PT",
                        "기타",
                      ].map((i) => (
                        <SelectItem key={i} value={i}>
                          {i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-semibold mb-1.5 block">
                    가입경로
                  </Label>
                  <Select
                    value={createForm.source}
                    onValueChange={(v) =>
                      setCreateForm({ ...createForm, source: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "지점 방문",
                        "지인 소개",
                        "검색 광고",
                        "인스타그램",
                        "전단지",
                        "타지점 이관",
                      ].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">
                  담당 FC
                </Label>
                <Select
                  value={createForm.fc}
                  onValueChange={(v) => setCreateForm({ ...createForm, fc: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="최FC">최FC</SelectItem>
                    <SelectItem value="정FC">정FC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">
                  상담 메모
                </Label>
                <Textarea
                  rows={3}
                  placeholder="첫 통화 내용, 관심 분야, 예산 등"
                  value={createForm.memo}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, memo: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowCreate(false)}
              >
                취소
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  if (createForm.name.length < 2) {
                    notify("이름 2자 이상", "warning");
                    return;
                  }
                  if (!/^010-\d{4}-\d{4}$/.test(createForm.phone)) {
                    notify("연락처 형식 확인", "warning");
                    return;
                  }
                  const newLead: Lead = {
                    id: Math.max(...leads.map((l) => l.id)) + 1,
                    name: createForm.name,
                    phone: createForm.phone,
                    inquiry: createForm.inquiry,
                    source: createForm.source,
                    fc: createForm.fc,
                    stage: "신규",
                    createdAt: "방금 전",
                    memo: createForm.memo,
                  };
                  setLeads([newLead, ...leads]);
                  setShowCreate(false);
                  setCreateForm({
                    name: "",
                    phone: "",
                    inquiry: "회원권",
                    source: "지점 방문",
                    fc: "최FC",
                    memo: "",
                  });
                  notify(`${newLead.name} 리드 등록 완료 (신규 단계)`);
                }}
              >
                등록
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 리드 상세/단계 이동 — admin-pando 우측 슬라이드 패널 패턴 */}
      {detailLead && (
        <AdminSlidePanel
          open={Boolean(detailLead)}
          onClose={() => setDetailLead(null)}
          eyebrow="docs4 V1 SCR-070 · admin-pando SidePanel UX"
          title={`${detailLead.name} 리드 상세`}
          size="md"
          testId="lead-detail-slide-panel"
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setDetailLead(null);
                  notify("회원 등록 화면 이동 mock", "info");
                }}
              >
                회원 등록 연결
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setDetailLead(null);
                  notify("SMS 발송 mock", "info");
                }}
              >
                SMS 발송
              </Button>
              <Button onClick={() => setDetailLead(null)}>닫기</Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-line bg-white p-4 shadow-sm">
              <p className="text-xs text-content-tertiary">
                {detailLead.phone} · {detailLead.createdAt}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-line bg-surface-secondary/60 p-2.5">
                  <div className="text-content-tertiary">문의 유형</div>
                  <div className="mt-0.5 font-bold">{detailLead.inquiry}</div>
                </div>
                <div className="rounded-lg border border-line bg-surface-secondary/60 p-2.5">
                  <div className="text-content-tertiary">가입경로</div>
                  <div className="mt-0.5 font-bold">{detailLead.source}</div>
                </div>
                <div className="rounded-lg border border-line bg-surface-secondary/60 p-2.5">
                  <div className="text-content-tertiary">담당 FC</div>
                  <div className="mt-0.5 font-bold">{detailLead.fc}</div>
                </div>
                <div className="rounded-lg border border-line bg-surface-secondary/60 p-2.5">
                  <div className="text-content-tertiary">현재 단계</div>
                  <div className="mt-0.5 font-bold">
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold",
                        stageColors[detailLead.stage],
                      )}
                    >
                      {detailLead.stage}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-line bg-white p-4 shadow-sm">
              <Label className="mb-1.5 block text-xs font-semibold">
                상담 메모
              </Label>
              <div className="rounded-lg border bg-surface-secondary p-3 text-sm">
                {detailLead.memo || "(메모 없음)"}
              </div>
            </div>
            <div className="rounded-xl border border-line bg-white p-4 shadow-sm">
              <Label className="mb-2 block text-xs font-semibold">
                단계 이동
              </Label>
              <div className="grid grid-cols-3 gap-1.5">
                {stages.map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={detailLead.stage === s ? "default" : "outline"}
                    onClick={() => {
                      moveLeadStage(detailLead.id, s);
                      setDetailLead({ ...detailLead, stage: s });
                    }}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </AdminSlidePanel>
      )}
    </div>
  );
}

function MessageDispatchScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  // admin-pando (marketing)/messages 패턴 + 운영자 UX
  // 채널 3종 + 발송 미리보기 + 대상 세그먼트 + 결과 통계
  type Channel = "all" | "push" | "kakao" | "sms";
  const channelMeta: Record<
    Channel,
    { label: string; color: string; cost: string }
  > = {
    all: {
      label: "전체",
      color: "bg-slate-100 text-slate-700 border-slate-200",
      cost: "-",
    },
    push: {
      label: "Push",
      color: "bg-blue-100 text-blue-700 border-blue-200",
      cost: "무료",
    },
    kakao: {
      label: "카카오톡",
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      cost: "15원/건",
    },
    sms: {
      label: "SMS",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      cost: "30원/건",
    },
  };

  type DispatchRow = {
    id: number;
    sentAt: string;
    channel: Exclude<Channel, "all">;
    title: string;
    segment: string;
    total: number;
    success: number;
    failed: number;
    status: "완료" | "발송중" | "실패";
  };

  const initialHistory: DispatchRow[] = [
    {
      id: 1,
      sentAt: "오늘 09:00",
      channel: "push",
      title: "5월 신규 GX 클래스 안내",
      segment: "활성 회원 (2,614명)",
      total: 2614,
      success: 2580,
      failed: 34,
      status: "완료",
    },
    {
      id: 2,
      sentAt: "오늘 10:30",
      channel: "kakao",
      title: "만료 임박 D-3 (재등록 안내)",
      segment: "만료임박 자동",
      total: 92,
      success: 89,
      failed: 3,
      status: "완료",
    },
    {
      id: 3,
      sentAt: "오늘 11:15",
      channel: "sms",
      title: "미수금 납부 요청",
      segment: "미수금 회원",
      total: 18,
      success: 17,
      failed: 1,
      status: "완료",
    },
    {
      id: 4,
      sentAt: "어제 14:20",
      channel: "push",
      title: "여름 휴가 운영 시간 변경",
      segment: "전 회원",
      total: 3248,
      success: 3201,
      failed: 47,
      status: "완료",
    },
    {
      id: 5,
      sentAt: "어제 16:00",
      channel: "kakao",
      title: "PT 트레이너 신규 입사",
      segment: "PT 보유 회원",
      total: 256,
      success: 243,
      failed: 13,
      status: "완료",
    },
    {
      id: 6,
      sentAt: "방금 전",
      channel: "sms",
      title: "결제 영수증 발송",
      segment: "결제완료",
      total: 8,
      success: 6,
      failed: 0,
      status: "발송중",
    },
  ];

  const [history, setHistory] = useState<DispatchRow[]>(initialHistory);
  const [activeChannel, setActiveChannel] = useState<Channel>("all");
  const [showCompose, setShowCompose] = useState(false);
  const [composeForm, setComposeForm] = useState({
    channel: "push" as Exclude<Channel, "all">,
    title: "",
    message: "",
    segment: "활성 회원",
  });
  const [previewMode, setPreviewMode] = useState(false);

  const filtered = history.filter(
    (h) => activeChannel === "all" || h.channel === activeChannel,
  );
  const successTotal = history.reduce((s, h) => s + h.success, 0);
  const failedTotal = history.reduce((s, h) => s + h.failed, 0);
  const successRate =
    successTotal + failedTotal > 0
      ? Math.round((successTotal / (successTotal + failedTotal)) * 100)
      : 100;

  const channelCounts: Record<Channel, number> = {
    all: history.length,
    push: history.filter((h) => h.channel === "push").length,
    kakao: history.filter((h) => h.channel === "kakao").length,
    sms: history.filter((h) => h.channel === "sms").length,
  };

  const segmentOptions = [
    "활성 회원 (2,614명)",
    "만료임박 자동 (184명)",
    "이탈위험 (86명)",
    "신규 회원 (52명)",
    "PT 보유 (256명)",
    "미수금 (18명)",
    "전 회원 (3,248명)",
  ];
  const charLimit =
    composeForm.channel === "sms"
      ? 90
      : composeForm.channel === "kakao"
        ? 1000
        : 200;
  const overLimit = composeForm.message.length > charLimit;

  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="Push · 카카오톡 · SMS 통합 발송"
      />

      {/* 통계 카드 */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <Bell size={14} /> 오늘 발송
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {
                history.filter(
                  (h) => h.sentAt.startsWith("오늘") || h.sentAt === "방금 전",
                ).length
              }
              건
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">전일 +2건</p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" /> 성공률
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums text-emerald-600">
              {successRate}%
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">
              성공 {successTotal.toLocaleString()} / 실패 {failedTotal}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <MessageSquare size={14} className="text-blue-600" /> 대상자 합계
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums text-blue-600">
              {(successTotal + failedTotal).toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">중복 제거 없음</p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-amber-600" /> 발송 비용
              (예상)
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums text-amber-600">
              ₩
              {(
                history
                  .filter((h) => h.channel === "kakao")
                  .reduce((s, h) => s + h.total, 0) *
                  15 +
                history
                  .filter((h) => h.channel === "sms")
                  .reduce((s, h) => s + h.total, 0) *
                  30
              ).toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">
              카카오 15원·SMS 30원
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>발송 이력</CardTitle>
                <Button size="sm" onClick={() => setShowCompose(true)}>
                  <MessageSquare size={14} className="mr-1.5" /> 새 메시지 발송
                </Button>
              </div>
              <CardDescription>
                {filtered.length}건 · 채널별 성공/실패 추적
              </CardDescription>
              {/* 채널 탭 */}
              <div className="mt-2 flex gap-1 border-b border-line">
                {(Object.keys(channelMeta) as Channel[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setActiveChannel(c);
                      notify(`${channelMeta[c].label} 필터`, "info");
                    }}
                    className={cn(
                      "px-4 py-2 text-sm font-semibold border-b-2 transition-colors",
                      activeChannel === c
                        ? "border-primary text-primary"
                        : "border-transparent text-content-secondary hover:text-content",
                    )}
                  >
                    {channelMeta[c].label}{" "}
                    <span className="text-[10px] text-content-tertiary">
                      ({channelCounts[c]})
                    </span>
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">발송 시각</TableHead>
                    <TableHead className="w-24">채널</TableHead>
                    <TableHead>제목</TableHead>
                    <TableHead>대상 세그먼트</TableHead>
                    <TableHead className="text-right w-20">대상자</TableHead>
                    <TableHead className="text-right w-20">성공</TableHead>
                    <TableHead className="text-right w-20">실패</TableHead>
                    <TableHead className="w-20 text-center">상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((h) => {
                    const cfg = channelMeta[h.channel];
                    return (
                      <TableRow
                        key={h.id}
                        className="cursor-pointer"
                        onClick={() =>
                          notify(`${h.title} 발송 결과 상세`, "info")
                        }
                      >
                        <TableCell className="text-xs">{h.sentAt}</TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border",
                              cfg.color,
                            )}
                          >
                            {cfg.label}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {h.title}
                        </TableCell>
                        <TableCell className="text-xs text-content-tertiary">
                          {h.segment}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {h.total.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-emerald-600">
                          {h.success.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-rose-600">
                          {h.failed}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              h.status === "완료"
                                ? "success"
                                : h.status === "발송중"
                                  ? "info"
                                  : "destructive"
                            }
                            className="text-[10px]"
                          >
                            {h.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {filtered.length === 0 && (
                <div className="py-12 text-center text-sm text-content-tertiary">
                  발송 이력이 없습니다.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>발송 액션</CardTitle>
              <CardDescription>운영 빈도 매우 높음</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={() => setShowCompose(true)}>
                <MessageSquare size={14} className="mr-1.5" /> 새 메시지 발송
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => notify("자동 알림 정책 화면 이동 mock", "info")}
              >
                자동 알림 정책
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => notify("템플릿 라이브러리 mock", "info")}
              >
                템플릿 라이브러리
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => notify("CSV 내보내기 mock", "info")}
              >
                CSV 내보내기
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>채널 정책</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-xs">
              {(["push", "kakao", "sms"] as const).map((c) => (
                <div
                  key={c}
                  className="flex items-center justify-between gap-2 rounded-lg border bg-white px-2 py-1.5"
                >
                  <span
                    className={cn(
                      "inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border",
                      channelMeta[c].color,
                    )}
                  >
                    {channelMeta[c].label}
                  </span>
                  <span className="text-content-tertiary text-[10px]">
                    {channelMeta[c].cost}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>

      {/* 메시지 작성 모달 */}
      {showCompose && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowCompose(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl border w-full max-w-[640px] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <MessageSquare size={16} className="text-primary" /> 새 메시지
                발송
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCompose(false)}
              >
                <X size={16} />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              {/* 채널 선택 */}
              <div>
                <Label className="text-xs font-semibold mb-2 block">
                  발송 채널 *
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["push", "kakao", "sms"] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() =>
                        setComposeForm({ ...composeForm, channel: c })
                      }
                      className={cn(
                        "rounded-xl border p-3 text-left transition-all",
                        composeForm.channel === c
                          ? cn(
                              channelMeta[c].color,
                              "ring-2 ring-primary scale-[1.02]",
                            )
                          : "border-line hover:border-primary/50",
                      )}
                    >
                      <div className="font-bold text-sm">
                        {channelMeta[c].label}
                      </div>
                      <div className="text-[10px] text-content-tertiary mt-0.5">
                        {channelMeta[c].cost}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 대상 세그먼트 */}
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">
                  대상 세그먼트 *
                </Label>
                <Select
                  value={composeForm.segment}
                  onValueChange={(v) =>
                    setComposeForm({ ...composeForm, segment: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {segmentOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 제목 */}
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">
                  제목 *
                </Label>
                <Input
                  placeholder="메시지 제목"
                  value={composeForm.title}
                  onChange={(e) =>
                    setComposeForm({ ...composeForm, title: e.target.value })
                  }
                />
                {composeForm.title && composeForm.title.length < 3 && (
                  <p className="text-[10px] text-rose-600 mt-1">
                    제목은 3자 이상 입력해주세요.
                  </p>
                )}
              </div>

              {/* 내용 */}
              <div>
                <Label className="text-xs font-semibold mb-1.5 block flex items-center justify-between">
                  <span>내용 *</span>
                  <span
                    className={cn(
                      "text-[10px]",
                      overLimit
                        ? "text-rose-600 font-bold"
                        : "text-content-tertiary",
                    )}
                  >
                    {composeForm.message.length} / {charLimit}자
                  </span>
                </Label>
                <Textarea
                  rows={5}
                  placeholder={`${channelMeta[composeForm.channel].label} 메시지 내용`}
                  value={composeForm.message}
                  onChange={(e) =>
                    setComposeForm({ ...composeForm, message: e.target.value })
                  }
                />
                {overLimit && (
                  <p className="text-[10px] text-rose-600 mt-1">
                    {channelMeta[composeForm.channel].label} 채널은 최대{" "}
                    {charLimit}자까지 지원합니다.
                  </p>
                )}
              </div>

              {/* 미리보기 */}
              {previewMode && composeForm.message && (
                <div className="rounded-xl border-2 border-dashed border-primary/40 bg-primary-light/30 p-4">
                  <div className="text-[10px] text-content-tertiary mb-2">
                    📱 미리보기 (실제 발송 화면 mock)
                  </div>
                  <div className="bg-white rounded-lg p-3 border shadow-sm">
                    <div className="text-xs font-bold text-primary mb-1">
                      {composeForm.title || "(제목 없음)"}
                    </div>
                    <div className="text-sm whitespace-pre-wrap">
                      {composeForm.message}
                    </div>
                  </div>
                </div>
              )}

              {/* 비용 안내 */}
              {composeForm.segment &&
                composeForm.channel !== "push" &&
                (() => {
                  const match = composeForm.segment.match(
                    /\((\d{1,3}(?:,\d{3})*)명\)/,
                  );
                  const count = match
                    ? parseInt(match[1].replace(/,/g, ""))
                    : 0;
                  const cost =
                    count * (composeForm.channel === "kakao" ? 15 : 30);
                  return (
                    <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs">
                      <AlertTriangle
                        size={14}
                        className="inline text-amber-600 mr-1.5"
                      />
                      <b>예상 비용:</b> {count.toLocaleString()}명 ×{" "}
                      {composeForm.channel === "kakao" ? "15원" : "30원"} ={" "}
                      <b className="text-amber-700">₩{cost.toLocaleString()}</b>
                    </div>
                  );
                })()}
            </div>
            <div className="px-6 py-4 border-t flex gap-2">
              <Button variant="outline" onClick={() => setShowCompose(false)}>
                취소
              </Button>
              <Button
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
              >
                {previewMode ? "미리보기 닫기" : "미리보기"}
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  if (composeForm.title.length < 3) {
                    notify("제목은 3자 이상 입력해주세요.", "warning");
                    return;
                  }
                  if (!composeForm.message.trim()) {
                    notify("메시지 내용을 입력해주세요.", "warning");
                    return;
                  }
                  if (overLimit) {
                    notify(
                      `${channelMeta[composeForm.channel].label} 최대 ${charLimit}자 초과`,
                      "warning",
                    );
                    return;
                  }
                  const match = composeForm.segment.match(
                    /\((\d{1,3}(?:,\d{3})*)명\)/,
                  );
                  const count = match
                    ? parseInt(match[1].replace(/,/g, ""))
                    : 100;
                  const successCount = Math.floor(count * 0.96);
                  const newRow: DispatchRow = {
                    id: Math.max(...history.map((h) => h.id)) + 1,
                    sentAt: "방금 전",
                    channel: composeForm.channel,
                    title: composeForm.title,
                    segment: composeForm.segment,
                    total: count,
                    success: successCount,
                    failed: count - successCount,
                    status: "발송중",
                  };
                  setHistory([newRow, ...history]);
                  setShowCompose(false);
                  setComposeForm({
                    channel: "push",
                    title: "",
                    message: "",
                    segment: "활성 회원",
                  });
                  setPreviewMode(false);
                  notify(
                    `${count.toLocaleString()}명 대상 발송 시작 (성공률 약 96%)`,
                  );
                  window.setTimeout(() => {
                    setHistory((curr) =>
                      curr.map((r) =>
                        r.id === newRow.id
                          ? { ...r, status: "완료" as const }
                          : r,
                      ),
                    );
                    notify(
                      `발송 완료: 성공 ${successCount.toLocaleString()} / 실패 ${count - successCount}`,
                    );
                  }, 2000);
                }}
              >
                <MessageSquare size={14} className="mr-1.5" /> 발송하기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CouponManagementScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  // admin-pando coupons 패턴 + 운영자 UX
  // 쿠폰 발급/사용률/만료/필터/일괄 발급 모달
  type CouponStatus = "active" | "expired" | "scheduled" | "stopped";
  type Coupon = {
    id: number;
    name: string;
    type: "정액" | "정률";
    discount: string;
    period: string;
    issued: number;
    used: number;
    status: CouponStatus;
  };

  const initialCoupons: Coupon[] = [
    {
      id: 1,
      name: "신규 가입 10% 할인",
      type: "정률",
      discount: "10%",
      period: "26.05.01 ~ 26.06.30",
      issued: 421,
      used: 268,
      status: "active",
    },
    {
      id: 2,
      name: "재등록 3만원 할인",
      type: "정액",
      discount: "30,000원",
      period: "26.04.20 ~ 26.05.31",
      issued: 184,
      used: 92,
      status: "active",
    },
    {
      id: 3,
      name: "여름 시즌 5만원 할인",
      type: "정액",
      discount: "50,000원",
      period: "26.06.01 ~ 26.08.31",
      issued: 0,
      used: 0,
      status: "scheduled",
    },
    {
      id: 4,
      name: "1주년 기념 20% (종료)",
      type: "정률",
      discount: "20%",
      period: "26.03.01 ~ 26.03.31",
      issued: 642,
      used: 521,
      status: "expired",
    },
    {
      id: 5,
      name: "친구 추천 1만원",
      type: "정액",
      discount: "10,000원",
      period: "26.05.10 ~ 26.07.10",
      issued: 102,
      used: 64,
      status: "active",
    },
    {
      id: 6,
      name: "GX 첫 클래스 50%",
      type: "정률",
      discount: "50%",
      period: "26.05.01 ~ 26.05.31",
      issued: 56,
      used: 12,
      status: "stopped",
    },
  ];

  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [filterStatus, setFilterStatus] = useState<CouponStatus | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    type: "정률" as "정액" | "정률",
    value: "",
    periodStart: "",
    periodEnd: "",
    quantity: 100,
  });

  const filtered = coupons.filter((c) => {
    const matchSearch = !searchQuery || c.name.includes(searchQuery);
    const matchStatus = !filterStatus || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalIssued = coupons.reduce((s, c) => s + c.issued, 0);
  const totalUsed = coupons.reduce((s, c) => s + c.used, 0);
  const usageRate =
    totalIssued > 0 ? Math.round((totalUsed / totalIssued) * 100) : 0;
  const activeCount = coupons.filter((c) => c.status === "active").length;

  const statusConfig: Record<
    CouponStatus,
    { label: string; variant: "success" | "secondary" | "info" | "destructive" }
  > = {
    active: { label: "사용 중", variant: "success" },
    scheduled: { label: "예정", variant: "info" },
    expired: { label: "만료", variant: "secondary" },
    stopped: { label: "중지", variant: "destructive" },
  };

  const canManage =
    hasPermission(role, "salesWrite") || role === "OWNER" || role === "MANAGER";

  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="발급 · 사용률 · 만료 추적"
      />

      {/* 통계 카드 4종 */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription>활성 쿠폰</CardDescription>
            <CardTitle className="text-2xl tabular-nums text-emerald-600">
              {activeCount}건
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">사용 가능 상태</p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription>총 발급</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {totalIssued.toLocaleString()}건
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">이번 달 누계</p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription>총 사용</CardDescription>
            <CardTitle className="text-2xl tabular-nums text-primary">
              {totalUsed.toLocaleString()}건
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">결제 시 적용</p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription>사용률</CardDescription>
            <CardTitle className="text-2xl tabular-nums text-blue-600">
              {usageRate}%
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">전월 +4%p</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>쿠폰 목록</CardTitle>
                <Button
                  size="sm"
                  disabled={!canManage}
                  onClick={() =>
                    canManage
                      ? setShowCreate(true)
                      : notify("매니저 이상 권한 필요", "warning")
                  }
                >
                  + 쿠폰 발급
                </Button>
              </div>
              <CardDescription>
                총 {filtered.length}건 · 발급/사용 비율 · 사용률 막대
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* 검색/필터 */}
              <div className="grid grid-cols-[2fr_1fr_auto] gap-2 items-end">
                <div>
                  <Label className="text-[10px] text-content-tertiary mb-1 block">
                    검색
                  </Label>
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary"
                    />
                    <Input
                      placeholder="쿠폰명 검색"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-[10px] text-content-tertiary mb-1 block">
                    상태
                  </Label>
                  <Select
                    value={filterStatus}
                    onValueChange={(v) =>
                      setFilterStatus(v as CouponStatus | "")
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="active">사용 중</SelectItem>
                      <SelectItem value="scheduled">예정</SelectItem>
                      <SelectItem value="expired">만료</SelectItem>
                      <SelectItem value="stopped">중지</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterStatus("");
                  }}
                >
                  초기화
                </Button>
              </div>

              {/* 쿠폰 카드 그리드 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {filtered.map((c) => {
                  const usage =
                    c.issued > 0 ? Math.round((c.used / c.issued) * 100) : 0;
                  const cfg = statusConfig[c.status];
                  return (
                    <div
                      key={c.id}
                      className="rounded-xl border bg-white p-3 hover:border-primary/40 hover:shadow-sm transition"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate">
                            {c.name}
                          </div>
                          <div className="text-xs text-content-tertiary mt-0.5">
                            {c.type} · {c.discount}
                          </div>
                        </div>
                        <Badge
                          variant={cfg.variant}
                          className="text-[10px] shrink-0"
                        >
                          {cfg.label}
                        </Badge>
                      </div>
                      <div className="mt-2 text-[11px] text-content-tertiary">
                        유효 {c.period}
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-xs">
                        <span className="text-content-tertiary">
                          발급{" "}
                          <b className="text-content">
                            {c.issued.toLocaleString()}
                          </b>
                        </span>
                        <span className="text-content-tertiary">
                          사용{" "}
                          <b className="text-primary">
                            {c.used.toLocaleString()}
                          </b>
                        </span>
                        <span className="ml-auto font-bold text-blue-700 tabular-nums">
                          {usage}%
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-tertiary">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                          style={{ width: `${usage}%` }}
                        />
                      </div>
                      <div className="mt-2 flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => notify(`${c.name} 발급 내역`, "info")}
                        >
                          발급 내역
                        </Button>
                        {c.status === "active" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={!canManage}
                            onClick={() => {
                              setCoupons((curr) =>
                                curr.map((x) =>
                                  x.id === c.id
                                    ? { ...x, status: "stopped" as const }
                                    : x,
                                ),
                              );
                              notify(`${c.name} 발급 중지`, "warning");
                            }}
                          >
                            중지
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {filtered.length === 0 && (
                <div className="py-12 text-center text-sm text-content-tertiary">
                  조건에 맞는 쿠폰이 없습니다.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>쿠폰 액션</CardTitle>
              <CardDescription>발급·중지·연장</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                disabled={!canManage}
                onClick={() =>
                  canManage
                    ? setShowCreate(true)
                    : notify("매니저 이상 권한 필요", "warning")
                }
              >
                + 새 쿠폰 발급
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => notify("일괄 발급 (세그먼트 연결) mock", "info")}
              >
                일괄 발급
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => notify("CSV 내보내기 mock", "info")}
              >
                CSV 내보내기
              </Button>
            </CardContent>
          </Card>
          {!canManage && (
            <Card className="shadow-none border-amber-200 bg-amber-50">
              <CardContent className="p-3 text-xs">
                <AlertTriangle
                  size={14}
                  className="inline text-amber-600 mr-1.5"
                />
                <b>권한 안내:</b> 쿠폰 발급/중지는 매니저 이상 권한 필요
              </CardContent>
            </Card>
          )}
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>

      {/* 쿠폰 발급 모달 */}
      {showCreate && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowCreate(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl border w-full max-w-[520px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-base font-bold">새 쿠폰 발급</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreate(false)}
              >
                <X size={16} />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">
                  쿠폰명 *
                </Label>
                <Input
                  placeholder="예: 신규 가입 10% 할인"
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold mb-1.5 block">
                    할인 유형 *
                  </Label>
                  <div className="flex gap-2">
                    {(["정률", "정액"] as const).map((t) => (
                      <Button
                        key={t}
                        size="sm"
                        variant={createForm.type === t ? "default" : "outline"}
                        className="flex-1"
                        onClick={() =>
                          setCreateForm({ ...createForm, type: t })
                        }
                      >
                        {t}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-semibold mb-1.5 block">
                    {createForm.type === "정률"
                      ? "할인율 (%)"
                      : "할인 금액 (원)"}{" "}
                    *
                  </Label>
                  <Input
                    type="number"
                    placeholder={createForm.type === "정률" ? "10" : "10000"}
                    value={createForm.value}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, value: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold mb-1.5 block">
                    유효 시작일 *
                  </Label>
                  <Input
                    type="date"
                    value={createForm.periodStart}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        periodStart: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold mb-1.5 block">
                    유효 종료일 *
                  </Label>
                  <Input
                    type="date"
                    value={createForm.periodEnd}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        periodEnd: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">
                  발급 수량
                </Label>
                <Input
                  type="number"
                  value={createForm.quantity}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      quantity: Number(e.target.value) || 0,
                    })
                  }
                />
                <p className="text-[10px] text-content-tertiary mt-1">
                  발급 수량은 추후 추가 가능합니다.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowCreate(false)}
              >
                취소
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  if (createForm.name.length < 3) {
                    notify("쿠폰명 3자 이상", "warning");
                    return;
                  }
                  if (!createForm.value) {
                    notify("할인값 입력 필요", "warning");
                    return;
                  }
                  if (!createForm.periodStart || !createForm.periodEnd) {
                    notify("유효 기간 선택", "warning");
                    return;
                  }
                  const discount =
                    createForm.type === "정률"
                      ? `${createForm.value}%`
                      : `${Number(createForm.value).toLocaleString()}원`;
                  const newCoupon: Coupon = {
                    id: Math.max(...coupons.map((c) => c.id)) + 1,
                    name: createForm.name,
                    type: createForm.type,
                    discount,
                    period: `${createForm.periodStart.slice(2).replace(/-/g, ".")} ~ ${createForm.periodEnd.slice(2).replace(/-/g, ".")}`,
                    issued: 0,
                    used: 0,
                    status: "active",
                  };
                  setCoupons([newCoupon, ...coupons]);
                  setShowCreate(false);
                  setCreateForm({
                    name: "",
                    type: "정률",
                    value: "",
                    periodStart: "",
                    periodEnd: "",
                    quantity: 100,
                  });
                  notify(`${newCoupon.name} 발급 완료`);
                }}
              >
                발급
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReferralProgramScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  // admin-pando referral 패턴 + 운영자 UX: V2 신규 추천 이벤트
  // 진행 중 이벤트 + 추천인 랭킹 + 혜택 트래킹 + 부정 감지 + 이벤트 생성 모달
  type EventStatus = "진행" | "예정" | "종료" | "중지";
  type ReferralEvent = {
    id: number;
    name: string;
    period: string;
    referrerBenefit: string;
    refereeBenefit: string;
    graceDays: number;
    participants: number;
    conversions: number;
    status: EventStatus;
  };

  const initialEvents: ReferralEvent[] = [
    {
      id: 1,
      name: "친구와 함께 헬스 (1+1)",
      period: "26.04.01 ~ 26.06.30",
      referrerBenefit: "마일리지 5,000원",
      refereeBenefit: "회원권 1개월 추가",
      graceDays: 30,
      participants: 84,
      conversions: 32,
      status: "진행",
    },
    {
      id: 2,
      name: "패밀리 가입 할인",
      period: "26.05.01 ~ 26.05.31",
      referrerBenefit: "다음 결제 10%",
      refereeBenefit: "첫 달 20%",
      graceDays: 14,
      participants: 26,
      conversions: 18,
      status: "진행",
    },
    {
      id: 3,
      name: "여름맞이 친구 추천",
      period: "26.06.15 ~ 26.08.15",
      referrerBenefit: "PT 1회 무료",
      refereeBenefit: "회원권 15% 할인",
      graceDays: 30,
      participants: 0,
      conversions: 0,
      status: "예정",
    },
    {
      id: 4,
      name: "봄 새 회원 이벤트 (종료)",
      period: "26.03.01 ~ 26.03.31",
      referrerBenefit: "마일리지 3,000원",
      refereeBenefit: "첫 달 무료",
      graceDays: 30,
      participants: 142,
      conversions: 68,
      status: "종료",
    },
  ];

  const referrers = [
    { name: "김민준", count: 8, mileage: 40000, suspicion: false },
    { name: "박서연", count: 6, mileage: 30000, suspicion: false },
    { name: "정하준", count: 5, mileage: 25000, suspicion: false },
    { name: "오지우", count: 4, mileage: 20000, suspicion: true },
    { name: "최가온", count: 3, mileage: 15000, suspicion: false },
  ];

  const fraudCases = [
    {
      referrer: "오지우",
      reason: "동일 IP 대량 가입 의심",
      count: 4,
      date: "어제",
    },
    {
      referrer: "한선우",
      reason: "피추천인 첫 결제 후 즉시 환불",
      count: 2,
      date: "2일 전",
    },
  ];

  const [events, setEvents] = useState<ReferralEvent[]>(initialEvents);
  const [filterStatus, setFilterStatus] = useState<EventStatus | "">("");
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    periodStart: "",
    periodEnd: "",
    referrerBenefit: "",
    refereeBenefit: "",
    graceDays: 30,
  });
  const [showFraud, setShowFraud] = useState(false);

  const filtered = filterStatus
    ? events.filter((e) => e.status === filterStatus)
    : events;
  const activeCount = events.filter((e) => e.status === "진행").length;
  const totalParticipants = events.reduce((s, e) => s + e.participants, 0);
  const totalConversions = events.reduce((s, e) => s + e.conversions, 0);
  const conversionRate =
    totalParticipants > 0
      ? Math.round((totalConversions / totalParticipants) * 100)
      : 0;
  const totalMileage = referrers.reduce((s, r) => s + r.mileage, 0);
  const fmt = (n: number) => n.toLocaleString("ko-KR");

  const statusVariant: Record<
    EventStatus,
    "success" | "info" | "secondary" | "destructive"
  > = {
    진행: "success",
    예정: "info",
    종료: "secondary",
    중지: "destructive",
  };

  const canManage =
    role === "OWNER" || role === "HQ_ADMIN" || role === "MANAGER";

  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="V2 신규 · 추천 이벤트 · 마일리지 적립"
      />

      {/* 통계 카드 4종 */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" /> 진행
              이벤트
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums text-emerald-600">
              {activeCount}건
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">현재 운영 중</p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <UserRound size={14} /> 참여자
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {totalParticipants}명
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">추천인 누계</p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <MessageSquare size={14} className="text-primary" /> 전환
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums text-primary">
              {totalConversions}명
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">
              전환율 {conversionRate}%
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-amber-600" /> 적립
              마일리지
            </CardDescription>
            <CardTitle className="text-xl tabular-nums text-amber-700">
              {fmt(totalMileage)}원
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">TOP 5 추천인 합산</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>리퍼럴 이벤트</CardTitle>
                <div className="flex gap-2">
                  <Select
                    value={filterStatus}
                    onValueChange={(v) =>
                      setFilterStatus(v as EventStatus | "")
                    }
                  >
                    <SelectTrigger className="h-9 w-32">
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="진행">진행</SelectItem>
                      <SelectItem value="예정">예정</SelectItem>
                      <SelectItem value="종료">종료</SelectItem>
                      <SelectItem value="중지">중지</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    disabled={!canManage}
                    onClick={() =>
                      canManage
                        ? setShowCreate(true)
                        : notify("매니저 이상 권한 필요", "warning")
                    }
                  >
                    + 이벤트 만들기
                  </Button>
                </div>
              </div>
              <CardDescription>
                {filtered.length}건 · 추천인·피추천인 혜택 · 그레이스 기간 ·
                전환율
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이벤트명</TableHead>
                    <TableHead className="w-40">운영 기간</TableHead>
                    <TableHead>추천인 혜택</TableHead>
                    <TableHead>피추천인 혜택</TableHead>
                    <TableHead className="w-16 text-center">그레이스</TableHead>
                    <TableHead className="text-right w-16">참여</TableHead>
                    <TableHead className="text-right w-16">전환</TableHead>
                    <TableHead className="w-20 text-center">상태</TableHead>
                    <TableHead className="w-20 text-center">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((e) => {
                    const rate =
                      e.participants > 0
                        ? Math.round((e.conversions / e.participants) * 100)
                        : 0;
                    return (
                      <TableRow key={e.id}>
                        <TableCell className="font-semibold">
                          {e.name}
                        </TableCell>
                        <TableCell className="text-xs tabular-nums">
                          {e.period}
                        </TableCell>
                        <TableCell className="text-xs">
                          {e.referrerBenefit}
                        </TableCell>
                        <TableCell className="text-xs">
                          {e.refereeBenefit}
                        </TableCell>
                        <TableCell className="text-center text-xs tabular-nums">
                          {e.graceDays}일
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {e.participants}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-primary font-semibold">
                          {e.conversions}{" "}
                          <span className="text-[10px] text-content-tertiary">
                            ({rate}%)
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={statusVariant[e.status]}
                            className="text-[10px]"
                          >
                            {e.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-1">
                            {e.status === "진행" && canManage && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEvents((curr) =>
                                    curr.map((x) =>
                                      x.id === e.id
                                        ? { ...x, status: "중지" as const }
                                        : x,
                                    ),
                                  );
                                  notify(`${e.name} 중지`, "warning");
                                }}
                              >
                                중지
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => notify(`${e.name} 상세`, "info")}
                            >
                              상세
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {filtered.length === 0 && (
                <div className="py-12 text-center text-sm text-content-tertiary">
                  조건에 맞는 이벤트가 없습니다.
                </div>
              )}
            </CardContent>
          </Card>

          {/* 추천인 랭킹 (운영자 인사이트) */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>추천인 랭킹 (TOP 5)</CardTitle>
              <CardDescription>
                이번 달 추천 회원 수 + 마일리지 적립 합계 · 부정 감지 플래그
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {referrers.map((r, idx) => (
                  <div
                    key={r.name}
                    className={cn(
                      "flex items-center justify-between rounded-lg border p-2.5",
                      r.suspicion ? "border-rose-200 bg-rose-50" : "bg-white",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "size-7 grid place-items-center rounded-full font-bold text-xs",
                          idx === 0 && "bg-amber-100 text-amber-700",
                          idx === 1 && "bg-slate-100 text-slate-700",
                          idx === 2 && "bg-orange-100 text-orange-700",
                          idx > 2 &&
                            "bg-surface-tertiary text-content-tertiary",
                        )}
                      >
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-semibold text-sm flex items-center gap-1.5">
                          {r.name}
                          {r.suspicion && (
                            <Badge
                              variant="destructive"
                              className="text-[10px]"
                            >
                              부정 의심
                            </Badge>
                          )}
                        </div>
                        <div className="text-[10px] text-content-tertiary">
                          추천 {r.count}건 · 마일리지 {fmt(r.mileage)}원
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {r.suspicion && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowFraud(true)}
                        >
                          점검
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          notify(`${r.name} 추천 이력 상세`, "info")
                        }
                      >
                        상세
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>리퍼럴 액션</CardTitle>
              <CardDescription>운영자 전용</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                disabled={!canManage}
                onClick={() =>
                  canManage
                    ? setShowCreate(true)
                    : notify("매니저 이상 권한 필요", "warning")
                }
              >
                + 이벤트 만들기
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowFraud(true)}
              >
                <AlertTriangle size={14} className="mr-1.5 text-amber-600" />{" "}
                부정 감지 ({fraudCases.length})
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => notify("추천 코드 일괄 발급 mock", "info")}
              >
                추천 코드 일괄 발급
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => notify("CSV 내보내기 mock", "info")}
              >
                CSV 내보내기
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>혜택 정책 (V2)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-xs text-content-secondary">
              <div>• 추천인: 마일리지 자동 적립 (피추천인 첫 결제 시)</div>
              <div>• 피추천인: 첫 결제 즉시 할인 또는 추가 기간</div>
              <div>• 그레이스: 추천일 후 N일 내 가입만 인정</div>
              <div>• 중복 방지: 동일 회원 2회 이상 추천 불가</div>
              <div>• 환불 시: 마일리지 회수 자동</div>
              <div>• 부정 감지: 동일 IP/환불 패턴 모니터링</div>
            </CardContent>
          </Card>
          {!canManage && (
            <Card className="shadow-none border-amber-200 bg-amber-50">
              <CardContent className="p-3 text-xs">
                <AlertTriangle
                  size={14}
                  className="inline text-amber-600 mr-1.5"
                />
                <b>권한 안내:</b> 이벤트 생성/중지는 매니저 이상 권한 필요
              </CardContent>
            </Card>
          )}
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>

      {/* 이벤트 만들기 모달 */}
      {showCreate && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowCreate(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl border w-full max-w-[520px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-base font-bold">새 추천 이벤트 만들기</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreate(false)}
              >
                <X size={16} />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">
                  이벤트명 *
                </Label>
                <Input
                  placeholder="예: 친구와 함께 헬스"
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, name: e.target.value })
                  }
                />
                {createForm.name && createForm.name.length < 3 && (
                  <p className="text-[10px] text-rose-600 mt-1">
                    3자 이상 입력해주세요.
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold mb-1.5 block">
                    시작일 *
                  </Label>
                  <Input
                    type="date"
                    value={createForm.periodStart}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        periodStart: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold mb-1.5 block">
                    종료일 *
                  </Label>
                  <Input
                    type="date"
                    value={createForm.periodEnd}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        periodEnd: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">
                  추천인 혜택 *
                </Label>
                <Input
                  placeholder="예: 마일리지 5,000원, PT 1회"
                  value={createForm.referrerBenefit}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      referrerBenefit: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">
                  피추천인 혜택 *
                </Label>
                <Input
                  placeholder="예: 첫 달 무료, 회원권 1개월 추가"
                  value={createForm.refereeBenefit}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      refereeBenefit: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">
                  그레이스 기간 (일)
                </Label>
                <Input
                  type="number"
                  value={createForm.graceDays}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      graceDays: Number(e.target.value) || 0,
                    })
                  }
                />
                <p className="text-[10px] text-content-tertiary mt-1">
                  추천일 후 N일 내 피추천인이 가입해야 혜택 적용 (기본 30일)
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowCreate(false)}
              >
                취소
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  if (createForm.name.length < 3) {
                    notify("이벤트명 3자 이상", "warning");
                    return;
                  }
                  if (!createForm.periodStart || !createForm.periodEnd) {
                    notify("기간 선택 필요", "warning");
                    return;
                  }
                  if (
                    !createForm.referrerBenefit ||
                    !createForm.refereeBenefit
                  ) {
                    notify("양측 혜택 입력 필요", "warning");
                    return;
                  }
                  if (createForm.graceDays < 1 || createForm.graceDays > 90) {
                    notify("그레이스 기간 1~90일", "warning");
                    return;
                  }
                  const newEvent: ReferralEvent = {
                    id: Math.max(...events.map((e) => e.id)) + 1,
                    name: createForm.name,
                    period: `${createForm.periodStart.slice(2).replace(/-/g, ".")} ~ ${createForm.periodEnd.slice(2).replace(/-/g, ".")}`,
                    referrerBenefit: createForm.referrerBenefit,
                    refereeBenefit: createForm.refereeBenefit,
                    graceDays: createForm.graceDays,
                    participants: 0,
                    conversions: 0,
                    status: "예정",
                  };
                  setEvents([newEvent, ...events]);
                  setShowCreate(false);
                  setCreateForm({
                    name: "",
                    periodStart: "",
                    periodEnd: "",
                    referrerBenefit: "",
                    refereeBenefit: "",
                    graceDays: 30,
                  });
                  notify(`${newEvent.name} 이벤트 생성 완료 (예정 상태)`);
                }}
              >
                만들기
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 부정 감지 점검 모달 */}
      {showFraud && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowFraud(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl border w-full max-w-[520px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <AlertTriangle size={16} className="text-rose-600" /> 부정 감지
                의심 사례 ({fraudCases.length}건)
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFraud(false)}
              >
                <X size={16} />
              </Button>
            </div>
            <div className="p-6 space-y-3">
              <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs">
                <AlertTriangle
                  size={14}
                  className="inline text-rose-600 mr-1.5"
                />
                <b>감지 규칙:</b> 동일 IP/디바이스 연속 가입, 첫 결제 후 즉시
                환불, 추천 후 30일 내 환불 등.
              </div>
              <div className="space-y-2">
                {fraudCases.map((c, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border p-3 flex items-start justify-between gap-3"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{c.referrer}</div>
                      <div className="text-xs text-content-tertiary mt-0.5">
                        {c.reason}
                      </div>
                      <div className="text-[10px] text-content-tertiary mt-1">
                        의심 건수: {c.count} · {c.date}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          notify(`${c.referrer} 마일리지 회수`, "warning")
                        }
                      >
                        회수
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          notify(`${c.referrer} 정상 처리`, "info")
                        }
                      >
                        정상
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end">
              <Button onClick={() => setShowFraud(false)}>닫기</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- D09 설정 ----

function NoticesScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  // admin-pando /notices/page.tsx 구조 1:1 이식 (V2 신규)
  // 상단 카드 통계 + 핀 고정 행 + 읽음/NEW 배지 + 작성 액션
  // docs4 V2 D09-설정관리/공지사항 컨텐츠 반영
  type NoticeRow = {
    id: number;
    title: string;
    content: string;
    authorName: string;
    isPinned: boolean;
    isPublic: boolean;
    createdAt: string;
    isRead: boolean;
  };

  const initialNotices: NoticeRow[] = [
    {
      id: 1,
      title: "[중요] 6월 시설 점검 안내",
      content:
        "6월 12일(수) 02:00~05:00 사이 메인 운동기구 및 락커 시설 정기 점검이 진행됩니다. 점검 시간 동안 24시간 출입은 제한될 수 있습니다.",
      authorName: "본사 운영팀",
      isPinned: true,
      isPublic: true,
      createdAt: "2026-05-25",
      isRead: false,
    },
    {
      id: 2,
      title: "신규 GX 클래스 (요가/필라테스) 5월 31일 오픈",
      content:
        "강남점·서초점에서 주 4회 GX 요가, 주 3회 필라테스 클래스가 신규 개설됩니다. 회원 등급별 무료 체험 1회 제공.",
      authorName: "서초점 매니저",
      isPinned: true,
      isPublic: true,
      createdAt: "2026-05-24",
      isRead: true,
    },
    {
      id: 3,
      title: "여름 휴가 운영 시간 변경 (8/1~8/15)",
      content:
        "여름 휴가 기간 동안 영업 시간이 06:00~22:00로 축소 운영됩니다. 24시간 출입 회원은 이용권 자동 연장 처리.",
      authorName: "강남점 점장",
      isPinned: false,
      isPublic: true,
      createdAt: "2026-05-22",
      isRead: false,
    },
    {
      id: 4,
      title: "PT 트레이너 신규 입사 안내 (3명)",
      content:
        "5월 27일자로 PT 트레이너 3명이 신규 입사하였습니다. 회원 상세 페이지의 담당자 변경에서 새 트레이너를 지정할 수 있습니다.",
      authorName: "본사 인사팀",
      isPinned: false,
      isPublic: false,
      createdAt: "2026-05-20",
      isRead: true,
    },
    {
      id: 5,
      title: "회원 등급제 V2 시작 (브론즈/실버/골드/플래티넘)",
      content:
        "누적 결제 금액 + 방문 횟수 기준 자동 산정으로 회원 등급제가 시작됩니다. 등급별 마일리지 적립율, GX 우선 예약 혜택 제공.",
      authorName: "본사 마케팅팀",
      isPinned: false,
      isPublic: true,
      createdAt: "2026-05-18",
      isRead: true,
    },
    {
      id: 6,
      title: "[직원 전용] 급여 명세서 발급 안내",
      content:
        "이번 달 급여 명세서가 발급되었습니다. 급여 관리 페이지 > 명세서 발급 메뉴에서 PDF 다운로드 가능.",
      authorName: "본사 인사팀",
      isPinned: false,
      isPublic: false,
      createdAt: "2026-05-15",
      isRead: false,
    },
  ];

  const [notices, setNotices] = useState<NoticeRow[]>(initialNotices);
  const [filter, setFilter] = useState<"전체" | "게시 중" | "예정" | "종료">(
    "전체",
  );
  const [showCreate, setShowCreate] = useState(false);
  const [detailNotice, setDetailNotice] = useState<NoticeRow | null>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    isPinned: false,
    isPublic: true,
  });

  const sortedNotices = [...notices].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.createdAt.localeCompare(a.createdAt);
  });

  const readCount = notices.filter((n) => n.isRead).length;
  const unreadCount = notices.length - readCount;
  const pinnedCount = notices.filter((n) => n.isPinned).length;
  const publicCount = notices.filter((n) => n.isPublic).length;

  const markAsRead = (id: number) => {
    setNotices((current) =>
      current.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="V2 신규 · 게시 대상/기간/핀 고정"
      />

      {/* 통계 카드 */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription>전체 공지</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {notices.length}건
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">
              읽음 {readCount} · 미읽음 {unreadCount}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription>상단 고정</CardDescription>
            <CardTitle className="text-2xl tabular-nums text-primary">
              {pinnedCount}건
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">목록 최상단 노출</p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription>공개 공지</CardDescription>
            <CardTitle className="text-2xl tabular-nums text-emerald-600">
              {publicCount}건
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">회원 앱 노출</p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription>미읽음</CardDescription>
            <CardTitle className="text-2xl tabular-nums text-rose-600">
              {unreadCount}건
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-content-tertiary">NEW 배지 표시</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>공지 목록</CardTitle>
                <Button
                  size="sm"
                  onClick={() => {
                    setForm({
                      title: "",
                      content: "",
                      isPinned: false,
                      isPublic: true,
                    });
                    setShowCreate(true);
                  }}
                >
                  <Bell size={14} className="mr-1.5" /> 공지 작성
                </Button>
              </div>
              <CardDescription>
                총 {notices.length}건 · 읽음 {readCount}건 · 핀 고정 우선 정렬
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-1 border-b border-line">
                {(["전체", "게시 중", "예정", "종료"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "px-4 py-2 text-sm font-semibold border-b-2 transition-colors",
                      filter === f
                        ? "border-primary text-primary"
                        : "border-transparent text-content-secondary hover:text-content",
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>제목</TableHead>
                    <TableHead className="w-20 text-center">읽음</TableHead>
                    <TableHead className="w-28">작성자</TableHead>
                    <TableHead className="w-28">작성일</TableHead>
                    <TableHead className="w-20 text-center">공개</TableHead>
                    <TableHead className="w-24 text-center">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedNotices.map((n) => (
                    <TableRow
                      key={n.id}
                      className="cursor-pointer"
                      onClick={() => {
                        setDetailNotice(n);
                        markAsRead(n.id);
                      }}
                    >
                      <TableCell className="text-center">
                        {n.isPinned ? (
                          <Pin size={14} className="text-primary mx-auto" />
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <div
                          className={cn(
                            "flex items-center gap-1.5 text-sm font-semibold",
                            n.isPinned && "text-primary",
                          )}
                        >
                          {n.isPinned && (
                            <span className="text-[10px] bg-primary-light text-primary px-1.5 py-0.5 rounded-full">
                              공지
                            </span>
                          )}
                          <span className="truncate">{n.title}</span>
                          {!n.isRead && (
                            <span
                              className="inline-block h-2 w-2 rounded-full bg-primary shrink-0"
                              title="읽지 않음"
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {n.isRead ? (
                          <span className="text-[11px] text-content-tertiary">
                            읽음
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-primary">
                            NEW
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">{n.authorName}</TableCell>
                      <TableCell className="text-xs">{n.createdAt}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={n.isPublic ? "success" : "secondary"}
                          className="text-[10px]"
                        >
                          {n.isPublic ? "공개" : "비공개"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex gap-1 justify-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              notify(`${n.title} 수정`, "info");
                            }}
                          >
                            수정
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              notify(`${n.title} 삭제 확인`, "warning");
                            }}
                          >
                            삭제
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {sortedNotices.length === 0 && (
                <div className="py-12 text-center text-sm text-content-tertiary">
                  등록된 공지사항이 없습니다.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>공지 액션</CardTitle>
              <CardDescription>작성·수정·삭제·핀 고정</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                onClick={() => {
                  setForm({
                    title: "",
                    content: "",
                    isPinned: false,
                    isPublic: true,
                  });
                  setShowCreate(true);
                }}
              >
                <Bell size={14} className="mr-1.5" /> 공지 작성
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => notify("전체 읽음 처리 mock", "info")}
              >
                전체 읽음 처리
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => notify("핀 고정 한도 5개 (V2 정책)", "info")}
              >
                핀 고정 정책
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>V2 게시 정책</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-xs text-content-secondary">
              <div>• 게시 대상: 전 회원 / 직원 / 특정 등급</div>
              <div>• 게시 기간: 시작일 ~ 종료일 (선택)</div>
              <div>• 핀 고정 한도: 5개 (초과 시 마지막 게시 자동 해제)</div>
              <div>• 미공개 = 직원 전용 (회원 앱 미노출)</div>
              <div>• 읽음 상태: localStorage 기준 (회원/직원 분리)</div>
            </CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>

      {/* 작성/수정 모달 (admin-pando 패턴 차용) */}
      {showCreate && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowCreate(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg border w-full max-w-[540px] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-6 py-4 border-b">
              <Bell size={18} className="text-primary" />
              <h3 className="text-base font-bold">공지사항 작성</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">
                  제목 *
                </Label>
                <Input
                  placeholder="공지 제목을 입력하세요"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">
                  내용 *
                </Label>
                <Textarea
                  rows={6}
                  placeholder="공지 내용을 입력하세요"
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg border">
                  <div>
                    <p className="text-xs font-semibold">상단 고정</p>
                    <p className="text-[10px] text-content-tertiary">
                      목록 맨 위에 고정
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({ ...form, isPinned: !form.isPinned })
                    }
                    className={cn(
                      "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                      form.isPinned ? "bg-primary" : "bg-line",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
                        form.isPinned ? "translate-x-4" : "translate-x-0.5",
                      )}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg border">
                  <div>
                    <p className="text-xs font-semibold">공개 여부</p>
                    <p className="text-[10px] text-content-tertiary">
                      회원 앱 노출
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({ ...form, isPublic: !form.isPublic })
                    }
                    className={cn(
                      "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                      form.isPublic ? "bg-emerald-500" : "bg-line",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
                        form.isPublic ? "translate-x-4" : "translate-x-0.5",
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-2 px-6 py-4 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowCreate(false)}
              >
                취소
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  if (!form.title.trim()) {
                    notify("제목을 입력해주세요.", "warning");
                    return;
                  }
                  if (!form.content.trim()) {
                    notify("내용을 입력해주세요.", "warning");
                    return;
                  }
                  const newNotice: NoticeRow = {
                    id: Math.max(...notices.map((n) => n.id)) + 1,
                    title: form.title,
                    content: form.content,
                    authorName: "관리자",
                    isPinned: form.isPinned,
                    isPublic: form.isPublic,
                    createdAt: new Date().toISOString().slice(0, 10),
                    isRead: true,
                  };
                  setNotices([newNotice, ...notices]);
                  notify("공지사항이 등록되었습니다.");
                  setShowCreate(false);
                }}
              >
                등록
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 상세 보기 — docs4 V2 요구 우측 패널 + admin-pando 슬라이드 UX */}
      {detailNotice && (
        <AdminSlidePanel
          open={Boolean(detailNotice)}
          onClose={() => setDetailNotice(null)}
          eyebrow="docs4 V2 SCR-085 · 공지 상세 미리보기"
          title={detailNotice.title}
          size="md"
          testId="notice-detail-slide-panel"
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => {
                  notify(`${detailNotice.title} 수정 mock`, "info");
                  setDetailNotice(null);
                }}
              >
                수정
              </Button>
              <Button onClick={() => setDetailNotice(null)}>닫기</Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-line bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                {detailNotice.isPinned && (
                  <Pin size={14} className="text-primary" />
                )}
                <Badge
                  variant={detailNotice.isPublic ? "success" : "secondary"}
                  className="text-[10px]"
                >
                  {detailNotice.isPublic ? "공개" : "비공개"}
                </Badge>
                {!detailNotice.isRead && (
                  <Badge variant="info" className="text-[10px]">
                    NEW
                  </Badge>
                )}
              </div>
              <p className="text-xs text-content-tertiary">
                {detailNotice.authorName} · {detailNotice.createdAt}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-content-secondary">
                <div className="rounded-lg bg-surface-secondary p-2">
                  <b className="text-content">게시 대상</b>
                  <br />전 직원/회원 앱 정책 기준
                </div>
                <div className="rounded-lg bg-surface-secondary p-2">
                  <b className="text-content">핀 정책</b>
                  <br />
                  V2 상단 고정 한도 반영
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-line bg-white p-5 shadow-sm">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-content">
                {detailNotice.content}
              </p>
            </div>
          </div>
        </AdminSlidePanel>
      )}
    </div>
  );
}

// ---- D10 본사관리 ----

function BranchDashboardScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  // admin-pando (dashboard)/page.tsx 구조 1:1 이식
  const [showBanner, setShowBanner] = useState(true);
  const refreshTime = "09:42";
  const roleInfo = roleById.get(role)!;

  // docs4 V2 SCR-090 명시 핵심 지표 5개 (전체 회원 / 활성 회원 / HQ-09 만료 알림 대상 / 오늘 출석 / 이번 달 매출)
  // + V1+V2 합집합 운영 보조 5개 (만료 회원/활성 비율/방문 빈도/미수금/환불)
  const kpiCards = [
    {
      label: "전체 회원 수",
      value: "3,248",
      icon: <UserRound size={16} />,
      change: "전월 +132",
      tone: "default" as const,
    },
    {
      label: "활성 회원 수",
      value: "2,614",
      icon: <CheckCircle2 size={16} />,
      change: "전체 80.5%",
      tone: "default" as const,
    },
    {
      label: "HQ-09 만료 알림 대상",
      value: "92",
      icon: <AlertTriangle size={16} />,
      change: "회원 이용권 만료 step (기본 30일)",
      tone: "peach" as const,
    },
    {
      label: "오늘 출석 수",
      value: "412",
      icon: <ClipboardCheck size={16} />,
      change: "어제 +38",
      tone: "default" as const,
    },
    {
      label: "이번 달 매출",
      value: "18.4M원",
      icon: <Building2 size={16} />,
      change: "목표 82%",
      tone: "default" as const,
    },
    {
      label: "만료 회원 수",
      value: "184",
      icon: <AlertTriangle size={16} />,
      change: "전체 5.7%",
      tone: "default" as const,
    },
    {
      label: "활성 회원 비율",
      value: "80.5%",
      icon: <ShieldCheck size={16} />,
      change: "2,614 / 3,248명",
      tone: "mint" as const,
    },
    {
      label: "월 방문 빈도",
      value: "8.4회",
      icon: <UserRound size={16} />,
      change: "이번달 22,000건",
      tone: "default" as const,
    },
    {
      label: "미수금 총액",
      value: "1.12M원",
      icon: <AlertTriangle size={16} />,
      change: "미납 합계",
      tone: "peach" as const,
    },
    {
      label: "이번 달 환불",
      value: "9건",
      icon: <AlertTriangle size={16} />,
      change: "620,000원 (V1+V2)",
      tone: "peach" as const,
    },
  ];

  const focusQueue = [
    {
      label: "만료 임박 회원",
      value: "92명",
      description: "가장 가까운 만료: 박서연 D-3",
      tone: "amber",
      cta: "회원 보기",
    },
    {
      label: "미수금 추적",
      value: "112만원",
      description: "박서연 120,000원 · 12일 경과",
      tone: "rose",
      cta: "매출 보기",
    },
    {
      label: "홀딩 관리",
      value: "6건",
      description: "정하준 · 12일 남음",
      tone: "sky",
      cta: "회원 보기",
    },
  ];

  const quickActions = [
    {
      label: "회원 목록",
      description: "이탈·재등록 대상 확인",
      icon: <UserRound size={14} />,
      route: "/members",
    },
    {
      label: "매출 현황",
      description: "미수·환불 거래 점검",
      icon: <Building2 size={14} />,
      route: "/sales",
    },
    {
      label: "자동 알림",
      description: "만료·미수 추적 메시지 관리",
      icon: <MessageSquare size={14} />,
      route: "/message/auto-alarm",
    },
    {
      label: "Today Tasks",
      description: "당일 운영 큐 실행",
      icon: <ClipboardCheck size={14} />,
      route: "/today-tasks",
    },
  ];

  const birthdayMembers = [
    { name: "김민준", birth: "1991-04-18", status: "활성" },
    { name: "박서연", birth: "1994-05-29", status: "활성" },
  ];

  const unpaidMembers = [
    { name: "박서연", item: "회원권 3개월", overdue: 12, amount: "120,000" },
    { name: "오지우", item: "PT 잔여", overdue: 42, amount: "80,000" },
    { name: "정하준", item: "락커 1개월", overdue: 5, amount: "30,000" },
  ];

  const holdingMembers = [
    { name: "정하준", period: "05.01 ~ 07.10", remaining: 42 },
    { name: "한서윤", period: "04.20 ~ 06.20", remaining: 22 },
  ];

  const expiringMembers = [
    { name: "박서연", expiry: "2026.05.31", dday: "D-3", ddayNum: 3 },
    { name: "오지우", expiry: "2026.06.04", dday: "D-7", ddayNum: 7 },
    { name: "최가온", expiry: "2026.06.18", dday: "D-21", ddayNum: 21 },
  ];

  return (
    <div className="space-y-5">
      {/* DeliveryHeader 유지 — 검수 모드 + 출처 배지 */}
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="지점 운영 메인 (admin-pando 구조)"
      />

      {/* 공지 배너 — admin-pando 1:1 */}
      {showBanner && (
        <div className="flex items-center justify-between rounded-xl border border-primary/10 bg-primary-light px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-content">
                신규 &apos;전자계약&apos; 기능이 업데이트 되었습니다!
              </p>
              <p className="text-[12px] text-content-secondary">
                종이 계약서 대신 모바일로 간편하게 서명을 받으세요.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => notify("기능 보기 mock", "info")}
            >
              기능 보기
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBanner(false)}
            >
              닫기
            </Button>
          </div>
        </div>
      )}

      {/* 페이지 헤더 — admin-pando PageHeader 1:1 */}
      <div className="flex items-end justify-between border-b border-line/60 pb-4">
        <div>
          <h1 className="text-[24px] font-black tracking-tight text-content">
            대시보드
          </h1>
          <p className="mt-1 text-[13px] text-content-secondary">
            {branch}의 실시간 센터 운영 현황입니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5">
            <span className="text-[12px] text-content-tertiary">
              갱신: {refreshTime}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => notify("새로고침 mock", "info")}
            >
              새로고침
            </Button>
          </div>
          <Button asChild size="sm">
            <Link href="/members/new">회원 신규 등록</Link>
          </Button>
        </div>
      </div>

      {/* Daily Focus + Quick Actions — 2분할 — admin-pando 1:1 */}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.95fr)]">
        <section className="rounded-2xl border border-line bg-surface p-5 shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-content-tertiary">
                Daily Focus
              </p>
              <h2 className="mt-1 text-[20px] font-bold text-content">
                오늘 집중 업무
              </h2>
              <p className="mt-1 text-[13px] leading-relaxed text-content-secondary">
                운영 사고와 매출 누수를 막기 위해 오늘 먼저 봐야 할 항목을
                우선순위대로 정리했습니다.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/today-tasks">Today Tasks</Link>
            </Button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {focusQueue.map((item) => (
              <button
                key={item.label}
                className={cn(
                  "rounded-2xl border p-4 text-left transition-colors",
                  item.tone === "amber" &&
                    "border-amber-200 bg-amber-50 hover:bg-amber-100/80",
                  item.tone === "rose" &&
                    "border-rose-200 bg-rose-50 hover:bg-rose-100/80",
                  item.tone === "sky" &&
                    "border-sky-200 bg-sky-50 hover:bg-sky-100/80",
                )}
                onClick={() => notify(`${item.label} mock 이동`, "info")}
              >
                <p className="text-[12px] font-semibold text-content">
                  {item.label}
                </p>
                <p className="mt-2 text-[24px] font-bold text-content">
                  {item.value}
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-content-secondary">
                  {item.description}
                </p>
                <div className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-primary">
                  <span>{item.cta}</span>
                  <ChevronRight size={12} />
                </div>
              </button>
            ))}
          </div>
        </section>

        <aside className="rounded-2xl border border-line bg-surface p-5 shadow-card">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-content-tertiary">
              Quick Actions
            </p>
            <h2 className="mt-1 text-[18px] font-bold text-content">
              역할별 바로가기
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-content-secondary">
              {roleInfo.label} 역할에 맞는 주요 운영 화면만 추려서 바로
              실행합니다.
            </p>
          </div>
          <div className="mt-4 space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.route}
                className="flex w-full items-start gap-2 rounded-2xl border border-line bg-white/80 px-3 py-3 text-left transition-colors hover:border-primary/30 hover:bg-primary-light/20"
              >
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
                  {action.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-content">
                    {action.label}
                  </p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-content-secondary">
                    {action.description}
                  </p>
                </div>
                <ChevronRight
                  size={14}
                  className="mt-0.5 text-content-tertiary"
                />
              </Link>
            ))}
          </div>
        </aside>
      </div>

      {/* 10 KPI 카드 — admin-pando StatCardGrid 1:1 */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {kpiCards.map((stat) => (
          <button
            key={stat.label}
            type="button"
            onClick={() => notify(`${stat.label} 상세 mock`, "info")}
            className={cn(
              "relative overflow-hidden rounded-2xl border bg-white p-4 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-md",
              stat.tone === "peach" && "border-amber-200 bg-amber-50/60",
              stat.tone === "mint" && "border-emerald-200 bg-emerald-50/60",
              stat.tone === "default" && "border-line",
            )}
          >
            <div
              className={cn(
                "absolute inset-x-0 top-0 h-1",
                stat.tone === "peach" && "bg-amber-300",
                stat.tone === "mint" && "bg-emerald-400",
                stat.tone === "default" && "bg-primary/60",
              )}
            />
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-semibold text-content-secondary">
                {stat.label}
              </p>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-light text-primary">
                {stat.icon}
              </div>
            </div>
            <p className="mt-2 text-[22px] font-black tabular-nums text-content">
              {stat.value}
            </p>
            <p className="mt-1 text-[11px] text-content-tertiary">
              {stat.change}
            </p>
          </button>
        ))}
      </div>

      {/* 운영 현황 차트 3분할 — admin-pando 1:1 */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-content">운영 현황</h2>
          <Badge
            variant="info"
            className="border-primary/30 bg-primary-light text-primary"
          >
            실시간 mock
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {/* 회원 분포 */}
          <div className="rounded-xl border border-line bg-surface p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-content">
                회원 분포
              </h3>
              <Badge
                variant="info"
                className="border-primary/30 bg-primary-light text-primary"
              >
                전체회원 기준
              </Badge>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative h-20 w-20 shrink-0">
                <svg
                  className="h-full w-full rotate-[-90deg]"
                  viewBox="0 0 36 36"
                >
                  <circle
                    className="stroke-surface-tertiary"
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    strokeWidth="3.5"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    strokeWidth="3.5"
                    stroke="#fa3c64"
                    strokeDasharray="56 44"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    strokeWidth="3.5"
                    stroke="#ff907f"
                    strokeDasharray="44 56"
                    strokeDashoffset="-56"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[11px] font-bold text-content">
                    3,248
                  </span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-[12px] text-content-secondary">
                      여성
                    </span>
                  </div>
                  <span className="text-[12px] font-semibold text-content">
                    56% (1,819명)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                    <span className="text-[12px] text-content-secondary">
                      남성
                    </span>
                  </div>
                  <span className="text-[12px] font-semibold text-content">
                    44% (1,429명)
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {[
                { label: "20대", value: 38, color: "bg-primary" },
                { label: "30대", value: 28, color: "bg-accent" },
                { label: "40대", value: 18, color: "bg-content-tertiary" },
                { label: "50대", value: 12, color: "bg-amber-400" },
              ].map((age) => (
                <div key={age.label} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[11px] text-content-secondary">
                    <span>{age.label}</span>
                    <span className="font-semibold">{age.value}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-tertiary">
                    <div
                      className={cn("h-full rounded-full", age.color)}
                      style={{ width: `${age.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 주간 출석 */}
          <div className="rounded-xl border border-line bg-surface p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-content">
                주간 출석
              </h3>
              <span className="text-[11px] text-content-tertiary">이번 주</span>
            </div>
            <div className="flex h-[180px] items-end justify-between gap-1.5">
              {[
                { d: "월", c: 380, today: false },
                { d: "화", c: 412, today: false },
                { d: "수", c: 358, today: false },
                { d: "목", c: 442, today: true },
                { d: "금", c: 0, today: false },
                { d: "토", c: 0, today: false },
                { d: "일", c: 0, today: false },
              ].map((day) => {
                const max = 442;
                const pct = (day.c / max) * 100;
                return (
                  <div
                    key={day.d}
                    className="group relative flex h-full flex-1 flex-col items-center justify-end gap-1"
                  >
                    {day.c > 0 && (
                      <span className="mb-0.5 text-[10px] font-semibold text-content-secondary">
                        {day.c}
                      </span>
                    )}
                    <div
                      className={cn(
                        "w-full max-w-[32px] rounded-t-md transition-all",
                        day.today ? "bg-primary" : "bg-accent/60",
                        day.c === 0 && "bg-surface-tertiary",
                      )}
                      style={{
                        height: day.c > 0 ? `${Math.max(pct, 8)}%` : "4px",
                      }}
                    />
                    <span
                      className={cn(
                        "shrink-0 text-[10px] font-medium",
                        day.today
                          ? "text-primary font-bold"
                          : "text-content-tertiary",
                      )}
                    >
                      {day.d}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg bg-surface-secondary p-3">
              <div>
                <p className="text-[11px] text-content-secondary">
                  오늘 총 방문
                </p>
                <p className="text-[18px] font-bold text-content">412명</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-content-tertiary">실시간</p>
                <p className="text-[13px] font-semibold text-emerald-600">
                  Live
                </p>
              </div>
            </div>
          </div>

          {/* 매출 추이 */}
          <div className="rounded-xl border border-line bg-surface p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-content">
                매출 추이
              </h3>
              <span className="text-[11px] text-content-tertiary">
                최근 6개월
              </span>
            </div>
            <div className="flex h-[180px] items-end justify-between gap-1.5">
              {[
                { m: "12월", v: 14.2 },
                { m: "1월", v: 12.8 },
                { m: "2월", v: 13.6 },
                { m: "3월", v: 15.4 },
                { m: "4월", v: 16.4 },
                { m: "5월", v: 18.4 },
              ].map((m, idx) => {
                const max = 18.4;
                const pct = (m.v / max) * 100;
                const isCurrent = idx === 5;
                return (
                  <div
                    key={m.m}
                    className="group relative flex h-full flex-1 flex-col items-center justify-end gap-1"
                  >
                    <div
                      className={cn(
                        "w-full max-w-[32px] rounded-t-md transition-all",
                        isCurrent ? "bg-primary" : "bg-accent/60",
                      )}
                      style={{ height: `${Math.max(pct, 8)}%` }}
                    />
                    <span className="shrink-0 text-[10px] text-content-tertiary">
                      {m.m}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-surface-secondary p-2">
                <p className="text-[11px] text-content-tertiary">이번달 매출</p>
                <p className="mt-0.5 text-[14px] font-bold text-content">
                  18.4M
                </p>
              </div>
              <div className="rounded-lg bg-surface-secondary p-2">
                <p className="text-[11px] text-content-tertiary">활성 회원</p>
                <p className="mt-0.5 text-[14px] font-bold text-content">
                  2,614명
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 리스트 카드 — 2x2 admin-pando 1:1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <div className="space-y-3">
          {/* 생일자 */}
          <div className="overflow-hidden rounded-xl border border-line bg-surface">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-primary" />
                <h3 className="text-[13px] font-semibold text-content">
                  오늘 생일자 회원
                </h3>
              </div>
              <span className="text-[12px] font-semibold text-primary">
                {birthdayMembers.length}명
              </span>
            </div>
            <div className="p-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>생년월일</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {birthdayMembers.map((m) => (
                    <TableRow key={m.name}>
                      <TableCell className="font-semibold">{m.name}</TableCell>
                      <TableCell>{m.birth}</TableCell>
                      <TableCell>
                        <Badge variant="success">{m.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" asChild>
                          <Link href="/members/detail">
                            <ChevronRight size={12} />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* 미수금 */}
          <div className="overflow-hidden rounded-xl border border-line bg-surface">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-rose-600" />
                <h3 className="text-[13px] font-semibold text-content">
                  미수금 회원
                </h3>
              </div>
              <span className="text-[12px] font-semibold text-rose-600">
                {unpaidMembers.length}건
              </span>
            </div>
            <div className="p-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>상품명</TableHead>
                    <TableHead>연체</TableHead>
                    <TableHead className="text-right">미납 금액</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unpaidMembers.map((m) => (
                    <TableRow key={m.name}>
                      <TableCell className="font-semibold">{m.name}</TableCell>
                      <TableCell>{m.item}</TableCell>
                      <TableCell>
                        {m.overdue > 30 ? (
                          <Badge variant="destructive">장기미납</Badge>
                        ) : (
                          <span className="text-[12px] text-content-secondary">
                            {m.overdue}일
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {m.amount}원
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" asChild>
                          <Link href="/sales/payment">결제</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {/* 홀딩 */}
          <div className="overflow-hidden rounded-xl border border-line bg-surface">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-content-secondary" />
                <h3 className="text-[13px] font-semibold text-content">
                  연기(홀딩) 중인 회원
                </h3>
              </div>
              <span className="text-[12px] font-semibold text-content-secondary">
                {holdingMembers.length}명
              </span>
            </div>
            <div className="p-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>홀딩 기간</TableHead>
                    <TableHead>잔여일</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {holdingMembers.map((m) => (
                    <TableRow key={m.name}>
                      <TableCell className="font-semibold">{m.name}</TableCell>
                      <TableCell className="text-center">{m.period}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="info">{m.remaining}일</Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" asChild>
                          <Link href="/members/detail">
                            <ChevronRight size={12} />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* 만료 임박 */}
          <div className="overflow-hidden rounded-xl border border-line bg-surface">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" />
                <h3 className="text-[13px] font-semibold text-content">
                  이용권 만료 임박
                </h3>
              </div>
              <span className="text-[12px] font-semibold text-content">
                {expiringMembers.length}명
              </span>
            </div>
            <div className="p-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>만료 예정일</TableHead>
                    <TableHead>D-Day</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiringMembers.map((m) => (
                    <TableRow key={m.name}>
                      <TableCell className="font-semibold">{m.name}</TableCell>
                      <TableCell className="text-center">{m.expiry}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            m.ddayNum <= 3
                              ? "destructive"
                              : m.ddayNum <= 7
                                ? "warning"
                                : "outline"
                          }
                        >
                          {m.dday}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <button
                          className="rounded-md bg-primary-light px-2 py-1 text-[11px] font-medium text-primary hover:bg-primary hover:text-white transition-all"
                          onClick={() =>
                            notify(`${m.name} 재등록 상담 mock`, "info")
                          }
                        >
                          재등록 상담
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* 프로모션 배너 2분할 — admin-pando 1:1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <button
          className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-[#ff907f] p-6 text-left text-white transition-transform hover:scale-[1.005]"
          onClick={() => notify("구독형 키오스크 패키지 보기", "info")}
        >
          <div className="relative z-10">
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm">
              Premium
            </span>
            <h4 className="mt-3 text-[17px] font-bold leading-snug">
              구독형 키오스크 패키지
              <br />
              출시 기념 30% 할인!
            </h4>
            <p className="mt-2 text-[12px] text-white/70">
              무인 센터 운영을 시작해보세요.
            </p>
            <div className="mt-3 flex items-center gap-1 text-[13px] font-semibold">
              <span>혜택 보기</span>
              <ChevronRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </div>
          </div>
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
        </button>
        <button
          className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-content to-content-secondary p-6 text-left text-white transition-transform hover:scale-[1.005]"
          onClick={() => notify("자동 알림 설정 mock", "info")}
        >
          <div className="relative z-10">
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm">
              Automation
            </span>
            <h4 className="mt-3 text-[17px] font-bold leading-snug">
              알림톡 자동 발송으로
              <br />
              재등록률을 높이세요
            </h4>
            <p className="mt-2 text-[12px] text-white/70">
              만료 전 안내, 생일 축하 메시지를 자동 발송합니다.
            </p>
            <div className="mt-3 flex items-center gap-1 text-[13px] font-semibold">
              <span>설정 바로가기</span>
              <ChevronRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
        </button>
      </div>

      {/* 핸드오프 카드 (검수용) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <HandoffContractCard screen={screen} />
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>대시보드 액션</CardTitle>
            <CardDescription>{roleInfo.label} 권한별 처리 큐</CardDescription>
          </CardHeader>
          <CardContent>
            <PrimaryActionRow
              screen={screen}
              role={role}
              openDialog={openDialog}
              notify={notify}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiDashboardScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  // admin-pando KPI 시각 + 운영자 UX (탭/필터/모달 모두 동작)
  // docs4 V1+V2 D10 본사관리/D11 통합운영 KPI 24종 컨텐츠
  type KpiCategory = "전체" | "매출" | "회원" | "출석" | "수업" | "OT";
  const [activeCategory, setActiveCategory] = useState<KpiCategory>("전체");
  const [comparePeriod, setComparePeriod] = useState<
    "이번달" | "지난달" | "전년동월"
  >("이번달");
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);

  const kpiAll = [
    {
      label: "매출 달성률",
      value: 82,
      target: 100,
      color: "bg-blue-500",
      category: "매출" as KpiCategory,
      hint: "MTD 18.4M / 22M",
    },
    {
      label: "신규 매출 비중",
      value: 41,
      target: 50,
      color: "bg-blue-400",
      category: "매출" as KpiCategory,
      hint: "신규 7.5M / 18.4M",
    },
    {
      label: "재등록 비중",
      value: 52,
      target: 60,
      color: "bg-blue-600",
      category: "매출" as KpiCategory,
      hint: "재등록 9.5M",
    },
    {
      label: "환불률",
      value: 3,
      target: 5,
      color: "bg-rose-500",
      category: "매출" as KpiCategory,
      hint: "환불 620k / 매출 18.4M",
    },
    {
      label: "신규 회원 달성률",
      value: 68,
      target: 100,
      color: "bg-emerald-500",
      category: "회원" as KpiCategory,
      hint: "신규 132 / 목표 195",
    },
    {
      label: "활성 회원 비율",
      value: 80,
      target: 80,
      color: "bg-emerald-400",
      category: "회원" as KpiCategory,
      hint: "2,614 / 3,248명",
    },
    {
      label: "이탈 위험 회원",
      value: 86,
      target: 50,
      color: "bg-rose-400",
      category: "회원" as KpiCategory,
      hint: "30일 무방문 활성",
    },
    {
      label: "유지율 달성률",
      value: 76,
      target: 85,
      color: "bg-amber-500",
      category: "회원" as KpiCategory,
      hint: "전월 80%, 전년 71%",
    },
    {
      label: "출석률 달성률",
      value: 91,
      target: 90,
      color: "bg-violet-500",
      category: "출석" as KpiCategory,
      hint: "주 8.4회 평균",
    },
    {
      label: "키오스크 비중",
      value: 74,
      target: 70,
      color: "bg-violet-400",
      category: "출석" as KpiCategory,
      hint: "QR + 얼굴인식",
    },
    {
      label: "수동 출석 비율",
      value: 8,
      target: 5,
      color: "bg-amber-400",
      category: "출석" as KpiCategory,
      hint: "기준 초과 시 점검",
    },
    {
      label: "GX 가입률",
      value: 54,
      target: 70,
      color: "bg-cyan-500",
      category: "수업" as KpiCategory,
      hint: "요가/필라/스피닝/줌바",
    },
    {
      label: "GX 노쇼율",
      value: 12,
      target: 10,
      color: "bg-cyan-400",
      category: "수업" as KpiCategory,
      hint: "예약 후 미방문",
    },
    {
      label: "PT 진행률",
      value: 78,
      target: 85,
      color: "bg-indigo-500",
      category: "수업" as KpiCategory,
      hint: "잔여 PT 평균 12회",
    },
    {
      label: "OT 1차 완료",
      value: 84,
      target: 95,
      color: "bg-pink-500",
      category: "OT" as KpiCategory,
      hint: "신규 132명 중 111건",
    },
    {
      label: "OT 2차 완료",
      value: 62,
      target: 80,
      color: "bg-pink-400",
      category: "OT" as KpiCategory,
      hint: "OT 1차 후 14일 내",
    },
    {
      label: "재등록률",
      value: 62,
      target: 80,
      color: "bg-blue-500",
      category: "회원" as KpiCategory,
      hint: "만료 184명 중 114명",
    },
  ];

  const filtered =
    activeCategory === "전체"
      ? kpiAll
      : kpiAll.filter((k) => k.category === activeCategory);
  const tabCounts: Record<KpiCategory, number> = {
    전체: kpiAll.length,
    매출: kpiAll.filter((k) => k.category === "매출").length,
    회원: kpiAll.filter((k) => k.category === "회원").length,
    출석: kpiAll.filter((k) => k.category === "출석").length,
    수업: kpiAll.filter((k) => k.category === "수업").length,
    OT: kpiAll.filter((k) => k.category === "OT").length,
  };
  const tabsList: KpiCategory[] = [
    "전체",
    "매출",
    "회원",
    "출석",
    "수업",
    "OT",
  ];

  const branchBars = [
    { 지점: "강남점", 매출: 92, 회원: 78, 출석: 88, 수업: 81 },
    { 지점: "서초점", 매출: 76, 회원: 82, 출석: 91, 수업: 74 },
    { 지점: "잠실점", 매출: 64, 회원: 58, 출석: 72, 수업: 62 },
  ];

  const compareLabel =
    comparePeriod === "이번달"
      ? "MTD"
      : comparePeriod === "지난달"
        ? "전월 대비"
        : "전년 동월 대비";
  const isHqAdmin = role === "HQ_ADMIN";

  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix={`24종 KPI · 목표 대비 실적 (${compareLabel})`}
      />
      <MetricGrid metrics={screen.metrics} />

      {/* 비교 기간 토글 (운영자가 자주 사용) */}
      <Card className="shadow-none">
        <CardContent className="p-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Label className="text-xs">비교 기간</Label>
            {(["이번달", "지난달", "전년동월"] as const).map((p) => (
              <Button
                key={p}
                size="sm"
                variant={comparePeriod === p ? "default" : "outline"}
                onClick={() => {
                  setComparePeriod(p);
                  notify(`${p} 기준으로 KPI 갱신`, "info");
                }}
              >
                {p}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => notify("CSV 내보내기 mock", "info")}
            >
              CSV 내보내기
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => notify("PDF 리포트 생성 mock", "info")}
            >
              PDF 리포트
            </Button>
            {isHqAdmin && (
              <Button size="sm" onClick={() => openDialog("DLG-H001")}>
                목표 설정
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>
                KPI 카드 ({filtered.length}/{kpiAll.length})
              </CardTitle>
              <CardDescription>
                달성률 비교 막대 · 목표 대비 실적 · 클릭 시 상세
              </CardDescription>
              {/* 카테고리 탭 */}
              <div className="mt-2 flex gap-1 border-b border-line overflow-x-auto">
                {tabsList.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setActiveCategory(t);
                      notify(`${t} KPI 카테고리`, "info");
                    }}
                    className={cn(
                      "px-3 py-2 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap",
                      activeCategory === t
                        ? "border-primary text-primary"
                        : "border-transparent text-content-secondary hover:text-content",
                    )}
                  >
                    {t}
                    <span className="ml-1.5 text-[10px] text-content-tertiary">
                      ({tabCounts[t]})
                    </span>
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filtered.map((kpi) => {
                  const achieved = kpi.value >= kpi.target * 0.9;
                  const warning = kpi.value < kpi.target * 0.7;
                  return (
                    <button
                      key={kpi.label}
                      onClick={() => {
                        setSelectedKpi(kpi.label);
                        notify(`${kpi.label} 상세 보기`, "info");
                      }}
                      className="rounded-xl border bg-white p-3 text-left transition-all hover:border-primary hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="text-[11px] text-content-tertiary line-clamp-1">
                          {kpi.label}
                        </div>
                        {achieved && (
                          <Badge variant="success" className="text-[9px] px-1">
                            달성
                          </Badge>
                        )}
                        {warning && (
                          <Badge variant="warning" className="text-[9px] px-1">
                            주의
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 text-2xl font-bold tabular-nums">
                        {kpi.value}%
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded bg-surface-tertiary">
                        <div
                          className={cn("h-full", kpi.color)}
                          style={{ width: `${Math.min(kpi.value, 100)}%` }}
                        />
                      </div>
                      <div className="mt-1 flex justify-between text-[10px] text-content-tertiary">
                        <span>목표 {kpi.target}%</span>
                        <span>{kpi.hint}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              {filtered.length === 0 && (
                <div className="py-12 text-center text-sm text-content-tertiary">
                  선택한 카테고리에 KPI가 없습니다.
                </div>
              )}
            </CardContent>
          </Card>

          {/* 지점별 비교 (HQ_ADMIN 본사 전용 강조) */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>지점별 비교 차트</CardTitle>
              <CardDescription>
                {isHqAdmin ? "전 지점 합산 비교 (본사 권한)" : "현재 지점 기준"}{" "}
                · 매출 · 회원 · 출석 · 수업 달성률
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {branchBars.map((b) => (
                  <div key={b.지점} className="rounded-lg border bg-white p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-semibold text-sm">{b.지점}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          notify(`${b.지점} 상세 보기 mock`, "info")
                        }
                      >
                        상세 →
                      </Button>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      {[
                        { key: "매출", value: b.매출, color: "bg-blue-500" },
                        { key: "회원", value: b.회원, color: "bg-emerald-500" },
                        { key: "출석", value: b.출석, color: "bg-violet-500" },
                        { key: "수업", value: b.수업, color: "bg-cyan-500" },
                      ].map((m) => (
                        <div key={m.key} className="flex items-center gap-2">
                          <span className="w-12 text-content-tertiary">
                            {m.key}
                          </span>
                          <div className="h-3 flex-1 overflow-hidden rounded bg-surface-tertiary">
                            <div
                              className={cn("h-full", m.color)}
                              style={{ width: `${m.value}%` }}
                            />
                          </div>
                          <span className="w-10 text-right font-semibold tabular-nums">
                            {m.value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>KPI 액션</CardTitle>
              <CardDescription>운영 빈도 높음</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                disabled={!isHqAdmin}
                onClick={() =>
                  isHqAdmin
                    ? openDialog("DLG-H001")
                    : notify("HQ_ADMIN 이상만 가능합니다.", "warning")
                }
              >
                목표 설정
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => notify("자동 리포트 발송 예약 mock", "info")}
              >
                자동 리포트 발송 예약
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => notify("벤치마크 비교 화면 이동 mock", "info")}
              >
                벤치마크 비교
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>탭 (5종)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-xs">
              {screen.tabs.map((t) => (
                <div
                  key={t}
                  className="flex items-center justify-between rounded-lg border bg-white px-2 py-1.5"
                >
                  <b>{t}</b>
                  <Badge variant="secondary">
                    {["8", "6", "4", "4", "2"][screen.tabs.indexOf(t)] ?? "—"}개
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          {!isHqAdmin && (
            <Card className="shadow-none border-amber-200 bg-amber-50">
              <CardContent className="p-3 text-xs">
                <AlertTriangle
                  size={14}
                  className="inline text-amber-600 mr-1.5"
                />
                <b>권한 안내:</b> 본사 KPI 24종은 HQ_ADMIN 이상만 목표 설정·수정
                가능합니다.
              </CardContent>
            </Card>
          )}
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>

      {/* KPI 상세 모달 */}
      {selectedKpi && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedKpi(null)}
        >
          <div
            className="bg-white rounded-xl shadow-lg border w-full max-w-[480px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-base font-bold">{selectedKpi} 상세</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedKpi(null)}
              >
                <X size={16} />
              </Button>
            </div>
            <div className="p-6 space-y-3">
              {(() => {
                const kpi = kpiAll.find((k) => k.label === selectedKpi);
                if (!kpi) return null;
                return (
                  <>
                    <div className="rounded-lg border p-3">
                      <div className="text-xs text-content-tertiary">
                        현재 달성률
                      </div>
                      <div className="mt-1 text-3xl font-bold tabular-nums">
                        {kpi.value}%
                      </div>
                      <div className="mt-2 h-3 overflow-hidden rounded bg-surface-tertiary">
                        <div
                          className={cn("h-full", kpi.color)}
                          style={{ width: `${Math.min(kpi.value, 100)}%` }}
                        />
                      </div>
                      <div className="mt-1 text-xs text-content-tertiary">
                        목표 {kpi.target}% · {kpi.hint}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="rounded-lg border p-2 text-center">
                        <div className="text-content-tertiary">전일</div>
                        <div className="font-bold mt-1">
                          {Math.max(kpi.value - 4, 0)}%
                        </div>
                      </div>
                      <div className="rounded-lg border p-2 text-center">
                        <div className="text-content-tertiary">전주</div>
                        <div className="font-bold mt-1">
                          {Math.max(kpi.value - 8, 0)}%
                        </div>
                      </div>
                      <div className="rounded-lg border p-2 text-center">
                        <div className="text-content-tertiary">전월</div>
                        <div className="font-bold mt-1">
                          {Math.max(kpi.value - 12, 0)}%
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-surface-secondary p-3 text-xs text-content-secondary">
                      <b>운영 가이드:</b>{" "}
                      {kpi.value < kpi.target * 0.7
                        ? "목표 미달성 — 운영팀 점검 권장"
                        : kpi.value >= kpi.target
                          ? "목표 달성 — 우수 운영 사례"
                          : "정상 범위 — 추세 모니터링 권장"}
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedKpi(null)}>
                닫기
              </Button>
              <Button
                onClick={() => {
                  notify(`${selectedKpi} 상세 리포트 보기 mock`, "info");
                  setSelectedKpi(null);
                }}
              >
                상세 리포트
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NpsSurveyScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  // V2 신규: NPS 점수 분포 시각화
  const distribution = { 추천자: 58, 중립: 28, 비추천: 14 };
  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="V2 신규 · NPS 분석"
      />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>응답 분포</CardTitle>
              <CardDescription>
                추천자(9-10) · 중립(7-8) · 비추천(0-6)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-8 overflow-hidden rounded-lg border">
                <div
                  className="grid place-items-center text-xs font-bold text-white bg-emerald-500"
                  style={{ width: `${distribution.추천자}%` }}
                >
                  {distribution.추천자}%
                </div>
                <div
                  className="grid place-items-center text-xs font-bold text-white bg-amber-500"
                  style={{ width: `${distribution.중립}%` }}
                >
                  {distribution.중립}%
                </div>
                <div
                  className="grid place-items-center text-xs font-bold text-white bg-rose-500"
                  style={{ width: `${distribution.비추천}%` }}
                >
                  {distribution.비추천}%
                </div>
              </div>
              <div className="mt-2 flex justify-between text-xs text-content-tertiary">
                <span>추천자 (Promoters)</span>
                <span>중립 (Passives)</span>
                <span>비추천 (Detractors)</span>
              </div>
              <div className="mt-4 rounded-xl border bg-surface-secondary p-3 text-sm">
                <div className="text-content-tertiary text-xs">NPS Score</div>
                <div className="mt-1 text-3xl font-bold text-blue-700">
                  +{distribution.추천자 - distribution.비추천}
                </div>
                <div className="text-xs text-content-tertiary">
                  추천자 % − 비추천 %
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>응답 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <FilterChips filters={screen.filters} notify={notify} />
              <Table className="mt-3">
                <TableHeader>
                  <TableRow>
                    <TableHead>응답일</TableHead>
                    <TableHead>점수</TableHead>
                    <TableHead>분류</TableHead>
                    <TableHead>회원</TableHead>
                    <TableHead>자유 의견</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      응답일: "오늘",
                      점수: "10",
                      분류: "추천자",
                      회원: "김민준",
                      의견: "트레이너 친절·시설 청결",
                    },
                    {
                      응답일: "어제",
                      점수: "7",
                      분류: "중립",
                      회원: "박서연",
                      의견: "GX 시간 다양해지면 좋겠음",
                    },
                    {
                      응답일: "2일 전",
                      점수: "4",
                      분류: "비추천",
                      회원: "오지우",
                      의견: "락커 부족 + 대기 시간 길음",
                    },
                  ].map((r, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{r.응답일}</TableCell>
                      <TableCell>
                        <b>{r.점수}</b>
                      </TableCell>
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
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>NPS 액션</CardTitle>
            </CardHeader>
            <CardContent>
              <PrimaryActionRow
                screen={screen}
                role={role}
                openDialog={openDialog}
                notify={notify}
              />
            </CardContent>
          </Card>
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

// ---- D11 통합운영 ----

function UnifiedAttendanceScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  // admin-pando /attendance/page.tsx 패턴 + 운영자 UX
  // 채널별 실시간 + 출석 이력 + 수동 출석 + 검수 보드 + 권한 차등
  type Channel = "all" | "app" | "kiosk" | "face" | "manual";
  type AttendanceRow = {
    id: number;
    time: string;
    memberName: string;
    memberId: string;
    channel: Channel;
    status: "정상" | "수동" | "예외";
    product: string;
    locker: string;
  };

  const [activeChannel, setActiveChannel] = useState<Channel>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<"오늘" | "어제" | "이번 주">(
    "오늘",
  );
  const [showManualDialog, setShowManualDialog] = useState(false);
  const [manualForm, setManualForm] = useState({ memberName: "", reason: "" });

  const initialAttendance: AttendanceRow[] = [
    {
      id: 1,
      time: "09:08",
      memberName: "김민준",
      memberId: "M0142",
      channel: "app",
      status: "정상",
      product: "PT 20회",
      locker: "L-015",
    },
    {
      id: 2,
      time: "09:12",
      memberName: "박서연",
      memberId: "M0287",
      channel: "kiosk",
      status: "정상",
      product: "회원권 3개월",
      locker: "L-022",
    },
    {
      id: 3,
      time: "09:24",
      memberName: "정하준",
      memberId: "M0341",
      channel: "face",
      status: "정상",
      product: "GX 요가",
      locker: "L-018",
    },
    {
      id: 4,
      time: "10:02",
      memberName: "오지우",
      memberId: "M0498",
      channel: "kiosk",
      status: "정상",
      product: "PT 잔여",
      locker: "-",
    },
    {
      id: 5,
      time: "10:18",
      memberName: "한서윤",
      memberId: "M0512",
      channel: "app",
      status: "정상",
      product: "회원권 12개월",
      locker: "L-031",
    },
    {
      id: 6,
      time: "10:34",
      memberName: "최가온",
      memberId: "M0623",
      channel: "manual",
      status: "수동",
      product: "PT 10회",
      locker: "-",
    },
    {
      id: 7,
      time: "10:52",
      memberName: "임도윤",
      memberId: "M0701",
      channel: "kiosk",
      status: "예외",
      product: "만료 임박 D-2",
      locker: "-",
    },
    {
      id: 8,
      time: "11:08",
      memberName: "신유진",
      memberId: "M0788",
      channel: "face",
      status: "정상",
      product: "GX 필라테스",
      locker: "L-009",
    },
  ];

  const [attendance, setAttendance] =
    useState<AttendanceRow[]>(initialAttendance);

  const filtered = attendance.filter((a) => {
    const matchChannel = activeChannel === "all" || a.channel === activeChannel;
    const matchSearch =
      !searchQuery ||
      a.memberName.includes(searchQuery) ||
      a.memberId.includes(searchQuery);
    return matchChannel && matchSearch;
  });

  const channelMeta: Record<
    Channel,
    { label: string; icon: typeof Bell; tone: string }
  > = {
    all: {
      label: "전체",
      icon: ClipboardCheck,
      tone: "bg-slate-50 border-slate-200 text-slate-700",
    },
    app: {
      label: "앱 QR",
      icon: MessageSquare,
      tone: "bg-blue-50 border-blue-200 text-blue-700",
    },
    kiosk: {
      label: "키오스크 QR",
      icon: Building2,
      tone: "bg-emerald-50 border-emerald-200 text-emerald-700",
    },
    face: {
      label: "얼굴 인식",
      icon: UserRound,
      tone: "bg-violet-50 border-violet-200 text-violet-700",
    },
    manual: {
      label: "수동",
      icon: Pin,
      tone: "bg-amber-50 border-amber-200 text-amber-700",
    },
  };

  const channelCounts: Record<Channel, number> = {
    all: attendance.length,
    app: attendance.filter((a) => a.channel === "app").length,
    kiosk: attendance.filter((a) => a.channel === "kiosk").length,
    face: attendance.filter((a) => a.channel === "face").length,
    manual: attendance.filter((a) => a.channel === "manual").length,
  };

  const statusVariant: Record<
    AttendanceRow["status"],
    "success" | "warning" | "destructive"
  > = {
    정상: "success",
    수동: "warning",
    예외: "destructive",
  };

  const canManualAttendance = hasPermission(role, "memberWrite");

  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="키오스크 QR · 얼굴 인식 · 앱 QR · 수동 통합"
      />
      <MetricGrid metrics={screen.metrics} />

      {/* 채널별 실시간 카드 (운영자 한눈에 파악) */}
      <Card className="shadow-none">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">
              채널 별 실시간 ({dateFilter})
            </CardTitle>
            <div className="flex gap-1">
              {(["오늘", "어제", "이번 주"] as const).map((d) => (
                <Button
                  key={d}
                  size="sm"
                  variant={dateFilter === d ? "default" : "outline"}
                  onClick={() => {
                    setDateFilter(d);
                    notify(`${d} 출석 기록`, "info");
                  }}
                >
                  {d}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {(Object.keys(channelMeta) as Channel[]).map((c) => {
              const meta = channelMeta[c];
              const Icon = meta.icon;
              return (
                <button
                  key={c}
                  onClick={() => {
                    setActiveChannel(c);
                    notify(`${meta.label} 채널 필터`, "info");
                  }}
                  className={cn(
                    "rounded-xl border p-3 text-center transition-all",
                    meta.tone,
                    activeChannel === c && "ring-2 ring-primary scale-[1.02]",
                  )}
                >
                  <Icon size={16} className="mx-auto mb-1" />
                  <div className="text-2xl font-bold tabular-nums">
                    {channelCounts[c]}
                  </div>
                  <div className="text-[10px] mt-0.5">{meta.label}</div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>출석 이력</CardTitle>
                <Button
                  size="sm"
                  disabled={!canManualAttendance}
                  onClick={() =>
                    canManualAttendance
                      ? setShowManualDialog(true)
                      : notify("memberWrite 권한 필요 — 매니저 이상", "warning")
                  }
                >
                  <Pin size={14} className="mr-1.5" /> 수동 출석
                </Button>
              </div>
              <CardDescription>
                {filtered.length}건 ·{" "}
                {activeChannel === "all"
                  ? "전 채널"
                  : channelMeta[activeChannel].label}{" "}
                · {dateFilter}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* 검색 */}
              <div className="grid grid-cols-[2fr_auto] gap-2 items-end">
                <div>
                  <Label className="text-[10px] text-content-tertiary mb-1 block">
                    통합 검색
                  </Label>
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary"
                    />
                    <Input
                      placeholder="회원명·운동 ID 검색"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveChannel("all");
                  }}
                >
                  초기화
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">시간</TableHead>
                    <TableHead>회원</TableHead>
                    <TableHead className="w-24">운동 ID</TableHead>
                    <TableHead className="w-32">채널</TableHead>
                    <TableHead className="w-24 text-center">상태</TableHead>
                    <TableHead>이용권</TableHead>
                    <TableHead className="w-20">락커</TableHead>
                    <TableHead className="w-20 text-center">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((a) => {
                    const meta = channelMeta[a.channel];
                    return (
                      <TableRow key={a.id}>
                        <TableCell className="font-mono text-xs tabular-nums">
                          {a.time}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {a.memberName}
                        </TableCell>
                        <TableCell className="text-xs tabular-nums text-content-tertiary">
                          {a.memberId}
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border",
                              meta.tone,
                            )}
                          >
                            {meta.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={statusVariant[a.status]}
                            className="text-[10px]"
                          >
                            {a.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{a.product}</TableCell>
                        <TableCell className="text-xs">{a.locker}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            asChild
                          >
                            <Link href="/members/detail?from=SCR-C011">상세</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {filtered.length === 0 && (
                <div className="py-12 text-center text-sm text-content-tertiary">
                  {searchQuery || activeChannel !== "all"
                    ? "조건에 맞는 출석 기록이 없습니다."
                    : "출석 이벤트가 없습니다."}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 검수 보드 (예외 채널/수동 출석) */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>검수 보드</CardTitle>
              <CardDescription>
                수동 출석 + 예외 (만료 임박/홀딩) 점검 큐
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {attendance
                  .filter((a) => a.status !== "정상")
                  .map((a) => (
                    <div
                      key={a.id}
                      className="rounded-lg border p-2.5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={statusVariant[a.status]}
                          className="text-[10px]"
                        >
                          {a.status}
                        </Badge>
                        <div>
                          <div className="text-sm font-semibold">
                            {a.memberName}{" "}
                            <span className="text-xs text-content-tertiary">
                              ({a.memberId})
                            </span>
                          </div>
                          <div className="text-[10px] text-content-tertiary">
                            {a.time} · {a.product}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            notify(`${a.memberName} 정상 처리`, "info")
                          }
                        >
                          정상 처리
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                        >
                          <Link href="/members/detail?from=SCR-C011">상세</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                {attendance.filter((a) => a.status !== "정상").length === 0 && (
                  <div className="py-8 text-center text-xs text-content-tertiary">
                    검수 필요 항목 없음 (정상 운영)
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>출석 액션</CardTitle>
              <CardDescription>운영 빈도 높음</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                disabled={!canManualAttendance}
                onClick={() =>
                  canManualAttendance
                    ? setShowManualDialog(true)
                    : notify("memberWrite 권한 필요", "warning")
                }
              >
                <Pin size={14} className="mr-1.5" /> 수동 출석 등록
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => notify("출석 CSV 내보내기 mock", "info")}
              >
                CSV 내보내기
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => openDialog("DLG-I001")}
              >
                락커 매칭
              </Button>
            </CardContent>
          </Card>
          {!canManualAttendance && (
            <Card className="shadow-none border-amber-200 bg-amber-50">
              <CardContent className="p-3 text-xs">
                <AlertTriangle
                  size={14}
                  className="inline text-amber-600 mr-1.5"
                />
                <b>권한 안내:</b> 수동 출석은 매니저 이상 권한 필요 (
                {roleById.get(role)?.label} → 매니저+)
              </CardContent>
            </Card>
          )}
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
          <FrontStateNote screen={screen} />
        </aside>
      </div>

      {/* 수동 출석 등록 모달 */}
      {showManualDialog && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowManualDialog(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg border w-full max-w-[480px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Pin size={16} className="text-primary" /> 수동 출석 등록
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowManualDialog(false)}
              >
                <X size={16} />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs">
                <AlertTriangle
                  size={14}
                  className="inline text-amber-600 mr-1.5"
                />
                키오스크/앱/얼굴 인식 실패 등 <b>예외 상황만</b> 사용합니다.
                감사 로그에 기록됩니다.
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">
                  회원 검색 *
                </Label>
                <Input
                  placeholder="회원명 또는 연락처"
                  value={manualForm.memberName}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, memberName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">
                  사유 * (감사 로그 필수)
                </Label>
                <Textarea
                  rows={3}
                  placeholder="예: 키오스크 QR 인식 불가, 앱 미설치"
                  value={manualForm.reason}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, reason: e.target.value })
                  }
                />
                {manualForm.reason && manualForm.reason.length < 5 && (
                  <p className="text-[10px] text-rose-600 mt-1">
                    사유는 5자 이상 입력해주세요.
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border p-2">
                  <span className="text-content-tertiary">출석 시각</span>
                  <div className="font-bold">
                    {new Date().toTimeString().slice(0, 5)}
                  </div>
                </div>
                <div className="rounded-lg border p-2">
                  <span className="text-content-tertiary">담당자</span>
                  <div className="font-bold">{roleById.get(role)?.label}</div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowManualDialog(false)}
              >
                취소
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  if (!manualForm.memberName.trim()) {
                    notify("회원을 검색해주세요.", "warning");
                    return;
                  }
                  if (manualForm.reason.length < 5) {
                    notify("사유는 5자 이상 입력해주세요.", "warning");
                    return;
                  }
                  const newRow: AttendanceRow = {
                    id: Math.max(...attendance.map((a) => a.id)) + 1,
                    time: new Date().toTimeString().slice(0, 5),
                    memberName: manualForm.memberName,
                    memberId: `M${String(Math.floor(Math.random() * 900) + 100).padStart(4, "0")}`,
                    channel: "manual",
                    status: "수동",
                    product: "-",
                    locker: "-",
                  };
                  setAttendance([newRow, ...attendance]);
                  setShowManualDialog(false);
                  setManualForm({ memberName: "", reason: "" });
                  notify(
                    `${newRow.memberName} 수동 출석 완료 (감사 로그 기록)`,
                  );
                }}
              >
                등록
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ClothingLockerScreen({
  screen,
  role,
  branch,
  openDialog,
  notify,
}: SpecializedScreenProps) {
  // 옷 락커 그리드 mock
  const lockers = Array.from({ length: 30 }).map((_, i) => {
    const num = String(i + 1).padStart(3, "0");
    const states = [
      "빈",
      "사용 중",
      "사용 중",
      "사용 중",
      "만료 임박",
      "빈",
      "점검 중",
    ];
    return { 락커: num, 상태: states[i % states.length] };
  });
  return (
    <div className="space-y-5">
      <DeliveryHeader
        screen={screen}
        role={role}
        branch={branch}
        titleSuffix="출석 연동 옷 락커 실시간"
      />
      <MetricGrid metrics={screen.metrics} />
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>락커 그리드</CardTitle>
              <CardDescription>
                당일용 옷 락커 · 50건 초과 chunked 일괄 처리 (V2)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <FilterChips filters={screen.filters} notify={notify} />
              <div className="grid grid-cols-6 md:grid-cols-10 gap-1.5">
                {lockers.map((box) => {
                  const tone =
                    box.상태 === "사용 중"
                      ? "border-blue-300 bg-blue-50 text-blue-700"
                      : box.상태 === "빈"
                        ? "border-slate-200 bg-white text-content-tertiary"
                        : box.상태 === "만료 임박"
                          ? "border-amber-300 bg-amber-50 text-amber-700"
                          : "border-rose-200 bg-rose-50 text-rose-700";
                  return (
                    <button
                      key={box.락커}
                      type="button"
                      onClick={() => openDialog("DLG-I002")}
                      className={cn(
                        "aspect-square rounded border p-1 text-center text-[10px] font-semibold transition hover:-translate-y-0.5",
                        tone,
                      )}
                    >
                      <div>{box.락커}</div>
                      <div className="text-[9px] opacity-75">{box.상태[0]}</div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>미배정 회원 패널</CardTitle>
              <CardDescription>출석 완료 · 락커 미배정</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {[
                { 회원: "김민준", 출석: "10:24", 상품: "PT 20회" },
                { 회원: "박서연", 출석: "11:02", 상품: "회원권 3개월" },
                { 회원: "정하준", 출석: "11:05", 상품: "GX 요가" },
              ].map((m, idx) => (
                <div key={idx} className="rounded-lg border bg-white p-2">
                  <div className="flex items-center justify-between">
                    <b>{m.회원}</b>
                    <Badge variant="warning">미배정</Badge>
                  </div>
                  <div className="mt-1 text-xs text-content-tertiary">
                    {m.출석} · {m.상품}
                  </div>
                  <Button
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => openDialog("DLG-I002")}
                  >
                    배정
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>락커 액션</CardTitle>
            </CardHeader>
            <CardContent>
              <PrimaryActionRow
                screen={screen}
                role={role}
                openDialog={openDialog}
                notify={notify}
              />
            </CardContent>
          </Card>
          <DialogDock screen={screen} openDialog={openDialog} />
          <HandoffContractCard screen={screen} />
        </aside>
      </div>
    </div>
  );
}

export const implementedDialogIds = dialogs.map((dialog) => dialog.id);
export const implementedScreenIds = screens.map((screen) => screen.id);
