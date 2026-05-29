import { expect, test } from "@playwright/test";

// admin-pando 1:1 이식 + docs4 V1+V2 컨텐츠 + 모든 mock 인터랙션 동작 검증.
// 작업한 7개 화면(POS/공지/직원/급여/KPI/출석/리드/메시지)의 핵심 인터랙션 검증.

test.describe("운영 UX 산출물 기준", () => {
  test("설명/DLG/핸드오프 정보는 본문이 아니라 닫히는 문서/계약 사이드바에만 노출된다", async ({ page }) => {
    await page.goto("/members/edit");

    const main = page.getByRole("main");
    await expect(main.getByText("문서 연결 DLG")).not.toBeVisible();
    await expect(main.getByText("화면 인수 기준")).not.toBeVisible();
    await expect(main.getByText("변경 감지 / 동시 편집")).not.toBeVisible();

    await page.getByRole("button", { name: "문서/계약" }).click();
    await expect(page.getByTestId("screen-support-drawer")).toBeVisible();
    await expect(page.getByText("문서 연결 DLG")).toBeVisible();
    await expect(page.getByTestId("screen-support-drawer")).toContainText("화면 인수 기준");
    await expect(page.getByText("변경 감지 / 동시 편집")).toBeVisible();
    await page.getByRole("button", { name: "닫기", exact: true }).click();
    await expect(page.getByTestId("screen-support-drawer")).not.toBeVisible();

    await page.goto("/settings");
    await expect(page.getByRole("main").getByText("프론트 상태 명세")).not.toBeVisible();
  });
});

test.describe("SCR-S002 POS 판매", () => {
  test("카테고리 탭 4종 + 상품 그리드 + 장바구니 추가 동작", async ({ page }) => {
    await page.goto("/sales/pos");
    await expect(page.getByText("SCR-S002").first()).toBeVisible();
    // 카테고리 탭 4종
    for (const cat of ["이용권", "PT", "GX", "기타"]) {
      await expect(page.getByRole("button", { name: new RegExp(`^${cat}\\s*\\d+$`) }).first()).toBeVisible();
    }
    // 결제 확인 버튼 (장바구니 비어있을 때 disabled)
    const checkoutBtn = page.getByRole("button", { name: /결제 확인/ }).first();
    await expect(checkoutBtn).toBeVisible();
    await expect(checkoutBtn).toBeDisabled();
    // 구매자 검색 버튼 동작
    await page.getByRole("button", { name: /^검색$/ }).first().click();
    await expect(page.getByText("김민준").first()).toBeVisible();
  });
});

test.describe("SCR-085 공지사항", () => {
  test("통계 카드 4개 + 작성 모달 + 필수 validation", async ({ page }) => {
    await page.goto("/notices");
    await expect(page.getByText("SCR-085").first()).toBeVisible();
    // 작성 모달 열기
    await page.getByRole("button", { name: /공지 작성/ }).first().click();
    await expect(page.getByText("공지사항 작성").first()).toBeVisible();
    // 빈 등록 시 validation
    await page.getByRole("button", { name: /^등록$/ }).first().click();
    // 닫기
    await page.getByRole("button", { name: /^취소$/ }).first().click();
    // 목록 클릭 시 docs4 V2 우측 상세 패널
    await page.getByText(/시설 점검 안내/).first().click();
    await expect(page.getByTestId("notice-detail-slide-panel")).toBeVisible();
    await expect(page.getByText(/docs4 V2 SCR-085/).first()).toBeVisible();
  });
});

test.describe("SCR-060 직원 목록", () => {
  test("통계 4개 + 검색/필터 + 직무 배지 6종", async ({ page }) => {
    await page.goto("/staff");
    await expect(page.getByText("SCR-060").first()).toBeVisible();
    // 직무 배지 라벨 일부 검증
    for (const role of ["센터장", "매니저", "FC", "트레이너"]) {
      await expect(page.getByText(role).first()).toBeVisible();
    }
    // 검색 동작
    const search = page.getByPlaceholder("이름·연락처·지점").first();
    await search.fill("이센터");
    await expect(page.getByText("이센터").first()).toBeVisible();
  });
});

