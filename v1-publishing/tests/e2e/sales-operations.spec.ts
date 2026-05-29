import { expect, test, type Locator, type Page } from "@playwright/test";

const salesRouteContracts = [
  { id: "SCR-S001", route: "/sales", title: "매출 현황" },
  { id: "SCR-S002", route: "/sales/pos", title: "POS 판매" },
  { id: "SCR-S003", route: "/sales/payment", title: "결제 처리" },
  { id: "SCR-S004", route: "/sales/stats", title: "매출 통계" },
  { id: "SCR-S005", route: "/sales/statistics-admin", title: "통계 관리" },
  { id: "SCR-S006", route: "/sales/deferred-revenue", title: "선수익금 조회" },
  { id: "SCR-S007", route: "/sales/refunds", title: "환불 관리" },
  { id: "SCR-S008", route: "/sales/receivables", title: "미수금 관리" },
  { id: "SCR-S009", route: "/sales/installments", title: "할부결제 관리" },
  { id: "SCR-S010", route: "/sales/tax-invoice", title: "세금계산서 발행" },
  { id: "SCR-S011", route: "/sales/forecast", title: "매출 예측" },
  {
    id: "SCR-S012",
    route: "/sales/refund-partial",
    title: "결제 취소 / 부분 환불",
  },
] as const;

async function setOwnerContext(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem("pando-role", "OWNER");
    window.localStorage.setItem("pando-branch", "강남점");
  });
}

async function openSalesRoute(page: Page, route: string, screenId: string) {
  await page.goto(route);
  await expect(page).toHaveURL(
    new RegExp(`${route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/?$`),
  );
  await expect(page.getByText(screenId, { exact: true }).first()).toBeVisible();
}

function dialogTrigger(page: Page, dialogId: string): Locator {
  return page.locator(`[data-dialog-id="${dialogId}"]`).first();
}

async function openRuntimeDialog(page: Page, dialogId: string) {
  await dialogTrigger(page, dialogId).click();
  const dialog = page.getByTestId("runtime-dialog");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByText(dialogId, { exact: true }).first(),
  ).toBeVisible();
  return dialog;
}

test.describe("D03 매출관리 SCR-S001~S012 라우트 계약", () => {
  test.beforeEach(async ({ page }) => {
    await setOwnerContext(page);
  });

  for (const contract of salesRouteContracts) {
    test(`${contract.id} ${contract.title} 라우트는 계약 ID와 mock-only 라우트를 노출한다`, async ({
      page,
    }) => {
      await openSalesRoute(page, contract.route, contract.id);
      await expect(page.getByText(contract.title).first()).toBeVisible();
      await expect(page.locator("body")).toContainText(
        `${contract.route} · mock only`,
      );
      await expect(page.getByText("D03").first()).toBeVisible();
    });
  }
});

test.describe("D03 POS 장바구니/결제 DLG", () => {
  test.beforeEach(async ({ page }) => {
    await setOwnerContext(page);
    await openSalesRoute(page, "/sales/pos", "SCR-S002");
  });

  test("상품을 장바구니에 추가하면 금액 local state가 갱신된다", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /회원권 3개월/ }).click();
    await expect(page.getByText("장바구니 (1)")).toBeVisible();
    await expect(page.getByText("450,000원").first()).toBeVisible();
    await expect(page.getByText("최종 결제금액")).toBeVisible();
  });

  test("구매자 검색 DLG-S002는 구매자 선택 요구와 비회원 진행 요구를 runtime-dialog로 검증한다", async ({
    page,
  }) => {
    const dialog = await openRuntimeDialog(page, "DLG-S002");
    await expect(dialog.getByText("구매자 검색").first()).toBeVisible();
    await expect(dialog.getByText(/검색 결과/).first()).toBeVisible();
    await expect(
      dialog.getByRole("button", { name: "비회원으로 진행" }),
    ).toBeVisible();
    await expect(
      dialog.getByRole("button", { name: "구매자 선택" }),
    ).toBeVisible();
  });

  test("결제 확인 DLG-S003은 장바구니 결제 요약과 확정 액션을 runtime-dialog로 검증한다", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /PT/ }).first().click();
    await page.getByRole("button", { name: /PT 20회권/ }).click();
    const dialog = await openRuntimeDialog(page, "DLG-S003");
    for (const label of [
      "구매자",
      "상품 목록",
      "최종 결제 금액",
      "결제 수단",
      "영수증",
    ]) {
      await expect(dialog.getByText(label).first()).toBeVisible();
    }
    await expect(
      dialog.getByRole("button", { name: "결제 확정" }),
    ).toBeVisible();
  });

  test("중복 결제 경고 DLG-S004는 위험 조건과 확인 동선을 runtime-dialog로 검증한다", async ({
    page,
  }) => {
    const dialog = await openRuntimeDialog(page, "DLG-S004");
    await expect(dialog.getByText("중복 결제 경고").first()).toBeVisible();
    await expect(dialog.getByText(/중복|동일|경고/).first()).toBeVisible();
    await expect(
      dialog.getByRole("button", { name: /확인|계속|처리/ }),
    ).toBeVisible();
  });
});

