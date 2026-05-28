# V1 Publishing Delivery Criteria

Generated: 2026-05-28T12:26:18.154Z

## 퍼블리싱 정의
- 모든 버튼/탭/필터/모달/폼은 클릭 가능해야 한다.
- 실제 API/DB/결제/알림 발송은 제외하지만, 화면 안에서는 mock state, toast, validation, disabled reason, policy notice로 피드백을 제공해야 한다.
- 개발사는 본 산출물의 contract 문서를 기준으로 API와 비즈니스 로직을 연결한다.

## Done 기준
1. SCR/DLG 문서 커버리지 100%.
2. 화면별 route/query/table/form/action contract 존재.
3. 역할별 권한 차등과 blocked reason 존재.
4. 핵심 업무 플로우 E2E 통과.
5. policy/external integration pending 항목은 임의 구현하지 않고 명시.
