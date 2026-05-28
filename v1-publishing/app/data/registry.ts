import { extraDialogs, extraScreens } from "./v1-extra";

export type RoleId = "HQ_ADMIN" | "OWNER" | "MANAGER" | "FC" | "TRAINER" | "STAFF";
export type DomainId = "D01" | "D02" | "D03" | "D04" | "D05" | "D06" | "D07" | "D08" | "D09" | "D10" | "D11";
export type PermissionKey = "viewAllBranches" | "memberWrite" | "dangerMember" | "transfer" | "bodyWrite" | "salesWrite" | "refundApprove" | "installment" | "taxInvoice" | "targetManage";

export type DialogDefinition = {
  id: string;
  title: string;
  domain: DomainId;
  source: string;
  purpose: string;
  components: string[];
  requiredPermission?: PermissionKey;
  policyPending?: boolean;
  destructive?: boolean;
};

export type ScreenDefinition = {
  id: string;
  title: string;
  domain: DomainId;
  route: string;
  source: string;
  feature: string;
  purpose: string;
  tabs: string[];
  metrics: { label: string; value: string; hint: string }[];
  filters: string[];
  tableColumns: string[];
  rows: Record<string, string>[];
  dialogs: string[];
  primaryActions: { label: string; permission?: PermissionKey; dialogId?: string; danger?: boolean; policyPending?: boolean }[];
  roleNotes: Partial<Record<RoleId, string>>;
  policyPending?: boolean;
};

export const roles: { id: RoleId; label: string; branchScope: string; description: string; permissions: PermissionKey[] }[] = [
  { id: "HQ_ADMIN", label: "본사 관리자", branchScope: "전 지점", description: "통합 조회·정책 확인·지점 비교 중심. 현장 처리 액션은 검수용 mock으로 제한 표시합니다.", permissions: ["viewAllBranches", "taxInvoice", "targetManage"] },
  { id: "OWNER", label: "지점장 / Owner", branchScope: "선택 지점", description: "회원 위험 액션, 환불 승인, 이관, 목표 설정까지 가능한 최종 책임자 역할입니다.", permissions: ["memberWrite", "dangerMember", "transfer", "bodyWrite", "salesWrite", "refundApprove", "installment", "taxInvoice", "targetManage"] },
  { id: "MANAGER", label: "매니저", branchScope: "선택 지점", description: "상태 변경, 납입 처리, 운영 저장뷰 관리가 가능한 중간 관리자입니다.", permissions: ["memberWrite", "bodyWrite", "salesWrite", "installment"] },
  { id: "FC", label: "FC", branchScope: "담당 회원", description: "담당 회원 상담, 등록 보조, 결제 안내 중심. 삭제·환불 승인·이관은 제한됩니다.", permissions: ["memberWrite", "salesWrite"] },
  { id: "TRAINER", label: "트레이너", branchScope: "담당 회원", description: "체성분, 목표, 운동 이력 입력 중심. 매출 위험 액션은 제한됩니다.", permissions: ["bodyWrite"] },
  { id: "STAFF", label: "일반 직원", branchScope: "선택 지점", description: "조회, POS 판매, 기본 접수 중심. 승인성 액션은 권한 필요 상태로 표시합니다.", permissions: ["salesWrite"] }
];

export const branches = ["강남점", "서초점", "잠실점", "본사 통합"];

const memberRows = [
  { 이름: "김민준", 상태: "활성", 지점: "강남점", 담당: "이FC", 만료일: "2026-06-25", 미수: "0원" },
  { 이름: "박서연", 상태: "임박", 지점: "강남점", 담당: "최매니저", 만료일: "2026-05-31", 미수: "120,000원" },
  { 이름: "정하준", 상태: "홀딩", 지점: "서초점", 담당: "박트레이너", 만료일: "2026-07-10", 미수: "0원" },
  { 이름: "오지우", 상태: "만료", 지점: "잠실점", 담당: "이FC", 만료일: "2026-05-08", 미수: "80,000원" }
];

const salesRows = [
  { 매출번호: "S-260528-001", 회원: "김민준", 상품: "PT 20회", 금액: "1,200,000원", 상태: "결제완료", 수단: "카드", 귀속: "강남점" },
  { 매출번호: "S-260528-002", 회원: "박서연", 상품: "회원권 3개월", 금액: "450,000원", 상태: "미수", 수단: "현금", 귀속: "강남점" },
  { 매출번호: "S-260527-003", 회원: "정하준", 상품: "락커 1개월", 금액: "30,000원", 상태: "환불요청", 수단: "계좌", 귀속: "서초점" },
  { 매출번호: "S-260526-004", 회원: "오지우", 상품: "할부 회원권", 금액: "900,000원", 상태: "할부", 수단: "복합", 귀속: "잠실점" }
];

