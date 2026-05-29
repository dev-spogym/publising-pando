import { d01v2Dialogs, d01v2Screens } from "./domains/d01v2";
import { d04Dialogs, d04Screens } from "./domains/d04";
import { d05Dialogs, d05Screens } from "./domains/d05";
import { d06Dialogs, d06Screens } from "./domains/d06";
import { d07Dialogs, d07Screens } from "./domains/d07";
import { d08Dialogs, d08Screens } from "./domains/d08";
import { d09Dialogs, d09Screens } from "./domains/d09";
import { d10Dialogs, d10Screens } from "./domains/d10";
import { d11Dialogs, d11Screens } from "./domains/d11";
import { publishingScreens, publishingDialogs, type PublishingSource } from "./docs4-sources";

export type RoleId = "HQ_ADMIN" | "OWNER" | "MANAGER" | "FC" | "TRAINER" | "STAFF";
export type DomainId = "D01" | "D02" | "D03" | "D04" | "D05" | "D06" | "D07" | "D08" | "D09" | "D10" | "D11";
export type PermissionKey = "viewAllBranches" | "memberWrite" | "dangerMember" | "transfer" | "bodyWrite" | "salesWrite" | "refundApprove" | "installment" | "taxInvoice" | "targetManage";

export type SourceMatrix = {
  v1?: PublishingSource;
  v2?: PublishingSource;
};

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
  sources?: SourceMatrix;
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
  sources?: SourceMatrix;
};

export const roles: { id: RoleId; label: string; branchScope: string; description: string; permissions: PermissionKey[] }[] = [
  { id: "HQ_ADMIN", label: "본사 관리자", branchScope: "전 지점", description: "통합 조회·정책 확인·지점 비교 중심. 현장 처리 액션은 검수용 mock으로 제한 표시합니다.", permissions: ["viewAllBranches", "taxInvoice", "targetManage"] },
  { id: "OWNER", label: "지점장 / Owner", branchScope: "선택 지점", description: "회원 위험 액션, 환불 승인, 이관, 목표 설정까지 가능한 최종 책임자 역할입니다.", permissions: ["memberWrite", "dangerMember", "transfer", "bodyWrite", "salesWrite", "refundApprove", "installment", "taxInvoice", "targetManage"] },
  { id: "MANAGER", label: "매니저", branchScope: "선택 지점", description: "상태 변경, 납입 처리, 운영 저장뷰 관리가 가능한 중간 관리자입니다.", permissions: ["memberWrite", "bodyWrite", "salesWrite", "installment"] },
  { id: "FC", label: "FC", branchScope: "담당 회원", description: "담당 회원 상담, 등록 보조, 결제 안내 중심. 삭제·환불 승인·이관은 제한됩니다.", permissions: ["memberWrite", "salesWrite"] },
  { id: "TRAINER", label: "트레이너", branchScope: "담당 회원", description: "체성분, 목표, 운동 이력 입력 중심. 매출 위험 액션은 제한됩니다.", permissions: ["bodyWrite"] },
  { id: "STAFF", label: "일반 직원", branchScope: "선택 지점", description: "조회, POS 판매, 기본 접수 중심. 승인성 액션은 권한 필요 상태로 표시합니다.", permissions: ["salesWrite"] }
];

