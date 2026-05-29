import { expect, test, type Locator, type Page } from "@playwright/test";

async function assumeOwnerRole(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem("pando-role", "OWNER");
    window.localStorage.setItem("pando-branch", "강남점");
  });
}

async function gotoScreen(page: Page, route: string, screenId: string) {
  await page.goto(route);
  await expect(page.getByText(screenId, { exact: true }).first()).toBeVisible();
}

async function expectRuntimeDialog(
  page: Page,
  dialogId: string,
): Promise<Locator> {
  const dialog = page.getByTestId("runtime-dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText(dialogId);
  return dialog;
}

async function confirmRuntimeDialog(page: Page, actionName: RegExp | string) {
  await page
    .getByTestId("runtime-dialog")
    .getByRole("button", { name: actionName })
    .click();
  await expect(page.getByTestId("runtime-dialog")).toBeHidden();
}

test.beforeEach(async ({ page }) => {
  await assumeOwnerRole(page);
});

test.describe("회원관리 고급 하위 카테고리 E2E", () => {
  test("/members/transfer requires blocker acknowledgement and reason before DLG-M023 transfer confirmation", async ({
    page,
  }) => {
    await gotoScreen(page, "/members/transfer", "SCR-M005");

    const transferForm = page
      .getByPlaceholder("이관 사유 (선택, 10자 미만 시 경고)")
      .locator("xpath=ancestor::div[contains(@class, 'space-y-3')][1]");
    const confirmButton = transferForm.getByRole("button", {
      name: /^이관 확인$/,
    });
    await expect(page.getByText("사유 10자 이상: 0/10")).toBeVisible();
    await expect(confirmButton).toBeDisabled();

    await page.getByRole("button", { name: "잠실점" }).click();
    await expect(page.getByText("이관 대상 지점: 잠실점")).toBeVisible();
    await expect(
      page.getByRole("row", { name: /소속지점.*강남점.*잠실점.*Y/ }),
    ).toBeVisible();

    await page
      .getByPlaceholder("이관 사유 (선택, 10자 미만 시 경고)")
      .fill("회원 이사 요청에 따른 담당자와 정산 지점 재배정");
    await expect(page.getByText("사유 10자 이상: 충족")).toBeVisible();
    await expect(page.getByText("필수 차단 해소: 2건 남음")).toBeVisible();

    await page
      .getByText("미납금 80,000원")
      .locator("xpath=ancestor::label[1]")
      .getByRole("checkbox")
      .check();
    await page
      .getByText("락커 A-12 보유")
      .locator("xpath=ancestor::label[1]")
      .getByRole("checkbox")
      .check();
    await expect(page.getByText("필수 차단 해소: 완료")).toBeVisible();
    await expect(confirmButton).toBeEnabled();

    await confirmButton.click();
    const dialog = await expectRuntimeDialog(page, "DLG-M023");
    await expect(dialog).toContainText("재배정 표");
    await dialog
      .getByPlaceholder("회원 요청, 이사, 담당자 재배정 등")
      .fill("최종 이관 승인 사유 기록");
    await confirmRuntimeDialog(page, /^이관 확인$/);

    await expect(
      page.getByText(
        "김민준 → 잠실점 이관 검증 완료 · DLG-M023 최종 확인 대기",
      ),
    ).toBeVisible();
    await expect(page.getByText("이관 확인 처리 완료")).toBeVisible();
  });

  test("/body-composition switches member and graph filters, then records DLG-M015 body values with calculated state", async ({
    page,
  }) => {
    await gotoScreen(page, "/body-composition", "SCR-M006");

    const memberSelect = page
      .getByRole("combobox")
      .filter({ hasText: /김민준/ })
      .first();
    await memberSelect.click();
    await page.getByRole("option", { name: /박서연/ }).click();
    await expect(
      page
        .getByRole("combobox")
        .filter({ hasText: /박서연/ })
        .first(),
    ).toBeVisible();

    await page.getByRole("button", { name: "추이 분석" }).click();
    await expect(page.getByText("최근 3회 측정 시각화")).toBeVisible();
    for (const metric of ["체중", "골격근량", "체지방률"]) {
      await page.getByRole("button", { name: metric }).click();
    }
    await expect(page.getByText("지표를 1개 이상 선택해주세요.")).toBeVisible();

    await page.getByRole("button", { name: "측정 기록" }).click();
    await page.getByRole("button", { name: "측정 추가" }).first().click();
    const dialog = await expectRuntimeDialog(page, "DLG-M015");
    const numberInputs = dialog.locator('input[type="number"]');
    await numberInputs.nth(0).fill("67.9");
    await numberInputs.nth(1).fill("172");
    await numberInputs.nth(2).fill("30.1");
    await numberInputs.nth(3).fill("20.8");
    await expect(
      dialog.locator("text=BMI 자동").locator("xpath=.."),
    ).toContainText("23.0");
    await confirmRuntimeDialog(page, /^측정 등록$/);
    await expect(page.getByText("체성분 등록 처리 완료")).toBeVisible();
  });

  test("/members/merge enables destructive merge only after distinct primary and secondary selections and DLG-M028 confirmation", async ({
    page,
  }) => {
    await gotoScreen(page, "/members/merge", "SCR-M007");

    const mergeButton = page.getByRole("button", { name: /회원 병합 확인/ });
    await expect(mergeButton).toBeDisabled();

    await page
      .locator("button")
      .filter({ hasText: /김민준 · 010-1234-5678/ })
      .first()
      .click();
    await page
      .locator("button")
      .filter({ hasText: /박서연 · 010-2222-8899/ })
      .last()
      .click();
    await expect(
      page.getByRole("row", { name: /연락처.*010-1234-5678.*010-9876-5432/ }),
    ).toBeVisible();
    await expect(mergeButton).toBeEnabled();

    await mergeButton.click();
    const dialog = await expectRuntimeDialog(page, "DLG-M028");
    await expect(dialog).toContainText("이용권");
    await expect(dialog).toContainText("마일리지");
    await dialog.getByPlaceholder("병합확인").fill("병합확인");
    await confirmRuntimeDialog(page, /^병합 확정$/);
    await expect(page.getByText("회원 병합 확인 처리 완료")).toBeVisible();
  });

  test("/members/family changes active family group and runs DLG-M029 member-link search plus removal result state", async ({
    page,
  }) => {
    await gotoScreen(page, "/members/family", "SCR-M008");

    await page
      .getByRole("button", { name: /박씨 가족.*대표 박서연.*활성 3명/ })
      .click();
    await expect(page.getByText("박씨 가족 · 구성원")).toBeVisible();

    await page.getByRole("button", { name: /가족 연결/ }).click();
    const dialog = await expectRuntimeDialog(page, "DLG-M029");
    await dialog.getByPlaceholder("이름 또는 연락처").fill("김민준");
    await dialog.getByRole("button", { name: /검색/ }).click();
    await expect(page.getByText("가족 연결 검색 결과")).toBeVisible();
    await dialog
      .locator("button")
      .filter({ hasText: /김민준\(가족\).*010-0000-1111/ })
      .click();
    await expect(dialog).toContainText("선택됨");
    await confirmRuntimeDialog(page, /^선택 적용$/);
    await expect(page.getByText("가족 연결 처리 완료")).toBeVisible();
    await expect(page.getByTestId("mock-action-panel")).toHaveCount(0);
  });

  test("/members/segment supports builder preview, custom segment save, and DLG-M009 memo on an automatic segment", async ({
    page,
  }) => {
    await gotoScreen(page, "/members/segment", "SCR-M010");

    await page.getByRole("button", { name: "조건 빌더" }).click();
    await expect(
      page.getByText("최근 방문일(키오스크/수업/PT/수동)"),
    ).toBeVisible();
    await page.getByRole("button", { name: "미리보기" }).click();
    await expect(page.getByText("미리보기 완료 · 대상 86명")).toBeVisible();
    await expect(
      page.getByRole("row", { name: /박서연.*만료 18일 경과.*SMS 가능/ }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "저장" })).toBeEnabled();
    await page.getByRole("button", { name: "저장" }).click();
    await expect(
      page.getByText(
        "사용자 정의 세그먼트가 화면 상태에 저장되었습니다.",
      ),
    ).toBeVisible();
    await expect(
      page.getByRole("row", { name: /5월 이탈 회복 캠페인.*86.*검수 대기/ }),
    ).toBeVisible();
    await expect(page.getByTestId("mock-action-panel")).toHaveCount(0);

    await page.getByRole("button", { name: "자동 7종" }).click();
    const riskRow = page.getByRole("row", {
      name: /이탈위험\(자동\).*86.*매일\/이벤트/,
    });
    await expect(riskRow).toBeVisible();
    await riskRow.getByRole("button", { name: "메모" }).click();
    const dialog = await expectRuntimeDialog(page, "DLG-M009");
    await dialog
      .getByPlaceholder("메모 내용 입력")
      .fill("30일 미방문 자동 세그먼트 우선 상담 필요");
    await confirmRuntimeDialog(page, /^추가$/);
    await expect(page.getByText("메모 추가 처리 완료")).toBeVisible();
  });

  test("/members/edit invalidates phone changes, uses duplicate/address DLGs, blocks unsafe memo, and reports save states", async ({
    page,
  }) => {
    await gotoScreen(page, "/members/edit", "SCR-M003");

    await page.locator('input[value="김민준"]').fill("김민준수정");
    await page.locator('input[value="010-1234-5678"]').fill("010-1111-2222");
    await expect(
      page.getByText("연락처 변경 후 DLG-M006 중복 확인 필요"),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "다음" })).toBeDisabled();

    await page.getByRole("button", { name: "중복 확인" }).click();
    await expectRuntimeDialog(page, "DLG-M006");
    await confirmRuntimeDialog(page, /^강제 등록$/);
    await expect(
      page.getByText("전화번호 중복 안내 처리 완료"),
    ).toBeVisible();
    await expect(page.getByTestId("mock-action-panel")).toHaveCount(0);
    await page.getByRole("button", { name: "다음" }).click();
    await expect(page.getByText("Step 2 / 2")).toBeVisible();

    await page.getByRole("button", { name: "주소 검색" }).click();
    const addressDialog = await expectRuntimeDialog(page, "DLG-M027");
    await addressDialog
      .getByPlaceholder("도로명, 지번 또는 건물명")
      .fill("테헤란로 211");
    await addressDialog
      .locator("button")
      .filter({ hasText: "서울 강남구 테헤란로 211" })
      .click();
    await confirmRuntimeDialog(page, /^주소 선택$/);
    await expect(page.getByTestId("mock-action-panel")).toHaveCount(0);

    const memo = page.locator("textarea").first();
    await memo.fill("900101-1234567");
    await expect(
      page.getByText("주민번호 패턴은 저장할 수 없습니다."),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "저장" })).toBeDisabled();

    await memo.fill("재등록 상담 완료, 주소 및 연락처 변경 검증 완료");
    await expect(page.getByText(/\d+ \/ 500/)).toBeVisible();

    await page.getByLabel("저장 충돌(409) 시뮬레이션").check();
    await page.getByRole("button", { name: "저장" }).click();
    await expect(
      page.getByText("409 동시편집 감지 · 최신본 새로고침 후 다시 저장 필요"),
    ).toBeVisible();

    await page.getByLabel("저장 충돌(409) 시뮬레이션").uncheck();
    await page.getByRole("button", { name: "저장" }).click();
    await expect(page).toHaveURL(/\/members\/detail\/?\?memberId=10291&saved=1/);
    await expect(
      page.getByText("회원 상세", { exact: true }).first(),
    ).toBeVisible();
  });
});
