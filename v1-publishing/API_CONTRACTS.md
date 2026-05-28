# V1 API Contracts for Development Handoff

Generated: 2026-05-28T13:20:01.769Z

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
- Query Params: `기본-정보`, `관리-정보`, `연락-정보`, `기타-설정`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-M003.list | GET | `/api/admin/members/:id` | 회원 수정 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-M003", rows, metrics, permissions, policyFlags }` |
| SCR-M003.저장 | PATCH | `/api/admin/members/:id/actions/저장` | 회원 수정 - 저장 처리 | `{ ok: true, toast: "저장 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M003.전화번호-중복-확인 | PATCH | `/api/admin/members/:id/actions/전화번호-중복-확인` | 회원 수정 - 전화번호 중복 확인 처리 | `{ ok: true, toast: "전화번호 중복 확인 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M003.주소-검색 | PATCH | `/api/admin/members/:id/actions/주소-검색` | 회원 수정 - 주소 검색 처리 | `{ ok: true, toast: "주소 검색 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M003.취소 | PATCH | `/api/admin/members/:id/actions/취소` | 회원 수정 - 취소 처리 | `{ ok: true, toast: "취소 mock 처리 완료", updatedRows?, nextState? }` |

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
- Query Params: `현재-소속`, `대상-지점`, `담당자`, `귀속-지점`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-M005.list | GET | `/api/admin/members/transfer` | 회원 이관 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-M005", rows, metrics, permissions, policyFlags }` |
| SCR-M005.이관-확인 | POST | `/api/admin/members/transfer/actions/이관-확인` | 회원 이관 - 이관 확인 처리 | `{ ok: true, toast: "이관 확인 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-M006 체성분 관리
- Route: `/body-composition`
- Handoff: production-ready
- Query Params: `회원-선택`, `측정-기간`, `수신-상태`, `검수-상태`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-M006.list | GET | `/api/admin/body-composition` | 체성분 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-M006", rows, metrics, permissions, policyFlags }` |
| SCR-M006.측정-추가 | PATCH | `/api/admin/body-composition/actions/측정-추가` | 체성분 관리 - 측정 추가 처리 | `{ ok: true, toast: "측정 추가 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M006.목표-설정 | PATCH | `/api/admin/body-composition/actions/목표-설정` | 체성분 관리 - 목표 설정 처리 | `{ ok: true, toast: "목표 설정 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-M006.덮어쓰기-테스트 | PATCH | `/api/admin/body-composition/actions/덮어쓰기-테스트` | 체성분 관리 - 덮어쓰기 테스트 처리 | `{ ok: true, toast: "덮어쓰기 테스트 mock 처리 완료", updatedRows?, nextState? }` |

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
- Query Params: `그룹명`, `대표-회원`, `관계`, `활성-여부`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-M008.list | GET | `/api/admin/members/family` | 가족 회원 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-M008", rows, metrics, permissions, policyFlags }` |
| SCR-M008.가족-연결 | PATCH | `/api/admin/members/family/actions/가족-연결` | 가족 회원 - 가족 연결 처리 | `{ ok: true, toast: "가족 연결 mock 처리 완료", updatedRows?, nextState? }` |

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
- Query Params: `방문-공백`, `결제일`, `만료-step`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-M010.list | GET | `/api/admin/members/segment` | 세그먼트 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-M010", rows, metrics, permissions, policyFlags }` |
| SCR-M010.메모-액션-기록 | PATCH | `/api/admin/members/segment/actions/메모-액션-기록` | 세그먼트 관리 - 메모/액션 기록 처리 | `{ ok: true, toast: "메모/액션 기록 mock 처리 완료", updatedRows?, nextState? }` |

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
- Query Params: `기간`, `지점`, `상품`, `직원`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-S004.list | GET | `/api/admin/sales/stats` | 매출 통계 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-S004", rows, metrics, permissions, policyFlags }` |
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
- Query Params: `계약-기간`, `상품`, `지점`, `인식-상태`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-S006.list | GET | `/api/admin/sales/deferred-revenue` | 선수익금 조회 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-S006", rows, metrics, permissions, policyFlags }` |
| SCR-S006.원-매출-상세 | PATCH | `/api/admin/sales/deferred-revenue/actions/원-매출-상세` | 선수익금 조회 - 원 매출 상세 처리 | `{ ok: true, toast: "원 매출 상세 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-S007 환불 관리
- Route: `/sales/refunds`
- Handoff: policy-pending
- Query Params: `상태`, `요청자`, `승인자`, `기간`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-S007.list | GET | `/api/admin/sales/refunds` | 환불 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-S007", rows, metrics, permissions, policyFlags }` |
| SCR-S007.환불-요청 | POST | `/api/admin/sales/refunds/actions/환불-요청` | 환불 관리 - 환불 요청 처리 | `{ ok: true, toast: "환불 요청 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S007.환불-처리 | POST | `/api/admin/sales/refunds/actions/환불-처리` | 환불 관리 - 환불 처리 처리 | `{ ok: true, toast: "환불 처리 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S007.환불-상세 | POST | `/api/admin/sales/refunds/actions/환불-상세` | 환불 관리 - 환불 상세 처리 | `{ ok: true, toast: "환불 상세 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-S008 미수금 관리
- Route: `/sales/receivables`
- Handoff: production-ready
- Query Params: `회원`, `상품`, `예정일`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-S008.list | GET | `/api/admin/sales/receivables` | 미수금 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-S008", rows, metrics, permissions, policyFlags }` |
| SCR-S008.납입-처리 | PATCH | `/api/admin/sales/receivables/actions/납입-처리` | 미수금 관리 - 납입 처리 처리 | `{ ok: true, toast: "납입 처리 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S008.메모-편집 | PATCH | `/api/admin/sales/receivables/actions/메모-편집` | 미수금 관리 - 메모 편집 처리 | `{ ok: true, toast: "메모 편집 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-S009 할부결제 관리
- Route: `/sales/installments`
- Handoff: production-ready
- Query Params: `상태`, `계약-출처`, `납입-예정일`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-S009.list | GET | `/api/admin/sales/installments` | 할부결제 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-S009", rows, metrics, permissions, policyFlags }` |
| SCR-S009.할부-상세 | PATCH | `/api/admin/sales/installments/actions/할부-상세` | 할부결제 관리 - 할부 상세 처리 | `{ ok: true, toast: "할부 상세 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S009.납입-처리 | PATCH | `/api/admin/sales/installments/actions/납입-처리` | 할부결제 관리 - 납입 처리 처리 | `{ ok: true, toast: "납입 처리 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S009.할부-등록 | PATCH | `/api/admin/sales/installments/actions/할부-등록` | 할부결제 관리 - 할부 등록 처리 | `{ ok: true, toast: "할부 등록 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-S010 세금계산서 발행
- Route: `/sales/tax-invoice`
- Handoff: policy-pending
- Query Params: `상태`, `법인`, `발행일`, `이메일`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-S010.list | GET | `/api/admin/sales/tax-invoice` | 세금계산서 발행 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-S010", rows, metrics, permissions, policyFlags }` |
| SCR-S010.세금계산서-상세 | PATCH | `/api/admin/sales/tax-invoice/actions/세금계산서-상세` | 세금계산서 발행 - 세금계산서 상세 처리 | `{ ok: true, toast: "세금계산서 상세 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S010.세금계산서-발행 | PATCH | `/api/admin/sales/tax-invoice/actions/세금계산서-발행` | 세금계산서 발행 - 세금계산서 발행 처리 | `{ ok: true, toast: "세금계산서 발행 mock 처리 완료", updatedRows?, nextState? }` |

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
- Query Params: `회원명`, `상품명`, `결제일`, `승인-상태`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-S012.list | GET | `/api/admin/sales/refund-partial` | 결제 취소 / 부분 환불 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-S012", rows, metrics, permissions, policyFlags }` |
| SCR-S012.환불-요청 | POST | `/api/admin/sales/refund-partial/actions/환불-요청` | 결제 취소 / 부분 환불 - 환불 요청 처리 | `{ ok: true, toast: "환불 요청 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S012.환불-처리 | POST | `/api/admin/sales/refund-partial/actions/환불-처리` | 결제 취소 / 부분 환불 - 환불 처리 처리 | `{ ok: true, toast: "환불 처리 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-S012.결과-보기 | PATCH | `/api/admin/sales/refund-partial/actions/결과-보기` | 결제 취소 / 부분 환불 - 결과 보기 처리 | `{ ok: true, toast: "결과 보기 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C001 수업 캘린더
- Route: `/classes/c001`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C001.list | GET | `/api/admin/classes/c001` | 수업 캘린더 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C001", rows, metrics, permissions, policyFlags }` |
| SCR-C001.수업-등록-수정-캘린더 | PATCH | `/api/admin/classes/c001/actions/수업-등록-수정-캘린더` | 수업 캘린더 - 수업 등록/수정 (캘린더) 처리 | `{ ok: true, toast: "수업 등록/수정 (캘린더) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C001.일정-상세 | PATCH | `/api/admin/classes/c001/actions/일정-상세` | 수업 캘린더 - 일정 상세 처리 | `{ ok: true, toast: "일정 상세 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C001.일괄-변경 | PATCH | `/api/admin/classes/c001/actions/일괄-변경` | 수업 캘린더 - 일괄 변경 처리 | `{ ok: true, toast: "일괄 변경 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C001.세션-상세 | PATCH | `/api/admin/classes/c001/actions/세션-상세` | 수업 캘린더 - 세션 상세 처리 | `{ ok: true, toast: "세션 상세 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C002 수업 관리
- Route: `/lessons`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C002.list | GET | `/api/admin/lessons` | 수업 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C002", rows, metrics, permissions, policyFlags }` |
| SCR-C002.수업-등록-수정-관리 | PATCH | `/api/admin/lessons/actions/수업-등록-수정-관리` | 수업 관리 - 수업 등록/수정 (관리) 처리 | `{ ok: true, toast: "수업 등록/수정 (관리) mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C002.수업-기록-상세 | PATCH | `/api/admin/lessons/actions/수업-기록-상세` | 수업 관리 - 수업 기록 상세 처리 | `{ ok: true, toast: "수업 기록 상세 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C002.서명 | PATCH | `/api/admin/lessons/actions/서명` | 수업 관리 - 서명 처리 | `{ ok: true, toast: "서명 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C003 시간표 일괄 등록
- Route: `/class-schedule`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C003.list | GET | `/api/admin/class-schedule` | 시간표 일괄 등록 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C003", rows, metrics, permissions, policyFlags }` |
| SCR-C003.일괄-생성-확인 | PATCH | `/api/admin/class-schedule/actions/일괄-생성-확인` | 시간표 일괄 등록 - 일괄 생성 확인 처리 | `{ ok: true, toast: "일괄 생성 확인 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C004 그룹 수업 템플릿
- Route: `/class-templates`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C004.list | GET | `/api/admin/class-templates` | 그룹 수업 템플릿 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C004", rows, metrics, permissions, policyFlags }` |
| SCR-C004.템플릿-등록-수정 | PATCH | `/api/admin/class-templates/actions/템플릿-등록-수정` | 그룹 수업 템플릿 - 템플릿 등록/수정 처리 | `{ ok: true, toast: "템플릿 등록/수정 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C004.c009에서 | PATCH | `/api/admin/class-templates/actions/c009에서` | 그룹 수업 템플릿 - DLG-C009에서 처리 | `{ ok: true, toast: "DLG-C009에서 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C005 그룹 수업 현황
- Route: `/classes/c005`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C005.list | GET | `/api/admin/classes/c005` | 그룹 수업 현황 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C005", rows, metrics, permissions, policyFlags }` |
| SCR-C005.mock-저장 | PATCH | `/api/admin/classes/c005/actions/mock-저장` | 그룹 수업 현황 - mock 저장 처리 | `{ ok: true, toast: "mock 저장 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C006 강사 근무 현황
- Route: `/instructor-status`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C006.list | GET | `/api/admin/instructor-status` | 강사 근무 현황 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C006", rows, metrics, permissions, policyFlags }` |
| SCR-C006.강사-상세 | PATCH | `/api/admin/instructor-status/actions/강사-상세` | 강사 근무 현황 - 강사 상세 처리 | `{ ok: true, toast: "강사 상세 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C006.c010에서 | PATCH | `/api/admin/instructor-status/actions/c010에서` | 강사 근무 현황 - DLG-C010에서 처리 | `{ ok: true, toast: "DLG-C010에서 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C007 횟수 관리
- Route: `/lesson-counts`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C007.list | GET | `/api/admin/lesson-counts` | 횟수 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C007", rows, metrics, permissions, policyFlags }` |
| SCR-C007.횟수-조정 | PATCH | `/api/admin/lesson-counts/actions/횟수-조정` | 횟수 관리 - 횟수 조정 처리 | `{ ok: true, toast: "횟수 조정 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C007.차감-이력 | PATCH | `/api/admin/lesson-counts/actions/차감-이력` | 횟수 관리 - 차감 이력 처리 | `{ ok: true, toast: "차감 이력 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C008 페널티 관리
- Route: `/penalties`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C008.list | GET | `/api/admin/penalties` | 페널티 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C008", rows, metrics, permissions, policyFlags }` |
| SCR-C008.페널티-등록 | PATCH | `/api/admin/penalties/actions/페널티-등록` | 페널티 관리 - 페널티 등록 처리 | `{ ok: true, toast: "페널티 등록 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C008.자동-페널티-정책 | PATCH | `/api/admin/penalties/actions/자동-페널티-정책` | 페널티 관리 - 자동 페널티 정책 처리 | `{ ok: true, toast: "자동 페널티 정책 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C008.노쇼-정책 | PATCH | `/api/admin/penalties/actions/노쇼-정책` | 페널티 관리 - 노쇼 정책 처리 | `{ ok: true, toast: "노쇼 정책 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C009 일정 요청 처리
- Route: `/schedule-requests`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C009.list | GET | `/api/admin/schedule-requests` | 일정 요청 처리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C009", rows, metrics, permissions, policyFlags }` |
| SCR-C009.대안-일정-제시 | PATCH | `/api/admin/schedule-requests/actions/대안-일정-제시` | 일정 요청 처리 - 대안 일정 제시 처리 | `{ ok: true, toast: "대안 일정 제시 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C011 유효 수업 목록
- Route: `/valid-lessons`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C011.list | GET | `/api/admin/valid-lessons` | 유효 수업 목록 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C011", rows, metrics, permissions, policyFlags }` |
| SCR-C011.수업-기록-상세 | PATCH | `/api/admin/valid-lessons/actions/수업-기록-상세` | 유효 수업 목록 - 수업 기록 상세 처리 | `{ ok: true, toast: "수업 기록 상세 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C011.서명 | PATCH | `/api/admin/valid-lessons/actions/서명` | 유효 수업 목록 - 서명 처리 | `{ ok: true, toast: "서명 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-C011.c006에서 | PATCH | `/api/admin/valid-lessons/actions/c006에서` | 유효 수업 목록 - DLG-C006에서 처리 | `{ ok: true, toast: "DLG-C006에서 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C013 수업 평가 피드백
- Route: `/class-feedback`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C013.list | GET | `/api/admin/class-feedback` | 수업 평가 피드백 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C013", rows, metrics, permissions, policyFlags }` |
| SCR-C013.mock-저장 | PATCH | `/api/admin/class-feedback/actions/mock-저장` | 수업 평가 피드백 - mock 저장 처리 | `{ ok: true, toast: "mock 저장 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C014 수업 출석/완료 확인
- Route: `/attendance/lesson-completion`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C014.list | GET | `/api/admin/attendance/lesson-completion` | 수업 출석/완료 확인 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C014", rows, metrics, permissions, policyFlags }` |
| SCR-C014.mock-저장 | PATCH | `/api/admin/attendance/lesson-completion/actions/mock-저장` | 수업 출석/완료 확인 - mock 저장 처리 | `{ ok: true, toast: "mock 저장 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-C016 예약 목록
- Route: `/class-reservations`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-C016.list | GET | `/api/admin/class-reservations` | 예약 목록 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-C016", rows, metrics, permissions, policyFlags }` |
| SCR-C016.mock-저장 | PATCH | `/api/admin/class-reservations/actions/mock-저장` | 예약 목록 - mock 저장 처리 | `{ ok: true, toast: "mock 저장 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-P001 상품 관리
- Route: `/products/p001`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-P001.list | GET | `/api/admin/products/p001` | 상품 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-P001", rows, metrics, permissions, policyFlags }` |
| SCR-P001.상품-등록-모달 | PATCH | `/api/admin/products/p001/actions/상품-등록-모달` | 상품 관리 - 상품 등록 모달 처리 | `{ ok: true, toast: "상품 등록 모달 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P001.전-지점-배포-확인 | PATCH | `/api/admin/products/p001/actions/전-지점-배포-확인` | 상품 관리 - 전 지점 배포 확인 처리 | `{ ok: true, toast: "전 지점 배포 확인 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P001.작업-취소-확인 | PATCH | `/api/admin/products/p001/actions/작업-취소-확인` | 상품 관리 - 작업 취소 확인 처리 | `{ ok: true, toast: "작업 취소 확인 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P001.가격-변경-이력 | PATCH | `/api/admin/products/p001/actions/가격-변경-이력` | 상품 관리 - 가격 변경 이력 처리 | `{ ok: true, toast: "가격 변경 이력 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-P002 상품 등록
- Route: `/products/p002`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-P002.list | GET | `/api/admin/products/p002` | 상품 등록 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-P002", rows, metrics, permissions, policyFlags }` |
| SCR-P002.mock-저장 | PATCH | `/api/admin/products/p002/actions/mock-저장` | 상품 등록 - mock 저장 처리 | `{ ok: true, toast: "mock 저장 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-P003 상품 상세/수정 패널
- Route: `/products/detail`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-P003.list | GET | `/api/admin/products/:id` | 상품 상세/수정 패널 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-P003", rows, metrics, permissions, policyFlags }` |
| SCR-P003.p003 | PATCH | `/api/admin/products/:id/actions/p003` | 상품 상세/수정 패널 - DLG-P003 처리 | `{ ok: true, toast: "DLG-P003 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P003.p005 | PATCH | `/api/admin/products/:id/actions/p005` | 상품 상세/수정 패널 - DLG-P005 처리 | `{ ok: true, toast: "DLG-P005 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P003.p006 | PATCH | `/api/admin/products/:id/actions/p006` | 상품 상세/수정 패널 - DLG-P006 처리 | `{ ok: true, toast: "DLG-P006 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-P003.p014 | PATCH | `/api/admin/products/:id/actions/p014` | 상품 상세/수정 패널 - DLG-P014 처리 | `{ ok: true, toast: "DLG-P014 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-P004 할인 설정
- Route: `/products/p004`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-P004.list | GET | `/api/admin/products/p004` | 할인 설정 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-P004", rows, metrics, permissions, policyFlags }` |
| SCR-P004.mock-저장 | PATCH | `/api/admin/products/p004/actions/mock-저장` | 할인 설정 - mock 저장 처리 | `{ ok: true, toast: "mock 저장 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-050 락커 관리
- Route: `/facilities/050`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-050.list | GET | `/api/admin/facilities/050` | 락커 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-050", rows, metrics, permissions, policyFlags }` |
| SCR-050.락커-기록-조회 | PATCH | `/api/admin/facilities/050/actions/락커-기록-조회` | 락커 관리 - 락커 기록 조회 처리 | `{ ok: true, toast: "락커 기록 조회 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-050.락커-이동 | PATCH | `/api/admin/facilities/050/actions/락커-이동` | 락커 관리 - 락커 이동 처리 | `{ ok: true, toast: "락커 이동 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-050.락커-회수-확인 | PATCH | `/api/admin/facilities/050/actions/락커-회수-확인` | 락커 관리 - 락커 회수 확인 처리 | `{ ok: true, toast: "락커 회수 확인 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-050.개별-배정 | PATCH | `/api/admin/facilities/050/actions/개별-배정` | 락커 관리 - 개별 배정 처리 | `{ ok: true, toast: "개별 배정 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-060 직원 목록
- Route: `/staff`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-060.list | GET | `/api/admin/staff` | 직원 목록 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-060", rows, metrics, permissions, policyFlags }` |
| SCR-060.직원-등록-수정-취소-확인 | PATCH | `/api/admin/staff/actions/직원-등록-수정-취소-확인` | 직원 목록 - 직원 등록/수정 취소 확인 처리 | `{ ok: true, toast: "직원 등록/수정 취소 확인 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-060.직원-삭제-퇴사-처리-확인 | POST | `/api/admin/staff/actions/직원-삭제-퇴사-처리-확인` | 직원 목록 - 직원 삭제(퇴사 처리) 확인 처리 | `{ ok: true, toast: "직원 삭제(퇴사 처리) 확인 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-061 직원 등록/수정
- Route: `/staff/new`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-061.list | GET | `/api/admin/staff/new` | 직원 등록/수정 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-061", rows, metrics, permissions, policyFlags }` |
| SCR-061.직원-등록-폼-취소-확인 | PATCH | `/api/admin/staff/new/actions/직원-등록-폼-취소-확인` | 직원 등록/수정 - 직원 등록 폼 취소 확인 처리 | `{ ok: true, toast: "직원 등록 폼 취소 확인 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-062 직원 퇴사 처리
- Route: `/staff/resignation`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-062.list | GET | `/api/admin/staff/resignation` | 직원 퇴사 처리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-062", rows, metrics, permissions, policyFlags }` |
| SCR-062.직원-삭제-퇴사-처리-확인 | POST | `/api/admin/staff/resignation/actions/직원-삭제-퇴사-처리-확인` | 직원 퇴사 처리 - 직원 삭제(퇴사 처리) 확인 처리 | `{ ok: true, toast: "직원 삭제(퇴사 처리) 확인 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-063 직원 근태 관리
- Route: `/staff/attendance`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-063.list | GET | `/api/admin/staff/attendance` | 직원 근태 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-063", rows, metrics, permissions, policyFlags }` |
| SCR-063.mock-저장 | PATCH | `/api/admin/staff/attendance/actions/mock-저장` | 직원 근태 관리 - mock 저장 처리 | `{ ok: true, toast: "mock 저장 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-064 급여 관리
- Route: `/payroll`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-064.list | GET | `/api/admin/payroll` | 급여 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-064", rows, metrics, permissions, policyFlags }` |
| SCR-064.급여-상세-편집 | PATCH | `/api/admin/payroll/actions/급여-상세-편집` | 급여 관리 - 급여 상세 편집 처리 | `{ ok: true, toast: "급여 상세 편집 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-064.급여-확정-확인 | PATCH | `/api/admin/payroll/actions/급여-확정-확인` | 급여 관리 - 급여 확정 확인 처리 | `{ ok: true, toast: "급여 확정 확인 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-064.급여-정책-추가 | PATCH | `/api/admin/payroll/actions/급여-정책-추가` | 급여 관리 - 급여 정책 추가 처리 | `{ ok: true, toast: "급여 정책 추가 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-065 급여 명세서
- Route: `/payroll/statements`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-065.list | GET | `/api/admin/payroll/statements` | 급여 명세서 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-065", rows, metrics, permissions, policyFlags }` |
| SCR-065.mock-저장 | PATCH | `/api/admin/payroll/statements/actions/mock-저장` | 급여 명세서 - mock 저장 처리 | `{ ok: true, toast: "mock 저장 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-070 리드 관리
- Route: `/leads`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-070.list | GET | `/api/admin/leads` | 리드 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-070", rows, metrics, permissions, policyFlags }` |
| SCR-070.리드-등록-수정 | PATCH | `/api/admin/leads/actions/리드-등록-수정` | 리드 관리 - 리드 등록/수정 처리 | `{ ok: true, toast: "리드 등록/수정 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-070.리드-삭제-확인 | POST | `/api/admin/leads/actions/리드-삭제-확인` | 리드 관리 - 리드 삭제 확인 처리 | `{ ok: true, toast: "리드 삭제 확인 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-070.알림-규칙-편집 | PATCH | `/api/admin/leads/actions/알림-규칙-편집` | 리드 관리 - 알림 규칙 편집 처리 | `{ ok: true, toast: "알림 규칙 편집 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-070.쿠폰-생성-수정 | PATCH | `/api/admin/leads/actions/쿠폰-생성-수정` | 리드 관리 - 쿠폰 생성/수정 처리 | `{ ok: true, toast: "쿠폰 생성/수정 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-071 메시지 발송
- Route: `/message`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-071.list | GET | `/api/admin/message` | 메시지 발송 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-071", rows, metrics, permissions, policyFlags }` |
| SCR-071.수신자-검색 | PATCH | `/api/admin/message/actions/수신자-검색` | 메시지 발송 - 수신자 검색 처리 | `{ ok: true, toast: "수신자 검색 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-071.발송-미리보기 | PATCH | `/api/admin/message/actions/발송-미리보기` | 메시지 발송 - 발송 미리보기 처리 | `{ ok: true, toast: "발송 미리보기 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-072 자동 알림 설정
- Route: `/message/auto-alarm`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-072.list | GET | `/api/admin/message/auto-alarm` | 자동 알림 설정 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-072", rows, metrics, permissions, policyFlags }` |
| SCR-072.알림-트리거-추가 | PATCH | `/api/admin/message/auto-alarm/actions/알림-트리거-추가` | 자동 알림 설정 - 알림 트리거 추가 처리 | `{ ok: true, toast: "알림 트리거 추가 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-072A 자동알림 운영현황
- Route: `/message/auto-alarm-2`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-072A.list | GET | `/api/admin/message/auto-alarm-2` | 자동알림 운영현황 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-072A", rows, metrics, permissions, policyFlags }` |
| SCR-072A.mock-저장 | PATCH | `/api/admin/message/auto-alarm-2/actions/mock-저장` | 자동알림 운영현황 - mock 저장 처리 | `{ ok: true, toast: "mock 저장 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-073 쿠폰 관리
- Route: `/message/coupon`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-073.list | GET | `/api/admin/message/coupon` | 쿠폰 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-073", rows, metrics, permissions, policyFlags }` |
| SCR-073.mock-저장 | PATCH | `/api/admin/message/coupon/actions/mock-저장` | 쿠폰 관리 - mock 저장 처리 | `{ ok: true, toast: "mock 저장 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-074 마일리지 관리
- Route: `/mileage`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-074.list | GET | `/api/admin/mileage` | 마일리지 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-074", rows, metrics, permissions, policyFlags }` |
| SCR-074.mock-저장 | PATCH | `/api/admin/mileage/actions/mock-저장` | 마일리지 관리 - mock 저장 처리 | `{ ok: true, toast: "mock 저장 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-075 전자 계약
- Route: `/contracts/new`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-075.list | GET | `/api/admin/contracts/new` | 전자 계약 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-075", rows, metrics, permissions, policyFlags }` |
| SCR-075.mock-저장 | PATCH | `/api/admin/contracts/new/actions/mock-저장` | 전자 계약 - mock 저장 처리 | `{ ok: true, toast: "mock 저장 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-076 캠페인 관리
- Route: `/marketing/campaign`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-076.list | GET | `/api/admin/marketing/campaign` | 캠페인 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-076", rows, metrics, permissions, policyFlags }` |
| SCR-076.캠페인-등록 | PATCH | `/api/admin/marketing/campaign/actions/캠페인-등록` | 캠페인 관리 - 캠페인 등록 처리 | `{ ok: true, toast: "캠페인 등록 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-076.캠페인-삭제-확인 | POST | `/api/admin/marketing/campaign/actions/캠페인-삭제-확인` | 캠페인 관리 - 캠페인 삭제 확인 처리 | `{ ok: true, toast: "캠페인 삭제 확인 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-078 SMS/카카오 대량 발송
- Route: `/marketing/sms`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-078.list | GET | `/api/admin/marketing/sms` | SMS/카카오 대량 발송 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-078", rows, metrics, permissions, policyFlags }` |
| SCR-078.mock-저장 | PATCH | `/api/admin/marketing/sms/actions/mock-저장` | SMS/카카오 대량 발송 - mock 저장 처리 | `{ ok: true, toast: "mock 저장 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-079 A/B 테스트
- Route: `/marketing/079`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-079.list | GET | `/api/admin/marketing/079` | A/B 테스트 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-079", rows, metrics, permissions, policyFlags }` |
| SCR-079.mock-저장 | PATCH | `/api/admin/marketing/079/actions/mock-저장` | A/B 테스트 - mock 저장 처리 | `{ ok: true, toast: "mock 저장 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-080 센터 설정
- Route: `/settings`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-080.list | GET | `/api/admin/settings` | 센터 설정 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-080", rows, metrics, permissions, policyFlags }` |
| SCR-080.미저장-경고 | PATCH | `/api/admin/settings/actions/미저장-경고` | 센터 설정 - 미저장 경고 처리 | `{ ok: true, toast: "미저장 경고 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-080.데이터-복원-확인 | PATCH | `/api/admin/settings/actions/데이터-복원-확인` | 센터 설정 - 데이터 복원 확인 처리 | `{ ok: true, toast: "데이터 복원 확인 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-080.백업-설정 | PATCH | `/api/admin/settings/actions/백업-설정` | 센터 설정 - 백업 설정 처리 | `{ ok: true, toast: "백업 설정 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-080A 지점 자동화 적용
- Route: `/settings/automation`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-080A.list | GET | `/api/admin/settings/automation` | 지점 자동화 적용 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-080A", rows, metrics, permissions, policyFlags }` |
| SCR-080A.정책-적용-확인 | PATCH | `/api/admin/settings/automation/actions/정책-적용-확인` | 지점 자동화 적용 - 정책 적용 확인 처리 | `{ ok: true, toast: "정책 적용 확인 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-081 권한 설정
- Route: `/settings/permissions`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-081.list | GET | `/api/admin/settings/permissions` | 권한 설정 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-081", rows, metrics, permissions, policyFlags }` |
| SCR-081.권한-초기화-확인 | POST | `/api/admin/settings/permissions/actions/권한-초기화-확인` | 권한 설정 - 권한 초기화 확인 처리 | `{ ok: true, toast: "권한 초기화 확인 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-081.권한-충돌-경고 | POST | `/api/admin/settings/permissions/actions/권한-충돌-경고` | 권한 설정 - 권한 충돌 경고 처리 | `{ ok: true, toast: "권한 충돌 경고 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-081.역할-생성 | PATCH | `/api/admin/settings/permissions/actions/역할-생성` | 권한 설정 - 역할 생성 처리 | `{ ok: true, toast: "역할 생성 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-081.역할-삭제-확인 | POST | `/api/admin/settings/permissions/actions/역할-삭제-확인` | 권한 설정 - 역할 삭제 확인 처리 | `{ ok: true, toast: "역할 삭제 확인 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-082 키오스크 설정
- Route: `/settings/082`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-082.list | GET | `/api/admin/settings/082` | 키오스크 설정 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-082", rows, metrics, permissions, policyFlags }` |
| SCR-082.mock-저장 | PATCH | `/api/admin/settings/082/actions/mock-저장` | 키오스크 설정 - mock 저장 처리 | `{ ok: true, toast: "mock 저장 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-082A 키오스크 IoT 설정
- Route: `/settings/082a`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-082A.list | GET | `/api/admin/settings/082a` | 키오스크 IoT 설정 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-082A", rows, metrics, permissions, policyFlags }` |
| SCR-082A.mock-저장 | PATCH | `/api/admin/settings/082a/actions/mock-저장` | 키오스크 IoT 설정 - mock 저장 처리 | `{ ok: true, toast: "mock 저장 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-083 IoT 출입 관리
- Route: `/settings/083`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-083.list | GET | `/api/admin/settings/083` | IoT 출입 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-083", rows, metrics, permissions, policyFlags }` |
| SCR-083.mock-저장 | PATCH | `/api/admin/settings/083/actions/mock-저장` | IoT 출입 관리 - mock 저장 처리 | `{ ok: true, toast: "mock 저장 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-084 구독 결제 관리
- Route: `/subscription`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-084.list | GET | `/api/admin/subscription` | 구독 결제 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-084", rows, metrics, permissions, policyFlags }` |
| SCR-084.플랜-변경-확인 | PATCH | `/api/admin/subscription/actions/플랜-변경-확인` | 구독 결제 관리 - 플랜 변경 확인 처리 | `{ ok: true, toast: "플랜 변경 확인 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-084.구독-해지-확인 | PATCH | `/api/admin/subscription/actions/구독-해지-확인` | 구독 결제 관리 - 구독 해지 확인 처리 | `{ ok: true, toast: "구독 해지 확인 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-086 출석 관리 설정
- Route: `/settings/attendance`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-086.list | GET | `/api/admin/settings/attendance` | 출석 관리 설정 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-086", rows, metrics, permissions, policyFlags }` |
| SCR-086.미저장-경고 | PATCH | `/api/admin/settings/attendance/actions/미저장-경고` | 출석 관리 설정 - 미저장 경고 처리 | `{ ok: true, toast: "미저장 경고 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-087 커스텀 역할 생성
- Route: `/settings/custom-role`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-087.list | GET | `/api/admin/settings/custom-role` | 커스텀 역할 생성 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-087", rows, metrics, permissions, policyFlags }` |
| SCR-087.역할-삭제-재배정 | POST | `/api/admin/settings/custom-role/actions/역할-삭제-재배정` | 커스텀 역할 생성 - 역할 삭제 재배정 처리 | `{ ok: true, toast: "역할 삭제 재배정 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-089 데이터 백업·복원
- Route: `/settings/089`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-089.list | GET | `/api/admin/settings/089` | 데이터 백업·복원 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-089", rows, metrics, permissions, policyFlags }` |
| SCR-089.mock-저장 | PATCH | `/api/admin/settings/089/actions/mock-저장` | 데이터 백업·복원 - mock 저장 처리 | `{ ok: true, toast: "mock 저장 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-092 지점 관리
- Route: `/branches`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-092.list | GET | `/api/admin/branches` | 지점 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-092", rows, metrics, permissions, policyFlags }` |
| SCR-092.신규-지점-등록 | PATCH | `/api/admin/branches/actions/신규-지점-등록` | 지점 관리 - 신규 지점 등록 처리 | `{ ok: true, toast: "신규 지점 등록 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-092.지점-비활성화-확인 | PATCH | `/api/admin/branches/actions/지점-비활성화-확인` | 지점 관리 - 지점 비활성화 확인 처리 | `{ ok: true, toast: "지점 비활성화 확인 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-093 지점 성과 리포트
- Route: `/branch-report`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-093.list | GET | `/api/admin/branch-report` | 지점 성과 리포트 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-093", rows, metrics, permissions, policyFlags }` |
| SCR-093.mock-저장 | PATCH | `/api/admin/branch-report/actions/mock-저장` | 지점 성과 리포트 - mock 저장 처리 | `{ ok: true, toast: "mock 저장 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-095 KPI 센터
- Route: `/kpi-preview`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-095.list | GET | `/api/admin/kpi-preview` | KPI 센터 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-095", rows, metrics, permissions, policyFlags }` |
| SCR-095.mock-저장 | PATCH | `/api/admin/kpi-preview/actions/mock-저장` | KPI 센터 - mock 저장 처리 | `{ ok: true, toast: "mock 저장 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-097 히스토리 로그
- Route: `/audit-log`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-097.list | GET | `/api/admin/audit-log` | 히스토리 로그 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-097", rows, metrics, permissions, policyFlags }` |
| SCR-097.mock-저장 | PATCH | `/api/admin/audit-log/actions/mock-저장` | 히스토리 로그 - mock 저장 처리 | `{ ok: true, toast: "mock 저장 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-098 오늘의 할 일
- Route: `/today-tasks`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-098.list | GET | `/api/admin/today-tasks` | 오늘의 할 일 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-098", rows, metrics, permissions, policyFlags }` |
| SCR-098.태스크-추가 | PATCH | `/api/admin/today-tasks/actions/태스크-추가` | 오늘의 할 일 - 태스크 추가 처리 | `{ ok: true, toast: "태스크 추가 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-098.태스크-상세-수정 | PATCH | `/api/admin/today-tasks/actions/태스크-상세-수정` | 오늘의 할 일 - 태스크 상세 수정 처리 | `{ ok: true, toast: "태스크 상세 수정 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-099 리포트 생성
- Route: `/reports`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-099.list | GET | `/api/admin/reports` | 리포트 생성 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-099", rows, metrics, permissions, policyFlags }` |
| SCR-099.mock-저장 | PATCH | `/api/admin/reports/actions/mock-저장` | 리포트 생성 - mock 저장 처리 | `{ ok: true, toast: "mock 저장 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-H1004 예측 분석
- Route: `/analytics/forecast`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-H1004.list | GET | `/api/admin/analytics/forecast` | 예측 분석 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-H1004", rows, metrics, permissions, policyFlags }` |
| SCR-H1004.mock-저장 | PATCH | `/api/admin/analytics/forecast/actions/mock-저장` | 예측 분석 - mock 저장 처리 | `{ ok: true, toast: "mock 저장 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-094 KPI 대시보드
- Route: `/kpi`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-094.list | GET | `/api/admin/kpi` | KPI 대시보드 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-094", rows, metrics, permissions, policyFlags }` |
| SCR-094.매출-목표-설정 | PATCH | `/api/admin/kpi/actions/매출-목표-설정` | KPI 대시보드 - 매출 목표 설정 처리 | `{ ok: true, toast: "매출 목표 설정 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-H1001 자동화 정책 라이브러리
- Route: `/hq/automation-policies`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-H1001.list | GET | `/api/admin/hq/automation-policies` | 자동화 정책 라이브러리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-H1001", rows, metrics, permissions, policyFlags }` |
| SCR-H1001.정책-세트-편집 | PATCH | `/api/admin/hq/automation-policies/actions/정책-세트-편집` | 자동화 정책 라이브러리 - 정책 세트 편집 처리 | `{ ok: true, toast: "정책 세트 편집 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-I001 통합 출석 관리
- Route: `/attendance`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-I001.list | GET | `/api/admin/attendance` | 통합 출석 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-I001", rows, metrics, permissions, policyFlags }` |
| SCR-I001.수동-출석-등록 | PATCH | `/api/admin/attendance/actions/수동-출석-등록` | 통합 출석 관리 - 수동 출석 등록 처리 | `{ ok: true, toast: "수동 출석 등록 mock 처리 완료", updatedRows?, nextState? }` |
| SCR-I001.옷-락커-배정 | PATCH | `/api/admin/attendance/actions/옷-락커-배정` | 통합 출석 관리 - 옷 락커 배정 처리 | `{ ok: true, toast: "옷 락커 배정 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-I004 옷 락커 운영 관리
- Route: `/integrated/i004`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-I004.list | GET | `/api/admin/integrated/i004` | 옷 락커 운영 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-I004", rows, metrics, permissions, policyFlags }` |
| SCR-I004.mock-저장 | PATCH | `/api/admin/integrated/i004/actions/mock-저장` | 옷 락커 운영 관리 - mock 저장 처리 | `{ ok: true, toast: "mock 저장 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-I005 고정 물품 락커 관리
- Route: `/integrated/i005`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-I005.list | GET | `/api/admin/integrated/i005` | 고정 물품 락커 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-I005", rows, metrics, permissions, policyFlags }` |
| SCR-I005.mock-저장 | PATCH | `/api/admin/integrated/i005/actions/mock-저장` | 고정 물품 락커 관리 - mock 저장 처리 | `{ ok: true, toast: "mock 저장 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-I006 체성분 통합 관리
- Route: `/body-composition-2`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-I006.list | GET | `/api/admin/body-composition-2` | 체성분 통합 관리 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-I006", rows, metrics, permissions, policyFlags }` |
| SCR-I006.체성분-수기-등록 | PATCH | `/api/admin/body-composition-2/actions/체성분-수기-등록` | 체성분 통합 관리 - 체성분 수기 등록 처리 | `{ ok: true, toast: "체성분 수기 등록 mock 처리 완료", updatedRows?, nextState? }` |

### SCR-I007 회원 건강 연동 요약
- Route: `/members/health`
- Handoff: template-ready
- Query Params: `기간`, `지점`, `상태`, `담당자`
- States: loading skeleton, empty state, filtered result, validation error, permission blocked, policy pending, mock success toast

| Key | Method | Endpoint | Purpose | Response |
|---|---|---|---|---|
| SCR-I007.list | GET | `/api/admin/members/health` | 회원 건강 연동 요약 목록/상세 화면 초기 데이터 조회 | `{ screenId: "SCR-I007", rows, metrics, permissions, policyFlags }` |
| SCR-I007.체성분-수기-등록 | PATCH | `/api/admin/members/health/actions/체성분-수기-등록` | 회원 건강 연동 요약 - 체성분 수기 등록 처리 | `{ ok: true, toast: "체성분 수기 등록 mock 처리 완료", updatedRows?, nextState? }` |


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
- Request: `{ dialogId: "DLG-C001", values: { 수업-선택, 일정-분류, 대상-유형, 시작-일시, 종료-일시, 강사-배정 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-C002 일정 상세
- Handoff: template-ready
- Endpoint: `/api/admin/classes/dialogs/c002`
- Request: `{ dialogId: "DLG-C002", values: { 수업명-및-유형-배지, 일시-정보, 강사명, 장소-룸, 예약-현황, 예약-회원-목록 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-C003 수업 등록/수정 (관리)
- Handoff: template-ready
- Endpoint: `/api/admin/classes/dialogs/c003`
- Request: `{ dialogId: "DLG-C003", values: { 수업-템플릿-선택, 수업명, 수업-유형, 강습-세션-유형, 일시, 강사-배정 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-C004 일괄 변경
- Handoff: template-ready
- Endpoint: `/api/admin/classes/dialogs/c004`
- Request: `{ dialogId: "DLG-C004", values: { 안내-메시지, 변경-범위-선택-라디오-버튼, 취소-버튼, 기본-표시, 입력-수정-중, 저장-처리-중 }, actorRole, sourceScreenId }`
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
- Request: `{ dialogId: "DLG-C007", values: { 노쇼-정책-섹션, 누적-노쇼-기준-추가-페널티, 저장-버튼, 기본-표시, 저장-중, 검증-오류 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-C008 일괄 생성 확인
- Handoff: template-ready
- Endpoint: `/api/admin/classes/dialogs/c008`
- Request: `{ dialogId: "DLG-C008", values: { 생성-요약-정보, 충돌-일정-경고, 제외-날짜-목록, 확인-버튼, 취소-버튼, 기본-표시 }, actorRole, sourceScreenId }`
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
- Request: `{ dialogId: "DLG-C011", values: { 세션-기본-정보, 운동-기록-목록, 강사-노트, 회원-컨디션-기록, 저장-버튼, 기본-표시 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-C012 횟수 조정
- Handoff: template-ready
- Endpoint: `/api/admin/classes/dialogs/c012`
- Request: `{ dialogId: "DLG-C012", values: { 회원-정보, 조정-유형-선택, 조정-횟수-입력, 조정-후-예상-잔여-횟수, 조정-사유, 확인-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-C013 차감 이력
- Handoff: template-ready
- Endpoint: `/api/admin/classes/dialogs/c013`
- Request: `{ dialogId: "DLG-C013", values: { 회원-정보, 이력-목록-테이블, 기간-필터, 닫기-버튼, 기본-표시, 입력-수정-중 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-C014 페널티 등록
- Handoff: template-ready
- Endpoint: `/api/admin/classes/dialogs/c014`
- Request: `{ dialogId: "DLG-C014", values: { 대상-회원-선택, 페널티-유형-선택, 관련-수업-선택, 페널티-내용, 적용-시작일, 사유-입력 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-C015 자동 페널티 정책
- Handoff: template-ready
- Endpoint: `/api/admin/classes/dialogs/c015`
- Request: `{ dialogId: "DLG-C015", values: { 자동-페널티-활성화-토글, 노쇼-자동-페널티-규칙, 자동-알림-설정, 저장-버튼, 정책-off, 정책-on }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-C016 대안 일정 제시
- Handoff: template-ready
- Endpoint: `/api/admin/classes/dialogs/c016`
- Request: `{ dialogId: "DLG-C016", values: { 원래-수업-정보, 대안-일정-목록, 직접-일정-입력, 안내-메시지-입력, 제안-발송-버튼, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P001-상품등록모달 상품 등록 모달
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p001-상품등록모달`
- Request: `{ dialogId: "DLG-P001-상품등록모달", values: { 영역, 헤더, 상품-구분, 기본-입력, 이용-조건, 요일-시간설정 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P002-전지점배포 전 지점 배포 확인
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p002-전지점배포`
- Request: `{ dialogId: "DLG-P002-전지점배포", values: { 기본-표시, 입력-수정-중, 저장-처리-중, 완료, 실패, 계정 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P003-작업취소확인 작업 취소 확인
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p003-작업취소확인`
- Request: `{ dialogId: "DLG-P003-작업취소확인", values: { 기본-표시, 입력-수정-중, 저장-처리-중, 완료, 실패, 계정 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P004-가격이력 가격 변경 이력
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p004-가격이력`
- Request: `{ dialogId: "DLG-P004-가격이력", values: { 기본-표시, 입력-수정-중, 저장-처리-중, 완료, 실패, 계정 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P005-상품삭제확인 상품 삭제 확인
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p005-상품삭제확인`
- Request: `{ dialogId: "DLG-P005-상품삭제확인", values: { 기본-표시, 입력-수정-중, 저장-처리-중, 완료, 실패, 계정 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P006-비활성화안내 상품 비활성화 안내
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p006-비활성화안내`
- Request: `{ dialogId: "DLG-P006-비활성화안내", values: { 기본-표시, 입력-수정-중, 저장-처리-중, 실패, 계정, owner-지점장-manager }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P007-할인규칙등록 할인 규칙 등록
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p007-할인규칙등록`
- Request: `{ dialogId: "DLG-P007-할인규칙등록", values: { 할인명, 할인-유형, 할인-값, 최소-계약-기간, 최대-할인금액, 활성-상태 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P008-상품가져오기 상품 정보 가져오기
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p008-상품가져오기`
- Request: `{ dialogId: "DLG-P008-상품가져오기", values: { 기본-표시, 입력-수정-중, 저장-처리-중, 실패, 계정, owner-지점장-manager }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P009-할인규칙수정 할인 규칙 수정
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p009-할인규칙수정`
- Request: `{ dialogId: "DLG-P009-할인규칙수정", values: { 할인명, 할인-유형, 할인-값, 최소-계약-기간, 최대-할인금액, 활성-상태 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P010-상품삭제최종확인 상품 삭제 최종 확인
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p010-상품삭제최종확인`
- Request: `{ dialogId: "DLG-P010-상품삭제최종확인", values: { 기본-표시, 입력-수정-중, 저장-처리-중, 실패, 계정, owner-지점장-manager }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P011-할인규칙삭제확인 할인 규칙 삭제 확인
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p011-할인규칙삭제확인`
- Request: `{ dialogId: "DLG-P011-할인규칙삭제확인", values: { 기본-표시, 입력-수정-중, 저장-처리-중, 실패, 계정, owner-지점장-manager }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P012-상품이미지업로드 상품 대표 이미지 업로드
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p012-상품이미지업로드`
- Request: `{ dialogId: "DLG-P012-상품이미지업로드", values: { 기본-표시, 입력-수정-중, 저장-처리-중, 실패, 계정, owner-지점장-manager }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P013-할인정책추가수정 복합 할인 정책 추가/수정
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p013-할인정책추가수정`
- Request: `{ dialogId: "DLG-P013-할인정책추가수정", values: { 정책명, 기본-할인-유형, 기본-할인-값, 추가-조건, 적용-기간, 활성-상태 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P014-가격이력조회 가격 이력 상세 조회
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p014-가격이력조회`
- Request: `{ dialogId: "DLG-P014-가격이력조회", values: { 컬럼, 변경-일시, 변경-전-가격, 변경-후-가격, 변경자, 기본-표시 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-P015-할인정책삭제확인 할인 정책 삭제 확인
- Handoff: template-ready
- Endpoint: `/api/admin/products/dialogs/p015-할인정책삭제확인`
- Request: `{ dialogId: "DLG-P015-할인정책삭제확인", values: { 기본-표시, 입력-수정-중, 저장-처리-중, 실패, 계정, owner-지점장-manager }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-050-001 락커 기록 조회
- Handoff: template-ready
- Endpoint: `/api/admin/facilities/dialogs/050-001`
- Request: `{ dialogId: "DLG-050-001", values: { 이력-테이블, 비밀번호-편집, 메모-편집, 저장-버튼, 이력-있음, 이력-없음 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-050-002 락커 이동
- Handoff: template-ready
- Endpoint: `/api/admin/facilities/dialogs/050-002`
- Request: `{ dialogId: "DLG-050-002", values: { 현재-락커-정보, 이동할-번호-입력, 확인-버튼, 번호-미입력, 이동-성공, 이동-실패 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-050-003 락커 회수 확인
- Handoff: template-ready
- Endpoint: `/api/admin/facilities/dialogs/050-003`
- Request: `{ dialogId: "DLG-050-003", values: { 안내-메시지, 회수-버튼, 회수-성공, 회수-실패, 계정, owner-지점장-manager }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-050-004 개별 배정
- Handoff: template-ready
- Endpoint: `/api/admin/facilities/dialogs/050-004`
- Request: `{ dialogId: "DLG-050-004", values: { 회원-검색-자동완성, 만료일-입력, 배정-버튼, 회원-미선택, 배정-성공, 배정-실패 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-050-005 고장 토글 확인
- Handoff: template-ready
- Endpoint: `/api/admin/facilities/dialogs/050-005`
- Request: `{ dialogId: "DLG-050-005", values: { 안내-메시지, 확인-버튼, 취소-버튼, 고장-처리-성공, 고장-해제-성공, 변경-실패 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-050-006 일괄 배정
- Handoff: template-ready
- Endpoint: `/api/admin/facilities/dialogs/050-006`
- Request: `{ dialogId: "DLG-050-006", values: { 선택된-락커-수-안내, 회원-검색-자동완성, 만료일-입력, n-개-락커-배정-버튼, 취소-버튼, 락커-미선택 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-050-007 일괄 해제 확인
- Handoff: template-ready
- Endpoint: `/api/admin/facilities/dialogs/050-007`
- Request: `{ dialogId: "DLG-050-007", values: { 안내-메시지, n-개-일괄-해제-버튼, 일괄-해제-성공, 일괄-해제-실패, 계정, owner-지점장-manager }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-060-001 직원 등록/수정 취소 확인
- Handoff: template-ready
- Endpoint: `/api/admin/staff/dialogs/060-001`
- Request: `{ dialogId: "DLG-060-001", values: { 제목, 안내-메시지, 계속-작성-버튼, 취소-확인-버튼, 기본-표시, 입력-수정-중 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-060-002 직원 삭제(퇴사 처리) 확인
- Handoff: template-ready
- Endpoint: `/api/admin/staff/dialogs/060-002`
- Request: `{ dialogId: "DLG-060-002", values: { 제목, 안내-메시지, 확인-텍스트-입력-필드, 퇴사-처리-버튼-위험, 취소-버튼, 기본-표시 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-061-001 직원 등록 폼 취소 확인
- Handoff: template-ready
- Endpoint: `/api/admin/staff/dialogs/061-001`
- Request: `{ dialogId: "DLG-061-001", values: { 제목, 안내-메시지, 계속-작성-버튼, 이동-확인-버튼, 기본-표시, 입력-수정-중 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-064-001 급여 상세 편집
- Handoff: template-ready
- Endpoint: `/api/admin/staff/dialogs/064-001`
- Request: `{ dialogId: "DLG-064-001", values: { 직원-정보-요약, 자동-계산-요약, 수당-항목-목록, 공제-항목-목록, 변경-사유-입력, 실지급액-미리보기 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-064-002 급여 확정 확인
- Handoff: template-ready
- Endpoint: `/api/admin/staff/dialogs/064-002`
- Request: `{ dialogId: "DLG-064-002", values: { 제목, 안내-메시지, 확정-대상-요약, 확정-버튼, 취소-버튼, 기본-표시 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-064-003 급여 정책 추가
- Handoff: template-ready
- Endpoint: `/api/admin/staff/dialogs/064-003`
- Request: `{ dialogId: "DLG-064-003", values: { 정책-분류-탭, 직군-선택-탭, 지급-방식-선택, 직급-입력, 기본급-입력, 수업단가-입력 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-070-001 리드 등록/수정
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/070-001`
- Request: `{ dialogId: "DLG-070-001", values: { 이름, 연락처, 문의-유형, 가입경로, 상담-방식, 상태 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-070-002 리드 삭제 확인
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/070-002`
- Request: `{ dialogId: "DLG-070-002", values: { 제목, 안내-메시지, 삭제-버튼-위험, 취소-버튼, 기본-표시, 입력-수정-중 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-071-001 수신자 검색
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/071-001`
- Request: `{ dialogId: "DLG-071-001", values: { 검색-입력-필드, 조건-필터, 담당자-필터, 검색-결과-목록, 체크박스-선택, 선택-수-요약 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-071-002 발송 미리보기
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/071-002`
- Request: `{ dialogId: "DLG-071-002", values: { 채널별-미리보기-탭, 발송-대상-요약, 제외-예정-건수, 메시지-본문-미리보기, 플랫폼-발송-정보, 발송-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-072-001 알림 규칙 편집
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/072-001`
- Request: `{ dialogId: "DLG-072-001", values: { 규칙명, 정책-유형, step-소유-구분, 발송-시점-설정, 플랫폼-연동-정보, 발송-시각 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-072-002 알림 트리거 추가
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/072-002`
- Request: `{ dialogId: "DLG-072-002", values: { 카테고리-그룹, 만료-정책-추가-모드, 트리거-목록, 지점-추가-step-입력, 검색창, 설명-패널 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-073-001 쿠폰 생성/수정
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/073-001`
- Request: `{ dialogId: "DLG-073-001", values: { 쿠폰명, 할인-유형, 할인-금액-율, 최소-구매-금액, 유효-기간, 발급-수량-제한 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-073-002 쿠폰 발급
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/073-002`
- Request: `{ dialogId: "DLG-073-002", values: { 발급-쿠폰-정보, 발급-대상-선택-방식, 회원-검색-필드, 선택-회원-목록, 발급-수량-확인, 발급-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-073-003 쿠폰 삭제 확인
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/073-003`
- Request: `{ dialogId: "DLG-073-003", values: { 제목, 쿠폰-요약, 삭제-가능-안내, 중단-전환-안내, 삭제-중단-버튼-위험, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-074-001 적립 규칙 편집
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/074-001`
- Request: `{ dialogId: "DLG-074-001", values: { 기본-적립률, 최소-적립-결제-금액, 특별-적립-조건, 마일리지-소멸-정책, 소멸-예정-알림-설정, 저장-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-074-002 수동 적립·차감
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/074-002`
- Request: `{ dialogId: "DLG-074-002", values: { 대상-회원-정보, 조정-유형-선택, 조정-금액, 조정-후-잔액-미리보기, 사유-입력, 확인-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-076-001 캠페인 등록
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/076-001`
- Request: `{ dialogId: "DLG-076-001", values: { 캠페인명, 캠페인-목표, 캠페인-기간, 사용-채널, 저장-버튼, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-076-002 캠페인 삭제 확인
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/076-002`
- Request: `{ dialogId: "DLG-076-002", values: { 제목, 안내-메시지, 삭제-버튼-위험, 취소-버튼, 기본-표시, 입력-수정-중 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-077-001 리퍼럴 이벤트 등록
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/077-001`
- Request: `{ dialogId: "DLG-077-001", values: { 이벤트명, 추천인-혜택, 피추천인-혜택, 혜택-지급-시점, 이벤트-기간, 종료-후-그레이스-기간 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-077-002 리퍼럴 이벤트 삭제 확인
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/077-002`
- Request: `{ dialogId: "DLG-077-002", values: { 제목, 안내-메시지, 삭제-버튼-위험, 기본-표시, 입력-수정-중, 저장-처리-중 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-078-001 발송 대상 선택
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/078-001`
- Request: `{ dialogId: "DLG-078-001", values: { 그룹-선택, 추가-조건-필터, 예상-수신자-수, 확인-버튼, 취소-버튼, 기본-표시 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-078-002 발송 확인
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/078-002`
- Request: `{ dialogId: "DLG-078-002", values: { 발송-요약, 플랫폼-연동-정보, 예상-비용, 발송-일시, 발송-확인-버튼, 취소-버튼 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-079-001 A/B 테스트 등록
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/079-001`
- Request: `{ dialogId: "DLG-079-001", values: { 대상-정보, 입력-확인-항목, 처리-사유, 확인 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-079-002 A/B 테스트 삭제 확인
- Handoff: template-ready
- Endpoint: `/api/admin/marketing/dialogs/079-002`
- Request: `{ dialogId: "DLG-079-002", values: { 대상-정보, 입력-확인-항목, 처리-사유, 확인 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-080-001 미저장 경고
- Handoff: template-ready
- Endpoint: `/api/admin/settings/dialogs/080-001`
- Request: `{ dialogId: "DLG-080-001", values: { 저장-후-이동-처리-중, 계정, owner-지점장, manager, trainer-fc-staff, readonly }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-080A-001 정책 적용 확인
- Handoff: template-ready
- Endpoint: `/api/admin/settings/dialogs/080a-001`
- Request: `{ dialogId: "DLG-080A-001", values: { 기본-표시, 입력-수정-중, 저장-처리-중, 완료, 실패, 계정 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-081-001 권한 초기화 확인
- Handoff: template-ready
- Endpoint: `/api/admin/settings/dialogs/081-001`
- Request: `{ dialogId: "DLG-081-001", values: { 표시, 처리-완료, 계정, owner-지점장-manager, trainer-fc-staff, readonly }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-081-002 권한 충돌 경고
- Handoff: template-ready
- Endpoint: `/api/admin/settings/dialogs/081-002`
- Request: `{ dialogId: "DLG-081-002", values: { 표시, 저장-처리-중, 계정, owner-지점장-manager, trainer-fc-staff, readonly }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-081-003 역할 생성
- Handoff: template-ready
- Endpoint: `/api/admin/settings/dialogs/081-003`
- Request: `{ dialogId: "DLG-081-003", values: { 기본, 입력-중, 이름-중복, 저장-완료, 계정, owner-지점장-manager }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-081-004 역할 삭제 확인
- Handoff: template-ready
- Endpoint: `/api/admin/settings/dialogs/081-004`
- Request: `{ dialogId: "DLG-081-004", values: { 직원-없음, 직원-있음, 삭제-처리-중, 삭제-완료, 계정, owner-지점장-manager }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-081-005 역할 복사
- Handoff: template-ready
- Endpoint: `/api/admin/settings/dialogs/081-005`
- Request: `{ dialogId: "DLG-081-005", values: { 기본, 입력-완료, 이름-중복, 생성-완료, 계정, owner-지점장-manager }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-081-006 역할 변경 영향 분석
- Handoff: template-ready
- Endpoint: `/api/admin/settings/dialogs/081-006`
- Request: `{ dialogId: "DLG-081-006", values: { 요약-헤더, 영향-범위-카드-2종, 영향-직원-목록-펼침, 변경-차이-요약, 확인-액션, 표시-항목 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-084-001 플랜 변경 확인
- Handoff: template-ready
- Endpoint: `/api/admin/settings/dialogs/084-001`
- Request: `{ dialogId: "DLG-084-001", values: { 표시, 처리-중, 변경-완료, 계정, owner-지점장-manager, trainer-fc-staff }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-084-002 구독 해지 확인
- Handoff: template-ready
- Endpoint: `/api/admin/settings/dialogs/084-002`
- Request: `{ dialogId: "DLG-084-002", values: { 표시, 처리-중, 해지-완료, 계정, owner-지점장-manager, trainer-fc-staff }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-087-001 역할 삭제 재배정
- Handoff: template-ready
- Endpoint: `/api/admin/settings/dialogs/087-001`
- Request: `{ dialogId: "DLG-087-001", values: { 표시, 역할-미선택, 처리-중, 완료, 계정, owner-지점장-manager }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-089-001 데이터 복원 확인
- Handoff: template-ready
- Endpoint: `/api/admin/settings/dialogs/089-001`
- Request: `{ dialogId: "DLG-089-001", values: { 표시, 텍스트-미입력, 텍스트-입력-완료, 복원-진행-중, 복원-완료, 계정 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-089-002 백업 설정
- Handoff: template-ready
- Endpoint: `/api/admin/settings/dialogs/089-002`
- Request: `{ dialogId: "DLG-089-002", values: { 표시, 비활성화, 저장-완료, 계정, superadmin, owner-지점장 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-092-001 신규 지점 등록
- Handoff: template-ready
- Endpoint: `/api/admin/hq/dialogs/092-001`
- Request: `{ dialogId: "DLG-092-001", values: { 기본, 코드-중복, 초기-owner-지점장-미지정, 정책-적용-실패, 등록-처리-중, 등록-완료 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-092-002 지점 비활성화 확인
- Handoff: template-ready
- Endpoint: `/api/admin/hq/dialogs/092-002`
- Request: `{ dialogId: "DLG-092-002", values: { 표시, 사유-미입력, 처리-중, 완료, 계정, superadmin-primary }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-094-001 매출 목표 설정
- Handoff: template-ready
- Endpoint: `/api/admin/hq/dialogs/094-001`
- Request: `{ dialogId: "DLG-094-001", values: { 기본, 미설정, 저장-처리-중, 계정, owner-지점장-manager, trainer-fc-staff }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-098-001 태스크 추가
- Handoff: template-ready
- Endpoint: `/api/admin/hq/dialogs/098-001`
- Request: `{ dialogId: "DLG-098-001", values: { 기본, 제목-미입력, 추가-완료, 계정, owner-지점장-manager, trainer-fc-staff }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-098-002 태스크 상세 수정
- Handoff: template-ready
- Endpoint: `/api/admin/hq/dialogs/098-002`
- Request: `{ dialogId: "DLG-098-002", values: { 기본, 변경-전, 변경-후, 저장-완료, 계정, owner-지점장-manager }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-H1001-001 정책 세트 편집
- Handoff: template-ready
- Endpoint: `/api/admin/hq/dialogs/h1001-001`
- Request: `{ dialogId: "DLG-H1001-001", values: { 필드, 정책-유형, 지점-추가-step-허용, 결제기한-만료-세부-설정, 기본-채널, 기준일 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-I003 체성분 수기 등록
- Handoff: template-ready
- Endpoint: `/api/admin/integrated/dialogs/i003`
- Request: `{ dialogId: "DLG-I003", values: { 회원-검색, 측정일시, 체중-kg, 골격근량-kg, 체지방량-kg, 체지방률 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-I001 수동 출석 등록
- Handoff: template-ready
- Endpoint: `/api/admin/integrated/dialogs/i001`
- Request: `{ dialogId: "DLG-I001", values: { 구분, 이름-또는-번호-검색, 출석-시각, 비고, 버튼, 등록 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

### DLG-I002 옷 락커 배정
- Handoff: template-ready
- Endpoint: `/api/admin/integrated/dialogs/i002`
- Request: `{ dialogId: "DLG-I002", values: { 회원명, 출석-시각, 이용권-상품명-유형, 고정-락커, 선택-가능, 사용-중 }, actorRole, sourceScreenId }`
- States: open, dirty, invalid, submitting, success toast, permission blocked, closed