export const branches = ["강남점", "광화문 본점", "서초점", "잠실점", "판교점", "여의도점", "마포점", "송도점", "부산 센텀점", "대구 수성점", "본사 통합"];

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
  { id: "DLG-S015", title: "환불 요청", domain: "D03", source: "docs4/V1/D03-매출관리/매출관리.md", purpose: "회원 또는 직원이 환불 요청을 접수합니다.", components: ["환불 대상", "요청자", "요청 사유"], requiredPermission: "salesWrite", policyPending: true },
  { id: "DLG-S016", title: "결제링크 발송", domain: "D03", source: "docs4/V2/D03-매출관리/매출관리.md:1336", purpose: "미수금 또는 결제 대기 건에 대해 결제링크를 SMS/카카오로 발송(V2 신규). 결제링크 발송만 된 건은 미수금 원장에 포함되지 않으며, 실제 결제 완료 시점에 매출/할부/미수금으로 분기.", components: ["수신자 회원", "결제 금액", "발송 채널(SMS/카톡)", "메시지 템플릿", "유효기간(기본 3일)"], requiredPermission: "salesWrite", policyPending: true }
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
    id: "SCR-DLG", title: "DLG 컴포넌트 갤러리", domain: "D01", route: "/dialogs", source: "docs4/V1/D01~D03", feature: "DLG-COMPONENTS",
    purpose: "D01 공통, D02 회원관리, D03 매출관리의 연결 다이얼로그를 컴포넌트 단위로 검수하고 퍼블리싱 인수 기준을 확인합니다.", tabs: ["D01 공통", "D02 회원관리", "D03 매출관리"],
    metrics: [{ label: "D02 DLG", value: "28", hint: "회원관리" }, { label: "D03 DLG", value: "15", hint: "매출관리" }, { label: "정책 보류", value: "표시", hint: "임의 확정 없음" }, { label: "API", value: "없음", hint: "mock/local" }],
    filters: ["도메인", "정책 확인", "권한", "처리 유형"], tableColumns: ["DLG", "제목", "권한", "상태"], rows: [], dialogs: [],
    primaryActions: [], roleNotes: {}
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
    id: "SCR-M003", title: "회원 수정", domain: "D02", route: "/members/edit", source: "docs4/V1/D02-회원관리/회원관리.md:265", feature: "MBR-03",
    purpose: "이미 등록된 회원 정보를 등록 화면(SCR-M002)과 동일한 2단계 구조로 수정합니다. 기존 데이터가 자동으로 채워진 상태에서 시작하며, 저장 후 회원 상세(SCR-M004)로 복귀합니다.",
    tabs: ["Step 1 기본 인적/관리 정보", "Step 2 추가 연락/기타 설정"],
    metrics: [{ label: "필수 입력", value: "7", hint: "이름·성별·연락처·회원구분·생년월일·키·소속지점" }, { label: "변경 감지", value: "동시 편집 충돌(409)", hint: "다른 운영자 편집 시 새로고침" }, { label: "이미지 한도", value: "5MB", hint: "EXIF GPS 자동 제거" }, { label: "메모", value: "500자", hint: "주민번호 패턴 차단" }],
    filters: ["Step 1 기본 인적", "Step 1 관리 정보", "Step 2 추가 연락", "Step 2 기타 설정"],
    tableColumns: ["필드", "기존 값", "변경 값", "상태"],
    rows: [{ 필드: "담당 FC", "기존 값": "이FC", "변경 값": "최FC", 상태: "변경" }, { 필드: "주소", "기존 값": "서초구", "변경 값": "강남구", 상태: "검토" }],
    dialogs: ["DLG-M006", "DLG-M007", "DLG-M008", "DLG-M027"],
    primaryActions: [{ label: "저장", permission: "memberWrite" }, { label: "전화번호 중복 확인", permission: "memberWrite", dialogId: "DLG-M006" }, { label: "주소 검색", permission: "memberWrite", dialogId: "DLG-M027" }, { label: "초기화", permission: "memberWrite", dialogId: "DLG-M008" }, { label: "취소(이탈 확인)", dialogId: "DLG-M007" }],
    roleNotes: { OWNER: "회원 정보 수정 완전 접근.", MANAGER: "회원 정보 수정 완전 접근.", STAFF: "회원 정보 수정 완전 접근.", FC: "접근 불가 - 담당 회원이라도 수정 불가.", TRAINER: "접근 불가." }
  },
  {
    id: "SCR-M004", title: "회원 상세", domain: "D02", route: "/members/detail", source: "docs4/V1/D02-회원관리/회원관리.md", feature: "MBR-02",
    purpose: "프로필, 상태 배너, 15개 탭, 계약 카드 보드와 이력 원장을 한 화면에서 확인합니다.", tabs: ["회원정보", "이용권", "출석 이력", "결제 이력", "결제내역", "예약내역", "상세내역", "체성분", "상담·메모", "레슨", "신체정보", "종합평가", "상담이력", "운동프로그램", "운동이력"],
    metrics: [{ label: "활성 상품", value: "3", hint: "이용권/락커/운동복" }, { label: "미수금", value: "120,000원", hint: "결제 처리 필요" }, { label: "최근 방문", value: "12일 전", hint: "이탈 위험" }, { label: "추천 액션", value: "5", hint: "재등록·미수·홀딩" }],
    filters: ["유효한 상품만", "계약 유형", "결제 상태", "상담 기간"], tableColumns: ["계약일", "유형", "계약", "계약금액", "결제금액", "미납", "메모"], rows: [{ 계약일: "2026-05-01", 유형: "회원권", 계약: "3개월", 계약금액: "450,000원", 결제금액: "330,000원", 미납: "120,000원", 메모: "분납 예정" }],
    dialogs: ["DLG-M001", "DLG-M002", "DLG-M003", "DLG-M004", "DLG-M009", "DLG-M010", "DLG-M011", "DLG-M012", "DLG-M013", "DLG-M014", "DLG-M018", "DLG-M019", "DLG-M020", "DLG-M024", "DLG-M026", "DLG-003"],
    primaryActions: [{ label: "상태 변경", permission: "memberWrite", dialogId: "DLG-M001" }, { label: "홀딩 등록", permission: "memberWrite", dialogId: "DLG-M003" }, { label: "메모 추가", permission: "memberWrite", dialogId: "DLG-M009" }, { label: "회원 삭제", permission: "dangerMember", dialogId: "DLG-M002", danger: true }],
    roleNotes: { OWNER: "위험 구역과 삭제 버튼이 표시됩니다.", TRAINER: "체성분·운동 이력 탭을 우선 안내합니다.", FC: "상담·메모와 재등록 안내 액션을 우선 노출합니다." }
  },
  {
    id: "SCR-M005", title: "회원 이관", domain: "D02", route: "/members/transfer", source: "docs4/V1/D02-회원관리/회원관리.md:434", feature: "MBR-ADV-02",
    purpose: "특정 회원을 현재 소속 지점에서 다른 지점으로 이관합니다. 기존 이용권·이력 데이터는 그대로 유지된 채 소속만 변경되고, 귀속 필드(담당 FC/트레이너/매출/정산/인센티브)는 새 지점 기준으로 재배정합니다.",
    tabs: ["이관 대상 정보", "귀속 재배정 표", "이관 사유 + 최종 확인"],
    metrics: [{ label: "유지 항목", value: "5종", hint: "이용권 잔여·결제·출석·상담·메모" }, { label: "재배정 필드", value: "7", hint: "소속/이용/담당/귀속/인센티브" }, { label: "차단 조건", value: "미납·락커·만료", hint: "block 상태 영구 비활성" }, { label: "예외 상품", value: "법인·홈오피스·통합", hint: "정산 지점 정책 점검" }],
    filters: ["회원 검색", "대상 지점", "예외 상품 여부", "차단 조건"],
    tableColumns: ["필드", "현재 값", "이관 후 값", "필수"],
    rows: [
      { 필드: "소속지점", "현재 값": "강남점", "이관 후 값": "서초점", 필수: "Y" },
      { 필드: "기본 이용지점", "현재 값": "강남점", "이관 후 값": "서초점", 필수: "Y" },
      { 필드: "기본 매출 귀속 지점", "현재 값": "강남점", "이관 후 값": "서초점", 필수: "Y" },
      { 필드: "정산 지점 기본값", "현재 값": "강남점", "이관 후 값": "서초점", 필수: "Y" },
      { 필드: "담당 상담자(FC)", "현재 값": "이FC", "이관 후 값": "김FC", 필수: "Y" },
      { 필드: "담당 트레이너", "현재 값": "박트레이너", "이관 후 값": "정트레이너", 필수: "Y" },
      { 필드: "인센티브 귀속자", "현재 값": "이FC", "이관 후 값": "김FC", 필수: "Y" }
    ],
    dialogs: ["DLG-M023"],
    primaryActions: [{ label: "이관 확인", permission: "transfer", dialogId: "DLG-M023" }, { label: "예외 상품 정책 점검", permission: "transfer" }],
    roleNotes: { OWNER: "소속 브랜드 내 지점 목록 이관 처리 가능.", HQ_ADMIN: "전체 지점 목록 선택 가능, 통합 모드에서도 회원 실제 소속 지점 기준 처리.", MANAGER: "접근 불가 - 이 기능 사용 불가.", FC: "접근 불가.", TRAINER: "접근 불가.", STAFF: "접근 불가." }
  },
  {
    id: "SCR-M006", title: "체성분 관리", domain: "D02", route: "/body-composition", source: "docs4/V1/D02-회원관리/회원관리.md:545", feature: "MBR-ADV-03",
    purpose: "특정 회원의 체성분(체중·골격근량·체지방률·BMI·기초대사량) 변화 추이를 시계열 그래프와 측정 기록 표로 시각화합니다. InBody 장비 연동 자동 수집과 수동 입력을 모두 지원합니다. 동일 route는 D11 SCR-I006(체성분 통합)과 공유 - 본 화면은 회원 개인별 추이, D11은 전 지점 수신/검수.",
    tabs: ["측정 기록", "추이 분석"],
    metrics: [{ label: "현재 체중", value: "68.4kg", hint: "직전 대비 변화" }, { label: "골격근량", value: "29.8kg", hint: "직전 대비 변화" }, { label: "체지방률", value: "21.4%", hint: "직전 대비 변화" }, { label: "BMI", value: "22.8", hint: "키 미등록 시 미계산" }],
    filters: ["회원 선택(드롭다운)", "그래프 지표 토글(체중/골격근량/체지방률)", "측정 기간"],
    tableColumns: ["날짜", "체중", "골격근량", "체지방률", "BMI", "기초대사량", "체수분", "수정·삭제"],
    rows: [
      { 날짜: "2026-05-28", 체중: "68.4kg", 골격근량: "29.8kg", 체지방률: "21.4%", BMI: "22.8", 기초대사량: "1,520kcal", 체수분: "42.6L", "수정·삭제": "본인 24h내" },
      { 날짜: "2026-05-21", 체중: "69.1kg", 골격근량: "29.4kg", 체지방률: "22.3%", BMI: "23.0", 기초대사량: "1,510kcal", 체수분: "42.1L", "수정·삭제": "-" }
    ],
    dialogs: ["DLG-M015", "DLG-M016", "DLG-M017"],
    primaryActions: [{ label: "측정 추가", permission: "bodyWrite", dialogId: "DLG-M015" }, { label: "목표 설정", permission: "bodyWrite", dialogId: "DLG-M017" }, { label: "동일 일자 덮어쓰기", permission: "bodyWrite", dialogId: "DLG-M016" }, { label: "CSV 내보내기", permission: "bodyWrite" }],
    roleNotes: { OWNER: "소속 지점 회원 측정 추가·수정·삭제·CSV (V2).", MANAGER: "소속 지점 회원 측정 추가·수정·삭제·CSV (V2).", FC: "소속 지점 회원 (담당 회원 기본), 본인 등록 24시간 내 수정 가능. 삭제/CSV 불가.", TRAINER: "담당 회원만, 본인 등록 24시간 내 수정 가능.", STAFF: "접근 불가." }
  },
  {
    id: "SCR-M007", title: "회원 병합", domain: "D02", route: "/members/merge", source: "docs4/V1/D02-회원관리/회원관리.md:658", feature: "MBR-EXT-01",
    purpose: "동일인으로 판단되는 중복 회원 계정 두 개를 하나로 합칩니다. 출석·결제·상담·체성분 이력은 주 계정으로 이전되고 부 계정은 병합 후 비활성 상태로 전환됩니다(즉시 삭제 아님).",
    tabs: ["중복 회원 검색", "주/부 계정 정보 비교", "병합 항목 선택"],
    metrics: [{ label: "이관 이력", value: "4종", hint: "출석·결제·상담·체성분" }, { label: "처리 후 부계정", value: "비활성", hint: "90일 PII 마스킹" }, { label: "취소 시간", value: "5분", hint: "경과 후 불가" }, { label: "확인", value: "병합 텍스트 입력", hint: "오타 시 비활성" }],
    filters: ["이름", "연락처", "생년월일"],
    tableColumns: ["항목", "주 계정", "부 계정", "채택"],
    rows: [
      { 항목: "이름", "주 계정": "김민준", "부 계정": "김민준", 채택: "주 계정" },
      { 항목: "연락처", "주 계정": "010-1234-5678", "부 계정": "010-9876-5432", 채택: "주 계정" },
      { 항목: "프로필 사진", "주 계정": "최신", "부 계정": "구형", 채택: "주 계정" },
      { 항목: "이용권", "주 계정": "PT 20회", "부 계정": "회원권 3개월", 채택: "합산 이전" }
    ],
    dialogs: ["DLG-M028"],
    primaryActions: [{ label: "회원 병합 확인", permission: "dangerMember", dialogId: "DLG-M028", danger: true }],
    roleNotes: { OWNER: "소속 지점 내 회원 병합 가능.", HQ_ADMIN: "전체 회원 병합 가능(지점 간 포함).", MANAGER: "접근 불가.", FC: "접근 불가.", TRAINER: "접근 불가.", STAFF: "접근 불가." }
  },
  {
    id: "SCR-M008", title: "가족 회원", domain: "D02", route: "/members/family", source: "docs4/V1/D02-회원관리/회원관리.md:741", feature: "MBR-EXT-02",
    purpose: "동일 가족 구성원을 서로 연결하여 가족 단위로 관리합니다. 패밀리 이용권 혜택, 가족 단위 결제 현황, 가족 묶음 마케팅을 지원합니다. 그룹 정원 10명 한도, 무기명 법인 가입 불가.",
    tabs: ["가족 그룹 목록", "구성원 상세(클릭 시)", "가족 단위 요약"],
    metrics: [{ label: "가족 그룹", value: "126", hint: "대표 회원 기준" }, { label: "활성 가족", value: "98", hint: "활성 회원 포함" }, { label: "그룹 정원", value: "10명", hint: "한도" }, { label: "마일리지 합산", value: "테넌트 정책", hint: "비활성 시 카드 hidden" }],
    filters: ["그룹명", "대표 회원", "구성원 관계", "활성 여부"],
    tableColumns: ["이름", "관계", "이용권 상태", "최근 방문일"],
    rows: [
      { 이름: "김민준(대표)", 관계: "본인", "이용권 상태": "활성·PT 20회", "최근 방문일": "오늘 09:20" },
      { 이름: "김지우", 관계: "자녀", "이용권 상태": "활성·키즈권", "최근 방문일": "2026-05-26" },
      { 이름: "박서연", 관계: "배우자", "이용권 상태": "임박·D-3", "최근 방문일": "2026-05-21" }
    ],
    dialogs: ["DLG-M029"],
    primaryActions: [{ label: "새 그룹 만들기", permission: "memberWrite" }, { label: "가족 연결(구성원 추가)", permission: "memberWrite", dialogId: "DLG-M029" }, { label: "구성원 제거", permission: "memberWrite" }, { label: "그룹 삭제", permission: "memberWrite", danger: true }],
    roleNotes: { OWNER: "그룹 생성·수정·삭제, 구성원 추가·제거.", MANAGER: "구성원 추가·제거.", FC: "담당 회원 포함 가족 그룹 조회만.", TRAINER: "접근 불가 또는 조회만.", STAFF: "접근 불가 또는 조회만." }
  },
  {
    id: "SCR-M009", title: "등급 관리", domain: "D02", route: "/members/grade", source: "docs4/V1/D02-회원관리/회원관리.md", feature: "MBR-EXT-03", purpose: "회원 등급 기준과 혜택을 관리하고 수동 등급 변경을 처리합니다.", tabs: ["등급 목록", "기준 설정", "혜택"], metrics: [{ label: "브론즈", value: "1,240", hint: "기본" }, { label: "실버", value: "820", hint: "누적 결제" }, { label: "골드", value: "360", hint: "방문·결제" }, { label: "플래티넘", value: "42", hint: "VIP" }], filters: ["등급", "누적 결제", "방문 횟수", "이용 기간"], tableColumns: ["등급", "기준", "혜택", "회원 수", "상태"], rows: [{ 등급: "골드", 기준: "300만원 이상", 혜택: "마일리지 2%", "회원 수": "360", 상태: "사용" }], dialogs: ["DLG-M030"], primaryActions: [{ label: "등급 변경", permission: "memberWrite", dialogId: "DLG-M030" }], roleNotes: {}
  },
  {
    id: "SCR-M010", title: "세그먼트 관리", domain: "D02", route: "/members/segment", source: "docs4/V1/D02-회원관리/회원관리.md:955", feature: "MBR-EXT-04",
    purpose: "공통 특성·행동 패턴을 가진 회원을 그룹(세그먼트)으로 묶어 타겟 마케팅과 맞춤 관리에 활용합니다. 시스템 정의 자동 7종(신규/만료후미등록/이탈위험/만료임박/관심필요/충성/활발)과 운영자 정의 커스텀 세그먼트로 구성됩니다. 자동 7종은 매일 04:00 재계산.",
    tabs: ["자동 7종 세그먼트", "사용자 정의 세그먼트", "조건 빌더", "회원 보기 모달"],
    metrics: [{ label: "신규", value: "52", hint: "첫 정상 결제 +30일" }, { label: "이탈위험", value: "86", hint: "활성·30일 미방문" }, { label: "만료임박", value: "184", hint: "HQ-09 본사 step" }, { label: "충성", value: "42", hint: "보조 라벨 중복 가능" }],
    filters: ["회원 상태 + 정지 플래그", "최근 방문일(키오스크/수업/PT/수동)", "이용권 만료일(HQ-09 step)", "첫 결제일 N일", "성별·연령대·문의 유형·가입경로", "누적 결제 금액 범위"],
    tableColumns: ["세그먼트", "조건 설명", "현재 회원 수", "생성일", "마지막 업데이트", "자동 갱신 주기"],
    rows: [
      { 세그먼트: "신규(자동)", "조건 설명": "첫 정상 결제 +30일 이내", "현재 회원 수": "52", 생성일: "시스템", "마지막 업데이트": "오늘 04:00", "자동 갱신 주기": "매일/이벤트" },
      { 세그먼트: "이탈위험(자동)", "조건 설명": "활성+30일 무방문(2h 중복 1회)", "현재 회원 수": "86", 생성일: "시스템", "마지막 업데이트": "오늘 04:00", "자동 갱신 주기": "매일/이벤트" },
      { 세그먼트: "만료임박(자동)", "조건 설명": "HQ-09 회원 이용권 만료 step", "현재 회원 수": "184", 생성일: "시스템", "마지막 업데이트": "오늘 04:00", "자동 갱신 주기": "매일/이벤트" },
      { 세그먼트: "충성(보조)", "조건 설명": "누적 12개월+ 골드 이상", "현재 회원 수": "42", 생성일: "시스템", "마지막 업데이트": "오늘 04:00", "자동 갱신 주기": "매일" }
    ],
    dialogs: ["DLG-M009"],
    primaryActions: [{ label: "새 세그먼트 만들기", permission: "memberWrite" }, { label: "미리보기(샘플 명단)", permission: "memberWrite" }, { label: "메시지 발송 액션 연결", permission: "memberWrite" }, { label: "쿠폰 발급 액션 연결", permission: "memberWrite" }, { label: "운영 메모", permission: "memberWrite", dialogId: "DLG-M009" }],
    roleNotes: { OWNER: "소속 지점 세그먼트 생성·수정·삭제, 액션 실행.", MANAGER: "세그먼트 생성·수정, 액션 실행(삭제 불가).", FC: "기존 세그먼트 기반 메시지 발송만 가능, 샘플 명단 PII 마스킹.", HQ_ADMIN: "전체 브랜드 세그먼트.", TRAINER: "접근 불가.", STAFF: "접근 불가." }
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
    id: "SCR-S004", title: "매출 통계", domain: "D03", route: "/sales/stats", source: "docs4/V2/D03-매출관리/매출관리.md:216", feature: "SAL-03",
    purpose: "상품별·상품 유형별·결제수단별·종목별·개월별 판매 비율·GX 세부 종목·법인권·직군별·담당자별 등 다양한 관점으로 매출을 시각 분석합니다. 단기/장기 회원권 판매 믹스, GX 하위 종목 수요, 법인권(B2B) 매출, 담당자별 신규/재등록/골프프로별 매출을 차트와 표로 파악합니다(V2 채택).",
    tabs: ["전체 통계", "직군별", "담당자별", "상품별(하위)", "상품타입별(하위)", "결제수단별(하위)", "종목별(하위)", "개월별(하위)", "GX종목별(하위)", "법인권(하위)"],
    metrics: [{ label: "총 매출 (현재 필터)", value: "18,420,000원", hint: "차트 상단 표시" }, { label: "전월 대비 토글", value: "+12.4%", hint: "증가=초록·감소=빨강" }, { label: "GX 세부 5종", value: "요가·필라테스·스피닝·줌바·GX 기타", hint: "subCategory 기준 고정" }, { label: "법인권", value: "B2B 가로 막대", hint: "[월매출]·구분=법인권" }],
    filters: ["기간 프리셋(이번 달·지난 달·3M·6M·올해)", "시작일~종료일 직접 입력", "전월 대비 토글", "지점", "상품"],
    tableColumns: ["분석 항목명", "판매 건수", "매출액", "비율(%)", "신규 매출(담당자별)", "재등록 매출(담당자별)", "기타 매출(담당자별)", "평균 단가(담당자별)"],
    rows: [
      { "분석 항목명": "PT 20회권", "판매 건수": "74", "매출액": "8,900만원", "비율(%)": "39%", "신규 매출(담당자별)": "5,200만원", "재등록 매출(담당자별)": "2,700만원", "기타 매출(담당자별)": "1,000만원", "평균 단가(담당자별)": "120만원" },
      { "분석 항목명": "회원권 3개월", "판매 건수": "112", "매출액": "6,200만원", "비율(%)": "27%", "신규 매출(담당자별)": "3,800만원", "재등록 매출(담당자별)": "2,000만원", "기타 매출(담당자별)": "400만원", "평균 단가(담당자별)": "55만원" },
      { "분석 항목명": "GX 요가", "판매 건수": "46", "매출액": "2,100만원", "비율(%)": "9%", "신규 매출(담당자별)": "1,400만원", "재등록 매출(담당자별)": "600만원", "기타 매출(담당자별)": "100만원", "평균 단가(담당자별)": "45만원" },
      { "분석 항목명": "골프 시뮬레이터 / 김프로", "판매 건수": "32", "매출액": "1,800만원", "비율(%)": "8%", "신규 매출(담당자별)": "900만원", "재등록 매출(담당자별)": "800만원", "기타 매출(담당자별)": "100만원", "평균 단가(담당자별)": "56만원" }
    ],
    dialogs: ["DLG-S012"],
    primaryActions: [{ label: "기간 조회", permission: "salesWrite" }, { label: "전월 대비 토글", permission: "salesWrite" }, { label: "목표 매출 설정", permission: "targetManage", dialogId: "DLG-S012" }],
    roleNotes: { OWNER: "소속 지점 매출 전체, 모든 탭·차트 사용.", MANAGER: "소속 지점 매출 전체, 모든 탭 사용.", HQ_ADMIN: "전체 지점 매출 조회·분석.", FC: "조회·필터 사용 가능.", TRAINER: "조회만.", STAFF: "조회만." },
    sources: { v1: publishingScreens.salesStats, v2: { ...publishingScreens.salesStats, version: "V2", source: "share/docs4/V2/D03-매출관리/매출관리.md:216" } }
  },
  {
    id: "SCR-S005", title: "통계 관리", domain: "D03", route: "/sales/statistics-admin", source: "docs4/V1/D03-매출관리/매출관리.md", feature: "SAL-02", purpose: "통계 기준과 집계 상태를 관리합니다. 자동 산식은 정책 확인 필요로 표시합니다.", tabs: ["집계 현황", "기준 관리", "오류"], metrics: [{ label: "집계 성공", value: "98.7%", hint: "최근 24h" }, { label: "오류", value: "3", hint: "검토 필요" }, { label: "정책 보류", value: "5", hint: "산식 미확정" }, { label: "마지막 집계", value: "06:00", hint: "자동화" }], filters: ["집계일", "상태", "지점", "정책 여부"], tableColumns: ["집계 항목", "상태", "최근 실행", "오류", "정책"], rows: [{ "집계 항목": "환불 차감", 상태: "보류", "최근 실행": "-", 오류: "없음", 정책: "확인 필요" }], dialogs: ["DLG-S012"], primaryActions: [{ label: "목표 기준 설정", permission: "targetManage", dialogId: "DLG-S012", policyPending: true }], roleNotes: { HQ_ADMIN: "정책 확인 항목을 우선 노출합니다." }, policyPending: true
  },
  {
    id: "SCR-S006", title: "선수익금 조회", domain: "D03", route: "/sales/deferred-revenue", source: "docs4/V1/D03-매출관리/매출관리.md:457", feature: "SAL-04",
    purpose: "기간권 계약의 선수익금(deferred revenue) 인식 현황을 조회합니다. 진행률 프로그레스 바와 잔여/인식 완료 금액을 시각화하고, 1/3/6/12개월 + 기타 5버킷 분류, durationMonths 우선 적용 기준을 명시합니다.",
    tabs: ["계약별 인식 현황", "월별 인식 배치 결과", "정책/산식 확인"],
    metrics: [{ label: "총 선수익금", value: "32,400,000원", hint: "잔여 합계" }, { label: "인식 완료 (누적)", value: "12,800,000원", hint: "초록 강조" }, { label: "잔여 선수익금", value: "19,600,000원", hint: "포인트 컬러 강조" }, { label: "이번 달 인식 예정", value: "4,800,000원", hint: "예정 합계" }],
    filters: ["시작일~종료일", "5버킷(1/3/6/12개월/기타)", "상품", "지점", "인식 상태"],
    tableColumns: ["회원명", "상품명", "총액", "인식 완료", "잔여", "시작일", "종료일", "진행률"],
    rows: [
      { 회원명: "박서연", 상품명: "3개월 회원권", 총액: "450,000원", "인식 완료": "150,000원", 잔여: "300,000원", 시작일: "2026-04-01", 종료일: "2026-06-30", 진행률: "33%" },
      { 회원명: "정하준", 상품명: "12개월 통합권", 총액: "1,800,000원", "인식 완료": "300,000원", 잔여: "1,500,000원", 시작일: "2026-03-15", 종료일: "2027-03-14", 진행률: "17%" },
      { 회원명: "오지우", 상품명: "1개월 락커", 총액: "30,000원", "인식 완료": "25,000원", 잔여: "5,000원", 시작일: "2026-05-01", 종료일: "2026-05-31", 진행률: "83%" }
    ],
    dialogs: ["DLG-S001"],
    primaryActions: [{ label: "원 매출 상세", dialogId: "DLG-S001" }, { label: "기간 필터 변경", permission: "salesWrite" }],
    roleNotes: { OWNER: "소속 지점 매출 전체, 기간 필터 설정 + 지점 선수익금 조회.", MANAGER: "소속 지점 매출 전체, 기간 필터 설정.", HQ_ADMIN: "전체 지점 매출 조회·분석.", FC: "담당 회원 결제 조회.", TRAINER: "매출 조회만.", STAFF: "매출 조회만." },
    policyPending: true,
    sources: { v1: publishingScreens.deferredRevenue, v2: { ...publishingScreens.deferredRevenue, version: "V2", source: "share/docs4/V2/D03-매출관리/매출관리.md:457" } }
  },
  {
    id: "SCR-S007", title: "환불 관리", domain: "D03", route: "/sales/refunds", source: "docs4/V1/D03-매출관리/매출관리.md:550", feature: "PAY-02",
    purpose: "처리된 환불 내역을 조회하고 통계(이번 달 환불 총액·건수·평균 환불액·위약금 합계)를 확인합니다. 환불 사유·처리 상태·원판매 담당자별 환불 책임 현황을 추적해 고객 불만 패턴과 환불 정책을 점검합니다. 환불 자동 산식은 미확정 상태로 수기 입력값을 표시.",
    tabs: ["환불 내역 (목록)", "원판매 담당자별 환불 책임"],
    metrics: [{ label: "이번 달 환불 총액", value: "620,000원", hint: "차감 합계" }, { label: "환불 건수", value: "18", hint: "이번 달" }, { label: "평균 환불액", value: "34,444원", hint: "건당 평균" }, { label: "위약금 합계", value: "82,000원", hint: "기간 내 공제 총액" }],
    filters: ["기간 프리셋(이번 달·지난 달·최근 3개월)", "시작일~종료일 직접 입력", "상태(완료/처리중/거절)", "원판매 담당자"],
    tableColumns: ["No", "환불일", "회원명", "상품명", "환불금액", "차감금", "위약금", "실환불액", "환불방법", "결제경로", "원결제ID", "결제지점", "이용지점", "매출 귀속 지점", "정산 지점", "인센티브 귀속자", "사유", "처리자", "상태"],
    rows: [
      { No: "1", 환불일: "2026-05-27", 회원명: "정하준", 상품명: "락커 1개월", 환불금액: "30,000원", 차감금: "5,000원", 위약금: "0원", 실환불액: "25,000원", 환불방법: "계좌이체", 결제경로: "수기", 원결제ID: "S-260527-003", 결제지점: "서초점", 이용지점: "서초점", "매출 귀속 지점": "서초점", "정산 지점": "서초점", "인센티브 귀속자": "박트레이너", 사유: "이용 불가", 처리자: "최매니저", 상태: "승인대기" },
      { No: "2", 환불일: "2026-05-23", 회원명: "박서연", 상품명: "회원권 3개월", 환불금액: "120,000원", 차감금: "50,000원", 위약금: "20,000원", 실환불액: "50,000원", 환불방법: "카드 취소", 결제경로: "POS", 원결제ID: "S-260520-018", 결제지점: "강남점", 이용지점: "강남점", "매출 귀속 지점": "강남점", "정산 지점": "강남점", "인센티브 귀속자": "이FC", 사유: "단순 변심", 처리자: "이FC", 상태: "완료" }
    ],
    dialogs: ["DLG-S006", "DLG-S013", "DLG-S014", "DLG-S015"],
    primaryActions: [{ label: "환불 요청", permission: "salesWrite", dialogId: "DLG-S015" }, { label: "환불 처리", permission: "refundApprove", dialogId: "DLG-S013", policyPending: true }, { label: "환불 상세", dialogId: "DLG-S006" }, { label: "엑셀 내보내기", permission: "salesWrite" }],
    roleNotes: { OWNER: "환불 승인/완료 가능, 위약금 면제 토글 가능.", MANAGER: "승인 요청까지만 가능.", FC: "담당 회원 결제 처리 조회만.", TRAINER: "매출 조회만.", STAFF: "요청 접수 중심으로 제한.", HQ_ADMIN: "전 지점 통합 조회." },
    policyPending: true,
    sources: { v1: publishingScreens.refunds, v2: { ...publishingScreens.refunds, version: "V2", source: "share/docs4/V2/D03-매출관리/매출관리.md:550" } }
  },
  {
    id: "SCR-S008", title: "미수금 관리", domain: "D03", route: "/sales/receivables", source: "docs4/V1/D03-매출관리/매출관리.md:635", feature: "PAY-03",
    purpose: "회원이 계약상 납입 의무(계약금·잔액·할부)를 완료하지 못한 미수금을 추적·관리합니다. 결제링크 발송만 된 건은 미수금 원장에 포함하지 않습니다(V2). HQ-09 본사 정책 step N일 기준 연체 알림 대상 강조 표시.",
    tabs: ["전체", "미결제", "일부결제", "연체", "완료"],
    metrics: [{ label: "미수금 총액", value: "1,120,000원", hint: "현재 잔액" }, { label: "미수금 건수", value: "14", hint: "활성 건" }, { label: "본사 정책 연체 알림 대상", value: "5", hint: "HQ-09 step N일" }, { label: "이번 달 회수액", value: "2,380,000원", hint: "04:00 일별 집계" }],
    filters: ["회원명 검색", "발생 유형(계약금 잔액/수기 분할/정기 할부 미납)", "예정일", "담당자"],
    tableColumns: ["No", "회원명", "상품명", "발생 유형", "원결제ID", "미수금액", "결제 기한", "상태", "메모", "등록일", "액션"],
    rows: [
      { No: "1", 회원명: "박서연", 상품명: "회원권 3개월", "발생 유형": "계약금 잔액", 원결제ID: "S-260520-018", 미수금액: "120,000원", "결제 기한": "2026-05-30", 상태: "일부결제", 메모: "분납 협의", 등록일: "2026-05-20", 액션: "납입 처리/메모" },
      { No: "2", 회원명: "오지우", 상품명: "할부 회원권", "발생 유형": "정기 할부 미납", 원결제ID: "I-260415-007", 미수금액: "75,000원", "결제 기한": "2026-05-15", 상태: "연체", 메모: "독촉 1차", 등록일: "2026-04-15", 액션: "납입 처리/메모" },
      { No: "3", 회원명: "김지수", 상품명: "PT 10회", "발생 유형": "수기 분할", 원결제ID: "S-260510-022", 미수금액: "150,000원", "결제 기한": "2026-06-05", 상태: "미결제", 메모: "-", 등록일: "2026-05-10", 액션: "납입 처리/메모" }
    ],
    dialogs: ["DLG-S008", "DLG-S005", "DLG-S016"],
    primaryActions: [{ label: "납입 처리", permission: "installment", dialogId: "DLG-S008" }, { label: "결제링크 발송 (DLG-S016, V2)", permission: "salesWrite", dialogId: "DLG-S016", policyPending: true }, { label: "메모 편집", permission: "salesWrite", dialogId: "DLG-S005" }, { label: "엑셀 내보내기", permission: "salesWrite" }],
    roleNotes: { OWNER: "전체 처리 가능, 결제 기한 연장 권한.", MANAGER: "납입 처리·상태 변경·메모 편집 가능.", FC: "담당 회원 결제 처리·메모 편집 가능.", TRAINER: "매출 조회만(상태 변경/메모 불가).", STAFF: "매출 조회만." },
    sources: { v1: publishingScreens.unpaid, v2: { ...publishingScreens.unpaid, version: "V2", source: "share/docs4/V2/D03-매출관리/매출관리.md:635" } }
  },
  {
    id: "SCR-S009", title: "할부결제 관리", domain: "D03", route: "/sales/installments", source: "docs4/V1/D03-매출관리/매출관리.md:711", feature: "SAL-EXT-01",
    purpose: "회원이 분할 납부 방식으로 결제한 할부 계약의 전체 현황을 11개 컬럼으로 한눈에 파악하고, 매월 납입 회차를 추적하며 미납 회차를 관리합니다. 정기 분납 계획 전용(계약금만 받고 잔액을 단기 미수금으로 남긴 건은 SCR-S008에서 우선 관리). docs4 V1 URL은 `/sales/installment`(단수) - 현재 라우트 `/sales/installments`(복수) 유지.",
    tabs: ["전체", "진행중", "완납", "미납"],
    metrics: [{ label: "진행 중인 할부 계약 수", value: "46", hint: "활성 계약" }, { label: "이번 달 납입 예정 건수", value: "18", hint: "예정 회차 1+" }, { label: "이번 달 납입 완료 건수", value: "12", hint: "완료 회차 1+" }, { label: "미납 총액", value: "1,470,000원", hint: "기한+1일 경과 회차 합계" }],
    filters: ["회원명 검색", "기간 범위", "계약 출처(현장 결제 연계/미수금 전환/직접 등록)", "상태 탭", "이번 달 납입 예정 칩", "이번 달 납입 완료 칩"],
    tableColumns: ["회원명", "상품명", "계약 출처", "선납금", "총 할부 금액", "납입 완료 금액", "잔여 금액", "총 회차", "납입 회차", "다음 납입일", "상태"],
    rows: [
      { 회원명: "오지우", 상품명: "할부 회원권 12개월", "계약 출처": "현장 결제 연계", 선납금: "300,000원", "총 할부 금액": "900,000원", "납입 완료 금액": "300,000원", "잔여 금액": "600,000원", "총 회차": "6", "납입 회차": "2", "다음 납입일": "2026-06-01", 상태: "진행중" },
      { 회원명: "김지수", 상품명: "PT 30회 분납", "계약 출처": "미수금 전환", 선납금: "0원", "총 할부 금액": "1,500,000원", "납입 완료 금액": "750,000원", "잔여 금액": "750,000원", "총 회차": "10", "납입 회차": "5", "다음 납입일": "2026-05-25", 상태: "미납" },
      { 회원명: "정하준", 상품명: "락커 12개월", "계약 출처": "직접 등록", 선납금: "10,000원", "총 할부 금액": "120,000원", "납입 완료 금액": "120,000원", "잔여 금액": "0원", "총 회차": "12", "납입 회차": "12", "다음 납입일": "-", 상태: "완납" }
    ],
    dialogs: ["DLG-S007", "DLG-S008", "DLG-S009"],
    primaryActions: [{ label: "할부 상세 (회차별 펼침)", permission: "installment", dialogId: "DLG-S007" }, { label: "납입 처리", permission: "installment", dialogId: "DLG-S008" }, { label: "+ 할부 등록", permission: "installment", dialogId: "DLG-S009" }, { label: "엑셀 내보내기", permission: "salesWrite" }],
    roleNotes: { OWNER: "전체 계약 관리·조정·삭제.", MANAGER: "납입 처리·계약 조정 가능, 등록 가능.", FC: "담당 회원 할부 계약 조회·납입 처리.", TRAINER: "매출 조회만.", STAFF: "매출 조회만.", HQ_ADMIN: "전 지점 통합 조회." },
    sources: { v1: publishingScreens.installments, v2: { ...publishingScreens.installments, version: "V2", source: "share/docs4/V2/D03-매출관리/매출관리.md:711" } }
  },
  {
    id: "SCR-S010", title: "세금계산서 발행", domain: "D03", route: "/sales/tax-invoice", source: "docs4/V1/D03-매출관리/매출관리.md:872", feature: "SAL-EXT-02",
    purpose: "법인 회원 또는 사업자 회원에게 세금계산서를 발행하고 발행 이력(발행 완료·전송 완료·오류)을 추적합니다. 회계 마감·세무 신고에 필요한 발행 이력을 한 곳에서 관리. 외부 연동(공급 품목 자동 채움 + PDF 자동 생성 + 이메일 전송)은 정책 확인 필요(external-pending). docs4 V1 URL은 `/sales/invoice` - 현재 라우트 `/sales/tax-invoice` 유지.",
    tabs: ["발행 (발행 대상 조회 + 발행 폼)", "이력 (기발행 목록)"],
    metrics: [{ label: "이번 달 발행 건수", value: "34", hint: "발행 완료 누적" }, { label: "이번 달 발행 총액", value: "37,400,000원", hint: "합계 기준" }, { label: "미발행 대기 건수", value: "12", hint: "법인 결제 대기" }, { label: "외부 연동 상태", value: "확인 필요", hint: "PDF·이메일·홈택스 정책 확정 전" }],
    filters: ["상태(발행 완료/전송 완료/오류/취소 발행)", "공급받는 자(법인) 검색", "발행일", "이메일"],
    tableColumns: ["발행일", "공급받는 자", "공급가액", "부가세", "합계", "상태", "액션"],
    rows: [
      { 발행일: "2026-05-28", "공급받는 자": "판도헬스 법인 (123-45-67890)", 공급가액: "1,000,000원", 부가세: "100,000원", 합계: "1,100,000원", 상태: "발행 완료", 액션: "상세 / 이메일 전송" },
      { 발행일: "2026-05-25", "공급받는 자": "강남스포츠 (456-78-9****)", 공급가액: "2,500,000원", 부가세: "250,000원", 합계: "2,750,000원", 상태: "전송 완료", 액션: "상세" },
      { 발행일: "2026-05-22", "공급받는 자": "광화문피트 (789-01-2****)", 공급가액: "800,000원", 부가세: "80,000원", 합계: "880,000원", 상태: "오류", 액션: "재발행 / 상세" }
    ],
    dialogs: ["DLG-S010", "DLG-S011"],
    primaryActions: [{ label: "세금계산서 상세", permission: "taxInvoice", dialogId: "DLG-S010" }, { label: "세금계산서 발행", permission: "taxInvoice", dialogId: "DLG-S011", policyPending: true }, { label: "이메일 전송 / 재발행", permission: "taxInvoice" }, { label: "엑셀 내보내기", permission: "taxInvoice" }],
    roleNotes: { OWNER: "세금계산서 발행·이력 조회·이메일·엑셀(V2 보강).", MANAGER: "세금계산서 발행·이력 조회·이메일·엑셀(V2 보강).", HQ_ADMIN: "전 지점 통합, 정책·외부연동 확인 배지 표시.", FC: "담당 회원 결제 이력 조회만.", TRAINER: "매출 조회만.", STAFF: "매출 조회만." },
    policyPending: true,
    sources: { v1: publishingScreens.taxInvoices, v2: { ...publishingScreens.taxInvoices, version: "V2", source: "share/docs4/V2/D03-매출관리/매출관리.md:872" } }
  },
  {
    id: "SCR-S011", title: "매출 예측", domain: "D03", route: "/sales/forecast", source: "docs4/V1/D03-매출관리/매출관리.md", feature: "V1 보조", purpose: "과거 매출 기반 예측과 목표 대비 달성률을 확인합니다. 예측 산식은 mock입니다.", tabs: ["다음 달", "다음 분기", "연간"], metrics: [{ label: "예측 매출", value: "42,000,000원", hint: "mock" }, { label: "목표 달성률", value: "82%", hint: "게이지" }, { label: "전월 대비", value: "+6.5%", hint: "예측" }, { label: "분기 누적", value: "98,000,000원", hint: "현재" }], filters: ["예측 기간", "상품", "지점", "목표 기준"], tableColumns: ["월", "예측 매출", "목표", "달성률", "전년동기"], rows: [{ 월: "2026-06", "예측 매출": "42,000,000원", 목표: "51,000,000원", 달성률: "82%", 전년동기: "+9%" }], dialogs: ["DLG-S012"], primaryActions: [{ label: "목표 매출 설정", permission: "targetManage", dialogId: "DLG-S012" }], roleNotes: { OWNER: "목표 수정 가능.", HQ_ADMIN: "전 지점 예측 비교 중심입니다." }, policyPending: true
  },
  {
    id: "SCR-S012", title: "결제 취소 / 부분 환불", domain: "D03", route: "/sales/refund-partial", source: "docs4/V1/D03-매출관리/매출관리.md:1105", feature: "SAL-EXT-04",
    purpose: "환불 자동 계산 산식 확정 전, 결제 건별 환불 처리를 수기 입력 방식으로 기록합니다. 결제 검색 후 환불 수기 입력 박스(원결제금액·기사용 차감금·위약금·기환불 누계·이번 환불 가능액·최종 환불액)와 귀속 영향 요약·승인 상태를 분리해 운영 판단값을 보존합니다. manager/fc는 승인대기 저장, Owner만 완료 처리.",
    tabs: ["1. 결제 건 검색", "2. 결제 내역 확인", "3. 환불 수기 입력", "4. 귀속 영향 요약", "5. 승인 상태 + 처리 이력"],
    metrics: [{ label: "원결제금액", value: "1,200,000원", hint: "읽기 전용" }, { label: "기사용 차감금", value: "수기 입력", hint: "정책 확인 필요" }, { label: "위약금", value: "수기 입력", hint: "Owner 면제 가능" }, { label: "최종 환불액", value: "운영 판단", hint: "이번 환불 가능액 초과 시 경고" }],
    filters: ["회원명 검색", "상품명", "결제일", "처리 유형(전체 취소/부분 환불)", "승인 상태"],
    tableColumns: ["항목", "금액", "입력자", "정책", "상태"],
    rows: [
      { 항목: "원결제금액", 금액: "1,200,000원", 입력자: "시스템", 정책: "읽기 전용", 상태: "확인" },
      { 항목: "기사용 차감금", 금액: "120,000원", 입력자: "최매니저", 정책: "확인 필요", 상태: "수기" },
      { 항목: "위약금", 금액: "50,000원", 입력자: "최매니저", 정책: "Owner 면제 가능", 상태: "수기" },
      { 항목: "기환불 누계", 금액: "0원", 입력자: "시스템", 정책: "조회", 상태: "확인" },
      { 항목: "이번 환불 가능액", 금액: "1,030,000원", 입력자: "시스템", 정책: "조회", 상태: "확인" },
      { 항목: "최종 환불액", 금액: "800,000원", 입력자: "최매니저", 정책: "운영 판단", 상태: "승인대기" }
    ],
    dialogs: ["DLG-S013", "DLG-S014", "DLG-S015"],
    primaryActions: [{ label: "환불 요청 (승인대기 저장)", permission: "salesWrite", dialogId: "DLG-S015" }, { label: "환불 처리 (Owner 완료)", permission: "refundApprove", dialogId: "DLG-S013", policyPending: true }, { label: "처리 결과 보기", permission: "refundApprove", dialogId: "DLG-S014" }, { label: "전체 취소 / 부분 환불 선택", permission: "salesWrite" }],
    roleNotes: { OWNER: "전체 취소·부분 환불 즉시 처리, 승인대기 건 승인/반려.", MANAGER: "결제 건 조회·환불 요청·수기 입력·승인 요청.", FC: "담당 회원 결제 건 조회·환불 요청·수기 입력·승인 요청.", TRAINER: "매출 조회만.", STAFF: "매출 조회만.", HQ_ADMIN: "전 지점 매출 조회·분석." },
    policyPending: true,
    sources: { v1: publishingScreens.cancelRefund, v2: { ...publishingScreens.cancelRefund, version: "V2", source: "share/docs4/V2/D03-매출관리/매출관리.md:1105" } }
  }
];

