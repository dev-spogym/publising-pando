import type { DialogDefinition, ScreenDefinition } from "../registry";

// D10 본사관리 화면/다이얼로그 인벤토리.
// docs4 V1+V2 원문(share/docs4/V1·V2/D10-본사관리/본사관리.md) 기준으로 정렬했다.
// V1+V2 공통 SCR/DLG는 registry.ts의 자동 sources 주입에 위임하고, V2 신규 SCR은 sources를 인라인 명시한다.

export const d10Dialogs: DialogDefinition[] = [
  {
    id: "DLG-092-001",
    title: "신규 지점 등록",
    domain: "D10",
    source: "share/docs4/V1/D10-본사관리/본사관리.md:712",
    purpose:
      "새로운 지점의 기본 정보를 입력하여 시스템에 등록하는 다이얼로그입니다. 등록 완료 후 해당 지점의 초기 Owner(지점장) 계정 또는 권한이 생성되고 본사 표준 정책 세트 적용과 온보딩 절차가 시작됩니다.",
    components: [
      "지점명",
      "지점 코드",
      "대표 연락처",
      "주소 / 주소 검색",
      "운영 시작일",
      "초기 Owner(지점장) 지정 (기존 직원 또는 신규 초대 이메일)",
      "본사 표준 정책 세트 적용 안내",
      "수용 가능 회원 수 (선택)",
      "취소 / 등록"
    ]
  },
  {
    id: "DLG-092-002",
    title: "지점 비활성화 확인",
    domain: "D10",
    source: "share/docs4/V1/D10-본사관리/본사관리.md:830",
    purpose:
      "지점을 임시휴업 또는 폐점 상태로 변경하기 전 영향 범위를 안내하고 최종 확인을 받는 다이얼로그입니다. 변경은 회원 이용, 예약, 신규 가입, 회원앱 노출, 직원 접근에 영향을 줄 수 있어 영향 범위 확인 후 확정합니다.",
    components: [
      "대상 지점명 / 지점 코드",
      "현재 운영 상태",
      "변경 후 상태 (임시휴업 / 폐점)",
      "적용 예정일 (즉시 / 날짜 지정)",
      "변경 사유 (필수)",
      "활성 회원 수 / 진행 예약 수",
      "신규 가입·결제·예약 차단 여부",
      "회원앱 지점 노출 변경",
      "직원 계정 접근 영향",
      "취소 / 운영 상태 변경"
    ],
    destructive: true
  },
  {
    id: "DLG-094-001",
    title: "매출 목표 설정",
    domain: "D10",
    source: "share/docs4/V1/D10-본사관리/본사관리.md:946",
    purpose:
      "KPI 대시보드에서 지점별 월 매출 목표를 설정하는 다이얼로그입니다. 목표 수치 설정 후 KPI 카드에서 실적 대비 달성률을 확인할 수 있습니다.",
    components: [
      "대상 지점 (전체 일괄 / 개별)",
      "목표 적용 기간",
      "지점별 월 매출 목표 금액",
      "전년 동기 실적 참고",
      "취소 / 저장"
    ],
    requiredPermission: "targetManage"
  },
  {
    id: "DLG-098-001",
    title: "태스크 추가",
    domain: "D10",
    source: "share/docs4/V1/D10-본사관리/본사관리.md:1009",
    purpose: "오늘의 할 일 화면에서 새로운 업무 항목을 추가하는 다이얼로그입니다.",
    components: [
      "할 일 제목 (필수)",
      "할 일 상세 설명",
      "우선순위 (높음 / 보통 / 낮음)",
      "담당자 (기본값: 본인)",
      "마감 시각",
      "취소 / 추가"
    ]
  },
  {
    id: "DLG-098-002",
    title: "태스크 상세 수정",
    domain: "D10",
    source: "share/docs4/V1/D10-본사관리/본사관리.md:1059",
    purpose: "오늘의 할 일 목록에서 기존 업무 항목의 내용을 수정하는 다이얼로그입니다.",
    components: [
      "할 일 제목 (기존 내용 자동 로드)",
      "할 일 상세 설명",
      "우선순위",
      "담당자",
      "마감 시각",
      "완료 여부 토글",
      "취소 / 저장"
    ]
  },
  {
    id: "DLG-H1001-001",
    title: "정책 세트 편집",
    domain: "D10",
    source: "share/docs4/V1/D10-본사관리/본사관리.md:1110",
    purpose:
      "본사가 자동화 정책 세트를 생성하거나 수정하는 다이얼로그입니다. 만료 알림 정책은 회원 이용권 만료 / 결제기한 만료 / 락커 만료로 분리해 생성하며, 결제기한 만료는 지점 추가 step을 허용하지 않습니다.",
    components: [
      "기본정보 (정책명, 정책 유형)",
      "정책 유형 (회원 이용권 만료 / 결제기한 만료 / 락커 만료 / 수업 운영 / 운영 자동화)",
      "적용 범위",
      "스텝 리스트 (기준일 D-숫자/D-Day/D+숫자)",
      "지점 추가 step 허용",
      "결제기한 만료 세부 설정 (미수/연체 알림 N일, 반복 주기, 발송 시각)",
      "기본 채널 (회원앱 Push 기본, KakaoTalk fallback 선택)",
      "지점 수정 허용 범위"
    ]
  }
];

