# V1 Role Policy

Generated: 2026-05-28T14:16:33.025Z

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
| SCR-M003 | 취소 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-M004 | 상태 변경 | memberWrite | OWNER, MANAGER, FC | N | memberWrite 권한 필요 |
| SCR-M004 | 홀딩 등록 | memberWrite | OWNER, MANAGER, FC | N | memberWrite 권한 필요 |
| SCR-M004 | 메모 추가 | memberWrite | OWNER, MANAGER, FC | N | memberWrite 권한 필요 |
| SCR-M004 | 회원 삭제 | dangerMember | OWNER | Y | dangerMember 권한 필요 |
| SCR-M005 | 이관 확인 | transfer | OWNER | Y | transfer 권한 필요 |
| SCR-M006 | 측정 추가 | bodyWrite | OWNER, MANAGER, TRAINER | N | bodyWrite 권한 필요 |
| SCR-M006 | 목표 설정 | bodyWrite | OWNER, MANAGER, TRAINER | N | bodyWrite 권한 필요 |
| SCR-M006 | 덮어쓰기 테스트 | bodyWrite | OWNER, MANAGER, TRAINER | N | bodyWrite 권한 필요 |
| SCR-M007 | 회원 병합 확인 | dangerMember | OWNER | Y | dangerMember 권한 필요 |
| SCR-M008 | 가족 연결 | memberWrite | OWNER, MANAGER, FC | N | memberWrite 권한 필요 |
| SCR-M009 | 등급 변경 | memberWrite | OWNER, MANAGER, FC | N | memberWrite 권한 필요 |
| SCR-M010 | 메모/액션 기록 | memberWrite | OWNER, MANAGER, FC | N | memberWrite 권한 필요 |
| SCR-S001 | 매출 상세 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-S001 | 메모 편집 | salesWrite | OWNER, MANAGER, FC, STAFF | N | salesWrite 권한 필요 |
| SCR-S001 | 목표 설정 | targetManage | HQ_ADMIN, OWNER | N | targetManage 권한 필요 |
| SCR-S002 | 구매자 검색 | salesWrite | OWNER, MANAGER, FC, STAFF | N | salesWrite 권한 필요 |
| SCR-S002 | 결제 확인 | salesWrite | OWNER, MANAGER, FC, STAFF | N | salesWrite 권한 필요 |
| SCR-S002 | 중복 결제 경고 | salesWrite | OWNER, MANAGER, FC, STAFF | N | salesWrite 권한 필요 |
| SCR-S003 | 구매자 검색 | salesWrite | OWNER, MANAGER, FC, STAFF | N | salesWrite 권한 필요 |
| SCR-S003 | 결제 확인 | salesWrite | OWNER, MANAGER, FC, STAFF | N | salesWrite 권한 필요 |
| SCR-S003 | 할부 등록 | installment | OWNER, MANAGER | N | installment 권한 필요 |
| SCR-S004 | 목표 매출 설정 | targetManage | HQ_ADMIN, OWNER | N | targetManage 권한 필요 |
| SCR-S005 | 목표 기준 설정 | targetManage | HQ_ADMIN, OWNER | N | targetManage 권한 필요 |
| SCR-S006 | 원 매출 상세 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-S007 | 환불 요청 | salesWrite | OWNER, MANAGER, FC, STAFF | Y | salesWrite 권한 필요 |
| SCR-S007 | 환불 처리 | refundApprove | OWNER | Y | refundApprove 권한 필요 |
| SCR-S007 | 환불 상세 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-S008 | 납입 처리 | installment | OWNER, MANAGER | N | installment 권한 필요 |
| SCR-S008 | 메모 편집 | salesWrite | OWNER, MANAGER, FC, STAFF | N | salesWrite 권한 필요 |
| SCR-S009 | 할부 상세 | installment | OWNER, MANAGER | N | installment 권한 필요 |
| SCR-S009 | 납입 처리 | installment | OWNER, MANAGER | N | installment 권한 필요 |
| SCR-S009 | 할부 등록 | installment | OWNER, MANAGER | N | installment 권한 필요 |
| SCR-S010 | 세금계산서 상세 | taxInvoice | HQ_ADMIN, OWNER | N | taxInvoice 권한 필요 |
| SCR-S010 | 세금계산서 발행 | taxInvoice | HQ_ADMIN, OWNER | N | taxInvoice 권한 필요 |
| SCR-S011 | 목표 매출 설정 | targetManage | HQ_ADMIN, OWNER | N | targetManage 권한 필요 |
| SCR-S012 | 환불 요청 | salesWrite | OWNER, MANAGER, FC, STAFF | Y | salesWrite 권한 필요 |
| SCR-S012 | 환불 처리 | refundApprove | OWNER | Y | refundApprove 권한 필요 |
| SCR-S012 | 결과 보기 | refundApprove | OWNER | N | refundApprove 권한 필요 |
| SCR-C001 | 수업 등록/수정 (캘린더) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C001 | 일정 상세 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C001 | 일괄 변경 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C001 | 세션 상세 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C002 | 수업 등록/수정 (관리) | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C002 | 수업 기록 상세 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C002 | 서명 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C003 | 일괄 생성 확인 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C004 | 템플릿 등록/수정 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C004 | DLG-C009에서 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C005 | mock 저장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C006 | 강사 상세 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C006 | DLG-C010에서 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C007 | 횟수 조정 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C007 | 차감 이력 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C008 | 페널티 등록 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C008 | 자동 페널티 정책 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C008 | 노쇼 정책 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C009 | 대안 일정 제시 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C011 | 수업 기록 상세 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C011 | 서명 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C011 | DLG-C006에서 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C013 | mock 저장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C014 | mock 저장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-C016 | mock 저장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P001 | 상품 등록 모달 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P001 | 전 지점 배포 확인 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P001 | 작업 취소 확인 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P001 | 가격 변경 이력 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P002 | mock 저장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P003 | DLG-P003 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P003 | DLG-P005 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P003 | DLG-P006 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P003 | DLG-P014 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-P004 | mock 저장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-050 | 락커 기록 조회 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-050 | 락커 이동 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-050 | 락커 회수 확인 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-050 | 개별 배정 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-060 | 직원 등록/수정 취소 확인 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-060 | 직원 삭제(퇴사 처리) 확인 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-061 | 직원 등록 폼 취소 확인 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-062 | 직원 삭제(퇴사 처리) 확인 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-063 | mock 저장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-064 | 급여 상세 편집 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-064 | 급여 확정 확인 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-064 | 급여 정책 추가 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-065 | mock 저장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-070 | 리드 등록/수정 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-070 | 리드 삭제 확인 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-070 | 알림 규칙 편집 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-070 | 쿠폰 생성/수정 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-071 | 수신자 검색 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-071 | 발송 미리보기 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-072 | 알림 트리거 추가 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-072A | mock 저장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-073 | mock 저장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-074 | mock 저장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-075 | mock 저장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-076 | 캠페인 등록 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-076 | 캠페인 삭제 확인 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-078 | mock 저장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-079 | mock 저장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-080 | 미저장 경고 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-080 | 데이터 복원 확인 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-080 | 백업 설정 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-080A | 정책 적용 확인 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-081 | 권한 초기화 확인 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-081 | 권한 충돌 경고 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-081 | 역할 생성 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-081 | 역할 삭제 확인 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-082 | mock 저장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-082A | mock 저장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-083 | mock 저장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-084 | 플랜 변경 확인 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-084 | 구독 해지 확인 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-086 | 미저장 경고 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-087 | 역할 삭제 재배정 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | Y | 모든 역할 실행 가능 |
| SCR-089 | mock 저장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-092 | 신규 지점 등록 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-092 | 지점 비활성화 확인 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-093 | mock 저장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-095 | mock 저장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-097 | mock 저장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-098 | 태스크 추가 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-098 | 태스크 상세 수정 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-099 | mock 저장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-H1004 | mock 저장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-094 | 매출 목표 설정 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-H1001 | 정책 세트 편집 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-I001 | 수동 출석 등록 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-I001 | 옷 락커 배정 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-I004 | mock 저장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-I005 | mock 저장 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-I006 | 체성분 수기 등록 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
| SCR-I007 | 체성분 수기 등록 | none | HQ_ADMIN, OWNER, MANAGER, FC, TRAINER, STAFF | N | 모든 역할 실행 가능 |