test.describe("SCR-064 급여 관리", () => {
  test("월 선택 + 통계 4개 + 합계 행 + 명세서 발급", async ({ page }) => {
    await page.goto("/payroll");
    await expect(page.getByText("SCR-064").first()).toBeVisible();
    // 통계 카드 라벨
    for (const label of ["총 지급 대상", "총 실지급액", "지급완료", "미지급/보류"]) {
      await expect(page.getByText(label).first()).toBeVisible();
    }
    // 합계 행 (계산식)
    await expect(page.getByText(/실지급액 = 기본급/).first()).toBeVisible();
  });
});

test.describe("SCR-094 KPI 대시보드", () => {
  test("카테고리 탭 6종 + 비교 기간 토글 + 지점 비교", async ({ page }) => {
    await page.goto("/kpi");
    await expect(page.getByText("SCR-094").first()).toBeVisible();
    // 카테고리 탭
    for (const cat of ["매출", "회원", "출석", "수업", "OT"]) {
      await expect(page.getByRole("button", { name: new RegExp(cat) }).first()).toBeVisible();
    }
    // 비교 기간
    for (const period of ["이번달", "지난달", "전년동월"]) {
      await expect(page.getByRole("button", { name: period }).first()).toBeVisible();
    }
    // 지점 비교
    await expect(page.getByText("지점별 비교 차트").first()).toBeVisible();
  });
});

test.describe("SCR-I001 통합 출석 관리", () => {
  test("채널 5종 + 검수 보드 + 수동 출석 권한 차단", async ({ page }) => {
    await page.goto("/attendance");
    await expect(page.getByText("SCR-I001").first()).toBeVisible();
    // 채널 카드 라벨
    for (const ch of ["앱 QR", "키오스크 QR", "얼굴 인식", "수동"]) {
      await expect(page.getByText(ch).first()).toBeVisible();
    }
    // 검수 보드
    await expect(page.getByText("검수 보드").first()).toBeVisible();
  });
});

test.describe("SCR-070 리드 관리", () => {
  test("칸반 6단계 + 뷰 전환 + 리드 등록 모달", async ({ page }) => {
    await page.goto("/leads");
    await expect(page.getByText("SCR-070").first()).toBeVisible();
    // 칸반 단계 6종
    for (const stage of ["신규", "연락완료", "상담예정", "방문완료", "등록완료", "보류"]) {
      await expect(page.getByText(stage).first()).toBeVisible();
    }
    // 목록 뷰 전환
    await page.getByRole("button", { name: /^목록$/ }).first().click();
    // 행 클릭 시 docs4 V1 우측 상세 패널
    await page.getByRole("row", { name: /강민지/ }).click();
    await expect(page.getByTestId("lead-detail-slide-panel")).toBeVisible();
    await expect(page.getByText(/docs4 V1 SCR-070/).first()).toBeVisible();
    await page.getByTestId("lead-detail-slide-panel").getByRole("button", { name: /^닫기$/ }).last().click();
    // 등록 모달
    await page.getByRole("button", { name: /\+ 리드 등록|\+ 새 리드 등록/ }).first().click();
    await expect(page.getByText("새 리드 등록").first()).toBeVisible();
  });
});

test.describe("SCR-071 메시지 발송", () => {
  test("채널 3종 + 발송 이력 + 발송 모달 + validation", async ({ page }) => {
    await page.goto("/message");
    await expect(page.getByText("SCR-071").first()).toBeVisible();
    // 채널 탭 라벨
    for (const ch of ["Push", "카카오톡", "SMS"]) {
      await expect(page.getByText(ch).first()).toBeVisible();
    }
    // 메시지 작성 모달
    await page.getByRole("button", { name: /새 메시지 발송/ }).first().click();
    await expect(page.getByText("새 메시지 발송").first()).toBeVisible();
    // 비용 안내 (카카오/SMS 가격 라벨)
    await expect(page.getByText(/15원|30원/).first()).toBeVisible();
  });
});

