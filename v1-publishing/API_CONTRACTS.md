# V1 API Contracts for Development Handoff

Generated: 2026-05-28T16:00:40.622Z

> 실제 API는 구현하지 않습니다. 아래 endpoint/request/response는 개발 연결용 mock contract입니다.

## Screen Contracts
### SCR-100 로그인
- Route: `/login`
- Handoff: production-ready
- Query Params: `지점-선택`, `역할-선택`, `로그인-상태-유지`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-100.list | GET | `/api/admin/login` | 로그인 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-100", rows, metrics, permissions, policyFlags }` |
| SCR-100.로그인 | PATCH | `/api/admin/login/actions/로그인` | 로그인 - 로그인 처리 | `{ ok: true, toast: "로그인 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-104 알림 센터
- Route: `/notifications`
- Handoff: production-ready
- Query Params: `유형`, `읽음-상태`, `담당자`, `기간`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-104.list | GET | `/api/admin/notifications` | 알림 센터 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-104", rows, metrics, permissions, policyFlags }` |
| SCR-104.전체-읽음-처리 | PATCH | `/api/admin/notifications/actions/전체-읽음-처리` | 알림 센터 - 전체 읽음 처리 처리 | `{ ok: true, toast: "전체 읽음 처리 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-104.세션-만료-테스트 | PATCH | `/api/admin/notifications/actions/세션-만료-테스트` | 알림 센터 - 세션 만료 테스트 처리 | `{ ok: true, toast: "세션 만료 테스트 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-DLG DLG 컴포넌트 갤러리
- Route: `/dialogs`
- Handoff: production-ready
- Query Params: `도메인`, `정책-확인`, `권한`, `처리-유형`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-DLG.list | GET | `/api/admin/dialogs` | DLG 컴포넌트 갤러리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-DLG", rows, metrics, permissions, policyFlags }` |

### SCR-M001 회원 목록
- Route: `/members`
- Handoff: production-ready
- Query Params: `전체`, `활성`, `만료`, `예정`, `임박`, `홀딩`, `미등록`, `탈퇴`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-M001.list | GET | `/api/admin/members` | 회원 목록 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-M001", rows, metrics, permissions, policyFlags }` |
| SCR-M001.회원-등록 | PATCH | `/api/admin/members/actions/회원-등록` | 회원 목록 - 회원 등록 처리 | `{ ok: true, toast: "회원 등록 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M001.상태-변경 | PATCH | `/api/admin/members/actions/상태-변경` | 회원 목록 - 상태 변경 처리 | `{ ok: true, toast: "상태 변경 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M001.수동-출석 | PATCH | `/api/admin/members/actions/수동-출석` | 회원 목록 - 수동 출석 처리 | `{ ok: true, toast: "수동 출석 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M001.지점-이관 | POST | `/api/admin/members/actions/지점-이관` | 회원 목록 - 지점 이관 처리 | `{ ok: true, toast: "지점 이관 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-M002 회원 등록
- Route: `/members/new`
- Handoff: production-ready
- Query Params: `회원구분`, `문의-유형`, `가입경로`, `담당-fc`, `담당-트레이너`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-M002.list | GET | `/api/admin/members/new` | 회원 등록 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-M002", rows, metrics, permissions, policyFlags }` |
| SCR-M002.전화번호-중복-확인 | PATCH | `/api/admin/members/new/actions/전화번호-중복-확인` | 회원 등록 - 전화번호 중복 확인 처리 | `{ ok: true, toast: "전화번호 중복 확인 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M002.주소-검색 | PATCH | `/api/admin/members/new/actions/주소-검색` | 회원 등록 - 주소 검색 처리 | `{ ok: true, toast: "주소 검색 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M002.초기화 | PATCH | `/api/admin/members/new/actions/초기화` | 회원 등록 - 초기화 처리 | `{ ok: true, toast: "초기화 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M002.취소 | PATCH | `/api/admin/members/new/actions/취소` | 회원 등록 - 취소 처리 | `{ ok: true, toast: "취소 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-M003 회원 수정
- Route: `/members/edit`
- Handoff: production-ready
- Query Params: `step-1-기본-인적`, `step-1-관리-정보`, `step-2-추가-연락`, `step-2-기타-설정`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-M003.list | GET | `/api/admin/members/:id` | 회원 수정 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-M003", rows, metrics, permissions, policyFlags }` |
| SCR-M003.저장 | PATCH | `/api/admin/members/:id/actions/저장` | 회원 수정 - 저장 처리 | `{ ok: true, toast: "저장 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M003.전화번호-중복-확인 | PATCH | `/api/admin/members/:id/actions/전화번호-중복-확인` | 회원 수정 - 전화번호 중복 확인 처리 | `{ ok: true, toast: "전화번호 중복 확인 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M003.주소-검색 | PATCH | `/api/admin/members/:id/actions/주소-검색` | 회원 수정 - 주소 검색 처리 | `{ ok: true, toast: "주소 검색 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M003.초기화 | PATCH | `/api/admin/members/:id/actions/초기화` | 회원 수정 - 초기화 처리 | `{ ok: true, toast: "초기화 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M003.취소-이탈-확인 | PATCH | `/api/admin/members/:id/actions/취소-이탈-확인` | 회원 수정 - 취소(이탈 확인) 처리 | `{ ok: true, toast: "취소(이탈 확인) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-M004 회원 상세
- Route: `/members/detail`
- Handoff: production-ready
- Query Params: `유효한-상품만`, `계약-유형`, `결제-상태`, `상담-기간`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-M004.list | GET | `/api/admin/members/:id` | 회원 상세 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-M004", rows, metrics, permissions, policyFlags }` |
| SCR-M004.상태-변경 | PATCH | `/api/admin/members/:id/actions/상태-변경` | 회원 상세 - 상태 변경 처리 | `{ ok: true, toast: "상태 변경 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M004.홀딩-등록 | PATCH | `/api/admin/members/:id/actions/홀딩-등록` | 회원 상세 - 홀딩 등록 처리 | `{ ok: true, toast: "홀딩 등록 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M004.메모-추가 | PATCH | `/api/admin/members/:id/actions/메모-추가` | 회원 상세 - 메모 추가 처리 | `{ ok: true, toast: "메모 추가 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M004.회원-삭제 | POST | `/api/admin/members/:id/actions/회원-삭제` | 회원 상세 - 회원 삭제 처리 | `{ ok: true, toast: "회원 삭제 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-M005 회원 이관
- Route: `/members/transfer`
- Handoff: production-ready
- Query Params: `회원-검색`, `대상-지점`, `예외-상품-여부`, `차단-조건`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-M005.list | GET | `/api/admin/members/transfer` | 회원 이관 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-M005", rows, metrics, permissions, policyFlags }` |
| SCR-M005.이관-확인 | POST | `/api/admin/members/transfer/actions/이관-확인` | 회원 이관 - 이관 확인 처리 | `{ ok: true, toast: "이관 확인 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M005.예외-상품-정책-점검 | PATCH | `/api/admin/members/transfer/actions/예외-상품-정책-점검` | 회원 이관 - 예외 상품 정책 점검 처리 | `{ ok: true, toast: "예외 상품 정책 점검 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-M006 체성분 관리
- Route: `/body-composition`
- Handoff: production-ready
- Query Params: `회원-선택-드롭다운`, `그래프-지표-토글-체중-골격근량-체지방률`, `측정-기간`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-M006.list | GET | `/api/admin/body-composition` | 체성분 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-M006", rows, metrics, permissions, policyFlags }` |
| SCR-M006.측정-추가 | PATCH | `/api/admin/body-composition/actions/측정-추가` | 체성분 관리 - 측정 추가 처리 | `{ ok: true, toast: "측정 추가 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M006.목표-설정 | PATCH | `/api/admin/body-composition/actions/목표-설정` | 체성분 관리 - 목표 설정 처리 | `{ ok: true, toast: "목표 설정 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M006.동일-일자-덮어쓰기 | PATCH | `/api/admin/body-composition/actions/동일-일자-덮어쓰기` | 체성분 관리 - 동일 일자 덮어쓰기 처리 | `{ ok: true, toast: "동일 일자 덮어쓰기 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M006.csv-내보내기 | PATCH | `/api/admin/body-composition/actions/csv-내보내기` | 체성분 관리 - CSV 내보내기 처리 | `{ ok: true, toast: "CSV 내보내기 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-M007 회원 병합
- Route: `/members/merge`
- Handoff: production-ready
- Query Params: `이름`, `연락처`, `생년월일`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-M007.list | GET | `/api/admin/members/merge` | 회원 병합 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-M007", rows, metrics, permissions, policyFlags }` |
| SCR-M007.회원-병합-확인 | POST | `/api/admin/members/merge/actions/회원-병합-확인` | 회원 병합 - 회원 병합 확인 처리 | `{ ok: true, toast: "회원 병합 확인 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-M008 가족 회원
- Route: `/members/family`
- Handoff: production-ready
- Query Params: `그룹명`, `대표-회원`, `구성원-관계`, `활성-여부`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-M008.list | GET | `/api/admin/members/family` | 가족 회원 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-M008", rows, metrics, permissions, policyFlags }` |
| SCR-M008.새-그룹-만들기 | PATCH | `/api/admin/members/family/actions/새-그룹-만들기` | 가족 회원 - 새 그룹 만들기 처리 | `{ ok: true, toast: "새 그룹 만들기 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M008.가족-연결-구성원-추가 | PATCH | `/api/admin/members/family/actions/가족-연결-구성원-추가` | 가족 회원 - 가족 연결(구성원 추가) 처리 | `{ ok: true, toast: "가족 연결(구성원 추가) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M008.구성원-제거 | PATCH | `/api/admin/members/family/actions/구성원-제거` | 가족 회원 - 구성원 제거 처리 | `{ ok: true, toast: "구성원 제거 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M008.그룹-삭제 | POST | `/api/admin/members/family/actions/그룹-삭제` | 가족 회원 - 그룹 삭제 처리 | `{ ok: true, toast: "그룹 삭제 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-M009 등급 관리
- Route: `/members/grade`
- Handoff: production-ready
- Query Params: `등급`, `누적-결제`, `방문-횟수`, `이용-기간`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-M009.list | GET | `/api/admin/members/grade` | 등급 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-M009", rows, metrics, permissions, policyFlags }` |
| SCR-M009.등급-변경 | PATCH | `/api/admin/members/grade/actions/등급-변경` | 등급 관리 - 등급 변경 처리 | `{ ok: true, toast: "등급 변경 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-M010 세그먼트 관리
- Route: `/members/segment`
- Handoff: production-ready
- Query Params: `회원-상태-정지-플래그`, `최근-방문일-키오스크-수업-pt-수동`, `이용권-만료일-hq-09-step`, `첫-결제일-n일`, `성별-연령대-문의-유형-가입경로`, `누적-결제-금액-범위`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-M010.list | GET | `/api/admin/members/segment` | 세그먼트 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-M010", rows, metrics, permissions, policyFlags }` |
| SCR-M010.새-세그먼트-만들기 | PATCH | `/api/admin/members/segment/actions/새-세그먼트-만들기` | 세그먼트 관리 - 새 세그먼트 만들기 처리 | `{ ok: true, toast: "새 세그먼트 만들기 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M010.미리보기-샘플-명단 | PATCH | `/api/admin/members/segment/actions/미리보기-샘플-명단` | 세그먼트 관리 - 미리보기(샘플 명단) 처리 | `{ ok: true, toast: "미리보기(샘플 명단) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M010.메시지-발송-액션-연결 | PATCH | `/api/admin/members/segment/actions/메시지-발송-액션-연결` | 세그먼트 관리 - 메시지 발송 액션 연결 처리 | `{ ok: true, toast: "메시지 발송 액션 연결 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M010.쿠폰-발급-액션-연결 | PATCH | `/api/admin/members/segment/actions/쿠폰-발급-액션-연결` | 세그먼트 관리 - 쿠폰 발급 액션 연결 처리 | `{ ok: true, toast: "쿠폰 발급 액션 연결 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M010.운영-메모 | PATCH | `/api/admin/members/segment/actions/운영-메모` | 세그먼트 관리 - 운영 메모 처리 | `{ ok: true, toast: "운영 메모 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-S001 매출 현황
- Route: `/sales`
- Handoff: production-ready
- Query Params: `기간`, `지점`, `상품`, `결제수단`, `상태`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-S001.list | GET | `/api/admin/sales` | 매출 현황 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-S001", rows, metrics, permissions, policyFlags }` |
| SCR-S001.매출-상세 | PATCH | `/api/admin/sales/actions/매출-상세` | 매출 현황 - 매출 상세 처리 | `{ ok: true, toast: "매출 상세 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S001.메모-편집 | PATCH | `/api/admin/sales/actions/메모-편집` | 매출 현황 - 메모 편집 처리 | `{ ok: true, toast: "메모 편집 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S001.목표-설정 | PATCH | `/api/admin/sales/actions/목표-설정` | 매출 현황 - 목표 설정 처리 | `{ ok: true, toast: "목표 설정 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-S002 POS 판매
- Route: `/sales/pos`
- Handoff: production-ready
- Query Params: `상품-카테고리`, `구매자`, `결제-수단`, `영수증-첨부`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-S002.list | GET | `/api/admin/sales/pos` | POS 판매 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-S002", rows, metrics, permissions, policyFlags }` |
| SCR-S002.구매자-검색 | PATCH | `/api/admin/sales/pos/actions/구매자-검색` | POS 판매 - 구매자 검색 처리 | `{ ok: true, toast: "구매자 검색 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S002.결제-확인 | PATCH | `/api/admin/sales/pos/actions/결제-확인` | POS 판매 - 결제 확인 처리 | `{ ok: true, toast: "결제 확인 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S002.중복-결제-경고 | PATCH | `/api/admin/sales/pos/actions/중복-결제-경고` | POS 판매 - 중복 결제 경고 처리 | `{ ok: true, toast: "중복 결제 경고 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-S003 결제 처리
- Route: `/sales/payment`
- Handoff: production-ready
- Query Params: `회원`, `상품`, `수납-유형`, `귀속-지점`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-S003.list | GET | `/api/admin/sales/payment` | 결제 처리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-S003", rows, metrics, permissions, policyFlags }` |
| SCR-S003.구매자-검색 | PATCH | `/api/admin/sales/payment/actions/구매자-검색` | 결제 처리 - 구매자 검색 처리 | `{ ok: true, toast: "구매자 검색 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S003.결제-확인 | PATCH | `/api/admin/sales/payment/actions/결제-확인` | 결제 처리 - 결제 확인 처리 | `{ ok: true, toast: "결제 확인 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S003.할부-등록 | PATCH | `/api/admin/sales/payment/actions/할부-등록` | 결제 처리 - 할부 등록 처리 | `{ ok: true, toast: "할부 등록 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-S004 매출 통계
- Route: `/sales/stats`
- Handoff: production-ready
- Query Params: `기간-프리셋-이번-달-지난-달-3m-6m-올해`, `시작일-종료일-직접-입력`, `전월-대비-토글`, `지점`, `상품`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-S004.list | GET | `/api/admin/sales/stats` | 매출 통계 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-S004", rows, metrics, permissions, policyFlags }` |
| SCR-S004.기간-조회 | PATCH | `/api/admin/sales/stats/actions/기간-조회` | 매출 통계 - 기간 조회 처리 | `{ ok: true, toast: "기간 조회 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S004.전월-대비-토글 | PATCH | `/api/admin/sales/stats/actions/전월-대비-토글` | 매출 통계 - 전월 대비 토글 처리 | `{ ok: true, toast: "전월 대비 토글 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S004.목표-매출-설정 | PATCH | `/api/admin/sales/stats/actions/목표-매출-설정` | 매출 통계 - 목표 매출 설정 처리 | `{ ok: true, toast: "목표 매출 설정 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-S005 통계 관리
- Route: `/sales/statistics-admin`
- Handoff: policy-pending
- Query Params: `집계일`, `상태`, `지점`, `정책-여부`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-S005.list | GET | `/api/admin/sales/statistics-admin` | 통계 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-S005", rows, metrics, permissions, policyFlags }` |
| SCR-S005.목표-기준-설정 | PATCH | `/api/admin/sales/statistics-admin/actions/목표-기준-설정` | 통계 관리 - 목표 기준 설정 처리 | `{ ok: true, toast: "목표 기준 설정 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-S006 선수익금 조회
- Route: `/sales/deferred-revenue`
- Handoff: policy-pending
- Query Params: `시작일-종료일`, `5버킷-1-3-6-12개월-기타`, `상품`, `지점`, `인식-상태`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-S006.list | GET | `/api/admin/sales/deferred-revenue` | 선수익금 조회 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-S006", rows, metrics, permissions, policyFlags }` |
| SCR-S006.원-매출-상세 | PATCH | `/api/admin/sales/deferred-revenue/actions/원-매출-상세` | 선수익금 조회 - 원 매출 상세 처리 | `{ ok: true, toast: "원 매출 상세 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S006.기간-필터-변경 | PATCH | `/api/admin/sales/deferred-revenue/actions/기간-필터-변경` | 선수익금 조회 - 기간 필터 변경 처리 | `{ ok: true, toast: "기간 필터 변경 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-S007 환불 관리
- Route: `/sales/refunds`
- Handoff: policy-pending
- Query Params: `기간-프리셋-이번-달-지난-달-최근-3개월`, `시작일-종료일-직접-입력`, `상태-완료-처리중-거절`, `원판매-담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-S007.list | GET | `/api/admin/sales/refunds` | 환불 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-S007", rows, metrics, permissions, policyFlags }` |
| SCR-S007.환불-요청 | POST | `/api/admin/sales/refunds/actions/환불-요청` | 환불 관리 - 환불 요청 처리 | `{ ok: true, toast: "환불 요청 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S007.환불-처리 | POST | `/api/admin/sales/refunds/actions/환불-처리` | 환불 관리 - 환불 처리 처리 | `{ ok: true, toast: "환불 처리 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S007.환불-상세 | POST | `/api/admin/sales/refunds/actions/환불-상세` | 환불 관리 - 환불 상세 처리 | `{ ok: true, toast: "환불 상세 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S007.엑셀-내보내기 | PATCH | `/api/admin/sales/refunds/actions/엑셀-내보내기` | 환불 관리 - 엑셀 내보내기 처리 | `{ ok: true, toast: "엑셀 내보내기 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-S008 미수금 관리
- Route: `/sales/receivables`
- Handoff: production-ready
- Query Params: `회원명-검색`, `발생-유형-계약금-잔액-수기-분할-정기-할부-미납`, `예정일`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-S008.list | GET | `/api/admin/sales/receivables` | 미수금 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-S008", rows, metrics, permissions, policyFlags }` |
| SCR-S008.납입-처리 | PATCH | `/api/admin/sales/receivables/actions/납입-처리` | 미수금 관리 - 납입 처리 처리 | `{ ok: true, toast: "납입 처리 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S008.메모-편집 | PATCH | `/api/admin/sales/receivables/actions/메모-편집` | 미수금 관리 - 메모 편집 처리 | `{ ok: true, toast: "메모 편집 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S008.엑셀-내보내기 | PATCH | `/api/admin/sales/receivables/actions/엑셀-내보내기` | 미수금 관리 - 엑셀 내보내기 처리 | `{ ok: true, toast: "엑셀 내보내기 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-S009 할부결제 관리
- Route: `/sales/installments`
- Handoff: production-ready
- Query Params: `회원명-검색`, `기간-범위`, `계약-출처-현장-결제-연계-미수금-전환-직접-등록`, `상태-탭`, `이번-달-납입-예정-칩`, `이번-달-납입-완료-칩`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-S009.list | GET | `/api/admin/sales/installments` | 할부결제 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-S009", rows, metrics, permissions, policyFlags }` |
| SCR-S009.할부-상세-회차별-펼침 | PATCH | `/api/admin/sales/installments/actions/할부-상세-회차별-펼침` | 할부결제 관리 - 할부 상세 (회차별 펼침) 처리 | `{ ok: true, toast: "할부 상세 (회차별 펼침) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S009.납입-처리 | PATCH | `/api/admin/sales/installments/actions/납입-처리` | 할부결제 관리 - 납입 처리 처리 | `{ ok: true, toast: "납입 처리 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S009.할부-등록 | PATCH | `/api/admin/sales/installments/actions/할부-등록` | 할부결제 관리 - + 할부 등록 처리 | `{ ok: true, toast: "+ 할부 등록 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S009.엑셀-내보내기 | PATCH | `/api/admin/sales/installments/actions/엑셀-내보내기` | 할부결제 관리 - 엑셀 내보내기 처리 | `{ ok: true, toast: "엑셀 내보내기 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-S010 세금계산서 발행
- Route: `/sales/tax-invoice`
- Handoff: policy-pending
- Query Params: `상태-발행-완료-전송-완료-오류-취소-발행`, `공급받는-자-법인-검색`, `발행일`, `이메일`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-S010.list | GET | `/api/admin/sales/tax-invoice` | 세금계산서 발행 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-S010", rows, metrics, permissions, policyFlags }` |
| SCR-S010.세금계산서-상세 | PATCH | `/api/admin/sales/tax-invoice/actions/세금계산서-상세` | 세금계산서 발행 - 세금계산서 상세 처리 | `{ ok: true, toast: "세금계산서 상세 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S010.세금계산서-발행 | PATCH | `/api/admin/sales/tax-invoice/actions/세금계산서-발행` | 세금계산서 발행 - 세금계산서 발행 처리 | `{ ok: true, toast: "세금계산서 발행 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S010.이메일-전송-재발행 | PATCH | `/api/admin/sales/tax-invoice/actions/이메일-전송-재발행` | 세금계산서 발행 - 이메일 전송 / 재발행 처리 | `{ ok: true, toast: "이메일 전송 / 재발행 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S010.엑셀-내보내기 | PATCH | `/api/admin/sales/tax-invoice/actions/엑셀-내보내기` | 세금계산서 발행 - 엑셀 내보내기 처리 | `{ ok: true, toast: "엑셀 내보내기 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-S011 매출 예측
- Route: `/sales/forecast`
- Handoff: policy-pending
- Query Params: `예측-기간`, `상품`, `지점`, `목표-기준`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-S011.list | GET | `/api/admin/sales/forecast` | 매출 예측 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-S011", rows, metrics, permissions, policyFlags }` |
| SCR-S011.목표-매출-설정 | PATCH | `/api/admin/sales/forecast/actions/목표-매출-설정` | 매출 예측 - 목표 매출 설정 처리 | `{ ok: true, toast: "목표 매출 설정 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-S012 결제 취소 / 부분 환불
- Route: `/sales/refund-partial`
- Handoff: policy-pending
- Query Params: `회원명-검색`, `상품명`, `결제일`, `처리-유형-전체-취소-부분-환불`, `승인-상태`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-S012.list | GET | `/api/admin/sales/refund-partial` | 결제 취소 / 부분 환불 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-S012", rows, metrics, permissions, policyFlags }` |
| SCR-S012.환불-요청-승인대기-저장 | POST | `/api/admin/sales/refund-partial/actions/환불-요청-승인대기-저장` | 결제 취소 / 부분 환불 - 환불 요청 (승인대기 저장) 처리 | `{ ok: true, toast: "환불 요청 (승인대기 저장) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S012.환불-처리-owner-완료 | POST | `/api/admin/sales/refund-partial/actions/환불-처리-owner-완료` | 결제 취소 / 부분 환불 - 환불 처리 (Owner 완료) 처리 | `{ ok: true, toast: "환불 처리 (Owner 완료) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S012.처리-결과-보기 | PATCH | `/api/admin/sales/refund-partial/actions/처리-결과-보기` | 결제 취소 / 부분 환불 - 처리 결과 보기 처리 | `{ ok: true, toast: "처리 결과 보기 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S012.전체-취소-부분-환불-선택 | POST | `/api/admin/sales/refund-partial/actions/전체-취소-부분-환불-선택` | 결제 취소 / 부분 환불 - 전체 취소 / 부분 환불 선택 처리 | `{ ok: true, toast: "전체 취소 / 부분 환불 선택 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C001 수업 캘린더
- Route: `/classes/c001`
- Handoff: template-ready
- Query Params: `강사-드롭다운`, `수업명-드롭다운`, `정원-상태-전체-여유-마감`, `분류-멀티-상담-ot-체성분-방문-수업-pt-기타`, `강습-세션-유형-pt-gx-골프-기타`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C001.list | GET | `/api/admin/classes/c001` | 수업 캘린더 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C001", rows, metrics, permissions, policyFlags }` |
| SCR-C001.수업-등록-c001 | PATCH | `/api/admin/classes/c001/actions/수업-등록-c001` | 수업 캘린더 - 수업 등록 (DLG-C001) 처리 | `{ ok: true, toast: "수업 등록 (DLG-C001) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C001.일정-상세-c002 | PATCH | `/api/admin/classes/c001/actions/일정-상세-c002` | 수업 캘린더 - 일정 상세 (DLG-C002) 처리 | `{ ok: true, toast: "일정 상세 (DLG-C002) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C001.일괄-변경-c004 | PATCH | `/api/admin/classes/c001/actions/일괄-변경-c004` | 수업 캘린더 - 일괄 변경 (DLG-C004) 처리 | `{ ok: true, toast: "일괄 변경 (DLG-C004) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C001.세션-상세-c011 | PATCH | `/api/admin/classes/c001/actions/세션-상세-c011` | 수업 캘린더 - 세션 상세 (DLG-C011) 처리 | `{ ok: true, toast: "세션 상세 (DLG-C011) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C001.미승인-일정-일괄-승인 | POST | `/api/admin/classes/c001/actions/미승인-일정-일괄-승인` | 수업 캘린더 - 미승인 일정 일괄 승인 처리 | `{ ok: true, toast: "미승인 일정 일괄 승인 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C002 수업 관리
- Route: `/lessons`
- Handoff: template-ready
- Query Params: `강사-드롭다운`, `장소-드롭다운`, `강습-세션-유형-pt-gx-골프-기타`, `상태-전체-예정-진행중-완료-취소`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C002.list | GET | `/api/admin/lessons` | 수업 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C002", rows, metrics, permissions, policyFlags }` |
| SCR-C002.수업-등록-c003 | PATCH | `/api/admin/lessons/actions/수업-등록-c003` | 수업 관리 - 수업 등록 (DLG-C003) 처리 | `{ ok: true, toast: "수업 등록 (DLG-C003) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C002.수업-기록-상세-c005 | PATCH | `/api/admin/lessons/actions/수업-기록-상세-c005` | 수업 관리 - 수업 기록 상세 (DLG-C005) 처리 | `{ ok: true, toast: "수업 기록 상세 (DLG-C005) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C002.서명-c006 | PATCH | `/api/admin/lessons/actions/서명-c006` | 수업 관리 - 서명 (DLG-C006) 처리 | `{ ok: true, toast: "서명 (DLG-C006) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C002.수업-취소 | POST | `/api/admin/lessons/actions/수업-취소` | 수업 관리 - 수업 취소 처리 | `{ ok: true, toast: "수업 취소 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C003 시간표 일괄 등록
- Route: `/class-schedule`
- Handoff: template-ready
- Query Params: `시작일-종료일-최대-12개월`, `요일-멀티-월-일`, `시작-종료-시간-10분-단위`, `수업-템플릿-드롭다운`, `강사-트레이너는-본인만`, `장소-룸`, `제외-날짜`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C003.list | GET | `/api/admin/class-schedule` | 시간표 일괄 등록 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C003", rows, metrics, permissions, policyFlags }` |
| SCR-C003.미리보기-갱신 | PATCH | `/api/admin/class-schedule/actions/미리보기-갱신` | 시간표 일괄 등록 - 미리보기 갱신 처리 | `{ ok: true, toast: "미리보기 갱신 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C003.일괄-생성-확인-c008 | PATCH | `/api/admin/class-schedule/actions/일괄-생성-확인-c008` | 시간표 일괄 등록 - 일괄 생성 확인 (DLG-C008) 처리 | `{ ok: true, toast: "일괄 생성 확인 (DLG-C008) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C003.전체-취소-30분-이내 | POST | `/api/admin/class-schedule/actions/전체-취소-30분-이내` | 시간표 일괄 등록 - 전체 취소(30분 이내) 처리 | `{ ok: true, toast: "전체 취소(30분 이내) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C004 그룹 수업 템플릿
- Route: `/class-templates`
- Handoff: template-ready
- Query Params: `활성-비활성-토글`, `수업-유형-pt-gx-골프-기타`, `수업명-검색`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C004.list | GET | `/api/admin/class-templates` | 그룹 수업 템플릿 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C004", rows, metrics, permissions, policyFlags }` |
| SCR-C004.템플릿-등록-c009 | PATCH | `/api/admin/class-templates/actions/템플릿-등록-c009` | 그룹 수업 템플릿 - + 템플릿 등록 (DLG-C009) 처리 | `{ ok: true, toast: "+ 템플릿 등록 (DLG-C009) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C004.템플릿-수정-c009 | PATCH | `/api/admin/class-templates/actions/템플릿-수정-c009` | 그룹 수업 템플릿 - 템플릿 수정 (DLG-C009) 처리 | `{ ok: true, toast: "템플릿 수정 (DLG-C009) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C004.활성-비활성-토글 | PATCH | `/api/admin/class-templates/actions/활성-비활성-토글` | 그룹 수업 템플릿 - 활성/비활성 토글 처리 | `{ ok: true, toast: "활성/비활성 토글 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C004.템플릿-삭제-사용-중-아닐-때만 | POST | `/api/admin/class-templates/actions/템플릿-삭제-사용-중-아닐-때만` | 그룹 수업 템플릿 - 템플릿 삭제(사용 중 아닐 때만) 처리 | `{ ok: true, toast: "템플릿 삭제(사용 중 아닐 때만) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C005 그룹 수업 현황
- Route: `/classes/c005`
- Handoff: template-ready
- Query Params: `기간-주간-월간`, `수업-유형-전체-pt-gx-골프-기타`, `강사-드롭다운`, `정렬-출석률-잔여-예약`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C005.list | GET | `/api/admin/classes/c005` | 그룹 수업 현황 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C005", rows, metrics, permissions, policyFlags }` |
| SCR-C005.정원-조정 | PATCH | `/api/admin/classes/c005/actions/정원-조정` | 그룹 수업 현황 - 정원 조정 처리 | `{ ok: true, toast: "정원 조정 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C005.수업-취소-진입 | POST | `/api/admin/classes/c005/actions/수업-취소-진입` | 그룹 수업 현황 - 수업 취소 진입 처리 | `{ ok: true, toast: "수업 취소 진입 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C005.수업-행-클릭-예약-회원-목록-드로어 | PATCH | `/api/admin/classes/c005/actions/수업-행-클릭-예약-회원-목록-드로어` | 그룹 수업 현황 - 수업 행 클릭 → 예약 회원 목록(드로어) 처리 | `{ ok: true, toast: "수업 행 클릭 → 예약 회원 목록(드로어) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C006 강사 근무 현황
- Route: `/instructor-status`
- Handoff: template-ready
- Query Params: `기간-주간-월간-사용자-지정`, `강사-역할-트레이너-gx-강사-등`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C006.list | GET | `/api/admin/instructor-status` | 강사 근무 현황 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C006", rows, metrics, permissions, policyFlags }` |
| SCR-C006.강사-상세-c010 | PATCH | `/api/admin/instructor-status/actions/강사-상세-c010` | 강사 근무 현황 - 강사 상세 (DLG-C010) 처리 | `{ ok: true, toast: "강사 상세 (DLG-C010) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C006.급여-정산-자료-064-연계 | PATCH | `/api/admin/instructor-status/actions/급여-정산-자료-064-연계` | 강사 근무 현황 - 급여 정산 자료(SCR-064 연계) 처리 | `{ ok: true, toast: "급여 정산 자료(SCR-064 연계) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C007 횟수 관리
- Route: `/lesson-counts`
- Handoff: template-ready
- Query Params: `회원명-전화번호-검색`, `잔여-부족-회원만-보기`, `만료-임박-이용권-보기`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C007.list | GET | `/api/admin/lesson-counts` | 횟수 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C007", rows, metrics, permissions, policyFlags }` |
| SCR-C007.횟수-조정-c012 | PATCH | `/api/admin/lesson-counts/actions/횟수-조정-c012` | 횟수 관리 - 횟수 조정 (DLG-C012) 처리 | `{ ok: true, toast: "횟수 조정 (DLG-C012) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C007.차감-이력-c013 | PATCH | `/api/admin/lesson-counts/actions/차감-이력-c013` | 횟수 관리 - 차감 이력 (DLG-C013) 처리 | `{ ok: true, toast: "차감 이력 (DLG-C013) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C008 페널티 관리
- Route: `/penalties`
- Handoff: template-ready
- Query Params: `회원명-검색`, `페널티-유형-노쇼`, `상태-적용-중-해제`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C008.list | GET | `/api/admin/penalties` | 페널티 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C008", rows, metrics, permissions, policyFlags }` |
| SCR-C008.페널티-등록-c014 | PATCH | `/api/admin/penalties/actions/페널티-등록-c014` | 페널티 관리 - 페널티 등록 (DLG-C014) 처리 | `{ ok: true, toast: "페널티 등록 (DLG-C014) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C008.자동-페널티-정책-c015 | PATCH | `/api/admin/penalties/actions/자동-페널티-정책-c015` | 페널티 관리 - 자동 페널티 정책 (DLG-C015) 처리 | `{ ok: true, toast: "자동 페널티 정책 (DLG-C015) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C008.노쇼-정책-c007 | PATCH | `/api/admin/penalties/actions/노쇼-정책-c007` | 페널티 관리 - 노쇼 정책 (DLG-C007) 처리 | `{ ok: true, toast: "노쇼 정책 (DLG-C007) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C008.페널티-수동-해제 | PATCH | `/api/admin/penalties/actions/페널티-수동-해제` | 페널티 관리 - 페널티 수동 해제 처리 | `{ ok: true, toast: "페널티 수동 해제 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C009 일정 요청 처리
- Route: `/schedule-requests`
- Handoff: template-ready
- Query Params: `요청-유형-전체-변경-취소`, `처리-상태-전체-대기-처리-완료`, `기간`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C009.list | GET | `/api/admin/schedule-requests` | 일정 요청 처리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C009", rows, metrics, permissions, policyFlags }` |
| SCR-C009.수락-수업-자동-변경-취소 | PATCH | `/api/admin/schedule-requests/actions/수락-수업-자동-변경-취소` | 일정 요청 처리 - 수락 (수업 자동 변경/취소) 처리 | `{ ok: true, toast: "수락 (수업 자동 변경/취소) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C009.거절-사유-입력 | PATCH | `/api/admin/schedule-requests/actions/거절-사유-입력` | 일정 요청 처리 - 거절 (사유 입력) 처리 | `{ ok: true, toast: "거절 (사유 입력) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C009.대안-일정-제시-c016 | PATCH | `/api/admin/schedule-requests/actions/대안-일정-제시-c016` | 일정 요청 처리 - 대안 일정 제시 (DLG-C016) 처리 | `{ ok: true, toast: "대안 일정 제시 (DLG-C016) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C010 운동 프로그램 관리
- Route: `/exercise-programs`
- Handoff: policy-pending
- Query Params: `내-프로그램만-보기`, `배정-회원-있는-프로그램만`, `프로그램명-검색`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C010.list | GET | `/api/admin/exercise-programs` | 운동 프로그램 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C010", rows, metrics, permissions, policyFlags }` |
| SCR-C010.프로그램-등록-드로어-또는-폼 | PATCH | `/api/admin/exercise-programs/actions/프로그램-등록-드로어-또는-폼` | 운동 프로그램 관리 - + 프로그램 등록 (드로어 또는 폼) 처리 | `{ ok: true, toast: "+ 프로그램 등록 (드로어 또는 폼) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C010.동작-순서-드래그-드롭-변경 | PATCH | `/api/admin/exercise-programs/actions/동작-순서-드래그-드롭-변경` | 운동 프로그램 관리 - 동작 순서 드래그&드롭 변경 처리 | `{ ok: true, toast: "동작 순서 드래그&드롭 변경 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C010.회원-배정-수동-선택 | PATCH | `/api/admin/exercise-programs/actions/회원-배정-수동-선택` | 운동 프로그램 관리 - 회원 배정 (수동 선택) 처리 | `{ ok: true, toast: "회원 배정 (수동 선택) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C010.프로그램-삭제-배정-회원-안내-후 | POST | `/api/admin/exercise-programs/actions/프로그램-삭제-배정-회원-안내-후` | 운동 프로그램 관리 - 프로그램 삭제(배정 회원 안내 후) 처리 | `{ ok: true, toast: "프로그램 삭제(배정 회원 안내 후) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C010.세션-상세-c011 | PATCH | `/api/admin/exercise-programs/actions/세션-상세-c011` | 운동 프로그램 관리 - 세션 상세 (DLG-C011) 처리 | `{ ok: true, toast: "세션 상세 (DLG-C011) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C011 유효 수업 목록
- Route: `/valid-lessons`
- Handoff: template-ready
- Query Params: `날짜-오늘-이번-주-직접-선택`, `출석-상태-미처리-출석-결석-노쇼`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C011.list | GET | `/api/admin/valid-lessons` | 유효 수업 목록 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C011", rows, metrics, permissions, policyFlags }` |
| SCR-C011.출석-처리-출석-결석-노쇼 | PATCH | `/api/admin/valid-lessons/actions/출석-처리-출석-결석-노쇼` | 유효 수업 목록 - 출석 처리 (출석/결석/노쇼) 처리 | `{ ok: true, toast: "출석 처리 (출석/결석/노쇼) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C011.서명-요청-c006 | PATCH | `/api/admin/valid-lessons/actions/서명-요청-c006` | 유효 수업 목록 - 서명 요청 (DLG-C006) 처리 | `{ ok: true, toast: "서명 요청 (DLG-C006) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C011.수업-기록-상세-c005 | PATCH | `/api/admin/valid-lessons/actions/수업-기록-상세-c005` | 유효 수업 목록 - 수업 기록 상세 (DLG-C005) 처리 | `{ ok: true, toast: "수업 기록 상세 (DLG-C005) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C012 대기열 관리
- Route: `/class-waitlist`
- Handoff: policy-pending
- Query Params: `수업-선택-드롭다운`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C012.list | GET | `/api/admin/class-waitlist` | 대기열 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C012", rows, metrics, permissions, policyFlags }` |
| SCR-C012.수동-배정 | PATCH | `/api/admin/class-waitlist/actions/수동-배정` | 대기열 관리 - 수동 배정 처리 | `{ ok: true, toast: "수동 배정 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C012.대기-취소 | PATCH | `/api/admin/class-waitlist/actions/대기-취소` | 대기열 관리 - 대기 취소 처리 | `{ ok: true, toast: "대기 취소 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C012.알림-발송-자리-발생-안내 | PATCH | `/api/admin/class-waitlist/actions/알림-발송-자리-발생-안내` | 대기열 관리 - 알림 발송 (자리 발생 안내) 처리 | `{ ok: true, toast: "알림 발송 (자리 발생 안내) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C012.자동-배정-정책-d10-h1001 | PATCH | `/api/admin/class-waitlist/actions/자동-배정-정책-d10-h1001` | 대기열 관리 - 자동 배정 정책 (D10 SCR-H1001) 처리 | `{ ok: true, toast: "자동 배정 정책 (D10 SCR-H1001) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C013 수업 평가 피드백
- Route: `/class-feedback`
- Handoff: template-ready
- Query Params: `기간-주간-월간-사용자-지정`, `강사-드롭다운`, `수업-유형-pt-gx-골프-기타`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C013.list | GET | `/api/admin/class-feedback` | 수업 평가 피드백 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C013", rows, metrics, permissions, policyFlags }` |
| SCR-C013.후기-전문-보기-행-클릭 | PATCH | `/api/admin/class-feedback/actions/후기-전문-보기-행-클릭` | 수업 평가 피드백 - 후기 전문 보기(행 클릭) 처리 | `{ ok: true, toast: "후기 전문 보기(행 클릭) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C013.응답률-캠페인-발송-owner | PATCH | `/api/admin/class-feedback/actions/응답률-캠페인-발송-owner` | 수업 평가 피드백 - 응답률 캠페인 발송 (Owner+) 처리 | `{ ok: true, toast: "응답률 캠페인 발송 (Owner+) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C013.후기-자동-숨김-신고-n건 | PATCH | `/api/admin/class-feedback/actions/후기-자동-숨김-신고-n건` | 수업 평가 피드백 - 후기 자동 숨김(신고 N건+) 처리 | `{ ok: true, toast: "후기 자동 숨김(신고 N건+) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C014 수업 출석/완료 확인
- Route: `/attendance/lesson-completion`
- Handoff: template-ready
- Query Params: `날짜-오늘-선택-날짜`, `강사-드롭다운`, `수업-상태-진행-예정-진행중-종료`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C014.list | GET | `/api/admin/attendance/lesson-completion` | 수업 출석/완료 확인 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C014", rows, metrics, permissions, policyFlags }` |
| SCR-C014.출석-처리-출석-결석-노쇼-완료 | PATCH | `/api/admin/attendance/lesson-completion/actions/출석-처리-출석-결석-노쇼-완료` | 수업 출석/완료 확인 - 출석 처리 (출석/결석/노쇼/완료) 처리 | `{ ok: true, toast: "출석 처리 (출석/결석/노쇼/완료) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C014.서명-요청-push-발송 | PATCH | `/api/admin/attendance/lesson-completion/actions/서명-요청-push-발송` | 수업 출석/완료 확인 - 서명 요청 Push 발송 처리 | `{ ok: true, toast: "서명 요청 Push 발송 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C014.노쇼-정정-자동-페널티-해제 | PATCH | `/api/admin/attendance/lesson-completion/actions/노쇼-정정-자동-페널티-해제` | 수업 출석/완료 확인 - 노쇼 정정(자동 페널티 해제) 처리 | `{ ok: true, toast: "노쇼 정정(자동 페널티 해제) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C014.입-출입-기록-참고-영역 | PATCH | `/api/admin/attendance/lesson-completion/actions/입-출입-기록-참고-영역` | 수업 출석/완료 확인 - 입/출입 기록 참고 영역 처리 | `{ ok: true, toast: "입/출입 기록 참고 영역 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C015 수업 녹화 관리
- Route: `/class-recording`
- Handoff: policy-pending
- Query Params: `수업명-강사-검색`, `공유-상태-공유-중-비공개`, `기간`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C015.list | GET | `/api/admin/class-recording` | 수업 녹화 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C015", rows, metrics, permissions, policyFlags }` |
| SCR-C015.파일-업로드-드래그-드롭-최대-5gb | PATCH | `/api/admin/class-recording/actions/파일-업로드-드래그-드롭-최대-5gb` | 수업 녹화 관리 - 파일 업로드 (드래그&드롭, 최대 5GB) 처리 | `{ ok: true, toast: "파일 업로드 (드래그&드롭, 최대 5GB) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C015.공유-설정-회원-기간 | PATCH | `/api/admin/class-recording/actions/공유-설정-회원-기간` | 수업 녹화 관리 - 공유 설정 (회원·기간) 처리 | `{ ok: true, toast: "공유 설정 (회원·기간) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C015.수업-기록-상세-c005 | PATCH | `/api/admin/class-recording/actions/수업-기록-상세-c005` | 수업 녹화 관리 - 수업 기록 상세 (DLG-C005) 처리 | `{ ok: true, toast: "수업 기록 상세 (DLG-C005) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C015.파일-삭제-공유-중-회원-안내-후 | POST | `/api/admin/class-recording/actions/파일-삭제-공유-중-회원-안내-후` | 수업 녹화 관리 - 파일 삭제(공유 중 회원 안내 후) 처리 | `{ ok: true, toast: "파일 삭제(공유 중 회원 안내 후) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C015.미리보기-다운로드 | PATCH | `/api/admin/class-recording/actions/미리보기-다운로드` | 수업 녹화 관리 - 미리보기 / 다운로드 처리 | `{ ok: true, toast: "미리보기 / 다운로드 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C016 예약 목록
- Route: `/class-reservations`
- Handoff: template-ready
- Query Params: `기간-수업일-기준-기본-예약일-기준-전환`, `수업명-수업-유형`, `강사`, `상태-전체-예약완료-출석완료-취소-노쇼-대기`, `지점-통합-권한자만`, `회원명-연락처-검색-하이픈-제거`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C016.list | GET | `/api/admin/class-reservations` | 예약 목록 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C016", rows, metrics, permissions, policyFlags }` |
| SCR-C016.회원-상세-보기 | PATCH | `/api/admin/class-reservations/actions/회원-상세-보기` | 예약 목록 - 회원 상세 보기 처리 | `{ ok: true, toast: "회원 상세 보기 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C016.수업-상세-보기 | PATCH | `/api/admin/class-reservations/actions/수업-상세-보기` | 예약 목록 - 수업 상세 보기 처리 | `{ ok: true, toast: "수업 상세 보기 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C016.예약-취소 | POST | `/api/admin/class-reservations/actions/예약-취소` | 예약 목록 - 예약 취소 처리 | `{ ok: true, toast: "예약 취소 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C016.출석-처리 | PATCH | `/api/admin/class-reservations/actions/출석-처리` | 예약 목록 - 출석 처리 처리 | `{ ok: true, toast: "출석 처리 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C016.노쇼-처리 | PATCH | `/api/admin/class-reservations/actions/노쇼-처리` | 예약 목록 - 노쇼 처리 처리 | `{ ok: true, toast: "노쇼 처리 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C016.엑셀-10-000행-이내 | PATCH | `/api/admin/class-reservations/actions/엑셀-10-000행-이내` | 예약 목록 - 엑셀(10,000행 이내) 처리 | `{ ok: true, toast: "엑셀(10,000행 이내) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-P001 상품 관리
- Route: `/products/p001`
- Handoff: template-ready
- Query Params: `1단계-상품-대분류-탭-전체-회원권-수강권-락커-운동복-일반`, `2단계-세부-유형-수강권-선택-시-pt-gx-골프-기타-gx-선택-시-요가-필라테스-스피닝-줌바-gx-기타`, `상품명-검색`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-P001.list | GET | `/api/admin/products/p001` | 상품 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-P001", rows, metrics, permissions, policyFlags }` |
| SCR-P001.상품-등록-p001 | PATCH | `/api/admin/products/p001/actions/상품-등록-p001` | 상품 관리 - + 상품 등록 (DLG-P001) 처리 | `{ ok: true, toast: "+ 상품 등록 (DLG-P001) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P001.전-지점-배포-p002 | PATCH | `/api/admin/products/p001/actions/전-지점-배포-p002` | 상품 관리 - 전 지점 배포 (DLG-P002) 처리 | `{ ok: true, toast: "전 지점 배포 (DLG-P002) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P001.가격-변경-이력-p004 | PATCH | `/api/admin/products/p001/actions/가격-변경-이력-p004` | 상품 관리 - 가격 변경 이력 (DLG-P004) 처리 | `{ ok: true, toast: "가격 변경 이력 (DLG-P004) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P001.이미지-업로드-p012 | PATCH | `/api/admin/products/p001/actions/이미지-업로드-p012` | 상품 관리 - 이미지 업로드 (DLG-P012) 처리 | `{ ok: true, toast: "이미지 업로드 (DLG-P012) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-P002 상품 등록
- Route: `/products/p002`
- Handoff: template-ready
- Query Params: `대분류-선택-membership-lesson-pass-locker-wear-general`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-P002.list | GET | `/api/admin/products/p002` | 상품 등록 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-P002", rows, metrics, permissions, policyFlags }` |
| SCR-P002.등록 | PATCH | `/api/admin/products/p002/actions/등록` | 상품 등록 - 등록 처리 | `{ ok: true, toast: "등록 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P002.취소-p003 | PATCH | `/api/admin/products/p002/actions/취소-p003` | 상품 등록 - 취소 (DLG-P003) 처리 | `{ ok: true, toast: "취소 (DLG-P003) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P002.상품-가져오기-p008 | PATCH | `/api/admin/products/p002/actions/상품-가져오기-p008` | 상품 등록 - 상품 가져오기 (DLG-P008) 처리 | `{ ok: true, toast: "상품 가져오기 (DLG-P008) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P002.이미지-업로드-p012 | PATCH | `/api/admin/products/p002/actions/이미지-업로드-p012` | 상품 등록 - 이미지 업로드 (DLG-P012) 처리 | `{ ok: true, toast: "이미지 업로드 (DLG-P012) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-P003 상품 상세/수정 패널
- Route: `/products/detail`
- Handoff: template-ready
- Query Params: `헤더-상품수정-활성-비활성-배지`, `닫기-x-변경값-있을-시-p003`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-P003.list | GET | `/api/admin/products/:id` | 상품 상세/수정 패널 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-P003", rows, metrics, permissions, policyFlags }` |
| SCR-P003.저장 | PATCH | `/api/admin/products/:id/actions/저장` | 상품 상세/수정 패널 - 저장 처리 | `{ ok: true, toast: "저장 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P003.삭제-판매-이력-0-p005-판매-이력-있음-p006 | POST | `/api/admin/products/:id/actions/삭제-판매-이력-0-p005-판매-이력-있음-p006` | 상품 상세/수정 패널 - 삭제 (판매 이력 0 → DLG-P005 / 판매 이력 있음 → DLG-P006) 처리 | `{ ok: true, toast: "삭제 (판매 이력 0 → DLG-P005 / 판매 이력 있음 → DLG-P006) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P003.비활성화-p006 | PATCH | `/api/admin/products/:id/actions/비활성화-p006` | 상품 상세/수정 패널 - 비활성화 (DLG-P006) 처리 | `{ ok: true, toast: "비활성화 (DLG-P006) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P003.가격-이력-전체-보기-p014 | PATCH | `/api/admin/products/:id/actions/가격-이력-전체-보기-p014` | 상품 상세/수정 패널 - 가격 이력 전체 보기 (DLG-P014) 처리 | `{ ok: true, toast: "가격 이력 전체 보기 (DLG-P014) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P003.취소-변경값-있을-시-p003 | PATCH | `/api/admin/products/:id/actions/취소-변경값-있을-시-p003` | 상품 상세/수정 패널 - 취소 (변경값 있을 시 DLG-P003) 처리 | `{ ok: true, toast: "취소 (변경값 있을 시 DLG-P003) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-P004 할인 설정
- Route: `/products/p004`
- Handoff: template-ready
- Query Params: `할인-유형-정률-정액`, `상태-활성-비활성`, `적용-상품-검색`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-P004.list | GET | `/api/admin/products/p004` | 할인 설정 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-P004", rows, metrics, permissions, policyFlags }` |
| SCR-P004.할인-등록-p007 | PATCH | `/api/admin/products/p004/actions/할인-등록-p007` | 할인 설정 - + 할인 등록 (DLG-P007) 처리 | `{ ok: true, toast: "+ 할인 등록 (DLG-P007) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P004.할인-수정-p009 | PATCH | `/api/admin/products/p004/actions/할인-수정-p009` | 할인 설정 - 할인 수정 (DLG-P009) 처리 | `{ ok: true, toast: "할인 수정 (DLG-P009) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P004.복합-정책-추가-수정-p013 | PATCH | `/api/admin/products/p004/actions/복합-정책-추가-수정-p013` | 할인 설정 - 복합 정책 추가/수정 (DLG-P013) 처리 | `{ ok: true, toast: "복합 정책 추가/수정 (DLG-P013) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P004.할인-삭제-p011-p015 | POST | `/api/admin/products/p004/actions/할인-삭제-p011-p015` | 할인 설정 - 할인 삭제 (DLG-P011/P015) 처리 | `{ ok: true, toast: "할인 삭제 (DLG-P011/P015) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-P005 상품 카탈로그
- Route: `/products/catalog`
- Handoff: policy-pending
- Query Params: `1단계-상품-대분류-탭-회원권-수강권-락커-운동복-일반`, `gx-탭-선택-시-2단계-세부종목-요가-필라테스-스피닝-줌바-gx-기타`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-P005.list | GET | `/api/admin/products/catalog` | 상품 카탈로그 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-P005", rows, metrics, permissions, policyFlags }` |
| SCR-P005.카탈로그-미리보기-p016 | PATCH | `/api/admin/products/catalog/actions/카탈로그-미리보기-p016` | 상품 카탈로그 - 카탈로그 미리보기 (DLG-P016) 처리 | `{ ok: true, toast: "카탈로그 미리보기 (DLG-P016) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P005.옵션-설정-p017 | PATCH | `/api/admin/products/catalog/actions/옵션-설정-p017` | 상품 카탈로그 - 옵션 설정 (DLG-P017) 처리 | `{ ok: true, toast: "옵션 설정 (DLG-P017) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P005.내용-편집-p018 | PATCH | `/api/admin/products/catalog/actions/내용-편집-p018` | 상품 카탈로그 - 내용 편집 (DLG-P018) 처리 | `{ ok: true, toast: "내용 편집 (DLG-P018) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P005.인쇄-브라우저-인쇄-다이얼로그 | PATCH | `/api/admin/products/catalog/actions/인쇄-브라우저-인쇄-다이얼로그` | 상품 카탈로그 - 인쇄 (브라우저 인쇄 다이얼로그) 처리 | `{ ok: true, toast: "인쇄 (브라우저 인쇄 다이얼로그) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P005.공유-페이지-링크-복사-qr | PATCH | `/api/admin/products/catalog/actions/공유-페이지-링크-복사-qr` | 상품 카탈로그 - 공유 (페이지 링크 복사 + QR) 처리 | `{ ok: true, toast: "공유 (페이지 링크 복사 + QR) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-P006 상품 비교
- Route: `/products/compare`
- Handoff: policy-pending
- Query Params: `상품-선택-드롭다운-1`, `상품-선택-드롭다운-2`, `상품-선택-드롭다운-3`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-P006.list | GET | `/api/admin/products/compare` | 상품 비교 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-P006", rows, metrics, permissions, policyFlags }` |
| SCR-P006.상품-선택-드롭다운-검색 | PATCH | `/api/admin/products/compare/actions/상품-선택-드롭다운-검색` | 상품 비교 - 상품 선택 (드롭다운/검색) 처리 | `{ ok: true, toast: "상품 선택 (드롭다운/검색) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P006.상품-교체-열-상단-x | PATCH | `/api/admin/products/compare/actions/상품-교체-열-상단-x` | 상품 비교 - 상품 교체(열 상단 X) 처리 | `{ ok: true, toast: "상품 교체(열 상단 X) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P006.결제-점프-회원-선택-s003 | PATCH | `/api/admin/products/compare/actions/결제-점프-회원-선택-s003` | 상품 비교 - 결제 점프 (회원 선택 + SCR-S003) 처리 | `{ ok: true, toast: "결제 점프 (회원 선택 + SCR-S003) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P006.공유-24시간-만료-url-qr | PATCH | `/api/admin/products/compare/actions/공유-24시간-만료-url-qr` | 상품 비교 - 공유 (24시간 만료 URL + QR) 처리 | `{ ok: true, toast: "공유 (24시간 만료 URL + QR) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P006.특정-상품-삭제-p010 | POST | `/api/admin/products/compare/actions/특정-상품-삭제-p010` | 상품 비교 - 특정 상품 삭제 (DLG-P010) 처리 | `{ ok: true, toast: "특정 상품 삭제 (DLG-P010) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-P007 재고 관리
- Route: `/products/inventory`
- Handoff: policy-pending
- Query Params: `상품-카테고리-운동복-일반`, `재고-상태-충분-부족-품절`, `상품명-검색`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-P007.list | GET | `/api/admin/products/inventory` | 재고 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-P007", rows, metrics, permissions, policyFlags }` |
| SCR-P007.입고-처리-p019 | PATCH | `/api/admin/products/inventory/actions/입고-처리-p019` | 재고 관리 - 입고 처리 (DLG-P019) 처리 | `{ ok: true, toast: "입고 처리 (DLG-P019) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P007.출고-처리-p020 | PATCH | `/api/admin/products/inventory/actions/출고-처리-p020` | 재고 관리 - 출고 처리 (DLG-P020) 처리 | `{ ok: true, toast: "출고 처리 (DLG-P020) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P007.재고-조정-p021 | PATCH | `/api/admin/products/inventory/actions/재고-조정-p021` | 재고 관리 - 재고 조정 (DLG-P021) 처리 | `{ ok: true, toast: "재고 조정 (DLG-P021) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P007.입출고-이력-p022 | PATCH | `/api/admin/products/inventory/actions/입출고-이력-p022` | 재고 관리 - 입출고 이력 (DLG-P022) 처리 | `{ ok: true, toast: "입출고 이력 (DLG-P022) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-P008 시즌 가격 관리
- Route: `/products/seasonal-price`
- Handoff: policy-pending
- Query Params: `상태-예정-진행-중-종료`, `대상-상품-검색`, `기간`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-P008.list | GET | `/api/admin/products/seasonal-price` | 시즌 가격 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-P008", rows, metrics, permissions, policyFlags }` |
| SCR-P008.시즌-특가-등록-p023 | PATCH | `/api/admin/products/seasonal-price/actions/시즌-특가-등록-p023` | 시즌 가격 관리 - + 시즌 특가 등록 (DLG-P023) 처리 | `{ ok: true, toast: "+ 시즌 특가 등록 (DLG-P023) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P008.시즌-특가-수정-p023-진행-중-기간-금액-변경-불가 | PATCH | `/api/admin/products/seasonal-price/actions/시즌-특가-수정-p023-진행-중-기간-금액-변경-불가` | 시즌 가격 관리 - 시즌 특가 수정 (DLG-P023, 진행 중 기간·금액 변경 불가) 처리 | `{ ok: true, toast: "시즌 특가 수정 (DLG-P023, 진행 중 기간·금액 변경 불가) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P008.시즌-특가-삭제-진행-중은-정상가-즉시-복구 | POST | `/api/admin/products/seasonal-price/actions/시즌-특가-삭제-진행-중은-정상가-즉시-복구` | 시즌 가격 관리 - 시즌 특가 삭제(진행 중은 정상가 즉시 복구) 처리 | `{ ok: true, toast: "시즌 특가 삭제(진행 중은 정상가 즉시 복구) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P008.달력-뷰-전환 | PATCH | `/api/admin/products/seasonal-price/actions/달력-뷰-전환` | 시즌 가격 관리 - 달력 뷰 전환 처리 | `{ ok: true, toast: "달력 뷰 전환 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-050 락커 관리
- Route: `/facilities/050`
- Handoff: template-ready
- Query Params: `상태-칩-전체-사용중-미배정-만료-임박-고장`, `구역-a-b-c`, `보기-전환-박스-리스트`, `락커-번호-회원명-검색`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-050.list | GET | `/api/admin/facilities/050` | 락커 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-050", rows, metrics, permissions, policyFlags }` |
| SCR-050.개별-배정-050-004 | PATCH | `/api/admin/facilities/050/actions/개별-배정-050-004` | 락커 관리 - 개별 배정 (DLG-050-004) 처리 | `{ ok: true, toast: "개별 배정 (DLG-050-004) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-050.일괄-배정-050-006 | PATCH | `/api/admin/facilities/050/actions/일괄-배정-050-006` | 락커 관리 - 일괄 배정 (DLG-050-006) 처리 | `{ ok: true, toast: "일괄 배정 (DLG-050-006) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-050.락커-이동-050-002 | PATCH | `/api/admin/facilities/050/actions/락커-이동-050-002` | 락커 관리 - 락커 이동 (DLG-050-002) 처리 | `{ ok: true, toast: "락커 이동 (DLG-050-002) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-050.락커-회수-050-003 | PATCH | `/api/admin/facilities/050/actions/락커-회수-050-003` | 락커 관리 - 락커 회수 (DLG-050-003) 처리 | `{ ok: true, toast: "락커 회수 (DLG-050-003) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-050.고장-토글-050-005 | PATCH | `/api/admin/facilities/050/actions/고장-토글-050-005` | 락커 관리 - 고장 토글 (DLG-050-005) 처리 | `{ ok: true, toast: "고장 토글 (DLG-050-005) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-050.만료-임박-일괄-해제-050-007 | POST | `/api/admin/facilities/050/actions/만료-임박-일괄-해제-050-007` | 락커 관리 - 만료 임박 일괄 해제 (DLG-050-007) 처리 | `{ ok: true, toast: "만료 임박 일괄 해제 (DLG-050-007) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-050.락커-기록-조회-050-001 | PATCH | `/api/admin/facilities/050/actions/락커-기록-조회-050-001` | 락커 관리 - 락커 기록 조회 (DLG-050-001) 처리 | `{ ok: true, toast: "락커 기록 조회 (DLG-050-001) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-051 사물함 배정 관리
- Route: `/locker/management`
- Handoff: policy-pending
- Query Params: `사물함-유형-탭-일일-개인-골프`, `회원-검색-자동완성-이름-번호-연락처`, `추천-사물함-번호-가장-작은-빈-사물함-자동`, `만료일-입력-기본-3개월-후`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-051.list | GET | `/api/admin/locker/management` | 사물함 배정 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-051", rows, metrics, permissions, policyFlags }` |
| SCR-051.배정하기-회원-사물함-선택-시-활성 | PATCH | `/api/admin/locker/management/actions/배정하기-회원-사물함-선택-시-활성` | 사물함 배정 관리 - 배정하기 (회원 + 사물함 선택 시 활성) 처리 | `{ ok: true, toast: "배정하기 (회원 + 사물함 선택 시 활성) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-051.만료-사물함-일괄-해제-시간-초과-0건이면-비활성 | POST | `/api/admin/locker/management/actions/만료-사물함-일괄-해제-시간-초과-0건이면-비활성` | 사물함 배정 관리 - 만료 사물함 일괄 해제 (시간 초과 0건이면 비활성) 처리 | `{ ok: true, toast: "만료 사물함 일괄 해제 (시간 초과 0건이면 비활성) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-051.락커-추가 | PATCH | `/api/admin/locker/management/actions/락커-추가` | 사물함 배정 관리 - 락커 추가 처리 | `{ ok: true, toast: "락커 추가 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-051.엑셀-다운로드-30-000행-이내 | PATCH | `/api/admin/locker/management/actions/엑셀-다운로드-30-000행-이내` | 사물함 배정 관리 - 엑셀 다운로드(30,000행 이내) 처리 | `{ ok: true, toast: "엑셀 다운로드(30,000행 이내) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-052 밴드/카드 관리
- Route: `/rfid`
- Handoff: policy-pending
- Query Params: `카드-번호-또는-회원명-검색`, `상태-활성-분실-해제`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-052.list | GET | `/api/admin/rfid` | 밴드/카드 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-052", rows, metrics, permissions, policyFlags }` |
| SCR-052.신규-등록-052-001 | PATCH | `/api/admin/rfid/actions/신규-등록-052-001` | 밴드/카드 관리 - 신규 등록 (DLG-052-001) 처리 | `{ ok: true, toast: "신규 등록 (DLG-052-001) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-052.이력-조회-052-002 | PATCH | `/api/admin/rfid/actions/이력-조회-052-002` | 밴드/카드 관리 - 이력 조회 (DLG-052-002) 처리 | `{ ok: true, toast: "이력 조회 (DLG-052-002) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-052.분실-처리 | PATCH | `/api/admin/rfid/actions/분실-처리` | 밴드/카드 관리 - 분실 처리 처리 | `{ ok: true, toast: "분실 처리 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-052.삭제-052-003 | POST | `/api/admin/rfid/actions/삭제-052-003` | 밴드/카드 관리 - 삭제 (DLG-052-003) 처리 | `{ ok: true, toast: "삭제 (DLG-052-003) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-053 운동룸 관리
- Route: `/rooms`
- Handoff: policy-pending
- Query Params: `유형-필터-전체-gx-pt-스피닝-필라테스-기타`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-053.list | GET | `/api/admin/rooms` | 운동룸 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-053", rows, metrics, permissions, policyFlags }` |
| SCR-053.새-운동룸-등록-053-001 | PATCH | `/api/admin/rooms/actions/새-운동룸-등록-053-001` | 운동룸 관리 - 새 운동룸 등록 (DLG-053-001) 처리 | `{ ok: true, toast: "새 운동룸 등록 (DLG-053-001) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-053.룸-수정-053-001 | PATCH | `/api/admin/rooms/actions/룸-수정-053-001` | 운동룸 관리 - 룸 수정 (DLG-053-001) 처리 | `{ ok: true, toast: "룸 수정 (DLG-053-001) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-053.룸-삭제-053-002 | POST | `/api/admin/rooms/actions/룸-삭제-053-002` | 운동룸 관리 - 룸 삭제 (DLG-053-002) 처리 | `{ ok: true, toast: "룸 삭제 (DLG-053-002) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-053.운영-상태-전환-운영중-점검중-고장-순환 | PATCH | `/api/admin/rooms/actions/운영-상태-전환-운영중-점검중-고장-순환` | 운동룸 관리 - 운영 상태 전환 (⚙: 운영중→점검중→고장 순환) 처리 | `{ ok: true, toast: "운영 상태 전환 (⚙: 운영중→점검중→고장 순환) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-054 골프 타석 관리
- Route: `/golf-bays`
- Handoff: policy-pending
- Query Params: `기간-헤더-yyyy년-mm월-yyyy년-mm월`, `보기-전환-일간-월간`, `예약-구분-전체-개인레슨-정규-시설예약`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-054.list | GET | `/api/admin/golf-bays` | 골프 타석 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-054", rows, metrics, permissions, policyFlags }` |
| SCR-054.이용-시작-회원-입력-타이머-시작 | PATCH | `/api/admin/golf-bays/actions/이용-시작-회원-입력-타이머-시작` | 골프 타석 관리 - 이용 시작 (회원 입력 → 타이머 시작) 처리 | `{ ok: true, toast: "이용 시작 (회원 입력 → 타이머 시작) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-054.이용-종료-대기열-자동-배정 | PATCH | `/api/admin/golf-bays/actions/이용-종료-대기열-자동-배정` | 골프 타석 관리 - 이용 종료 (대기열 자동 배정) 처리 | `{ ok: true, toast: "이용 종료 (대기열 자동 배정) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-054.타석-이동 | PATCH | `/api/admin/golf-bays/actions/타석-이동` | 골프 타석 관리 - 타석 이동 처리 | `{ ok: true, toast: "타석 이동 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-054.점검-처리 | PATCH | `/api/admin/golf-bays/actions/점검-처리` | 골프 타석 관리 - 점검 처리 처리 | `{ ok: true, toast: "점검 처리 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-054.프로젝터-on-off-iot | PATCH | `/api/admin/golf-bays/actions/프로젝터-on-off-iot` | 골프 타석 관리 - 프로젝터 ON/OFF (IoT) 처리 | `{ ok: true, toast: "프로젝터 ON/OFF (IoT) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-054.예약-상세-모달-삭제-취소-결석-완료 | POST | `/api/admin/golf-bays/actions/예약-상세-모달-삭제-취소-결석-완료` | 골프 타석 관리 - 예약 상세 모달(삭제/취소/결석/완료) 처리 | `{ ok: true, toast: "예약 상세 모달(삭제/취소/결석/완료) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-054.대기열-알림-발송 | PATCH | `/api/admin/golf-bays/actions/대기열-알림-발송` | 골프 타석 관리 - 대기열 알림 발송 처리 | `{ ok: true, toast: "대기열 알림 발송 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-055 상품 재고 관리
- Route: `/facility/inventory`
- Handoff: policy-pending
- Query Params: `품목명-품목-코드-분류명-검색`, `상태-탭`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-055.list | GET | `/api/admin/facility/inventory` | 상품 재고 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-055", rows, metrics, permissions, policyFlags }` |
| SCR-055.품목-등록 | PATCH | `/api/admin/facility/inventory/actions/품목-등록` | 상품 재고 관리 - 품목 등록 처리 | `{ ok: true, toast: "품목 등록 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-055.입고-처리 | PATCH | `/api/admin/facility/inventory/actions/입고-처리` | 상품 재고 관리 - 입고 처리 처리 | `{ ok: true, toast: "입고 처리 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-055.출고-처리-사유-필수 | PATCH | `/api/admin/facility/inventory/actions/출고-처리-사유-필수` | 상품 재고 관리 - 출고 처리(사유 필수) 처리 | `{ ok: true, toast: "출고 처리(사유 필수) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-055.재고-조정-사유-필수 | PATCH | `/api/admin/facility/inventory/actions/재고-조정-사유-필수` | 상품 재고 관리 - 재고 조정(사유 필수) 처리 | `{ ok: true, toast: "재고 조정(사유 필수) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-055.엑셀-다운로드-30-000행-이내 | PATCH | `/api/admin/facility/inventory/actions/엑셀-다운로드-30-000행-이내` | 상품 재고 관리 - 엑셀 다운로드(30,000행 이내) 처리 | `{ ok: true, toast: "엑셀 다운로드(30,000행 이내) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-056 장비 점검 일정
- Route: `/equipment-check`
- Handoff: policy-pending
- Query Params: `장비-유형`, `위치`, `상태-정상-점검-예정-수리중-고장`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-056.list | GET | `/api/admin/equipment-check` | 장비 점검 일정 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-056", rows, metrics, permissions, policyFlags }` |
| SCR-056.장비-등록-056-001 | PATCH | `/api/admin/equipment-check/actions/장비-등록-056-001` | 장비 점검 일정 - 장비 등록 (DLG-056-001) 처리 | `{ ok: true, toast: "장비 등록 (DLG-056-001) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-056.점검-등록-056-002 | PATCH | `/api/admin/equipment-check/actions/점검-등록-056-002` | 장비 점검 일정 - 점검 등록 (DLG-056-002) 처리 | `{ ok: true, toast: "점검 등록 (DLG-056-002) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-056.수리-접수-056-003 | PATCH | `/api/admin/equipment-check/actions/수리-접수-056-003` | 장비 점검 일정 - 수리 접수 (DLG-056-003) 처리 | `{ ok: true, toast: "수리 접수 (DLG-056-003) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-056.엑셀-다운로드-30-000행-이내 | PATCH | `/api/admin/equipment-check/actions/엑셀-다운로드-30-000행-이내` | 장비 점검 일정 - 엑셀 다운로드(30,000행 이내) 처리 | `{ ok: true, toast: "엑셀 다운로드(30,000행 이내) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-057 소모품 재고 관리
- Route: `/consumables`
- Handoff: policy-pending
- Query Params: `카테고리`, `상태-탭`, `품목명-검색`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-057.list | GET | `/api/admin/consumables` | 소모품 재고 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-057", rows, metrics, permissions, policyFlags }` |
| SCR-057.소모품-등록-057-001 | PATCH | `/api/admin/consumables/actions/소모품-등록-057-001` | 소모품 재고 관리 - 소모품 등록 (DLG-057-001) 처리 | `{ ok: true, toast: "소모품 등록 (DLG-057-001) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-057.입출고-처리-057-002 | PATCH | `/api/admin/consumables/actions/입출고-처리-057-002` | 소모품 재고 관리 - 입출고 처리 (DLG-057-002) 처리 | `{ ok: true, toast: "입출고 처리 (DLG-057-002) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-057.발주-생성-057-003 | PATCH | `/api/admin/consumables/actions/발주-생성-057-003` | 소모품 재고 관리 - 발주 생성 (DLG-057-003) 처리 | `{ ok: true, toast: "발주 생성 (DLG-057-003) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-057.엑셀-다운로드-30-000행-이내 | PATCH | `/api/admin/consumables/actions/엑셀-다운로드-30-000행-이내` | 소모품 재고 관리 - 엑셀 다운로드(30,000행 이내) 처리 | `{ ok: true, toast: "엑셀 다운로드(30,000행 이내) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-058 청소 스케줄
- Route: `/cleaning-schedule`
- Handoff: policy-pending
- Query Params: `기간-선택-이력-조회`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-058.list | GET | `/api/admin/cleaning-schedule` | 청소 스케줄 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-058", rows, metrics, permissions, policyFlags }` |
| SCR-058.청소-스케줄-등록-058-001 | PATCH | `/api/admin/cleaning-schedule/actions/청소-스케줄-등록-058-001` | 청소 스케줄 - 청소 스케줄 등록 (DLG-058-001) 처리 | `{ ok: true, toast: "청소 스케줄 등록 (DLG-058-001) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-058.완료-체크 | PATCH | `/api/admin/cleaning-schedule/actions/완료-체크` | 청소 스케줄 - 완료 체크 처리 | `{ ok: true, toast: "완료 체크 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-058.이력-조회 | PATCH | `/api/admin/cleaning-schedule/actions/이력-조회` | 청소 스케줄 - 이력 조회 처리 | `{ ok: true, toast: "이력 조회 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-059 공간 자산 관리
- Route: `/rooms`
- Handoff: policy-pending
- Query Params: `탭-운동룸-골프-타석-기타-공간`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-059.list | GET | `/api/admin/rooms` | 공간 자산 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-059", rows, metrics, permissions, policyFlags }` |
| SCR-059.탭-전환-운동룸-골프-타석-기타 | PATCH | `/api/admin/rooms/actions/탭-전환-운동룸-골프-타석-기타` | 공간 자산 관리 - 탭 전환(운동룸/골프 타석/기타) 처리 | `{ ok: true, toast: "탭 전환(운동룸/골프 타석/기타) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-059.상태-변경-운영중-점검중-고장-미사용 | PATCH | `/api/admin/rooms/actions/상태-변경-운영중-점검중-고장-미사용` | 공간 자산 관리 - 상태 변경(운영중→점검중→고장→미사용) 처리 | `{ ok: true, toast: "상태 변경(운영중→점검중→고장→미사용) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-059.예약-현황-확인 | PATCH | `/api/admin/rooms/actions/예약-현황-확인` | 공간 자산 관리 - 예약 현황 확인 처리 | `{ ok: true, toast: "예약 현황 확인 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-059.자산-삭제는-fac-04-fac-05-원-도메인에서-처리 | POST | `/api/admin/rooms/actions/자산-삭제는-fac-04-fac-05-원-도메인에서-처리` | 공간 자산 관리 - 자산 삭제는 FAC-04/FAC-05 원 도메인에서 처리 처리 | `{ ok: true, toast: "자산 삭제는 FAC-04/FAC-05 원 도메인에서 처리 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-060 직원 목록
- Route: `/staff`
- Handoff: template-ready
- Query Params: `직원-이름-연락처-통합-검색`, `직무-owner-매니저-fc-pt트레이너-gx강사-골프강사-스태프`, `소속-지점-본사-통합-모드만`, `재직-상태-재직-휴직-퇴사`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-060.list | GET | `/api/admin/staff` | 직원 목록 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-060", rows, metrics, permissions, policyFlags }` |
| SCR-060.직원-등록-061 | PATCH | `/api/admin/staff/actions/직원-등록-061` | 직원 목록 - + 직원 등록 → SCR-061 처리 | `{ ok: true, toast: "+ 직원 등록 → SCR-061 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-060.직원-정보-수정-manager | PATCH | `/api/admin/staff/actions/직원-정보-수정-manager` | 직원 목록 - 직원 정보 수정 (manager+) 처리 | `{ ok: true, toast: "직원 정보 수정 (manager+) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-060.메시지-전송-manager | PATCH | `/api/admin/staff/actions/메시지-전송-manager` | 직원 목록 - 메시지 전송 (manager+) 처리 | `{ ok: true, toast: "메시지 전송 (manager+) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-060.재직-휴직-상태-변경-manager | PATCH | `/api/admin/staff/actions/재직-휴직-상태-변경-manager` | 직원 목록 - 재직↔휴직 상태 변경 (manager+) 처리 | `{ ok: true, toast: "재직↔휴직 상태 변경 (manager+) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-060.퇴사-처리-owner-060-002 | POST | `/api/admin/staff/actions/퇴사-처리-owner-060-002` | 직원 목록 - 퇴사 처리 (Owner+, DLG-060-002) 처리 | `{ ok: true, toast: "퇴사 처리 (Owner+, DLG-060-002) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-061 직원 등록/수정
- Route: `/staff/new`
- Handoff: template-ready
- Query Params: `신규-등록-수정-모드-자동-식별`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-061.list | GET | `/api/admin/staff/new` | 직원 등록/수정 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-061", rows, metrics, permissions, policyFlags }` |
| SCR-061.저장-유효성-검사-직원-로그인-계정-함께-저장 | PATCH | `/api/admin/staff/new/actions/저장-유효성-검사-직원-로그인-계정-함께-저장` | 직원 등록/수정 - 저장 (유효성 검사 + 직원 + 로그인 계정 함께 저장) 처리 | `{ ok: true, toast: "저장 (유효성 검사 + 직원 + 로그인 계정 함께 저장) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-061.취소-061-001 | PATCH | `/api/admin/staff/new/actions/취소-061-001` | 직원 등록/수정 - 취소 (DLG-061-001) 처리 | `{ ok: true, toast: "취소 (DLG-061-001) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-062 직원 퇴사 처리
- Route: `/staff/resignation`
- Handoff: template-ready
- Query Params: `퇴사-사유-자발-권고-계약-만료-기타`, `즉시-퇴사-예약-퇴사`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-062.list | GET | `/api/admin/staff/resignation` | 직원 퇴사 처리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-062", rows, metrics, permissions, policyFlags }` |
| SCR-062.처리-완료-060-002-텍스트-퇴사처리-일치-시 | POST | `/api/admin/staff/resignation/actions/처리-완료-060-002-텍스트-퇴사처리-일치-시` | 직원 퇴사 처리 - 처리 완료 (DLG-060-002, 텍스트 `퇴사처리` 일치 시) 처리 | `{ ok: true, toast: "처리 완료 (DLG-060-002, 텍스트 `퇴사처리` 일치 시) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-062.취소 | PATCH | `/api/admin/staff/resignation/actions/취소` | 직원 퇴사 처리 - 취소 처리 | `{ ok: true, toast: "취소 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-062.당일-과거-즉시-계정-비활성-로그인-종료 | PATCH | `/api/admin/staff/resignation/actions/당일-과거-즉시-계정-비활성-로그인-종료` | 직원 퇴사 처리 - 당일/과거 → 즉시 계정 비활성·로그인 종료 처리 | `{ ok: true, toast: "당일/과거 → 즉시 계정 비활성·로그인 종료 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-062.미래-퇴사-예약-상태-확정일-도래-시-자동-비활성 | POST | `/api/admin/staff/resignation/actions/미래-퇴사-예약-상태-확정일-도래-시-자동-비활성` | 직원 퇴사 처리 - 미래 퇴사 → 예약 상태, 확정일 도래 시 자동 비활성 처리 | `{ ok: true, toast: "미래 퇴사 → 예약 상태, 확정일 도래 시 자동 비활성 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-062.퇴사-취소-24시간-이내-owner-권한 | POST | `/api/admin/staff/resignation/actions/퇴사-취소-24시간-이내-owner-권한` | 직원 퇴사 처리 - 퇴사 취소 (24시간 이내, Owner+ 권한) 처리 | `{ ok: true, toast: "퇴사 취소 (24시간 이내, Owner+ 권한) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-063 직원 근태 관리
- Route: `/staff/attendance`
- Handoff: template-ready
- Query Params: `조회-기간-월-또는-날짜-범위`, `특정-직원-또는-전체`, `상태-정상-지각-결근-조퇴-외근-휴가`, `출처-키오스크-iot-수동-보정-누락-추가`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-063.list | GET | `/api/admin/staff/attendance` | 직원 근태 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-063", rows, metrics, permissions, policyFlags }` |
| SCR-063.수동-보정-시각-수정-또는-누락-추가-변경-사유-필수 | PATCH | `/api/admin/staff/attendance/actions/수동-보정-시각-수정-또는-누락-추가-변경-사유-필수` | 직원 근태 관리 - 수동 보정(시각 수정 또는 누락 추가, 변경 사유 필수) 처리 | `{ ok: true, toast: "수동 보정(시각 수정 또는 누락 추가, 변경 사유 필수) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-063.월별-집계-요약-급여-산정-자료 | PATCH | `/api/admin/staff/attendance/actions/월별-집계-요약-급여-산정-자료` | 직원 근태 관리 - 월별 집계 요약(급여 산정 자료) 처리 | `{ ok: true, toast: "월별 집계 요약(급여 산정 자료) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-063.엑셀-다운로드-대용량-백그라운드-잡 | PATCH | `/api/admin/staff/attendance/actions/엑셀-다운로드-대용량-백그라운드-잡` | 직원 근태 관리 - 엑셀 다운로드(대용량 백그라운드 잡) 처리 | `{ ok: true, toast: "엑셀 다운로드(대용량 백그라운드 잡) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-064 급여 관리
- Route: `/payroll`
- Handoff: template-ready
- Query Params: `지급-월-선택-전월-이전은-마감`, `확정-상태-미확정-확정`, `직군별-산식-탭-fc-pt-gx-공통`, `매출-타입-수업-타입-정책-패널`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-064.list | GET | `/api/admin/payroll` | 급여 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-064", rows, metrics, permissions, policyFlags }` |
| SCR-064.수당-공제-편집-064-001-당월-미확정만 | PATCH | `/api/admin/payroll/actions/수당-공제-편집-064-001-당월-미확정만` | 급여 관리 - 수당·공제 편집 (DLG-064-001, 당월 미확정만) 처리 | `{ ok: true, toast: "수당·공제 편집 (DLG-064-001, 당월 미확정만) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-064.급여-확정-064-002-개별-또는-일괄 | PATCH | `/api/admin/payroll/actions/급여-확정-064-002-개별-또는-일괄` | 급여 관리 - 급여 확정 (DLG-064-002, 개별 또는 일괄) 처리 | `{ ok: true, toast: "급여 확정 (DLG-064-002, 개별 또는 일괄) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-064.확정-취소-당월-내-owner | PATCH | `/api/admin/payroll/actions/확정-취소-당월-내-owner` | 급여 관리 - 확정 취소 (당월 내, Owner+) 처리 | `{ ok: true, toast: "확정 취소 (당월 내, Owner+) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-064.급여-정책-추가-수정-064-003 | PATCH | `/api/admin/payroll/actions/급여-정책-추가-수정-064-003` | 급여 관리 - 급여 정책 추가/수정 (DLG-064-003) 처리 | `{ ok: true, toast: "급여 정책 추가/수정 (DLG-064-003) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-064.엑셀-다운로드-노무사-양식-옵션 | PATCH | `/api/admin/payroll/actions/엑셀-다운로드-노무사-양식-옵션` | 급여 관리 - 엑셀 다운로드(노무사 양식 옵션) 처리 | `{ ok: true, toast: "엑셀 다운로드(노무사 양식 옵션) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-065 급여 명세서
- Route: `/payroll/statements`
- Handoff: template-ready
- Query Params: `조회-월`, `특정-직원-또는-전체`, `발송-상태-미발송-발송완료-무효`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-065.list | GET | `/api/admin/payroll/statements` | 급여 명세서 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-065", rows, metrics, permissions, policyFlags }` |
| SCR-065.개별-발송-이메일-앱-푸시 | PATCH | `/api/admin/payroll/statements/actions/개별-발송-이메일-앱-푸시` | 급여 명세서 - 개별 발송 (이메일 + 앱 푸시) 처리 | `{ ok: true, toast: "개별 발송 (이메일 + 앱 푸시) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-065.일괄-발송-체크박스-선택 | PATCH | `/api/admin/payroll/statements/actions/일괄-발송-체크박스-선택` | 급여 명세서 - 일괄 발송 (체크박스 선택) 처리 | `{ ok: true, toast: "일괄 발송 (체크박스 선택) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-065.재발송-발송완료-명세서-이력-추가 | PATCH | `/api/admin/payroll/statements/actions/재발송-발송완료-명세서-이력-추가` | 급여 명세서 - 재발송 (발송완료 명세서, 이력 추가) 처리 | `{ ok: true, toast: "재발송 (발송완료 명세서, 이력 추가) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-065.pdf-저장-yyyymm-직원명-급여명세서-pdf | PATCH | `/api/admin/payroll/statements/actions/pdf-저장-yyyymm-직원명-급여명세서-pdf` | 급여 명세서 - PDF 저장 (yyyymm_직원명_급여명세서.pdf) 처리 | `{ ok: true, toast: "PDF 저장 (yyyymm_직원명_급여명세서.pdf) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-065.인쇄 | PATCH | `/api/admin/payroll/statements/actions/인쇄` | 급여 명세서 - 인쇄 처리 | `{ ok: true, toast: "인쇄 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-070 리드 관리
- Route: `/leads`
- Handoff: template-ready
- Query Params: `상태-전체-신규-연락완료-상담예정-방문완료-등록완료-미전환-보류`, `문의-유형-방문-wi-전화문의-ti-체험-일일입장`, `가입경로-간판-블로그-인스타-당근-지역카페-현수막-전단지-회원소개-기타`, `이름-연락처-담당fc-검색`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-070.list | GET | `/api/admin/leads` | 리드 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-070", rows, metrics, permissions, policyFlags }` |
| SCR-070.리드-등록-070-001 | PATCH | `/api/admin/leads/actions/리드-등록-070-001` | 리드 관리 - + 리드 등록 (DLG-070-001) 처리 | `{ ok: true, toast: "+ 리드 등록 (DLG-070-001) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-070.리드-수정-070-001 | PATCH | `/api/admin/leads/actions/리드-수정-070-001` | 리드 관리 - 리드 수정 (DLG-070-001) 처리 | `{ ok: true, toast: "리드 수정 (DLG-070-001) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-070.회원-등록-결제-진행-m002-연계 | PATCH | `/api/admin/leads/actions/회원-등록-결제-진행-m002-연계` | 리드 관리 - 회원 등록/결제 진행 (SCR-M002 연계) 처리 | `{ ok: true, toast: "회원 등록/결제 진행 (SCR-M002 연계) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-070.리드-삭제-070-002 | POST | `/api/admin/leads/actions/리드-삭제-070-002` | 리드 관리 - 리드 삭제 (DLG-070-002) 처리 | `{ ok: true, toast: "리드 삭제 (DLG-070-002) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-070.뷰-전환-목록-칸반 | PATCH | `/api/admin/leads/actions/뷰-전환-목록-칸반` | 리드 관리 - 뷰 전환 (목록↔칸반) 처리 | `{ ok: true, toast: "뷰 전환 (목록↔칸반) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-071 메시지 발송
- Route: `/message`
- Handoff: template-ready
- Query Params: `수신자-그룹-전체-활성-만료-홀딩-장기-미방문-만료-step-대상`, `회원-개별-검색-이름-연락처-이용권-등급-담당자`, `리드-대상-그룹-전체-신규-연락완료-상담예정-미전환-보류`, `발송-채널-push-카카오톡-sms`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-071.list | GET | `/api/admin/message` | 메시지 발송 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-071", rows, metrics, permissions, policyFlags }` |
| SCR-071.수신자-검색-071-001 | PATCH | `/api/admin/message/actions/수신자-검색-071-001` | 메시지 발송 - 수신자 검색 (DLG-071-001) 처리 | `{ ok: true, toast: "수신자 검색 (DLG-071-001) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-071.미리보기-071-002 | PATCH | `/api/admin/message/actions/미리보기-071-002` | 메시지 발송 - 미리보기 (DLG-071-002) 처리 | `{ ok: true, toast: "미리보기 (DLG-071-002) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-071.즉시-발송 | PATCH | `/api/admin/message/actions/즉시-발송` | 메시지 발송 - 즉시 발송 처리 | `{ ok: true, toast: "즉시 발송 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-071.예약-발송-5분-전-취소-가능 | PATCH | `/api/admin/message/actions/예약-발송-5분-전-취소-가능` | 메시지 발송 - 예약 발송(5분 전 취소 가능) 처리 | `{ ok: true, toast: "예약 발송(5분 전 취소 가능) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-072 자동 알림 설정
- Route: `/message/auto-alarm`
- Handoff: template-ready
- Query Params: `만료-정책-탭`, `고객-관련-알림-목록-회원-이용권-만료-결제기한-만료-락커-만료-생일-장기-미방문-등록-감사-첫-방문-환영`, `상품-결제-관련-알림-목록-이용권-만료-당일-홀딩-종료-결제-완료-환불-처리`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-072.list | GET | `/api/admin/message/auto-alarm` | 자동 알림 설정 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-072", rows, metrics, permissions, policyFlags }` |
| SCR-072.알림-규칙-편집-072-001 | PATCH | `/api/admin/message/auto-alarm/actions/알림-규칙-편집-072-001` | 자동 알림 설정 - 알림 규칙 편집 (DLG-072-001) 처리 | `{ ok: true, toast: "알림 규칙 편집 (DLG-072-001) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-072.알림-트리거-추가-072-002 | PATCH | `/api/admin/message/auto-alarm/actions/알림-트리거-추가-072-002` | 자동 알림 설정 - 알림 트리거 추가 (DLG-072-002) 처리 | `{ ok: true, toast: "알림 트리거 추가 (DLG-072-002) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-072.지점-step-추가-회원-이용권-락커-만료만 | PATCH | `/api/admin/message/auto-alarm/actions/지점-step-추가-회원-이용권-락커-만료만` | 자동 알림 설정 - 지점 step 추가(회원 이용권/락커 만료만) 처리 | `{ ok: true, toast: "지점 step 추가(회원 이용권/락커 만료만) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-072.전체-자동-알림-on-off-owner | PATCH | `/api/admin/message/auto-alarm/actions/전체-자동-알림-on-off-owner` | 자동 알림 설정 - 전체 자동 알림 ON/OFF (Owner+) 처리 | `{ ok: true, toast: "전체 자동 알림 ON/OFF (Owner+) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-072A 자동알림 운영현황
- Route: `/message/auto-alarm`
- Handoff: template-ready
- Query Params: `기간-주간-월간`, `정책-유형`, `발송-채널`, `성공-실패`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-072A.list | GET | `/api/admin/message/auto-alarm` | 자동알림 운영현황 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-072A", rows, metrics, permissions, policyFlags }` |
| SCR-072A.fc-후속-액션-연결-실패-미응답 | PATCH | `/api/admin/message/auto-alarm/actions/fc-후속-액션-연결-실패-미응답` | 자동알림 운영현황 - FC 후속 액션 연결 (실패·미응답) 처리 | `{ ok: true, toast: "FC 후속 액션 연결 (실패·미응답) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-072A.발송-이력-상세-mkt-01-통합-이력 | PATCH | `/api/admin/message/auto-alarm/actions/발송-이력-상세-mkt-01-통합-이력` | 자동알림 운영현황 - 발송 이력 상세 (MKT-01 통합 이력) 처리 | `{ ok: true, toast: "발송 이력 상세 (MKT-01 통합 이력) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-072A.엑셀-다운로드 | PATCH | `/api/admin/message/auto-alarm/actions/엑셀-다운로드` | 자동알림 운영현황 - 엑셀 다운로드 처리 | `{ ok: true, toast: "엑셀 다운로드 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-073 쿠폰 관리
- Route: `/message/coupon`
- Handoff: template-ready
- Query Params: `상태-활성-만료-중단`, `쿠폰명-검색`, `기간`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-073.list | GET | `/api/admin/message/coupon` | 쿠폰 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-073", rows, metrics, permissions, policyFlags }` |
| SCR-073.쿠폰-생성-073-001 | PATCH | `/api/admin/message/coupon/actions/쿠폰-생성-073-001` | 쿠폰 관리 - + 쿠폰 생성 (DLG-073-001) 처리 | `{ ok: true, toast: "+ 쿠폰 생성 (DLG-073-001) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-073.쿠폰-발급-073-002 | PATCH | `/api/admin/message/coupon/actions/쿠폰-발급-073-002` | 쿠폰 관리 - 쿠폰 발급 (DLG-073-002) 처리 | `{ ok: true, toast: "쿠폰 발급 (DLG-073-002) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-073.쿠폰-수정-073-001 | PATCH | `/api/admin/message/coupon/actions/쿠폰-수정-073-001` | 쿠폰 관리 - 쿠폰 수정 (DLG-073-001) 처리 | `{ ok: true, toast: "쿠폰 수정 (DLG-073-001) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-073.쿠폰-삭제-중단-073-003 | POST | `/api/admin/message/coupon/actions/쿠폰-삭제-중단-073-003` | 쿠폰 관리 - 쿠폰 삭제/중단 (DLG-073-003) 처리 | `{ ok: true, toast: "쿠폰 삭제/중단 (DLG-073-003) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-074 마일리지 관리
- Route: `/mileage`
- Handoff: template-ready
- Query Params: `회원-이름-연락처-검색`, `기간`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-074.list | GET | `/api/admin/mileage` | 마일리지 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-074", rows, metrics, permissions, policyFlags }` |
| SCR-074.적립-규칙-설정-074-001 | PATCH | `/api/admin/mileage/actions/적립-규칙-설정-074-001` | 마일리지 관리 - 적립 규칙 설정 (DLG-074-001) 처리 | `{ ok: true, toast: "적립 규칙 설정 (DLG-074-001) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-074.수동-적립-차감-074-002 | PATCH | `/api/admin/mileage/actions/수동-적립-차감-074-002` | 마일리지 관리 - 수동 적립·차감 (DLG-074-002) 처리 | `{ ok: true, toast: "수동 적립·차감 (DLG-074-002) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-074.이력-조회-날짜-구분-금액-사유-처리자 | PATCH | `/api/admin/mileage/actions/이력-조회-날짜-구분-금액-사유-처리자` | 마일리지 관리 - 이력 조회(날짜/구분/금액/사유/처리자) 처리 | `{ ok: true, toast: "이력 조회(날짜/구분/금액/사유/처리자) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-074.소멸-예정-알림-발송-d-30 | PATCH | `/api/admin/mileage/actions/소멸-예정-알림-발송-d-30` | 마일리지 관리 - 소멸 예정 알림 발송(D-30) 처리 | `{ ok: true, toast: "소멸 예정 알림 발송(D-30) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-075 전자 계약
- Route: `/contracts/new`
- Handoff: template-ready
- Query Params: `계약-유형-회원-직원-근로계약`, `회원-직원-검색`, `기간`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-075.list | GET | `/api/admin/contracts/new` | 전자 계약 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-075", rows, metrics, permissions, policyFlags }` |
| SCR-075.계약-작성-유형-대상-내용-입력 | PATCH | `/api/admin/contracts/new/actions/계약-작성-유형-대상-내용-입력` | 전자 계약 - 계약 작성 (유형·대상·내용 입력) 처리 | `{ ok: true, toast: "계약 작성 (유형·대상·내용 입력) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-075.전자-서명-패널 | PATCH | `/api/admin/contracts/new/actions/전자-서명-패널` | 전자 계약 - 전자 서명 패널 처리 | `{ ok: true, toast: "전자 서명 패널 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-075.원격-서명-링크-전송-sms-카톡-7일-유효 | PATCH | `/api/admin/contracts/new/actions/원격-서명-링크-전송-sms-카톡-7일-유효` | 전자 계약 - 원격 서명 링크 전송 (SMS/카톡, 7일 유효) 처리 | `{ ok: true, toast: "원격 서명 링크 전송 (SMS/카톡, 7일 유효) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-075.계약서-재발송-1일-5회-한도 | PATCH | `/api/admin/contracts/new/actions/계약서-재발송-1일-5회-한도` | 전자 계약 - 계약서 재발송 (1일 5회 한도) 처리 | `{ ok: true, toast: "계약서 재발송 (1일 5회 한도) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-075.계약-해지-해지-사유-원본-보존 | POST | `/api/admin/contracts/new/actions/계약-해지-해지-사유-원본-보존` | 전자 계약 - 계약 해지 (해지 사유 + 원본 보존) 처리 | `{ ok: true, toast: "계약 해지 (해지 사유 + 원본 보존) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-076 캠페인 관리
- Route: `/marketing/campaign`
- Handoff: template-ready
- Query Params: `상태-준비-진행-종료`, `캠페인-목표`, `기간`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-076.list | GET | `/api/admin/marketing/campaign` | 캠페인 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-076", rows, metrics, permissions, policyFlags }` |
| SCR-076.캠페인-생성-076-001 | PATCH | `/api/admin/marketing/campaign/actions/캠페인-생성-076-001` | 캠페인 관리 - + 캠페인 생성 (DLG-076-001) 처리 | `{ ok: true, toast: "+ 캠페인 생성 (DLG-076-001) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-076.캠페인-수정-진행-전만 | PATCH | `/api/admin/marketing/campaign/actions/캠페인-수정-진행-전만` | 캠페인 관리 - 캠페인 수정 (진행 전만) 처리 | `{ ok: true, toast: "캠페인 수정 (진행 전만) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-076.실적-추적-패널-roi | PATCH | `/api/admin/marketing/campaign/actions/실적-추적-패널-roi` | 캠페인 관리 - 실적 추적 패널(ROI) 처리 | `{ ok: true, toast: "실적 추적 패널(ROI) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-076.캠페인-삭제-076-002-진행-중은-즉시-종료 | POST | `/api/admin/marketing/campaign/actions/캠페인-삭제-076-002-진행-중은-즉시-종료` | 캠페인 관리 - 캠페인 삭제 (DLG-076-002, 진행 중은 즉시 종료) 처리 | `{ ok: true, toast: "캠페인 삭제 (DLG-076-002, 진행 중은 즉시 종료) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-077 리퍼럴 프로그램
- Route: `/marketing/referral`
- Handoff: policy-pending
- Query Params: `상태-준비-진행-종료`, `이벤트명-검색`, `기간`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-077.list | GET | `/api/admin/marketing/referral` | 리퍼럴 프로그램 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-077", rows, metrics, permissions, policyFlags }` |
| SCR-077.이벤트-등록-077-001 | PATCH | `/api/admin/marketing/referral/actions/이벤트-등록-077-001` | 리퍼럴 프로그램 - + 이벤트 등록 (DLG-077-001) 처리 | `{ ok: true, toast: "+ 이벤트 등록 (DLG-077-001) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-077.프로그램-편집-보상-조건-활성 | PATCH | `/api/admin/marketing/referral/actions/프로그램-편집-보상-조건-활성` | 리퍼럴 프로그램 - 프로그램 편집 (보상·조건·활성) 처리 | `{ ok: true, toast: "프로그램 편집 (보상·조건·활성) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-077.추천인-피추천인-이력-조회 | PATCH | `/api/admin/marketing/referral/actions/추천인-피추천인-이력-조회` | 리퍼럴 프로그램 - 추천인/피추천인 이력 조회 처리 | `{ ok: true, toast: "추천인/피추천인 이력 조회 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-077.이벤트-삭제-077-002 | POST | `/api/admin/marketing/referral/actions/이벤트-삭제-077-002` | 리퍼럴 프로그램 - 이벤트 삭제 (DLG-077-002) 처리 | `{ ok: true, toast: "이벤트 삭제 (DLG-077-002) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-078 SMS/카카오 대량 발송
- Route: `/marketing/sms`
- Handoff: template-ready
- Query Params: `주-채널-선택-카카오-알림톡-sms-계열-명시`, `발송-대상-그룹-전체-활성-만료-특정-등급-장기-미방문`, `추가-조건-회원-등급-이용권-상태-지역-가입-기간`, `예약-즉시`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-078.list | GET | `/api/admin/marketing/sms` | SMS/카카오 대량 발송 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-078", rows, metrics, permissions, policyFlags }` |
| SCR-078.발송-대상-선택-078-001 | PATCH | `/api/admin/marketing/sms/actions/발송-대상-선택-078-001` | SMS/카카오 대량 발송 - 발송 대상 선택 (DLG-078-001) 처리 | `{ ok: true, toast: "발송 대상 선택 (DLG-078-001) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-078.발송-확인-078-002 | PATCH | `/api/admin/marketing/sms/actions/발송-확인-078-002` | SMS/카카오 대량 발송 - 발송 확인 (DLG-078-002) 처리 | `{ ok: true, toast: "발송 확인 (DLG-078-002) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-078.메시지-템플릿-선택-편집 | PATCH | `/api/admin/marketing/sms/actions/메시지-템플릿-선택-편집` | SMS/카카오 대량 발송 - 메시지 템플릿 선택·편집 처리 | `{ ok: true, toast: "메시지 템플릿 선택·편집 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-078.즉시-발송-예약-발송 | PATCH | `/api/admin/marketing/sms/actions/즉시-발송-예약-발송` | SMS/카카오 대량 발송 - 즉시 발송 / 예약 발송 처리 | `{ ok: true, toast: "즉시 발송 / 예약 발송 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-079 A/B 테스트
- Route: `/marketing/ab-test`
- Handoff: policy-pending
- Query Params: none
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-079.list | GET | `/api/admin/marketing/ab-test` | A/B 테스트 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-079", rows, metrics, permissions, policyFlags }` |
| SCR-079.v1-메뉴-미노출-안내 | PATCH | `/api/admin/marketing/ab-test/actions/v1-메뉴-미노출-안내` | A/B 테스트 - V1 메뉴 미노출 안내 처리 | `{ ok: true, toast: "V1 메뉴 미노출 안내 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-079.v2-후속-문서-위치-안내-docs4-v2-d08-마케팅-305 | PATCH | `/api/admin/marketing/ab-test/actions/v2-후속-문서-위치-안내-docs4-v2-d08-마케팅-305` | A/B 테스트 - V2 후속 문서 위치 안내(docs4/V2/D08-마케팅:305) 처리 | `{ ok: true, toast: "V2 후속 문서 위치 안내(docs4/V2/D08-마케팅:305) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-080 센터 설정
- Route: `/settings`
- Handoff: template-ready
- Query Params: `탭-전환-기본정보-알림설정-테마설정-물품-관리`, `영향도-프리뷰`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-080.list | GET | `/api/admin/settings` | 센터 설정 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-080", rows, metrics, permissions, policyFlags }` |
| SCR-080.저장-변경-사항-있을-때만-활성 | PATCH | `/api/admin/settings/actions/저장-변경-사항-있을-때만-활성` | 센터 설정 - 저장 (변경 사항 있을 때만 활성) 처리 | `{ ok: true, toast: "저장 (변경 사항 있을 때만 활성) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-080.주소-검색 | PATCH | `/api/admin/settings/actions/주소-검색` | 센터 설정 - 주소 검색 처리 | `{ ok: true, toast: "주소 검색 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-080.탭-이동-시-미저장-경고-080-001 | PATCH | `/api/admin/settings/actions/탭-이동-시-미저장-경고-080-001` | 센터 설정 - 탭 이동 시 미저장 경고 (DLG-080-001) 처리 | `{ ok: true, toast: "탭 이동 시 미저장 경고 (DLG-080-001) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-080A 지점 자동화 적용
- Route: `/settings/automation`
- Handoff: template-ready
- Query Params: `적용-범위-탭`, `정책-유형-탭`, `on-off-상태`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-080A.list | GET | `/api/admin/settings/automation` | 지점 자동화 적용 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-080A", rows, metrics, permissions, policyFlags }` |
| SCR-080A.정책-적용-확인-080a-001 | PATCH | `/api/admin/settings/automation/actions/정책-적용-확인-080a-001` | 지점 자동화 적용 - 정책 적용 확인 (DLG-080A-001) 처리 | `{ ok: true, toast: "정책 적용 확인 (DLG-080A-001) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-080A.지점-step-추가-회원-이용권-락커-만료만-owner | PATCH | `/api/admin/settings/automation/actions/지점-step-추가-회원-이용권-락커-만료만-owner` | 지점 자동화 적용 - 지점 step 추가 (회원 이용권·락커 만료만, Owner+) 처리 | `{ ok: true, toast: "지점 step 추가 (회원 이용권·락커 만료만, Owner+) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-080A.자동-회수-정책-on-off-owner | PATCH | `/api/admin/settings/automation/actions/자동-회수-정책-on-off-owner` | 지점 자동화 적용 - 자동 회수 정책 ON/OFF (Owner+) 처리 | `{ ok: true, toast: "자동 회수 정책 ON/OFF (Owner+) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-080A.변경-요약-보기 | PATCH | `/api/admin/settings/automation/actions/변경-요약-보기` | 지점 자동화 적용 - [변경 요약 보기] 처리 | `{ ok: true, toast: "[변경 요약 보기] mock 처리 완료", updatedRows?, nextState? }` |
| SCR-080A.24시간-내-롤백-owner | PATCH | `/api/admin/settings/automation/actions/24시간-내-롤백-owner` | 지점 자동화 적용 - [24시간 내 롤백] (Owner+) 처리 | `{ ok: true, toast: "[24시간 내 롤백] (Owner+) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-081 권한 설정
- Route: `/settings/permissions`
- Handoff: template-ready
- Query Params: `역할-선택-superadmin-primary-owner-manager-fc-trainer-staff-readonly-커스텀`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-081.list | GET | `/api/admin/settings/permissions` | 권한 설정 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-081", rows, metrics, permissions, policyFlags }` |
| SCR-081.초기화-081-001 | PATCH | `/api/admin/settings/permissions/actions/초기화-081-001` | 권한 설정 - 초기화 (DLG-081-001) 처리 | `{ ok: true, toast: "초기화 (DLG-081-001) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-081.변경-사항-저장-영향-분석-후-081-006 | PATCH | `/api/admin/settings/permissions/actions/변경-사항-저장-영향-분석-후-081-006` | 권한 설정 - 변경 사항 저장 (영향 분석 후 DLG-081-006) 처리 | `{ ok: true, toast: "변경 사항 저장 (영향 분석 후 DLG-081-006) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-081.충돌-경고-081-002 | PATCH | `/api/admin/settings/permissions/actions/충돌-경고-081-002` | 권한 설정 - 충돌 경고 (DLG-081-002) 처리 | `{ ok: true, toast: "충돌 경고 (DLG-081-002) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-081.역할-생성-081-003 | PATCH | `/api/admin/settings/permissions/actions/역할-생성-081-003` | 권한 설정 - + 역할 생성 (DLG-081-003) 처리 | `{ ok: true, toast: "+ 역할 생성 (DLG-081-003) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-081.역할-복사-081-005 | PATCH | `/api/admin/settings/permissions/actions/역할-복사-081-005` | 권한 설정 - 역할 복사 (DLG-081-005) 처리 | `{ ok: true, toast: "역할 복사 (DLG-081-005) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-081.역할-삭제-081-004 | POST | `/api/admin/settings/permissions/actions/역할-삭제-081-004` | 권한 설정 - 역할 삭제 (DLG-081-004) 처리 | `{ ok: true, toast: "역할 삭제 (DLG-081-004) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-081.전체-허용-전체-거부 | PATCH | `/api/admin/settings/permissions/actions/전체-허용-전체-거부` | 권한 설정 - 전체 허용 / 전체 거부 처리 | `{ ok: true, toast: "전체 허용 / 전체 거부 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-082 키오스크 설정
- Route: `/settings/082`
- Handoff: template-ready
- Query Params: `탭-전환`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-082.list | GET | `/api/admin/settings/082` | 키오스크 설정 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-082", rows, metrics, permissions, policyFlags }` |
| SCR-082.저장-연결-키오스크에-즉시-push | PATCH | `/api/admin/settings/082/actions/저장-연결-키오스크에-즉시-push` | 키오스크 설정 - 저장 (연결 키오스크에 즉시 push) 처리 | `{ ok: true, toast: "저장 (연결 키오스크에 즉시 push) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-082.미저장-경고-080-001 | PATCH | `/api/admin/settings/082/actions/미저장-경고-080-001` | 키오스크 설정 - 미저장 경고 (DLG-080-001) 처리 | `{ ok: true, toast: "미저장 경고 (DLG-080-001) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-082A 키오스크 IoT 설정
- Route: `/settings/iot`
- Handoff: template-ready
- Query Params: `기기-종류-출입-게이트-키오스크-락커-컨트롤러-inbody`, `사용-여부-on-off`, `상태-ok-불안정-오류-점검-중`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-082A.list | GET | `/api/admin/settings/iot` | 키오스크 IoT 설정 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-082A", rows, metrics, permissions, policyFlags }` |
| SCR-082A.기기-설정-저장-연결-기기-다음-동기화-시점-적용 | PATCH | `/api/admin/settings/iot/actions/기기-설정-저장-연결-기기-다음-동기화-시점-적용` | 키오스크 IoT 설정 - 기기 설정 저장 (연결 기기 다음 동기화 시점 적용) 처리 | `{ ok: true, toast: "기기 설정 저장 (연결 기기 다음 동기화 시점 적용) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-082A.출입-규칙-설정-허용-시간-중복-방지-만료-회원-직원-출석 | PATCH | `/api/admin/settings/iot/actions/출입-규칙-설정-허용-시간-중복-방지-만료-회원-직원-출석` | 키오스크 IoT 설정 - 출입 규칙 설정 (허용 시간·중복 방지·만료 회원·직원 출석) 처리 | `{ ok: true, toast: "출입 규칙 설정 (허용 시간·중복 방지·만료 회원·직원 출석) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-083 IoT 출입 관리
- Route: `/settings/iot`
- Handoff: template-ready
- Query Params: `연결-상태-ok-불안정-오류`, `기기-종류-4종`, `출입-수단-4종`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-083.list | GET | `/api/admin/settings/iot` | IoT 출입 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-083", rows, metrics, permissions, policyFlags }` |
| SCR-083.새-기기-등록-4종-중-선택-기기-코드-위치 | PATCH | `/api/admin/settings/iot/actions/새-기기-등록-4종-중-선택-기기-코드-위치` | IoT 출입 관리 - 새 기기 등록 (4종 중 선택 + 기기 코드 + 위치) 처리 | `{ ok: true, toast: "새 기기 등록 (4종 중 선택 + 기기 코드 + 위치) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-083.재연결-시도 | PATCH | `/api/admin/settings/iot/actions/재연결-시도` | IoT 출입 관리 - 재연결 시도 처리 | `{ ok: true, toast: "재연결 시도 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-083.출입-수단-활성-비활성-토글 | PATCH | `/api/admin/settings/iot/actions/출입-수단-활성-비활성-토글` | IoT 출입 관리 - 출입 수단 활성/비활성 토글 처리 | `{ ok: true, toast: "출입 수단 활성/비활성 토글 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-083.중복-출입-방지-시간-이력-보관-기간-설정 | PATCH | `/api/admin/settings/iot/actions/중복-출입-방지-시간-이력-보관-기간-설정` | IoT 출입 관리 - 중복 출입 방지 시간·이력 보관 기간 설정 처리 | `{ ok: true, toast: "중복 출입 방지 시간·이력 보관 기간 설정 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-083.출입-알림-설정-입장-퇴장-비정상 | PATCH | `/api/admin/settings/iot/actions/출입-알림-설정-입장-퇴장-비정상` | IoT 출입 관리 - 출입 알림 설정 (입장/퇴장/비정상) 처리 | `{ ok: true, toast: "출입 알림 설정 (입장/퇴장/비정상) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-084 구독 결제 관리
- Route: `/subscription`
- Handoff: template-ready
- Query Params: `청구-이력-기간-최근-3개월-6개월-1년`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-084.list | GET | `/api/admin/subscription` | 구독 결제 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-084", rows, metrics, permissions, policyFlags }` |
| SCR-084.플랜-변경-084-001-업그레이드-다운그레이드 | PATCH | `/api/admin/subscription/actions/플랜-변경-084-001-업그레이드-다운그레이드` | 구독 결제 관리 - 플랜 변경 (DLG-084-001, 업그레이드/다운그레이드) 처리 | `{ ok: true, toast: "플랜 변경 (DLG-084-001, 업그레이드/다운그레이드) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-084.구독-해지-084-002 | POST | `/api/admin/subscription/actions/구독-해지-084-002` | 구독 결제 관리 - 구독 해지 (DLG-084-002) 처리 | `{ ok: true, toast: "구독 해지 (DLG-084-002) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-084.결제-수단-변경-pg-연동 | PATCH | `/api/admin/subscription/actions/결제-수단-변경-pg-연동` | 구독 결제 관리 - 결제 수단 변경 (PG 연동) 처리 | `{ ok: true, toast: "결제 수단 변경 (PG 연동) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-084.청구-이력-영수증-pdf-다운로드 | PATCH | `/api/admin/subscription/actions/청구-이력-영수증-pdf-다운로드` | 구독 결제 관리 - 청구 이력·영수증 PDF 다운로드 처리 | `{ ok: true, toast: "청구 이력·영수증 PDF 다운로드 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-085 공지사항 관리
- Route: `/notices`
- Handoff: policy-pending
- Query Params: `상태-탭-전체-게시-중-예정-종료`, `키워드-검색-제목`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-085.list | GET | `/api/admin/notices` | 공지사항 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-085", rows, metrics, permissions, policyFlags }` |
| SCR-085.공지-등록-085-001 | PATCH | `/api/admin/notices/actions/공지-등록-085-001` | 공지사항 관리 - + 공지 등록 (DLG-085-001) 처리 | `{ ok: true, toast: "+ 공지 등록 (DLG-085-001) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-085.공지-수정-085-001 | PATCH | `/api/admin/notices/actions/공지-수정-085-001` | 공지사항 관리 - 공지 수정 (DLG-085-001) 처리 | `{ ok: true, toast: "공지 수정 (DLG-085-001) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-085.공지-삭제-085-002 | POST | `/api/admin/notices/actions/공지-삭제-085-002` | 공지사항 관리 - 공지 삭제 (DLG-085-002) 처리 | `{ ok: true, toast: "공지 삭제 (DLG-085-002) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-085.공지-상세-미리보기-우측-패널 | PATCH | `/api/admin/notices/actions/공지-상세-미리보기-우측-패널` | 공지사항 관리 - 공지 상세 미리보기(우측 패널) 처리 | `{ ok: true, toast: "공지 상세 미리보기(우측 패널) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-086 출석 관리 설정
- Route: `/settings/attendance`
- Handoff: template-ready
- Query Params: `탭-전환`, `기준-미설정-강조`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-086.list | GET | `/api/admin/settings/attendance` | 출석 관리 설정 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-086", rows, metrics, permissions, policyFlags }` |
| SCR-086.저장-출석-정책-신규-출퇴근-기록부터-적용 | PATCH | `/api/admin/settings/attendance/actions/저장-출석-정책-신규-출퇴근-기록부터-적용` | 출석 관리 설정 - 저장 (출석 정책 신규 출퇴근 기록부터 적용) 처리 | `{ ok: true, toast: "저장 (출석 정책 신규 출퇴근 기록부터 적용) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-086.미저장-경고-080-001 | PATCH | `/api/admin/settings/attendance/actions/미저장-경고-080-001` | 출석 관리 설정 - 미저장 경고 (DLG-080-001) 처리 | `{ ok: true, toast: "미저장 경고 (DLG-080-001) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-086.iot-미연결-안내-083-링크 | PATCH | `/api/admin/settings/attendance/actions/iot-미연결-안내-083-링크` | 출석 관리 설정 - IoT 미연결 안내 (SCR-083 링크) 처리 | `{ ok: true, toast: "IoT 미연결 안내 (SCR-083 링크) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-087 커스텀 역할 생성
- Route: `/settings/custom-role`
- Handoff: template-ready
- Query Params: `역할명-검색`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-087.list | GET | `/api/admin/settings/custom-role` | 커스텀 역할 생성 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-087", rows, metrics, permissions, policyFlags }` |
| SCR-087.새-역할-만들기 | PATCH | `/api/admin/settings/custom-role/actions/새-역할-만들기` | 커스텀 역할 생성 - + 새 역할 만들기 처리 | `{ ok: true, toast: "+ 새 역할 만들기 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-087.기존-역할에서-권한-복사 | POST | `/api/admin/settings/custom-role/actions/기존-역할에서-권한-복사` | 커스텀 역할 생성 - 기존 역할에서 권한 복사 처리 | `{ ok: true, toast: "기존 역할에서 권한 복사 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-087.권한-매트릭스-구성-081과-동일-구조 | POST | `/api/admin/settings/custom-role/actions/권한-매트릭스-구성-081과-동일-구조` | 커스텀 역할 생성 - 권한 매트릭스 구성 (SCR-081과 동일 구조) 처리 | `{ ok: true, toast: "권한 매트릭스 구성 (SCR-081과 동일 구조) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-087.역할-삭제-배정-직원-1명-087-001-재배정 | POST | `/api/admin/settings/custom-role/actions/역할-삭제-배정-직원-1명-087-001-재배정` | 커스텀 역할 생성 - 역할 삭제 (배정 직원 ≥1명 → DLG-087-001 재배정) 처리 | `{ ok: true, toast: "역할 삭제 (배정 직원 ≥1명 → DLG-087-001 재배정) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-088 다국어 설정
- Route: `/settings/language`
- Handoff: policy-pending
- Query Params: `탭-전환`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-088.list | GET | `/api/admin/settings/language` | 다국어 설정 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-088", rows, metrics, permissions, policyFlags }` |
| SCR-088.저장-관리자-화면-언어-변경-시-페이지-리로드 | PATCH | `/api/admin/settings/language/actions/저장-관리자-화면-언어-변경-시-페이지-리로드` | 다국어 설정 - 저장 (관리자 화면 언어 변경 시 페이지 리로드) 처리 | `{ ok: true, toast: "저장 (관리자 화면 언어 변경 시 페이지 리로드) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-088.키오스크-언어-동기화-websocket-폴링 | PATCH | `/api/admin/settings/language/actions/키오스크-언어-동기화-websocket-폴링` | 다국어 설정 - 키오스크 언어 동기화 (WebSocket/폴링) 처리 | `{ ok: true, toast: "키오스크 언어 동기화 (WebSocket/폴링) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-088.미저장-경고-080-001 | PATCH | `/api/admin/settings/language/actions/미저장-경고-080-001` | 다국어 설정 - 미저장 경고 (DLG-080-001) 처리 | `{ ok: true, toast: "미저장 경고 (DLG-080-001) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-088.키오스크-미리보기-렌더링 | PATCH | `/api/admin/settings/language/actions/키오스크-미리보기-렌더링` | 다국어 설정 - 키오스크 미리보기 렌더링 처리 | `{ ok: true, toast: "키오스크 미리보기 렌더링 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-089 데이터 백업·복원
- Route: `/settings/089`
- Handoff: template-ready
- Query Params: `기간-프리셋-오늘-이번-주-이번-달-사용자-지정`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-089.list | GET | `/api/admin/settings/089` | 데이터 백업·복원 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-089", rows, metrics, permissions, policyFlags }` |
| SCR-089.지금-백업-실행-수동 | PATCH | `/api/admin/settings/089/actions/지금-백업-실행-수동` | 데이터 백업·복원 - 지금 백업 실행 (수동) 처리 | `{ ok: true, toast: "지금 백업 실행 (수동) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-089.백업-설정-089-002-주기-시각-보관-기간 | PATCH | `/api/admin/settings/089/actions/백업-설정-089-002-주기-시각-보관-기간` | 데이터 백업·복원 - 백업 설정 (DLG-089-002, 주기·시각·보관 기간) 처리 | `{ ok: true, toast: "백업 설정 (DLG-089-002, 주기·시각·보관 기간) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-089.데이터-복원-089-001-사유-필수 | POST | `/api/admin/settings/089/actions/데이터-복원-089-001-사유-필수` | 데이터 백업·복원 - 데이터 복원 (DLG-089-001, 사유 필수) 처리 | `{ ok: true, toast: "데이터 복원 (DLG-089-001, 사유 필수) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-089.복원은-superadmin-owner는-승인-요청-발송 | POST | `/api/admin/settings/089/actions/복원은-superadmin-owner는-승인-요청-발송` | 데이터 백업·복원 - 복원은 superAdmin / Owner는 승인 요청 발송 처리 | `{ ok: true, toast: "복원은 superAdmin / Owner는 승인 요청 발송 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-090 지점 대시보드
- Route: `/hq/branch-dashboard`
- Handoff: template-ready
- Query Params: `지점-본사-모드`, `기간`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-090.list | GET | `/api/admin/hq/branch-dashboard` | 지점 대시보드 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-090", rows, metrics, permissions, policyFlags }` |
| SCR-090.수동-새로고침 | PATCH | `/api/admin/hq/branch-dashboard/actions/수동-새로고침` | 지점 대시보드 - 수동 새로고침 처리 | `{ ok: true, toast: "수동 새로고침 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-090.전체보기-감사-로그 | PATCH | `/api/admin/hq/branch-dashboard/actions/전체보기-감사-로그` | 지점 대시보드 - 전체보기 (감사 로그) 처리 | `{ ok: true, toast: "전체보기 (감사 로그) mock 처리 완료", updatedRows?, nextState? }` |

### SCR-091 구버전 슈퍼 대시보드 리다이렉트
- Route: `/super-dashboard`
- Handoff: policy-pending
- Query Params: none
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-091.list | GET | `/api/admin/super-dashboard` | 구버전 슈퍼 대시보드 리다이렉트 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-091", rows, metrics, permissions, policyFlags }` |
| SCR-091.신규-대시보드로-이동 | PATCH | `/api/admin/super-dashboard/actions/신규-대시보드로-이동` | 구버전 슈퍼 대시보드 리다이렉트 - 신규 대시보드로 이동 처리 | `{ ok: true, toast: "신규 대시보드로 이동 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-096 온보딩 대시보드
- Route: `/onboarding`
- Handoff: policy-pending
- Query Params: `지점`, `기간`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-096.list | GET | `/api/admin/onboarding` | 온보딩 대시보드 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-096", rows, metrics, permissions, policyFlags }` |
| SCR-096.이탈위험-회원-보기 | PATCH | `/api/admin/onboarding/actions/이탈위험-회원-보기` | 온보딩 대시보드 - 이탈위험 회원 보기 처리 | `{ ok: true, toast: "이탈위험 회원 보기 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-H1002 커스텀 대시보드 빌더
- Route: `/dashboard/builder`
- Handoff: policy-pending
- Query Params: `위젯-카테고리-매출-회원-출석-수업-공지-할-일`, `위젯-검색`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-H1002.list | GET | `/api/admin/dashboard/builder` | 커스텀 대시보드 빌더 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-H1002", rows, metrics, permissions, policyFlags }` |
| SCR-H1002.위젯-추가 | PATCH | `/api/admin/dashboard/builder/actions/위젯-추가` | 커스텀 대시보드 빌더 - 위젯 추가 처리 | `{ ok: true, toast: "위젯 추가 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-H1002.레이아웃-저장 | PATCH | `/api/admin/dashboard/builder/actions/레이아웃-저장` | 커스텀 대시보드 빌더 - 레이아웃 저장 처리 | `{ ok: true, toast: "레이아웃 저장 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-H1002.기본값으로-초기화 | PATCH | `/api/admin/dashboard/builder/actions/기본값으로-초기화` | 커스텀 대시보드 빌더 - 기본값으로 초기화 처리 | `{ ok: true, toast: "기본값으로 초기화 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-H1002.png-pdf-내보내기 | PATCH | `/api/admin/dashboard/builder/actions/png-pdf-내보내기` | 커스텀 대시보드 빌더 - PNG/PDF 내보내기 처리 | `{ ok: true, toast: "PNG/PDF 내보내기 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-H1003 벤치마크 비교
- Route: `/benchmark`
- Handoff: policy-pending
- Query Params: `규모-소-중-대`, `업종-헬스-필라테스-pt샵-골프-요가-크로스핏-복싱-수영-태권도-스피닝-기타`, `지표-매출-유지율-출석률-신규`, `기간-월간-분기-연간`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-H1003.list | GET | `/api/admin/benchmark` | 벤치마크 비교 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-H1003", rows, metrics, permissions, policyFlags }` |
| SCR-H1003.분석-실행 | PATCH | `/api/admin/benchmark/actions/분석-실행` | 벤치마크 비교 - 분석 실행 처리 | `{ ok: true, toast: "분석 실행 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-H1003.pdf-다운로드 | PATCH | `/api/admin/benchmark/actions/pdf-다운로드` | 벤치마크 비교 - PDF 다운로드 처리 | `{ ok: true, toast: "PDF 다운로드 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-H1005 NPS 설문
- Route: `/nps`
- Handoff: policy-pending
- Query Params: `기간`, `지점`, `점수-범위-추천자-9-10-중립-7-8-비추천-0-6`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-H1005.list | GET | `/api/admin/nps` | NPS 설문 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-H1005", rows, metrics, permissions, policyFlags }` |
| SCR-H1005.설문-발송 | PATCH | `/api/admin/nps/actions/설문-발송` | NPS 설문 - 설문 발송 처리 | `{ ok: true, toast: "설문 발송 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-H1005.엑셀-다운로드 | PATCH | `/api/admin/nps/actions/엑셀-다운로드` | NPS 설문 - 엑셀 다운로드 처리 | `{ ok: true, toast: "엑셀 다운로드 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-H1005.pdf-내보내기 | PATCH | `/api/admin/nps/actions/pdf-내보내기` | NPS 설문 - PDF 내보내기 처리 | `{ ok: true, toast: "PDF 내보내기 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-092 지점 관리
- Route: `/branches`
- Handoff: template-ready
- Query Params: `지점명-주소-키워드`, `운영-상태-전체-운영-중-오픈-예정-임시휴업-폐점`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-092.list | GET | `/api/admin/branches` | 지점 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-092", rows, metrics, permissions, policyFlags }` |
| SCR-092.신규-지점-등록 | PATCH | `/api/admin/branches/actions/신규-지점-등록` | 지점 관리 - 신규 지점 등록 처리 | `{ ok: true, toast: "신규 지점 등록 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-092.비활성화-운영-상태-변경 | POST | `/api/admin/branches/actions/비활성화-운영-상태-변경` | 지점 관리 - 비활성화 / 운영 상태 변경 처리 | `{ ok: true, toast: "비활성화 / 운영 상태 변경 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-093 지점 성과 리포트
- Route: `/branch-report`
- Handoff: template-ready
- Query Params: `조회-기간-주간-월간-분기-연간-직접-입력`, `지점-전체-또는-복수-선택`, `비교-기준-전기간-대비-지점-간-비교`, `휴업-폐점-지점-토글`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-093.list | GET | `/api/admin/branch-report` | 지점 성과 리포트 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-093", rows, metrics, permissions, policyFlags }` |
| SCR-093.엑셀-다운로드 | PATCH | `/api/admin/branch-report/actions/엑셀-다운로드` | 지점 성과 리포트 - 엑셀 다운로드 처리 | `{ ok: true, toast: "엑셀 다운로드 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-093.pdf-다운로드 | PATCH | `/api/admin/branch-report/actions/pdf-다운로드` | 지점 성과 리포트 - PDF 다운로드 처리 | `{ ok: true, toast: "PDF 다운로드 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-094 KPI 대시보드
- Route: `/kpi`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `보조-지표-토글`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-094.list | GET | `/api/admin/kpi` | KPI 대시보드 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-094", rows, metrics, permissions, policyFlags }` |
| SCR-094.매출-목표-설정 | PATCH | `/api/admin/kpi/actions/매출-목표-설정` | KPI 대시보드 - 매출 목표 설정 처리 | `{ ok: true, toast: "매출 목표 설정 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-095 KPI 센터
- Route: `/kpi-preview`
- Handoff: template-ready
- Query Params: `보드-탭`, `기간`, `지점`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-095.list | GET | `/api/admin/kpi-preview` | KPI 센터 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-095", rows, metrics, permissions, policyFlags }` |
| SCR-095.today-tasks-이동 | PATCH | `/api/admin/kpi-preview/actions/today-tasks-이동` | KPI 센터 - Today Tasks 이동 처리 | `{ ok: true, toast: "Today Tasks 이동 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-095.매출-회원-알림-바로가기 | PATCH | `/api/admin/kpi-preview/actions/매출-회원-알림-바로가기` | KPI 센터 - 매출 / 회원 / 알림 바로가기 처리 | `{ ok: true, toast: "매출 / 회원 / 알림 바로가기 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-097 히스토리 로그
- Route: `/audit-log`
- Handoff: template-ready
- Query Params: `작업자-이름-계정-검색`, `지점`, `작업-유형-로그인-회원-결제-설정-권한-데이터-삭제`, `기간`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-097.list | GET | `/api/admin/audit-log` | 히스토리 로그 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-097", rows, metrics, permissions, policyFlags }` |
| SCR-097.엑셀-다운로드 | PATCH | `/api/admin/audit-log/actions/엑셀-다운로드` | 히스토리 로그 - 엑셀 다운로드 처리 | `{ ok: true, toast: "엑셀 다운로드 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-098 오늘의 할 일
- Route: `/today-tasks`
- Handoff: template-ready
- Query Params: `탭-전체-미완료-완료`, `담당자`, `우선순위`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-098.list | GET | `/api/admin/today-tasks` | 오늘의 할 일 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-098", rows, metrics, permissions, policyFlags }` |
| SCR-098.할-일-추가 | PATCH | `/api/admin/today-tasks/actions/할-일-추가` | 오늘의 할 일 - 할 일 추가 처리 | `{ ok: true, toast: "할 일 추가 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-098.상세-수정 | PATCH | `/api/admin/today-tasks/actions/상세-수정` | 오늘의 할 일 - 상세 수정 처리 | `{ ok: true, toast: "상세 수정 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-099 리포트 생성
- Route: `/reports`
- Handoff: template-ready
- Query Params: `리포트-유형`, `조회-기간-이번-주-이번-달-분기-연간-직접`, `대상-지점`, `포함-항목-체크박스`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-099.list | GET | `/api/admin/reports` | 리포트 생성 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-099", rows, metrics, permissions, policyFlags }` |
| SCR-099.리포트-생성 | PATCH | `/api/admin/reports/actions/리포트-생성` | 리포트 생성 - 리포트 생성 처리 | `{ ok: true, toast: "리포트 생성 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-099.엑셀-다운로드 | PATCH | `/api/admin/reports/actions/엑셀-다운로드` | 리포트 생성 - 엑셀 다운로드 처리 | `{ ok: true, toast: "엑셀 다운로드 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-099.pdf-다운로드 | PATCH | `/api/admin/reports/actions/pdf-다운로드` | 리포트 생성 - PDF 다운로드 처리 | `{ ok: true, toast: "PDF 다운로드 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-H1001 자동화 정책 라이브러리
- Route: `/hq/automation-policies`
- Handoff: template-ready
- Query Params: `정책-유형-전체-회원-이용권-결제기한-락커-수업-운영-운영-자동화`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-H1001.list | GET | `/api/admin/hq/automation-policies` | 자동화 정책 라이브러리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-H1001", rows, metrics, permissions, policyFlags }` |
| SCR-H1001.정책-세트-생성 | PATCH | `/api/admin/hq/automation-policies/actions/정책-세트-생성` | 자동화 정책 라이브러리 - 정책 세트 생성 처리 | `{ ok: true, toast: "정책 세트 생성 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-H1001.배포 | PATCH | `/api/admin/hq/automation-policies/actions/배포` | 자동화 정책 라이브러리 - 배포 처리 | `{ ok: true, toast: "배포 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-H1001.시뮬레이션 | PATCH | `/api/admin/hq/automation-policies/actions/시뮬레이션` | 자동화 정책 라이브러리 - 시뮬레이션 처리 | `{ ok: true, toast: "시뮬레이션 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-H1001.pdf-내보내기 | PATCH | `/api/admin/hq/automation-policies/actions/pdf-내보내기` | 자동화 정책 라이브러리 - PDF 내보내기 처리 | `{ ok: true, toast: "PDF 내보내기 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-H1001.중지 | POST | `/api/admin/hq/automation-policies/actions/중지` | 자동화 정책 라이브러리 - 중지 처리 | `{ ok: true, toast: "중지 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-H1004 예측 분석
- Route: `/analytics/forecast`
- Handoff: policy-pending
- Query Params: `예측-지표`, `예측-기간`, `대상-지점`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-H1004.list | GET | `/api/admin/analytics/forecast` | 예측 분석 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-H1004", rows, metrics, permissions, policyFlags }` |
| SCR-H1004.예측-실행 | PATCH | `/api/admin/analytics/forecast/actions/예측-실행` | 예측 분석 - 예측 실행 처리 | `{ ok: true, toast: "예측 실행 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-H1004.재학습-요청 | PATCH | `/api/admin/analytics/forecast/actions/재학습-요청` | 예측 분석 - 재학습 요청 처리 | `{ ok: true, toast: "재학습 요청 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-H1004.pdf-내보내기 | PATCH | `/api/admin/analytics/forecast/actions/pdf-내보내기` | 예측 분석 - PDF 내보내기 처리 | `{ ok: true, toast: "PDF 내보내기 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-I001 통합 출석 관리
- Route: `/attendance`
- Handoff: template-ready
- Query Params: `기간-오늘-이번-주-이번-달-직접`, `구분-전체-회원-직원-게스트`, `결과-전체-성공-실패-중복-퇴실`, `채널-앱-qr-키오스크-qr-얼굴인식-수동`, `락커-상태-전체-미배정-수동배정-자동배정-대상-아님`, `검색-이름-연락처-회원번호-사번`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-I001.list | GET | `/api/admin/attendance` | 통합 출석 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-I001", rows, metrics, permissions, policyFlags }` |
| SCR-I001.수동-출석-등록 | PATCH | `/api/admin/attendance/actions/수동-출석-등록` | 통합 출석 관리 - 수동 출석 등록 처리 | `{ ok: true, toast: "수동 출석 등록 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-I001.락커-배정 | PATCH | `/api/admin/attendance/actions/락커-배정` | 통합 출석 관리 - 락커 배정 처리 | `{ ok: true, toast: "락커 배정 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-I001.실패-로그 | PATCH | `/api/admin/attendance/actions/실패-로그` | 통합 출석 관리 - 실패 로그 처리 | `{ ok: true, toast: "실패 로그 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-I001.최근-이벤트 | PATCH | `/api/admin/attendance/actions/최근-이벤트` | 통합 출석 관리 - 최근 이벤트 처리 | `{ ok: true, toast: "최근 이벤트 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-I004 옷 락커 운영 관리
- Route: `/clothing-locker`
- Handoff: template-ready
- Query Params: `상태-빈-사용-중-만료-임박-반납-지연-점검-중`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-I004.list | GET | `/api/admin/clothing-locker` | 옷 락커 운영 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-I004", rows, metrics, permissions, policyFlags }` |
| SCR-I004.회원-배정 | PATCH | `/api/admin/clothing-locker/actions/회원-배정` | 옷 락커 운영 관리 - 회원 배정 처리 | `{ ok: true, toast: "회원 배정 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-I004.회수 | PATCH | `/api/admin/clothing-locker/actions/회수` | 옷 락커 운영 관리 - 회수 처리 | `{ ok: true, toast: "회수 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-I004.고장-처리 | PATCH | `/api/admin/clothing-locker/actions/고장-처리` | 옷 락커 운영 관리 - 고장 처리 처리 | `{ ok: true, toast: "고장 처리 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-I004.복구 | PATCH | `/api/admin/clothing-locker/actions/복구` | 옷 락커 운영 관리 - 복구 처리 | `{ ok: true, toast: "복구 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-I004.일괄-해제 | PATCH | `/api/admin/clothing-locker/actions/일괄-해제` | 옷 락커 운영 관리 - 일괄 해제 처리 | `{ ok: true, toast: "일괄 해제 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-I004.엑셀-다운로드 | PATCH | `/api/admin/clothing-locker/actions/엑셀-다운로드` | 옷 락커 운영 관리 - 엑셀 다운로드 처리 | `{ ok: true, toast: "엑셀 다운로드 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-I005 고정 물품 락커 관리
- Route: `/locker/management`
- Handoff: template-ready
- Query Params: `상태-전체-사용-중-만료-예정-만료-회수-대기`, `만료-기간-이번-주-이번-달-직접`, `검색-회원명-락커-번호-상품명`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-I005.list | GET | `/api/admin/locker/management` | 고정 물품 락커 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-I005", rows, metrics, permissions, policyFlags }` |
| SCR-I005.배정하기 | PATCH | `/api/admin/locker/management/actions/배정하기` | 고정 물품 락커 관리 - 배정하기 처리 | `{ ok: true, toast: "배정하기 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-I005.연장 | PATCH | `/api/admin/locker/management/actions/연장` | 고정 물품 락커 관리 - 연장 처리 | `{ ok: true, toast: "연장 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-I005.회수 | PATCH | `/api/admin/locker/management/actions/회수` | 고정 물품 락커 관리 - 회수 처리 | `{ ok: true, toast: "회수 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-I005.상태-동기화 | PATCH | `/api/admin/locker/management/actions/상태-동기화` | 고정 물품 락커 관리 - 상태 동기화 처리 | `{ ok: true, toast: "상태 동기화 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-I005.엑셀-다운로드 | PATCH | `/api/admin/locker/management/actions/엑셀-다운로드` | 고정 물품 락커 관리 - 엑셀 다운로드 처리 | `{ ok: true, toast: "엑셀 다운로드 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-I006 체성분 통합 관리
- Route: `/body-composition-2`
- Handoff: template-ready
- Query Params: `탭-측정-결과-수신-로그-오류-검수`, `기간`, `회원-검색`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-I006.list | GET | `/api/admin/body-composition-2` | 체성분 통합 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-I006", rows, metrics, permissions, policyFlags }` |
| SCR-I006.수기-등록 | PATCH | `/api/admin/body-composition-2/actions/수기-등록` | 체성분 통합 관리 - 수기 등록 처리 | `{ ok: true, toast: "수기 등록 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-I006.수신-로그 | PATCH | `/api/admin/body-composition-2/actions/수신-로그` | 체성분 통합 관리 - 수신 로그 처리 | `{ ok: true, toast: "수신 로그 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-I006.확정-처리 | PATCH | `/api/admin/body-composition-2/actions/확정-처리` | 체성분 통합 관리 - 확정 처리 처리 | `{ ok: true, toast: "확정 처리 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-I006.회원-직접-매칭 | PATCH | `/api/admin/body-composition-2/actions/회원-직접-매칭` | 체성분 통합 관리 - 회원 직접 매칭 처리 | `{ ok: true, toast: "회원 직접 매칭 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-I006.무시 | PATCH | `/api/admin/body-composition-2/actions/무시` | 체성분 통합 관리 - 무시 처리 | `{ ok: true, toast: "무시 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-I007 회원 건강 연동 요약
- Route: `/members/health`
- Handoff: template-ready
- Query Params: `회원-선택`, `기간`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-I007.list | GET | `/api/admin/members/health` | 회원 건강 연동 요약 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-I007", rows, metrics, permissions, policyFlags }` |
| SCR-I007.수기-등록 | PATCH | `/api/admin/members/health/actions/수기-등록` | 회원 건강 연동 요약 - 수기 등록 처리 | `{ ok: true, toast: "수기 등록 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-I007.상담-메모-바로가기 | PATCH | `/api/admin/members/health/actions/상담-메모-바로가기` | 회원 건강 연동 요약 - 상담 메모 바로가기 처리 | `{ ok: true, toast: "상담 메모 바로가기 mock 처리 완료", updatedRows?, nextState? }` |


## Dialog Submit Contracts
### DLG-000 세션 만료
- Handoff: production-ready
- Endpoint: `/api/admin/common/dialogs/000`
- Request: `{ dialogId: "DLG-000", values: { 만료-안내, 현재-페이지, 재로그인-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M001 회원 상태 변경 확인
- Handoff: production-ready
- Endpoint: `/api/admin/members/dialogs/m001`
- Request: `{ dialogId: "DLG-M001", values: { 현재-상태, 변경-상태, 사유, 처리-확인 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M002 회원 삭제 확인
- Handoff: production-ready
- Endpoint: `/api/admin/members/dialogs/m002`
- Request: `{ dialogId: "DLG-M002", values: { 삭제-대상, 복구-불가-안내, 권한-확인 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M003 홀딩 등록
- Handoff: production-ready
- Endpoint: `/api/admin/members/dialogs/m003`
- Request: `{ dialogId: "DLG-M003", values: { 홀딩-시작일, 종료일, 사유 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M004 홀딩 해제
- Handoff: production-ready
- Endpoint: `/api/admin/members/dialogs/m004`
- Request: `{ dialogId: "DLG-M004", values: { 해제일, 잔여-기간, 확인 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M005 탈퇴 처리
- Handoff: production-ready
- Endpoint: `/api/admin/members/dialogs/m005`
- Request: `{ dialogId: "DLG-M005", values: { 탈퇴-사유, 잔여-상품, 미수금 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M006 전화번호 중복 안내
- Handoff: production-ready
- Endpoint: `/api/admin/members/dialogs/m006`
- Request: `{ dialogId: "DLG-M006", values: { 중복-회원-목록, 기존-회원-이동, 계속-등록 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M007 작업 취소 확인
- Handoff: production-ready
- Endpoint: `/api/admin/members/dialogs/m007`
- Request: `{ dialogId: "DLG-M007", values: { 변경사항-요약, 취소, 계속-작성 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M008 입력 폼 초기화 확인
- Handoff: production-ready
- Endpoint: `/api/admin/members/dialogs/m008`
- Request: `{ dialogId: "DLG-M008", values: { 초기화-대상, 초기화, 닫기 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M009 메모 추가
- Handoff: production-ready
- Endpoint: `/api/admin/members/dialogs/m009`
- Request: `{ dialogId: "DLG-M009", values: { 메모-내용, 공유-범위, 저장 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M010 메모 삭제 확인
- Handoff: production-ready
- Endpoint: `/api/admin/members/dialogs/m010`
- Request: `{ dialogId: "DLG-M010", values: { 삭제-메모, 삭제-사유, 확인 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M011 상담 등록/수정
- Handoff: production-ready
- Endpoint: `/api/admin/members/dialogs/m011`
- Request: `{ dialogId: "DLG-M011", values: { 상담일, 담당자, 상담-내용 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M012 상담 기록 삭제 확인
- Handoff: production-ready
- Endpoint: `/api/admin/members/dialogs/m012`
- Request: `{ dialogId: "DLG-M012", values: { 상담-기록, 삭제-사유, 확인 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M013 환불 처리
- Handoff: policy-pending
- Endpoint: `/api/admin/members/dialogs/m013`
- Request: `{ dialogId: "DLG-M013", values: { 원-결제, 환불-금액, 승인-상태 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M014 결제 상세 조회
- Handoff: production-ready
- Endpoint: `/api/admin/members/dialogs/m014`
- Request: `{ dialogId: "DLG-M014", values: { 결제-정보, 상품-정보, 처리-직원 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M015 체성분 등록
- Handoff: production-ready
- Endpoint: `/api/admin/members/dialogs/m015`
- Request: `{ dialogId: "DLG-M015", values: { 측정일, 체중, 골격근량, 체지방률 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M016 체성분 덮어쓰기
- Handoff: production-ready
- Endpoint: `/api/admin/members/dialogs/m016`
- Request: `{ dialogId: "DLG-M016", values: { 기존-기록, 신규-기록, 덮어쓰기 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M017 목표 설정
- Handoff: production-ready
- Endpoint: `/api/admin/members/dialogs/m017`
- Request: `{ dialogId: "DLG-M017", values: { 목표-체중, 목표-체지방률, 목표일 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M018 연장 등록
- Handoff: production-ready
- Endpoint: `/api/admin/members/dialogs/m018`
- Request: `{ dialogId: "DLG-M018", values: { 연장-대상, 연장-기간, 사유 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M019 양도 처리
- Handoff: production-ready
- Endpoint: `/api/admin/members/dialogs/m019`
- Request: `{ dialogId: "DLG-M019", values: { 양도자, 양수자, 잔여-권리 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M020 쿠폰 적용
- Handoff: production-ready
- Endpoint: `/api/admin/members/dialogs/m020`
- Request: `{ dialogId: "DLG-M020", values: { 쿠폰-목록, 적용-대상, 할인액 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M022 수동 출석
- Handoff: production-ready
- Endpoint: `/api/admin/members/dialogs/m022`
- Request: `{ dialogId: "DLG-M022", values: { 회원, 출석-일시, 사유 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M023 이관 확인
- Handoff: production-ready
- Endpoint: `/api/admin/members/dialogs/m023`
- Request: `{ dialogId: "DLG-M023", values: { 현재-지점, 대상-지점, 재배정-표 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M024 종합 평가 등록
- Handoff: production-ready
- Endpoint: `/api/admin/members/dialogs/m024`
- Request: `{ dialogId: "DLG-M024", values: { 평가-점수, 코멘트, 후속-액션 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M026 운동 이력 등록
- Handoff: production-ready
- Endpoint: `/api/admin/members/dialogs/m026`
- Request: `{ dialogId: "DLG-M026", values: { 운동-프로그램, 수행-결과, 트레이너-메모 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M027 주소 검색
- Handoff: production-ready
- Endpoint: `/api/admin/members/dialogs/m027`
- Request: `{ dialogId: "DLG-M027", values: { 주소-검색어, 검색-결과, 선택 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M028 회원 병합 확인
- Handoff: production-ready
- Endpoint: `/api/admin/members/dialogs/m028`
- Request: `{ dialogId: "DLG-M028", values: { 주-계정, 부-계정, 이관-이력 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M029 가족 연결
- Handoff: production-ready
- Endpoint: `/api/admin/members/dialogs/m029`
- Request: `{ dialogId: "DLG-M029", values: { 가족-그룹, 회원-검색, 관계 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-M030 등급 변경
- Handoff: production-ready
- Endpoint: `/api/admin/members/dialogs/m030`
- Request: `{ dialogId: "DLG-M030", values: { 현재-등급, 변경-등급, 사유 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-S001 매출 상세
- Handoff: production-ready
- Endpoint: `/api/admin/sales/dialogs/s001`
- Request: `{ dialogId: "DLG-S001", values: { 매출-번호, 결제-금액, 상품-정보, 처리-직원 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-S002 구매자 검색
- Handoff: production-ready
- Endpoint: `/api/admin/sales/dialogs/s002`
- Request: `{ dialogId: "DLG-S002", values: { 검색-입력, 검색-결과, 비회원-처리 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-S003 결제 확인
- Handoff: production-ready
- Endpoint: `/api/admin/sales/dialogs/s003`
- Request: `{ dialogId: "DLG-S003", values: { 구매자, 상품-목록, 최종-결제-금액, 수납액 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-S004 중복 결제 경고
- Handoff: production-ready
- Endpoint: `/api/admin/sales/dialogs/s004`
- Request: `{ dialogId: "DLG-S004", values: { 기존-결제, 계속-진행, 취소 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-S005 메모 편집
- Handoff: production-ready
- Endpoint: `/api/admin/sales/dialogs/s005`
- Request: `{ dialogId: "DLG-S005", values: { 대상-매출, 메모, 글자-수 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-S006 환불 상세
- Handoff: production-ready
- Endpoint: `/api/admin/sales/dialogs/s006`
- Request: `{ dialogId: "DLG-S006", values: { 환불-번호, 환불-금액, 승인자, 처리-일시 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-S007 할부 상세
- Handoff: production-ready
- Endpoint: `/api/admin/sales/dialogs/s007`
- Request: `{ dialogId: "DLG-S007", values: { 할부-번호, 총-금액, 월-납입액, 회차-표 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-S008 납입 처리
- Handoff: production-ready
- Endpoint: `/api/admin/sales/dialogs/s008`
- Request: `{ dialogId: "DLG-S008", values: { 납입-대상, 실수령-금액, 결제-수단 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-S009 할부 등록
- Handoff: production-ready
- Endpoint: `/api/admin/sales/dialogs/s009`
- Request: `{ dialogId: "DLG-S009", values: { 회원, 상품, 선납금, 총-회차 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-S010 세금계산서 상세
- Handoff: production-ready
- Endpoint: `/api/admin/sales/dialogs/s010`
- Request: `{ dialogId: "DLG-S010", values: { 발행-상태, 공급자, 공급받는자, 공급-내역 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-S011 세금계산서 발행
- Handoff: policy-pending
- Endpoint: `/api/admin/sales/dialogs/s011`
- Request: `{ dialogId: "DLG-S011", values: { 사업자번호, 상호, 이메일, 품목 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-S012 목표 매출 설정
- Handoff: production-ready
- Endpoint: `/api/admin/sales/dialogs/s012`
- Request: `{ dialogId: "DLG-S012", values: { 기간, 목표-금액, 기준-유형 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-S013 환불 처리
- Handoff: policy-pending
- Endpoint: `/api/admin/sales/dialogs/s013`
- Request: `{ dialogId: "DLG-S013", values: { 원-매출, 수기-입력, 승인-메모 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-S014 환불 상세 결과
- Handoff: production-ready
- Endpoint: `/api/admin/sales/dialogs/s014`
- Request: `{ dialogId: "DLG-S014", values: { 환불-번호, 환불-금액, 처리-담당자, 쿠폰-복원 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-S015 환불 요청
- Handoff: policy-pending
- Endpoint: `/api/admin/sales/dialogs/s015`
- Request: `{ dialogId: "DLG-S015", values: { 환불-대상, 요청자, 요청-사유 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-C001 수업 등록/수정 (캘린더)
- Handoff: template-ready
- Endpoint: `/api/admin/classes/dialogs/c001`
- Request: `{ dialogId: "DLG-C001", values: { 수업-선택, 일정-분류-상담-ot-체성분-방문-수업-pt-기타, 대상-유형, 시작-일시, 종료-일시, 강사-배정 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-C002 일정 상세
- Handoff: template-ready
- Endpoint: `/api/admin/classes/dialogs/c002`
- Request: `{ dialogId: "DLG-C002", values: { 수업명-및-유형-배지, 일시-정보, 강사명, 장소-룸, 예약-현황, 예약-회원-목록 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-C003 수업 등록/수정 (관리)
- Handoff: template-ready
- Endpoint: `/api/admin/classes/dialogs/c003`
- Request: `{ dialogId: "DLG-C003", values: { 수업-템플릿-선택, 수업명, 수업-유형-pt-gx-골프-기타, 강습-세션-유형, 일시, 강사-배정 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-C004 일괄 변경
- Handoff: template-ready
- Endpoint: `/api/admin/classes/dialogs/c004`
- Request: `{ dialogId: "DLG-C004", values: { 안내-메시지, 변경-범위-선택-라디오-버튼, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-C005 수업 기록 상세
- Handoff: template-ready
- Endpoint: `/api/admin/classes/dialogs/c005`
- Request: `{ dialogId: "DLG-C005", values: { 수업-기본-정보, 출석-현황-목록, 서명-기록, 강사-메모, 횟수-차감-내역, 닫기-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-C006 서명
- Handoff: template-ready
- Endpoint: `/api/admin/classes/dialogs/c006`
- Request: `{ dialogId: "DLG-C006", values: { 안내-문구, 수업-정보-요약, 서명-패드, 지우기-버튼, 확인-버튼, 회원앱-push-요청-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-C007 노쇼 정책
- Handoff: template-ready
- Endpoint: `/api/admin/classes/dialogs/c007`
- Request: `{ dialogId: "DLG-C007", values: { 노쇼-정책-섹션, 누적-노쇼-기준-추가-페널티, 저장-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-C008 일괄 생성 확인
- Handoff: template-ready
- Endpoint: `/api/admin/classes/dialogs/c008`
- Request: `{ dialogId: "DLG-C008", values: { 생성-요약-정보, 충돌-일정-경고, 제외-날짜-목록, 확인-버튼, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-C009 템플릿 등록/수정
- Handoff: template-ready
- Endpoint: `/api/admin/classes/dialogs/c009`
- Request: `{ dialogId: "DLG-C009", values: { 수업명, 수업-유형, 기본-정원, 기본-장소, 기본-수업-시간, 색상 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-C010 강사 상세
- Handoff: template-ready
- Endpoint: `/api/admin/classes/dialogs/c010`
- Request: `{ dialogId: "DLG-C010", values: { 강사-기본-정보, 기간-내-수업-요약, 기간-내-ot-요약, 담당-수업-목록, 담당-ot-목록, 닫기-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-C011 세션 상세
- Handoff: template-ready
- Endpoint: `/api/admin/classes/dialogs/c011`
- Request: `{ dialogId: "DLG-C011", values: { 세션-기본-정보, 운동-기록-목록, 강사-노트, 회원-컨디션-기록, 저장-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-C012 횟수 조정
- Handoff: template-ready
- Endpoint: `/api/admin/classes/dialogs/c012`
- Request: `{ dialogId: "DLG-C012", values: { 회원-정보, 조정-유형-선택, 조정-횟수-입력, 조정-후-예상-잔여-횟수, 조정-사유, 확인-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-C013 차감 이력
- Handoff: template-ready
- Endpoint: `/api/admin/classes/dialogs/c013`
- Request: `{ dialogId: "DLG-C013", values: { 회원-정보, 이력-목록-테이블, 기간-필터, 닫기-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-C014 페널티 등록
- Handoff: template-ready
- Endpoint: `/api/admin/classes/dialogs/c014`
- Request: `{ dialogId: "DLG-C014", values: { 대상-회원-선택, 페널티-유형-선택, 관련-수업-선택, 페널티-내용, 적용-시작일, 사유-입력 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-C015 자동 페널티 정책
- Handoff: template-ready
- Endpoint: `/api/admin/classes/dialogs/c015`
- Request: `{ dialogId: "DLG-C015", values: { 자동-페널티-활성화-토글, 노쇼-자동-페널티-규칙, 자동-알림-설정, 저장-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-C016 대안 일정 제시
- Handoff: template-ready
- Endpoint: `/api/admin/classes/dialogs/c016`
- Request: `{ dialogId: "DLG-C016", values: { 원래-수업-정보, 대안-일정-목록, 직접-일정-입력, 안내-메시지-입력, 제안-발송-버튼, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P001-상품등록모달 상품 등록 모달
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p001-상품등록모달`
- Request: `{ dialogId: "DLG-P001-상품등록모달", values: { 상품-구분-회원권-수강권-락커-운동복-일반, 상품그룹, 상품명, 금액-카드가, 이용-조건, 요일-시간설정 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P002-전지점배포 전 지점 배포 확인
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p002-전지점배포`
- Request: `{ dialogId: "DLG-P002-전지점배포", values: { 배포-대상-지점-선택, 배포-상품-요약, 중복-지점-자동-제외-안내, 배포-확인-버튼, 진행률-모달 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P003-작업취소확인 작업 취소 확인
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p003-작업취소확인`
- Request: `{ dialogId: "DLG-P003-작업취소확인", values: { 변경-사항-요약, 취소-확인-버튼, 계속-작성-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P004-가격이력 가격 변경 이력
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p004-가격이력`
- Request: `{ dialogId: "DLG-P004-가격이력", values: { 변경-일시, 변경-전-가격, 변경-후-가격, 변경자, 변경-사유, 닫기-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P005-상품삭제확인 상품 삭제 확인
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p005-상품삭제확인`
- Request: `{ dialogId: "DLG-P005-상품삭제확인", values: { 삭제-대상-상품명, 복구-불가-안내, 삭제-확인-버튼, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P006-비활성화안내 상품 비활성화 안내
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p006-비활성화안내`
- Request: `{ dialogId: "DLG-P006-비활성화안내", values: { 판매-이력-n건-안내, 비활성-전환-버튼, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P007-할인규칙등록 할인 규칙 등록
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p007-할인규칙등록`
- Request: `{ dialogId: "DLG-P007-할인규칙등록", values: { 할인명, 할인-유형-정률-정액, 할인-값, 최소-계약-기간, 최대-할인금액-정률만, 활성-상태, 적용-기간 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P008-상품가져오기 상품 정보 가져오기
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p008-상품가져오기`
- Request: `{ dialogId: "DLG-P008-상품가져오기", values: { 원본-상품-검색, 복사할-필드-선택, 가져오기-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P009-할인규칙수정 할인 규칙 수정
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p009-할인규칙수정`
- Request: `{ dialogId: "DLG-P009-할인규칙수정", values: { 할인명, 할인-유형, 할인-값, 최소-계약-기간, 최대-할인금액, 활성-상태 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P010-상품삭제최종확인 상품 삭제 최종 확인
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p010-상품삭제최종확인`
- Request: `{ dialogId: "DLG-P010-상품삭제최종확인", values: { 대상-상품, 연결-데이터-판매-재고-패키지, 최종-삭제-버튼, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P011-할인규칙삭제확인 할인 규칙 삭제 확인
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p011-할인규칙삭제확인`
- Request: `{ dialogId: "DLG-P011-할인규칙삭제확인", values: { 대상-할인-규칙, 적용-회원-n명-안내, 비활성-권장-강제-삭제, 취소 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P012-상품이미지업로드 상품 대표 이미지 업로드
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p012-상품이미지업로드`
- Request: `{ dialogId: "DLG-P012-상품이미지업로드", values: { 파일-선택, 미리보기, 업로드-버튼, 이미지-형식-크기-안내 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P013-할인정책추가수정 복합 할인 정책 추가/수정
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p013-할인정책추가수정`
- Request: `{ dialogId: "DLG-P013-할인정책추가수정", values: { 정책명, 기본-할인-유형, 기본-할인-값, 추가-조건, 적용-기간, 활성-상태 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P014-가격이력조회 가격 이력 상세 조회
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p014-가격이력조회`
- Request: `{ dialogId: "DLG-P014-가격이력조회", values: { 변경-일시, 변경-전-가격, 변경-후-가격, 변경자, 변경-사유-메모, 닫기 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P015-할인정책삭제확인 할인 정책 삭제 확인
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p015-할인정책삭제확인`
- Request: `{ dialogId: "DLG-P015-할인정책삭제확인", values: { 대상-할인-정책, 삭제-확인, 취소 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P016 카탈로그 미리보기
- Handoff: policy-pending
- Endpoint: `/api/admin/products/dialogs/p016`
- Request: `{ dialogId: "DLG-P016", values: { 카드-미리보기, 강조-마크, 공개-토글 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P017 카탈로그 설정
- Handoff: policy-pending
- Endpoint: `/api/admin/products/dialogs/p017`
- Request: `{ dialogId: "DLG-P017", values: { 노출-채널, 레이아웃, 강조-정책 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P018 카탈로그 편집
- Handoff: policy-pending
- Endpoint: `/api/admin/products/dialogs/p018`
- Request: `{ dialogId: "DLG-P018", values: { 상품-순서-드래그, 그룹핑, 배너, 헤더-문구-100자, 추천-코멘트-50자 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P019 입고 등록
- Handoff: policy-pending
- Endpoint: `/api/admin/products/dialogs/p019`
- Request: `{ dialogId: "DLG-P019", values: { 품목-선택, 입고-수량, 단가, 공급처-거래처-자동완성 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P020 출고 등록
- Handoff: policy-pending
- Endpoint: `/api/admin/products/dialogs/p020`
- Request: `{ dialogId: "DLG-P020", values: { 품목, 출고-수량, 사유-폐기-분실-판매, 비고 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P021 재고 조정
- Handoff: policy-pending
- Endpoint: `/api/admin/products/dialogs/p021`
- Request: `{ dialogId: "DLG-P021", values: { 품목, 조정-수량, 사유-필수 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P022 입출고 이력
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p022`
- Request: `{ dialogId: "DLG-P022", values: { 이력-테이블, 기간-필터, 유형-필터-입고-출고-조정 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P023 시즌 특가 등록/수정
- Handoff: policy-pending
- Endpoint: `/api/admin/products/dialogs/p023`
- Request: `{ dialogId: "DLG-P023", values: { 대상-상품, 특가-금액-할인율, 적용-기간, 시즌명 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-050-001 락커 기록 조회
- Handoff: template-ready
- Endpoint: `/api/admin/facilities/dialogs/050-001`
- Request: `{ dialogId: "DLG-050-001", values: { 이력-테이블-배정일-회수일-회원-사유, 비밀번호-편집, 메모-편집, 저장-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-050-002 락커 이동
- Handoff: template-ready
- Endpoint: `/api/admin/facilities/dialogs/050-002`
- Request: `{ dialogId: "DLG-050-002", values: { 현재-락커-정보, 이동할-번호-입력, 확인-버튼, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-050-003 락커 회수 확인
- Handoff: template-ready
- Endpoint: `/api/admin/facilities/dialogs/050-003`
- Request: `{ dialogId: "DLG-050-003", values: { 안내-메시지, 회수-버튼, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-050-004 개별 배정
- Handoff: template-ready
- Endpoint: `/api/admin/facilities/dialogs/050-004`
- Request: `{ dialogId: "DLG-050-004", values: { 회원-검색-자동완성, 만료일-입력, 배정-버튼, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-050-005 고장 토글 확인
- Handoff: template-ready
- Endpoint: `/api/admin/facilities/dialogs/050-005`
- Request: `{ dialogId: "DLG-050-005", values: { 안내-메시지, 확인-버튼, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-050-006 일괄 배정
- Handoff: template-ready
- Endpoint: `/api/admin/facilities/dialogs/050-006`
- Request: `{ dialogId: "DLG-050-006", values: { 선택된-락커-수-안내, 회원-검색-자동완성, 만료일-입력, n-개-락커-배정-버튼, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-050-007 일괄 해제 확인
- Handoff: template-ready
- Endpoint: `/api/admin/facilities/dialogs/050-007`
- Request: `{ dialogId: "DLG-050-007", values: { 안내-메시지-선택-락커-수, n-개-일괄-해제-버튼, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-052-001 RFID 등록
- Handoff: policy-pending
- Endpoint: `/api/admin/facilities/dialogs/052-001`
- Request: `{ dialogId: "DLG-052-001", values: { 카드-번호-스캔-수동-입력-16자리-hex, 사용자-유형-회원-직원, 회원-직원-검색, 연결-사물함-선택, rfid-리더-연결-상태 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-052-002 RFID 이력 조회
- Handoff: template-ready
- Endpoint: `/api/admin/facilities/dialogs/052-002`
- Request: `{ dialogId: "DLG-052-002", values: { 이력-테이블-시각-위치-매핑-회원-이벤트, 기간-필터-최대-90일, 닫기 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-052-003 RFID 삭제 확인
- Handoff: policy-pending
- Endpoint: `/api/admin/facilities/dialogs/052-003`
- Request: `{ dialogId: "DLG-052-003", values: { 대상-rfid-번호, 삭제-분실-사유, 기존-매핑-안내, 확인-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-053-001 룸 등록/수정
- Handoff: policy-pending
- Endpoint: `/api/admin/facilities/dialogs/053-001`
- Request: `{ dialogId: "DLG-053-001", values: { 룸명, 유형-gx-pt-스피닝-필라테스-기타, 수용-인원-1, 룸-설명, 기본-운영-시간, 캘린더-색상 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-053-002 룸 삭제 확인
- Handoff: policy-pending
- Endpoint: `/api/admin/facilities/dialogs/053-002`
- Request: `{ dialogId: "DLG-053-002", values: { 대상-룸-정보, 사용-중-일정-n건, 강제-종료-옵션, 삭제-취소 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-056-001 장비 등록
- Handoff: policy-pending
- Endpoint: `/api/admin/facilities/dialogs/056-001`
- Request: `{ dialogId: "DLG-056-001", values: { 장비명, 장비-유형, 설치-위치, 점검-주기-30-90-180-365일, 최초-점검일, 다음-점검-예정일-자동-계산 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-056-002 점검 등록
- Handoff: policy-pending
- Endpoint: `/api/admin/facilities/dialogs/056-002`
- Request: `{ dialogId: "DLG-056-002", values: { 장비-선택, 점검자, 점검일, 결과-정상-이상-수리-필요, 메모, 다음-점검-예정일-자동-갱신 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-056-003 수리 등록
- Handoff: policy-pending
- Endpoint: `/api/admin/facilities/dialogs/056-003`
- Request: `{ dialogId: "DLG-056-003", values: { 장비-선택, 고장-내용, 수리-담당자, 긴급도, 접수일, 완료일-결과-완료-시 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-057-001 소모품 등록
- Handoff: policy-pending
- Endpoint: `/api/admin/facilities/dialogs/057-001`
- Request: `{ dialogId: "DLG-057-001", values: { 품목명-중복-불가, 카테고리-샴푸-세제-타월-기타, 단위-개-박스-l-등, 안전-재고-기준-1, 메모 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-057-002 입출고 처리
- Handoff: policy-pending
- Endpoint: `/api/admin/facilities/dialogs/057-002`
- Request: `{ dialogId: "DLG-057-002", values: { 입고-출고-탭, 수량-1-출고는-재고-이하, 공급업체-입고, 출고-사유-필수, 비고 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-057-003 발주 생성
- Handoff: policy-pending
- Endpoint: `/api/admin/facilities/dialogs/057-003`
- Request: `{ dialogId: "DLG-057-003", values: { 품목-선택, 발주-수량, 공급업체-필수, 납기일, 발주서-pdf-미리보기 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-058-001 청소 스케줄 등록
- Handoff: policy-pending
- Endpoint: `/api/admin/facilities/dialogs/058-001`
- Request: `{ dialogId: "DLG-058-001", values: { 구역명-중복-불가, 청소-유형-일일-정기, 담당자-미지정-가능, 주기-일일-주간-월간, 예정-시간 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-060-001 직원 등록/수정 취소 확인
- Handoff: template-ready
- Endpoint: `/api/admin/staff/dialogs/060-001`
- Request: `{ dialogId: "DLG-060-001", values: { 제목, 안내-메시지, 계속-작성-버튼, 취소-확인-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-060-002 직원 삭제(퇴사 처리) 확인
- Handoff: template-ready
- Endpoint: `/api/admin/staff/dialogs/060-002`
- Request: `{ dialogId: "DLG-060-002", values: { 제목, 안내-메시지, 확인-텍스트-입력-필드, 퇴사-처리-버튼-위험, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-061-001 직원 등록 폼 취소 확인
- Handoff: template-ready
- Endpoint: `/api/admin/staff/dialogs/061-001`
- Request: `{ dialogId: "DLG-061-001", values: { 제목, 안내-메시지, 계속-작성-버튼, 이동-확인-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-064-001 급여 상세 편집
- Handoff: template-ready
- Endpoint: `/api/admin/staff/dialogs/064-001`
- Request: `{ dialogId: "DLG-064-001", values: { 직원-정보-요약, 자동-계산-요약-read-only, 수당-항목-목록-식대-교통비-특별-성과-기타, 공제-항목-목록-지각-결근-4대보험-안내-선지급-가불-기타, 변경-사유-입력-필수, 실지급액-미리보기 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-064-002 급여 확정 확인
- Handoff: template-ready
- Endpoint: `/api/admin/staff/dialogs/064-002`
- Request: `{ dialogId: "DLG-064-002", values: { 제목, 안내-메시지, 확정-대상-요약-직원-n명-총-지급액, 확정-버튼, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-064-003 급여 정책 추가
- Handoff: template-ready
- Endpoint: `/api/admin/staff/dialogs/064-003`
- Request: `{ dialogId: "DLG-064-003", values: { 정책-분류-탭-매출-수업, 직군-선택-탭-fc-pt-gx-공통, 지급-방식-정률-고정-시급-혼합, 직급-입력, 기본급-입력, 수업단가-수업료-매출커미션-입력 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-070-001 리드 등록/수정
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/070-001`
- Request: `{ dialogId: "DLG-070-001", values: { 이름, 연락처-중복-확인, 문의-유형, 가입경로, 상담-방식, 상태-상담-단계-7종 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-070-002 리드 삭제 확인
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/070-002`
- Request: `{ dialogId: "DLG-070-002", values: { 제목, 안내-메시지, 삭제-버튼-위험, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-071-001 수신자 검색
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/071-001`
- Request: `{ dialogId: "DLG-071-001", values: { 검색-입력-필드, 조건-필터-이용권-상태-등급, 담당자-필터, 검색-결과-목록, 체크박스-선택, 선택-수-요약 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-071-002 발송 미리보기
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/071-002`
- Request: `{ dialogId: "DLG-071-002", values: { 채널별-미리보기-탭-push-카톡-sms, 발송-대상-요약, 제외-예정-건수, 메시지-본문-미리보기-변수-치환, 플랫폼-발송-정보, 발송-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-072-001 알림 규칙 편집
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/072-001`
- Request: `{ dialogId: "DLG-072-001", values: { 규칙명, 정책-유형-만료-생일-장기-미방문-등, step-소유-구분-본사-지점, 발송-시점-설정, 플랫폼-연동-정보, 발송-시각 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-072-002 알림 트리거 추가
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/072-002`
- Request: `{ dialogId: "DLG-072-002", values: { 카테고리-그룹-고객-상품-결제-락커, 만료-정책-추가-모드, 트리거-목록, 지점-추가-step-입력-기준일-d-n, 검색창, 설명-패널 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-073-001 쿠폰 생성/수정
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/073-001`
- Request: `{ dialogId: "DLG-073-001", values: { 쿠폰명-50자-이내, 할인-유형-정률-정액, 할인-금액-율, 유효-기간-시작-종료, 발급-수량-제한, 1인-사용-제한 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-073-002 쿠폰 발급
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/073-002`
- Request: `{ dialogId: "DLG-073-002", values: { 발급-쿠폰-정보, 발급-대상-선택-개별-그룹, 회원-검색-필드, 선택-회원-목록, 발급-수량-확인, 발급-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-073-003 쿠폰 삭제 확인
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/073-003`
- Request: `{ dialogId: "DLG-073-003", values: { 제목, 쿠폰-요약, 삭제-가능-안내-이력-0건, 중단-전환-안내-이력-있음, 삭제-중단-버튼-위험, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-074-001 적립 규칙 편집
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/074-001`
- Request: `{ dialogId: "DLG-074-001", values: { 기본-적립률, 최소-적립-결제-금액, 특별-적립-조건, 마일리지-소멸-정책-개월, 소멸-예정-알림-설정-d-30, 저장-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-074-002 수동 적립·차감
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/074-002`
- Request: `{ dialogId: "DLG-074-002", values: { 대상-회원-정보, 현재-잔액, 조정-유형-적립-차감, 조정-금액-0-초과, 조정-후-예상-잔액, 사유-입력-필수 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-076-001 캠페인 등록
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/076-001`
- Request: `{ dialogId: "DLG-076-001", values: { 캠페인명, 캠페인-목표, 캠페인-기간, 대상-세그먼트, 사용-채널-push-카톡-sms, 저장-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-076-002 캠페인 삭제 확인
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/076-002`
- Request: `{ dialogId: "DLG-076-002", values: { 제목, 안내-메시지, 삭제-버튼-위험, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-077-001 리퍼럴 이벤트 등록
- Handoff: policy-pending
- Endpoint: `/api/admin/marketing/dialogs/077-001`
- Request: `{ dialogId: "DLG-077-001", values: { 이벤트명, 추천인-혜택, 피추천인-혜택, 혜택-지급-시점-첫-정상-결제-완료, 이벤트-기간-시작-종료, 종료-후-그레이스-기간-7-30일 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-077-002 리퍼럴 이벤트 삭제 확인
- Handoff: policy-pending
- Endpoint: `/api/admin/marketing/dialogs/077-002`
- Request: `{ dialogId: "DLG-077-002", values: { 제목, 안내-메시지, 삭제-버튼-위험, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-078-001 발송 대상 선택
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/078-001`
- Request: `{ dialogId: "DLG-078-001", values: { 그룹-선택-전체-활성-만료-등급, 추가-조건-필터-이용권-지역-가입-기간, 예상-수신자-수, 확인-버튼, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-078-002 발송 확인
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/078-002`
- Request: `{ dialogId: "DLG-078-002", values: { 발송-요약-채널-대상-내용, 플랫폼-연동-정보, 예상-비용, 발신-후-잔여-캐시, 발송-일시, 발송-확인-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-079-001 A/B 테스트 등록
- Handoff: policy-pending
- Endpoint: `/api/admin/marketing/dialogs/079-001`
- Request: `{ dialogId: "DLG-079-001", values: { 테스트명, a안-b안, 대상-분배-비율, 테스트-기간, 성과-측정-기준, 저장-버튼-고객사-확인-후-활성 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-079-002 A/B 테스트 삭제 확인
- Handoff: policy-pending
- Endpoint: `/api/admin/marketing/dialogs/079-002`
- Request: `{ dialogId: "DLG-079-002", values: { 제목, 안내-메시지, 삭제-버튼-위험, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-080-001 미저장 경고
- Handoff: template-ready
- Endpoint: `/api/admin/settings/dialogs/080-001`
- Request: `{ dialogId: "DLG-080-001", values: { 안내-메시지, 저장-버튼, 이탈-버튼, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-080A-001 정책 적용 확인
- Handoff: template-ready
- Endpoint: `/api/admin/settings/dialogs/080a-001`
- Request: `{ dialogId: "DLG-080A-001", values: { 변경-요약, before-after-권한-차이, 충돌-목록, 확인-버튼, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-081-006 역할 변경 영향 분석
- Handoff: template-ready
- Endpoint: `/api/admin/settings/dialogs/081-006`
- Request: `{ dialogId: "DLG-081-006", values: { 요약-헤더-배정-직원-수-담당-회원-합계, 영향-범위-카드-2종-권한-추가-제거, 영향-직원-목록-펼침, 변경-차이-요약-before-after, 민감-기능-변경-여부, 확인-액션 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-084-001 플랜 변경 확인
- Handoff: template-ready
- Endpoint: `/api/admin/settings/dialogs/084-001`
- Request: `{ dialogId: "DLG-084-001", values: { 현재-플랜-변경-플랜, 요금-차액-다음-결제일, 데이터-한도-영향-다운그레이드-시, 변경-확인-버튼, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-084-002 구독 해지 확인
- Handoff: template-ready
- Endpoint: `/api/admin/settings/dialogs/084-002`
- Request: `{ dialogId: "DLG-084-002", values: { 현재-플랜, 해지-시-변화-안내, 데이터-삭제-일정-90일-후, 해지-확인-버튼, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-089-001 데이터 복원 확인
- Handoff: template-ready
- Endpoint: `/api/admin/settings/dialogs/089-001`
- Request: `{ dialogId: "DLG-089-001", values: { 복원-대상-백업-시점, 진행-중-트랜잭션-n건-안내, 복원-사유-입력-필수, 확인-텍스트-입력, 복원-실행-버튼-위험 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-089-002 백업 설정
- Handoff: template-ready
- Endpoint: `/api/admin/settings/dialogs/089-002`
- Request: `{ dialogId: "DLG-089-002", values: { 자동-백업-활성화-토글, 백업-주기-매일-매주-매월, 백업-실행-시각, 보관-기간-30-90-180일-무제한, 저장-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-081-001 권한 초기화 확인
- Handoff: template-ready
- Endpoint: `/api/admin/settings/dialogs/081-001`
- Request: `{ dialogId: "DLG-081-001", values: { 안내-메시지-변경-사항-폐기, 초기화-확인-버튼, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-081-002 권한 충돌 경고
- Handoff: template-ready
- Endpoint: `/api/admin/settings/dialogs/081-002`
- Request: `{ dialogId: "DLG-081-002", values: { 충돌-목록, 민감-기능-강조, 충돌-무시-저장-버튼, 수정-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-081-003 역할 생성
- Handoff: template-ready
- Endpoint: `/api/admin/settings/dialogs/081-003`
- Request: `{ dialogId: "DLG-081-003", values: { 역할-이름-중복-불가, 역할-설명, 기존-역할-복사-선택, 권한-매트릭스, 저장-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-081-004 역할 삭제 확인
- Handoff: template-ready
- Endpoint: `/api/admin/settings/dialogs/081-004`
- Request: `{ dialogId: "DLG-081-004", values: { 삭제-대상-역할명, 배정-직원-수, 삭제-처리-안내, 확인-버튼, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-081-005 역할 복사
- Handoff: template-ready
- Endpoint: `/api/admin/settings/dialogs/081-005`
- Request: `{ dialogId: "DLG-081-005", values: { 원본-역할-선택, 새-역할-이름-중복-불가, 새-역할-설명, 복사-실행-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-087-001 역할 삭제 재배정
- Handoff: template-ready
- Endpoint: `/api/admin/settings/dialogs/087-001`
- Request: `{ dialogId: "DLG-087-001", values: { 삭제-대상-역할, 배정-직원-목록, 재배정-역할-선택, 재배정-실행-삭제-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-085-001 공지 등록/수정
- Handoff: policy-pending
- Endpoint: `/api/admin/settings/dialogs/085-001`
- Request: `{ dialogId: "DLG-085-001", values: { 제목-필수, 본문-에디터, 게시-대상-전체-직원-특정-역할, 게시-기간-시작-종료, 예약-발행-시각, 첨부-파일-이미지-5mb-pdf-20mb-최대-5개, 상단-고정-토글-최대-3개, 앱-푸시-발송-여부 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-085-002 공지 삭제 확인
- Handoff: policy-pending
- Endpoint: `/api/admin/settings/dialogs/085-002`
- Request: `{ dialogId: "DLG-085-002", values: { 삭제-대상-공지, 게시-상태-안내, 삭제-확인-버튼, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-092-001 신규 지점 등록
- Handoff: template-ready
- Endpoint: `/api/admin/hq/dialogs/092-001`
- Request: `{ dialogId: "DLG-092-001", values: { 지점명, 지점-코드, 대표-연락처, 주소-주소-검색, 운영-시작일, 초기-owner-지점장-지정-기존-직원-또는-신규-초대-이메일, 본사-표준-정책-세트-적용-안내, 수용-가능-회원-수-선택, 취소-등록 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-092-002 지점 비활성화 확인
- Handoff: template-ready
- Endpoint: `/api/admin/hq/dialogs/092-002`
- Request: `{ dialogId: "DLG-092-002", values: { 대상-지점명-지점-코드, 현재-운영-상태, 변경-후-상태-임시휴업-폐점, 적용-예정일-즉시-날짜-지정, 변경-사유-필수, 활성-회원-수-진행-예약-수, 신규-가입-결제-예약-차단-여부, 회원앱-지점-노출-변경, 직원-계정-접근-영향, 취소-운영-상태-변경 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-094-001 매출 목표 설정
- Handoff: template-ready
- Endpoint: `/api/admin/hq/dialogs/094-001`
- Request: `{ dialogId: "DLG-094-001", values: { 대상-지점-전체-일괄-개별, 목표-적용-기간, 지점별-월-매출-목표-금액, 전년-동기-실적-참고, 취소-저장 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-098-001 태스크 추가
- Handoff: template-ready
- Endpoint: `/api/admin/hq/dialogs/098-001`
- Request: `{ dialogId: "DLG-098-001", values: { 할-일-제목-필수, 할-일-상세-설명, 우선순위-높음-보통-낮음, 담당자-기본값-본인, 마감-시각, 취소-추가 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-098-002 태스크 상세 수정
- Handoff: template-ready
- Endpoint: `/api/admin/hq/dialogs/098-002`
- Request: `{ dialogId: "DLG-098-002", values: { 할-일-제목-기존-내용-자동-로드, 할-일-상세-설명, 우선순위, 담당자, 마감-시각, 완료-여부-토글, 취소-저장 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-H1001-001 정책 세트 편집
- Handoff: template-ready
- Endpoint: `/api/admin/hq/dialogs/h1001-001`
- Request: `{ dialogId: "DLG-H1001-001", values: { 기본정보-정책명-정책-유형, 정책-유형-회원-이용권-만료-결제기한-만료-락커-만료-수업-운영-운영-자동화, 적용-범위, 스텝-리스트-기준일-d-숫자-d-day-d-숫자, 지점-추가-step-허용, 결제기한-만료-세부-설정-미수-연체-알림-n일-반복-주기-발송-시각, 기본-채널-회원앱-push-기본-kakaotalk-fallback-선택, 지점-수정-허용-범위 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-I001 수동 출석 등록
- Handoff: template-ready
- Endpoint: `/api/admin/integrated/dialogs/i001`
- Request: `{ dialogId: "DLG-I001", values: { 구분-회원-직원-필수, 이름-또는-번호-검색-회원명-회원번호-사번-필수, 출석-시각-필수-기본-현재-시각, 비고-수동-등록-사유, 취소-등록 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-I002 옷 락커 배정
- Handoff: template-ready
- Endpoint: `/api/admin/integrated/dialogs/i002`
- Request: `{ dialogId: "DLG-I002", values: { 회원명-출석-시각-이용권-상품명-유형-고정-락커-읽기-전용, 빈-락커-목록-번호-순, 락커-상태-선택-가능-사용-중-점검-중, 취소-배정 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-I003 체성분 수기 등록
- Handoff: template-ready
- Endpoint: `/api/admin/integrated/dialogs/i003`
- Request: `{ dialogId: "DLG-I003", values: { 회원-검색-필수, 측정일시-필수-기본-현재-시각, 체중-kg-필수, 골격근량-kg, 체지방량-kg, 체지방률, bmi, 기초대사량-kcal, 체수분-l, 비고, 취소-등록 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

