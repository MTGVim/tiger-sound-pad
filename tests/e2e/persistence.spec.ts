import { expect, test } from "@playwright/test";
import {
  addPad,
  deletePad,
  expectPadLabels,
  getPadButton,
  gotoApp,
} from "./helpers";

test.describe("Tiger Sound Pad persistence flows", () => {
  test("loads the bundled default zip", async ({ page }) => {
    await gotoApp(page);

    await page.getByTestId("load-default-pads-button").click();

    await expect(getPadButton(page, "배틀")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId("sound-pad-button")).toHaveCount(57);
  });

  test("saves pads to zip and restores them through load", async ({ page }) => {
    await gotoApp(page);
    await addPad(page, "Save One");
    await addPad(page, "Save Two");

    const downloadPromise = page.waitForEvent("download");
    await page.getByTestId("save-pads-button").click();
    const download = await downloadPromise;
    const downloadPath = await download.path();

    if (!downloadPath) {
      throw new Error("Download path was not available");
    }

    await deletePad(page, "Save One");
    await deletePad(page, "Save Two");
    await expect(page.getByTestId("sound-pad-button")).toHaveCount(0);

    await page.getByTestId("load-pads-input").setInputFiles(downloadPath);

    await expectPadLabels(page, ["Save One", "Save Two"]);
  });

  test("rehydrates uploaded pads after reload", async ({ page }) => {
    await gotoApp(page);
    await addPad(page, "Reload Me");

    await page.reload();
    await expect(getPadButton(page, "Reload Me")).toBeVisible();

    const reloadedPad = getPadButton(page, "Reload Me");
    await reloadedPad.click({ force: true });
    await expect(reloadedPad).toHaveAttribute("data-playing", "true");
  });
});
