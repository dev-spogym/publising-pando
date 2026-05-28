// admin-pando `src/lib/docs4Publishing.ts` 이식 + v1-publishing SCR-* ID 확장
// V1/V2 출처 표시 및 검수 모드 publishing 인프라의 마스터 레지스트리입니다.

export type PublishingVersion = "V1" | "V2";
export type PublishingKind = "screen" | "dialog" | "component";
export type PublishingStatus = "base" | "reference" | "policy-pending" | "external-pending";

export interface PublishingSource {
  version: PublishingVersion;
  kind: PublishingKind;
  id: string;
  label: string;
  source: string;
  status?: PublishingStatus;
  referenceVersion?: PublishingVersion;
  referenceSource?: string;
}

export interface DialogFieldSpec {
  label: string;
  value?: string;
  type?: "text" | "select" | "textarea" | "money" | "date" | "check";
  required?: boolean;
  hint?: string;
}

export interface DialogSectionSpec {
  title: string;
  description?: string;
  fields?: DialogFieldSpec[];
  items?: string[];
  tone?: "default" | "warning" | "danger" | "success" | "info";
}

export interface DialogActionSpec {
  label: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  note?: string;
}

export interface DialogBlueprint {
  source: PublishingSource;
  entryRoute?: string;
  purpose: string;
  sections: DialogSectionSpec[];
  actions: DialogActionSpec[];
  rolePolicy?: string;
  backendPolicy?: string;
}

const docs4 = (version: PublishingVersion, domain: string, line?: number) =>
  `docs4/${version}/${domain}/${domain.split("-").slice(1).join("-") || domain}.md${line ? `:${line}` : ""}`;

const v1Common = (line?: number) => docs4("V1", "D01-공통", line);
const v1Member = (line?: number) => docs4("V1", "D02-회원관리", line);
const v1Sales = (line?: number) => docs4("V1", "D03-매출관리", line);
const v1Class = (line?: number) => docs4("V1", "D04-수업관리", line);
const v1Product = (line?: number) => docs4("V1", "D05-상품관리", line);
const v1Facility = (line?: number) => docs4("V1", "D06-시설관리", line);
const v1Staff = (line?: number) => docs4("V1", "D07-직원관리", line);
const v1Marketing = (line?: number) => docs4("V1", "D08-마케팅", line);
const v1Settings = (line?: number) => docs4("V1", "D09-설정관리", line);
const v1HQ = (line?: number) => docs4("V1", "D10-본사관리", line);
const v1Integrated = (line?: number) => docs4("V1", "D11-통합운영", line);

const v2Common = (line?: number) => docs4("V2", "D01-공통", line);
const v2Member = (line?: number) => docs4("V2", "D02-회원관리", line);
const v2Sales = (line?: number) => docs4("V2", "D03-매출관리", line);
const v2Class = (line?: number) => docs4("V2", "D04-수업관리", line);
const v2Product = (line?: number) => docs4("V2", "D05-상품관리", line);
const v2Facility = (line?: number) => docs4("V2", "D06-시설관리", line);
const v2Staff = (line?: number) => docs4("V2", "D07-직원관리", line);
const v2Marketing = (line?: number) => docs4("V2", "D08-마케팅", line);
const v2Settings = (line?: number) => docs4("V2", "D09-설정관리", line);
const v2HQ = (line?: number) => docs4("V2", "D10-본사관리", line);
const v2Integrated = (line?: number) => docs4("V2", "D11-통합운영", line);

