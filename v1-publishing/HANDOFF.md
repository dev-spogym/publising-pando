# V1 Publishing Handoff

Generated: 2026-05-29T11:37:46.632Z

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
- `app/data/registry.ts`: D01~D03 핵심 수작업 화면/권한/모달 데이터.
- `app/data/v1-extra.ts`: D04~D11 및 잔여 V1 화면/모달 데이터.
- `app/data/contracts.ts`: 퍼블리싱 mock API/form/action/state contract 생성.
- `components/prototype-app.tsx`: 현재 퍼블리싱 shell + mock interaction.
- `scripts/verify-coverage.ts`: docs4/V1 SCR/DLG 커버리지 검증.
- `scripts/verify-handoff.ts`: 납품 contract/doc 검증.

## 퍼블리싱 계약 범위
1. UI 이벤트는 `actionId` 기준으로 식별 가능하게 유지하되, 실제 서버 호출은 구현하지 않는다.
2. `policy-pending`, `external-integration-pending`은 임의 구현하지 말고 퍼블리싱 안내/상태로만 표시한다.
3. 권한 차단은 버튼 제거보다 disabled reason 또는 권한 안내를 우선한다.
4. 퍼블리싱 mock toast/local state/dialog 피드백까지만 제공한다.