export const dialogs = [
  ...coreDialogs,
  ...d01v2Dialogs,
  ...d04Dialogs,
  ...d05Dialogs,
  ...d06Dialogs,
  ...d07Dialogs,
  ...d08Dialogs,
  ...d09Dialogs,
  ...d10Dialogs,
  ...d11Dialogs,
];
export const screens = [
  ...coreScreens,
  ...d01v2Screens,
  ...d04Screens,
  ...d05Screens,
  ...d06Screens,
  ...d07Screens,
  ...d08Screens,
  ...d09Screens,
  ...d10Screens,
  ...d11Screens,
];

// === sources 자동 주입은 resolveScreenSource/screenIdToPublishingKey 정의 이후 line ~590에서 실행 ===
// (top-level const는 TDZ로 인해 함수 호출보다 먼저 접근하면 ReferenceError가 발생함)

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

// === sources 헬퍼 (V1+V2 합집합 표기 룰) ===

export function getScreenPrimarySource(screen: ScreenDefinition): PublishingSource | undefined {
  return screen.sources?.v1 ?? screen.sources?.v2;
}

export function getScreenSecondarySource(screen: ScreenDefinition): PublishingSource | undefined {
  if (screen.sources?.v1 && screen.sources?.v2) return screen.sources.v2;
  return undefined;
}