export const publishingScreens: Record<string, PublishingSource> = {
  // === D01 공통 ===
  login: { version: "V1", kind: "screen", id: "SCR-100", label: "로그인", source: v1Common(21), referenceVersion: "V2", referenceSource: v2Common() },
  notifications: { version: "V1", kind: "screen", id: "SCR-104", label: "알림 센터", source: v1Common(100), referenceVersion: "V2", referenceSource: v2Common() },
  dialogGallery: { version: "V1", kind: "screen", id: "SCR-DLG", label: "DLG 컴포넌트 갤러리", source: "docs4/V1/D01~D03", referenceVersion: "V2", referenceSource: "docs4/V2/D01~D03" },

  // === D02 회원관리 ===
  members: { version: "V1", kind: "screen", id: "SCR-M001", label: "회원 목록", source: v1Member(21), referenceVersion: "V2", referenceSource: v2Member() },
  memberCreate: { version: "V1", kind: "screen", id: "SCR-M002", label: "회원 등록", source: v1Member(134), referenceVersion: "V2", referenceSource: v2Member() },
  memberEdit: { version: "V1", kind: "screen", id: "SCR-M003", label: "회원 수정", source: v1Member(265), referenceVersion: "V2", referenceSource: v2Member() },
  memberDetail: { version: "V1", kind: "screen", id: "SCR-M004", label: "회원 상세", source: v1Member(373), referenceVersion: "V2", referenceSource: v2Member() },
  memberTransfer: { version: "V1", kind: "screen", id: "SCR-M005", label: "회원 이관", source: v1Member(434), referenceVersion: "V2", referenceSource: v2Member() },
  bodyComposition: { version: "V1", kind: "screen", id: "SCR-M006", label: "체성분 관리", source: v1Member(545), referenceVersion: "V2", referenceSource: v2Member(545) },
  memberMerge: { version: "V1", kind: "screen", id: "SCR-M007", label: "회원 병합", source: v1Member(658), referenceVersion: "V2", referenceSource: v2Member() },
  family: { version: "V1", kind: "screen", id: "SCR-M008", label: "가족 회원", source: v1Member(741), referenceVersion: "V2", referenceSource: v2Member() },
  grades: { version: "V1", kind: "screen", id: "SCR-M009", label: "등급 관리", source: v1Member(826), referenceVersion: "V2", referenceSource: v2Member() },
  segments: { version: "V1", kind: "screen", id: "SCR-M010", label: "세그먼트 관리", source: v1Member(955), referenceVersion: "V2", referenceSource: v2Member() },

  // === D03 매출관리 ===
  sales: { version: "V1", kind: "screen", id: "SCR-S001", label: "매출 현황", source: v1Sales(21), referenceVersion: "V2", referenceSource: v2Sales() },
  pos: { version: "V1", kind: "screen", id: "SCR-S002", label: "POS 판매", source: v1Sales(127), referenceVersion: "V2", referenceSource: v2Sales() },
  payment: { version: "V1", kind: "screen", id: "SCR-S003", label: "결제 처리", source: v1Sales(161), referenceVersion: "V2", referenceSource: v2Sales() },
  salesStats: { version: "V1", kind: "screen", id: "SCR-S004", label: "매출 통계", source: v1Sales(216), referenceVersion: "V2", referenceSource: v2Sales() },
  statsAdmin: { version: "V1", kind: "screen", id: "SCR-S005", label: "통계 관리", source: v1Sales(326), referenceVersion: "V2", referenceSource: v2Sales() },
  deferredRevenue: { version: "V1", kind: "screen", id: "SCR-S006", label: "선수익금 조회", source: v1Sales(457), status: "policy-pending", referenceVersion: "V2", referenceSource: v2Sales() },
  refunds: { version: "V1", kind: "screen", id: "SCR-S007", label: "환불 관리", source: v1Sales(550), status: "policy-pending", referenceVersion: "V2", referenceSource: v2Sales() },
  unpaid: { version: "V1", kind: "screen", id: "SCR-S008", label: "미수금 관리", source: v1Sales(635), referenceVersion: "V2", referenceSource: v2Sales() },
  installments: { version: "V1", kind: "screen", id: "SCR-S009", label: "할부결제 관리", source: v1Sales(711), referenceVersion: "V2", referenceSource: v2Sales() },
  taxInvoices: { version: "V1", kind: "screen", id: "SCR-S010", label: "세금계산서 발행", source: v1Sales(872), status: "external-pending", referenceVersion: "V2", referenceSource: v2Sales() },
  forecast: { version: "V1", kind: "screen", id: "SCR-S011", label: "매출 예측", source: v1Sales(1005), status: "policy-pending", referenceVersion: "V2", referenceSource: v2Sales() },
  cancelRefund: { version: "V1", kind: "screen", id: "SCR-S012", label: "결제 취소 / 부분 환불", source: v1Sales(1105), status: "policy-pending", referenceVersion: "V2", referenceSource: v2Sales() },

  // === D04 수업관리 ===
  classCalendar: { version: "V1", kind: "screen", id: "SCR-C001", label: "수업 캘린더", source: v1Class(), referenceVersion: "V2", referenceSource: v2Class() },
  classAdmin: { version: "V1", kind: "screen", id: "SCR-C002", label: "수업 관리", source: v1Class(), referenceVersion: "V2", referenceSource: v2Class() },
  classSchedule: { version: "V1", kind: "screen", id: "SCR-C003", label: "시간표 일괄 등록", source: v1Class(), referenceVersion: "V2", referenceSource: v2Class() },
  classTemplates: { version: "V1", kind: "screen", id: "SCR-C004", label: "그룹 수업 템플릿", source: v1Class(), referenceVersion: "V2", referenceSource: v2Class() },
  classGroupStatus: { version: "V1", kind: "screen", id: "SCR-C005", label: "그룹 수업 현황", source: v1Class(), referenceVersion: "V2", referenceSource: v2Class() },
  instructorStatus: { version: "V1", kind: "screen", id: "SCR-C006", label: "강사 근무 현황", source: v1Class(), referenceVersion: "V2", referenceSource: v2Class() },
  lessonCounts: { version: "V1", kind: "screen", id: "SCR-C007", label: "횟수 관리", source: v1Class(), referenceVersion: "V2", referenceSource: v2Class() },
  penalties: { version: "V1", kind: "screen", id: "SCR-C008", label: "페널티 관리", source: v1Class(), referenceVersion: "V2", referenceSource: v2Class() },
  scheduleRequests: { version: "V1", kind: "screen", id: "SCR-C009", label: "일정 요청 처리", source: v1Class(), referenceVersion: "V2", referenceSource: v2Class() },
  validLessons: { version: "V1", kind: "screen", id: "SCR-C011", label: "유효 수업 목록", source: v1Class(), referenceVersion: "V2", referenceSource: v2Class() },
  classFeedback: { version: "V1", kind: "screen", id: "SCR-C013", label: "수업 평가 피드백", source: v1Class(), referenceVersion: "V2", referenceSource: v2Class() },
  lessonCompletion: { version: "V1", kind: "screen", id: "SCR-C014", label: "수업 출석/완료 확인", source: v1Class(), referenceVersion: "V2", referenceSource: v2Class() },
  classReservations: { version: "V1", kind: "screen", id: "SCR-C016", label: "예약 목록", source: v1Class(), referenceVersion: "V2", referenceSource: v2Class() },

  // === D05 상품관리 ===
  productAdmin: { version: "V1", kind: "screen", id: "SCR-P001", label: "상품 관리", source: v1Product(), referenceVersion: "V2", referenceSource: v2Product() },
  productCreate: { version: "V1", kind: "screen", id: "SCR-P002", label: "상품 등록", source: v1Product(), referenceVersion: "V2", referenceSource: v2Product() },
  productDetail: { version: "V1", kind: "screen", id: "SCR-P003", label: "상품 상세/수정 패널", source: v1Product(), referenceVersion: "V2", referenceSource: v2Product() },
  productDiscount: { version: "V1", kind: "screen", id: "SCR-P004", label: "할인 설정", source: v1Product(), referenceVersion: "V2", referenceSource: v2Product() },
  // D05 V2 only 신규
  productCatalog: { version: "V2", kind: "screen", id: "SCR-P005", label: "상품 카탈로그", source: v2Product(), status: "policy-pending" },
  productCompare: { version: "V2", kind: "screen", id: "SCR-P006", label: "상품 비교", source: v2Product(), status: "policy-pending" },
  inventoryProducts: { version: "V2", kind: "screen", id: "SCR-P007", label: "재고 관리", source: v2Product(), status: "policy-pending" },
  seasonalPrice: { version: "V2", kind: "screen", id: "SCR-P008", label: "시즌 가격 관리", source: v2Product(), status: "policy-pending" },

  // === D06 시설관리 ===
  lockerAdmin: { version: "V1", kind: "screen", id: "SCR-050", label: "락커 관리", source: v1Facility(), referenceVersion: "V2", referenceSource: v2Facility() },
  // D06 V2 only 신규
  lockerAssignment: { version: "V2", kind: "screen", id: "SCR-051", label: "사물함 배정 관리", source: v2Facility(), status: "policy-pending" },
  bandCard: { version: "V2", kind: "screen", id: "SCR-052", label: "밴드/카드 관리", source: v2Facility(), status: "policy-pending" },
  gymRoom: { version: "V2", kind: "screen", id: "SCR-053", label: "운동룸 관리", source: v2Facility(), status: "policy-pending" },
  golfBay: { version: "V2", kind: "screen", id: "SCR-054", label: "골프 타석 관리", source: v2Facility(), status: "policy-pending" },
  productInventory: { version: "V2", kind: "screen", id: "SCR-055", label: "상품 재고 관리", source: v2Facility(), status: "policy-pending" },
  equipmentCheck: { version: "V2", kind: "screen", id: "SCR-056", label: "장비 점검 일정", source: v2Facility(), status: "policy-pending" },
  consumables: { version: "V2", kind: "screen", id: "SCR-057", label: "소모품 재고 관리", source: v2Facility(), status: "policy-pending" },
  cleaning: { version: "V2", kind: "screen", id: "SCR-058", label: "청소 스케줄", source: v2Facility(), status: "policy-pending" },
  spaceAsset: { version: "V2", kind: "screen", id: "SCR-059", label: "공간 자산 관리", source: v2Facility(), status: "policy-pending" },

  // === D07 직원관리 ===
  staffList: { version: "V1", kind: "screen", id: "SCR-060", label: "직원 목록", source: v1Staff(), referenceVersion: "V2", referenceSource: v2Staff() },
  staffCreate: { version: "V1", kind: "screen", id: "SCR-061", label: "직원 등록/수정", source: v1Staff(), referenceVersion: "V2", referenceSource: v2Staff() },
  staffResignation: { version: "V1", kind: "screen", id: "SCR-062", label: "직원 퇴사 처리", source: v1Staff(), referenceVersion: "V2", referenceSource: v2Staff() },
  staffAttendance: { version: "V1", kind: "screen", id: "SCR-063", label: "직원 근태 관리", source: v1Staff(), referenceVersion: "V2", referenceSource: v2Staff() },
  payroll: { version: "V1", kind: "screen", id: "SCR-064", label: "급여 관리", source: v1Staff(), referenceVersion: "V2", referenceSource: v2Staff() },
  payrollStatements: { version: "V1", kind: "screen", id: "SCR-065", label: "급여 명세서", source: v1Staff(), referenceVersion: "V2", referenceSource: v2Staff() },

  // === D08 마케팅 ===
  leads: { version: "V1", kind: "screen", id: "SCR-070", label: "리드 관리", source: v1Marketing(), referenceVersion: "V2", referenceSource: v2Marketing() },
  message: { version: "V1", kind: "screen", id: "SCR-071", label: "메시지 발송", source: v1Marketing(), referenceVersion: "V2", referenceSource: v2Marketing() },
  autoAlarm: { version: "V1", kind: "screen", id: "SCR-072", label: "자동 알림 설정", source: v1Marketing(246), referenceVersion: "V2", referenceSource: v2Marketing() },
  autoAlarmOperation: { version: "V1", kind: "screen", id: "SCR-072A", label: "자동알림 운영현황", source: v1Marketing(), referenceVersion: "V2", referenceSource: v2Marketing() },
  coupon: { version: "V1", kind: "screen", id: "SCR-073", label: "쿠폰 관리", source: v1Marketing(), referenceVersion: "V2", referenceSource: v2Marketing() },
  mileage: { version: "V1", kind: "screen", id: "SCR-074", label: "마일리지 관리", source: v1Marketing(), referenceVersion: "V2", referenceSource: v2Marketing() },
  contracts: { version: "V1", kind: "screen", id: "SCR-075", label: "전자 계약", source: v1Marketing(), referenceVersion: "V2", referenceSource: v2Marketing() },
  campaign: { version: "V1", kind: "screen", id: "SCR-076", label: "캠페인 관리", source: v1Marketing(), referenceVersion: "V2", referenceSource: v2Marketing() },
  smsBulk: { version: "V1", kind: "screen", id: "SCR-078", label: "SMS/카카오 대량 발송", source: v1Marketing(892), referenceVersion: "V2", referenceSource: v2Marketing() },
  abTest: { version: "V1", kind: "screen", id: "SCR-079", label: "A/B 테스트", source: v1Marketing(), status: "policy-pending", referenceVersion: "V2", referenceSource: v2Marketing() },
  // D08 V2 only 신규
  referral: { version: "V2", kind: "screen", id: "SCR-077", label: "리퍼럴 프로그램", source: v2Marketing(), status: "policy-pending" },

  // === D09 설정관리 ===
  centerSettings: { version: "V1", kind: "screen", id: "SCR-080", label: "센터 설정", source: v1Settings(), referenceVersion: "V2", referenceSource: v2Settings() },
  branchAutomation: { version: "V1", kind: "screen", id: "SCR-080A", label: "지점 자동화 적용", source: v1Settings(), referenceVersion: "V2", referenceSource: v2Settings() },
  permissions: { version: "V1", kind: "screen", id: "SCR-081", label: "권한 설정", source: v1Settings(), referenceVersion: "V2", referenceSource: v2Settings() },
  kiosk: { version: "V1", kind: "screen", id: "SCR-082", label: "키오스크 설정", source: v1Settings(), referenceVersion: "V2", referenceSource: v2Settings() },
  kioskIot: { version: "V1", kind: "screen", id: "SCR-082A", label: "키오스크 IoT 설정", source: v1Settings(), referenceVersion: "V2", referenceSource: v2Settings() },
  iotAccess: { version: "V1", kind: "screen", id: "SCR-083", label: "IoT 출입 관리", source: v1Settings(), referenceVersion: "V2", referenceSource: v2Settings() },
  subscription: { version: "V1", kind: "screen", id: "SCR-084", label: "구독 결제 관리", source: v1Settings(), referenceVersion: "V2", referenceSource: v2Settings() },
  attendanceSettings: { version: "V1", kind: "screen", id: "SCR-086", label: "출석 관리 설정", source: v1Settings(), referenceVersion: "V2", referenceSource: v2Settings() },
  customRole: { version: "V1", kind: "screen", id: "SCR-087", label: "커스텀 역할 생성", source: v1Settings(), referenceVersion: "V2", referenceSource: v2Settings() },
  dataBackup: { version: "V1", kind: "screen", id: "SCR-089", label: "데이터 백업·복원", source: v1Settings(), referenceVersion: "V2", referenceSource: v2Settings() },
  // D09 V2 only 신규
  notices: { version: "V2", kind: "screen", id: "SCR-085", label: "공지사항 관리", source: v2Settings(), status: "policy-pending" },
  localization: { version: "V2", kind: "screen", id: "SCR-088", label: "다국어 설정", source: v2Settings(), status: "policy-pending" },

  // === D10 본사관리 ===
  branches: { version: "V1", kind: "screen", id: "SCR-092", label: "지점 관리", source: v1HQ(), referenceVersion: "V2", referenceSource: v2HQ() },
  branchReport: { version: "V1", kind: "screen", id: "SCR-093", label: "지점 성과 리포트", source: v1HQ(), referenceVersion: "V2", referenceSource: v2HQ() },
  kpiDashboard: { version: "V1", kind: "screen", id: "SCR-094", label: "KPI 대시보드", source: v1HQ(), referenceVersion: "V2", referenceSource: v2HQ() },
  kpiCenter: { version: "V1", kind: "screen", id: "SCR-095", label: "KPI 센터", source: v1HQ(), referenceVersion: "V2", referenceSource: v2HQ() },
  auditLog: { version: "V1", kind: "screen", id: "SCR-097", label: "히스토리 로그", source: v1HQ(), referenceVersion: "V2", referenceSource: v2HQ() },
  todayTasks: { version: "V1", kind: "screen", id: "SCR-098", label: "오늘의 할 일", source: v1HQ(), referenceVersion: "V2", referenceSource: v2HQ() },
  reports: { version: "V1", kind: "screen", id: "SCR-099", label: "리포트 생성", source: v1HQ(), referenceVersion: "V2", referenceSource: v2HQ() },
  automationPolicies: { version: "V1", kind: "screen", id: "SCR-H1001", label: "자동화 정책 라이브러리", source: v1HQ(1393), referenceVersion: "V2", referenceSource: v2HQ() },
  forecastAnalytics: { version: "V1", kind: "screen", id: "SCR-H1004", label: "예측 분석", source: v1HQ(), status: "policy-pending", referenceVersion: "V2", referenceSource: v2HQ() },
  // D10 V2 only 신규
  branchDashboard: { version: "V2", kind: "screen", id: "SCR-090", label: "지점 대시보드", source: v2HQ(), status: "policy-pending" },
  legacyRedirect: { version: "V2", kind: "screen", id: "SCR-091", label: "구버전 슈퍼 대시보드 리다이렉트", source: v2HQ() },
  onboarding: { version: "V2", kind: "screen", id: "SCR-096", label: "온보딩 대시보드", source: v2HQ(), status: "policy-pending" },
  dashboardBuilder: { version: "V2", kind: "screen", id: "SCR-H1002", label: "커스텀 대시보드 빌더", source: v2HQ(), status: "policy-pending" },
  benchmark: { version: "V2", kind: "screen", id: "SCR-H1003", label: "벤치마크 비교", source: v2HQ(), status: "external-pending" },
  nps: { version: "V2", kind: "screen", id: "SCR-H1005", label: "NPS 설문", source: v2HQ(), status: "policy-pending" },

  // === D11 통합운영 ===
  attendance: { version: "V1", kind: "screen", id: "SCR-I001", label: "통합 출석 관리", source: v1Integrated(), referenceVersion: "V2", referenceSource: v2Integrated() },
  clothLocker: { version: "V1", kind: "screen", id: "SCR-I004", label: "옷 락커 운영 관리", source: v1Integrated(), referenceVersion: "V2", referenceSource: v2Integrated() },
  fixedLocker: { version: "V1", kind: "screen", id: "SCR-I005", label: "고정 물품 락커 관리", source: v1Integrated(), referenceVersion: "V2", referenceSource: v2Integrated() },
  bodyCompositionIntegrated: { version: "V1", kind: "screen", id: "SCR-I006", label: "체성분 통합 관리", source: v1Integrated(), referenceVersion: "V2", referenceSource: v2Integrated() },
  healthSummary: { version: "V1", kind: "screen", id: "SCR-I007", label: "회원 건강 연동 요약", source: v1Integrated(), status: "external-pending", referenceVersion: "V2", referenceSource: v2Integrated() },
};

