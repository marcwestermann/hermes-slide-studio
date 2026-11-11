import { test, expect } from "@playwright/test";
import fs from "node:fs";
test("manual edit, selection proposal, reject accept undo, stale guard and PDF", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:18765");
  const headline = page.getByRole("textbox", { name: "headline", exact: true });
  await headline.fill("My deliberate headline");
  await headline.blur();
  await headline.click();
  await expect(page.getByLabel("Selected text")).toHaveText(
    "My deliberate headline",
  );
  await page.route("**/api/improve", (r) =>
    r.fulfill({ json: { text: "A clearer headline" } }),
  );
  await page
    .getByRole("button", { name: "Improve selection", exact: true })
    .click();
  await expect(page.getByLabel("Proposed replacement")).toHaveText(
    "A clearer headline",
  );
  await page.getByRole("button", { name: "Reject", exact: true }).click();
  await expect(headline).toHaveText("My deliberate headline");
  await page
    .getByRole("button", { name: "Improve selection", exact: true })
    .click();
  await page.getByRole("button", { name: "Accept", exact: true }).click();
  await expect(headline).toHaveText("A clearer headline");
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(headline).toHaveText("My deliberate headline");
  await headline.click();
  await page
    .getByRole("button", { name: "Improve selection", exact: true })
    .click();
  await page.getByLabel("Document palette").selectOption("paper");
  await page.getByRole("button", { name: "Accept", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Stale proposal");
  await page.screenshot({ path: "evidence/editor.png", fullPage: true });
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: "evidence/sample-deck.pdf",
    printBackground: true,
    preferCSSPageSize: true,
  });
});
test("real persistence and invalid input", async ({ request }) => {
  const get = await request.get("http://127.0.0.1:18765/api/deck");
  const current = get.ok() ? (await get.json()).revision : null;
  const document = {
    id: "test",
    revision: 0,
    theme: "ink",
    slides: [
      {
        id: "one",
        layout: "hero",
        headline: "Persisted manual edit",
        body: "<script>not executed</script>",
        kicker: "TEST",
      },
    ],
  };
  const save = await request.put("http://127.0.0.1:18765/api/deck", {
    data: { document, expectedRevision: current },
  });
  expect(save.ok()).toBeTruthy();
  expect(
    (await (await request.get("http://127.0.0.1:18765/api/deck")).json())
      .slides[0].headline,
  ).toBe("Persisted manual edit");
  expect(
    (
      await request.put("http://127.0.0.1:18765/api/deck", {
        data: { document, expectedRevision: current },
      })
    ).status(),
  ).toBe(409);
  document.slides.push(document.slides[0]);
  expect(
    (
      await request.put("http://127.0.0.1:18765/api/deck", {
        data: { document },
      })
    ).status(),
  ).toBe(422);
});