export function getScreenSourceLabel(screen: ScreenDefinition): "V1" | "V2" | "V1+V2" {
  if (screen.sources?.v1 && screen.sources?.v2) return "V1+V2";
  if (screen.sources?.v2 && !screen.sources?.v1) return "V2";
  return "V1";
}

export function getDialogPrimarySource(dialog: DialogDefinition): PublishingSource | undefined {
  return dialog.sources?.v1 ?? dialog.sources?.v2;
}

export function getDialogSecondarySource(dialog: DialogDefinition): PublishingSource | undefined {
  if (dialog.sources?.v1 && dialog.sources?.v2) return dialog.sources.v2;
  return undefined;
}

export function getDialogSourceLabel(dialog: DialogDefinition): "V1" | "V2" | "V1+V2" {
  if (dialog.sources?.v1 && dialog.sources?.v2) return "V1+V2";
  if (dialog.sources?.v2 && !dialog.sources?.v1) return "V2";
  return "V1";
}

// docs4-sources의 마스터 레지스트리와 v1-publishing screen ID 매핑.
// 이 함수는 coreScreens / 도메인 파일에서 V1 source 채우는 데 사용한다.
const screenIdToPublishingKey: Record<string, keyof typeof publishingScreens> = {
  "SCR-100": "login",
  "SCR-104": "notifications",
  "SCR-DLG": "dialogGallery",
  // D01 V2 only 신규 SCR-101~103, 105~109
  "SCR-101": "dashboardCombined",
  "SCR-102": "sidebarNav",
  "SCR-103": "globalSearch",
  "SCR-105": "profile",
  "SCR-106": "passwordReset",
  "SCR-107": "specOverlay",
  "SCR-108": "errorPage",
  "SCR-109": "logout",
  "SCR-M001": "members",
  "SCR-M002": "memberCreate",
  "SCR-M003": "memberEdit",
  "SCR-M004": "memberDetail",
  "SCR-M005": "memberTransfer",
  "SCR-M006": "bodyComposition",
  "SCR-M007": "memberMerge",
  "SCR-M008": "family",
  "SCR-M009": "grades",
  "SCR-M010": "segments",
  "SCR-S001": "sales",
  "SCR-S002": "pos",
  "SCR-S003": "payment",
  "SCR-S004": "salesStats",
  "SCR-S005": "statsAdmin",
  "SCR-S006": "deferredRevenue",
  "SCR-S007": "refunds",
  "SCR-S008": "unpaid",
  "SCR-S009": "installments",
  "SCR-S010": "taxInvoices",
  "SCR-S011": "forecast",
  "SCR-S012": "cancelRefund",
  // D04 수업관리
  "SCR-C001": "classCalendar",
  "SCR-C002": "classAdmin",
  "SCR-C003": "classSchedule",
  "SCR-C004": "classTemplates",
  "SCR-C005": "classGroupStatus",
  "SCR-C006": "instructorStatus",
  "SCR-C007": "lessonCounts",
  "SCR-C008": "penalties",
  "SCR-C009": "scheduleRequests",
  "SCR-C011": "validLessons",
  "SCR-C013": "classFeedback",
  "SCR-C014": "lessonCompletion",
  "SCR-C016": "classReservations",
  // D05 상품관리
  "SCR-P001": "productAdmin",
  "SCR-P002": "productCreate",
  "SCR-P003": "productDetail",
  "SCR-P004": "productDiscount",
  "SCR-P005": "productCatalog",
  "SCR-P006": "productCompare",
  "SCR-P007": "inventoryProducts",
  "SCR-P008": "seasonalPrice",
  // D06 시설관리
  "SCR-050": "lockerAdmin",
  "SCR-051": "lockerAssignment",
  "SCR-052": "bandCard",
  "SCR-053": "gymRoom",
  "SCR-054": "golfBay",
  "SCR-055": "productInventory",
  "SCR-056": "equipmentCheck",
  "SCR-057": "consumables",
  "SCR-058": "cleaning",
  "SCR-059": "spaceAsset",
  // D07 직원관리
  "SCR-060": "staffList",
  "SCR-061": "staffCreate",
  "SCR-062": "staffResignation",
  "SCR-063": "staffAttendance",
  "SCR-064": "payroll",
  "SCR-065": "payrollStatements",
  // D08 마케팅
  "SCR-070": "leads",
  "SCR-071": "message",
  "SCR-072": "autoAlarm",
  "SCR-072A": "autoAlarmOperation",
  "SCR-073": "coupon",
  "SCR-074": "mileage",
  "SCR-075": "contracts",
  "SCR-076": "campaign",
  "SCR-077": "referral",
  "SCR-078": "smsBulk",
  "SCR-079": "abTest",
  // D09 설정관리
  "SCR-080": "centerSettings",
  "SCR-080A": "branchAutomation",
  "SCR-081": "permissions",
  "SCR-082": "kiosk",
  "SCR-082A": "kioskIot",
  "SCR-083": "iotAccess",
  "SCR-084": "subscription",
  "SCR-086": "attendanceSettings",
  "SCR-085": "notices",
  "SCR-087": "customRole",
  "SCR-088": "localization",
  "SCR-089": "dataBackup",
  // D10 본사관리
  "SCR-092": "branches",
  "SCR-093": "branchReport",
  "SCR-094": "kpiDashboard",
  "SCR-095": "kpiCenter",
  "SCR-097": "auditLog",
  "SCR-098": "todayTasks",
  "SCR-099": "reports",
  "SCR-090": "branchDashboard",
  "SCR-091": "legacyRedirect",
  "SCR-096": "onboarding",
  "SCR-H1001": "automationPolicies",
  "SCR-H1002": "dashboardBuilder",
  "SCR-H1003": "benchmark",
  "SCR-H1004": "forecastAnalytics",
  "SCR-H1005": "nps",
  // D11 통합운영
  "SCR-I001": "attendance",
  "SCR-I003": "iotOverview",
  "SCR-I004": "clothLocker",
  "SCR-I005": "fixedLocker",
  "SCR-I006": "bodyCompositionIntegrated",
  "SCR-I007": "healthSummary",
  "SCR-I008": "kioskOps",
};