const dialogSource = (
  id: string,
  label: string,
  domain: "member" | "sales" | "common",
  line: number,
  status?: PublishingStatus
): PublishingSource => ({
  version: "V1",
  kind: "dialog",
  id,
  label,
  source: domain === "member" ? v1Member(line) : domain === "sales" ? v1Sales(line) : v1Common(line),
  status,
});

export const publishingDialogs: Record<string, PublishingSource> = {
  "DLG-000": dialogSource("DLG-000", "세션 만료", "common", 164),
  "DLG-M001": dialogSource("DLG-M001", "회원 상태 변경 확인", "member", 1073),
  "DLG-M002": dialogSource("DLG-M002", "회원 삭제 확인", "member", 1153),
  "DLG-M003": dialogSource("DLG-M003", "홀딩 등록", "member", 1222),
  "DLG-M004": dialogSource("DLG-M004", "홀딩 해제", "member", 1299),
  "DLG-M005": dialogSource("DLG-M005", "탈퇴 처리", "member", 1370),
  "DLG-M006": dialogSource("DLG-M006", "전화번호 중복 안내", "member", 1465),
  "DLG-M007": dialogSource("DLG-M007", "작업 취소 확인", "member", 1534),
  "DLG-M008": dialogSource("DLG-M008", "입력 폼 초기화 확인", "member", 1603),
  "DLG-M009": dialogSource("DLG-M009", "메모 추가", "member", 1672),
  "DLG-M010": dialogSource("DLG-M010", "메모 삭제 확인", "member", 1741),
  "DLG-M011": dialogSource("DLG-M011", "상담 등록/수정", "member", 1810),
  "DLG-M012": dialogSource("DLG-M012", "상담 기록 삭제 확인", "member", 1897),
  "DLG-M013": dialogSource("DLG-M013", "환불 처리", "member", 1966, "policy-pending"),
  "DLG-M014": dialogSource("DLG-M014", "결제 상세 조회", "member", 2018),
  "DLG-M015": dialogSource("DLG-M015", "체성분 등록", "member", 2093),
  "DLG-M016": dialogSource("DLG-M016", "체성분 덮어쓰기", "member", 2174),
  "DLG-M017": dialogSource("DLG-M017", "목표 설정", "member", 2243),
  "DLG-M018": dialogSource("DLG-M018", "연장 등록", "member", 2314),
  "DLG-M019": dialogSource("DLG-M019", "양도 처리", "member", 2395, "policy-pending"),
  "DLG-M020": dialogSource("DLG-M020", "쿠폰 적용", "member", 2474),
  "DLG-M022": dialogSource("DLG-M022", "수동 출석", "member", 2553),
  "DLG-M023": dialogSource("DLG-M023", "이관 확인", "member", 2641),
  "DLG-M024": dialogSource("DLG-M024", "종합 평가 등록", "member", 2729),
  "DLG-M026": dialogSource("DLG-M026", "운동 이력 등록", "member", 2804),
  "DLG-M027": dialogSource("DLG-M027", "주소 검색", "member", 2877, "external-pending"),
  "DLG-M028": dialogSource("DLG-M028", "회원 병합 확인", "member", 2958),
  "DLG-M029": dialogSource("DLG-M029", "가족 연결", "member", 3039),
  "DLG-M030": dialogSource("DLG-M030", "등급 변경", "member", 3116),
  "DLG-S001": dialogSource("DLG-S001", "매출 상세", "sales", 1201),
  "DLG-S002": dialogSource("DLG-S002", "구매자 검색", "sales", 1283),
  "DLG-S003": dialogSource("DLG-S003", "결제 확인", "sales", 1368),
  "DLG-S004": dialogSource("DLG-S004", "중복 결제 경고", "sales", 1464),
  "DLG-S005": dialogSource("DLG-S005", "메모 편집", "sales", 1548),
  "DLG-S006": dialogSource("DLG-S006", "환불 상세", "sales", 1626, "policy-pending"),
  "DLG-S007": dialogSource("DLG-S007", "할부 상세", "sales", 1708),
  "DLG-S008": dialogSource("DLG-S008", "납입 처리", "sales", 1814),
  "DLG-S009": dialogSource("DLG-S009", "할부 등록", "sales", 1890),
  "DLG-S010": dialogSource("DLG-S010", "세금계산서 상세", "sales", 2003, "external-pending"),
  "DLG-S011": dialogSource("DLG-S011", "세금계산서 발행", "sales", 2105, "external-pending"),
  "DLG-S012": dialogSource("DLG-S012", "목표 매출 설정", "sales", 2223),
  "DLG-S013": dialogSource("DLG-S013", "환불 처리", "sales", 2314, "policy-pending"),
  "DLG-S014": dialogSource("DLG-S014", "환불 상세 결과", "sales", 2402, "policy-pending"),
  "DLG-S015": dialogSource("DLG-S015", "환불 요청", "sales", 2484, "policy-pending"),
};

