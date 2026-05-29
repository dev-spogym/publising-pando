# Publishing Test Coverage Matrix

본 문서는 `v1-publishing` 산출물을 "개발사가 이 화면을 보고 구현 방향을 명확히 이해할 수 있는 퍼블리싱/mock prototype" 기준으로 검수하는 테스트 매트릭스입니다. 실제 API/DB/결제/알림/외부 연동 구현 검증은 범위 밖이며, 이 저장소에서는 mock contract와 화면 동작만 검증합니다.

## 범위/레벨별

| 분류 | 우리 산출물 적용 | 명령/파일 |
|---|---|---|
| Unit Test | contract helper, 권한/상태 추론, mock contract 생성 단위 검증 | `npm run test:unit`, `tests/unit/contracts.unit.test.ts` |
| Integration Test | registry ↔ route ↔ DLG ↔ contract 연결 검증 | `npm run test:integration`, `tests/integration/registry.integration.test.ts` |
| E2E Test | 실제 브라우저에서 로그인, 라우팅, 화면, DLG, side panel, 전체 route 흐름 검증 | `npm run test:e2e`, `tests/e2e/*.spec.ts` |
| Component Test | DLG 컴포넌트 갤러리/런타임 DLG/지원 사이드바를 실제 렌더링 상태에서 검증 | `tests/e2e/prototype.spec.ts`, `tests/e2e/accessibility.spec.ts` |
| Contract Test | API를 호출하지 않는 mock contract, 문서/화면 계약, 금지 문구 검증 | `npm run test:contract`, `npm run verify:handoff` |
| System Test | 정적 export build + 118개 화면 + 156개 DLG + visual audit 전체 조합 검증 | `npm run build`, `npm run test:e2e`, `npm run visual:audit` |

## UI 동작/회귀별

| 분류 | 우리 산출물 적용 | 명령/파일 |
|---|---|---|
| Interaction Test | 클릭, 입력, 탭 전환, 필터, 패널, DLG, dirty close, 권한 차단 | `tests/e2e/*flow*.spec.ts`, `product-management.spec.ts`, `admin-pando-screens.spec.ts` |
| Smoke Test | 로그인, 기본 route, 문서/계약 drawer 빠른 확인 | `npm run test:smoke` |
| Sanity Test | 회원상세/상품관리 대표 기능 좁은 확인 | `npm run test:smoke` |
| Regression Test | 중복 route, sales stats hydration, 이전 수정사항 재발 방지 | `tests/e2e/smoke-sanity-regression.spec.ts` |
| Visual Regression Test | 승인된 대표 화면 스크린샷 baseline 비교 | `npm run test:visual-regression` |
| Snapshot Test | 118 screen / 156 DLG manifest snapshot 비교 | `npm run test:snapshot` |
| Accessibility Test | main landmark, keyboard focus, Escape close, dialog role | `npm run test:accessibility` |
| Cross-browser Test | Chromium/Firefox/WebKit 대표 route smoke | `npm run test:cross-browser` |
| Responsive Test | mobile/tablet/desktop에서 clipped interactive element 방지 | `npm run test:responsive` |

## 실행 묶음

```bash
npm run verify:coverage
npm run verify:handoff
npm run test:unit
npm run test:integration
npm run test:contract
npm run test:snapshot
npm run typecheck
npm run lint
npm run build
npm run test:e2e
npm run test:cross-browser
npm run visual:audit
```

최근 검증 결과 기준: coverage 118 screens / 156 dialogs / route 오류 0, E2E 81 passed + 8 documented skips, cross-browser 12 passed, visual audit issues 0.
