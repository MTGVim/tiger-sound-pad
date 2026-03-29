import { expect, test } from "@playwright/test";
import {
  acceptNextDialog,
  addPad,
  getPadButton,
  getPadCard,
  gotoApp,
} from "./helpers";

test.describe("Tiger Sound Pad app flows", () => {
  test("loads the app shell from the GitHub Pages base path", async ({
    page,
  }) => {
    await gotoApp(page);

    await expect(page.getByTestId("open-add-pad-modal")).toBeVisible();
    await expect(page.getByTestId("top-menu")).toBeVisible();
  });

  test("adds a pad through the modal form", async ({ page }) => {
    await gotoApp(page);
    await addPad(page, "Kick");

    await expect(getPadCard(page, "Kick")).toHaveAttribute(
      "data-pad-label",
      "Kick",
    );
  });

  test("shows playback state and can be stopped from the menu", async ({
    page,
  }) => {
    await gotoApp(page);
    await addPad(page, "Snare");

    const padButton = getPadButton(page, "Snare");
    await padButton.click({ force: true });

    await expect(padButton).toHaveAttribute("data-playing", "true");
    await expect(getPadCard(page, "Snare")).toHaveAttribute(
      "data-playing",
      "true",
    );

    await page.getByTestId("stop-sound-button").click();

    await expect(padButton).toHaveAttribute("data-playing", "false");
  });

  test("deletes a pad after confirm dialog acceptance", async ({ page }) => {
    await gotoApp(page);
    await addPad(page, "Delete Me");

    await page.getByTestId("delete-mode-button").click();
    acceptNextDialog(page);
    await getPadButton(page, "Delete Me").click({ force: true });

    await expect(getPadButton(page, "Delete Me")).toHaveCount(0);
  });
});