const baseDialogBlueprint = (source: PublishingSource): DialogBlueprint => ({
  source,
  purpose: `${source.label} 흐름을 화면에서 끊기지 않게 확인하고, 저장/삭제/승인 등 실제 처리는 mock 토스트 또는 로컬 상태로만 표현합니다.`,
  entryRoute: source.id.startsWith("DLG-M") ? "/members" : source.id.startsWith("DLG-S") ? "/sales" : "/login",
  sections: [
    {
      title: "문서 기준 확인",
      description: source.source,
      items: [
        "호출 화면에서 열린 맥락을 상단 요약으로 표시",
        "필수 입력/권한/예외 상태를 버튼 비활성 또는 안내 배너로 표현",
        "실제 API 호출 없이 확인 토스트만 발생",
      ],
      tone: source.status === "policy-pending" ? "warning" : source.status === "external-pending" ? "info" : "default",
    },
  ],
  actions: [
    { label: "닫기", variant: "outline" },
    { label: source.status ? "정책 확인 필요로 저장" : "확인", variant: source.status === "policy-pending" ? "secondary" : "primary" },
  ],
  backendPolicy: "퍼블리싱 범위: API/DB/외부 연동 호출 없음. 개발 인수 시 이벤트 핸들러만 실제 service layer에 연결합니다.",
});