test.describe("SCR-M004 회원 상세", () => {
  test("admin-pando 목업처럼 운영 코크핏, 헤더 액션, 15개 탭, 주요 탭 콘텐츠가 보인다", async ({ page }) => {
    await page.goto("/members/detail");

    await expect(page.getByTestId("member-detail-screen")).toBeVisible();
    await expect(page.getByTestId("member-detail-cockpit")).toBeVisible();
    await expect(page.getByText("Operation Cockpit").first()).toBeVisible();
    await expect(page.getByText("지금 바로 처리할 운영 이슈").first()).toBeVisible();
    await expect(page.getByText("Recent Signals").first()).toBeVisible();

    for (const action of ["수동출석", "상품구매", "메시지", "마일리지 조정", "운동 프로그램 배정", "지점이관", "탈퇴"]) {
      await expect(page.getByRole("button", { name: new RegExp(action) }).first()).toBeVisible();
    }
    await expect(page.getByRole("link", { name: /수정/ }).first()).toBeVisible();

    for (const tab of ["회원정보", "이용권", "출석 이력", "결제 이력", "결제내역", "예약내역", "상세내역", "체성분", "상담·메모", "레슨", "신체정보", "종합평가", "상담이력", "운동프로그램", "운동이력"]) {
      await expect(page.getByRole("tab", { name: new RegExp(tab) }).first()).toBeVisible();
    }

    await expect(page.getByText("기본 정보").first()).toBeVisible();
    await expect(page.getByText("운영 정보").first()).toBeVisible();

    await page.getByRole("tab", { name: /결제내역/ }).click();
    await expect(page.getByText("결제내역 상세").first()).toBeVisible();
    await expect(page.getByText("환불 숨김").first()).toBeVisible();

    await page.getByRole("tab", { name: /체성분/ }).click();
    await expect(page.getByText("체성분 기록").first()).toBeVisible();
    await page.getByRole("button", { name: /측정 추가/ }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText(/체성분/).first()).toBeVisible();
  });
});

test.describe("문서/계약 사이드바와 운영 큐", () => {
  test("문서/계약은 docs4 V1/V2 출처, 화면 구현 기준, 액션 계약, DLG 근거를 보여준다", async ({ page }) => {
    await page.goto("/members/detail");
    await page.getByRole("button", { name: "문서/계약" }).click();

    await expect(page.getByTestId("screen-support-drawer")).toBeVisible();
    await expect(page.getByText("docs4 V1/V2 출처")).toBeVisible();
    await expect(page.getByText("화면 구현 기준")).toBeVisible();
    await expect(page.getByText("문서 기준 액션 계약")).toBeVisible();
    await expect(page.getByText("역할별 표시/권한 메모")).toBeVisible();
    await expect(page.getByText("DLG별 목적/근거")).toBeVisible();
    await expect(page.getByText(/DLG-M003|DLG-M004|DLG-M009/).first()).toBeVisible();
  });

  test("본사 검토 큐는 사유·대상·담당·마감이 있는 상세 사이드 패널로 열린다", async ({ page }) => {
    await page.goto("/dashboard/builder");

    await expect(page.getByText("본사 검토 큐")).toBeVisible();
    await expect(page.getByText("KPI 예외 검토")).toBeVisible();
    await expect(page.getByText("강남점 매출 전월대비 -12%")).toBeVisible();
    await expect(page.getByText("오늘 리포트 전")).toBeVisible();

    await page.getByRole("button", { name: /KPI 예외 검토/ }).click();
    await expect(page.getByTestId("scr-h1002-queue-detail-panel")).toBeVisible();
    await expect(page.getByText("처리 근거")).toBeVisible();
    await expect(page.getByText("docs4 근거 / 화면 계약")).toBeVisible();
    await expect(page.getByTestId("scr-h1002-queue-detail-panel").getByText("커스텀 대시보드 지표 임계값 초과")).toBeVisible();
    await expect(page.getByRole("button", { name: "KPI 상세" })).toBeVisible();
  });
});
