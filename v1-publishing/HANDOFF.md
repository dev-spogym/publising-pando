# V1+V2 Publishing Handoff

Generated: 2026-05-29

## 실행

```bash
npm install
npm run dev
# or
npm run build && npm run preview
```

## 검증

```bash
npm run verify:coverage
npm run verify:handoff
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

## 구조
- `app/data/registry.ts`: D01~D03 핵심 수작업 화면/권한/모달 데이터 + 도메인 합산 export (screens/dialogs/menuGroups/routeToScreen 등).
- `app/data/domains/d04.ts ~ d11.ts`: 도메인별 V1+V2 화면/다이얼로그 데이터 (v1-extra.ts에서 도메인 단위로 분할 + V2 신규 보강).
- `app/data/docs4-sources.ts`: V1+V2 출처 마스터 레지스트리 (publishingScreens, publishingDialogs, dialogBlueprints, screenIdToPublishingKey).
- `app/data/contracts.ts`: 개발 연결용 API/form/action/state contract 생성.
- `app/lib/publishing-review-store.ts`: 검수 모드 토글 상태 (useSyncExternalStore + localStorage 패턴).
- `components/prototype-app.tsx`: 현재 퍼블리싱 shell + mock interaction.
- `components/publishing/*`: SourceBadge / PublishingFrame / PublishingReviewToggle / SourceTracePanel / DialogShell / DialogPolicyBanner / DialogRegistry.
- `scripts/verify-coverage.ts`: docs4/V1+V2 SCR/DLG 커버리지 검증.
- `scripts/verify-handoff.ts`: 납품 contract/doc 검증.

## V1/V2 출처 표시 시각 체계

- **PageHeader / DeliveryHeader**: 모든 화면에 항상 `[V1|V2|V1+V2]` 배지가 docs 경로와 함께 표시됨.
- **검수 모드**: Topbar 우측의 돋보기 아이콘 클릭으로 ON/OFF. localStorage 키 `pando-publishing-review-mode`에 영구 저장.
- **검수 모드 ON 시**: 컴포넌트 외곽에 dashed sky border + 좌상단 source label chip이 표시됨.
- **색상**: V1=info(파랑), V2=secondary(보라/회색), V1+V2=success(초록).
- **상태 chip**: policy-pending=amber, external-pending=rose, formula-unset=orange outline, mock-only=slate outline.

## docs4 우선 헌법

1. docs4 V1+V2가 **유일한 기획 기준**. 화면 존재, 컬럼, 필드, 액션 모두 docs4가 정함.
2. admin-pando는 **시각/UX 부품 창고**로만 활용. 컬럼/필드는 베끼지 않음.
3. docs4에 없는 화면은 자체 미생성. 컬럼이 다르면 docs4 우선.
4. V1+V2 합집합으로 화면을 정의하고, 출처 표기로 V1/V2/V1+V2를 구분한다.

## 개발 연결 규칙
1. UI 이벤트는 `actionId` 기준으로 backend mutation에 연결한다.
2. `policy-pending`, `external-integration-pending`은 임의 구현하지 말고 정책 확정 후 API contract를 갱신한다.
3. 권한 차단은 버튼 제거보다 disabled reason 또는 권한 안내를 우선한다.
4. 퍼블리싱 mock toast는 실제 mutation success/error toast로 치환한다.
5. V2 신규 SCR/DLG는 docs4 V2 문서 경로를 source 필드에서 직접 확인하여 컬럼/탭/필드를 1:1 매핑한다.