export const dialogBlueprints: Record<string, DialogBlueprint> = Object.fromEntries(
  Object.entries(publishingDialogs).map(([id, source]) => [id, baseDialogBlueprint(source)])
) as Record<string, DialogBlueprint>;

Object.assign(dialogBlueprints, {
  "DLG-000": {
    source: publishingDialogs["DLG-000"],
    entryRoute: "/login",
    purpose: "세션 만료 시 사용자의 현재 작업 중단을 명확히 알리고 로그인 화면으로 복귀시키는 공통 다이얼로그입니다.",
    sections: [
      { title: "세션 상태", items: ["마지막 활동 후 세션이 만료됨", "보안상 현재 화면 조작은 중단됨", "다시 로그인하면 기존 메뉴로 복귀 가능"], tone: "warning" },
    ],
    actions: [{ label: "로그인으로 이동", variant: "primary" }],
  },
  "DLG-M001": {
    source: publishingDialogs["DLG-M001"],
    entryRoute: "/members",
    purpose: "선택 회원의 상태를 일괄 변경하기 전에 대상/변경값/예외 차단을 최종 확인합니다.",
    rolePolicy: "Owner/manager 이상 실행. readonly는 확인만 가능하고 실행 버튼 비활성.",
    sections: [
      {
        title: "대상 요약",
        fields: [
          { label: "선택 회원", value: "3명" },
          { label: "현재 상태", value: "활성 2명 · 홀딩 1명" },
          { label: "변경 상태", value: "정지", type: "select", required: true },
        ],
      },
      { title: "예외 처리", items: ["미수금 보유 회원은 정지 전 경고 표시", "진행 예약이 있는 회원은 예약 취소 안내 표시", "감사 로그 기록 문구 노출"], tone: "warning" },
    ],
    actions: [{ label: "취소", variant: "outline" }, { label: "상태 변경", variant: "primary" }],
  },
  "DLG-M002": {
    source: publishingDialogs["DLG-M002"],
    entryRoute: "/members",
    purpose: "회원 삭제 전 미수/예약/환불 필요 이용권 등 차단 조건을 분리해 보여줍니다.",
    rolePolicy: "Owner 이상 또는 삭제 권한 보유자만 실행.",
    sections: [
      { title: "삭제 대상", fields: [{ label: "회원", value: "김민지 · M-10042" }, { label: "상태", value: "만료 회원" }] },
      { title: "차단 조건", items: ["미수금 0원", "진행 예약 없음", "환불 필요 이용권 없음"], tone: "success" },
      { title: "감사 로그", fields: [{ label: "삭제 사유", type: "textarea", required: true, hint: "삭제 사유는 운영 이력에 남습니다." }] },
    ],
    actions: [{ label: "취소", variant: "outline" }, { label: "회원 삭제", variant: "danger" }],
  },
  "DLG-M006": {
    source: publishingDialogs["DLG-M006"],
    entryRoute: "/members/new",
    purpose: "회원 등록/수정 중 동일 연락처가 발견되면 기존 회원 이동, 복구, 강제 등록을 분기합니다.",
    sections: [
      { title: "중복 연락처", fields: [{ label: "입력 연락처", value: "010-1234-5678" }, { label: "기존 회원", value: "박서준 · 활성 · PT 12회권" }] },
      { title: "처리 원칙", items: ["활성 회원 중복은 기존 회원 이동 우선", "탈퇴/삭제 회원은 복구 우선", "법인 공용 번호 등 예외만 강제 등록"], tone: "warning" },
    ],
    actions: [{ label: "닫기", variant: "outline" }, { label: "기존 회원 이동", variant: "secondary" }, { label: "강제 등록", variant: "primary" }],
  },
  "DLG-S002": {
    source: publishingDialogs["DLG-S002"],
    entryRoute: "/pos",
    purpose: "POS/결제 처리에서 구매자 또는 포인트 사용 회원을 빠르게 검색·선택합니다.",
    sections: [
      { title: "검색", fields: [{ label: "회원명/휴대폰", value: "김민지", type: "text" }, { label: "지점", value: "강남 1호점", type: "select" }] },
      { title: "검색 결과", items: ["김민지 · 활성 · 010-1234-5678 · PT 잔여 8회", "김민지A · 만료 · 최근 결제 2026-05-01"], tone: "info" },
    ],
    actions: [{ label: "닫기", variant: "outline" }, { label: "선택 적용", variant: "primary" }],
  },
  "DLG-S003": {
    source: publishingDialogs["DLG-S003"],
    entryRoute: "/pos",
    purpose: "상품/할인/결제수단/미수금 배분이 맞는지 결제 전 최종 확인합니다.",
    sections: [
      {
        title: "결제 요약",
        fields: [
          { label: "상품", value: "PT 20회권" },
          { label: "정가", value: "1,200,000원", type: "money" },
          { label: "할인", value: "100,000원", type: "money" },
          { label: "실 결제", value: "1,100,000원", type: "money" },
        ],
      },
      {
        title: "결제 수단",
        fields: [
          { label: "카드", value: "900,000원", type: "money" },
          { label: "현금", value: "100,000원", type: "money" },
          { label: "미수", value: "100,000원", type: "money" },
        ],
      },
      { title: "외부 연동 제외", items: ["카드 승인/현금영수증/알림 발송은 퍼블리싱에서 실행하지 않음", "영수증 첨부 여부는 UI 상태만 표시"], tone: "info" },
    ],
    actions: [{ label: "이전", variant: "outline" }, { label: "결제 확정", variant: "primary" }],
    backendPolicy: "실제 승인/영수증/알림 연동은 개발 단계에서 결제 서비스와 연결합니다.",
  },
  "DLG-S013": {
    source: publishingDialogs["DLG-S013"],
    entryRoute: "/refunds",
    purpose: "환불 금액과 사유를 수기로 확정하고 권한에 따라 즉시 완료 또는 승인 요청으로 분기합니다.",
    rolePolicy: "Owner는 환불 완료 가능, manager/fc는 승인 요청만 가능.",
    sections: [
      {
        title: "환불 산식 수기 입력",
        description: "자동 계산 산식 미확정",
        fields: [
          { label: "기결제액", value: "1,100,000원", type: "money" },
          { label: "사용 차감금", value: "250,000원", type: "money" },
          { label: "위약금", value: "50,000원", type: "money" },
          { label: "최종 환불액", value: "800,000원", type: "money", required: true },
        ],
        tone: "warning",
      },
      { title: "승인/이력", fields: [{ label: "환불 사유", type: "textarea", required: true }, { label: "증빙 첨부", value: "파일 선택 UI만 제공", type: "text" }] },
    ],
    actions: [{ label: "취소", variant: "outline" }, { label: "승인 요청", variant: "secondary" }, { label: "환불 완료", variant: "danger" }],
    backendPolicy: "환불 자동 계산, PG 환불, 회계 반영은 정책/연동 확정 후 개발합니다.",
  },
});

