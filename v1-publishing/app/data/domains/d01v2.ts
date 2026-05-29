import type { DialogDefinition, ScreenDefinition } from "../registry";

// D01 공통 - V2 신규 SCR-101~103, 105~109 + DLG-001~004.
// docs4 V2 D01-공통/공통.md 원문 기반. V1에는 없는 신규 SCR/DLG로 V2 only 구분.
// SCR-101 대시보드 통합은 SCR-090 지점 대시보드(D10)와 동일 / route를 공유하지만
// publishing prototype은 1:1 라우트 매핑이 필요해 /hq/super-dashboard로 분리해 표시한다.

const v2Source = "share/docs4/V2/D01-공통/공통.md";

export const d01v2Dialogs: DialogDefinition[] = [
  {
    id: "DLG-001",
    title: "로그아웃 확인",
    domain: "D01",
    source: v2Source,
    purpose:
      "사용자가 명시적으로 로그아웃을 시도할 때 현재 세션 종료를 안내하고 작성 중인 데이터 영향 범위를 한 번 더 확인합니다(V2).",
    components: [
      "안내 메시지",
      "미저장 작업 요약",
      "다른 기기 세션 함께 종료 옵션",
      "취소 / 로그아웃"
    ],
    policyPending: true
  },
  {
    id: "DLG-002",
    title: "이탈 경고",
    domain: "D01",
    source: v2Source,
    purpose:
      "입력 폼 변경 사항이 저장되지 않은 상태에서 다른 화면으로 이동하려 할 때 데이터 손실을 방지하기 위한 경고(V2).",
    components: [
      "변경 사항 요약",
      "이동 시 손실 안내",
      "계속 작성 / 저장 후 이동 / 저장 없이 이동"
    ],
    policyPending: true
  },
  {
    id: "DLG-003",
    title: "삭제 확인",
    domain: "D01",
    source: v2Source,
    purpose:
      "주요 데이터 영구 삭제 전 공통 확인 다이얼로그(V2). 도메인별 destructive 액션에서 공통 호출.",
    components: [
      "삭제 대상 요약",
      "복구 불가 안내",
      "사유 입력(선택)",
      "취소 / 삭제 확인"
    ],
    policyPending: true,
    destructive: true
  },
  {
    id: "DLG-004",
    title: "저장 확인",
    domain: "D01",
    source: v2Source,
    purpose:
      "민감 설정·정책 변경·구독 변경 등 영향 범위가 큰 저장 액션을 실행하기 전 확인을 받는 공통 다이얼로그(V2).",
    components: [
      "변경 요약(before/after)",
      "영향 범위 안내",
      "취소 / 저장"
    ],
    policyPending: true
  }
];