const coreDialogs: DialogDefinition[] = [
  { id: "DLG-000", title: "세션 만료", domain: "D01", source: "docs4/V1/D01-공통/공통.md", purpose: "활동 없음 또는 세션 만료 시 현재 위치를 기억하고 재로그인을 안내합니다.", components: ["만료 안내", "현재 페이지", "재로그인 버튼"] },
  { id: "DLG-M001", title: "회원 상태 변경 확인", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "활성·만료·홀딩·탈퇴 등 회원 상태 변경 전 영향 범위를 확인합니다.", components: ["현재 상태", "변경 상태", "사유", "처리 확인"], requiredPermission: "memberWrite" },
  { id: "DLG-M002", title: "회원 삭제 확인", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "회원 삭제 전 복구 불가 위험과 이력 보존 정책을 확인합니다.", components: ["삭제 대상", "복구 불가 안내", "권한 확인"], requiredPermission: "dangerMember", destructive: true },
  { id: "DLG-M003", title: "홀딩 등록", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "이용권 홀딩 기간과 사유를 등록합니다.", components: ["홀딩 시작일", "종료일", "사유"], requiredPermission: "memberWrite" },
  { id: "DLG-M004", title: "홀딩 해제", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "기존 홀딩을 해제하고 잔여 기간 재계산 필요 여부를 표시합니다.", components: ["해제일", "잔여 기간", "확인"], requiredPermission: "memberWrite" },
  { id: "DLG-M005", title: "탈퇴 처리", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "회원 탈퇴 또는 복구 처리 전 보유 상품과 미수금을 확인합니다.", components: ["탈퇴 사유", "잔여 상품", "미수금"], requiredPermission: "dangerMember", destructive: true },
  { id: "DLG-M006", title: "전화번호 중복 안내", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "동일 연락처 회원을 안내하고 기존 회원 확인 또는 계속 등록을 선택합니다.", components: ["중복 회원 목록", "기존 회원 이동", "계속 등록"], requiredPermission: "memberWrite" },
  { id: "DLG-M007", title: "작업 취소 확인", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "입력 중인 변경사항을 저장하지 않고 나갈지 확인합니다.", components: ["변경사항 요약", "취소", "계속 작성"] },
  { id: "DLG-M008", title: "입력 폼 초기화 확인", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "현재 입력값을 초기화하기 전 재확인합니다.", components: ["초기화 대상", "초기화", "닫기"] },
  { id: "DLG-M009", title: "메모 추가", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "회원 상담·운영 메모를 추가합니다.", components: ["메모 내용", "공유 범위", "저장"], requiredPermission: "memberWrite" },
  { id: "DLG-M010", title: "메모 삭제 확인", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "메모 삭제 전 대상과 복구 불가 여부를 확인합니다.", components: ["삭제 메모", "삭제 사유", "확인"], requiredPermission: "memberWrite", destructive: true },
  { id: "DLG-M011", title: "상담 등록/수정", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "상담 일정과 상담 결과를 등록하거나 수정합니다.", components: ["상담일", "담당자", "상담 내용"], requiredPermission: "memberWrite" },
  { id: "DLG-M012", title: "상담 기록 삭제 확인", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "상담 기록 삭제 전 이력 영향 범위를 확인합니다.", components: ["상담 기록", "삭제 사유", "확인"], requiredPermission: "memberWrite", destructive: true },
  { id: "DLG-M013", title: "환불 처리", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "회원 상세에서 결제 환불 처리를 시작합니다. 실제 환불은 외부 처리 필요 상태입니다.", components: ["원 결제", "환불 금액", "승인 상태"], requiredPermission: "refundApprove", policyPending: true },
  { id: "DLG-M014", title: "결제 상세 조회", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "회원의 결제 상세 정보를 조회합니다.", components: ["결제 정보", "상품 정보", "처리 직원"] },
  { id: "DLG-M015", title: "체성분 등록", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "체중·골격근량·체지방률·BMI 등 측정값을 등록합니다.", components: ["측정일", "체중", "골격근량", "체지방률"], requiredPermission: "bodyWrite" },
  { id: "DLG-M016", title: "체성분 덮어쓰기", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "동일 일자 체성분 기록이 있을 때 덮어쓰기 여부를 확인합니다.", components: ["기존 기록", "신규 기록", "덮어쓰기"], requiredPermission: "bodyWrite" },
  { id: "DLG-M017", title: "목표 설정", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "회원별 체성분 목표를 설정합니다.", components: ["목표 체중", "목표 체지방률", "목표일"], requiredPermission: "bodyWrite" },
  { id: "DLG-M018", title: "연장 등록", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "계약 기간 또는 이용권 기간 연장을 등록합니다.", components: ["연장 대상", "연장 기간", "사유"], requiredPermission: "memberWrite" },
  { id: "DLG-M019", title: "양도 처리", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "이용권 양도 대상과 양도 조건을 확인합니다.", components: ["양도자", "양수자", "잔여 권리"], requiredPermission: "dangerMember" },
  { id: "DLG-M020", title: "쿠폰 적용", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "회원 보유 쿠폰을 결제 또는 혜택에 적용합니다.", components: ["쿠폰 목록", "적용 대상", "할인액"], requiredPermission: "memberWrite" },
  { id: "DLG-M022", title: "수동 출석", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "키오스크 누락 등 예외 상황에서 출석을 수동 등록합니다.", components: ["회원", "출석 일시", "사유"], requiredPermission: "memberWrite" },
  { id: "DLG-M023", title: "이관 확인", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "회원 지점 이관 전 유지·변경 항목과 담당자 재배정을 확인합니다.", components: ["현재 지점", "대상 지점", "재배정 표"], requiredPermission: "transfer" },
  { id: "DLG-M024", title: "종합 평가 등록", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "회원의 종합 평가 결과와 후속 상담 액션을 등록합니다.", components: ["평가 점수", "코멘트", "후속 액션"], requiredPermission: "bodyWrite" },
  { id: "DLG-M026", title: "운동 이력 등록", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "회원 운동 수행 이력을 등록합니다.", components: ["운동 프로그램", "수행 결과", "트레이너 메모"], requiredPermission: "bodyWrite" },
  { id: "DLG-M027", title: "주소 검색", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "회원 주소를 검색하고 상세주소 입력으로 연결합니다.", components: ["주소 검색어", "검색 결과", "선택"], requiredPermission: "memberWrite" },
  { id: "DLG-M028", title: "회원 병합 확인", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "주 계정과 부 계정의 병합 결과를 최종 확인합니다.", components: ["주 계정", "부 계정", "이관 이력"], requiredPermission: "dangerMember", destructive: true },
  { id: "DLG-M029", title: "가족 연결", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "기존 회원을 가족 그룹에 연결합니다.", components: ["가족 그룹", "회원 검색", "관계"], requiredPermission: "memberWrite" },
  { id: "DLG-M030", title: "등급 변경", domain: "D02", source: "docs4/V1/D02-회원관리/회원관리.md", purpose: "회원 등급을 수동 변경하거나 자동 산정 기준을 확인합니다.", components: ["현재 등급", "변경 등급", "사유"], requiredPermission: "memberWrite" },
  { id: "DLG-S001", title: "매출 상세", domain: "D03", source: "docs4/V1/D03-매출관리/매출관리.md", purpose: "결제 내역, 수단, 구매 회원, 정산 정보를 종합 조회합니다.", components: ["매출 번호", "결제 금액", "상품 정보", "처리 직원"] },
  { id: "DLG-S002", title: "구매자 검색", domain: "D03", source: "docs4/V1/D03-매출관리/매출관리.md", purpose: "POS 결제 진행 시 구매 회원을 검색해 결제 대상에 연결합니다.", components: ["검색 입력", "검색 결과", "비회원 처리"], requiredPermission: "salesWrite" },
  { id: "DLG-S003", title: "결제 확인", domain: "D03", source: "docs4/V1/D03-매출관리/매출관리.md", purpose: "구매자, 상품, 금액, 수납액, 결제 수단을 최종 확인합니다.", components: ["구매자", "상품 목록", "최종 결제 금액", "수납액"], requiredPermission: "salesWrite" },
  { id: "DLG-S004", title: "중복 결제 경고", domain: "D03", source: "docs4/V1/D03-매출관리/매출관리.md", purpose: "동일 회원·동일 상품 단기간 중복 결제를 경고합니다.", components: ["기존 결제", "계속 진행", "취소"], requiredPermission: "salesWrite" },
  { id: "DLG-S005", title: "메모 편집", domain: "D03", source: "docs4/V1/D03-매출관리/매출관리.md", purpose: "특정 매출 건에 관리자 메모를 추가하거나 수정합니다.", components: ["대상 매출", "메모", "글자 수"], requiredPermission: "salesWrite" },
  { id: "DLG-S006", title: "환불 상세", domain: "D03", source: "docs4/V1/D03-매출관리/매출관리.md", purpose: "환불 번호, 원 매출, 승인자, 처리 일시를 조회합니다.", components: ["환불 번호", "환불 금액", "승인자", "처리 일시"] },
  { id: "DLG-S007", title: "할부 상세", domain: "D03", source: "docs4/V1/D03-매출관리/매출관리.md", purpose: "할부 계약의 회차별 납입 현황과 미납 회차를 확인합니다.", components: ["할부 번호", "총 금액", "월 납입액", "회차 표"], requiredPermission: "installment" },
  { id: "DLG-S008", title: "납입 처리", domain: "D03", source: "docs4/V1/D03-매출관리/매출관리.md", purpose: "미수금 또는 할부 미납 건의 실수령 금액과 수단을 기록합니다.", components: ["납입 대상", "실수령 금액", "결제 수단"], requiredPermission: "installment" },
  { id: "DLG-S009", title: "할부 등록", domain: "D03", source: "docs4/V1/D03-매출관리/매출관리.md", purpose: "잔액 기준 정기 분납 계획을 등록합니다.", components: ["회원", "상품", "선납금", "총 회차"], requiredPermission: "installment" },
  { id: "DLG-S010", title: "세금계산서 상세", domain: "D03", source: "docs4/V1/D03-매출관리/매출관리.md", purpose: "발행된 세금계산서의 공급자·공급받는자·품목 정보를 조회합니다.", components: ["발행 상태", "공급자", "공급받는자", "공급 내역"], requiredPermission: "taxInvoice" },
  { id: "DLG-S011", title: "세금계산서 발행", domain: "D03", source: "docs4/V1/D03-매출관리/매출관리.md", purpose: "선택 매출 건의 공급 품목을 자동 채워 세금계산서를 발행합니다.", components: ["사업자번호", "상호", "이메일", "품목"], requiredPermission: "taxInvoice", policyPending: true },
  { id: "DLG-S012", title: "목표 매출 설정", domain: "D03", source: "docs4/V1/D03-매출관리/매출관리.md", purpose: "월별 또는 기간별 매출 목표를 설정합니다.", components: ["기간", "목표 금액", "기준 유형"], requiredPermission: "targetManage" },
  { id: "DLG-S013", title: "환불 처리", domain: "D03", source: "docs4/V1/D03-매출관리/매출관리.md", purpose: "환불 금액과 사유를 수기 확정하고 완료 또는 승인 요청으로 저장합니다.", components: ["원 매출", "수기 입력", "승인 메모"], requiredPermission: "refundApprove", policyPending: true },
  { id: "DLG-S014", title: "환불 상세 결과", domain: "D03", source: "docs4/V1/D03-매출관리/매출관리.md", purpose: "환불 처리 완료 결과와 쿠폰 복원 상태를 표시합니다.", components: ["환불 번호", "환불 금액", "처리 담당자", "쿠폰 복원"], requiredPermission: "refundApprove" },
  { id: "DLG-S015", title: "환불 요청", domain: "D03", source: "docs4/V1/D03-매출관리/매출관리.md", purpose: "회원 또는 직원이 환불 요청을 접수합니다.", components: ["환불 대상", "요청자", "요청 사유"], requiredPermission: "salesWrite", policyPending: true }
];