export const docs4DialogGroups = {
  member: Object.keys(publishingDialogs).filter((id) => id.startsWith("DLG-M")),
  sales: Object.keys(publishingDialogs).filter((id) => id.startsWith("DLG-S")),
  common: Object.keys(publishingDialogs).filter((id) => id === "DLG-000"),
};

export function getPublishingSourceByRoute(route: string): PublishingSource | undefined {
  const exact: Record<string, PublishingSource> = {
    "/login": publishingScreens.login,
    "/notifications": publishingScreens.notifications,
    "/dialogs": publishingScreens.dialogGallery,
    "/members": publishingScreens.members,
    "/members/new": publishingScreens.memberCreate,
    "/members/edit": publishingScreens.memberEdit,
    "/members/detail": publishingScreens.memberDetail,
    "/members/transfer": publishingScreens.memberTransfer,
    "/body-composition": publishingScreens.bodyComposition,
    "/members/merge": publishingScreens.memberMerge,
    "/members/family": publishingScreens.family,
    "/members/grade": publishingScreens.grades,
    "/members/segment": publishingScreens.segments,
    "/sales": publishingScreens.sales,
    "/sales/pos": publishingScreens.pos,
    "/sales/payment": publishingScreens.payment,
    "/sales/stats": publishingScreens.salesStats,
    "/sales/statistics-admin": publishingScreens.statsAdmin,
    "/sales/deferred-revenue": publishingScreens.deferredRevenue,
    "/sales/refunds": publishingScreens.refunds,
    "/sales/receivables": publishingScreens.unpaid,
    "/sales/installments": publishingScreens.installments,
    "/sales/tax-invoice": publishingScreens.taxInvoices,
    "/sales/forecast": publishingScreens.forecast,
    "/sales/refund-partial": publishingScreens.cancelRefund,
  };
  if (exact[route]) return exact[route];
  if (route.startsWith("/members/")) return publishingScreens.memberDetail;
  if (route.startsWith("/sales/")) return publishingScreens.sales;
  return undefined;
}