export const d01v2Screens: ScreenDefinition[] = [
  {
    id: "SCR-101",
    title: "대시보드 통합",
    domain: "D01",
    route: "/hq/super-dashboard",
    source: v2Source,
    feature: "MFN-SCR-101",
    purpose:
      "superAdmin/primary 계정이 로그인 직후 진입하는 전 지점 통합 대시보드(V2 신규). 전체 지점 KPI·지점별 운영 이슈·전사 매출/출석/회원 현황을 한 화면에 표시합니다. Owner 이하는 / route에서 SCR-090 지점 대시보드로 분기. docs4 V2의 / route는 SCR-091 리다이렉트와 충돌해 publishing prototype은 /hq/super-dashboard로 분리합니다.",
    tabs: ["오늘 집중 업무 코크핏", "오늘의 핵심 수치", "실시간 출석 카드", "수업/회원/매출 위젯", "엑셀 내보내기"],
    metrics: [
      { label: "전사 매출(당월)", value: "—", hint: "전 지점 누적" },
      { label: "오늘 출석", value: "—", hint: "전사 합계 + 실시간" },
      { label: "HQ-09 만료 알림 대상", value: "—", hint: "전 지점 우선순위 카드" },
      { label: "미수금 / 홀딩 관리", value: "—", hint: "지점별 코크핏" }
    ],
    filters: [
      "지점 필터(전체/특정 지점)",
      "역할 빠른 액션 패널",
      "실시간 출석 카드 새로고침"
    ],
    tableColumns: ["발생 시각", "지점", "유형", "회원/직원", "요약"],
    rows: [
      { "발생 시각": "10:24", 지점: "강남점", 유형: "신규 회원", "회원/직원": "김민준", 요약: "PT 20회권 첫 결제 완료" },
      { "발생 시각": "10:18", 지점: "서초점", 유형: "출석", "회원/직원": "박서연", 요약: "키오스크 QR" },
      { "발생 시각": "10:05", 지점: "잠실점", 유형: "미수금", "회원/직원": "오지우", 요약: "할부 회차 미납 D-3" }
    ],
    dialogs: ["DLG-000", "DLG-001"],
    primaryActions: [
      { label: "지점 필터 변경" },
      { label: "오늘 집중 업무 우선순위 보기" },
      { label: "엑셀 내보내기", permission: "viewAllBranches" },
      { label: "로그아웃", dialogId: "DLG-001" }
    ],
    roleNotes: {
      HQ_ADMIN: "전 지점 KPI + 지점 필터 + 전사 운영 이슈 + 엑셀 내보내기 가능.",
      OWNER: "/ route 진입 시 SCR-090 지점 대시보드로 분기, 본 화면 표시 대상 아님.",
      MANAGER: "/ route 진입 시 SCR-090 지점 대시보드로 분기.",
      FC: "/ route 진입 시 SCR-090 지점 대시보드로 분기.",
      TRAINER: "/ route 진입 시 SCR-090 지점 대시보드로 분기.",
      STAFF: "/ route 진입 시 SCR-090 지점 대시보드로 분기."
    },
    policyPending: true
  },
  {
    id: "SCR-102",
    title: "사이드바 네비게이션",
    domain: "D01",
    route: "/components/sidebar",
    source: v2Source,
    feature: "MFN-SCR-102",
    purpose:
      "모든 화면에서 공통 사용되는 좌측 메뉴 영역(V2 신규). 역할별 접근 가능 메뉴 자동 노출/숨김. 펼침/접힘/모바일 오버레이 상태 지원. 본 publishing 화면은 사이드바 컴포넌트의 상태/권한 매트릭스를 검수용으로 모아 표시합니다.",
    tabs: ["펼침", "접힘", "모바일 오버레이", "권한 매트릭스"],
    metrics: [
      { label: "메뉴 그룹", value: "11개", hint: "D01~D11" },
      { label: "역할", value: "6종", hint: "HQ_ADMIN ~ STAFF" },
      { label: "권한 없는 메뉴", value: "자동 숨김", hint: "역할별" },
      { label: "현재 위치 강조", value: "ON", hint: "활성 메뉴" }
    ],
    filters: ["역할 선택", "펼침/접힘 토글", "모바일 시뮬레이션"],
    tableColumns: ["메뉴 그룹", "HQ_ADMIN", "OWNER", "MANAGER", "FC", "TRAINER", "STAFF"],
    rows: [
      { "메뉴 그룹": "본사 관리(D10)", HQ_ADMIN: "노출", OWNER: "숨김", MANAGER: "숨김", FC: "숨김", TRAINER: "숨김", STAFF: "숨김" },
      { "메뉴 그룹": "회원관리(D02)", HQ_ADMIN: "노출", OWNER: "노출", MANAGER: "노출", FC: "노출", TRAINER: "노출", STAFF: "노출" },
      { "메뉴 그룹": "급여(D07)", HQ_ADMIN: "노출", OWNER: "노출", MANAGER: "숨김", FC: "숨김", TRAINER: "숨김", STAFF: "숨김" },
      { "메뉴 그룹": "설정관리(D09)", HQ_ADMIN: "노출", OWNER: "노출", MANAGER: "조회만", FC: "숨김", TRAINER: "숨김", STAFF: "숨김" }
    ],
    dialogs: ["DLG-000"],
    primaryActions: [
      { label: "역할 전환 시뮬레이션" },
      { label: "펼침/접힘 토글" },
      { label: "모바일 햄버거 메뉴 열기" }
    ],
    roleNotes: {
      HQ_ADMIN: "본사 관리 섹션 추가 노출.",
      OWNER: "본사 전용 메뉴 숨김.",
      MANAGER: "본사 전용 메뉴 숨김.",
      FC: "매출·설정·직원관리 등 운영 메뉴 제한, 수업/회원 중심 노출.",
      TRAINER: "본인 담당 수업·회원 메뉴 중심.",
      STAFF: "출석·회원·POS·시설 위주 메뉴만 노출."
    },
    policyPending: true
  },
  {
    id: "SCR-103",
    title: "글로벌 검색",
    domain: "D01",
    route: "/search",
    source: v2Source,
    feature: "MFN-SCR-103",
    purpose:
      "어느 화면에서든 상단 검색창(Cmd+K)으로 회원·직원·수업·상품을 빠르게 찾는 통합 검색(V2 신규). 카테고리별 결과 + 최근 검색어. 권한별 검색 범위 차등.",
    tabs: ["회원", "직원", "수업", "상품", "최근 검색어"],
    metrics: [
      { label: "검색 카테고리", value: "4종", hint: "회원/직원/수업/상품" },
      { label: "최소 검색어", value: "2자 이상", hint: "미만 시 결과 미표시" },
      { label: "최근 검색어 보관", value: "10건", hint: "계정별" },
      { label: "단축키", value: "Cmd+K", hint: "어디서나 호출" }
    ],
    filters: ["검색 카테고리 토글", "최근 검색어 표시 ON/OFF"],
    tableColumns: ["카테고리", "결과", "지점", "상태", "바로가기"],
    rows: [
      { 카테고리: "회원", 결과: "김민준 #M0001", 지점: "강남점", 상태: "활성", 바로가기: "회원 상세" },
      { 카테고리: "직원", 결과: "박트레이너 #STF-014", 지점: "강남점", 상태: "재직", 바로가기: "직원 상세" },
      { 카테고리: "수업", 결과: "PT 박트레이너 06-01 10:00", 지점: "강남점", 상태: "예정", 바로가기: "수업 상세" },
      { 카테고리: "상품", 결과: "PT 20회권", 지점: "전 지점", 상태: "활성", 바로가기: "상품 상세" }
    ],
    dialogs: [],
    primaryActions: [
      { label: "검색 오버레이 열기 (Cmd+K)" },
      { label: "최근 검색어 삭제" },
      { label: "결과 클릭 → 상세 이동" },
      { label: "ESC로 닫기" }
    ],
    roleNotes: {
      HQ_ADMIN: "전 지점 데이터 검색.",
      OWNER: "소속 지점 데이터만 검색.",
      MANAGER: "소속 지점 데이터만 검색.",
      FC: "소속 지점 데이터만 검색.",
      TRAINER: "담당 회원 및 수업만 검색.",
      STAFF: "담당 회원 및 수업만 검색."
    },
    policyPending: true
  },
  {
    id: "SCR-105",
    title: "프로필 / 계정 설정",
    domain: "D01",
    route: "/profile",
    source: v2Source,
    feature: "MFN-SCR-105",
    purpose:
      "현재 로그인 계정의 프로필·연락처·비밀번호 변경·2FA·활성 세션 관리(V2 신규). 직원 1명 = 로그인 계정 1개 정책에 따라 본인 계정 보안 상태도 함께 확인.",
    tabs: ["기본 정보", "보안(2FA)", "활성 세션", "최근 로그인 이력"],
    metrics: [
      { label: "계정 상태", value: "정상", hint: "정상/잠금/비활성" },
      { label: "2FA 상태", value: "OFF", hint: "활성화 권장" },
      { label: "활성 세션", value: "2대", hint: "PC + 모바일" },
      { label: "마지막 비밀번호 변경", value: "90일 전", hint: "변경 권장" }
    ],
    filters: ["탭 전환", "비밀번호 변경", "다른 기기 로그아웃"],
    tableColumns: ["섹션", "필드", "필수"],
    rows: [
      { 섹션: "기본 정보", 필드: "이름·연락처·이메일·프로필 사진", 필수: "이름·이메일 필수" },
      { 섹션: "읽기 전용", 필드: "로그인 ID·소속 지점·역할/직책", 필수: "D07/D09에서만 변경" },
      { 섹션: "보안", 필드: "비밀번호 변경·2FA 활성화·첫 로그인 변경 필요 배지", 필수: "정책 적용" },
      { 섹션: "세션", 필드: "활성 세션·접속 기기·다른 기기 로그아웃·로그아웃", 필수: "본인만 조작" }
    ],
    dialogs: ["DLG-004", "DLG-001", "DLG-002"],
    primaryActions: [
      { label: "저장 (DLG-004)", dialogId: "DLG-004" },
      { label: "비밀번호 변경 → SCR-106" },
      { label: "다른 기기 로그아웃" },
      { label: "이탈 경고 (DLG-002)", dialogId: "DLG-002" },
      { label: "로그아웃 (DLG-001)", dialogId: "DLG-001" }
    ],
    roleNotes: {
      HQ_ADMIN: "이름·연락처·사진·2FA·세션 관리 가능. 역할·소속 지점은 D09/D07에서만 변경.",
      OWNER: "이름·연락처·사진·2FA·세션 관리 가능.",
      MANAGER: "이름·연락처·사진·2FA·세션 관리 가능.",
      FC: "이름·연락처·사진·2FA·세션 관리 가능.",
      TRAINER: "이름·연락처·사진·2FA·세션 관리 가능.",
      STAFF: "이름·연락처·사진·2FA·세션 관리 가능."
    },
    policyPending: true
  },
  {
    id: "SCR-106",
    title: "비밀번호 재설정",
    domain: "D01",
    route: "/password-reset",
    source: v2Source,
    feature: "MFN-SCR-106",
    purpose:
      "현재 비밀번호와 새 비밀번호를 입력해 변경(V2 신규). 비밀번호 정책 검증, 변경 후 다른 기기 자동 로그아웃 옵션, 첫 로그인 강제 변경 시 진입.",
    tabs: ["비밀번호 변경"],
    metrics: [
      { label: "최소 길이", value: "10자", hint: "정책 기준" },
      { label: "필수 구성", value: "영문·숫자·특수 3종", hint: "정책 기준" },
      { label: "재사용 차단", value: "최근 5회", hint: "동일 비밀번호" },
      { label: "변경 후", value: "다른 기기 자동 로그아웃 옵션", hint: "보안 권장" }
    ],
    filters: ["첫 로그인 강제 모드 / 본인 변경 모드"],
    tableColumns: ["필드", "조건", "필수"],
    rows: [
      { 필드: "현재 비밀번호", 조건: "본인 변경 모드에서만 필수", 필수: "조건부" },
      { 필드: "새 비밀번호", 조건: "정책 검증(10자+, 3종 구성, 최근 5회 미사용)", 필수: "Y" },
      { 필드: "새 비밀번호 확인", 조건: "동일 입력", 필수: "Y" },
      { 필드: "다른 기기 자동 로그아웃", 조건: "체크 시 기존 세션 종료", 필수: "선택" }
    ],
    dialogs: ["DLG-004"],
    primaryActions: [
      { label: "비밀번호 변경 (DLG-004)", dialogId: "DLG-004" },
      { label: "취소 → SCR-105" },
      { label: "첫 로그인 모드 강제 변경 차단" }
    ],
    roleNotes: {
      HQ_ADMIN: "본인 비밀번호 변경. 타 직원 초기화는 D07/D09에서 처리.",
      OWNER: "본인 비밀번호 변경. 직원 초기화는 D07/D09에서 처리.",
      MANAGER: "본인 비밀번호 변경.",
      FC: "본인 비밀번호 변경.",
      TRAINER: "본인 비밀번호 변경.",
      STAFF: "본인 비밀번호 변경."
    },
    policyPending: true
  },
  {
    id: "SCR-107",
    title: "화면설계서 오버레이 (Cmd+/)",
    domain: "D01",
    route: "/spec-overlay",
    source: v2Source,
    feature: "MFN-SCR-107",
    purpose:
      "현재 보고 있는 화면의 SCR-ID·DLG 연결·docs4 출처를 오버레이로 표시(V2 신규). Cmd+/로 토글. 퍼블리싱 인수·QA 검수 시 docs4 정합성을 즉시 확인.",
    tabs: ["현재 화면 메타", "DLG 연결 목록", "권한 매트릭스 요약", "docs4 출처"],
    metrics: [
      { label: "단축키", value: "Cmd+/", hint: "토글" },
      { label: "표시 정보", value: "SCR-ID·feature·source", hint: "메타 헤더" },
      { label: "DLG 연결", value: "현재 화면 연계 다이얼로그", hint: "id + 출처" },
      { label: "권한 요약", value: "역할별 가능 액션", hint: "테이블" }
    ],
    filters: ["오버레이 ON/OFF", "탭 전환"],
    tableColumns: ["섹션", "표시 내용", "출처"],
    rows: [
      { 섹션: "현재 화면", "표시 내용": "SCR-ID·title·route·feature", 출처: "registry.ts" },
      { 섹션: "docs4 출처", "표시 내용": "share/docs4/V1·V2 파일 경로 + 라인", 출처: "docs4-sources.ts" },
      { 섹션: "DLG 연결", "표시 내용": "현재 화면에서 호출 가능한 DLG 목록", 출처: "registry.dialogs" },
      { 섹션: "권한 매트릭스", "표시 내용": "역할별 가능 액션 요약", 출처: "roleNotes" }
    ],
    dialogs: [],
    primaryActions: [
      { label: "오버레이 토글 (Cmd+/)" },
      { label: "docs4 출처 파일 열기(외부 링크)" },
      { label: "DLG 출처로 이동" },
      { label: "현재 권한 매트릭스 펼침" }
    ],
    roleNotes: {
      HQ_ADMIN: "전체 화면에서 오버레이 사용 가능.",
      OWNER: "전체 화면에서 오버레이 사용 가능.",
      MANAGER: "전체 화면에서 오버레이 사용 가능.",
      FC: "본인 접근 가능 화면에서만 오버레이 사용.",
      TRAINER: "본인 접근 가능 화면에서만 오버레이 사용.",
      STAFF: "본인 접근 가능 화면에서만 오버레이 사용."
    },
    policyPending: true
  },
  {
    id: "SCR-108",
    title: "에러 페이지",
    domain: "D01",
    route: "/error",
    source: v2Source,
    feature: "MFN-SCR-108",
    purpose:
      "권한 없는 URL 접근(403)·존재하지 않는 화면(404)·서버 오류(500) 등 공통 에러 상태를 안내(V2 신규). 홈으로 이동·다시 시도·관리자 문의 CTA 제공.",
    tabs: ["403 권한 없음", "404 찾을 수 없음", "500 서버 오류", "오프라인"],
    metrics: [
      { label: "지원 코드", value: "403 / 404 / 500 / Offline", hint: "4종 분기" },
      { label: "기본 CTA", value: "홈으로 / 다시 시도 / 문의", hint: "공통" },
      { label: "로그", value: "에러 ID 표시", hint: "지원 접수용" },
      { label: "오프라인", value: "네트워크 단절 배너", hint: "캐시 안내" }
    ],
    filters: ["에러 코드 시뮬레이션"],
    tableColumns: ["코드", "상황", "표시 내용", "허용 액션"],
    rows: [
      { 코드: "403", 상황: "권한 없음", "표시 내용": "접근 권한이 없습니다", "허용 액션": "홈으로 / 관리자 문의" },
      { 코드: "404", 상황: "찾을 수 없음", "표시 내용": "요청한 화면을 찾을 수 없습니다", "허용 액션": "홈으로 / 검색 (Cmd+K)" },
      { 코드: "500", 상황: "서버 오류", "표시 내용": "일시적 오류 발생", "허용 액션": "다시 시도 / 관리자 문의 (에러 ID 표시)" },
      { 코드: "Offline", 상황: "네트워크 단절", "표시 내용": "네트워크 연결이 없습니다", "허용 액션": "재연결 시도 / 캐시 데이터 보기" }
    ],
    dialogs: [],
    primaryActions: [
      { label: "홈으로 이동" },
      { label: "다시 시도" },
      { label: "관리자 문의 (에러 ID 복사)" },
      { label: "이전 페이지" }
    ],
    roleNotes: {
      HQ_ADMIN: "에러 ID 복사·관리자 문의 가능.",
      OWNER: "에러 ID 복사·관리자 문의 가능.",
      MANAGER: "에러 ID 복사·관리자 문의 가능.",
      FC: "에러 ID 복사·관리자 문의 가능.",
      TRAINER: "에러 ID 복사·관리자 문의 가능.",
      STAFF: "에러 ID 복사·관리자 문의 가능."
    },
    policyPending: true
  },
  {
    id: "SCR-109",
    title: "로그아웃",
    domain: "D01",
    route: "/logout",
    source: v2Source,
    feature: "MFN-SCR-109",
    purpose:
      "로그아웃 처리 후 짧은 안내 화면을 거쳐 로그인 화면(/login)으로 이동(V2 신규). 다른 기기 세션 종료 옵션 적용 결과 표시.",
    tabs: ["로그아웃 처리 중", "로그아웃 완료"],
    metrics: [
      { label: "처리 시간", value: "1~2초", hint: "세션 종료" },
      { label: "다른 기기 종료", value: "선택 시 적용", hint: "DLG-001에서 토글" },
      { label: "쿠키/세션 정리", value: "완료", hint: "보안" },
      { label: "복귀 경로", value: "/login", hint: "자동 이동" }
    ],
    filters: ["다른 기기 세션 함께 종료 ON/OFF"],
    tableColumns: ["단계", "처리", "결과"],
    rows: [
      { 단계: "1. 세션 종료 요청", 처리: "DLG-001 확인 후 호출", 결과: "현재 세션 무효" },
      { 단계: "2. 쿠키/로컬 정리", 처리: "auth 토큰 제거", 결과: "재로그인 필요" },
      { 단계: "3. 다른 기기 종료(선택)", 처리: "체크 시 전체 토큰 무효", 결과: "타 기기 자동 로그아웃" },
      { 단계: "4. 안내 → /login", 처리: "1~2초 안내 후 자동 이동", 결과: "로그인 화면" }
    ],
    dialogs: ["DLG-001"],
    primaryActions: [
      { label: "로그아웃 확인 (DLG-001)", dialogId: "DLG-001" },
      { label: "다른 기기 세션 함께 종료" },
      { label: "로그인 화면으로 즉시 이동" }
    ],
    roleNotes: {
      HQ_ADMIN: "본인 세션 종료. 타 직원 강제 로그아웃은 D09 권한 관리에서.",
      OWNER: "본인 세션 종료.",
      MANAGER: "본인 세션 종료.",
      FC: "본인 세션 종료.",
      TRAINER: "본인 세션 종료.",
      STAFF: "본인 세션 종료."
    },
    policyPending: true
  }
];
