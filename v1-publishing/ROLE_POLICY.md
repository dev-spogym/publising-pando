# V1 Role Policy

Generated: 2026-05-29T00:28:27.566Z

## Roles
| Role | Label | Scope | Permissions |
|---|---|---|---|
| HQ_ADMIN | 본사 관리자 | 전 지점 | viewAllBranches, taxInvoice, targetManage |
| OWNER | 지점장 / Owner | 선택 지점 | memberWrite, dangerMember, transfer, bodyWrite, salesWrite, refundApprove, installment, taxInvoice, targetManage |
| MANAGER | 매니저 | 선택 지점 | memberWrite, bodyWrite, salesWrite, installment |
| FC | FC | 담당 회원 | memberWrite, salesWrite |
| TRAINER | 트레이너 | 담당 회원 | bodyWrite |
| STAFF | 일반 직원 | 선택 지점 | salesWrite |

## Action Matrix
| Screen | Action | Permission | Allowed Roles | Audit | Blocked Reason |
|---|---|---|---|---|---|
| SCR-100 | 로그인 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-104 | 전체 읽음 처리 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-104 | 세션 만료 테스트 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-M001 | 회원 등록 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-M001 | 상태 변경 | memberWrite | OWNER, MANAGER, FC | N | memberWrite 권한 필요 |
| SCR-M001 | 수동 출석 | memberWrite | OWNER, MANAGER, FC | N | memberWrite 권한 필요 |
| SCR-M001 | 지점 이관 | transfer | OWNER | Y | transfer 권한 필요 |
| SCR-M002 | 전화번호 중복 확인 | memberWrite | OWNER, MANAGER, FC | N | memberWrite 권한 필요 |
| SCR-M002 | 주소 검색 | memberWrite | OWNER, MANAGER, FC | N | memberWrite 권한 필요 |
| SCR-M002 | 초기화 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-M002 | 취소 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-M003 | 저장 | memberWrite | OWNER, MANAGER, FC | N | memberWrite 권한 필요 |
| SCR-M003 | 전화번호 중복 확인 | memberWrite | OWNER, MANAGER, FC | N | memberWrite 권한 필요 |
| SCR-M003 | 주소 검색 | memberWrite | OWNER, MANAGER, FC | N | memberWrite 권한 필요 |
| SCR-M003 | 초기화 | memberWrite | OWNER, MANAGER, FC | N | memberWrite 권한 필요 |
| SCR-M003 | 취소(이탈 확인) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-M004 | 상태 변경 | memberWrite | OWNER, MANAGER, FC | N | memberWrite 권한 필요 |
| SCR-M004 | 홀딩 등록 | memberWrite | OWNER, MANAGER, FC | N | memberWrite 권한 필요 |
| SCR-M004 | 메모 추가 | memberWrite | OWNER, MANAGER, FC | N | memberWrite 권한 필요 |
| SCR-M004 | 회원 삭제 | dangerMember | OWNER | Y | dangerMember 권한 필요 |
| SCR-M005 | 이관 확인 | transfer | OWNER | Y | transfer 권한 필요 |
| SCR-M005 | 예외 상품 정책 점검 | transfer | OWNER | N | transfer 권한 필요 |
| SCR-M006 | 측정 추가 | bodyWrite | OWNER, MANAGER, TRAINER | N | bodyWrite 권한 필요 |
| SCR-M006 | 목표 설정 | bodyWrite | OWNER, MANAGER, TRAINER | N | bodyWrite 권한 필요 |
| SCR-M006 | 동일 일자 덮어쓰기 | bodyWrite | OWNER, MANAGER, TRAINER | N | bodyWrite 권한 필요 |
| SCR-M006 | CSV 내보내기 | bodyWrite | OWNER, MANAGER, TRAINER | N | bodyWrite 권한 필요 |
| SCR-M007 | 회원 병합 확인 | dangerMember | OWNER | Y | dangerMember 권한 필요 |
| SCR-M008 | 새 그룹 만들기 | memberWrite | OWNER, MANAGER, FC | N | memberWrite 권한 필요 |
| SCR-M008 | 가족 연결(구성원 추가) | memberWrite | OWNER, MANAGER, FC | N | memberWrite 권한 필요 |
| SCR-M008 | 구성원 제거 | memberWrite | OWNER, MANAGER, FC | N | memberWrite 권한 필요 |
| SCR-M008 | 그룹 삭제 | memberWrite | OWNER, MANAGER, FC | Y | memberWrite 권한 필요 |
| SCR-M009 | 등급 변경 | memberWrite | OWNER, MANAGER, FC | N | memberWrite 권한 필요 |
| SCR-M010 | 새 세그먼트 만들기 | memberWrite | OWNER, MANAGER, FC | N | memberWrite 권한 필요 |
| SCR-M010 | 미리보기(샘플 명단) | memberWrite | OWNER, MANAGER, FC | N | memberWrite 권한 필요 |
| SCR-M010 | 메시지 발송 액션 연결 | memberWrite | OWNER, MANAGER, FC | N | memberWrite 권한 필요 |
| SCR-M010 | 쿠폰 발급 액션 연결 | memberWrite | OWNER, MANAGER, FC | N | memberWrite 권한 필요 |
| SCR-M010 | 운영 메모 | memberWrite | OWNER, MANAGER, FC | N | memberWrite 권한 필요 |
| SCR-S001 | 매출 상세 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-S001 | 메모 편집 | salesWrite | OWNER, MANAGER, FC, STAFF | N | salesWrite 권한 필요 |
| SCR-S001 | 목표 설정 | targetManage | HQ_ADMIN, OWNER | N | targetManage 권한 필요 |
| SCR-S002 | 구매자 검색 | salesWrite | OWNER, MANAGER, FC, STAFF | N | salesWrite 권한 필요 |
| SCR-S002 | 결제 확인 | salesWrite | OWNER, MANAGER, FC, STAFF | N | salesWrite 권한 필요 |
| SCR-S002 | 중복 결제 경고 | salesWrite | OWNER, MANAGER, FC, STAFF | N | salesWrite 권한 필요 |
| SCR-S003 | 구매자 검색 | salesWrite | OWNER, MANAGER, FC, STAFF | N | salesWrite 권한 필요 |
| SCR-S003 | 결제 확인 | salesWrite | OWNER, MANAGER, FC, STAFF | N | salesWrite 권한 필요 |
| SCR-S003 | 할부 등록 | installment | OWNER, MANAGER | N | installment 권한 필요 |
| SCR-S004 | 기간 조회 | salesWrite | OWNER, MANAGER, FC, STAFF | N | salesWrite 권한 필요 |
| SCR-S004 | 전월 대비 토글 | salesWrite | OWNER, MANAGER, FC, STAFF | N | salesWrite 권한 필요 |
| SCR-S004 | 목표 매출 설정 | targetManage | HQ_ADMIN, OWNER | N | targetManage 권한 필요 |
| SCR-S005 | 목표 기준 설정 | targetManage | HQ_ADMIN, OWNER | N | targetManage 권한 필요 |
| SCR-S006 | 원 매출 상세 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-S006 | 기간 필터 변경 | salesWrite | OWNER, MANAGER, FC, STAFF | N | salesWrite 권한 필요 |
| SCR-S007 | 환불 요청 | salesWrite | OWNER, MANAGER, FC, STAFF | Y | salesWrite 권한 필요 |
| SCR-S007 | 환불 처리 | refundApprove | OWNER | Y | refundApprove 권한 필요 |
| SCR-S007 | 환불 상세 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-S007 | 엑셀 내보내기 | salesWrite | OWNER, MANAGER, FC, STAFF | N | salesWrite 권한 필요 |
| SCR-S008 | 납입 처리 | installment | OWNER, MANAGER | N | installment 권한 필요 |
| SCR-S008 | 메모 편집 | salesWrite | OWNER, MANAGER, FC, STAFF | N | salesWrite 권한 필요 |
| SCR-S008 | 엑셀 내보내기 | salesWrite | OWNER, MANAGER, FC, STAFF | N | salesWrite 권한 필요 |
| SCR-S009 | 할부 상세 (회차별 펼침) | installment | OWNER, MANAGER | N | installment 권한 필요 |
| SCR-S009 | 납입 처리 | installment | OWNER, MANAGER | N | installment 권한 필요 |
| SCR-S009 | + 할부 등록 | installment | OWNER, MANAGER | N | installment 권한 필요 |
| SCR-S009 | 엑셀 내보내기 | salesWrite | OWNER, MANAGER, FC, STAFF | N | salesWrite 권한 필요 |
| SCR-S010 | 세금계산서 상세 | taxInvoice | HQ_ADMIN, OWNER | N | taxInvoice 권한 필요 |
| SCR-S010 | 세금계산서 발행 | taxInvoice | HQ_ADMIN, OWNER | N | taxInvoice 권한 필요 |
| SCR-S010 | 이메일 전송 / 재발행 | taxInvoice | HQ_ADMIN, OWNER | N | taxInvoice 권한 필요 |
| SCR-S010 | 엑셀 내보내기 | taxInvoice | HQ_ADMIN, OWNER | N | taxInvoice 권한 필요 |
| SCR-S011 | 목표 매출 설정 | targetManage | HQ_ADMIN, OWNER | N | targetManage 권한 필요 |
| SCR-S012 | 환불 요청 (승인대기 저장) | salesWrite | OWNER, MANAGER, FC, STAFF | Y | salesWrite 권한 필요 |
| SCR-S012 | 환불 처리 (Owner 완료) | refundApprove | OWNER | Y | refundApprove 권한 필요 |
| SCR-S012 | 처리 결과 보기 | refundApprove | OWNER | N | refundApprove 권한 필요 |
| SCR-S012 | 전체 취소 / 부분 환불 선택 | salesWrite | OWNER, MANAGER, FC, STAFF | Y | salesWrite 권한 필요 |
| SCR-C001 | 수업 등록 (DLG-C001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C001 | 일정 상세 (DLG-C002) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C001 | 일괄 변경 (DLG-C004) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C001 | 세션 상세 (DLG-C011) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C001 | 미승인 일정 일괄 승인 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-C002 | 수업 등록 (DLG-C003) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C002 | 수업 기록 상세 (DLG-C005) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C002 | 서명 (DLG-C006) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C002 | 수업 취소 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-C003 | 미리보기 갱신 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C003 | 일괄 생성 확인 (DLG-C008) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C003 | 전체 취소(30분 이내) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-C004 | + 템플릿 등록 (DLG-C009) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C004 | 템플릿 수정 (DLG-C009) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C004 | 활성/비활성 토글 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C004 | 템플릿 삭제(사용 중 아닐 때만) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-C005 | 정원 조정 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C005 | 수업 취소 진입 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-C005 | 수업 행 클릭 → 예약 회원 목록(드로어) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C006 | 강사 상세 (DLG-C010) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C006 | 급여 정산 자료(SCR-064 연계) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C007 | 횟수 조정 (DLG-C012) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C007 | 차감 이력 (DLG-C013) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C008 | 페널티 등록 (DLG-C014) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C008 | 자동 페널티 정책 (DLG-C015) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C008 | 노쇼 정책 (DLG-C007) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C008 | 페널티 수동 해제 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C009 | 수락 (수업 자동 변경/취소) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C009 | 거절 (사유 입력) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C009 | 대안 일정 제시 (DLG-C016) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C010 | + 프로그램 등록 (드로어 또는 폼) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C010 | 동작 순서 드래그&드롭 변경 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C010 | 회원 배정 (수동 선택) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C010 | 프로그램 삭제(배정 회원 안내 후) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-C010 | 세션 상세 (DLG-C011) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C011 | 출석 처리 (출석/결석/노쇼) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C011 | 서명 요청 (DLG-C006) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C011 | 수업 기록 상세 (DLG-C005) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C012 | 수동 배정 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C012 | 대기 취소 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C012 | 알림 발송 (자리 발생 안내) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C012 | 자동 배정 정책 (D10 SCR-H1001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C013 | 후기 전문 보기(행 클릭) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C013 | 응답률 캠페인 발송 (Owner+) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C013 | 후기 자동 숨김(신고 N건+) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C014 | 출석 처리 (출석/결석/노쇼/완료) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C014 | 서명 요청 Push 발송 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C014 | 노쇼 정정(자동 페널티 해제) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C014 | 입/출입 기록 참고 영역 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C015 | 파일 업로드 (드래그&드롭, 최대 5GB) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C015 | 공유 설정 (회원·기간) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C015 | 수업 기록 상세 (DLG-C005) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C015 | 파일 삭제(공유 중 회원 안내 후) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-C015 | 미리보기 / 다운로드 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C016 | 회원 상세 보기 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C016 | 수업 상세 보기 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C016 | 예약 취소 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-C016 | 출석 처리 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C016 | 노쇼 처리 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C016 | 엑셀(10,000행 이내) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P001 | + 상품 등록 (DLG-P001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P001 | 전 지점 배포 (DLG-P002) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P001 | 가격 변경 이력 (DLG-P004) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P001 | 이미지 업로드 (DLG-P012) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P002 | 등록 | memberWrite | OWNER, MANAGER, FC | N | memberWrite 권한 필요 |
| SCR-P002 | 취소 (DLG-P003) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P002 | 상품 가져오기 (DLG-P008) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P002 | 이미지 업로드 (DLG-P012) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P003 | 저장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P003 | 삭제 (판매 이력 0 → DLG-P005 / 판매 이력 있음 → DLG-P006) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-P003 | 비활성화 (DLG-P006) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P003 | 가격 이력 전체 보기 (DLG-P014) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P003 | 취소 (변경값 있을 시 DLG-P003) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P004 | + 할인 등록 (DLG-P007) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P004 | 할인 수정 (DLG-P009) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P004 | 복합 정책 추가/수정 (DLG-P013) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P004 | 할인 삭제 (DLG-P011/P015) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-P005 | 카탈로그 미리보기 (DLG-P016) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P005 | 옵션 설정 (DLG-P017) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P005 | 내용 편집 (DLG-P018) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P005 | 인쇄 (브라우저 인쇄 다이얼로그) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P005 | 공유 (페이지 링크 복사 + QR) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P006 | 상품 선택 (드롭다운/검색) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P006 | 상품 교체(열 상단 X) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P006 | 결제 점프 (회원 선택 + SCR-S003) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P006 | 공유 (24시간 만료 URL + QR) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P006 | 특정 상품 삭제 (DLG-P010) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-P007 | 입고 처리 (DLG-P019) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P007 | 출고 처리 (DLG-P020) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P007 | 재고 조정 (DLG-P021) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P007 | 입출고 이력 (DLG-P022) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P008 | + 시즌 특가 등록 (DLG-P023) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P008 | 시즌 특가 수정 (DLG-P023, 진행 중 기간·금액 변경 불가) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P008 | 시즌 특가 삭제(진행 중은 정상가 즉시 복구) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-P008 | 달력 뷰 전환 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-050 | 개별 배정 (DLG-050-004) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-050 | 일괄 배정 (DLG-050-006) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-050 | 락커 이동 (DLG-050-002) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-050 | 락커 회수 (DLG-050-003) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-050 | 고장 토글 (DLG-050-005) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-050 | 만료 임박 일괄 해제 (DLG-050-007) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-050 | 락커 기록 조회 (DLG-050-001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-051 | 배정하기 (회원 + 사물함 선택 시 활성) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-051 | 만료 사물함 일괄 해제 (시간 초과 0건이면 비활성) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-051 | 락커 추가 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-051 | 엑셀 다운로드(30,000행 이내) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-052 | 신규 등록 (DLG-052-001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-052 | 이력 조회 (DLG-052-002) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-052 | 분실 처리 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-052 | 삭제 (DLG-052-003) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-053 | 새 운동룸 등록 (DLG-053-001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-053 | 룸 수정 (DLG-053-001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-053 | 룸 삭제 (DLG-053-002) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-053 | 운영 상태 전환 (⚙: 운영중→점검중→고장 순환) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-054 | 이용 시작 (회원 입력 → 타이머 시작) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-054 | 이용 종료 (대기열 자동 배정) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-054 | 타석 이동 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-054 | 점검 처리 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-054 | 프로젝터 ON/OFF (IoT) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-054 | 예약 상세 모달(삭제/취소/결석/완료) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-054 | 대기열 알림 발송 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-055 | 품목 등록 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-055 | 입고 처리 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-055 | 출고 처리(사유 필수) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-055 | 재고 조정(사유 필수) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-055 | 엑셀 다운로드(30,000행 이내) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-056 | 장비 등록 (DLG-056-001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-056 | 점검 등록 (DLG-056-002) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-056 | 수리 접수 (DLG-056-003) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-056 | 엑셀 다운로드(30,000행 이내) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-057 | 소모품 등록 (DLG-057-001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-057 | 입출고 처리 (DLG-057-002) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-057 | 발주 생성 (DLG-057-003) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-057 | 엑셀 다운로드(30,000행 이내) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-058 | 청소 스케줄 등록 (DLG-058-001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-058 | 완료 체크 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-058 | 이력 조회 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-059 | 탭 전환(운동룸/골프 타석/기타) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-059 | 상태 변경(운영중→점검중→고장→미사용) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-059 | 예약 현황 확인 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-059 | 자산 삭제는 FAC-04/FAC-05 원 도메인에서 처리 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-060 | + 직원 등록 → SCR-061 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-060 | 직원 정보 수정 (manager+) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-060 | 메시지 전송 (manager+) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-060 | 재직↔휴직 상태 변경 (manager+) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-060 | 퇴사 처리 (Owner+, DLG-060-002) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-061 | 저장 (유효성 검사 + 직원 + 로그인 계정 함께 저장) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-061 | 취소 (DLG-061-001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-062 | 처리 완료 (DLG-060-002, 텍스트 `퇴사처리` 일치 시) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-062 | 취소 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-062 | 당일/과거 → 즉시 계정 비활성·로그인 종료 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-062 | 미래 퇴사 → 예약 상태, 확정일 도래 시 자동 비활성 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-062 | 퇴사 취소 (24시간 이내, Owner+ 권한) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-063 | 수동 보정(시각 수정 또는 누락 추가, 변경 사유 필수) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-063 | 월별 집계 요약(급여 산정 자료) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-063 | 엑셀 다운로드(대용량 백그라운드 잡) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-064 | 수당·공제 편집 (DLG-064-001, 당월 미확정만) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-064 | 급여 확정 (DLG-064-002, 개별 또는 일괄) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-064 | 확정 취소 (당월 내, Owner+) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-064 | 급여 정책 추가/수정 (DLG-064-003) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-064 | 엑셀 다운로드(노무사 양식 옵션) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-065 | 개별 발송 (이메일 + 앱 푸시) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-065 | 일괄 발송 (체크박스 선택) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-065 | 재발송 (발송완료 명세서, 이력 추가) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-065 | PDF 저장 (yyyymm_직원명_급여명세서.pdf) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-065 | 인쇄 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-070 | + 리드 등록 (DLG-070-001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-070 | 리드 수정 (DLG-070-001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-070 | 회원 등록/결제 진행 (SCR-M002 연계) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-070 | 리드 삭제 (DLG-070-002) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-070 | 뷰 전환 (목록↔칸반) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-071 | 수신자 검색 (DLG-071-001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-071 | 미리보기 (DLG-071-002) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-071 | 즉시 발송 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-071 | 예약 발송(5분 전 취소 가능) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-072 | 알림 규칙 편집 (DLG-072-001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-072 | 알림 트리거 추가 (DLG-072-002) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-072 | 지점 step 추가(회원 이용권/락커 만료만) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-072 | 전체 자동 알림 ON/OFF (Owner+) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-072A | FC 후속 액션 연결 (실패·미응답) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-072A | 발송 이력 상세 (MKT-01 통합 이력) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-072A | 엑셀 다운로드 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-073 | + 쿠폰 생성 (DLG-073-001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-073 | 쿠폰 발급 (DLG-073-002) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-073 | 쿠폰 수정 (DLG-073-001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-073 | 쿠폰 삭제/중단 (DLG-073-003) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-074 | 적립 규칙 설정 (DLG-074-001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-074 | 수동 적립·차감 (DLG-074-002) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-074 | 이력 조회(날짜/구분/금액/사유/처리자) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-074 | 소멸 예정 알림 발송(D-30) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-075 | 계약 작성 (유형·대상·내용 입력) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-075 | 전자 서명 패널 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-075 | 원격 서명 링크 전송 (SMS/카톡, 7일 유효) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-075 | 계약서 재발송 (1일 5회 한도) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-075 | 계약 해지 (해지 사유 + 원본 보존) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-076 | + 캠페인 생성 (DLG-076-001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-076 | 캠페인 수정 (진행 전만) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-076 | 실적 추적 패널(ROI) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-076 | 캠페인 삭제 (DLG-076-002, 진행 중은 즉시 종료) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-077 | + 이벤트 등록 (DLG-077-001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-077 | 프로그램 편집 (보상·조건·활성) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-077 | 추천인/피추천인 이력 조회 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-077 | 이벤트 삭제 (DLG-077-002) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-078 | 발송 대상 선택 (DLG-078-001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-078 | 발송 확인 (DLG-078-002) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-078 | 메시지 템플릿 선택·편집 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-078 | 즉시 발송 / 예약 발송 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-079 | V1 메뉴 미노출 안내 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-079 | V2 후속 문서 위치 안내(docs4/V2/D08-마케팅:305) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-080 | 저장 (변경 사항 있을 때만 활성) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-080 | 주소 검색 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-080 | 탭 이동 시 미저장 경고 (DLG-080-001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-080A | 정책 적용 확인 (DLG-080A-001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-080A | 지점 step 추가 (회원 이용권·락커 만료만, Owner+) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-080A | 자동 회수 정책 ON/OFF (Owner+) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-080A | [변경 요약 보기] | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-080A | [24시간 내 롤백] (Owner+) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-081 | 초기화 (DLG-081-001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-081 | 변경 사항 저장 (영향 분석 후 DLG-081-006) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-081 | 충돌 경고 (DLG-081-002) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-081 | + 역할 생성 (DLG-081-003) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-081 | 역할 복사 (DLG-081-005) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-081 | 역할 삭제 (DLG-081-004) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-081 | 전체 허용 / 전체 거부 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-082 | 저장 (연결 키오스크에 즉시 push) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-082 | 미저장 경고 (DLG-080-001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-082A | 기기 설정 저장 (연결 기기 다음 동기화 시점 적용) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-082A | 출입 규칙 설정 (허용 시간·중복 방지·만료 회원·직원 출석) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-083 | 새 기기 등록 (4종 중 선택 + 기기 코드 + 위치) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-083 | 재연결 시도 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-083 | 출입 수단 활성/비활성 토글 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-083 | 중복 출입 방지 시간·이력 보관 기간 설정 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-083 | 출입 알림 설정 (입장/퇴장/비정상) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-084 | 플랜 변경 (DLG-084-001, 업그레이드/다운그레이드) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-084 | 구독 해지 (DLG-084-002) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-084 | 결제 수단 변경 (PG 연동) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-084 | 청구 이력·영수증 PDF 다운로드 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-085 | + 공지 등록 (DLG-085-001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-085 | 공지 수정 (DLG-085-001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-085 | 공지 삭제 (DLG-085-002) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-085 | 공지 상세 미리보기(우측 패널) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-086 | 저장 (출석 정책 신규 출퇴근 기록부터 적용) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-086 | 미저장 경고 (DLG-080-001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-086 | IoT 미연결 안내 (SCR-083 링크) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-087 | + 새 역할 만들기 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-087 | 기존 역할에서 권한 복사 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-087 | 권한 매트릭스 구성 (SCR-081과 동일 구조) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-087 | 역할 삭제 (배정 직원 ≥1명 → DLG-087-001 재배정) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-088 | 저장 (관리자 화면 언어 변경 시 페이지 리로드) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-088 | 키오스크 언어 동기화 (WebSocket/폴링) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-088 | 미저장 경고 (DLG-080-001) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-088 | 키오스크 미리보기 렌더링 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-089 | 지금 백업 실행 (수동) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-089 | 백업 설정 (DLG-089-002, 주기·시각·보관 기간) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-089 | 데이터 복원 (DLG-089-001, 사유 필수) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-089 | 복원은 superAdmin / Owner는 승인 요청 발송 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-090 | 수동 새로고침 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-090 | 전체보기 (감사 로그) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-091 | 신규 대시보드로 이동 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-096 | 이탈위험 회원 보기 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-H1002 | 위젯 추가 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-H1002 | 레이아웃 저장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-H1002 | 기본값으로 초기화 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-H1002 | PNG/PDF 내보내기 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-H1003 | 분석 실행 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-H1003 | PDF 다운로드 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-H1005 | 설문 발송 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-H1005 | 엑셀 다운로드 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-H1005 | PDF 내보내기 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-092 | 신규 지점 등록 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-092 | 비활성화 / 운영 상태 변경 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-093 | 엑셀 다운로드 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-093 | PDF 다운로드 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-094 | 매출 목표 설정 | targetManage | HQ_ADMIN, OWNER | N | targetManage 권한 필요 |
| SCR-095 | Today Tasks 이동 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-095 | 매출 / 회원 / 알림 바로가기 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-097 | 엑셀 다운로드 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-098 | 할 일 추가 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-098 | 상세 수정 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-099 | 리포트 생성 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-099 | 엑셀 다운로드 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-099 | PDF 다운로드 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-H1001 | 정책 세트 생성 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-H1001 | 배포 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-H1001 | 시뮬레이션 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-H1001 | PDF 내보내기 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-H1001 | 중지 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-H1004 | 예측 실행 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-H1004 | 재학습 요청 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-H1004 | PDF 내보내기 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-I001 | 수동 출석 등록 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-I001 | 락커 배정 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-I001 | 실패 로그 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-I001 | 최근 이벤트 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-I004 | 회원 배정 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-I004 | 회수 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-I004 | 고장 처리 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-I004 | 복구 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-I004 | 일괄 해제 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-I004 | 엑셀 다운로드 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-I005 | 배정하기 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-I005 | 연장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-I005 | 회수 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-I005 | 상태 동기화 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-I005 | 엑셀 다운로드 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-I006 | 수기 등록 | bodyWrite | OWNER, MANAGER, TRAINER | N | bodyWrite 권한 필요 |
| SCR-I006 | 수신 로그 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-I006 | 확정 처리 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-I006 | 회원 직접 매칭 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-I006 | 무시 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-I007 | 수기 등록 | bodyWrite | OWNER, MANAGER, TRAINER | N | bodyWrite 권한 필요 |
| SCR-I007 | 상담 메모 바로가기 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