const coreScreens: ScreenDefinition[] = [
  {
    id: "SCR-100", title: "로그인", domain: "D01", route: "/login", source: "docs4/V1/D01-공통/공통.md", feature: "AUTH-01",
    purpose: "직원 로그인 계정으로 CRM 시스템에 접속하는 유일한 진입 화면입니다.", tabs: ["직원 로그인", "보안 안내"], metrics: [], filters: ["지점 선택", "역할 선택", "로그인 상태 유지"], tableColumns: [], rows: [], dialogs: ["DLG-000"],
    primaryActions: [{ label: "로그인", permission: undefined }], roleNotes: {}
  },
  {
    id: "SCR-104", title: "알림 센터", domain: "D01", route: "/notifications", source: "docs4/V1/D01-공통/공통.md", feature: "공통 알림",
    purpose: "만료 알림, 수업 취소, 결제 완료 등 주요 운영 이벤트를 시간순으로 확인합니다.", tabs: ["전체", "미읽음", "회원", "매출"],
    metrics: [{ label: "미읽음", value: "14", hint: "상단 배지" }, { label: "오늘 알림", value: "38", hint: "시간순 정렬" }, { label: "처리 필요", value: "6", hint: "운영 바로가기 연결" }, { label: "정책 확인", value: "3", hint: "외부 연동 필요" }],
    filters: ["유형", "읽음 상태", "담당자", "기간"], tableColumns: ["시간", "유형", "내용", "상태", "바로가기"],
    rows: [
      { 시간: "09:10", 유형: "만료", 내용: "박서연 회원권 만료 임박", 상태: "미읽음", 바로가기: "회원 상세" },
      { 시간: "10:24", 유형: "매출", 내용: "PT 20회 결제 완료", 상태: "읽음", 바로가기: "매출 상세" }
    ], dialogs: ["DLG-000"], primaryActions: [{ label: "전체 읽음 처리" }, { label: "세션 만료 테스트", dialogId: "DLG-000" }], roleNotes: {}
  },
  {
    id: "SCR-M001", title: "회원 목록", domain: "D02", route: "/members", source: "docs4/V1/D02-회원관리/회원관리.md", feature: "MBR-01",
    purpose: "회원 원장을 상태, 상품, 저장 뷰, 운영 포커스 기준으로 빠르게 조회하고 일괄 작업합니다.",
    tabs: ["회원 목록", "회원권 목록", "수강권 목록", "락커 목록", "운동복 목록"],
    metrics: [{ label: "전체 회원", value: "3,248", hint: "클릭 시 전체 필터" }, { label: "활성 회원", value: "2,614", hint: "활성 상태" }, { label: "조치 대상", value: "184", hint: "HQ-09 만료 step" }, { label: "이번 달 만료", value: "92", hint: "당월 만료일" }],
    filters: ["전체", "활성", "만료", "예정", "임박", "홀딩", "미등록", "탈퇴", "이름·연락처·운동 ID", "가입경로"], tableColumns: ["이름", "상태", "지점", "담당", "만료일", "미수"], rows: memberRows,
    dialogs: ["DLG-M001", "DLG-M005", "DLG-M022", "DLG-M023"],
    primaryActions: [{ label: "회원 등록" }, { label: "상태 변경", permission: "memberWrite", dialogId: "DLG-M001" }, { label: "수동 출석", permission: "memberWrite", dialogId: "DLG-M022" }, { label: "지점 이관", permission: "transfer", dialogId: "DLG-M023" }],
    roleNotes: { FC: "담당 회원과 상담 저장뷰를 우선 노출합니다.", TRAINER: "체성분·운동 이력 연결 액션을 우선 노출합니다.", HQ_ADMIN: "전 지점 비교 조회 가능, 현장 상태 변경은 제한 표시합니다." }
  },
  {
    id: "SCR-M002", title: "회원 등록", domain: "D02", route: "/members/new", source: "docs4/V1/D02-회원관리/회원관리.md", feature: "MBR-03",
    purpose: "신규 회원 기본 정보와 추가 정보를 단계별로 입력하고 첫 결제 화면으로 연결합니다.", tabs: ["Step 1 기본 정보", "Step 2 추가 정보"],
    metrics: [{ label: "필수 입력", value: "7", hint: "이름·성별·연락처 포함" }, { label: "중복 후보", value: "2", hint: "연락처 기준" }, { label: "동의 항목", value: "3", hint: "광고 수신 등" }, { label: "다음 단계", value: "결제", hint: "SCR-S003 연결" }],
    filters: ["회원구분", "문의 유형", "가입경로", "담당 FC", "담당 트레이너"], tableColumns: ["항목", "입력값", "필수", "상태"], rows: [{ 항목: "연락처", 입력값: "010-1234-5678", 필수: "Y", 상태: "중복 확인 필요" }, { 항목: "주소", 입력값: "서울시 강남구", 필수: "N", 상태: "검색 완료" }],
    dialogs: ["DLG-M006", "DLG-M007", "DLG-M008", "DLG-M027"],
    primaryActions: [{ label: "전화번호 중복 확인", permission: "memberWrite", dialogId: "DLG-M006" }, { label: "주소 검색", permission: "memberWrite", dialogId: "DLG-M027" }, { label: "초기화", dialogId: "DLG-M008" }, { label: "취소", dialogId: "DLG-M007" }],
    roleNotes: { FC: "등록 보조 가능. 최종 결제는 매출 권한 상태로 연결합니다.", STAFF: "등록 화면 접근은 가능하지만 회원 저장은 권한 필요로 표시합니다." }
  },
  {
    id: "SCR-M003", title: "회원 수정", domain: "D02", route: "/members/edit", source: "docs4/V1/D02-회원관리/회원관리.md", feature: "MBR-03",
    purpose: "기존 회원 정보를 등록 화면과 동일한 구조로 수정하고 상세로 복귀합니다.", tabs: ["Step 1 기본 정보", "Step 2 추가 정보", "변경 이력"], metrics: [{ label: "변경 필드", value: "4", hint: "저장 전 검토" }, { label: "연락처", value: "확인됨", hint: "변경 시 재확인" }, { label: "담당자", value: "2명", hint: "FC/트레이너" }, { label: "메모", value: "312/500", hint: "최대 글자" }], filters: ["기본 정보", "관리 정보", "연락 정보", "기타 설정"], tableColumns: ["필드", "기존 값", "변경 값", "상태"], rows: [{ 필드: "담당 FC", "기존 값": "이FC", "변경 값": "최FC", 상태: "변경" }, { 필드: "주소", "기존 값": "서초구", "변경 값": "강남구", 상태: "검토" }], dialogs: ["DLG-M006", "DLG-M007", "DLG-M008", "DLG-M027"], primaryActions: [{ label: "저장", permission: "memberWrite" }, { label: "전화번호 중복 확인", permission: "memberWrite", dialogId: "DLG-M006" }, { label: "주소 검색", permission: "memberWrite", dialogId: "DLG-M027" }, { label: "취소", dialogId: "DLG-M007" }], roleNotes: {}
  },
  {
    id: "SCR-M004", title: "회원 상세", domain: "D02", route: "/members/detail", source: "docs4/V1/D02-회원관리/회원관리.md", feature: "MBR-02",
    purpose: "프로필, 상태 배너, 15개 탭, 계약 카드 보드와 이력 원장을 한 화면에서 확인합니다.", tabs: ["회원정보", "이용권", "출석 이력", "결제 이력", "결제내역", "예약내역", "상세내역", "체성분", "상담·메모", "레슨", "신체정보", "종합평가", "상담이력", "운동프로그램", "운동이력"],
    metrics: [{ label: "활성 상품", value: "3", hint: "이용권/락커/운동복" }, { label: "미수금", value: "120,000원", hint: "결제 처리 필요" }, { label: "최근 방문", value: "12일 전", hint: "이탈 위험" }, { label: "추천 액션", value: "5", hint: "재등록·미수·홀딩" }],
    filters: ["유효한 상품만", "계약 유형", "결제 상태", "상담 기간"], tableColumns: ["계약일", "유형", "계약", "계약금액", "결제금액", "미납", "메모"], rows: [{ 계약일: "2026-05-01", 유형: "회원권", 계약: "3개월", 계약금액: "450,000원", 결제금액: "330,000원", 미납: "120,000원", 메모: "분납 예정" }],
    dialogs: ["DLG-M001", "DLG-M002", "DLG-M003", "DLG-M004", "DLG-M009", "DLG-M010", "DLG-M011", "DLG-M012", "DLG-M013", "DLG-M014", "DLG-M018", "DLG-M019", "DLG-M020", "DLG-M024", "DLG-M026"],
    primaryActions: [{ label: "상태 변경", permission: "memberWrite", dialogId: "DLG-M001" }, { label: "홀딩 등록", permission: "memberWrite", dialogId: "DLG-M003" }, { label: "메모 추가", permission: "memberWrite", dialogId: "DLG-M009" }, { label: "회원 삭제", permission: "dangerMember", dialogId: "DLG-M002", danger: true }],
    roleNotes: { OWNER: "위험 구역과 삭제 버튼이 표시됩니다.", TRAINER: "체성분·운동 이력 탭을 우선 안내합니다.", FC: "상담·메모와 재등록 안내 액션을 우선 노출합니다." }
  },
  {
    id: "SCR-M005", title: "회원 이관", domain: "D02", route: "/members/transfer", source: "docs4/V1/D02-회원관리/회원관리.md", feature: "MBR-ADV-02",
    purpose: "회원 소속 지점을 변경하고 담당자·귀속 필드를 새 지점 기준으로 재배정합니다.", tabs: ["이관 대상", "재배정 표", "확인"], metrics: [{ label: "유지 항목", value: "5", hint: "이력·잔여권리" }, { label: "변경 항목", value: "7", hint: "지점·담당자" }, { label: "대상 지점", value: "3", hint: "현재 지점 제외" }, { label: "승인", value: "필요", hint: "Owner 권한" }], filters: ["현재 소속", "대상 지점", "담당자", "귀속 지점"], tableColumns: ["필드", "현재 값", "이관 후 값", "필수"], rows: [{ 필드: "소속지점", "현재 값": "강남점", "이관 후 값": "서초점", 필수: "Y" }, { 필드: "담당 FC", "현재 값": "이FC", "이관 후 값": "김FC", 필수: "Y" }], dialogs: ["DLG-M023"], primaryActions: [{ label: "이관 확인", permission: "transfer", dialogId: "DLG-M023" }], roleNotes: { OWNER: "이관 확정 가능.", MANAGER: "정보 검토 가능, 확정은 권한 필요." }
  },
  {
    id: "SCR-M006", title: "체성분 관리", domain: "D02", route: "/body-composition", source: "docs4/V1/D02-회원관리/회원관리.md", feature: "MBR-ADV-03",
    purpose: "회원별 체성분 측정 기록과 추이 분석을 조회하고 목표를 관리합니다.", tabs: ["측정 기록", "추이 분석"], metrics: [{ label: "현재 체중", value: "68.4kg", hint: "-1.2kg" }, { label: "골격근량", value: "29.8kg", hint: "+0.5kg" }, { label: "체지방률", value: "21.4%", hint: "-2.1%" }, { label: "BMI", value: "22.8", hint: "정상" }], filters: ["회원 선택", "측정 기간", "수신 상태", "검수 상태"], tableColumns: ["측정일", "체중", "골격근량", "체지방률", "BMI", "입력 경로"], rows: [{ 측정일: "2026-05-28", 체중: "68.4", 골격근량: "29.8", 체지방률: "21.4", BMI: "22.8", "입력 경로": "수동" }], dialogs: ["DLG-M015", "DLG-M016", "DLG-M017"], primaryActions: [{ label: "측정 추가", permission: "bodyWrite", dialogId: "DLG-M015" }, { label: "목표 설정", permission: "bodyWrite", dialogId: "DLG-M017" }, { label: "덮어쓰기 테스트", permission: "bodyWrite", dialogId: "DLG-M016" }], roleNotes: { TRAINER: "측정 추가와 운동 이력 연결 액션을 기본 활성화합니다.", FC: "상담 근거 조회 중심으로 표시합니다." }
  },
  {
    id: "SCR-M007", title: "회원 병합", domain: "D02", route: "/members/merge", source: "docs4/V1/D02-회원관리/회원관리.md", feature: "MBR-EXT-01",
    purpose: "중복 회원 두 계정을 하나의 주 계정으로 병합하고 이력을 이전합니다.", tabs: ["중복 검색", "정보 비교", "병합 항목"], metrics: [{ label: "중복 후보", value: "7", hint: "연락처·생년월일" }, { label: "이관 이력", value: "4종", hint: "출석·결제·상담·체성분" }, { label: "비활성 전환", value: "부 계정", hint: "즉시 삭제 아님" }, { label: "승인", value: "필요", hint: "위험 액션" }], filters: ["이름", "연락처", "생년월일"], tableColumns: ["항목", "주 계정", "부 계정", "채택"], rows: [{ 항목: "연락처", "주 계정": "010-1234-5678", "부 계정": "010-1234-5678", 채택: "주 계정" }], dialogs: ["DLG-M028"], primaryActions: [{ label: "회원 병합 확인", permission: "dangerMember", dialogId: "DLG-M028", danger: true }], roleNotes: { OWNER: "병합 확정 가능.", HQ_ADMIN: "중복 현황 조회 중심으로 표시합니다." }
  },
  {
    id: "SCR-M008", title: "가족 회원", domain: "D02", route: "/members/family", source: "docs4/V1/D02-회원관리/회원관리.md", feature: "MBR-EXT-02", purpose: "가족 그룹을 생성하고 구성원을 연결해 가족 단위 혜택과 결제 현황을 관리합니다.", tabs: ["가족 그룹", "구성원", "혜택"], metrics: [{ label: "가족 그룹", value: "126", hint: "대표 회원 기준" }, { label: "활성 가족", value: "98", hint: "활성 회원 포함" }, { label: "연결 대기", value: "5", hint: "관계 선택 필요" }, { label: "마일리지", value: "통합", hint: "정책 확인" }], filters: ["그룹명", "대표 회원", "관계", "활성 여부"], tableColumns: ["그룹", "대표 회원", "구성원", "활성 회원", "최근 결제"], rows: [{ 그룹: "김씨 가족", "대표 회원": "김민준", 구성원: "3명", "활성 회원": "2명", "최근 결제": "2026-05-28" }], dialogs: ["DLG-M029"], primaryActions: [{ label: "가족 연결", permission: "memberWrite", dialogId: "DLG-M029" }], roleNotes: {}
  },
  {
    id: "SCR-M009", title: "등급 관리", domain: "D02", route: "/members/grade", source: "docs4/V1/D02-회원관리/회원관리.md", feature: "MBR-EXT-03", purpose: "회원 등급 기준과 혜택을 관리하고 수동 등급 변경을 처리합니다.", tabs: ["등급 목록", "기준 설정", "혜택"], metrics: [{ label: "브론즈", value: "1,240", hint: "기본" }, { label: "실버", value: "820", hint: "누적 결제" }, { label: "골드", value: "360", hint: "방문·결제" }, { label: "플래티넘", value: "42", hint: "VIP" }], filters: ["등급", "누적 결제", "방문 횟수", "이용 기간"], tableColumns: ["등급", "기준", "혜택", "회원 수", "상태"], rows: [{ 등급: "골드", 기준: "300만원 이상", 혜택: "마일리지 2%", "회원 수": "360", 상태: "사용" }], dialogs: ["DLG-M030"], primaryActions: [{ label: "등급 변경", permission: "memberWrite", dialogId: "DLG-M030" }], roleNotes: {}
  },
  {
    id: "SCR-M010", title: "세그먼트 관리", domain: "D02", route: "/members/segment", source: "docs4/V1/D02-회원관리/회원관리.md", feature: "MBR-EXT-04", purpose: "자동 7종 세그먼트와 조건 조합 세그먼트로 타겟 운영 대상을 관리합니다.", tabs: ["자동 세그먼트", "사용자 세그먼트", "액션 연결"], metrics: [{ label: "자동 세그먼트", value: "7", hint: "문서 정의" }, { label: "30일 미방문", value: "86", hint: "이탈 위험" }, { label: "신규", value: "52", hint: "첫 결제 30일" }, { label: "만료 step", value: "184", hint: "HQ-09" }], filters: ["방문 공백", "결제일", "만료 step", "담당자"], tableColumns: ["세그먼트", "조건", "대상 수", "최근 갱신", "연결 액션"], rows: [{ 세그먼트: "30일 미방문", 조건: "활성+30일 미출석", "대상 수": "86", "최근 갱신": "오늘 06:00", "연결 액션": "메시지" }], dialogs: ["DLG-M009"], primaryActions: [{ label: "메모/액션 기록", permission: "memberWrite", dialogId: "DLG-M009" }], roleNotes: { FC: "담당 세그먼트 중심으로 필터가 적용됩니다." }
  },
  {
    id: "SCR-S001", title: "매출 현황", domain: "D03", route: "/sales", source: "docs4/V1/D03-매출관리/매출관리.md", feature: "SAL-01", purpose: "일자·지점·상품·수단 기준 매출을 조회하고 하단 요약 바 7종을 확인합니다.", tabs: ["전체", "결제완료", "취소", "환불", "미수"], metrics: [{ label: "총 매출", value: "18,420,000원", hint: "결제완료 기준" }, { label: "환불", value: "620,000원", hint: "차감" }, { label: "미수", value: "1,120,000원", hint: "납입 필요" }, { label: "객단가", value: "342,000원", hint: "건수 기준" }], filters: ["기간", "지점", "상품", "결제수단", "상태"], tableColumns: ["매출번호", "회원", "상품", "금액", "상태", "수단", "귀속"], rows: salesRows, dialogs: ["DLG-S001", "DLG-S005", "DLG-S012"], primaryActions: [{ label: "매출 상세", dialogId: "DLG-S001" }, { label: "메모 편집", permission: "salesWrite", dialogId: "DLG-S005" }, { label: "목표 설정", permission: "targetManage", dialogId: "DLG-S012" }], roleNotes: { HQ_ADMIN: "전 지점 필터가 기본 표시됩니다.", STAFF: "조회와 POS 연결 중심으로 표시됩니다." }
  },
  {
    id: "SCR-S002", title: "POS 판매", domain: "D03", route: "/sales/pos", source: "docs4/V1/D03-매출관리/매출관리.md", feature: "PAY-01", purpose: "현장 상품 선택, 구매자 검색, 결제 확인을 통해 CRM 결제완료를 mock 등록합니다.", tabs: ["상품 선택", "장바구니", "결제"], metrics: [{ label: "장바구니", value: "3개", hint: "상품 라인" }, { label: "합계", value: "1,530,000원", hint: "할인 전" }, { label: "할인", value: "80,000원", hint: "쿠폰 포함" }, { label: "최종", value: "1,450,000원", hint: "강조" }], filters: ["상품 카테고리", "구매자", "결제 수단", "영수증 첨부"], tableColumns: ["상품", "수량", "단가", "할인", "금액"], rows: [{ 상품: "PT 20회", 수량: "1", 단가: "1,200,000원", 할인: "50,000원", 금액: "1,150,000원" }, { 상품: "락커", 수량: "1", 단가: "30,000원", 할인: "0원", 금액: "30,000원" }], dialogs: ["DLG-S002", "DLG-S003", "DLG-S004"], primaryActions: [{ label: "구매자 검색", permission: "salesWrite", dialogId: "DLG-S002" }, { label: "결제 확인", permission: "salesWrite", dialogId: "DLG-S003" }, { label: "중복 결제 경고", permission: "salesWrite", dialogId: "DLG-S004" }], roleNotes: { STAFF: "기본 활성 화면입니다.", FC: "담당 회원 결제 안내 중심으로 사용합니다." }
  },
  {
    id: "SCR-S003", title: "결제 처리", domain: "D03", route: "/sales/payment", source: "docs4/V1/D03-매출관리/매출관리.md", feature: "PAY-01", purpose: "회원 등록 또는 POS에서 이어진 결제 정보를 확인하고 외부 수납 완료 건을 CRM에 기록합니다.", tabs: ["구매자", "상품", "수납", "완료"], metrics: [{ label: "오늘 수납", value: "450,000원", hint: "계약금" }, { label: "잔액", value: "750,000원", hint: "할부/미수" }, { label: "결제수단", value: "복합", hint: "카드+현금" }, { label: "외부 POS", value: "필요", hint: "연동 제외" }], filters: ["회원", "상품", "수납 유형", "귀속 지점"], tableColumns: ["항목", "금액", "수단", "귀속", "상태"], rows: [{ 항목: "계약금", 금액: "450,000원", 수단: "카드", 귀속: "강남점", 상태: "수납 완료" }], dialogs: ["DLG-S002", "DLG-S003", "DLG-S004", "DLG-S009"], primaryActions: [{ label: "구매자 검색", permission: "salesWrite", dialogId: "DLG-S002" }, { label: "결제 확인", permission: "salesWrite", dialogId: "DLG-S003" }, { label: "할부 등록", permission: "installment", dialogId: "DLG-S009" }], roleNotes: {}
  },
  {
    id: "SCR-S004", title: "매출 통계", domain: "D03", route: "/sales/stats", source: "docs4/V1/D03-매출관리/매출관리.md", feature: "SAL-02", purpose: "기간별·상품별·직원별 매출 통계를 표와 간이 차트로 확인합니다.", tabs: ["일별", "월별", "상품별", "직원별"], metrics: [{ label: "전월 대비", value: "+12.4%", hint: "증감" }, { label: "PT 매출", value: "8,900만원", hint: "상품별 1위" }, { label: "회원권", value: "6,200만원", hint: "상품별 2위" }, { label: "목표 달성", value: "78%", hint: "월간" }], filters: ["기간", "지점", "상품", "직원"], tableColumns: ["구분", "매출", "건수", "환불", "순매출"], rows: [{ 구분: "PT", 매출: "8,900만원", 건수: "74", 환불: "40만원", 순매출: "8,860만원" }], dialogs: ["DLG-S012"], primaryActions: [{ label: "목표 매출 설정", permission: "targetManage", dialogId: "DLG-S012" }], roleNotes: { HQ_ADMIN: "지점 비교 통계가 활성화됩니다." }
  },
  {
    id: "SCR-S005", title: "통계 관리", domain: "D03", route: "/sales/statistics-admin", source: "docs4/V1/D03-매출관리/매출관리.md", feature: "SAL-02", purpose: "통계 기준과 집계 상태를 관리합니다. 자동 산식은 정책 확인 필요로 표시합니다.", tabs: ["집계 현황", "기준 관리", "오류"], metrics: [{ label: "집계 성공", value: "98.7%", hint: "최근 24h" }, { label: "오류", value: "3", hint: "검토 필요" }, { label: "정책 보류", value: "5", hint: "산식 미확정" }, { label: "마지막 집계", value: "06:00", hint: "자동화" }], filters: ["집계일", "상태", "지점", "정책 여부"], tableColumns: ["집계 항목", "상태", "최근 실행", "오류", "정책"], rows: [{ "집계 항목": "환불 차감", 상태: "보류", "최근 실행": "-", 오류: "없음", 정책: "확인 필요" }], dialogs: ["DLG-S012"], primaryActions: [{ label: "목표 기준 설정", permission: "targetManage", dialogId: "DLG-S012", policyPending: true }], roleNotes: { HQ_ADMIN: "정책 확인 항목을 우선 노출합니다." }, policyPending: true
  },
  {
    id: "SCR-S006", title: "선수익금 조회", domain: "D03", route: "/sales/deferred-revenue", source: "docs4/V1/D03-매출관리/매출관리.md", feature: "SAL-EXT", purpose: "선수익금 대상 계약과 기간 배분 상태를 조회합니다.", tabs: ["계약별", "월별 인식", "정책 확인"], metrics: [{ label: "선수익금", value: "32,400,000원", hint: "잔여" }, { label: "이번 달 인식", value: "4,800,000원", hint: "예정" }, { label: "대상 계약", value: "74", hint: "기간권" }, { label: "보류", value: "정책", hint: "산식 확인" }], filters: ["계약 기간", "상품", "지점", "인식 상태"], tableColumns: ["계약", "회원", "총액", "인식액", "잔액", "상태"], rows: [{ 계약: "3개월 회원권", 회원: "박서연", 총액: "450,000원", 인식액: "150,000원", 잔액: "300,000원", 상태: "인식중" }], dialogs: ["DLG-S001"], primaryActions: [{ label: "원 매출 상세", dialogId: "DLG-S001" }], roleNotes: { HQ_ADMIN: "전체 지점 재무 조회 중심으로 표시합니다." }, policyPending: true
  },
  {
    id: "SCR-S007", title: "환불 관리", domain: "D03", route: "/sales/refunds", source: "docs4/V1/D03-매출관리/매출관리.md", feature: "PAY-02", purpose: "환불 요청, 승인대기, 완료 건을 관리하고 외부 처리 필요 상태를 추적합니다.", tabs: ["요청", "승인대기", "완료", "반려"], metrics: [{ label: "요청", value: "9", hint: "신규" }, { label: "승인대기", value: "4", hint: "Owner 필요" }, { label: "완료", value: "18", hint: "이번 달" }, { label: "정책 수기", value: "100%", hint: "산식 미확정" }], filters: ["상태", "요청자", "승인자", "기간"], tableColumns: ["환불번호", "회원", "원매출", "요청금액", "상태", "승인자"], rows: [{ 환불번호: "R-001", 회원: "정하준", 원매출: "S-260527-003", 요청금액: "30,000원", 상태: "승인대기", 승인자: "Owner" }], dialogs: ["DLG-S006", "DLG-S013", "DLG-S014", "DLG-S015"], primaryActions: [{ label: "환불 요청", permission: "salesWrite", dialogId: "DLG-S015" }, { label: "환불 처리", permission: "refundApprove", dialogId: "DLG-S013", policyPending: true }, { label: "환불 상세", dialogId: "DLG-S006" }], roleNotes: { OWNER: "환불 승인/완료 가능.", MANAGER: "승인 요청까지만 가능합니다.", STAFF: "요청 접수 중심으로 제한됩니다." }, policyPending: true
  },
  {
    id: "SCR-S008", title: "미수금 관리", domain: "D03", route: "/sales/receivables", source: "docs4/V1/D03-매출관리/매출관리.md", feature: "PAY-03", purpose: "미납 잔액과 납입 예정 건을 조회하고 수납 완료를 기록합니다.", tabs: ["전체", "미납", "부분납", "완료"], metrics: [{ label: "미수 총액", value: "1,120,000원", hint: "현재" }, { label: "대상 회원", value: "14", hint: "연락 필요" }, { label: "오늘 납입", value: "3", hint: "예정" }, { label: "연체", value: "2", hint: "주의" }], filters: ["회원", "상품", "예정일", "담당자"], tableColumns: ["회원", "상품", "미수금", "예정일", "상태", "담당"], rows: [{ 회원: "박서연", 상품: "회원권 3개월", 미수금: "120,000원", 예정일: "2026-05-30", 상태: "부분납", 담당: "최매니저" }], dialogs: ["DLG-S008", "DLG-S005"], primaryActions: [{ label: "납입 처리", permission: "installment", dialogId: "DLG-S008" }, { label: "메모 편집", permission: "salesWrite", dialogId: "DLG-S005" }], roleNotes: { MANAGER: "납입 처리 가능.", FC: "담당 회원 안내와 메모 중심입니다." }
  },
  {
    id: "SCR-S009", title: "할부결제 관리", domain: "D03", route: "/sales/installments", source: "docs4/V1/D03-매출관리/매출관리.md", feature: "SAL-EXT-01", purpose: "할부 계약 목록 11개 컬럼과 회차별 납입 상태를 관리합니다.", tabs: ["전체", "정상", "미납", "완납", "해지"], metrics: [{ label: "할부 계약", value: "46", hint: "활성" }, { label: "미납 회차", value: "8", hint: "처리 필요" }, { label: "이번 달 예정", value: "18", hint: "납입" }, { label: "완납", value: "12", hint: "이번 달" }], filters: ["상태", "계약 출처", "납입 예정일", "담당자"], tableColumns: ["할부번호", "회원", "상품", "총액", "납입", "잔액", "다음 예정", "상태"], rows: [{ 할부번호: "I-001", 회원: "오지우", 상품: "할부 회원권", 총액: "900,000원", 납입: "300,000원", 잔액: "600,000원", "다음 예정": "2026-06-01", 상태: "정상" }], dialogs: ["DLG-S007", "DLG-S008", "DLG-S009"], primaryActions: [{ label: "할부 상세", permission: "installment", dialogId: "DLG-S007" }, { label: "납입 처리", permission: "installment", dialogId: "DLG-S008" }, { label: "할부 등록", permission: "installment", dialogId: "DLG-S009" }], roleNotes: { MANAGER: "납입 처리 가능.", OWNER: "계약 조정까지 가능." }
  },
  {
    id: "SCR-S010", title: "세금계산서 발행", domain: "D03", route: "/sales/tax-invoice", source: "docs4/V1/D03-매출관리/매출관리.md", feature: "SAL-EXT-02", purpose: "법인 결제 건의 공급 품목을 확인하고 세금계산서 발행 이력을 관리합니다.", tabs: ["발행 대상", "발행 이력", "오류"], metrics: [{ label: "발행 대상", value: "12", hint: "법인 결제" }, { label: "발행 완료", value: "34", hint: "이번 달" }, { label: "전송 오류", value: "2", hint: "확인" }, { label: "외부 연동", value: "필요", hint: "실제 발행 제외" }], filters: ["상태", "법인", "발행일", "이메일"], tableColumns: ["발행일", "공급받는 자", "공급가액", "부가세", "합계", "상태", "액션"], rows: [{ 발행일: "2026-05-28", "공급받는 자": "판도헬스 법인", 공급가액: "1,000,000원", 부가세: "100,000원", 합계: "1,100,000원", 상태: "발행 완료", 액션: "상세" }], dialogs: ["DLG-S010", "DLG-S011"], primaryActions: [{ label: "세금계산서 상세", permission: "taxInvoice", dialogId: "DLG-S010" }, { label: "세금계산서 발행", permission: "taxInvoice", dialogId: "DLG-S011", policyPending: true }], roleNotes: { HQ_ADMIN: "정책·외부연동 확인 배지를 표시합니다.", OWNER: "지점 법인 발행 건 조회와 mock 발행 가능." }, policyPending: true
  },
  {
    id: "SCR-S011", title: "매출 예측", domain: "D03", route: "/sales/forecast", source: "docs4/V1/D03-매출관리/매출관리.md", feature: "V1 보조", purpose: "과거 매출 기반 예측과 목표 대비 달성률을 확인합니다. 예측 산식은 mock입니다.", tabs: ["다음 달", "다음 분기", "연간"], metrics: [{ label: "예측 매출", value: "42,000,000원", hint: "mock" }, { label: "목표 달성률", value: "82%", hint: "게이지" }, { label: "전월 대비", value: "+6.5%", hint: "예측" }, { label: "분기 누적", value: "98,000,000원", hint: "현재" }], filters: ["예측 기간", "상품", "지점", "목표 기준"], tableColumns: ["월", "예측 매출", "목표", "달성률", "전년동기"], rows: [{ 월: "2026-06", "예측 매출": "42,000,000원", 목표: "51,000,000원", 달성률: "82%", 전년동기: "+9%" }], dialogs: ["DLG-S012"], primaryActions: [{ label: "목표 매출 설정", permission: "targetManage", dialogId: "DLG-S012" }], roleNotes: { OWNER: "목표 수정 가능.", HQ_ADMIN: "전 지점 예측 비교 중심입니다." }, policyPending: true
  },
  {
    id: "SCR-S012", title: "결제 취소 / 부분 환불", domain: "D03", route: "/sales/refund-partial", source: "docs4/V1/D03-매출관리/매출관리.md", feature: "SAL-EXT-04", purpose: "환불 자동 계산 산식 확정 전까지 수기 입력 방식으로 취소·부분 환불을 기록합니다.", tabs: ["결제 검색", "환불 수기 입력", "승인 상태", "처리 이력"], metrics: [{ label: "원결제", value: "1,200,000원", hint: "읽기 전용" }, { label: "기사용 차감", value: "수기", hint: "정책 확인" }, { label: "최종 환불", value: "입력", hint: "운영 판단" }, { label: "승인", value: "Owner", hint: "권한 필요" }], filters: ["회원명", "상품명", "결제일", "승인 상태"], tableColumns: ["항목", "금액", "입력자", "정책", "상태"], rows: [{ 항목: "기사용 차감금", 금액: "120,000원", 입력자: "최매니저", 정책: "확인 필요", 상태: "승인대기" }], dialogs: ["DLG-S013", "DLG-S014", "DLG-S015"], primaryActions: [{ label: "환불 요청", permission: "salesWrite", dialogId: "DLG-S015" }, { label: "환불 처리", permission: "refundApprove", dialogId: "DLG-S013", policyPending: true }, { label: "결과 보기", permission: "refundApprove", dialogId: "DLG-S014" }], roleNotes: { OWNER: "환불 완료 가능.", MANAGER: "승인대기 저장만 가능합니다." }, policyPending: true
  }
];

export const dialogs = [...coreDialogs, ...extraDialogs];
export const screens = [...coreScreens, ...extraScreens];

const domainLabels: Record<DomainId, string> = {
  D01: "공통", D02: "회원관리", D03: "매출관리", D04: "수업관리", D05: "상품관리", D06: "시설관리", D07: "직원관리", D08: "마케팅", D09: "설정관리", D10: "본사관리", D11: "통합운영"
};

export const menuGroups = (Object.keys(domainLabels) as DomainId[]).map((domain) => ({
  label: domainLabels[domain],
  items: screens.filter((screen) => screen.domain === domain)
}));

export const routeToScreen = new Map(screens.map((screen) => [screen.route, screen]));
export const dialogById = new Map(dialogs.map((dialog) => [dialog.id, dialog]));
export const roleById = new Map(roles.map((role) => [role.id, role]));

export function hasPermission(roleId: RoleId, permission?: PermissionKey) {
  if (!permission) return true;
  return roleById.get(roleId)?.permissions.includes(permission) ?? false;
}