export function resolveScreenSource(screenId: string): PublishingSource | undefined {
  const key = screenIdToPublishingKey[screenId];
  return key ? publishingScreens[key] : undefined;
}

export function resolveDialogSource(dialogId: string): PublishingSource | undefined {
  return publishingDialogs[dialogId];
}

// === sources 자동 주입 (resolveScreenSource/resolveDialogSource 정의 이후 실행) ===
// 코어 SCR/도메인 SCR에 sources가 비어있으면 publishingScreens 마스터를 기반으로 V1+V2 두 source를 자동 채운다.
// 명시적으로 sources를 설정한 화면(D03 S004~S012 등)은 덮어쓰지 않는다.
for (const screen of screens) {
  if (screen.sources) continue;
  const v1Source = resolveScreenSource(screen.id);
  if (!v1Source) continue;
  const v2Path = v1Source.source.replace("/V1/", "/V2/").replace(/:\d+$/, "");
  screen.sources = {
    v1: v1Source,
    v2: { ...v1Source, version: "V2", source: v2Path, status: undefined, referenceVersion: undefined, referenceSource: undefined },
  };
}

for (const dialog of dialogs) {
  if (dialog.sources) continue;
  const v1Source = resolveDialogSource(dialog.id);
  if (!v1Source) continue;
  const v2Path = v1Source.source.replace("/V1/", "/V2/").replace(/:\d+$/, "");
  dialog.sources = {
    v1: v1Source,
    v2: { ...v1Source, version: "V2", source: v2Path, status: undefined },
  };
}
