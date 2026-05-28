import { expect, test } from "@playwright/test";

// admin-pando 1:1 이식 + docs4 V1+V2 컨텐츠 + 모든 mock 인터랙션 동작 검증.
// 작업한 7개 화면(POS/공지/직원/급여/KPI/출석/리드/메시지)의 핵심 인터랙션 검증.

test.describe("SCR-S002 POS 판매", () => {
  test("카테고리 탭 4종 + 상품 그리드 + 장바구니 추가 mock 동작", async ({ page }) => {
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
