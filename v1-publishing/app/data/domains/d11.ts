import type { DialogDefinition, ScreenDefinition } from "../registry";

// D11 통합운영 화면/다이얼로그 인벤토리.
// docs4 V1+V2 원문(share/docs4/V1·V2/D11-통합운영/통합운영.md) 기준으로 정렬했다.
// V1+V2 공통 SCR/DLG는 registry.ts의 자동 sources 주입에 위임한다.
// SCR-I006(체성분 통합 관리)은 docs4상 D02 SCR-M006과 동일 /body-composition route를 공유하지만,
// publishing prototype은 1:1 라우트 매핑이 필요해 /body-composition-2로 분리해 표시한다.

export const d11Dialogs: DialogDefinition[] = [
  {
    id: "DLG-I001",
    title: "수동 출석 등록",
    domain: "D11",
    source: "share/docs4/V1/D11-통합운영/통합운영.md:781",
    purpose:
      "키오스크·QR 등 기기를 통한 출석이 불가한 상황에서 관리자(스태프)가 직접 회원 또는 직원의 출석을 수동으로 등록하는 다이얼로그입니다. 별도 기기 없이 시스템에서 직접 출석 처리가 가능합니다.",
    components: [
      "구분 (회원 / 직원) (필수)",
      "이름 또는 번호 검색 (회원명/회원번호/사번) (필수)",
      "출석 시각 (필수, 기본 현재 시각)",
      "비고 (수동 등록 사유)",
      "취소 / 등록"
    ]
  },
  {
    id: "DLG-I002",
    title: "옷 락커 배정",
    domain: "D11",
    source: "share/docs4/V1/D11-통합운영/통합운영.md:883",
    purpose:
      "출석 완료 후 옷 락커가 미배정 상태인 회원에게 빈 락커를 선택해 배정하는 다이얼로그입니다. 통합 출석 관리(SCR-I001) 또는 옷 락커 운영 관리(SCR-I004)에서 호출되는 팝업 형태입니다.",
    components: [
      "회원명 / 출석 시각 / 이용권 상품명·유형 / 고정 락커 (읽기 전용)",
      "빈 락커 목록 (번호 순)",
      "락커 상태 (선택 가능 / 사용 중 / 점검 중)",
      "취소 / 배정"
    ]
  },
  {
    id: "DLG-I003",
    title: "체성분 수기 등록",
    domain: "D11",
    source: "share/docs4/V1/D11-통합운영/통합운영.md:711",
    purpose:
      "InBody 등 측정 장비 없이 관리자가 직접 체성분 수치를 수동으로 입력하여 등록하는 다이얼로그입니다. 측정지 원본을 보고 수기로 전산화하거나 장비 연동이 불가한 환경에서 임시 등록 시 사용합니다.",
    components: [
      "회원 검색 (필수)",
      "측정일시 (필수, 기본 현재 시각)",
      "체중 (kg) (필수)",
      "골격근량 (kg)",
      "체지방량 (kg)",
      "체지방률 (%)",
      "BMI",
      "기초대사량 (kcal)",
      "체수분 (L)",
      "비고",
      "취소 / 등록"
    ],
    requiredPermission: "bodyWrite"
  }
];