test.describe("D03 결제 처리 주요 flow", () => {
  test.beforeEach(async ({ page }) => {
    await setOwnerContext(page);
    await openSalesRoute(page, "/sales/payment", "SCR-S003");
  });

  test("영수증 첨부 전에는 결제 등록이 차단되고 첨부 후 결제 완료 local state로 전환된다", async ({
    page,
  }) => {
    await expect(
      page.getByRole("button", { name: /결제 등록/ }),
    ).toBeDisabled();
    await page.getByRole("button", { name: "파일 첨부" }).click();
    await expect(page.getByText("첨부 완료").first()).toBeVisible({
      timeout: 3000,
    });
    await expect(page.getByRole("button", { name: /결제 등록/ })).toBeEnabled();
    await page.getByRole("button", { name: /결제 등록/ }).click();
    await expect(page.getByText("결제 등록 완료").first()).toBeVisible();
    await expect(page.getByText("매출 현황").last()).toBeVisible();
  });

  test("잔액 등록 선택과 금액 초과 입력은 경고 local state를 노출한다", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /잔액 등록/ }).click();
    await page.getByPlaceholder("1,150,000").fill("1300000");
    await expect(page.getByText(/원 금액.*초과/)).toBeVisible();
    await expect(page.getByRole("button", { name: /잔액 등록/ })).toBeVisible();
    await expect(page.getByTestId("mock-action-panel")).toHaveCount(0);
  });

  test("결제 처리의 구매자 검색/할부 등록 DLG는 route 안에서 runtime-dialog로 연결된다", async ({
    page,
  }) => {
    for (const dialogId of ["DLG-S002", "DLG-S009"] as const) {
      const dialog = await openRuntimeDialog(page, dialogId);
      await expect(dialog).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
    }
  });
});

test.describe("D03 환불/부분환불 flow", () => {
  test.beforeEach(async ({ page }) => {
    await setOwnerContext(page);
  });

  test("환불 관리는 요청/처리/상세 DLG와 정책 보류 상태를 runtime-dialog로 검증한다", async ({
    page,
  }) => {
    await openSalesRoute(page, "/sales/refunds", "SCR-S007");
    await expect(
      page.getByText(/정책 확인 필요|policy-pending/).first(),
    ).toBeVisible();
    for (const dialogId of ["DLG-S015", "DLG-S013", "DLG-S006"] as const) {
      const dialog = await openRuntimeDialog(page, dialogId);
      await expect(dialog).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
    }
  });

  test("결제 취소/부분 환불은 5단계 요구 중 검색→수기 입력→귀속 영향 흐름을 local state로 전환한다", async ({
    page,
  }) => {
    await openSalesRoute(page, "/sales/refund-partial", "SCR-S012");
    await expect(page.getByText(/Step 1 \/ 5/)).toBeVisible();
    await page.getByRole("button", { name: "다음 (수기 입력으로)" }).click();
    await expect(page.getByText(/Step 2 \/ 5/)).toBeVisible();
    await page.getByRole("button", { name: "전체 취소" }).click();
    await expect(page.getByRole("button", { name: "전체 취소" })).toBeVisible();
    await page.locator("table input").fill("600,000");
    await expect(page.getByTestId("mock-action-panel")).toHaveCount(0);
    await page.getByRole("button", { name: "다음 (귀속 영향)" }).click();
    await expect(page.getByText(/Step 3 \/ 5/)).toBeVisible();
    await expect(page.getByText("매출 차감액")).toBeVisible();
    await expect(page.getByText("600,000원").first()).toBeVisible();
  });

  test("부분환불 승인 요청과 Owner 처리 완료는 DLG-S015/DLG-S013 runtime-dialog를 연다", async ({
    page,
  }) => {
    await openSalesRoute(page, "/sales/refund-partial", "SCR-S012");
    await page.getByRole("button", { name: "Step 3" }).click();
    for (const dialogId of ["DLG-S015", "DLG-S013", "DLG-S014"] as const) {
      const dialog = await openRuntimeDialog(page, dialogId);
      await expect(dialog).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
    }
  });
});