export const d10Screens: ScreenDefinition[] = [
  // ===== V2 신규 (V2 only) =====
  {
    id: "SCR-090",
    title: "지점 대시보드",
    domain: "D10",
    route: "/hq/branch-dashboard",
    source: "share/docs4/V2/D10-본사관리/본사관리.md:38",
    feature: "DASH-01 (V2 신규)",
    purpose:
      "Owner(지점장)/매니저/FC/트레이너/스태프/readonly가 로그인 직후 진입하는 지점 운영 메인 화면. 회원 현황·매출·출석·주의 대상(만료 step·생일·미수금·홀딩)·최근 활동을 종합 표시합니다. (V2 명시 URL: /. publishing prototype은 SCR-101과의 라우트 충돌을 피해 /hq/branch-dashboard에 매핑)",
    tabs: ["요약", "분포", "추이", "주의 대상", "최근 활동"],
    metrics: [
      { label: "전체 회원 수", value: "—", hint: "지점 기준" },
      { label: "활성 회원 수", value: "—", hint: "지점 기준" },
      { label: "만료 알림 대상", value: "—", hint: "HQ-09 step 기준" },
      { label: "오늘 출석", value: "—", hint: "실시간" },
      { label: "이번 달 매출", value: "—", hint: "월 누적" }
    ],
    filters: ["지점 (본사 모드)", "기간"],
    tableColumns: ["발생 시각", "작업자", "작업 유형", "대상", "요약"],
    rows: [
      { "발생 시각": "10:24", 작업자: "이FC", "작업 유형": "회원 등록", 대상: "신규 회원", 요약: "강남점 신규 등록" }
    ],
    dialogs: [],
    primaryActions: [{ label: "수동 새로고침" }, { label: "전체보기 (감사 로그)" }],
    roleNotes: {
      HQ_ADMIN: "본사 모드는 / route에서 SCR-101 통합 대시보드. 지점 전환 시 본 화면을 선택 지점 기준으로 봄.",
      OWNER: "소속 지점 대시보드만 노출.",
      MANAGER: "소속 지점 대시보드 조회.",
      FC: "권한 내 위젯만 상세 이동 가능.",
      TRAINER: "권한 내 위젯만 상세 이동 가능.",
      STAFF: "조회 전용. readonly는 회원 상세 진입 차단."
    },
    sources: {
      v2: {
        version: "V2",
        kind: "screen",
        id: "SCR-090",
        label: "지점 대시보드",
        source: "share/docs4/V2/D10-본사관리/본사관리.md:38"
      }
    }
  },
  {
    id: "SCR-091",
    title: "구버전 슈퍼 대시보드 리다이렉트",
    domain: "D10",
    route: "/super-dashboard",
    source: "share/docs4/V2/D10-본사관리/본사관리.md:194",
    feature: "HQ-01 (V2 신규)",
    purpose:
      "구버전 슈퍼 대시보드 진입 경로 보존용 호환 화면. superAdmin/primary는 / route의 SCR-101로, 지점 권한은 SCR-090으로 분기합니다. 별도 KPI/히스토리 UI 없이 공통 로딩·접근 제한 상태만 표시합니다.",
    tabs: ["리다이렉트"],
    metrics: [
      { label: "문서 섹션", value: "SCR-091", hint: "share/docs4/V2/D10-본사관리/본사관리.md" },
      { label: "분기 대상", value: "SCR-101 / SCR-090", hint: "권한 분기" }
    ],
    filters: [],
    tableColumns: ["권한", "이동 대상", "동작"],
    rows: [
      { 권한: "superAdmin / primary", "이동 대상": "/ (SCR-101)", 동작: "통합 대시보드" },
      { 권한: "Owner(지점장) 외", "이동 대상": "/ (SCR-090)", 동작: "지점 대시보드" },
      { 권한: "세션 없음", "이동 대상": "/login", 동작: "로그인 안내" }
    ],
    dialogs: [],
    primaryActions: [{ label: "신규 대시보드로 이동" }],
    roleNotes: {
      HQ_ADMIN: "/ route의 SCR-101로 자동 이동.",
      OWNER: "/ route의 SCR-090로 자동 이동."
    },
    policyPending: true,
    sources: {
      v2: {
        version: "V2",
        kind: "screen",
        id: "SCR-091",
        label: "구버전 슈퍼 대시보드 리다이렉트",
        source: "share/docs4/V2/D10-본사관리/본사관리.md:194"
      }
    }
  },
  {
    id: "SCR-096",
    title: "온보딩 대시보드",
    domain: "D10",
    route: "/onboarding",
    source: "share/docs4/V2/D10-본사관리/본사관리.md:526",
    feature: "HQ-05 (V2 신규)",
    purpose:
      "신규 회원의 초기 정착 과정을 단계별로 추적하는 화면. 리드 유입 → 등록 → 초기 출석 정착 퍼널과 이탈 위험 회원을 조기에 파악합니다.",
    tabs: ["프리-온보딩 KPI", "신규 유치", "신규 안정", "가입경로 분포", "신규 회원 목록"],
    metrics: [
      { label: "이번 달 신규 리드", value: "—", hint: "프리-온보딩" },
      { label: "연락 완료", value: "—", hint: "프리-온보딩" },
      { label: "방문 완료", value: "—", hint: "프리-온보딩" },
      { label: "등록 전환", value: "—", hint: "프리-온보딩" },
      { label: "7일 이용률", value: "—", hint: "신규 안정" },
      { label: "30일 활동률", value: "—", hint: "신규 안정" }
    ],
    filters: ["지점", "기간"],
    tableColumns: ["회원명", "첫 결제일", "경과일", "방문 횟수", "PT 체험", "GX 참여", "온보딩 상태"],
    rows: [],
    dialogs: [],
    primaryActions: [{ label: "이탈위험 회원 보기" }],
    roleNotes: {
      HQ_ADMIN: "선택 지점의 온보딩 현황 조회.",
      OWNER: "자신의 지점 온보딩 현황.",
      MANAGER: "자신의 지점 온보딩 현황.",
      FC: "담당 리드와 신규 회원 중심.",
      TRAINER: "체험·첫 수업 관련 신규 회원."
    },
    policyPending: true,
    sources: {
      v2: {
        version: "V2",
        kind: "screen",
        id: "SCR-096",
        label: "온보딩 대시보드",
        source: "share/docs4/V2/D10-본사관리/본사관리.md:526"
      }
    }
  },
  {
    id: "SCR-H1002",
    title: "커스텀 대시보드 빌더",
    domain: "D10",
    route: "/dashboard/builder",
    source: "share/docs4/V2/D10-본사관리/본사관리.md:856",
    feature: "HQ-10 (V2 신규)",
    purpose:
      "위젯을 드래그앤드롭으로 배치해 자신만의 대시보드를 구성하는 화면. 그리드 열 수(2/3/4)와 위젯별 데이터 범위 설정을 지원하며, 레이아웃 프리셋과 전사 공유 레이아웃을 관리합니다.",
    tabs: ["위젯 라이브러리", "캔버스", "프리셋", "전사 공유"],
    metrics: [
      { label: "최대 위젯", value: "20개", hint: "캔버스 한도" },
      { label: "최대 프리셋", value: "10개", hint: "사용자별" },
      { label: "최대 탭", value: "5개", hint: "캔버스 한도" }
    ],
    filters: ["위젯 카테고리 (매출/회원/출석/수업/공지/할 일)", "위젯 검색"],
    tableColumns: ["위젯명", "카테고리", "데이터 소스", "마지막 갱신"],
    rows: [],
    dialogs: [],
    primaryActions: [
      { label: "위젯 추가" },
      { label: "레이아웃 저장" },
      { label: "기본값으로 초기화" },
      { label: "PNG/PDF 내보내기" }
    ],
    roleNotes: {
      HQ_ADMIN: "전체 위젯 라이브러리. 전사 공유 레이아웃 배포 가능.",
      OWNER: "지점 관련 위젯 레이아웃 구성·저장.",
      MANAGER: "매니저 이하 접근 불가 (403)."
    },
    policyPending: true,
    sources: {
      v2: {
        version: "V2",
        kind: "screen",
        id: "SCR-H1002",
        label: "커스텀 대시보드 빌더",
        source: "share/docs4/V2/D10-본사관리/본사관리.md:856"
      }
    }
  },
  {
    id: "SCR-H1003",
    title: "벤치마크 비교",
    domain: "D10",
    route: "/benchmark",
    source: "share/docs4/V2/D10-본사관리/본사관리.md:947",
    feature: "HQ-11 (V2 신규)",
    purpose:
      "유사 규모·업종 센터와 자사 지점 KPI를 익명 비교하는 화면. 업계 평균/상위 25% 대비 백분위와 강점·개선 필요 인사이트, 액션 아이템을 제공합니다.",
    tabs: ["비교 기준", "벤치마크 차트", "인사이트 요약"],
    metrics: [
      { label: "비교 풀 최소", value: "5개", hint: "센터 수 임계" },
      { label: "지표 최대", value: "6개", hint: "동시 비교" },
      { label: "분석 캐시", value: "1시간 TTL", hint: "동일 조건" }
    ],
    filters: [
      "규모 (소/중/대)",
      "업종 (헬스/필라테스/PT샵/골프/요가/크로스핏/복싱/수영/태권도/스피닝/기타)",
      "지표 (매출/유지율/출석률/신규)",
      "기간 (월간/분기/연간)"
    ],
    tableColumns: ["지표", "당 지점", "업계 평균", "상위 25%", "백분위", "갭"],
    rows: [],
    dialogs: [],
    primaryActions: [{ label: "분석 실행" }, { label: "PDF 다운로드" }],
    roleNotes: {
      HQ_ADMIN: "전체 지점 벤치마크 비교, 비교 기준 설정·내보내기.",
      OWNER: "소속 지점 벤치마크, 비교 기준 설정.",
      MANAGER: "매니저 이하 접근 불가 (403)."
    },
    policyPending: true,
    sources: {
      v2: {
        version: "V2",
        kind: "screen",
        id: "SCR-H1003",
        label: "벤치마크 비교",
        source: "share/docs4/V2/D10-본사관리/본사관리.md:947"
      }
    }
  },
  {
    id: "SCR-H1005",
    title: "NPS 설문",
    domain: "D10",
    route: "/nps",
    source: "share/docs4/V2/D10-본사관리/본사관리.md:1086",
    feature: "HQ-13 (V2 신규)",
    purpose:
      "회원 대상 NPS(순추천지수) 설문 결과를 조회·분석하고 설문을 발송하는 화면. 추천자/중립/비추천 분류, 키워드 클라우드, 지점별 비교, 발송 주기·채널 관리를 다룹니다.",
    tabs: ["NPS 요약", "추이 차트", "응답 분포", "응답 목록", "설문 발송"],
    metrics: [
      { label: "전체 NPS", value: "—", hint: "-100 ~ +100" },
      { label: "추천자 비율", value: "—", hint: "9~10점" },
      { label: "중립 비율", value: "—", hint: "7~8점" },
      { label: "비추천 비율", value: "—", hint: "0~6점" }
    ],
    filters: ["기간", "지점", "점수 범위 (추천자 9~10 / 중립 7~8 / 비추천 0~6)"],
    tableColumns: ["응답일", "점수", "분류", "회원", "자유 의견"],
    rows: [],
    dialogs: [],
    primaryActions: [
      { label: "설문 발송", policyPending: true },
      { label: "엑셀 다운로드" },
      { label: "PDF 내보내기" }
    ],
    roleNotes: {
      HQ_ADMIN: "전체 지점 NPS 통합 및 지점별 비교. 설문 발송 설정·내보내기.",
      OWNER: "소속 지점 NPS 결과, 설문 발송 설정.",
      MANAGER: "매니저 이하 접근 불가 (403).",
      FC: "회원명·연락처 숨김. 점수·의견만 표시."
    },
    policyPending: true,
    sources: {
      v2: {
        version: "V2",
        kind: "screen",
        id: "SCR-H1005",
        label: "NPS 설문",
        source: "share/docs4/V2/D10-본사관리/본사관리.md:1086"
      }
    }
  },

  // ===== V1+V2 공통 =====
  {
    id: "SCR-092",
    title: "지점 관리",
    domain: "D10",
    route: "/branches",
    source: "share/docs4/V1/D10-본사관리/본사관리.md:21",
    feature: "CTR-01",
    purpose:
      "전체 지점의 현황을 조회하고, 신규 지점을 등록하거나 기존 지점의 상태를 변경하는 화면. 지점 간 회원 이동 신청 및 지점별 통합 성과 비교, V2 통합 비교 탭(상세 분석·내보내기는 SCR-093에서 처리)을 포함합니다.",
    tabs: ["지점 목록", "통합 현황 비교", "검색·필터"],
    metrics: [
      { label: "전체 지점", value: "10", hint: "운영 중 7 · 오픈 예정 1 · 점검 1 · 휴점 1" },
      { label: "운영 중", value: "7", hint: "실운영/매출 집계 대상" },
      { label: "오픈 예정", value: "1", hint: "송도점 2026-06-18 오픈 준비" },
      { label: "임시휴업", value: "1", hint: "대구 수성점 시설 점검" }
    ],
    filters: ["지점명/주소 키워드", "운영 상태 (전체/운영 중/오픈 예정/임시휴업/폐점)", "권역", "점주/매니저", "IoT 동기화 상태", "계약/정산 상태"],
    tableColumns: ["지점명", "지점 코드", "주소", "연락처", "회원 수", "직원 수", "운영 상태", "등록일", "액션"],
    rows: [
      { 지점명: "강남점", "지점 코드": "GN-001", 주소: "서울 강남구 테헤란로 152", 연락처: "02-555-0901", "회원 수": "842", "직원 수": "18", "운영 상태": "운영 중", 등록일: "2024-03-01", 액션: "수정 / 비활성화" },
      { 지점명: "광화문 본점", "지점 코드": "HQ-000", 주소: "서울 종로구 세종대로 178", 연락처: "02-730-0900", "회원 수": "1,126", "직원 수": "24", "운영 상태": "운영 중", 등록일: "2023-11-15", 액션: "수정 / 비교" },
      { 지점명: "서초점", "지점 코드": "SC-002", 주소: "서울 서초구 강남대로 369", 연락처: "02-3477-0902", "회원 수": "615", "직원 수": "14", "운영 상태": "운영 중", 등록일: "2024-05-10", 액션: "수정 / 비활성화" },
      { 지점명: "잠실점", "지점 코드": "JS-003", 주소: "서울 송파구 올림픽로 240", 연락처: "02-423-0903", "회원 수": "538", "직원 수": "12", "운영 상태": "운영 중", 등록일: "2024-08-22", 액션: "수정 / 비교" },
      { 지점명: "판교점", "지점 코드": "PG-004", 주소: "경기 성남시 분당구 판교역로 166", 연락처: "031-8016-0904", "회원 수": "412", "직원 수": "10", "운영 상태": "운영 중", 등록일: "2025-01-18", 액션: "수정 / 비교" },
      { 지점명: "여의도점", "지점 코드": "YD-005", 주소: "서울 영등포구 국제금융로 10", 연락처: "02-785-0905", "회원 수": "356", "직원 수": "9", "운영 상태": "운영 중", 등록일: "2025-04-03", 액션: "수정 / 비활성화" },
      { 지점명: "마포점", "지점 코드": "MP-006", 주소: "서울 마포구 월드컵북로 21", 연락처: "02-332-0906", "회원 수": "284", "직원 수": "8", "운영 상태": "운영 중", 등록일: "2025-09-11", 액션: "수정 / 비교" },
      { 지점명: "송도점", "지점 코드": "SD-007", 주소: "인천 연수구 송도과학로 32", 연락처: "032-831-0907", "회원 수": "128", "직원 수": "6", "운영 상태": "오픈 예정", 등록일: "2026-06-18", 액션: "오픈 준비 / 수정" },
      { 지점명: "부산 센텀점", "지점 코드": "BS-008", 주소: "부산 해운대구 센텀남대로 35", 연락처: "051-742-0908", "회원 수": "302", "직원 수": "8", "운영 상태": "점검", 등록일: "2025-12-01", 액션: "점검 해제 / 수정" },
      { 지점명: "대구 수성점", "지점 코드": "DG-009", 주소: "대구 수성구 달구벌대로 2435", 연락처: "053-756-0909", "회원 수": "0", "직원 수": "3", "운영 상태": "임시휴업", 등록일: "2026-02-14", 액션: "재개 / 폐점 검토" }
    ],
    dialogs: ["DLG-092-001", "DLG-092-002"],
    primaryActions: [
      { label: "신규 지점 등록", dialogId: "DLG-092-001" },
      { label: "비활성화 / 운영 상태 변경", dialogId: "DLG-092-002", danger: true }
    ],
    roleNotes: {
      HQ_ADMIN: "전체 지점 목록 + 신규 등록·수정·비활성화·비교.",
      OWNER: "소속 지점 정보만 수정 가능.",
      MANAGER: "매니저 이하 접근 불가."
    }
  },
  {
    id: "SCR-093",
    title: "지점 성과 리포트",
    domain: "D10",
    route: "/branch-report",
    source: "share/docs4/V1/D10-본사관리/본사관리.md:150",
    feature: "HQ-04",
    purpose:
      "지점별 매출·회원·수업 성과를 비교 분석하는 리포트 화면. 기간별 추이와 인기 수업(예약률+출석률), 목표 달성률을 분석하며 V2 엑셀/PDF 내보내기를 포함합니다.",
    tabs: ["매출 성과", "회원 성과", "수업 성과", "내보내기"],
    metrics: [
      { label: "표본 부족 기준", value: "10명 미만", hint: "예약 인원 합계" },
      { label: "다중 지점 한도", value: "10개", hint: "선택 제한" },
      { label: "캐시", value: "5분", hint: "자동 재조회" }
    ],
    filters: [
      "조회 기간 (주간/월간/분기/연간/직접 입력)",
      "지점 (전체 또는 복수 선택)",
      "비교 기준 (전기간 대비/지점 간 비교)",
      "휴업·폐점 지점 토글"
    ],
    tableColumns: ["순위", "지점명", "운영 상태", "총매출", "활성 회원", "출석 수", "출석률", "매출 증감률", "상세"],
    rows: [],
    dialogs: [],
    primaryActions: [{ label: "엑셀 다운로드" }, { label: "PDF 다운로드" }],
    roleNotes: {
      HQ_ADMIN: "전체 지점 성과 비교, 필터 변경·내보내기.",
      OWNER: "소속 지점 데이터, 기간 필터·내보내기.",
      MANAGER: "매니저 이하 접근 불가."
    }
  },
  {
    id: "SCR-094",
    title: "KPI 대시보드",
    domain: "D10",
    route: "/kpi",
    source: "share/docs4/V1/D10-본사관리/본사관리.md:1212",
    feature: "HQ-02",
    purpose:
      "핵심 성과 지표(KPI)의 달성 현황을 시각화하여 목표 대비 실적을 한눈에 파악하는 화면. 24종 KPI 카드(매출 달성률·GX·강습세션수·상담 퍼널·재등록/이탈 회복·OT)를 같은 화면 안에서 차트·테이블 영역과 함께 표시합니다.",
    tabs: ["KPI 카드", "목표 달성 추이", "지점별 비교", "OT/수업 운영", "상담·퍼널"],
    metrics: [
      { label: "매출 달성률", value: "—", hint: "기간 내 결제 ÷ 월 목표" },
      { label: "신규 회원 달성률", value: "—", hint: "첫 결제 신규 ÷ 신규 목표" },
      { label: "출석률 달성률", value: "—", hint: "출석 ÷ 예약 확정" },
      { label: "회원 유지율 달성률", value: "—", hint: "활성 회원 ÷ 시작 회원" }
    ],
    filters: ["기간", "지점", "보조 지표 토글"],
    tableColumns: ["지점명", "매출 달성률", "신규 회원 달성률", "출석률 달성률", "상세"],
    rows: [],
    dialogs: ["DLG-094-001"],
    primaryActions: [{ label: "매출 목표 설정", dialogId: "DLG-094-001", permission: "targetManage" }],
    roleNotes: {
      HQ_ADMIN: "전체 지점 KPI 통합 + 목표 설정·지점별 비교.",
      OWNER: "소속 지점 KPI, 소속 지점 목표 설정.",
      MANAGER: "매니저 이하 접근 불가."
    }
  },
  {
    id: "SCR-095",
    title: "KPI 센터",
    domain: "D10",
    route: "/kpi-preview",
    source: "share/docs4/V1/D10-본사관리/본사관리.md:267",
    feature: "HQ-03",
    purpose:
      "역할별로 맞춤화된 KPI 보드를 제공하는 종합 센터 화면. 본사 / 지점 / FC / 트레이너 / 운영 5개 관점에서 핵심 지표, 액션 큐, 성과 랭킹, 단계별 퍼널, 데이터 인사이트를 한 화면에서 확인합니다.",
    tabs: ["본사", "지점", "FC", "트레이너", "운영"],
    metrics: [
      { label: "데이터 인사이트", value: "3개 코멘트", hint: "원인 / 위험 / 다음 액션" },
      { label: "FC 퍼널", value: "WI / TI", hint: "방문 / 전화 문의" },
      { label: "트레이너 OT", value: "1차 / 2차", hint: "완료·예정" }
    ],
    filters: ["보드 탭", "기간", "지점"],
    tableColumns: ["우선순위", "업무", "대상", "마감", "담당", "상태"],
    rows: [],
    dialogs: [],
    primaryActions: [{ label: "Today Tasks 이동" }, { label: "매출 / 회원 / 알림 바로가기" }],
    roleNotes: {
      HQ_ADMIN: "전체 보드 탭 전환, 전체 지점 지표.",
      OWNER: "지점·FC·운영 보드 확인.",
      MANAGER: "지점·운영 보드.",
      FC: "FC 보드, 담당 리드·상담 액션 큐.",
      TRAINER: "트레이너 보드, 담당 수업·회원 KPI.",
      STAFF: "운영 보드, 출석·미수·운영 액션."
    }
  },
  {
    id: "SCR-097",
    title: "히스토리 로그",
    domain: "D10",
    route: "/audit-log",
    source: "share/docs4/V1/D10-본사관리/본사관리.md:386",
    feature: "HQ-EXT-06",
    purpose:
      "시스템 내에서 발생한 주요 작업 이력을 기록하고 조회하는 화면. 누가/언제/무엇을 했는지 추적하여 보안 감사, 문제 원인 파악, 운영 투명성에 활용합니다. V2 엑셀 내보내기를 지원합니다.",
    tabs: ["로그 목록", "상세 펼침", "내보내기"],
    metrics: [
      { label: "기본 조회", value: "최근 7일", hint: "최신순" },
      { label: "내보내기", value: "엑셀", hint: "V2 추가" }
    ],
    filters: [
      "작업자 이름/계정 검색",
      "지점",
      "작업 유형 (로그인/회원/결제/설정/권한/데이터 삭제)",
      "기간"
    ],
    tableColumns: ["작업 일시", "작업자", "지점", "작업 유형", "작업 대상", "작업 상세"],
    rows: [],
    dialogs: [],
    primaryActions: [{ label: "엑셀 다운로드" }],
    roleNotes: {
      HQ_ADMIN: "전체 지점 로그, 필터·내보내기.",
      OWNER: "소속 지점 로그, 필터·내보내기.",
      MANAGER: "매니저 이하 접근 불가."
    }
  },
  {
    id: "SCR-098",
    title: "오늘의 할 일",
    domain: "D10",
    route: "/today-tasks",
    source: "share/docs4/V1/D10-본사관리/본사관리.md:446",
    feature: "HQ-06",
    purpose:
      "오늘 처리해야 할 업무 목록을 관리하는 화면. 직원 개인별·지점 공유 할 일을 등록·수정·완료 체크하고, 수업 일정 요청(CLS-09) 미처리 건수를 시스템 태스크로 노출합니다.",
    tabs: ["전체", "미완료", "완료"],
    metrics: [
      { label: "긴급 태스크", value: "—", hint: "코크핏 상단" },
      { label: "회원 대응", value: "—", hint: "코크핏 상단" },
      { label: "자동화 후보", value: "—", hint: "코크핏 상단" },
      { label: "일정 요청 미처리", value: "—", hint: "24h 초과 시 긴급" }
    ],
    filters: ["탭 (전체/미완료/완료)", "담당자", "우선순위"],
    tableColumns: ["완료", "제목", "우선순위", "출처", "담당자", "마감", "액션"],
    rows: [],
    dialogs: ["DLG-098-001", "DLG-098-002"],
    primaryActions: [
      { label: "할 일 추가", dialogId: "DLG-098-001" },
      { label: "상세 수정", dialogId: "DLG-098-002" }
    ],
    roleNotes: {
      HQ_ADMIN: "전체 지점 할 일 목록, 추가·수정·삭제·완료.",
      OWNER: "소속 지점 할 일 목록, 추가·수정·삭제·완료.",
      MANAGER: "본인 담당 + 배정 받은 항목, 추가·수정·삭제·완료.",
      FC: "본인 배정 항목만 조회 및 완료 처리.",
      TRAINER: "본인 배정 항목만 조회 및 완료 처리.",
      STAFF: "본인 배정 항목만 조회 및 완료 처리."
    }
  },
  {
    id: "SCR-099",
    title: "리포트 생성",
    domain: "D10",
    route: "/reports",
    source: "share/docs4/V1/D10-본사관리/본사관리.md:539",
    feature: "HQ-07",
    purpose:
      "원하는 기간과 항목을 선택하여 운영 보고서를 생성하고 엑셀·PDF로 내보내는 화면. 정기 보고, 경영진 보고, 고객 제출용 등 다양한 목적의 리포트를 맞춤 생성하며 V2 상담 전환 분석 옵션과 생성 이력을 포함합니다.",
    tabs: ["리포트 설정", "미리보기", "생성 이력"],
    metrics: [
      { label: "리포트 유형", value: "5종", hint: "매출/회원/출석/수업/종합" },
      { label: "V2 옵션", value: "상담 전환 분석", hint: "퍼널 데이터" },
      { label: "내보내기", value: "엑셀 / PDF / 인쇄", hint: "V2 확장" }
    ],
    filters: ["리포트 유형", "조회 기간 (이번 주/이번 달/분기/연간/직접)", "대상 지점", "포함 항목 (체크박스)"],
    tableColumns: ["생성일", "유형", "기간", "지점", "생성자", "다운로드"],
    rows: [],
    dialogs: [],
    primaryActions: [{ label: "리포트 생성" }, { label: "엑셀 다운로드" }, { label: "PDF 다운로드" }],
    roleNotes: {
      HQ_ADMIN: "전체 지점 리포트, 모든 유형 생성·내보내기.",
      OWNER: "소속 지점 리포트.",
      MANAGER: "매니저 이하 접근 불가."
    }
  },
  {
    id: "SCR-H1001",
    title: "자동화 정책 라이브러리",
    domain: "D10",
    route: "/hq/automation-policies",
    source: "share/docs4/V1/D10-본사관리/본사관리.md:1393",
    feature: "HQ-09",
    purpose:
      "본사가 전사 자동화 정책 세트를 관리하는 화면. 만료 알림 3종(회원 이용권 / 결제기한 / 락커)과 수업 운영·운영 자동화 정책 세트를 생성·복제·중지·배포·시뮬레이션합니다. 회원 이용권 만료·락커 만료만 지점 추가 step을 허용하고 결제기한 만료는 본사 step만 사용합니다.",
    tabs: ["정책 세트 카드", "정책 세트 테이블", "Step 미리보기", "지점 적용 현황"],
    metrics: [
      { label: "정책 유형", value: "5종", hint: "회원 이용권/결제기한/락커/수업 운영/운영 자동화" },
      { label: "기본 채널", value: "회원앱 Push", hint: "KakaoTalk fallback 선택" },
      { label: "지점 ON/OFF", value: "—", hint: "Owner(지점장)만" }
    ],
    filters: ["정책 유형 (전체/회원 이용권/결제기한/락커/수업 운영/운영 자동화)"],
    tableColumns: ["정책명", "정책 유형", "버전", "적용 범위", "본사 step 수", "지점 추가 step", "ON/OFF 현황", "마지막 배포", "상태", "액션"],
    rows: [],
    dialogs: ["DLG-H1001-001"],
    primaryActions: [
      { label: "정책 세트 생성", dialogId: "DLG-H1001-001" },
      { label: "배포" },
      { label: "시뮬레이션" },
      { label: "PDF 내보내기" },
      { label: "중지", danger: true }
    ],
    roleNotes: {
      HQ_ADMIN: "정책 세트 생성·수정·복제·중지·배포·시뮬레이션 가능.",
      OWNER: "본사 정책 라이브러리 접근 불가. 지점 적용 상태는 D09 SCR-080A에서 조회.",
      MANAGER: "접근 불가 (403).",
      FC: "접근 불가 (403).",
      TRAINER: "접근 불가 (403).",
      STAFF: "접근 불가 (403)."
    }
  },
  {
    id: "SCR-H1004",
    title: "예측 분석",
    domain: "D10",
    route: "/analytics/forecast",
    source: "share/docs4/V1/D10-본사관리/본사관리.md:600",
    feature: "HQ-EXT-03",
    purpose:
      "AI 기반 분석을 활용해 향후 매출·회원 수·이탈률 등을 예측하는 화면. 과거 데이터 패턴 학습으로 미래 운영 계획 수립과 선제적 대응에 활용하며, 시나리오 비교(낙관/기본/보수)와 이탈 위험 회원 인사이트를 제공합니다.",
    tabs: ["예측 항목 설정", "결과 차트", "시나리오 비교", "예측 인사이트"],
    metrics: [
      { label: "예측 지표", value: "4종", hint: "매출/신규/이탈/출석률" },
      { label: "예측 기간", value: "1·3·6·12개월", hint: "선택" },
      { label: "데이터 최소", value: "6개월", hint: "학습 임계" },
      { label: "타임아웃", value: "60초", hint: "백그라운드 전환" }
    ],
    filters: ["예측 지표", "예측 기간", "대상 지점"],
    tableColumns: ["시나리오", "예측 기준값", "시작 대비 증감", "증감률", "신뢰 구간", "주요 해석"],
    rows: [
      { 시나리오: "낙관", "예측 기준값": "—", "시작 대비 증감": "—", 증감률: "—", "신뢰 구간": "상단", "주요 해석": "—" },
      { 시나리오: "기본", "예측 기준값": "—", "시작 대비 증감": "—", 증감률: "—", "신뢰 구간": "중앙", "주요 해석": "—" },
      { 시나리오: "보수", "예측 기준값": "—", "시작 대비 증감": "—", 증감률: "—", "신뢰 구간": "하단", "주요 해석": "—" }
    ],
    dialogs: [],
    primaryActions: [{ label: "예측 실행" }, { label: "재학습 요청" }, { label: "PDF 내보내기" }],
    roleNotes: {
      HQ_ADMIN: "전체 지점 예측 분석, 항목·기간 설정·내보내기.",
      OWNER: "소속 지점 예측, 항목·기간 설정.",
      MANAGER: "매니저 이하 접근 불가 (403)."
    },
    policyPending: true
  }
];