export const d11Screens: ScreenDefinition[] = [
  {
    id: "SCR-I001",
    title: "통합 출석 관리",
    domain: "D11",
    route: "/attendance",
    source: "share/docs4/V1/D11-통합운영/통합운영.md:32",
    feature: "IOT-07",
    purpose:
      "회원과 직원의 출석 현황을 하나의 화면에서 실시간 통합 조회·관리합니다. 키오스크 QR / 얼굴인식 / 앱 QR / 수동 입력 채널을 통합 집계하며, 출석 후 옷 락커 배정 상태까지 함께 확인합니다. V2는 실시간 출석 확인 카드(SCR-101 위젯과 동일)를 일별 뷰 상단에 배치합니다.",
    tabs: ["출석 테이블", "실시간 카드", "최근 이벤트"],
    metrics: [
      { label: "오늘 총 출석", value: "—", hint: "회원 + 직원 합산" },
      { label: "현재 센터 내", value: "—", hint: "입장 후 미퇴실" },
      { label: "미배정 락커", value: "—", hint: "출석 완료·락커 미배정" },
      { label: "실패 건수", value: "—", hint: "만료·미등록·미수 차단 등 (중복 제외)" }
    ],
    filters: [
      "기간 (오늘/이번 주/이번 달/직접)",
      "구분 (전체/회원/직원/게스트)",
      "결과 (전체/성공/실패/중복/퇴실)",
      "채널 (앱 QR/키오스크 QR/얼굴인식/수동)",
      "락커 상태 (전체/미배정/수동배정/자동배정/대상 아님)",
      "검색 (이름/연락처/회원번호/사번)"
    ],
    tableColumns: ["시간", "구분", "이름", "채널", "결과", "옷 락커", "고정 락커", "비고"],
    rows: [
      { 시간: "10:24", 구분: "회원", 이름: "김민준 #M0001", 채널: "앱 QR", 결과: "성공", "옷 락커": "자동배정 12", "고정 락커": "-", 비고: "-" }
    ],
    dialogs: ["DLG-I001", "DLG-I002"],
    primaryActions: [
      { label: "수동 출석 등록", dialogId: "DLG-I001" },
      { label: "락커 배정", dialogId: "DLG-I002" },
      { label: "실패 로그" },
      { label: "최근 이벤트" }
    ],
    roleNotes: {
      HQ_ADMIN: "지점 선택 후 전 지점 현황 조회 가능.",
      OWNER: "전체 기능 사용, 수동 등록·퇴실 처리.",
      MANAGER: "전체 기능 사용, 수동 등록·퇴실 처리.",
      FC: "조회 및 락커 배정.",
      TRAINER: "조회만 가능, 수동 등록·퇴실 불가.",
      STAFF: "조회 및 락커 배정, 설정 변경 불가."
    }
  },
  {
    id: "SCR-I004",
    title: "옷 락커 운영 관리",
    domain: "D11",
    route: "/clothing-locker",
    source: "share/docs4/V1/D11-통합운영/통합운영.md:240",
    feature: "FAC-EXT-01, IOT-04",
    purpose:
      "출석과 연동되는 당일용 옷 락커를 실시간 운영합니다. 락커 그리드에서 사용 현황을 한눈에 파악하고 출석 완료 후 미배정 회원에게 락커를 배정·회수합니다. V2는 만료 임박 자동 감지, 50건 초과 chunked 일괄 처리, FAC-EXT-02 수리 접수 연계를 포함합니다.",
    tabs: ["락커 그리드", "미배정 회원 패널"],
    metrics: [
      { label: "전체 락커 수", value: "—", hint: "지점 등록 총 수량" },
      { label: "사용 중", value: "—", hint: "배정 완료" },
      { label: "미배정 대기", value: "—", hint: "출석 완료·미배정" },
      { label: "점검 중", value: "—", hint: "고장·청소" }
    ],
    filters: ["상태 (빈/사용 중/만료 임박/반납 지연/점검 중)"],
    tableColumns: ["락커 번호", "상태", "회원명", "출석 시각", "이용권 상품/유형", "액션"],
    rows: [],
    dialogs: ["DLG-I002"],
    primaryActions: [
      { label: "회원 배정", dialogId: "DLG-I002" },
      { label: "회수" },
      { label: "고장 처리" },
      { label: "복구" },
      { label: "일괄 해제" },
      { label: "엑셀 다운로드" }
    ],
    roleNotes: {
      OWNER: "전체 기능 (배정·회수·고장 처리·일괄 해제).",
      MANAGER: "전체 기능 (배정·회수·고장 처리·일괄 해제).",
      STAFF: "배정·회수 가능, 일괄 해제는 관리자 승인 필요.",
      TRAINER: "조회만 가능."
    }
  },
  {
    id: "SCR-I005",
    title: "고정 물품 락커 관리",
    domain: "D11",
    route: "/locker/fixed-assets",
    source: "share/docs4/V1/D11-통합운영/통합운영.md:351",
    feature: "FAC-EXT-01, IOT-04",
    purpose:
      "상품 계약 기반으로 회원에게 장기 배정하는 개인 소지품 보관 락커를 관리합니다. 배정 현황·신규 배정·만료 연장·회수를 처리하며 만료 예정 회원을 사전 관리합니다. V2는 D06 SCR-051 사물함 배정 관리와 동일 라우트에서 탭으로 표시되며 사용 가능 상태의 락커에만 배정 가능합니다.",
    tabs: ["개인 물품", "골프", "프리미엄"],
    metrics: [
      { label: "전체 고정 락커", value: "—", hint: "등록 총 수량" },
      { label: "배정 중", value: "—", hint: "현재 회원 배정" },
      { label: "만료 예정", value: "—", hint: "HQ-09 락커 만료 step 대상" },
      { label: "회수 대기", value: "—", hint: "계약 만료·미회수" }
    ],
    filters: [
      "상태 (전체/사용 중/만료 예정/만료/회수 대기)",
      "만료 기간 (이번 주/이번 달/직접)",
      "검색 (회원명/락커 번호/상품명)"
    ],
    tableColumns: ["락커 번호", "회원명", "상품명", "배정일", "만료일", "상태", "관리"],
    rows: [],
    dialogs: [],
    primaryActions: [
      { label: "배정하기" },
      { label: "연장" },
      { label: "회수" },
      { label: "상태 동기화" },
      { label: "엑셀 다운로드" }
    ],
    roleNotes: {
      OWNER: "배정·연장·회수·상태 동기화 전체 가능.",
      MANAGER: "배정·연장·회수·상태 동기화 전체 가능.",
      STAFF: "배정·연장 가능, 회수는 관리자 승인 필요.",
      TRAINER: "조회만 가능."
    }
  },
  {
    id: "SCR-I006",
    title: "체성분 통합 관리",
    domain: "D11",
    route: "/body-composition-2",
    source: "share/docs4/V1/D11-통합운영/통합운영.md:470",
    feature: "IOT-05",
    purpose:
      "전체 회원의 체성분 측정 현황을 통합 관리합니다. 관리자 CRM은 InBody 측정기를 제어하지 않고, InBody API로 수신된 측정 사용자와 체성분 정보값을 조회·검수·확정 처리합니다. 수기 등록은 현장 입력 보조 수단이며 장비 파일 업로드·장비 설정은 본 화면 범위에서 제외합니다. docs4상 D02 SCR-M006과 /body-composition을 공유하지만 publishing prototype은 라우트 1:1 매핑을 위해 /body-composition-2로 분리합니다.",
    tabs: ["측정 결과", "수신 로그", "오류 / 검수"],
    metrics: [
      { label: "오늘 측정 건수", value: "—", hint: "금일 완료" },
      { label: "검수 대기", value: "—", hint: "매칭 실패·중복·이상치" },
      { label: "미확정", value: "—", hint: "수집됐지만 미확정" },
      { label: "InBody 수신 상태", value: "—", hint: "최근 API 수신 시각·상태" }
    ],
    filters: ["탭 (측정 결과/수신 로그/오류·검수)", "기간", "회원 검색"],
    tableColumns: ["측정일시", "회원명", "체중", "골격근량", "체지방률", "BMI", "확정 여부"],
    rows: [],
    dialogs: ["DLG-I003"],
    primaryActions: [
      { label: "수기 등록", dialogId: "DLG-I003", permission: "bodyWrite" },
      { label: "수신 로그" },
      { label: "확정 처리" },
      { label: "회원 직접 매칭" },
      { label: "무시" }
    ],
    roleNotes: {
      OWNER: "전체 탭 접근, 검수 처리, 수기 등록 가능.",
      MANAGER: "전체 탭 접근, 검수 처리, 수기 등록 가능.",
      STAFF: "측정 결과 조회 및 수기 등록 가능, 검수 처리는 관리자만.",
      TRAINER: "담당 회원 측정 결과 조회만 가능."
    }
  },
  {
    id: "SCR-I003",
    title: "IoT 연동 관리",
    domain: "D11",
    route: "/iot-overview",
    source: "share/docs4/V1/D11-통합운영/통합운영.md:196",
    feature: "IOT-03",
    purpose:
      "D11은 IoT 장비 등록·삭제·제어 화면을 제공하지 않습니다. 본 화면은 IoT 상태값과 이벤트 수신값을 어디서 표시하는지 안내하는 메타 화면으로, 출입 게이트·키오스크·락커 컨트롤러·InBody 측정기의 상태가 SCR-I001 통합 출석 관리, SCR-I004/I005 락커 운영, SCR-I006/I007 체성분 관리 화면 안에서 표시됨을 명확히 합니다. 기기 등록·설정·TTS·체크인 수단·출입 규칙은 D09 설정관리에서만 처리합니다.",
    tabs: ["허용 액션", "금지 액션", "기기 종류별 표시 위치", "InBody 수신 범위"],
    metrics: [
      { label: "구현 상태", value: "안내 전용", hint: "D11에 독립 운영 화면 없음" },
      { label: "허용 액션", value: "3종", hint: "상태 새로고침·이벤트 조회·관련 화면 이동" },
      { label: "기기 종류", value: "4종", hint: "게이트·키오스크·락커·InBody" },
      { label: "InBody 제어", value: "불가", hint: "API 수신값만 표시" }
    ],
    filters: ["기기 종류 (출입 게이트/키오스크/락커 컨트롤러/InBody)", "표시 화면 이동 (I001/I004/I005/I006/I007)"],
    tableColumns: ["기기 종류", "CRM에서 사용하는 값", "D11 표시 위치", "관련 정책"],
    rows: [
      { "기기 종류": "출입 게이트", "CRM에서 사용하는 값": "출입 성공/실패 이벤트, OK·불안정·오류 상태, 마지막 통신 시각", "D11 표시 위치": "SCR-I001 통합 출석 관리", "관련 정책": "IOT-03-01, IOT-03-02" },
      { "기기 종류": "키오스크", "CRM에서 사용하는 값": "출석 체크인 성공/실패 이벤트, OK·불안정·오류 상태, 마지막 통신 시각", "D11 표시 위치": "SCR-I001 통합 출석 관리", "관련 정책": "IOT-03-08" },
      { "기기 종류": "락커 컨트롤러", "CRM에서 사용하는 값": "락커 잠금·해제 결과, OK·불안정·오류 상태", "D11 표시 위치": "SCR-I004 옷 락커, SCR-I005 고정 물품 락커", "관련 정책": "IOT-04 계열" },
      { "기기 종류": "InBody 측정기", "CRM에서 사용하는 값": "측정 사용자, 측정 시각, 체성분 값", "D11 표시 위치": "SCR-I006 체성분 통합, SCR-I007 회원 건강 연동", "관련 정책": "IOT-03-07" }
    ],
    dialogs: [],
    primaryActions: [
      { label: "통합 출석 관리로 이동 (SCR-I001)" },
      { label: "옷 락커 운영 관리로 이동 (SCR-I004)" },
      { label: "체성분 통합 관리로 이동 (SCR-I006)" },
      { label: "D09 설정관리로 이동(기기 등록·설정·TTS)" }
    ],
    roleNotes: {
      HQ_ADMIN: "메타 안내 화면 조회. 기기 등록·설정 작업은 D09에서 처리.",
      OWNER: "메타 안내 화면 조회. 기기 등록·설정 작업은 D09에서 처리.",
      MANAGER: "메타 안내 화면 조회. 기기 등록·설정 작업은 D09에서 처리.",
      FC: "메타 안내 화면 조회만.",
      TRAINER: "메타 안내 화면 조회만.",
      STAFF: "메타 안내 화면 조회만."
    },
    policyPending: true
  },
  {
    id: "SCR-I007",
    title: "회원 건강 연동 요약",
    domain: "D11",
    route: "/members/health",
    source: "share/docs4/V1/D11-통합운영/통합운영.md:584",
    feature: "IOT-05",
    purpose:
      "회원별 체성분·운동 이력·건강 목표·외부 건강 앱(Health Connect) 연동 상태를 하나의 화면에서 통합 요약합니다. 관리자가 회원 건강 상태를 빠르게 파악하고 상담 근거로 활용합니다. v1 기준 Health Connect는 걸음수/이동 거리/활동 kcal/운동 세션만 요약 반영하며 admin은 조회만 가능합니다.",
    tabs: ["요약 카드", "체성분 이력", "운동 이력", "Health Connect", "활동 데이터 상세"],
    metrics: [
      { label: "최근 출석", value: "—", hint: "마지막 체크인" },
      { label: "오늘 옷 락커", value: "—", hint: "당일 배정 또는 미배정" },
      { label: "고정 락커", value: "—", hint: "보유 시 락커 번호" },
      { label: "최근 InBody", value: "—", hint: "체중/골격근/체지방률" },
      { label: "최근 7일 활동량", value: "—", hint: "걸음수/kcal/운동 일수" }
    ],
    filters: ["회원 선택", "기간"],
    tableColumns: ["측정일", "체중 변화", "골격근량", "체지방률", "BMI"],
    rows: [],
    dialogs: ["DLG-I003"],
    primaryActions: [
      { label: "수기 등록", dialogId: "DLG-I003", permission: "bodyWrite" },
      { label: "상담 메모 바로가기" }
    ],
    roleNotes: {
      OWNER: "전체 건강 요약 조회 및 상담 메모 작성.",
      MANAGER: "전체 건강 요약 조회 및 상담 메모 작성.",
      TRAINER: "담당 회원 체성분·운동 이력 조회.",
      STAFF: "최근 출석·락커 요약 카드만 조회 가능."
    }
  },
  {
    id: "SCR-I008",
    title: "키오스크 운영 현황",
    domain: "D11",
    route: "/kiosk-ops",
    source: "share/docs4/V1/D11-통합운영/통합운영.md:718",
    feature: "IOT-06",
    purpose:
      "본 화면은 D11에 별도 구현하지 않습니다. 키오스크 운영 콘솔·단말 장애 대응·원격 재시작·로그 다운로드·KIO-402 관리자 패널은 KIOSK 기획문서 범위입니다. D11은 키오스크에서 발생한 출석 이벤트와 상태 수신값만 SCR-I001 통합 출석 관리·공통 대시보드 통합 위젯·NFR-19 알림 센터에 표시합니다. 본 안내 화면은 어느 화면에서 어떤 표시가 일어나는지 운영자가 한눈에 확인하기 위해 존재합니다.",
    tabs: ["표시 위치 안내", "허용 액션", "화면 포인트"],
    metrics: [
      { label: "구현 상태", value: "안내 전용", hint: "별도 콘솔 없음" },
      { label: "표시 위치", value: "3종", hint: "SCR-I001·공통 위젯·NFR-19" },
      { label: "장애 우선 강조", value: "필수", hint: "IOT-06-03" },
      { label: "이벤트 원천", value: "단일", hint: "운영 카운트와 FC 카드 동일 스트림" }
    ],
    filters: ["표시 위치 (SCR-I001 / 공통 대시보드 / NFR-19 알림 센터)", "상태 (정상·불안정·오류)"],
    tableColumns: ["표시 위치", "표시 내용", "허용 액션", "관련 정책"],
    rows: [
      { "표시 위치": "SCR-I001 통합 출석 관리", "표시 내용": "최근 키오스크 출석 이벤트, 실패 사유, 마지막 수신 시각", "허용 액션": "새로고침, 실패 로그 필터", "관련 정책": "IOT-06-02" },
      { "표시 위치": "공통 대시보드 통합 위젯", "표시 내용": "실시간 출석 확인 카드", "허용 액션": "회원 상세 이동", "관련 정책": "IOT-06-01" },
      { "표시 위치": "NFR-19 알림 센터", "표시 내용": "키오스크·출입 게이트 불안정·오류 알림", "허용 액션": "알림 확인, 담당자 지정", "관련 정책": "IOT-06-03" }
    ],
    dialogs: [],
    primaryActions: [
      { label: "통합 출석 관리로 이동 (SCR-I001)" },
      { label: "공통 대시보드로 이동" },
      { label: "알림 센터로 이동 (SCR-104)" },
      { label: "KIOSK 기획문서 안내(외부 링크)" }
    ],
    roleNotes: {
      HQ_ADMIN: "본 화면은 구현 대상이 아니므로 D11 권한을 정의하지 않습니다.",
      OWNER: "본 화면은 구현 대상이 아니므로 D11 권한을 정의하지 않습니다.",
      MANAGER: "본 화면은 구현 대상이 아니므로 D11 권한을 정의하지 않습니다.",
      FC: "본 화면은 구현 대상이 아니므로 D11 권한을 정의하지 않습니다.",
      TRAINER: "본 화면은 구현 대상이 아니므로 D11 권한을 정의하지 않습니다.",
      STAFF: "본 화면은 구현 대상이 아니므로 D11 권한을 정의하지 않습니다."
    },
    policyPending: true
  }
];
