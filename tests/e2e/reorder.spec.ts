import { expect, test } from "@playwright/test";
import { addPad, dragPadToPad, getSortablePad, gotoApp } from "./helpers";

test("reorders pads in reorder mode", async ({ page }) => {
  await gotoApp(page);
  await addPad(page, "Alpha");
  await addPad(page, "Beta");

  const padButtons = page.getByTestId("sound-pad-button");
  await expect(padButtons).toHaveText(["Alpha", "Beta"]);

  await page.getByTestId("reorder-mode-button").click();
  await dragPadToPad(
    page,
    getSortablePad(page, "Beta"),
    getSortablePad(page, "Alpha"),
  );

  await expect(padButtons).toHaveText(["Beta", "Alpha"]);
});
