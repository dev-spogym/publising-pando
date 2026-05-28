# V1+V2 Publishing Delivery Criteria

Generated: 2026-05-29

## 퍼블리싱 정의
- docs4 V1+V2 합집합을 기획 기준으로 한다.
- 모든 버튼/탭/필터/모달/폼은 클릭 가능해야 한다.
- 실제 API/DB/결제/알림 발송은 제외하지만, 화면 안에서는 mock state, toast, validation, disabled reason, policy notice로 피드백을 제공해야 한다.
- 개발사는 본 산출물의 contract 문서를 기준으로 API와 비즈니스 로직을 연결한다.

## V1/V2 출처 표시 기준
- 모든 화면 헤더에 `[V1|V2|V1+V2]` 배지 표시.
- 검수 모드 ON 시 컴포넌트별 dashed border + 좌상단 source label chip.
- V1=info(파랑), V2=secondary(보라/회색), V1+V2=success(초록).
- 정책/외부연동 보류 화면은 amber/rose status chip을 우상단에 추가 표시.

## Done 기준
1. docs4 V1+V2 SCR/DLG 합집합 커버리지 100%.
2. 화면별 route/query/table/form/action contract 존재.
3. 역할별 권한 차등과 blocked reason 존재.
4. 핵심 업무 플로우 E2E 통과.
5. policy/external-integration pending 항목은 임의 구현하지 않고 명시.
6. V2 신규 25 SCR + 24 DLG 모두 등록 및 라우트 200/308 응답.
7. 검수 모드 토글 + localStorage 영속화 동작.