test.describe("D03 미수/할부/세금계산서/예측 주요 flow", () => {
  test.beforeEach(async ({ page }) => {
    await setOwnerContext(page);
  });

  test("미수금 관리는 5탭 상태, 납입 처리 DLG-S008, 메모 편집 DLG-S005를 검증한다", async ({
    page,
  }) => {
    await openSalesRoute(page, "/sales/receivables", "SCR-S008");
    for (const tab of ["전체", "미결제", "일부결제", "연체", "완료"]) {
      await expect(
        page.getByRole("button", { name: tab }).first(),
      ).toBeVisible();
    }
    for (const dialogId of ["DLG-S008", "DLG-S005"] as const) {
      const dialog = await openRuntimeDialog(page, dialogId);
      await expect(dialog).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
    }
  });

  test("할부결제 관리는 계약 출처 3종과 상세/납입/등록 DLG를 검증한다", async ({
    page,
  }) => {
    await openSalesRoute(page, "/sales/installments", "SCR-S009");
    for (const source of ["현장 결제 연계", "미수금 전환", "직접 등록"]) {
      await expect(page.getByText(source).first()).toBeVisible();
    }
    for (const dialogId of ["DLG-S007", "DLG-S008", "DLG-S009"] as const) {
      const dialog = await openRuntimeDialog(page, dialogId);
      await expect(dialog).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
    }
  });

  test("세금계산서는 발행 폼/이력, 외부 연동 보류, 상세/발행 DLG를 검증한다", async ({
    page,
  }) => {
    await openSalesRoute(page, "/sales/tax-invoice", "SCR-S010");
    await expect(page.getByText(/외부 연동 확인 필요/).first()).toBeVisible();
    await page.getByRole("button", { name: "발행 (대상 + 폼)" }).click();
    await expect(page.getByText("사업자번호 *")).toBeVisible();
    await page.getByRole("button", { name: "발행 이력" }).click();
    await expect(page.getByText("발행 이력 (7컬럼)")).toBeVisible();
    for (const dialogId of ["DLG-S010", "DLG-S011"] as const) {
      const dialog = await openRuntimeDialog(page, dialogId);
      await expect(dialog).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
    }
  });

  test("매출 예측은 기간 탭, 목표 매출 설정 DLG-S012, side panel 연결을 검증한다", async ({
    page,
  }) => {
    await openSalesRoute(page, "/sales/forecast", "SCR-S011");
    for (const tab of ["다음 달", "다음 분기", "연간"]) {
      await expect(page.getByText(tab).first()).toBeVisible();
    }
    await page.getByRole("button", { name: "예측 기간" }).first().click();
    await expect(page.getByText("선택 매출 운영 패널")).toBeVisible();
    await expect(page.getByText("SCR-S011 · 매출 예측")).toBeVisible();
    await page.getByRole("button", { name: "닫기" }).click();
    const dialog = await openRuntimeDialog(page, "DLG-S012");
    await expect(dialog.getByText("목표 매출 설정").first()).toBeVisible();
  });
});
